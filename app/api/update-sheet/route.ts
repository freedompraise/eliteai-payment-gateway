// app/api/update-sheet/route.ts
import { google, sheets_v4 } from "googleapis";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function POST(request: Request) {
  const { values } = await request.json();

  const keyFile = path.join(process.cwd(), process.env.GOOGLE_APP_CRED || "");

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  /*@ts-ignore*/
  const sheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: authClient,
  });

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID || "",
      valueInputOption: "RAW",
      range: "Sheet1!A:E",
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
