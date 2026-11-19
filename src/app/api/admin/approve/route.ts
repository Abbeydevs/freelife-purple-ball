import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const approvalSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_authenticated")?.value;

    if (isAdmin !== "true") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const validation = approvalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid booking ID submitted" },
        { status: 400 },
      );
    }

    const { bookingId } = validation.data;

    const headersList = await headers();
    const host = headersList.get("host") || "thesoftwartehub.tech";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const qrToken = crypto.randomBytes(4).toString("hex").toUpperCase();

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "APPROVED",
        qrToken: qrToken,
      },
      select: {
        attendeeName: true,
        attendeeEmail: true,
        eventType: true,
        inviteToken: true,
      },
    });

    const eventName =
      updatedBooking.eventType === "PURPLE_BALL_AND_AFTER_PARTY"
        ? "Purple Ball & After Party"
        : "Freelife After Party";

    const plusOneSection = updatedBooking.inviteToken
      ? `
        <div style="margin-top: 40px; padding: 25px; background-color: #1a0b2e; border: 1px dashed #c026d3; border-radius: 16px; text-align: center;">
          <h3 style="color: #f472b6; margin-top: 0; text-transform: uppercase; font-size: 13px; letter-spacing: 2px;">Your Plus-One Invite Link</h3>
          <p style="font-size: 14px; color: #d4d4d8; font-weight: 300; line-height: 1.5;">
            Send this private link to your Plus One when they are ready. It will automatically pair their registration with yours.
          </p>
          <div style="margin-top: 15px; padding: 15px; background-color: #0B0410; border-radius: 8px; word-break: break-all;">
            <a href="${baseUrl}/register?ref=${updatedBooking.inviteToken}" style="color: #c084fc; font-weight: bold; text-decoration: none; font-size: 14px;">
              ${baseUrl}/register?ref=${updatedBooking.inviteToken}
            </a>
          </div>
        </div>
      `
      : "";

    await resend.emails.send({
      from: "Freelife Executive <tickets@thesoftwarehub.tech>",
      to: updatedBooking.attendeeEmail,
      subject: `Your Gate Pass for the ${eventName} 🥂`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0410; color: #f4f4f5; padding: 40px; border-radius: 20px; border: 1px solid #3b0764;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c026d3; margin: 0; font-weight: 300; text-transform: uppercase; letter-spacing: 2px;">Invitation Confirmed</h1>
          </div>
          
          <p style="font-size: 16px; color: #d4d4d8; font-weight: 300;">Dear ${updatedBooking.attendeeName},</p>
          <p style="font-size: 16px; color: #d4d4d8; font-weight: 300; line-height: 1.6;">
            Your support contribution has been successfully verified. You are officially on the guest list for the <strong>${eventName}</strong>.
          </p>
          
          <div style="background-color: #160B24; padding: 30px; border-radius: 16px; text-align: center; margin: 40px 0; border: 1px solid #a855f7;">
            <p style="font-size: 12px; color: #c084fc; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">Your Gate Access Token</p>
            <h2 style="font-family: monospace; font-size: 36px; color: #ffffff; letter-spacing: 8px; margin: 0; font-weight: 400;">${qrToken}</h2>
          </div>
          
          <p style="font-size: 14px; color: #a1a1aa; text-align: center; font-weight: 300; line-height: 1.5;">
            Please present this 8-character token at the entrance. <br/>We look forward to celebrating 7 years of impact with you.
          </p>

          ${plusOneSection}
        </div>
      `,
    });

    return NextResponse.json(
      {
        message: "Registration approved and Gate Token emailed.",
        qrToken: qrToken,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("[APPROVE_BOOKING_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to approve booking and send email." },
      { status: 500 },
    );
  }
}
