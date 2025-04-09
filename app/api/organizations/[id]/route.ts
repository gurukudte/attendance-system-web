import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  OrganizationResponse,
  organizationResponseSchema,
  organizationUpdateSchema,
  type OrganizationUpdateInput,
} from "@/lib/validators/organization";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const validatedId = z.string().min(1).parse(id);
    const organization = await db.organization.findUnique({
      where: { id: validatedId },
      include: {
        customEmployeeFields: true,
        apiKeys: true,
        adminUsers: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Transform dates to strings for validation
    const transformedOrg = {
      ...organization,
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
      apiKeys: organization.apiKeys?.map((key) => ({
        ...key,
        createdAt: key.createdAt.toISOString(),
      })),
      customEmployeeFields: organization.customEmployeeFields,
      adminUsers: organization.adminUsers,
    };

    // Validate response shape
    const validatedResponse: OrganizationResponse =
      organizationResponseSchema.parse(transformedOrg);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("[ORGANIZATION_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const validatedId = z.string().min(1).parse(id);

    // Validate input
    const jsonData = await request.json();

    const validatedData: OrganizationUpdateInput =
      organizationUpdateSchema.parse(jsonData);

    const updateData = {
      name: validatedData.name,
      timezone: validatedData.timezone,
      dateFormat: validatedData.dateFormat,
      ...(validatedData.customEmployeeFields && {
        customFields: {
          deleteMany: {},
          create: validatedData.customEmployeeFields,
        },
      }),
      ...(validatedData.apiKeys && {
        apiKeys: {
          deleteMany: {},
          create: validatedData.apiKeys,
        },
      }),
      ...(validatedData.adminUsers && {
        adminUsers: {
          deleteMany: {},
          create: validatedData.adminUsers.map((user) => ({
            name: user.name,
            email: user.email,
            role: user.role,
          })),
        },
      }),
    };

    const updatedOrganization = await db.organization.update({
      where: { id: validatedId },
      data: updateData,
      include: {
        customEmployeeFields: true,
        apiKeys: true,
        adminUsers: true,
      },
    });

    // Transform and validate response
    const transformedOrg = {
      ...updatedOrganization,
      createdAt: updatedOrganization.createdAt.toISOString(),
      updatedAt: updatedOrganization.updatedAt.toISOString(),
      apiKeys: updatedOrganization.apiKeys?.map((key) => ({
        ...key,
        createdAt: key.createdAt.toISOString(),
      })),
    };

    const validatedResponse: OrganizationResponse =
      organizationResponseSchema.parse(transformedOrg);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("[ORGANIZATION_PUT]", error);
    return NextResponse.json(
      {
        error: "Failed to update organization",
        ...(error instanceof Error && { details: error.message }),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const validatedId = z.string().min(1).parse(id);

    await db.organization.delete({
      where: { id: validatedId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid organization ID" },
        { status: 400 }
      );
    }

    console.error("[ORGANIZATION_DELETE]", error);
    return NextResponse.json(
      {
        error: "Failed to delete organization",
        ...(error instanceof Error && { details: error.message }),
      },
      { status: 500 }
    );
  }
}
