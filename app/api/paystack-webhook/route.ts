import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

      // Log or process the custom fields
      customFields.forEach((field: { display_name: string; value: any }) => {
        console.log(`${field.display_name}: ${field.value}`);
      });

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
