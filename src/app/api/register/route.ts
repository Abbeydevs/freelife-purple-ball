import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const apiRegistrationSchema = z.object({
  attendeeName: z.string().min(2),
  attendeeEmail: z.string().email(),
  attendeePhone: z.string().min(10),
  eventType: z.enum(["AFTER_PARTY_ONLY", "PURPLE_BALL_AND_AFTER_PARTY"]),
  amount: z.coerce.number().min(10000),
  receiptUrl: z.string().min(1),

  isPlusOneReady: z.boolean().optional(),
  parentId: z.string().optional(),

  plusOneName: z.string().optional(),
  plusOneEmail: z.string().optional(),
  plusOnePhone: z.string().optional(),
  isFreelifer: z.boolean().optional().default(false),

  primaryGuestName: z.string().optional(),
  primaryGuestEmail: z.string().optional(),
  primaryGuestPhone: z.string().optional(),
  plusOneGuestName: z.string().optional(),
  plusOneGuestEmail: z.string().optional(),
  plusOneGuestPhone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const eventSettings = await prisma.eventSettings.findUnique({
      where: { id: "global" },
    });
    if (eventSettings && !eventSettings.isRegistrationOpen) {
      return NextResponse.json(
        { error: "Registration is currently closed." },
        { status: 403 },
      );
    }

    const body: unknown = await request.json();
    const validation = apiRegistrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data." }, { status: 400 });
    }

    const data = validation.data;

    const existingBooking = await prisma.booking.findUnique({
      where: { attendeeEmail: data.attendeeEmail },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 },
      );
    }

    const needsInviteToken =
      data.eventType === "PURPLE_BALL_AND_AFTER_PARTY" &&
      data.isPlusOneReady === false &&
      !data.parentId;

    const inviteToken = needsInviteToken
      ? crypto.randomBytes(6).toString("hex")
      : null;

    const newBooking = await prisma.booking.create({
      data: {
        attendeeName: data.attendeeName,
        attendeeEmail: data.attendeeEmail,
        attendeePhone: data.attendeePhone,
        eventType: data.eventType,
        amount: data.amount,
        receiptUrl: data.receiptUrl,
        inviteToken: inviteToken,
        parentId: data.parentId || null,

        ...(data.eventType === "PURPLE_BALL_AND_AFTER_PARTY" &&
          data.isPlusOneReady &&
          data.plusOneName && {
            plusOne: {
              create: {
                name: data.plusOneName,
                email: data.plusOneEmail || "",
                phone: data.plusOnePhone || "",
                isFreelifer: data.isFreelifer,
              },
            },
          }),

        ...(data.eventType === "PURPLE_BALL_AND_AFTER_PARTY" &&
          data.isFreelifer &&
          data.primaryGuestName &&
          data.plusOneGuestName && {
            invitedGuests: {
              create: [
                {
                  name: data.primaryGuestName,
                  email: data.primaryGuestEmail || "",
                  phone: data.primaryGuestPhone || "",
                  invitedByRole: "PRIMARY",
                },
                {
                  name: data.plusOneGuestName,
                  email: data.plusOneGuestEmail || "",
                  phone: data.plusOneGuestPhone || "",
                  invitedByRole: "PLUS_ONE",
                },
              ],
            },
          }),
      },
    });

    return NextResponse.json(
      {
        message: "Registration successful. Pending verification.",
        bookingId: newBooking.id,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("[API_REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
