import welcomeEmailTemplate from "@/app/utils/welcome_email_template";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { mail } = await request.json();

  const BASE_URL = `${request.url.split("/")[0]}//${request.url.split("/")[2]}`;

  const MAIL_STRING = `Hello Dear,

  Thank you for applying to the Elite Global AI Free Training Program! We're thrilled to have you on board and eager to see you enhance your AI skills and expand your professional network.
  
  Exclusive Discount
  
  As a valued participant, you're eligible for a discounted onboarding fee of N16,000 ($10) instead of N24,000 ($15) for our Externship platform. This offer is only available to those who take the training.
  
  Be among the first 100 participants to pay the N16,000 ($10) Externship onboarding fee and receive N80,000 ($50) refund after the Externship Onboarding.
  
  Our Externship program is designed to build your professional experience and portfolio. This is an opportunity to join our Global workforce which has numerous benefits like:
  
  - To Gain hands-on experience
  - Enhance your skills
  - Expand your network
  
  Keep an eye on your inbox for:
  
  - Training schedule
  - Program materials
  - Relevant details
  
  Referral Opportunity
  
  Share the excitement! Use your unique referral link: ${mail.ref}
  
  Refer 10 people to the training program and get N1,000.
  
  Also, For each referral who pays the Externship onboarding fee, you'll earn a 20% commission
  
  Hit a milestone of 150 referrals who pay for the Externship Onboarding fee and receive N1,000,000 ($650).
  
  Pay the discounted onboarding fee and begin your Externship journey.
  
  Best regards,
  Elite Global AI Team`;

  const emailResponse = await fetch(`${BASE_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: mail.email,
      subject: "Welcome to the Elite Global AI Training Program 🎉🎊",
      text: MAIL_STRING,
      html: welcomeEmailTemplate(mail.name, mail.ref), // Optionally, you can include HTML content
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
