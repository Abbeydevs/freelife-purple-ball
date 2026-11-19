import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing invite token" },
        { status: 400 },
      );
    }

    const parentBooking = await prisma.booking.findUnique({
      where: { inviteToken: token },
      select: { id: true, attendeeName: true },
    });

    if (!parentBooking) {
      return NextResponse.json(
        { error: "Invalid or expired invite link." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        inviterName: parentBooking.attendeeName,
        parentId: parentBooking.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[INVITE_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
