import { google, sheets_v4 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { values, ref } = await request.json();

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
    // Retrieve existing sheet data (Sheet2 contains the email and course data)
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID || "",
      range: "Sheet4!A:O", // A:H covers ID, NAME, EMAIL, COURSE, COURSE_ID, DATE, PAYMENT_PLATFORM, REFERRER
    });

    const rows = getResponse.data.values;
    if (!rows) {
      return NextResponse.json(
        { error: "No data found in the sheet" },
        { status: 404 }
      );
    }

    // Check if the email already exists in the sheet
    const email = values[2]; // Assuming the email is at index 2 in the incoming `values`
    const existingRow = rows.find((row) => row[2] === email);

    if (existingRow) {
      console.log("found row: ", existingRow[6]);
      // If the email exists, update the course data (append the new course)
      const currentCourses = JSON.parse(existingRow[6] || "[]"); // COURSE data at index 3
      let newCourses: Set<string> = new Set(currentCourses);
      newCourses.add(JSON.parse(values[6])[0]); // Add the new course

      console.log("newCourses: ", newCourses, rows.indexOf(existingRow));

      // Update the row with the new course data
      const updateResponse = await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SHEET_ID || "",
        range: `Sheet4!G${rows.indexOf(existingRow) + 1}`, // Update the course column (D)
        valueInputOption: "RAW",
        requestBody: {
          values: [[JSON.stringify(Array.from(newCourses))]], // Update with stringified array
        },
      });

      return NextResponse.json({ message: "Course updated successfully" });
    } else {
      console.log("values", values);
      // If the email does not exist, insert the new row
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID || "",
        valueInputOption: "RAW",
        range: "Sheet4!A:O", // Append data to the sheet
        requestBody: {
          values: [values], // Insert the full row
        },
      });

      return NextResponse.json({ message: "New data inserted successfully" });
    }
  } catch (error) {
    console.error("Error processing sheet data:", error);
    return NextResponse.json(
      { error: "Error processing sheet data" },
      { status: 500 }
    );
  }
}
