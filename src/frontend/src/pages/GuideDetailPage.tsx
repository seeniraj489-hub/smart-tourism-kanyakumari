import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Phone,
  PhoneCall,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";
import { useGuide } from "../hooks/useBackend";
import type { Review } from "../types";

// Sample reviews for display
const GUIDE_REVIEWS: Review[] = [
  {
    id: 1n,
    userId: "user-1",
    reviewerName: "Priya Nair",
    targetType: "Guide",
    targetId: 1n,
    rating: 5n,
    comment:
      "Absolutely incredible experience! Our guide knew every story behind each temple and memorial. His passion for Kanyakumari's history was contagious. Highly recommend!",
    isApproved: true,
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: 2n,
    userId: "user-2",
    reviewerName: "Arjun Sharma",
    targetType: "Guide",
    targetId: 1n,
    rating: 5n,
    comment:
      "Best guided tour we've ever had. We learned so much about the cultural heritage and the meeting point of three oceans. Very punctual and professional.",
    isApproved: true,
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 12),
  },
  {
    id: 3n,
    userId: "user-3",
    reviewerName: "Kavitha Menon",
    targetType: "Guide",
    targetId: 1n,
    rating: 4n,
    comment:
      "Great guide with excellent knowledge. Helped us navigate the crowded ferry to Vivekananda Rock and shared fascinating stories along the way.",
    isApproved: true,
    createdAt: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 20),
  },
];

const SPEC_COLOR: Record<string, string> = {
  "Historical Tours": "bg-chart-1/15 text-chart-1 border-chart-1/30",
  "Cultural Heritage": "bg-primary/15 text-primary border-primary/30",
  "Nature & Wildlife": "bg-secondary/15 text-secondary border-secondary/30",
  "Local Cuisine": "bg-chart-5/15 text-chart-5 border-chart-5/30",
  "Photography Tours": "bg-accent/15 text-accent border-accent/30",
  Adventure: "bg-chart-2/15 text-chart-2 border-chart-2/30",
};

