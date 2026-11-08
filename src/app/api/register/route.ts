import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const apiRegistrationSchema = z.object({
  attendeeName: z.string().min(2),
  attendeeEmail: z.string().email(),
  attendeePhone: z.string().min(10),
  amount: z.coerce.number().min(10000),
  receiptUrl: z.string().min(1),
  eventType: z.enum(["AFTER_PARTY_ONLY", "PURPLE_BALL_AND_AFTER_PARTY"]),

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
    const body: unknown = await request.json();
    const validation = apiRegistrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid registration data submitted.",
          details: validation.error.format(),
        },
        { status: 400 },
      );
    }

    const data = validation.data;

    const existingBooking = await prisma.booking.findUnique({
      where: { attendeeEmail: data.attendeeEmail },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "An attendee with this email has already registered." },
        { status: 409 },
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        attendeeName: data.attendeeName,
        attendeeEmail: data.attendeeEmail,
        attendeePhone: data.attendeePhone,
        eventType: data.eventType,
        amount: data.amount,
        receiptUrl: data.receiptUrl,

        ...(data.eventType === "PURPLE_BALL_AND_AFTER_PARTY" &&
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
      { error: "Internal server error during registration." },
      { status: 500 },
    );
  }
}
