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

  console.log("values: ", values);

  try {
    if (ref) {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID || "",
        valueInputOption: "RAW",
        range: "Sheet3!A:F",
        requestBody: {
          values: [[...values, ref]],
        },
      });
      return NextResponse.json(response.data);
    }
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID || "",
      valueInputOption: "RAW",
      range: "Sheet3!A:E",
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
