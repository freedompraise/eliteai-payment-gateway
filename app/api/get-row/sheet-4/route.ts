/*
This retrieves the referrals from user with specified ref id
*/
import { google, sheets_v4 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  const keyFileBase64 = process.env.GOOGLE_APP_CRED || "";
  const keyFileBuffer = Buffer.from(keyFileBase64, "base64");
  const keyFile = keyFileBuffer.toString("utf-8");

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(keyFile),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  /*@ts-ignore*/
  const sheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: authClient,
  });

  try {
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet4!A:O", // Assuming rows[0] is ID and rows[7] is Referrer
    });
    const getSheet2Response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet2!A:C", // Assuming rows[0] is ID and rows[7] is Referrer
    });

    const rows = getResponse.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    // Initialize a map to store referrer details and their referrals
    const referrerData: {
      referrer: string;
      referrals: Array<{ name: string; date: string }>;
    }[] = [];

    // Iterate over the rows and filter referrals for each referrer
    rows.forEach((row) => {
      const referrerId = row[0];
      const referrerName = row[1];
      const referralDate = row[13];

      const referrals = rows
        .filter((r) => r[14] === referrerId)
        .map((r) => ({
          name: r[1],
          date: r[13],
        }));

      // If the referrer already exists in the data, update its referrals
      const existingReferrer = referrerData.find(
        (r) => r.referrer === referrerName
      );
      if (existingReferrer) {
        existingReferrer.referrals.push(...referrals);
      } else {
        // Otherwise, add a new referrer entry
        if (referrals.length > 0) {
          referrerData.push({
            referrer: referrerName,
            referrals,
          });
        }
      }
    });

    console.log("ref data: ", referrerData);

    return NextResponse.json(referrerData); // Send the structured referrer data as the response
  } catch (error) {
    console.error("Error retrieving or updating sheet:", error);
    return NextResponse.json(
      { error: "Error processing data" },
      { status: 500 }
    );
  }
}
