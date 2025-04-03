import mongoose, { Document, Schema } from "mongoose";

export interface ISheet extends Document {
  sheetName: string;
  sheetRange: string;
}

const SheetsDataSchema: Schema = new Schema({
  sheetName: { type: String, required: true },
  sheetRange: { type: String, required: true },
});

export default mongoose.models.SheetData ||
  mongoose.model<ISheet>("SheetData", SheetsDataSchema);
