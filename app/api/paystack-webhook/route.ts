import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import externshipEmailTemplate from "@/app/utils/externship_email_template";

let courses = [
  { code: "8010", course: "Education Externship" },
  { code: "8009", course: "IT Support Externship" },
  { code: "7970", course: "Project Management Externship" },
  {
    code: "7937",
    course: "Virtual Assistant Externship – Mastering Remote Support",
  },
  { code: "7936", course: "Community Management Externship" },
  { code: "7935", course: "Business Analysis Externship" },
  { code: "7934", course: "Data Analysis Externship" },
  { code: "7915", course: "Content Creation Externship" },
  { code: "7447", course: "Digital Marketing Externship" },
];

// Replace with your actual Paystack secret key from your environment
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await request.text(); // Get the raw text of the body
    const body = JSON.parse(rawBody); // Parse it as JSON

    // Retrieve the Paystack signature from headers
    const paystackSignature = request.headers.get("x-paystack-signature");
    if (!paystackSignature) {
      return NextResponse.json(
        { error: "Signature not found" },
        { status: 400 }
      );
    }

    // Create the HMAC-SHA512 hash of the raw body using your Paystack secret key
    const expectedSignature = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    // Compare the expected signature with the received signature
    if (paystackSignature !== expectedSignature) {
      console.error("Invalid signature:", paystackSignature);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Signature is valid, proceed to handle the webhook event
    if (body.event === "charge.success") {
      const data = body.data;

      // Access custom fields from metadata
      const customFields = data.metadata?.custom_fields || [];
      const referrer = data.metadata?.referrer;
      const customField = customFields.find(
        (field: any) => field.variable_name === "values"
      );

      if (customField) {
        const values = customField.value;
        const ref = values.splice(values.length - 1);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/update-sheet-3`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ values, ref }),
          }
        );

        if (response.ok) {
          let program = courses.find((course) => values[4] == course.code)
            ?.course;
          let text = externshipEmailTemplate(
            values[1],
            program ? program : "",
            `https://eliteai.vercel.app/paid_course?ref=${ref}`,
            "text"
          );
          await sendEmail(
            values[2],
            "Congratulations on Your Externship!",
            text,
            ref,
            values[1],
            program ? program : ""
          );
        }
      }

      //   // Log or process the custom fields
      //   customFields.forEach((field: { display_name: string; value: any }) => {
      //     console.log(`${field.display_name}: ${field.value}`);
      //   });

      // Return success response with custom fields
      return NextResponse.json({
        message: "Webhook received successfully",
        customFields,
        referrer,
      });
    } else {
      return NextResponse.json({ message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Invalid request body or internal error" },
      { status: 500 }
    );
  }
}

async function sendEmail(
  to: string,
  subject: string,
  text: string,
  ref: string,
  name: string,
  program: string
  // html: string
) {
  let html = externshipEmailTemplate(
    name,
    program,
    `https://eliteai.vercel.app/paid_course?ref=${ref}`,
    "html"
  );
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, text, html }),
    }
  );

  if (!response.ok) {
    // Handle errors accordingly
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send email");
  }

  const data = await response.json();
  return data;
}
