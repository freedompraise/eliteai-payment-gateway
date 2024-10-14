import { google, sheets_v4 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const keyFileBase64 = process.env.GOOGLE_APP_CRED || "";
  const keyFileBuffer = Buffer.from(keyFileBase64, "base64");
  const keyFile = keyFileBuffer.toString("utf-8");

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(keyFile),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const authClient = await auth.getClient();

  /*@ts-ignore*/
  const sheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: authClient,
  });

  console.log("env data: ", process.env.SHEET_ID, keyFile);

  try {
    console.log("Fetching data from Sheet2");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet2!A:C",
    });

    const rows = response.data.values;
    console.log("Rows from Sheet2:", rows);
    if (!rows || rows.length === 0) {
      console.log("No data found in Sheet2");
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    console.log("Fetching data from Sheet1");
    const getUsersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet1!A:N",
    });

    const userData = getUsersResponse.data.values?.slice(1) || [];
    console.log("User data from Sheet1:", userData);

    if (!userData || userData.length === 0) {
      console.log("No user data found in Sheet1");
      return NextResponse.json(
        { error: "No user data found" },
        { status: 404 }
      );
    }

    const data: {
      referrer: string;
      referrals: Array<{ name: string; date: string }>;
    }[] = [];

    rows.slice(1).forEach((row) => {
      const users = userData.filter(
        (user) => row[2] && row[2].includes(user[0])
      );
      const users_obj: Array<{ name: string; date: string }> = [];
      users.forEach((user) =>
        users_obj.push({ name: user[1], date: user[13] })
      );
      data.push({
        referrer: row[1],
        referrals: users_obj,
      });
    });

    console.log("Processed data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error retrieving sheet:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
