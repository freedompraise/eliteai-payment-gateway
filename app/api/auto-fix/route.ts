import { isAfter, parse, subDays } from "date-fns";
import { google, sheets_v4 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function GET(request: NextRequest) {
  const keyFileBase64 = process.env.GOOGLE_APP_CRED || "";
  const keyFileBuffer = Buffer.from(keyFileBase64, "base64");
  const keyFile = keyFileBuffer.toString("utf-8");

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(keyFile),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const authClient = await auth.getClient();

  /*@ts-ignore*/
  const sheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: authClient,
  });

  const getResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID || "",
    range: "Sheet1!A:N",
  });

  const getResponse2 = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID || "",
    range: "Sheet2!A:C",
  });

  const rows = getResponse.data.values;
  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "No data found" }, { status: 404 });
  }

  const rows2 = getResponse2.data.values;
  if (!rows2 || rows2.length === 0) {
    return NextResponse.json(
      { error: "No data found for rows2" },
      { status: 404 }
    );
  }

  const sixDaysAgo = subDays(new Date(), 6);

  const filteredRows = rows.filter((row) => {
    const rowDateStr = row[13];

    const rowDate = parse(rowDateStr, "MMMM d, yyyy", new Date());

    return isAfter(rowDate, sixDaysAgo);
  });

  let refArr = rows2[2];

  let data1: any[][] = [];
  let data2: any[][] = [];

  rows2.slice(1).forEach((r0) => {
    let referrerId = r0[0];
    let referrerName = r0[1];
    let referrerData = filteredRows.filter((r) => r[1] == referrerName);
    referrerData.forEach((val) => {
      let data = [referrerId, ...val.splice(1), ""];
      //   console.log("in here", data);
      data1.push(data);
    });
    if (referrerData.length > 0) {
      //   console.log(referrerName, r0[2]);
      //   console.log("referrerData: ", referrerData);
      JSON.parse(r0[2]).forEach((r1: any) => {
        // console.log(r1);
        let filtered = filteredRows.filter((r2) => r2[0] == r1);

        filtered.forEach((val) => {
          let data = [...val, referrerId];
          data2.push(data);
        });

        // console.log("filteredCurrent: ", filtered);
      });
    }
  });

  //   console.log("data 1: ", data1);
  //   console.log("data 2: ", data2);

  let newData: any[][] = [];
  data1.forEach((data) => {
    let matchedData = data2.filter((r) => r[2] === data[2]);

    if (matchedData.length > 0) {
      //   console.log("Matching data found: ", matchedData);
      newData.push(...matchedData);
    } else {
      newData.push(data);
    }
  });

  newData = mergeDuplicateSubArrays(newData);
  console.log("new data: ", newData.slice(0, 9));

  let csvContent = convertToCSV(newData);
  let path = "/Users/macbook/Everything Programming/eliteai/data.csv";

  fs.writeFile(path, csvContent, (err: any) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("CSV file has been saved successfully.");
    }
  });
}

function mergeDuplicateSubArrays(data: any) {
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

  // Return the merged array
  return Array.from(map.values());
}

async function inputData1(values: any) {
  const response = await fetch("http://localhost:3000/api/update-sheet-4", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });
}

function convertToCSV(data: any[]) {
  const csvRows = data.map((row) => {
    const courses = Array.isArray(row[6]) ? `[${row[6].join(", ")}]` : row[6];

    const newRow = [
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
      courses,
      row[7],
      row[8],
      row[9],
      row[10],
      row[11],
      row[12],
      row[13],
      row[14],
    ];

    return newRow
      .map((field) => {
        if (typeof field === "string") {
          field = field.replace(/"/g, '""');

          if (
            field.includes(",") ||
            field.includes('"') ||
            field.includes("\n")
          ) {
            return `"${field}"`;
          }
        }
        return field;
      })
      .join(",");
  });

  const headers = [
    "ID",
    "NAME",
    "EMAIL",
    "PHONE NO",
    "COUNTRY",
    "AGE",
    "PROGRAMS",
    "YOUTUBE",
    "TWITTER",
    "LINKEDIN URL",
    "LINKEDIN",
    "FACEBOOK",
    "INSTAGRAM",
    "REG_DATE",
    "REFERRER",
  ];

  return [headers.join(","), ...csvRows].join("\n");
}

//make sure to put in all the data1 b4 data2
//check if already existing
//if it is update only the referrer id field (this is for only filteredCurrent-data2)
