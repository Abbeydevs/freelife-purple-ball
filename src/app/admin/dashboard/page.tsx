import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import AdminDashboardClient, {
  type AdminTicketItem,
} from "./AdminDashboardClient";

async function DashboardDataFetcher() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_authenticated")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const bookingsRaw = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  const bookings: AdminTicketItem[] = bookingsRaw.map((booking) => ({
    id: booking.id,
    attendeeName: booking.attendeeName,
    attendeeEmail: booking.attendeeEmail,
    attendeePhone: booking.attendeePhone,
    amount: booking.amount,
    receiptUrl: booking.receiptUrl,
    eventType: booking.eventType,
    status: booking.status,
    plusOneName:
      ((booking as Record<string, unknown>).plusOneName as string | null) ??
      null,
    plusOnePhone:
      ((booking as Record<string, unknown>).plusOnePhone as string | null) ??
      null,
    primaryGuestName:
      ((booking as Record<string, unknown>).primaryGuestName as
        | string
        | null) ?? null,
    plusOneGuestName:
      ((booking as Record<string, unknown>).plusOneGuestName as
        | string
        | null) ?? null,
  }));

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
