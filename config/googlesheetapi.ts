import { GoogleAuth } from "google-auth-library";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const auth = new GoogleAuth({});
