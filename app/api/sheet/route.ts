import connectToMongoDB from "@/config/mongodb";
import { NextRequest, NextResponse } from "next/server";
import SheetData from "@/models/Sheet";
// Assuming your model file is named `Sheet.ts`

export async function GET() {
  await connectToMongoDB();
  try {
    const sheets = await SheetData.find({});
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
    const data = await request.json();
    const newSheet = new SheetData(data);
    await newSheet.save();
    return NextResponse.json({ message: "Sheet created successfully" });
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
    const deletedSheet = await SheetData.findByIdAndDelete(id);
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
