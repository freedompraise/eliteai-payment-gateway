import { isAfter, parse, subDays } from "date-fns";
import { google, sheets_v4 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const keyFileBase64 = process.env.GOOGLE_APP_CRED;
    const spreadsheetId = process.env.SHEET_ID;

    if (!keyFileBase64 || !spreadsheetId) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      );
    }

    const keyFile = Buffer.from(keyFileBase64, "base64").toString("utf-8");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(keyFile),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const authClient = await auth.getClient();
    const sheets: sheets_v4.Sheets = google.sheets({
      version: "v4",
      auth: authClient as any,
    });

    // Fetch data from both sheets
    const [getResponse, getResponse2] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Sheet1!A:N" }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: "Sheet2!A:C" }),
    ]);

    const rows = getResponse.data.values || [];
    const rows2 = getResponse2.data.values || [];

    if (rows.length === 0 || rows2.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const sixDaysAgo = subDays(new Date(), 6);
    const filteredRows = rows.filter((row) => {
      const rowDateStr = row[13];
      if (!rowDateStr) return false;
      const rowDate = parse(rowDateStr, "MMMM d, yyyy", new Date());
      return isAfter(rowDate, sixDaysAgo);
    });

    let data1: any[][] = [];
    let data2: any[][] = [];

    rows2.slice(1).forEach((r0) => {
      let referrerId = r0[0];
      let referrerName = r0[1];
      let referrerData = filteredRows.filter((r) => r[1] === referrerName);

      referrerData.forEach((val) => {
        let data = [referrerId, ...val.slice(1), ""];
        data1.push(data);
      });

      if (referrerData.length > 0) {
        try {
          JSON.parse(r0[2]).forEach((r1: any) => {
            let filtered = filteredRows.filter((r2) => r2[0] === r1);
            filtered.forEach((val) => {
              let data = [...val, referrerId];
              data2.push(data);
            });
          });
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    });

    let newData = mergeDuplicateSubArrays([...data1, ...data2]);

    return NextResponse.json(newData);
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function mergeDuplicateSubArrays(data: any[]) {
  const map = new Map();

  data.forEach((subarr: any[]) => {
    const email = subarr[2];
    const course = Array.isArray(subarr[6]) ? subarr[6] : [subarr[6]];

    if (map.has(email)) {
      let row = map.get(email);
      const mergedCourses = Array.from(
        new Set([...(Array.isArray(row[6]) ? row[6] : [row[6]]), ...course])
      );
      map.set(email, [...row.slice(0, 6), mergedCourses, ...row.slice(7)]);
    } else {
      map.set(email, [...subarr.slice(0, 6), course, ...subarr.slice(7)]);
    }
  });

  return Array.from(map.values());
}
