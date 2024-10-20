// app/api/update-sheet/route.ts
import affiliateEmailTemplate from "@/app/utils/affiliate_email_template";
import getEmailTemplate from "@/app/utils/email_template";
import { google, sheets_v4 } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { values, mail } = await request.json();

  const BASE_URL = `${request.url.split("/")[0]}//${request.url.split("/")[2]}`;

  console.log("host", request.url.split("/")[2]);

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
    const emailResponse = await fetch(`${BASE_URL}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: mail.email,
        subject: "Your Referral Code for the EliteAI Paid Externship",
        text: affiliateEmailTemplate("text", mail.name, mail.ref),
        html: affiliateEmailTemplate("html", mail.name, mail.ref),
      }),
    });

    console.log("email response: ", emailResponse);

    if (!emailResponse.ok) {
      return NextResponse.json(
        { error: "Could not send email" },
        { status: 500 }
      );
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID || "",
      valueInputOption: "RAW",
      range: "Sheet5!A:C",
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
