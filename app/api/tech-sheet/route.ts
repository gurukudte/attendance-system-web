import connectToMongoDB from "@/config/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Assuming your model file is named `Sheet.ts`

export async function GET() {
  await connectToMongoDB();
  try {
    const sheets = await db.techSheetData.findMany();
    return NextResponse.json(sheets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sheets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectToMongoDB();
  try {
    const data = (await request.json()) as {
      technicianName: string;
      sheetID: string;
    };
    const existingSheet = await db.techSheetData.findMany({
      where: { technicianName: data.technicianName },
    });
    if (existingSheet.length > 0) {
      return NextResponse.json(
        { error: "Sheet already exists" },
        { status: 400 }
      );
    }
    const newSheet = await db.techSheetData.create({
      data: {
        technicianName: data.technicianName,
        sheetID: data.sheetID,
      },
    });
    return NextResponse.json({ message: "Sheet added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create sheet" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await connectToMongoDB();
  try {
    const id = request.nextUrl.searchParams.get("id");
    const data = await request.json();
    const updatedSheet = await db.techSheetData.update({
      where: { id: id ?? "" },
      data: { ...data },
    });
    if (!updatedSheet) {
      return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sheet updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update sheet" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await connectToMongoDB();
  try {
    const id = request.nextUrl.searchParams.get("id");
    const deletedSheet = await db.techSheetData.delete({
      where: { id: id ?? "" },
    });
    if (!deletedSheet) {
      return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sheet deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete sheet" },
      { status: 500 }
    );
  }
}
