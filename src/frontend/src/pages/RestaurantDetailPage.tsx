import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRestaurant } from "../hooks/useBackend";

const PRICE_SYMBOLS: Record<number, string> = { 1: "₹", 2: "₹₹", 3: "₹₹₹" };
const PRICE_LABELS: Record<number, string> = {
  1: "Budget-friendly",
  2: "Mid-range",
  3: "Fine Dining",
};

function StarDisplay({ rating, large }: { rating: number; large?: boolean }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const size = large ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${
            i <= full
              ? "fill-chart-5 text-chart-5"
              : i === full + 1 && half
                ? "fill-chart-5/50 text-chart-5"
                : "fill-muted text-muted-foreground"
          }`}
        />
      ))}
      <span
        className={`text-muted-foreground ml-1 ${large ? "text-base" : "text-sm"}`}
      >
        {rating.toFixed(1)} / 5
      </span>
    </div>
  );
}

export default function RestaurantDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: restaurant, isLoading } = useRestaurant(
    id ? BigInt(id) : undefined,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner text="Loading restaurant…" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div
        className="container py-20 text-center"
        data-ocid="restaurant_detail.error_state"
      >
        <span className="text-6xl mb-4 block">🍽️</span>
        <h2 className="font-display text-2xl font-bold mb-3">
          Restaurant not found
        </h2>
        <p className="text-muted-foreground mb-5">
          This restaurant doesn't exist or may have been removed.
        </p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-smooth"
          data-ocid="restaurant_detail.back_link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const imgSeed = `restaurant-kk-${restaurant.id.toString()}`;
  const imgUrl = `https://picsum.photos/seed/${imgSeed}/1400/700`;

  return (
    <div data-ocid="restaurant_detail.page">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-smooth"
            data-ocid="restaurant_detail.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Restaurants
          </Link>
        </div>
      </div>

      {/* Full-width hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-muted">
        <img
          src={imgUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        {/* Overlay name */}
        <div className="absolute bottom-0 left-0 right-0 container pb-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.cuisineTypes.map((c) => (
                <span
                  key={c}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-accent/80 text-accent-foreground backdrop-blur-sm"
                >
                  {c}
                </span>
              ))}
              {restaurant.isFeatured && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/80 text-primary-foreground backdrop-blur-sm">
                  ⭐ Featured
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
              {restaurant.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-10 md:py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: details */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Rating + price */}
            <div className="flex flex-wrap items-center gap-5 pb-6 border-b border-border">
              <StarDisplay rating={restaurant.ratingAverage} large />
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold text-primary">
                  {PRICE_SYMBOLS[restaurant.priceRange] ?? "₹"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {PRICE_LABELS[restaurant.priceRange] ?? ""}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                About This Restaurant
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3 text-base">
                {restaurant.description}
              </p>
            </div>

            {/* Cuisine types */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                Cuisine Types
              </h2>
              <div className="flex flex-wrap gap-2">
                {restaurant.cuisineTypes.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 text-sm bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-full"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: info card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="sticky top-20 bg-card border border-border rounded-2xl overflow-hidden surface-elevated">
              {/* Info grid */}
              <div className="p-6 space-y-5">
                <h2 className="font-display text-base font-semibold text-foreground">
                  Restaurant Info
                </h2>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      Location
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {restaurant.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {restaurant.address}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      Phone
                    </p>
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="text-sm text-foreground font-medium hover:text-accent transition-smooth"
                      data-ocid="restaurant_detail.phone_link"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      Hours
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {restaurant.hoursOpen}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <a
                  href={`tel:${restaurant.phone}`}
                  data-ocid="restaurant_detail.call_button"
                >
                  <Button className="w-full gap-2 font-semibold transition-smooth">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Call to reserve a table or enquire about the menu
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
