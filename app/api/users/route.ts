import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import authOptions from "@/auth.config"; // Use the same auth import as middleware
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  // Get authentication details from the middleware
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await db.user.findMany();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
