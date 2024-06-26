import { google, sheets_v4 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  route: { params: { id: string } }
) {
  const id = route.params.id;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
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
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet2!A:C",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const row = rows.find((row) => row[0] === id);
    if (!row) {
      return NextResponse.json({ error: "Row not found" }, { status: 404 });
    }

    const referrals = JSON.parse(row[2] || "[]");

    if (!Array.isArray(referrals) || referrals.length === 0) {
      return NextResponse.json({ data: row, referrals: [] });
    }

    const getUsersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet1!A:N",
    });

    const userData = getUsersResponse.data.values?.slice(1) || [];

    if (!userData || userData.length === 0) {
      return NextResponse.json(
        { error: "No user data found" },
        { status: 404 }
      );
    }

    // const data = [];

    const data = userData?.filter((user) => referrals.includes(user[0]));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error retrieving sheet:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
