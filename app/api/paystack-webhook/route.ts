import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Retrieve the body of the request (Paystack's form data)
    const body = await request.json();

    // Retrieve Paystack's signature from the request headers
    const paystackSignature = request.headers.get("x-paystack-signature");

    // Verify the webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY || ""; // Store your secret key in environment variables
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (hash === paystackSignature) {
      // The request is legitimate
      const event = body.event;

      if (event === "charge.success") {
        // Access specific details from the webhook data
        const { amount, customer, reference, status } = body.data;

        console.log(
          `Payment of ${amount} was successful for ${customer.email}`
        );

        // Perform any actions based on the data
        // e.g., update the database, send a confirmation email, etc.

        // Respond with 200 OK
        return NextResponse.json(
          { message: "Webhook received and processed" },
          { status: 200 }
        );
      } else {
        // Handle other event types, e.g., charge.failed
        return NextResponse.json(
          { message: `Event ${event} received but not charge.success` },
          { status: 200 }
        );
      }
    } else {
      // Invalid signature
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing webhook", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
