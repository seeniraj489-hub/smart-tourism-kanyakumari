import { loadStripe } from "@stripe/stripe-js";

// Stripe test publishable key (safe to expose in frontend — test mode only)
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51OExampleTestKeyReplaceWithRealKeyInProduction00000000";

export type PaymentMethod = "card" | "gpay" | "phonepe" | "offline";

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  method?: PaymentMethod;
  isOffline?: boolean;
}

export interface PaymentMetadata {
  hotelName: string;
  guestName?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
}

// ── Stripe card simulation ───────────────────────────────────────────────────
async function simulateStripePayment(
  cardNumber: string,
  _expiry: string,
  _cvv: string,
  amount: number,
): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const cleanCard = cardNumber.replace(/\s/g, "");

  if (cleanCard === "4000000000000002") {
    return {
      success: false,
      error: "Your card was declined. Please try a different card.",
    };
  }

  if (cleanCard.length !== 16 || !/^\d+$/.test(cleanCard)) {
    return {
      success: false,
      error: "Invalid card number. Please check and try again.",
    };
  }

  const txId = `pi_${Date.now()}_${Math.random().toString(36).slice(2, 10)}_test`;
  console.log(
    `[Stripe Test] Payment of ₹${amount} processed. Transaction: ${txId}`,
  );
  return { success: true, transactionId: txId, method: "card" };
}

// ── UPI / GPay / PhonePe simulation ─────────────────────────────────────────
export async function simulateUpiPayment(
  method: "gpay" | "phonepe",
  amount: number,
): Promise<PaymentResult> {
  // Simulate network delay for UPI verification
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const txId = `UPI_${method.toUpperCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  console.log(
    `[UPI ${method}] Payment of ₹${amount} confirmed. Transaction: ${txId}`,
  );
  return { success: true, transactionId: txId, method };
}

// ── Build UPI deep-link ──────────────────────────────────────────────────────
export function buildUpiLink(amount: number): string {
  const params = new URLSearchParams({
    pa: "smarttourism@upi",
    pn: "Smart Tourism Kanyakumari",
    am: String(amount),
    cu: "INR",
    tn: "HotelBooking",
  });
  return `upi://pay?${params.toString()}`;
}

// ── Stripe hook (card) ───────────────────────────────────────────────────────
export interface StripePaymentHook {
  initiatePayment: (
    cardNumber: string,
    expiry: string,
    cvv: string,
    amount: number,
    description: string,
    metadata: PaymentMetadata,
  ) => Promise<PaymentResult>;
  isStripeReady: boolean;
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export function useStripePayment(): StripePaymentHook {
  const initiatePayment = async (
    cardNumber: string,
    expiry: string,
    cvv: string,
    amount: number,
    description: string,
    metadata: PaymentMetadata,
  ): Promise<PaymentResult> => {
    try {
      const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        return {
          success: false,
          error: "Invalid expiry date. Use MM/YY format.",
        };
      }

      const expMonth = Number.parseInt(expiryMatch[1], 10);
      const expYear = Number.parseInt(expiryMatch[2], 10) + 2000;
      const now = new Date();
      if (
        expMonth < 1 ||
        expMonth > 12 ||
        expYear < now.getFullYear() ||
        (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)
      ) {
        return {
          success: false,
          error: "Card has expired or expiry is invalid.",
        };
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        return {
          success: false,
          error: "Invalid CVV. Please check your card.",
        };
      }

      console.log(`[Stripe] Initiating payment: ${description}`, metadata);
      await stripePromise;
      return await simulateStripePayment(cardNumber, expiry, cvv, amount);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      return { success: false, error: message };
    }
  };

  return { initiatePayment, isStripeReady: true };
}
