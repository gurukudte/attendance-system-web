import mongoose, { Document, Schema } from "mongoose";

// Configuration constants
const DEFAULT_TIME = "00:00:00";

// TypeScript interface for VideoData
export interface VideoData {
  startTime: string | null;
  endTime: string | null;
  lastUpdated: string | null;
  notes: string;
}

// TypeScript interface for SessionData
export interface SessionsData {
  session: number | null;
  sessionId: string | null;
  highImpedance: string | null;
  lowImpedance: string | null;
  videos: VideoData[] | null;
  sheetUpdate: {
    lastUpdated: null | string;
    isUpdated: boolean;
  };
}

// TypeScript interface for the main schema document
export interface SessionDataDocument extends Document {
  candidateName: string | null;
  date: string | null;
  sessions: SessionsData[] | null;
}

// Define the VideoData schema
const VideoDataSchema = new Schema<VideoData>({
  startTime: { type: String, default: DEFAULT_TIME },
  endTime: { type: String, default: DEFAULT_TIME },
  lastUpdated: { type: String, default: null },
  notes: { type: String, default: "" },
});

// Define the SessionData schema
const CandidateSessionDataSchema = new Schema<SessionsData>({
  sessionId: { type: String },
  highImpedance: { type: String },
  lowImpedance: { type: String },
  videos: { type: [VideoDataSchema], default: [] },
  sheetUpdate: {
    lastUpdated: { type: String, default: null },
    isUpdated: { type: Boolean, default: false },
  },
});
const CandidateSessionsDataSchema = new Schema<SessionDataDocument>(
  {
    candidateName: { type: String, required: true },
    date: { type: String, required: true },
    sessions: { type: [CandidateSessionDataSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.CandidateSessions ||
  mongoose.model<SessionDataDocument>(
    "CandidateSessions",
    CandidateSessionsDataSchema
  );
