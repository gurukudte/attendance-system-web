import { google } from "googleapis";
import { sheets, sheets_v4 } from "googleapis/build/src/apis/sheets";
import { NextResponse } from "next/server";

export const getGoogleServiceAccount = () => {
  // Load and decode service account credentials
  const encodedCredentials =
    process.env.GOOGLE_APPLICATION_CREDENTIAls_ENCODED_BASE64;
  if (!encodedCredentials) {
    throw new Error("Missing service account credentials");
  }

  const decodedString = Buffer.from(encodedCredentials, "base64").toString(
    "utf-8"
  );
  const credentials = JSON.parse(decodedString);

  // Authenticate with Google Sheets API
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
};

export const getLastUpdatedRowAndColumn = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string,
  sheetRange: string
) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${sheetRange}`,
  });
  const rows = response.data.values || [];
  let lastRow = 0;
  let lastColumn = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].some((cell) => cell !== null && cell !== "")) {
      lastRow = i + 1;
      lastColumn = Math.max(lastColumn, rows[i].length);
    }
  }
  return { lastRow, lastColumn };
};

const updateFeedback = async () => {};
