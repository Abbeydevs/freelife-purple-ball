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
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { logoutAdmin } from "../actions";

export type AdminTicketGroup = {
  primary: {
    id: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
    amount: number;
    receiptUrl: string;
    eventType: string;
    status: PaymentStatus;
  };
  plusOne: {
    name: string;
    phone: string;
    isFreelifer: boolean;
    status: PaymentStatus;
    receiptUrl: string | null;
    bookingId?: string;
  } | null;
  totalAmount: number;
  invitedGuests: { name: string; role: string }[];
};

type StatusFilterType = "ALL" | PaymentStatus;
type EventFilterType = "ALL" | "PURPLE_BALL" | "AFTER_PARTY";

export default function AdminDashboardClient({
  initialBookings,
}: {
  initialBookings: AdminTicketGroup[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminTicketGroup[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [eventFilter, setEventFilter] = useState<EventFilterType>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((group) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      group.primary.attendeeName.toLowerCase().includes(searchLower) ||
      group.primary.attendeeEmail.toLowerCase().includes(searchLower) ||
      group.primary.attendeePhone.includes(searchQuery) ||
      (group.plusOne &&
        group.plusOne.name.toLowerCase().includes(searchLower)) ||
      (group.plusOne && group.plusOne.phone.includes(searchQuery));

    const matchesStatus =
      statusFilter === "ALL" ||
      group.primary.status === statusFilter ||
      (group.plusOne && group.plusOne.status === statusFilter);

    let matchesEvent = true;
    if (eventFilter === "PURPLE_BALL") {
      matchesEvent = group.primary.eventType === "PURPLE_BALL_AND_AFTER_PARTY";
    } else if (eventFilter === "AFTER_PARTY") {
      matchesEvent = group.primary.eventType === "AFTER_PARTY_ONLY";
    }

    return matchesSearch && matchesStatus && matchesEvent;
  });

  const totalPrimaryApproved = bookings.filter(
    (b) => b.primary.status === "APPROVED",
  ).length;
  const totalPlusOneApproved = bookings.filter(
    (b) => b.plusOne?.status === "APPROVED",
  ).length;
  const totalApproved = totalPrimaryApproved + totalPlusOneApproved;

  const totalDinner = bookings.filter(
    (b) => b.primary.eventType === "PURPLE_BALL_AND_AFTER_PARTY",
  ).length;
  const totalAfterParty = bookings.filter(
    (b) => b.primary.eventType === "AFTER_PARTY_ONLY",
  ).length;

  const totalFunds = bookings.reduce((sum, group) => {
    let groupSum = 0;
    if (group.primary.status === "APPROVED") groupSum += group.primary.amount;
    if (group.plusOne && group.plusOne.status === "APPROVED") {
      const poAmount = group.totalAmount - group.primary.amount;
      groupSum += poAmount;
    }
    return sum + groupSum;
  }, 0);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const handleApprove = async (id: string, isPlusOne: boolean = false) => {
    setProcessingId(id);
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });

      if (!response.ok) throw new Error("Approval failed");

      setBookings((prev) =>
        prev.map((group) => {
          if (isPlusOne && group.plusOne?.bookingId === id) {
            return {
              ...group,
              plusOne: { ...group.plusOne, status: "APPROVED" },
            };
          } else if (!isPlusOne && group.primary.id === id) {
            return {
              ...group,
              primary: { ...group.primary, status: "APPROVED" },
            };
          }
          return group;
        }),
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#160B24]/90 border border-purple-500/20 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-purple-400 uppercase tracking-widest">
              Total Primary Groups
            </p>
            <p className="text-3xl font-normal text-white mt-2">
              {bookings.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl shadow-xl">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest">
              Approved Tickets
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

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 font-light border border-dashed border-zinc-800 rounded-3xl">
            No registrations match your search or filters.
          </div>
        ) : (
          filteredBookings.map((group) => (
            <Card
              key={group.primary.id}
              className="bg-[#11081A]/80 border border-purple-900/30 rounded-3xl overflow-hidden shadow-lg"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-purple-900/30">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-medium text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-500" /> Primary:{" "}
                          {group.primary.attendeeName}
                        </h3>
                        {group.primary.eventType ===
                        "PURPLE_BALL_AND_AFTER_PARTY" ? (
                          <span className="bg-fuchsia-900/30 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                            <UtensilsCrossed className="w-3 h-3" /> Dinner
                          </span>
                        ) : (
                          <span className="bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                            <GlassWater className="w-3 h-3" /> After Party Only
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-light text-zinc-400 pl-7">
                        {group.primary.attendeeEmail} •{" "}
                        {group.primary.attendeePhone}
                      </p>
                    </div>
                  </div>

                  {group.primary.eventType ===
                    "PURPLE_BALL_AND_AFTER_PARTY" && (
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-1">
                            <UserPlus className="w-4 h-4 text-purple-400" />{" "}
                            Plus One Accompanying
                          </p>
                          {group.plusOne ? (
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-zinc-200">
                                {group.plusOne.name} • {group.plusOne.phone}
                              </p>
                              {group.plusOne.isFreelifer ? (
                                <span className="bg-purple-900/30 text-purple-300 border border-purple-500/30 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                                  Freelifer
                                </span>
                              ) : (
                                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                                  External Guest
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-rose-400/80 font-light italic">
                              Awaiting RSVP from invite link...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {group.invitedGuests.length > 0 && (
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2 mt-2">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-fuchsia-400" /> Free
                        Guest Passes Claimed
                      </p>
                      <div className="flex flex-col gap-1">
                        {group.invitedGuests.map((guest, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-zinc-300 font-light"
                          >
                            <span className="text-fuchsia-400/50 mr-1 text-xs uppercase">
                              By {guest.role}:
                            </span>{" "}
                            {guest.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-80 bg-[#160B24] p-6 flex flex-col justify-center space-y-6">
                  <div className="text-center">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                      Total Group Support
                    </p>
                    <p className="text-3xl font-light text-white">
                      ₦{group.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-purple-900/30 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Primary Ticket</span>
                      {group.primary.status === "APPROVED" ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-xs">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs">Pending</span>
                      )}
                    </div>
                    {group.primary.receiptUrl && (
                      <a
                        href={group.primary.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        View Receipt <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {group.primary.status === "PENDING" && (
                      <Button
                        onClick={() => handleApprove(group.primary.id, false)}
                        disabled={processingId === group.primary.id}
                        className="w-full h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs mt-2"
                      >
                        {processingId === group.primary.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Approve Primary"
                        )}
                      </Button>
                    )}
                  </div>

                  {group.plusOne &&
                    group.plusOne.bookingId &&
                    group.plusOne.receiptUrl && (
                      <div className="space-y-2 border-t border-purple-900/30 pt-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-400">Plus One Ticket</span>
                          {group.plusOne.status === "APPROVED" ? (
                            <span className="text-emerald-400 flex items-center gap-1 text-xs">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="text-amber-400 text-xs">
                              Pending
                            </span>
                          )}
                        </div>
                        <a
                          href={group.plusOne.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          View Receipt <ExternalLink className="w-3 h-3" />
                        </a>
                        {group.plusOne.status === "PENDING" && (
                          <Button
                            onClick={() =>
                              handleApprove(group.plusOne!.bookingId!, true)
                            }
                            disabled={processingId === group.plusOne.bookingId}
                            className="w-full h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs mt-2"
                          >
                            {processingId === group.plusOne.bookingId ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Approve Plus One"
                            )}
                          </Button>
                        )}
                      </div>
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