export default function GuideDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: guide, isLoading } = useGuide(id ? BigInt(id) : undefined);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(2);
  const [booked, setBooked] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner text="Loading guide profile…" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div
        className="container py-20 text-center"
        data-ocid="guide_detail.error_state"
      >
        <span className="text-5xl mb-4 block">👤</span>
        <h2 className="font-display text-2xl font-bold mb-2 text-foreground">
          Guide not found
        </h2>
        <p className="text-muted-foreground mb-4">
          The guide you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/guides" className="text-accent hover:underline font-medium">
          ← Browse all guides
        </Link>
      </div>
    );
  }

  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.round(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              86400000,
          ),
        )
      : 1;

  const totalCost = Number(guide.ratePerDay) * days;
  const specStyle =
    SPEC_COLOR[guide.specialization] ??
    "bg-accent/15 text-accent border-accent/30";

  const handleBook = () => {
    const ref = `KK-G${Date.now().toString(36).toUpperCase()}`;
    setRefNumber(ref);
    setBooked(true);
  };

  // Use picsum seed based on guide id for consistent photos
  const photoSeed = Number(guide.id) * 17 + 42;
  const guidePhoto = `https://picsum.photos/seed/${photoSeed}/400/400`;

  return (
    <div data-ocid="guide_detail.page" className="min-h-screen">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-secondary/12 via-accent/6 to-background border-b border-border">
        <div className="container max-w-5xl py-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6"
            data-ocid="guide_detail.back_link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to guides
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-border shadow-elevated bg-muted">
                <img
                  src={guidePhoto}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-5xl">👤</div>';
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${specStyle}`}
                >
                  {guide.specialization}
                </span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border ${
                    guide.isAvailable
                      ? "bg-secondary/15 text-secondary border-secondary/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {guide.isAvailable ? "● Available" : "○ Unavailable"}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1 leading-tight">
                {guide.name}
              </h1>
              <StarRating rating={4} showCount count={127} size="md" />

              <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
                {guide.bio}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-5xl py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border"
            >
              <div className="bg-card p-4 text-center">
                <p className="font-display text-2xl font-bold text-foreground">
                  {guide.experienceYears.toString()}+
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Years Experience
                </p>
              </div>
              <div className="bg-card p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary">
                  ₹{Number(guide.ratePerDay).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Per Day</p>
              </div>
              <div className="bg-card p-4 text-center">
                <p className="font-display text-2xl font-bold text-foreground">
                  {guide.languagesSpoken.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Languages
                </p>
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                Languages Spoken
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.languagesSpoken.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center text-sm bg-muted text-foreground px-3 py-1.5 rounded-full border border-border font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ==============================
                CRITICAL FEATURE: CALL GUIDE
                ============================== */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-secondary/10 to-accent/8 border border-secondary/25 rounded-2xl p-6"
            >
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                Contact Directly
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Reach {guide.name} instantly — no booking platform needed.
              </p>

              {/* Phone number display */}
              <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-4">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span className="font-mono text-lg font-semibold text-foreground tracking-wide">
                  {guide.phoneNumber}
                </span>
              </div>

              {/* CALL BUTTON — tel: link */}
              <a
                href={`tel:${guide.phoneNumber}`}
                data-ocid="guide_detail.call_button"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-secondary text-secondary-foreground text-base font-bold hover:bg-secondary/90 active:scale-[0.98] transition-smooth shadow-elevated"
              >
                <PhoneCall className="w-5 h-5" />
                Call {guide.name} Now
              </a>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Tap to open phone dialler with {guide.phoneNumber}
              </p>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Traveller Reviews
                </h3>
                <div className="flex items-center gap-2">
                  <StarRating rating={5} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    4.8 / 5 · 127 reviews
                  </span>
                </div>
              </div>

              <div className="space-y-4" data-ocid="guide_detail.reviews_list">
                {GUIDE_REVIEWS.map((review, i) => (
                  <ReviewCard
                    key={review.id.toString()}
                    review={review}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Booking panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="sticky top-20"
            >
              <div
                className="bg-card border border-border rounded-2xl p-6 shadow-elevated"
                data-ocid="guide_detail.booking_panel"
              >
                {booked ? (
                  <div
                    className="text-center py-4"
                    data-ocid="guide_detail.success_state"
                  >
                    <span className="text-5xl mb-3 block">🎉</span>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      Booking Confirmed!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your booking reference:
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-3">
                      <span className="font-mono font-bold text-primary text-lg tracking-wider">
                        {refNumber}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-5">
                      Save this reference. You can now call {guide.name}{" "}
                      directly to confirm details.
                    </p>
                    {/* Call button in confirmation */}
                    <a
                      href={`tel:${guide.phoneNumber}`}
                      data-ocid="guide_detail.confirm_call_button"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/90 transition-smooth mb-3"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Call Now — {guide.phoneNumber}
                    </a>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setBooked(false);
                        setStartDate("");
                        setEndDate("");
                        setPeople(2);
                      }}
                      data-ocid="guide_detail.new_booking_button"
                    >
                      Book Another Date
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-5">
                      <h3 className="font-display text-lg font-bold text-foreground mb-0.5">
                        Book This Guide
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reserve your tour dates
                      </p>
                    </div>

                    <div className="mb-4">
                      <span className="font-display text-2xl font-bold text-primary">
                        ₹{Number(guide.ratePerDay).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {" "}
                        / day
                      </span>
                    </div>

                    <div className="space-y-4 mb-5">
                      <div>
                        <Label
                          htmlFor="guide-start"
                          className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5 block"
                        >
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Start Date
                        </Label>
                        <Input
                          id="guide-start"
                          type="date"
                          value={startDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setStartDate(e.target.value)}
                          data-ocid="guide_detail.start_date_input"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="guide-end"
                          className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5 block"
                        >
                          <Clock className="w-3 h-3 inline mr-1" />
                          End Date
                        </Label>
                        <Input
                          id="guide-end"
                          type="date"
                          value={endDate}
                          min={
                            startDate || new Date().toISOString().split("T")[0]
                          }
                          onChange={(e) => setEndDate(e.target.value)}
                          data-ocid="guide_detail.end_date_input"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="guide-people"
                          className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5 block"
                        >
                          <Users className="w-3 h-3 inline mr-1" />
                          Number of People
                        </Label>
                        <Input
                          id="guide-people"
                          type="number"
                          min={1}
                          max={20}
                          value={people}
                          onChange={(e) => setPeople(Number(e.target.value))}
                          data-ocid="guide_detail.people_input"
                        />
                      </div>
                    </div>

                    {startDate && endDate && (
                      <div className="bg-muted/40 rounded-xl p-4 mb-5 text-sm space-y-1.5 border border-border">
                        <div className="flex justify-between text-muted-foreground">
                          <span>
                            {days} day{days !== 1 ? "s" : ""} × {people} person
                            {people !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-foreground border-t border-border pt-2">
                          <span>Estimated Total</span>
                          <span>₹{totalCost.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                          * Final price confirmed directly with guide
                        </p>
                      </div>
                    )}

                    <Button
                      className="w-full mb-3"
                      onClick={handleBook}
                      disabled={!startDate || !endDate}
                      data-ocid="guide_detail.book_button"
                    >
                      Request Booking
                    </Button>

                    {/* Call to action inside panel */}
                    <a
                      href={`tel:${guide.phoneNumber}`}
                      data-ocid="guide_detail.panel_call_button"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-secondary text-secondary text-sm font-semibold hover:bg-secondary/10 transition-smooth"
                    >
                      <Phone className="w-4 h-4" />
                      Or Call Directly
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
