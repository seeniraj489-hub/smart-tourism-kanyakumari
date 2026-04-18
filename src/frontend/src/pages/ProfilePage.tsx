import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Copy,
  CreditCard,
  IndianRupee,
  Mail,
  Phone,
  Smartphone,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getEmail,
  getFullName,
  getMobile,
  getUsername,
} from "../hooks/useAuth";
import { useCancelBooking, useUserBookings } from "../hooks/useBackend";
import type { Booking, BookingStatus, BookingType } from "../types";
import { SAMPLE_GUIDES, SAMPLE_HOTELS } from "../types";

// ── Lookup helpers ──────────────────────────────────────────────────────────
function getBookingName(type: BookingType, referenceId: bigint): string {
  if (type === "Hotel") {
    return (
      SAMPLE_HOTELS.find((h) => h.id === referenceId)?.name ?? "Unknown Hotel"
    );
  }
  return (
    SAMPLE_GUIDES.find((g) => g.id === referenceId)?.name ?? "Unknown Guide"
  );
}

// ── Payment method label from transaction ID ────────────────────────────────
function getPaymentMethodLabel(
  txId?: string,
  method?: string,
): {
  label: string;
  color: string;
  icon: React.ReactNode;
} {
  const id = txId ?? method ?? "";
  if (id.startsWith("UPI_GPAY") || id === "gpay") {
    return {
      label: "GPay",
      color: "#4285F4",
      icon: (
        <span className="text-xs font-black" style={{ color: "#4285F4" }}>
          G
        </span>
      ),
    };
  }
  if (id.startsWith("UPI_PHONEPE") || id === "phonepe") {
    return {
      label: "PhonePe",
      color: "#5f259f",
      icon: <Smartphone className="w-3 h-3" style={{ color: "#5f259f" }} />,
    };
  }
  if (id.startsWith("OFFLINE") || id === "offline") {
    return {
      label: "Pay at Hotel",
      color: "#16a34a",
      icon: <span className="text-xs">🏨</span>,
    };
  }
  if (id.startsWith("pi_") || id === "card") {
    return {
      label: "Card",
      color: "#6b7280",
      icon: <CreditCard className="w-3 h-3" style={{ color: "#6b7280" }} />,
    };
  }
  return {
    label: "Online",
    color: "#6b7280",
    icon: <IndianRupee className="w-3 h-3" style={{ color: "#6b7280" }} />,
  };
}

// ── Status badge config ─────────────────────────────────────────────────────
const STATUS_CONFIG: Record<BookingStatus, { label: string; classes: string }> =
  {
    Confirmed: {
      label: "Confirmed",
      classes: "bg-secondary/20 text-secondary border-secondary/40",
    },
    Pending: {
      label: "Pending",
      classes: "bg-chart-5/20 text-chart-5 border-chart-5/40",
    },
    Cancelled: {
      label: "Cancelled",
      classes: "bg-destructive/15 text-destructive border-destructive/30",
    },
    Completed: {
      label: "Completed",
      classes: "bg-muted text-muted-foreground border-border",
    },
  };

