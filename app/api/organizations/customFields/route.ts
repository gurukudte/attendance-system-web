import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const validatedId = z.string().min(1).parse(id);
  try {
    const fields = await db.customEmployeeFields.findMany({
      where: { orgId: validatedId },
    });
    return NextResponse.json(fields);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch custom fields" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const validatedId = z.string().min(1).parse(id);
  try {
    const data = await request.json();
    const field = await db.customEmployeeFields.create({
      data: {
        ...data,
        orgId: validatedId,
      },
    });
    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create custom field" },
      { status: 400 }
    );
  }
}
