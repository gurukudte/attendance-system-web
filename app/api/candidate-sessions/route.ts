import connectToMongoDB from "@/config/mongodb";
import { NextRequest, NextResponse } from "next/server";
import SheetData from "@/models/CandidateSessions";
import CandidateSessions from "@/models/CandidateSessions";

export async function GET(request: NextRequest) {
  await connectToMongoDB();
  try {
    const candidateName = request.nextUrl.searchParams.get("candidateName");
    const date = request.nextUrl.searchParams.get("date");

    let query: any = {};
    if (candidateName) query.candidateName = candidateName;
    if (date) query.date = date;

    const sheets = await CandidateSessions.find(query);
    if (sheets.length === 0) {
      return NextResponse.json({ data: sheets }, { status: 404 });
    } else {
      return NextResponse.json({ data: sheets }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch candidate sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectToMongoDB();
  try {
    const data = await request.json();
    const newCandidateSession = new CandidateSessions(data);
    await newCandidateSession.save();
    return NextResponse.json(
      {
        data: newCandidateSession,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  await connectToMongoDB();
  try {
    const id = request.nextUrl.searchParams.get("id");
    const data = await request.json();
    const updatedSheet = await SheetData.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      {
        new: true,
      }
    );
    if (!updatedSheet) {
      return NextResponse.json(
        { error: "candidate session not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "candidate session updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update candidate session" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await connectToMongoDB();
  try {
    const id = request.nextUrl.searchParams.get("id");
    const deletedSheet = await SheetData.findByIdAndDelete(id);
    if (!deletedSheet) {
      return NextResponse.json(
        { error: "candidate session not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "candidate session deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete candidate session" },
      { status: 500 }
    );
  }
}
