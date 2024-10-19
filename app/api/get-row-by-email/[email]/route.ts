/*
This checks if an email is part of the sheet storing users partakinig in free training
*/
import { google, sheets_v4 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  route: { params: { email: string } }
) {
  const email = route.params.email;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

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

  try {
    console.log("in here");

    // Get data from both Sheet1 and Sheet4
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet1!A:C",
    });
    const response2 = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet4!A:C",
    });

    // Extract rows from both responses
    const rows = response.data.values;
    const rows2 = response2.data.values;

    // Check if both sheets have data
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "No data found in Sheet1" },
        { status: 404 }
      );
    }
    if (!rows2 || rows2.length === 0) {
      return NextResponse.json(
        { error: "No data found in Sheet4" },
        { status: 404 }
      );
    }

    const combinedRows = [...rows, ...rows2];

    const row = combinedRows.find((row) => row[2] === email);

    if (!row) {
      return NextResponse.json({ error: "Row not found" }, { status: 404 });
    }

    return NextResponse.json(row);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