// ── Booking card ─────────────────────────────────────────────────────────────
function BookingCard({
  booking,
  index,
  onCancel,
  isCancelling,
}: {
  booking: Booking;
  index: number;
  onCancel: (id: bigint) => void;
  isCancelling: boolean;
}) {
  const name = getBookingName(booking.bookingType, booking.referenceId);
  const { label, classes } = STATUS_CONFIG[booking.status];
  const nights =
    booking.bookingType === "Hotel"
      ? Math.ceil(
          (new Date(booking.checkOut).getTime() -
            new Date(booking.checkIn).getTime()) /
            86_400_000,
        )
      : null;

  const paymentInfo = getPaymentMethodLabel(
    booking.paymentTransactionId,
    booking.paymentMethod,
  );

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      data-ocid={`profile.booking.item.${index}`}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm transition-smooth hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: icon + details */}
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xl">
            {booking.bookingType === "Hotel" ? "🏨" : "🧭"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-display font-semibold text-foreground truncate">
                {name}
              </span>
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 shrink-0 border-primary/30 text-primary"
              >
                {booking.bookingType}
              </Badge>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium shrink-0 ${classes}`}
              >
                {label}
              </span>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                {fmt(booking.checkIn)}
                {booking.checkIn !== booking.checkOut && (
                  <> → {fmt(booking.checkOut)}</>
                )}
                {nights !== null && nights > 0 && (
                  <span className="text-muted-foreground/70">
                    ({nights} night{nights > 1 ? "s" : ""})
                  </span>
                )}
              </span>
              <span>
                {booking.guestCount.toString()} guest
                {Number(booking.guestCount) > 1 ? "s" : ""}
              </span>
            </div>

            {/* Amount + payment method row */}
            <div className="flex flex-wrap items-center gap-3">
              {booking.totalAmount !== undefined && booking.totalAmount > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  <IndianRupee className="w-3.5 h-3.5 shrink-0 text-primary" />
                  {booking.totalAmount.toLocaleString()}
                </span>
              )}
              {(booking.paymentTransactionId || booking.paymentMethod) && (
                <span
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${paymentInfo.color}15`,
                    color: paymentInfo.color,
                  }}
                >
                  {paymentInfo.icon}
                  {paymentInfo.label}
                </span>
              )}
              {booking.status === "Pending" &&
                !booking.paymentTransactionId &&
                booking.paymentMethod !== "offline" && (
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    ⏳ Payment pending
                  </span>
                )}
            </div>
          </div>
        </div>

        {/* Right: ref number + cancel */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">Ref #</p>
            <p className="font-mono font-bold text-sm text-primary tracking-wide">
              {booking.referenceNumber}
            </p>
          </div>
          {(booking.status === "Confirmed" || booking.status === "Pending") && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-xs h-8"
              onClick={() => onCancel(booking.id)}
              disabled={isCancelling}
              data-ocid={`profile.booking.cancel_button.${index}`}
              aria-label={`Cancel booking ${booking.referenceNumber}`}
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toString() ?? "";
  const shortId =
    principalId.length > 24
      ? `${principalId.slice(0, 12)}…${principalId.slice(-6)}`
      : principalId;

  // Profile info from localStorage (set at registration)
  const fullName = getFullName();
  const email = getEmail();
  const mobile = getMobile();
  const username = getUsername();

  // Fetch user bookings — auto-refetches when cache is invalidated
  const { data: bookings = [], isLoading } = useUserBookings();

  // Cancel mutation
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const handleCancel = (id: bigint) => {
    cancelBooking(id, {
      onSuccess: () => toast.success("Booking cancelled successfully."),
      onError: () => toast.error("Failed to cancel booking. Please try again."),
    });
  };

  function handleCopyId() {
    navigator.clipboard.writeText(principalId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const confirmed = bookings.filter((b) => b.status === "Confirmed");
  const pending = bookings.filter((b) => b.status === "Pending");
  const past = bookings.filter(
    (b) => b.status === "Cancelled" || b.status === "Completed",
  );

  return (
    <div className="min-h-screen bg-background" data-ocid="profile.page">
      {/* Hero header */}
      <section className="bg-gradient-to-b from-primary/12 via-primary/5 to-background border-b border-border py-10">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-sm shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
                {fullName ?? username ?? "My Profile"}
              </h1>
              {username && fullName && (
                <p className="text-sm text-muted-foreground mb-2">
                  @{username}
                </p>
              )}
              {/* Contact details row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2">
                {email && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span className="truncate max-w-[200px]" title={email}>
                      {email}
                    </span>
                  </span>
                )}
                {mobile && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    {mobile}
                  </span>
                )}
              </div>
              {/* Principal ID */}
              <div className="flex items-center gap-2">
                <p
                  className="font-mono text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg truncate max-w-[200px] sm:max-w-xs"
                  title={principalId}
                >
                  {shortId || "Not signed in"}
                </p>
                {principalId && (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                    aria-label="Copy principal ID"
                    data-ocid="profile.copy_id_button"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
                {copied && (
                  <span className="text-xs text-secondary font-medium">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bookings content */}
      <section className="container max-w-3xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            My Bookings
          </h2>
          {bookings.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4" data-ocid="profile.loading_state">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div
            className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/20"
            data-ocid="profile.empty_state"
          >
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-1 text-lg">
              No bookings yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-5">
              Explore hotels and local guides to make your first booking in
              Kanyakumari.
            </p>
            <Link to="/hotels">
              <Button data-ocid="profile.explore_hotels_button">
                Explore Hotels
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming / confirmed */}
            {confirmed.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Upcoming
                </p>
                <div className="space-y-3">
                  {confirmed.map((b, i) => (
                    <BookingCard
                      key={b.id.toString()}
                      booking={b}
                      index={i + 1}
                      onCancel={handleCancel}
                      isCancelling={isCancelling}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pending */}
            {pending.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Pending Confirmation
                </p>
                <div className="space-y-3">
                  {pending.map((b, i) => (
                    <BookingCard
                      key={b.id.toString()}
                      booking={b}
                      index={confirmed.length + i + 1}
                      onCancel={handleCancel}
                      isCancelling={isCancelling}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past / cancelled */}
            {past.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Past & Cancelled
                </p>
                <div className="space-y-3">
                  {past.map((b, i) => (
                    <BookingCard
                      key={b.id.toString()}
                      booking={b}
                      index={confirmed.length + pending.length + i + 1}
                      onCancel={handleCancel}
                      isCancelling={isCancelling}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
