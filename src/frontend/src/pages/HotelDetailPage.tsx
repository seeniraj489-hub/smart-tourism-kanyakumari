import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Dumbbell,
  ExternalLink,
  Eye,
  Leaf,
  Loader2,
  LogIn,
  MapPin,
  Smartphone,
  Sparkles,
  Star,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ImageGallery from "../components/ImageGallery";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";
import {
  useConfirmBookingPayment,
  useCreateBooking,
  useHotel,
} from "../hooks/useBackend";
import {
  type PaymentMethod,
  buildUpiLink,
  simulateUpiPayment,
  useStripePayment,
} from "../hooks/usePayment";
import type { Review } from "../types";

// ── Hotel images ─────────────────────────────────────────────────────────────
const HOTEL_IMAGES: Record<string, string[]> = {
  "Sparsa Resorts Kanyakumari": [
    "https://picsum.photos/seed/sparsa-resort/1200/800",
    "https://picsum.photos/seed/sparsa-pool/1200/800",
    "https://picsum.photos/seed/sparsa-room/1200/800",
    "https://picsum.photos/seed/sparsa-beach/1200/800",
  ],
  "Hotel Sea View": [
    "https://picsum.photos/seed/sea-view-hotel/1200/800",
    "https://picsum.photos/seed/sea-view-room/1200/800",
    "https://picsum.photos/seed/sea-view-lobby/1200/800",
  ],
  "Annai Resorts": [
    "https://picsum.photos/seed/annai-resort/1200/800",
    "https://picsum.photos/seed/annai-garden/1200/800",
    "https://picsum.photos/seed/annai-spa/1200/800",
    "https://picsum.photos/seed/annai-room/1200/800",
  ],
};

function getHotelImages(name: string): string[] {
  return HOTEL_IMAGES[name] ?? ["https://picsum.photos/seed/kk-hotel/1200/800"];
}

// ── Sample reviews ───────────────────────────────────────────────────────────
const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1n,
    userId: "user1",
    reviewerName: "Priya Nair",
    targetType: "Hotel",
    targetId: 1n,
    rating: 5n,
    comment:
      "Absolutely stunning beachfront property. The ocean views from our room were breathtaking, and the staff were incredibly warm and welcoming.",
    isApproved: true,
    createdAt: BigInt(Date.now() - 7 * 86400000),
  },
  {
    id: 2n,
    userId: "user2",
    reviewerName: "Arun Krishnamurthy",
    targetType: "Hotel",
    targetId: 1n,
    rating: 4n,
    comment:
      "Great location, excellent Tamil cuisine at the restaurant. The spa was a highlight. Would definitely return for our anniversary.",
    isApproved: true,
    createdAt: BigInt(Date.now() - 14 * 86400000),
  },
  {
    id: 3n,
    userId: "user3",
    reviewerName: "Sunita Patel",
    targetType: "Hotel",
    targetId: 2n,
    rating: 4n,
    comment:
      "Perfect sunrise views! Centrally located, easy walk to Kanyakumari beach and the ferry terminal. Clean rooms and friendly staff.",
    isApproved: true,
    createdAt: BigInt(Date.now() - 3 * 86400000),
  },
];

// ── Amenity icons ────────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  "Swimming Pool": <Waves className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
  Restaurant: <UtensilsCrossed className="w-4 h-4" />,
  Spa: <Sparkles className="w-4 h-4" />,
  "Ayurvedic Spa": <Sparkles className="w-4 h-4" />,
  Garden: <Leaf className="w-4 h-4" />,
  "Ocean View": <Eye className="w-4 h-4" />,
  "Temple View": <Eye className="w-4 h-4" />,
  "Sea View": <Waves className="w-4 h-4" />,
};

// ── Payment method config ────────────────────────────────────────────────────
interface MethodOption {
  id: PaymentMethod;
  label: string;
  sublabel: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: React.ReactNode;
}

