import GaxiosResponse, { google } from "googleapis";
import { NextResponse } from "next/server";
import { getGoogleServiceAccount, getLastUpdatedRowAndColumn } from "./helpers";

export interface UpdateSheetRequest {
  action: "updateTimings" | "updateFeedback";
  isSheetUpdated: boolean;
  todayStartRange: number;
  startRange: number;
  endRange: number;
  candidateName: string;
  values: (string | number | null)[][];
  spreadsheetId: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spreadsheetId = searchParams.get("spreadsheetId");
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    const auth = getGoogleServiceAccount();
    const sheets = google.sheets({ version: "v4", auth });
    try {
      const sheetData = await sheets.spreadsheets.get({ spreadsheetId });

      const sheetNames =
        sheetData.data.sheets?.map((sheet) => sheet.properties?.title) || [];
      const filteredSheetNames = sheetNames.filter(
        (sheetName) => sheetName !== "Feedbacks"
      );
      return NextResponse.json({ data: filteredSheetNames });
    } catch (error) {
      return NextResponse.json(
        { error: "Service account does not have access to this sheet" },
        { status: 403 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UpdateSheetRequest;
    const {
      isSheetUpdated,
      todayStartRange,
      candidateName,
      startRange,
      endRange,
      values,
      spreadsheetId,
      action,
    } = body;
    if (!candidateName || !values || !action || !spreadsheetId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    const auth = getGoogleServiceAccount();

    const sheets = google.sheets({ version: "v4", auth });

    // Test if service account has access
    try {
      await sheets.spreadsheets.get({ spreadsheetId });
    } catch (error) {
      return NextResponse.json(
        { error: "Service account does not have access to this sheet" },
        { status: 403 }
      );
    }

    if (action === "updateTimings") {
      const { lastRow } = await getLastUpdatedRowAndColumn(
        sheets,
        spreadsheetId,
        candidateName,
        "A:J"
      );
      console.log("lastRow", lastRow);
      const defaultStartRange = lastRow === 0 ? 2 : lastRow + 1;

      const range = `${candidateName}!A${
        isSheetUpdated
          ? todayStartRange + startRange
          : defaultStartRange + startRange
      }:J${
        isSheetUpdated
          ? todayStartRange + endRange
          : defaultStartRange + endRange
      }`;

      console.log("range", range);
      // Update sheet values
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: { values },
      });

      return NextResponse.json({
        message: "Sheet updated successfully",
        response: {
          lastRow: isSheetUpdated ? todayStartRange : defaultStartRange,
        },
      });
    } else if (action === "updateFeedback") {
      const sheetData = await sheets.spreadsheets.get({ spreadsheetId });

      const sheetNames =
        sheetData.data.sheets?.map((sheet) => sheet.properties?.title) || [];

      if (!sheetNames.includes("Feedbacks")) {
        // Create a new sheet named "Feedback"
        try {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: "Feedbacks",
                    },
                  },
                },
              ],
            },
          });
          const initialRange = `Feedbacks!B1:B18`;
          // Update the "Feedback" sheet with the provided values
          const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: initialRange,
            valueInputOption: "RAW",
            requestBody: { values },
          });
          return NextResponse.json({
            message: "Feedback sheet updated successfully",
            response: response.data,
          });
        } catch (error) {
          console.error("Error creating new sheet:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }
      } else {
        try {
          // Get the last updated row and column

          const { lastColumn } = await getLastUpdatedRowAndColumn(
            sheets,
            spreadsheetId,
            "Feedbacks",
            "A:Z"
          );

          const getColumnLetter = (columnNumber: number) => {
            let letter = "";
            while (columnNumber > 0) {
              let remainder = (columnNumber - 1) % 26;
              letter = String.fromCharCode(65 + remainder) + letter;
              columnNumber = Math.floor((columnNumber - 1) / 26);
            }
            return letter;
          };
          const nextColumn = lastColumn + 1; // Move to the next available column
          const columnLetter = getColumnLetter(nextColumn);
          const range = `Feedbacks!${columnLetter}1:${columnLetter}18`;
          console.log("range", range);

          // Update the "Feedback" sheet with the provided values
          const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values },
          });
          console.log(
            `Feedbacks!${getColumnLetter(lastColumn + 1) + 1}:${
              getColumnLetter(lastColumn + 1) + 18
            }`
          );
          return NextResponse.json({
            message: "Feedback sheet updated successfully",
            response: response.data,
          });
        } catch (error) {
          console.error("Error updating new sheet:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }
      }
    }
  } catch (error: any) {
    console.error("Error updating Google Sheet:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
