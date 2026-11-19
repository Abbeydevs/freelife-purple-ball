import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import AdminDashboardClient, {
  type AdminTicketGroup,
} from "./AdminDashboardClient";

async function DashboardDataFetcher() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_authenticated")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const bookingsRaw = await prisma.booking.findMany({
    where: {
      parentId: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      plusOne: true,
      plusOneBooking: true,
      invitedGuests: true,
    },
  });

  const bookings: AdminTicketGroup[] = bookingsRaw.map((booking) => {
    let plusOneData = null;

    if (booking.plusOne) {
      plusOneData = {
        name: booking.plusOne.name,
        phone: booking.plusOne.phone,
        isFreelifer: booking.plusOne.isFreelifer,
        status: booking.status,
        receiptUrl: null,
      };
    } else if (booking.plusOneBooking && booking.plusOneBooking.length > 0) {
      const linkedPlusOne = booking.plusOneBooking[0];
      const isFreelifer = linkedPlusOne.amount > 0;
      plusOneData = {
        name: linkedPlusOne.attendeeName,
        phone: linkedPlusOne.attendeePhone,
        isFreelifer: isFreelifer,
        status: linkedPlusOne.status,
        receiptUrl: linkedPlusOne.receiptUrl,
        bookingId: linkedPlusOne.id,
      };
    }

    const primaryAmount = booking.amount;
    const linkedPlusOneAmount =
      booking.plusOneBooking && booking.plusOneBooking.length > 0
        ? booking.plusOneBooking[0].amount
        : 0;
    const totalGroupAmount = primaryAmount + linkedPlusOneAmount;

    return {
      primary: {
        id: booking.id,
        attendeeName: booking.attendeeName,
        attendeeEmail: booking.attendeeEmail,
        attendeePhone: booking.attendeePhone,
        amount: booking.amount,
        receiptUrl: booking.receiptUrl,
        eventType: booking.eventType,
        status: booking.status,
      },
      plusOne: plusOneData,
      totalAmount: totalGroupAmount,
      invitedGuests: booking.invitedGuests.map((g) => ({
        name: g.name,
        role: g.invitedByRole,
      })),
    };
  });

  return <AdminDashboardClient initialBookings={bookings} />;
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0410] text-zinc-100 font-sans selection:bg-purple-600 selection:text-white">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="text-zinc-400 font-light tracking-widest uppercase text-sm">
              Loading Executive Dashboard...
            </p>
          </div>
        }
      >
        <DashboardDataFetcher />
      </Suspense>
    </main>
  );
}
