// app/api/update-sheet/route.ts
import { google, sheets_v4 } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { values, ref } = await request.json();

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
    if (ref) {
      const getResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID || "",
        range: "Sheet2!A:C",
      });

      const rows = getResponse.data.values;
      if (!rows) {
        return NextResponse.json(
          { error: "Reference not found" },
          { status: 404 }
        );
      }

      const row = rows.find((row) => row[0] === ref);
      if (!row) {
        return NextResponse.json(
          { error: "Reference not found" },
          { status: 404 }
        );
      }

      const referralArr = JSON.parse(row[2] || "[]");
      referralArr.push(values[0]);

      const updateResponse = await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SHEET_ID || "",
        range: `Sheet2!C${rows.indexOf(row) + 1}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[JSON.stringify(referralArr)]],
        },
      });
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID || "",
      valueInputOption: "RAW",
      range: "Sheet1!A:N",
      requestBody: {
        values: [values],
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error updating sheet:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
