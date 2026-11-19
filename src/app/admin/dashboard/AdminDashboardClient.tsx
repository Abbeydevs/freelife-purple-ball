"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Users,
  UtensilsCrossed,
  GlassWater,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { logoutAdmin } from "../actions";

export type AdminTicketItem = {
  id: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  amount: number;
  receiptUrl: string;
  eventType: string;
  plusOneName: string | null;
  plusOnePhone: string | null;
  status: PaymentStatus;
  primaryGuestName?: string | null;
  plusOneGuestName?: string | null;
};

// Strict Literal Types for Filters
type StatusFilterType = "ALL" | PaymentStatus;
type EventFilterType = "ALL" | "PURPLE_BALL" | "AFTER_PARTY";

export default function AdminDashboardClient({
  initialBookings,
}: {
  initialBookings: AdminTicketItem[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminTicketItem[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [eventFilter, setEventFilter] = useState<EventFilterType>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter Logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.attendeePhone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;

    let matchesEvent = true;
    if (eventFilter === "PURPLE_BALL") {
      matchesEvent = booking.eventType === "PURPLE_BALL_AND_AFTER_PARTY";
    } else if (eventFilter === "AFTER_PARTY") {
      matchesEvent = booking.eventType === "AFTER_PARTY_ONLY";
    }

    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Analytics Math
  const totalApproved = bookings.filter((b) => b.status === "APPROVED").length;
  const totalDinner = bookings.filter(
    (b) => b.eventType === "PURPLE_BALL_AND_AFTER_PARTY",
  ).length;
  const totalAfterParty = bookings.filter(
    (b) => b.eventType === "AFTER_PARTY_ONLY",
  ).length;
  const totalFunds = bookings.reduce(
    (sum, b) => sum + (b.status === "APPROVED" ? b.amount : 0),
    0,
  );

  // Logout action using the router
  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  // Approval Action
  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });

      if (!response.ok) throw new Error("Approval failed");

      // Update local state instantly
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "APPROVED" } : b)),
      );
      toast.success("Payment verified. Gate Token emailed to attendee.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve. Check server logs.");
    } finally {
      setProcessingId(null);
    }
  };

  const statusOptions: StatusFilterType[] = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header & Logout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-zinc-400 font-light text-sm mt-1">
            Manage the Purple Ball & After Party registrations.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-400 rounded-full h-10 px-6 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#160B24]/90 border border-purple-500/20 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-purple-400 uppercase tracking-widest">
              Total Registrations
            </p>
            <p className="text-3xl font-normal text-white mt-2">
              {bookings.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest">
              Approved
            </p>
            <p className="text-3xl font-normal text-white mt-2">
              {totalApproved}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#160B24]/90 border border-purple-500/20 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-purple-400 uppercase tracking-widest">
              Dinner / After Party
            </p>
            <p className="text-3xl font-normal text-white mt-2">
              {totalDinner}{" "}
              <span className="text-zinc-500 text-sm font-light">
                / {totalAfterParty}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#160B24]/90 border border-purple-500/20 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-purple-400 uppercase tracking-widest">
              Est. Funds Raised
            </p>
            <p className="text-3xl font-normal text-white mt-2">
              ₦{totalFunds.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-full bg-zinc-900 border-zinc-800 pl-12 text-white focus-visible:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Status Filters */}
          <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800 shrink-0">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Event Filters */}
          <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800 shrink-0">
            <button
              onClick={() => setEventFilter("ALL")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                eventFilter === "ALL"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setEventFilter("PURPLE_BALL")}
              className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                eventFilter === "PURPLE_BALL"
                  ? "bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> Dinner
            </button>
            <button
              onClick={() => setEventFilter("AFTER_PARTY")}
              className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                eventFilter === "AFTER_PARTY"
                  ? "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <GlassWater className="w-3.5 h-3.5" /> After Party
            </button>
          </div>
        </div>
      </div>

      {/* Verification Queue (The List) */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 font-light border border-dashed border-zinc-800 rounded-3xl">
            No registrations match your search or filters.
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="bg-[#11081A]/80 border border-purple-900/30 rounded-3xl overflow-hidden shadow-lg"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left Side: Primary Info */}
                <div className="flex-1 p-6 space-y-4 border-b md:border-b-0 md:border-r border-purple-900/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-medium text-white">
                          {booking.attendeeName}
                        </h3>
                        {booking.eventType === "PURPLE_BALL_AND_AFTER_PARTY" ? (
                          <span className="bg-fuchsia-900/30 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                            <UtensilsCrossed className="w-3 h-3" /> Dinner
                          </span>
                        ) : (
                          <span className="bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                            <GlassWater className="w-3 h-3" /> After Party Only
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-light text-zinc-400">
                        {booking.attendeeEmail} • {booking.attendeePhone}
                      </p>
                    </div>
                    {booking.status === "APPROVED" ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Approved
                      </span>
                    ) : booking.status === "REJECTED" ? (
                      <span className="flex items-center gap-1 text-rose-400 text-sm font-medium bg-rose-950/30 px-3 py-1 rounded-full border border-rose-500/20">
                        Rejected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 text-sm font-medium bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/20">
                        <Loader2 className="w-4 h-4 animate-spin" /> Pending
                        Verif.
                      </span>
                    )}
                  </div>

                  {/* Plus One Details (Only if Dinner) */}
                  {booking.eventType === "PURPLE_BALL_AND_AFTER_PARTY" &&
                    booking.plusOneName && (
                      <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
                        <p className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" /> Plus One
                          Accompanying
                        </p>
                        <p className="text-sm text-zinc-200">
                          {booking.plusOneName} • {booking.plusOnePhone}
                        </p>
                      </div>
                    )}

                  {/* Matchmade Guests (If any) */}
                  {(booking.primaryGuestName || booking.plusOneGuestName) && (
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2 mt-2">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-fuchsia-400" /> Free
                        Guest Passes Claimed
                      </p>
                      {booking.primaryGuestName && (
                        <p className="text-sm text-zinc-300 font-light">
                          <span className="text-fuchsia-400/50 mr-1">
                            By Primary:
                          </span>{" "}
                          {booking.primaryGuestName}
                        </p>
                      )}
                      {booking.plusOneGuestName && (
                        <p className="text-sm text-zinc-300 font-light">
                          <span className="text-fuchsia-400/50 mr-1">
                            By Plus One:
                          </span>{" "}
                          {booking.plusOneGuestName}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side: The Money Room */}
                <div className="w-full md:w-80 bg-[#160B24] p-6 flex flex-col justify-center space-y-6">
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                      Declared Support
                    </p>
                    <p className="text-3xl font-light text-white">
                      ₦{booking.amount.toLocaleString()}
                    </p>
                  </div>

                  <a
                    href={booking.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View Transfer Receipt <ExternalLink className="w-4 h-4" />
                  </a>

                  {booking.status === "PENDING" && (
                    <Button
                      onClick={() => handleApprove(booking.id)}
                      disabled={processingId === booking.id}
                      className="w-full h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium cursor-pointer"
                    >
                      {processingId === booking.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Verify & Approve Payment"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
