import welcomeEmailTemplate from "@/app/utils/welcome_email_template";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { mail } = await request.json();

  const BASE_URL = `${request.url.split("/")[0]}//${request.url.split("/")[2]}`;

  console.log("host", request.url.split("/")[2]);

  const MAIL_STRING = `Hello ${mail.name},
  
  Thank you for applying for the Elite Global AI Free Training Program. We are excited to have you on board as you embark on this journey to enhance your AI skills and expand your professional network.
  
  To get access to our Externship platform, you're required to pay $10 instead of $15 onboarding fee. This discount is only applicable to those that take the training.
  
  Join our Global Workforce by taking the Externship program aimed at building your professional experience and portfolio.
  
  Please keep an eye on your inbox, as we will be sending important updates and further information about the training schedule, program materials and other relevant details soon.
  
  If you have any questions, feel free to reach out to us.
  
  We look forward to seeing you in the training.
  
  `;

  const emailResponse = await fetch(`${BASE_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: mail.email,
      subject: "Welcome to the Elite Global AI Training Program 🎉🎊",
      text: MAIL_STRING,
      html: welcomeEmailTemplate(mail.name), // Optionally, you can include HTML content
    }),
  });

  console.log("email response: ", emailResponse);

  if (!emailResponse.ok) {
    console.log("Could not send welcome email.");
    return NextResponse.json(
      { error: "Could not send email" },
      { status: 500 }
    );
  }

  console.log("Welcome email sent successfully");
  return NextResponse.json({ status: 200 });
}
