// app/api/update-sheet/route.ts
import getEmailTemplate from "@/app/utils/email_template";
import { google, sheets_v4 } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { values, mail } = await request.json();

  const BASE_URL = `${request.url.split("/")[0]}//${request.url.split("/")[2]}`;

  console.log("host", request.url.split("/")[2]);

  const MAIL_STRING = `Dear ${mail.name},

  We are excited to have you as part of our Elite AI community. As an ambassador, you have the unique opportunity to share the benefits of our ELITE GLOBAL AI FREE TRAINING + INTERNSHIP PROGRAM services with your friends and family. By referring them, you help us grow our community and empower more people with AI knowledge.
  
  Here is your exclusive referral link:
  
  ${mail.ref}
  Share this link with anyone interested in participating in the ELITE GLOBAL AI FREE TRAINING + INTERNSHIP PROGRAM.
  
  Thank you for being a part of Elite AI and helping us spread the knowledge!
  
  Best regards,
  
  The Elite AI Team
  
  `;

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
        subject: "Your Elite AI Referral Link Is Here 🎉🎊",
        text: MAIL_STRING,
        html: getEmailTemplate(mail.name, mail.ref), // Optionally, you can include HTML content
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
      range: "Sheet2!A:C",
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