const PAYMENT_METHODS: MethodOption[] = [
  {
    id: "card",
    label: "Debit / Credit Card",
    sublabel: "Visa, Mastercard, RuPay",
    color: "#6b7280",
    borderColor: "border-border",
    bgColor: "bg-muted/40",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "gpay",
    label: "Google Pay",
    sublabel: "UPI — instant transfer",
    color: "#4285F4",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50/60 dark:bg-blue-950/30",
    icon: (
      <span className="text-lg font-black" style={{ color: "#4285F4" }}>
        G
      </span>
    ),
  },
  {
    id: "phonepe",
    label: "PhonePe",
    sublabel: "UPI — instant transfer",
    color: "#5f259f",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-50/60 dark:bg-purple-950/30",
    icon: <Smartphone className="w-5 h-5" style={{ color: "#5f259f" }} />,
  },
  {
    id: "offline",
    label: "Pay at Hotel",
    sublabel: "Pay cash / card on check-in",
    color: "#16a34a",
    borderColor: "border-green-500",
    bgColor: "bg-green-50/60 dark:bg-green-950/30",
    icon: (
      <span className="text-base" role="img" aria-label="hotel">
        🏨
      </span>
    ),
  },
];

// ── Types ────────────────────────────────────────────────────────────────────
type BookingStep = "form" | "summary" | "payment" | "success" | "failed";

// ── Login prompt ─────────────────────────────────────────────────────────────
function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      className="text-center py-6 px-2"
      data-ocid="hotel_detail.login_prompt"
    >
      <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-6 h-6 text-accent" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        Sign in to Book
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Create a free account or sign in with Internet Identity to complete your
        booking securely.
      </p>
      <Button
        className="w-full"
        onClick={onLogin}
        data-ocid="hotel_detail.login_button"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign In to Continue
      </Button>
    </div>
  );
}

// ── Booking summary ──────────────────────────────────────────────────────────
interface SummaryProps {
  hotelName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  total: number;
  onPayNow: () => void;
  onBack: () => void;
  isCreatingBooking: boolean;
}

function BookingSummary({
  hotelName,
  checkIn,
  checkOut,
  nights,
  guests,
  pricePerNight,
  total,
  onPayNow,
  onBack,
  isCreatingBooking,
}: SummaryProps) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div data-ocid="hotel_detail.booking_summary">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Back to booking form"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="font-display font-semibold text-foreground text-base">
          Booking Summary
        </h3>
      </div>

      <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 mb-4 space-y-2 text-sm">
        <p className="font-semibold text-foreground">{hotelName}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
          <span>
            {fmt(checkIn)} → {fmt(checkOut)}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>
            {nights} night{nights !== 1 ? "s" : ""} · {guests} guest
            {guests !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-sm mb-5">
        <div className="flex justify-between text-muted-foreground">
          <span>
            ₹{pricePerNight.toLocaleString()} × {nights} night
            {nights !== 1 ? "s" : ""}
          </span>
          <span>₹{(pricePerNight * nights).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Guests</span>
          <span>{guests}</span>
        </div>
        <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2 text-base">
          <span>Total (INR)</span>
          <span className="text-primary">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <Button
        className="w-full gap-2"
        onClick={onPayNow}
        disabled={isCreatingBooking}
        data-ocid="hotel_detail.pay_now_button"
      >
        {isCreatingBooking ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Preparing booking…
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Choose Payment Method
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Secure payment · Free cancellation
      </p>
    </div>
  );
}

// ── Payment method selector ──────────────────────────────────────────────────
interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (m: PaymentMethod) => void;
}

