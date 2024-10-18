import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Make sure you're parsing the JSON body properly
    console.log(body); // Log the body to see if it's parsed correctly
  } catch (error) {
    console.error("Error parsing JSON", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
