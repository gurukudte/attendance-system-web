// /app/api/employee/route.ts
import {
  employeeSchema,
  employeeArraySchema,
  EmployeeInput,
  EmployeeArrayInput,
} from "@/lib/validators/employee";
import { PrismaClient, Employee, Organization } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Initialize Prisma client
const prisma = new PrismaClient();

// Type definitions
interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Employee response type without sensitive fields
type SafeEmployee = Pick<
  Employee,
  "id" | "name" | "orgId" | "createdAt" | "updatedAt"
>;

export async function GET(): Promise<
  NextResponse<ApiResponse<SafeEmployee[]>>
> {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        orgId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: employees,
      message: "Employees fetched successfully",
    });
  } catch (error) {
    console.error("[EMPLOYEE_FETCH_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employees",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<SafeEmployee | SafeEmployee[]>>> {
  try {
    const body = await req.json();
    const isArray = Array.isArray(body);

    // Type-safe orgId extraction
    let orgId: string;
    if (isArray) {
      // We know validated is an array here
      const employeesArray = employeeArraySchema.parse(body);
      if (employeesArray.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "At least one employee is required",
          },
          { status: 400 }
        );
      }
      orgId = employeesArray[0].orgId;
    } else {
      // We know validated is a single object here
      const employee = employeeSchema.parse(body);
      orgId = employee.orgId;
    }

    // Rest of your code remains the same...
    const orgExists = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!orgExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid organization ID",
        },
        { status: 400 }
      );
    }

    // Handle creation with proper typing
    const result = isArray
      ? await createMultipleEmployees(employeeArraySchema.parse(body))
      : await createSingleEmployee(employeeSchema.parse(body));

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: isArray
          ? `${
              employeeArraySchema.parse(body).length
            } employees created successfully`
          : "Employee created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // Error handling remains the same
    console.error("[EMPLOYEE_CREATE_ERROR]", error);

    if (error instanceof Error && "errors" in error) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create employee(s)",
        details: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

// Helper functions with proper typing
async function createSingleEmployee(
  data: EmployeeInput
): Promise<SafeEmployee> {
  return await prisma.employee.create({
    data: { ...data, email: data.email || "" },
  });
}

async function createMultipleEmployees(
  data: EmployeeArrayInput
): Promise<SafeEmployee[]> {
  return await prisma.$transaction(
    data.map((employee) =>
      prisma.employee.create({
        data: { ...employee, email: employee.email || "" },
      })
    )
  );
}
