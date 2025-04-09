// /app/api/employee/[id]/route.ts
import { employeeSchema } from "@/lib/validators/employee";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const orgId = request.nextUrl.pathname.split("/").pop();
  try {
    const employee = await prisma.employee.findMany({
      where: { orgId },
    });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const body = await req.json();
    const validated = employeeSchema.partial().parse(body); // allow partial update

    const updated = await prisma.employee.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Error && "errors" in error) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  try {
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Employee deleted" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