function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 gap-2"
      data-ocid="hotel_detail.payment_method_selector"
    >
      {PAYMENT_METHODS.map((m) => {
        const isSelected = selected === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            data-ocid={`hotel_detail.payment_method.${m.id}`}
            className={`
              flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-center
              transition-all duration-200 cursor-pointer
              ${isSelected ? `${m.borderColor} ${m.bgColor} shadow-sm` : "border-border bg-card hover:bg-muted/30"}
            `}
            aria-pressed={isSelected}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center ${isSelected ? "" : "bg-muted/60"}`}
              style={isSelected ? { backgroundColor: `${m.color}18` } : {}}
            >
              {m.icon}
            </span>
            <span
              className="text-xs font-semibold leading-tight"
              style={isSelected ? { color: m.color } : undefined}
            >
              {m.label}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {m.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Card payment form ────────────────────────────────────────────────────────
interface CardFormProps {
  isProcessing: boolean;
  paymentError: string | null;
  cardNumber: string;
  expiry: string;
  cvv: string;
  onCardChange: (v: string) => void;
  onExpiryChange: (v: string) => void;
  onCvvChange: (v: string) => void;
  onSubmit: () => void;
}

function CardForm({
  isProcessing,
  paymentError,
  cardNumber,
  expiry,
  cvv,
  onCardChange,
  onExpiryChange,
  onCvvChange,
  onSubmit,
}: CardFormProps) {
  const handleCardInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    onCardChange(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  };

  const handleExpiryInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    onExpiryChange(
      digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
    );
  };

  return (
    <div className="mt-4 space-y-3">
      {paymentError && (
        <div
          className="flex items-start gap-2 bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2.5 text-sm text-destructive"
          data-ocid="hotel_detail.payment_error_state"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}
      <div>
        <Label
          htmlFor="card-number"
          className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
        >
          Card Number
        </Label>
        <Input
          id="card-number"
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => handleCardInput(e.target.value)}
          disabled={isProcessing}
          maxLength={19}
          className="font-mono tracking-wider"
          data-ocid="hotel_detail.card_number_input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label
            htmlFor="expiry"
            className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
          >
            Expiry (MM/YY)
          </Label>
          <Input
            id="expiry"
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => handleExpiryInput(e.target.value)}
            disabled={isProcessing}
            maxLength={5}
            className="font-mono"
            data-ocid="hotel_detail.expiry_input"
          />
        </div>
        <div>
          <Label
            htmlFor="cvv"
            className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
          >
            CVV
          </Label>
          <Input
            id="cvv"
            type="password"
            inputMode="numeric"
            placeholder="123"
            value={cvv}
            onChange={(e) =>
              onCvvChange(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            disabled={isProcessing}
            maxLength={4}
            className="font-mono"
            data-ocid="hotel_detail.cvv_input"
          />
        </div>
      </div>
      <div className="bg-muted/60 border border-border rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Test card:</span> 4242
          4242 4242 4242 — any expiry/CVV
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Decline test: 4000 0000 0000 0002
        </p>
      </div>
      <Button
        className="w-full gap-2"
        onClick={onSubmit}
        disabled={isProcessing || !cardNumber || !expiry || !cvv}
        data-ocid="hotel_detail.confirm_payment_button"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Confirm Payment
          </>
        )}
      </Button>
    </div>
  );
}

// ── UPI payment panel (GPay / PhonePe) ───────────────────────────────────────
interface UpiPanelProps {
  method: "gpay" | "phonepe";
  amount: number;
  isProcessing: boolean;
  awaitingConfirm: boolean;
  onOpenApp: () => void;
  onConfirmPaid: () => void;
}

function UpiPanel({
  method,
  amount,
  isProcessing,
  awaitingConfirm,
  onOpenApp,
  onConfirmPaid,
}: UpiPanelProps) {
  const isGpay = method === "gpay";
  const brandColor = isGpay ? "#4285F4" : "#5f259f";
  const brandName = isGpay ? "Google Pay" : "PhonePe";
  const upiLink = buildUpiLink(amount);
  const upiId = "smarttourism@upi";

  return (
    <div className="mt-4 space-y-4" data-ocid={`hotel_detail.${method}_panel`}>
      {/* QR code placeholder */}
      <div className="flex flex-col items-center gap-2 bg-muted/40 border border-border rounded-xl p-4">
        <div
          className="w-28 h-28 rounded-lg flex flex-col items-center justify-center border-2"
          style={{
            borderColor: `${brandColor}40`,
            backgroundColor: `${brandColor}0a`,
          }}
        >
          {/* Stylised QR grid pattern (decorative) */}
          {(() => {
            const filled = new Set([
              0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24, 7, 17,
              12,
            ]);
            const cells = [
              "c00",
              "c01",
              "c02",
              "c03",
              "c04",
              "c05",
              "c06",
              "c07",
              "c08",
              "c09",
              "c10",
              "c11",
              "c12",
              "c13",
              "c14",
              "c15",
              "c16",
              "c17",
              "c18",
              "c19",
              "c20",
              "c21",
              "c22",
              "c23",
              "c24",
            ];
            return (
              <div className="grid grid-cols-5 gap-0.5 mb-2">
                {cells.map((key, i) => (
                  <div
                    key={key}
                    className="w-2 h-2 rounded-[1px]"
                    style={{
                      backgroundColor: filled.has(i)
                        ? brandColor
                        : "transparent",
                    }}
                  />
                ))}
              </div>
            );
          })()}
          <span
            className="text-[9px] font-mono font-bold"
            style={{ color: brandColor }}
          >
            SCAN TO PAY
          </span>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">UPI ID</p>
          <p className="font-mono text-sm font-bold text-foreground">{upiId}</p>
        </div>
        <div
          className="rounded-full px-3 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: `${brandColor}18`, color: brandColor }}
        >
          ₹{amount.toLocaleString()} · INR
        </div>
      </div>

      {!awaitingConfirm ? (
        <a
          href={upiLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            className="w-full gap-2 text-white"
            style={{ backgroundColor: brandColor, borderColor: brandColor }}
            onClick={onOpenApp}
            data-ocid={`hotel_detail.open_${method}_button`}
          >
            <Smartphone className="w-4 h-4" />
            Open {brandName}
          </Button>
        </a>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2.5">
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Waiting for payment confirmation from {brandName}…
            </p>
          </div>
          <Button
            className="w-full gap-2"
            onClick={onConfirmPaid}
            disabled={isProcessing}
            data-ocid="hotel_detail.upi_confirm_paid_button"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />I have completed payment
              </>
            )}
          </Button>
        </div>
      )}

      <p className="text-[10px] text-center text-muted-foreground">
        Opens {brandName} app on mobile · Use QR on desktop
      </p>
    </div>
  );
}

// ── Offline payment panel ────────────────────────────────────────────────────
interface OfflinePanelProps {
  amount: number;
  isProcessing: boolean;
  onConfirm: () => void;
}

function OfflinePanel({ amount, isProcessing, onConfirm }: OfflinePanelProps) {
  return (
    <div className="mt-4 space-y-4" data-ocid="hotel_detail.offline_panel">
      <div className="bg-green-50/70 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label="hotel">
            🏨
          </span>
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
            Pay at the Hotel
          </p>
        </div>
        <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
          Your room will be reserved. Pay{" "}
          <span className="font-bold">₹{amount.toLocaleString()}</span> in cash
          or by card at the front desk on check-in.
        </p>
        <ul className="text-xs text-green-600 dark:text-green-500 space-y-1 mt-1">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Instant booking confirmation
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            No advance payment required
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Free cancellation policy applies
          </li>
        </ul>
      </div>
      <Button
        className="w-full gap-2"
        style={{ backgroundColor: "#16a34a", borderColor: "#16a34a" }}
        onClick={onConfirm}
        disabled={isProcessing}
        data-ocid="hotel_detail.offline_confirm_button"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Confirming…
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-white" />
            Confirm Booking — Pay at Hotel
          </>
        )}
      </Button>
    </div>
  );
}

// ── Full payment step ────────────────────────────────────────────────────────
interface PaymentStepProps {
  total: number;
  isProcessing: boolean;
  paymentError: string | null;
  cardNumber: string;
  expiry: string;
  cvv: string;
  selectedMethod: PaymentMethod;
  upiAwaitingConfirm: boolean;
  onMethodSelect: (m: PaymentMethod) => void;
  onCardChange: (v: string) => void;
  onExpiryChange: (v: string) => void;
  onCvvChange: (v: string) => void;
  onCardSubmit: () => void;
  onOpenUpiApp: (m: "gpay" | "phonepe") => void;
  onUpiConfirmPaid: () => void;
  onOfflineConfirm: () => void;
  onBack: () => void;
}

function PaymentStep({
  total,
  isProcessing,
  paymentError,
  cardNumber,
  expiry,
  cvv,
  selectedMethod,
  upiAwaitingConfirm,
  onMethodSelect,
  onCardChange,
  onExpiryChange,
  onCvvChange,
  onCardSubmit,
  onOpenUpiApp,
  onUpiConfirmPaid,
  onOfflineConfirm,
  onBack,
}: PaymentStepProps) {
  return (
    <div data-ocid="hotel_detail.payment_form">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Back to booking summary"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="font-display font-semibold text-foreground text-base flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-accent" />
          Choose Payment
        </h3>
      </div>

      {/* Amount */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2 mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Amount</span>
        <span className="font-bold text-foreground">
          ₹{total.toLocaleString()}
        </span>
      </div>

      {/* Method selector */}
      <PaymentMethodSelector
        selected={selectedMethod}
        onSelect={onMethodSelect}
      />

      {/* Method-specific panels */}
      {selectedMethod === "card" && (
        <CardForm
          isProcessing={isProcessing}
          paymentError={paymentError}
          cardNumber={cardNumber}
          expiry={expiry}
          cvv={cvv}
          onCardChange={onCardChange}
          onExpiryChange={onExpiryChange}
          onCvvChange={onCvvChange}
          onSubmit={onCardSubmit}
        />
      )}

      {(selectedMethod === "gpay" || selectedMethod === "phonepe") && (
        <UpiPanel
          method={selectedMethod}
          amount={total}
          isProcessing={isProcessing}
          awaitingConfirm={upiAwaitingConfirm}
          onOpenApp={() => onOpenUpiApp(selectedMethod)}
          onConfirmPaid={onUpiConfirmPaid}
        />
      )}

      {selectedMethod === "offline" && (
        <OfflinePanel
          amount={total}
          isProcessing={isProcessing}
          onConfirm={onOfflineConfirm}
        />
      )}
    </div>
  );
}

// ── Booking confirmation ─────────────────────────────────────────────────────
interface ConfirmationProps {
  refNumber: string;
  transactionId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  hotelName: string;
  roomType: string;
  paymentMethod: PaymentMethod;
  onReset: () => void;
  onViewProfile: () => void;
}

function BookingConfirmation({
  refNumber,
  transactionId,
  checkIn,
  checkOut,
  nights,
  guests,
  total,
  hotelName,
  roomType,
  paymentMethod,
  onReset,
  onViewProfile,
}: ConfirmationProps) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isOffline = paymentMethod === "offline";
  const methodLabels: Record<PaymentMethod, string> = {
    card: "Card Payment",
    gpay: "Paid via GPay",
    phonepe: "Paid via PhonePe",
    offline: "Pay at Hotel",
  };
  const methodColors: Record<PaymentMethod, string> = {
    card: "#6b7280",
    gpay: "#4285F4",
    phonepe: "#5f259f",
    offline: "#16a34a",
  };
  const mc = methodColors[paymentMethod];

  return (
    <div className="py-2" data-ocid="hotel_detail.success_state">
      {/* Success icon */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4"
        style={{ backgroundColor: isOffline ? "#16a34a18" : "#22c55e18" }}
      >
        <CheckCircle2
          className="w-8 h-8"
          style={{ color: isOffline ? "#16a34a" : "#22c55e" }}
        />
      </div>

      <h3 className="font-display text-xl font-bold text-foreground text-center mb-1">
        Booking Confirmed!
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-1">
        {hotelName}
      </p>

      {/* Payment method badge */}
      <p className="text-xs text-center mb-4">
        <span
          className="inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: `${mc}18`, color: mc }}
        >
          {methodLabels[paymentMethod]}
        </span>
      </p>

      {/* Offline-specific message */}
      {isOffline && (
        <div className="bg-green-50/70 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-center mb-3">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
            Pay ₹{total.toLocaleString()} at the hotel on check-in
          </p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-1">
            Show your booking reference at the front desk
          </p>
        </div>
      )}

      {/* Reference number */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-center mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Booking Reference
        </p>
        <span
          className="font-mono font-bold text-primary text-xl tracking-widest"
          data-ocid="hotel_detail.reference_number"
        >
          {refNumber}
        </span>
      </div>

      {/* Booking details */}
      <div className="bg-muted/40 border border-border rounded-xl px-4 py-3 mb-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
          <span>
            {fmt(checkIn)} — {fmt(checkOut)}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>
            {nights} night{nights !== 1 ? "s" : ""} · {guests} guest
            {guests !== 1 ? "s" : ""}
          </span>
          <span className="capitalize text-xs bg-muted px-2 py-0.5 rounded">
            {roomType}
          </span>
        </div>
        {transactionId && (
          <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-2">
            <span>Txn ID</span>
            <span className="font-mono truncate max-w-[140px]">
              {transactionId}
            </span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2">
          <span>{isOffline ? "Due at Hotel" : "Total Paid"}</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mb-4">
        Save your reference number — you'll need it at check-in.
      </p>

      <div className="space-y-2">
        <Button
          className="w-full gap-2"
          onClick={onViewProfile}
          data-ocid="hotel_detail.view_profile_button"
        >
          <ExternalLink className="w-4 h-4" />
          View in My Profile
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onReset}
          data-ocid="hotel_detail.new_booking_button"
        >
          Make Another Booking
        </Button>
      </div>
    </div>
  );
}

// ── Payment failure ──────────────────────────────────────────────────────────
function PaymentFailed({
  error,
  onRetry,
}: { error: string; onRetry: () => void }) {
  return (
    <div
      className="py-4 text-center"
      data-ocid="hotel_detail.payment_failed_state"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mx-auto mb-4">
        <AlertCircle className="w-7 h-7 text-destructive" />
      </div>
      <h3 className="font-display text-lg font-bold text-foreground mb-2">
        Payment Failed
      </h3>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        {error}
      </p>
      <Button
        className="w-full"
        onClick={onRetry}
        data-ocid="hotel_detail.retry_payment_button"
      >
        Try Again
      </Button>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function HotelDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: hotel, isLoading } = useHotel(id ? BigInt(id) : undefined);
  const { isAuthenticated, isInitializing, login } = useInternetIdentity();
  const { initiatePayment } = useStripePayment();
  const navigate = useNavigate();

  // Backend mutations
  const { mutateAsync: createBooking, isPending: isCreatingBooking } =
    useCreateBooking();
  const { mutateAsync: confirmBookingPayment } = useConfirmBookingPayment();

  // Booking form state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("standard");

  // Flow
  const [step, setStep] = useState<BookingStep>("form");

  // Booking ID captured after createBooking
  const [activeBookingId, setActiveBookingId] = useState<bigint | null>(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Payment method
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [upiAwaitingConfirm, setUpiAwaitingConfirm] = useState(false);

  // Result state
  const [isProcessing, setIsProcessing] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [failedError, setFailedError] = useState("");
  const [confirmedMethod, setConfirmedMethod] = useState<PaymentMethod>("card");

  if (isLoading || isInitializing) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner text="Loading hotel…" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div
        className="container py-20 text-center"
        data-ocid="hotel_detail.error_state"
      >
        <span className="text-5xl mb-4 block">🏨</span>
        <h2 className="font-display text-2xl font-bold mb-2">
          Hotel not found
        </h2>
        <Link to="/hotels" className="text-accent hover:underline">
          ← Back to hotels
        </Link>
      </div>
    );
  }

  const images = getHotelImages(hotel.name);
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86400000,
          ),
        )
      : 1;
  const total = Number(hotel.pricePerNight) * nights * guests;

  const genRef = () => {
    const year = new Date().getFullYear();
    const seq = String(Math.floor(Math.random() * 900) + 100);
    return `KK-${year}-${seq}`;
  };

  // ── Step: form → summary
  const handleBookNow = () => {
    if (!checkIn || !checkOut || nights <= 0) return;
    setStep("summary");
  };

  // ── Step: summary → payment (create booking here)
  const handlePayNow = async () => {
    setPaymentError(null);
    setUpiAwaitingConfirm(false);
    const ref = genRef();
    try {
      const booking = await createBooking({
        hotelId: hotel.id,
        hotelName: hotel.name,
        checkIn,
        checkOut,
        guestCount: guests,
        totalAmount: total,
        paymentMethod: selectedMethod,
        referenceNumber: ref,
      });
      setActiveBookingId(booking.id);
      setRefNumber(ref);
      setStep("payment");
    } catch {
      toast.error("Failed to create booking. Please try again.");
    }
  };

  // ── Shared: mark booking confirmed in backend + go to success
  const handleSuccess = async (txId: string, method: PaymentMethod) => {
    if (activeBookingId) {
      try {
        await confirmBookingPayment({
          bookingId: activeBookingId,
          transactionId: txId,
          amount: total,
        });
      } catch {
        // Best-effort — booking is already created, don't block success screen
      }
    }
    setTransactionId(txId);
    setConfirmedMethod(method);
    setStep("success");
    toast.success("Booking confirmed! Check your profile for details.");
  };

  const handleCardSubmit = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    const result = await initiatePayment(
      cardNumber,
      expiry,
      cvv,
      total,
      `Hotel: ${hotel.name}`,
      {
        hotelName: hotel.name,
        checkIn,
        checkOut,
        nights,
        guests,
      },
    );
    setIsProcessing(false);
    if (result.success && result.transactionId) {
      await handleSuccess(result.transactionId, "card");
    } else {
      setPaymentError(result.error ?? "Payment failed. Please try again.");
    }
  };

  const handleOpenUpiApp = (_method: "gpay" | "phonepe") => {
    setUpiAwaitingConfirm(true);
  };

  const handleUpiConfirmPaid = async () => {
    if (
      !selectedMethod ||
      selectedMethod === "card" ||
      selectedMethod === "offline"
    )
      return;
    setIsProcessing(true);
    // Generate UPI transaction ID with method prefix
    const upiPrefix = selectedMethod === "gpay" ? "UPI_GPAY" : "UPI_PHONEPE";
    const upiTxId = `${upiPrefix}_${Date.now()}`;
    const result = await simulateUpiPayment(selectedMethod, total);
    setIsProcessing(false);
    if (result.success) {
      await handleSuccess(upiTxId, selectedMethod);
    } else {
      setFailedError(result.error ?? "UPI payment verification failed.");
      setStep("failed");
    }
  };

  const handleOfflineConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsProcessing(false);
    const offlineTxId = `OFFLINE_${Date.now()}_KK`;
    await handleSuccess(offlineTxId, "offline");
  };

  const handleMethodSelect = (m: PaymentMethod) => {
    setSelectedMethod(m);
    setUpiAwaitingConfirm(false);
    setPaymentError(null);
  };

  const handleReset = () => {
    setStep("form");
    setCheckIn("");
    setCheckOut("");
    setGuests(2);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setPaymentError(null);
    setRefNumber("");
    setTransactionId("");
    setSelectedMethod("card");
    setUpiAwaitingConfirm(false);
    setActiveBookingId(null);
  };

  const reviews = SAMPLE_REVIEWS.filter((r) => r.targetId === hotel.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
      : Number(hotel.starRating);

  const today = new Date().toISOString().split("T")[0] as string;

  return (
    <div data-ocid="hotel_detail.page">
      <div className="container py-8">
        <Link
          to="/hotels"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6"
          data-ocid="hotel_detail.back_link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to hotels
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* ── Left: Gallery + Details ── */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={images} alt={hotel.name} />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StarRating
                  rating={avgRating}
                  size="md"
                  showCount
                  count={reviews.length}
                />
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {hotel.location}
                </Badge>
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-3">
                {hotel.name}
              </h1>
              <p className="text-muted-foreground leading-relaxed text-base">
                {hotel.description}
              </p>
            </div>

            <div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-3">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 text-sm bg-muted px-3 py-1.5 rounded-full text-muted-foreground border border-border"
                  >
                    {AMENITY_ICONS[a] ?? <Star className="w-4 h-4" />}
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-4">
                Guest Reviews
              </h2>
              {reviews.length > 0 ? (
                <div
                  className="space-y-4"
                  data-ocid="hotel_detail.reviews_list"
                >
                  {reviews.map((review, i) => (
                    <ReviewCard
                      key={review.id.toString()}
                      review={review}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-10 bg-muted/40 rounded-xl border border-border"
                  data-ocid="hotel_detail.reviews_empty_state"
                >
                  <span className="text-3xl mb-2 block">💬</span>
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review this hotel!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Booking panel ── */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-20 bg-card border border-border rounded-2xl p-6 shadow-elevated"
              data-ocid="hotel_detail.booking_panel"
            >
              {step === "success" ? (
                <BookingConfirmation
                  refNumber={refNumber}
                  transactionId={transactionId}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  guests={guests}
                  total={total}
                  hotelName={hotel.name}
                  roomType={roomType}
                  paymentMethod={confirmedMethod}
                  onReset={handleReset}
                  onViewProfile={() => navigate({ to: "/profile" })}
                />
              ) : step === "failed" ? (
                <PaymentFailed
                  error={failedError}
                  onRetry={() => {
                    setStep("payment");
                    setUpiAwaitingConfirm(false);
                    setPaymentError(null);
                  }}
                />
              ) : !isAuthenticated ? (
                <>
                  <div className="mb-4 pb-4 border-b border-border">
                    <span className="font-display text-2xl font-bold text-primary">
                      ₹{Number(hotel.pricePerNight).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      / night
                    </span>
                  </div>
                  <LoginPrompt onLogin={login} />
                </>
              ) : step === "summary" ? (
                <BookingSummary
                  hotelName={hotel.name}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  guests={guests}
                  pricePerNight={Number(hotel.pricePerNight)}
                  total={total}
                  onPayNow={handlePayNow}
                  onBack={() => setStep("form")}
                  isCreatingBooking={isCreatingBooking}
                />
              ) : step === "payment" ? (
                <PaymentStep
                  total={total}
                  isProcessing={isProcessing}
                  paymentError={paymentError}
                  cardNumber={cardNumber}
                  expiry={expiry}
                  cvv={cvv}
                  selectedMethod={selectedMethod}
                  upiAwaitingConfirm={upiAwaitingConfirm}
                  onMethodSelect={handleMethodSelect}
                  onCardChange={setCardNumber}
                  onExpiryChange={setExpiry}
                  onCvvChange={setCvv}
                  onCardSubmit={handleCardSubmit}
                  onOpenUpiApp={handleOpenUpiApp}
                  onUpiConfirmPaid={handleUpiConfirmPaid}
                  onOfflineConfirm={handleOfflineConfirm}
                  onBack={() => {
                    setStep("summary");
                    setPaymentError(null);
                    setUpiAwaitingConfirm(false);
                  }}
                />
              ) : (
                <>
                  <div className="mb-5">
                    <span className="font-display text-2xl font-bold text-primary">
                      ₹{Number(hotel.pricePerNight).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      / night
                    </span>
                  </div>

                  <div className="space-y-4 mb-5">
                    <div>
                      <Label
                        htmlFor="checkin"
                        className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
                      >
                        Check-in
                      </Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        min={today}
                        onChange={(e) => {
                          setCheckIn(e.target.value);
                          if (checkOut && e.target.value >= checkOut)
                            setCheckOut("");
                        }}
                        data-ocid="hotel_detail.checkin_input"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="checkout"
                        className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
                      >
                        Check-out
                      </Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        min={checkIn || today}
                        onChange={(e) => setCheckOut(e.target.value)}
                        data-ocid="hotel_detail.checkout_input"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="guests"
                        className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
                      >
                        Guests
                      </Label>
                      <Input
                        id="guests"
                        type="number"
                        min={1}
                        max={10}
                        value={guests}
                        onChange={(e) =>
                          setGuests(
                            Math.max(1, Math.min(10, Number(e.target.value))),
                          )
                        }
                        data-ocid="hotel_detail.guests_input"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="room-type"
                        className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block"
                      >
                        Room Type
                      </Label>
                      <select
                        id="room-type"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        data-ocid="hotel_detail.room_type_select"
                      >
                        <option value="standard">Standard Room</option>
                        <option value="deluxe">Deluxe Room</option>
                        <option value="suite">Suite</option>
                        <option value="sea-view">Sea View Room</option>
                      </select>
                    </div>
                  </div>

                  {checkIn && checkOut && nights > 0 && (
                    <div className="bg-muted/40 rounded-xl p-4 mb-5 text-sm space-y-1.5 border border-border">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          ₹{Number(hotel.pricePerNight).toLocaleString()} ×{" "}
                          {nights} night
                          {nights !== 1 ? "s" : ""}
                        </span>
                        <span>
                          ₹
                          {(
                            Number(hotel.pricePerNight) * nights
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Guests</span>
                        <span>{guests}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment method preview badges */}
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      Pay via:
                    </span>
                    {[
                      { label: "GPay", color: "#4285F4" },
                      { label: "PhonePe", color: "#5f259f" },
                      { label: "Card", color: "#6b7280" },
                      { label: "Hotel", color: "#16a34a" },
                    ].map((b) => (
                      <span
                        key={b.label}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${b.color}15`,
                          color: b.color,
                        }}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleBookNow}
                    disabled={!checkIn || !checkOut || nights <= 0}
                    data-ocid="hotel_detail.book_button"
                  >
                    Book Now
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    {Number(hotel.totalRooms)} rooms available · Free
                    cancellation
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
