import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  organizationCreateSchema,
  OrganizationCreateInput,
} from "@/lib/validators/organization";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();

    // Validate with Zod
    const validatedData: OrganizationCreateInput =
      organizationCreateSchema.parse(jsonData);

    // Create organization with Prisma
    const organization = await db.organization.create({
      data: {
        name: validatedData.name,
        timezone: validatedData.timezone,
        dateFormat: validatedData.dateFormat,
        customEmployeeFields: validatedData.customEmployeeFields
          ? {
              create: validatedData.customEmployeeFields,
            }
          : undefined,
        apiKeys: validatedData.apiKeys
          ? {
              create: validatedData.apiKeys,
            }
          : undefined,
        adminUsers: validatedData.adminUsers
          ? {
              connectOrCreate: validatedData.adminUsers.map((user) => ({
                where: { email: user.email },
                create: user,
              })),
            }
          : undefined,
      },
      include: {
        customEmployeeFields: true,
        apiKeys: true,
        adminUsers: true,
      },
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Organization creation failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
