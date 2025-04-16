import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Zod Schemas
const scheduleSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  employee_name: z.string().min(1, "Employee name is required"),
  position: z.string().min(1, "Position is required"),
  date: z.string().datetime({ offset: true }),
  shift: z.string().min(1, "Shift is required"),
  location: z.string().min(1, "Location is required"),
  onLeave: z.boolean(),
});

const updateSchema = scheduleSchema.partial().extend({
  id: z.string().min(1, "Schedule ID is required"),
});

// GET all schedules by date and organization
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const orgId = searchParams.get("orgId");
    const inputSchema = z.object({
      date: z.string().datetime({ offset: true }),
      orgId: z.string().min(1, "Organization ID is required"),
    });

    const validatedInput = inputSchema.parse({
      date,
      orgId,
    });
    const inputDate = new Date(validatedInput.date); // assuming date is '2025-04-14'
    const startOfDay = new Date(inputDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const schedules = await db.employeeSchedule.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        orgId: validatedInput.orgId,
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map((e) => e.message).join(", "), 400);
    }
    return errorResponse("Failed to fetch schedules", 500);
  }
}

// POST create new schedule
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = scheduleSchema.parse(body);

    const newSchedule = await db.employeeSchedule.create({
      data: {
        ...validatedData,
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map((e) => e.message).join(", "), 400);
    }
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return errorResponse(
        "Schedule conflict: employee already has a shift at this time",
        409
      );
    }
    return errorResponse("Failed to create schedule", 500);
  }
}

// PUT update schedule
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = updateSchema.parse(body);
    const { id, ...apiData } = validatedData;
    const updatedSchedule = await db.employeeSchedule.update({
      where: { id: validatedData.id },
      data: {
        ...apiData,
      },
    });
    return NextResponse.json(updatedSchedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map((e) => e.message).join(", "), 400);
    }
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return errorResponse("Schedule not found", 404);
    }
    return errorResponse("Failed to update schedule", 500);
  }
}

// DELETE schedule
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const inputSchema = z.object({
      id: z.string().min(1, "Schedule ID is required"),
    });

    const validatedInput = inputSchema.parse({ id });

    await db.employeeSchedule.delete({
      where: {
        id: validatedInput.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors.map((e) => e.message).join(", "), 400);
    }
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return errorResponse("Schedule not found", 404);
    }
    return errorResponse("Failed to delete schedule", 500);
  }
}

// Helper function with proper typing
const errorResponse = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};
