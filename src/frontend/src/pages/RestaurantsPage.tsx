import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Search, Star, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRestaurants } from "../hooks/useBackend";
import type { Restaurant } from "../types";

const CUISINE_FILTERS = [
  "All",
  "Seafood",
  "South Indian",
  "Kerala Traditional",
  "North Indian",
  "Vegetarian",
  "Multi-cuisine",
] as const;

const PRICE_SYMBOLS: Record<number, string> = { 1: "₹", 2: "₹₹", 3: "₹₹₹" };
const PRICE_LABELS: Record<number, string> = {
  1: "Budget",
  2: "Mid-range",
  3: "Fine Dining",
};

function StarDisplay({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= full
              ? "fill-chart-5 text-chart-5"
              : i === full + 1 && half
                ? "fill-chart-5/50 text-chart-5"
                : "fill-muted text-muted-foreground"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1.5">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function RestaurantCard({
  restaurant,
  index,
}: { restaurant: Restaurant; index: number }) {
  const imgSeed = `restaurant-kk-${restaurant.id.toString()}`;
  return (
    <Link
      to="/restaurants/$id"
      params={{ id: restaurant.id.toString() }}
      data-ocid={`restaurants.item.${index + 1}`}
      className="group flex flex-col bg-card rounded-xl overflow-hidden border border-border surface-card hover:shadow-elevated transition-smooth"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative bg-muted shrink-0">
        <img
          src={`https://picsum.photos/seed/${imgSeed}/800/600`}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-bold text-primary">
            {PRICE_SYMBOLS[restaurant.priceRange] ?? "₹"}
          </span>
          <span className="text-xs text-muted-foreground">
            · {PRICE_LABELS[restaurant.priceRange] ?? ""}
          </span>
        </div>
        {restaurant.isFeatured && (
          <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-primary text-primary-foreground">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-foreground text-base leading-snug mb-1.5 line-clamp-1">
          {restaurant.name}
        </h3>

        {/* Cuisine badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {restaurant.cuisineTypes.slice(0, 3).map((c) => (
            <span
              key={c}
              className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
            >
              {c}
            </span>
          ))}
        </div>

        <StarDisplay rating={restaurant.ratingAverage} />

        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-3 leading-relaxed flex-1">
          {restaurant.description}
        </p>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 shrink-0 text-primary" />
            <span className="truncate">{restaurant.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 shrink-0 text-accent" />
            <span>{restaurant.phone}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {restaurant.hoursOpen}
          </span>
          <span className="text-xs font-semibold text-accent">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function RestaurantsPage() {
  const [search, setSearch] = useState("");
  const [activeCuisine, setActiveCuisine] = useState<string>("All");
  const { data: restaurants, isLoading } = useRestaurants();

  const filtered = (restaurants ?? []).filter((r) => {
    const matchSearch =
      !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchCuisine =
      activeCuisine === "All" ||
      r.cuisineTypes.some((c) =>
        c.toLowerCase().includes(activeCuisine.toLowerCase()),
      );
    return matchSearch && matchCuisine;
  });

  return (
    <div className="min-h-screen" data-ocid="restaurants.page">
      {/* Hero / search section */}
      <div className="bg-gradient-to-b from-primary/8 via-background to-background py-14 border-b border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                Dining Guide
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">
              Best Restaurants in{" "}
              <span className="text-primary">Kanyakumari</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mb-7 leading-relaxed">
              Fresh seafood, authentic Kerala cuisine, and coastal flavours at
              the southernmost tip of India.
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search restaurants by name…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="restaurants.search_input"
            />
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Cuisine filters */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          data-ocid="restaurants.cuisine_filter"
        >
          {CUISINE_FILTERS.map((cuisine) => (
            <button
              type="button"
              key={cuisine}
              onClick={() => setActiveCuisine(cuisine)}
              data-ocid="restaurants.filter.tab"
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                activeCuisine === cuisine
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading restaurants…" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="restaurants.empty_state"
          >
            <span className="text-5xl mb-4">🍽️</span>
            <h3 className="font-display text-xl font-semibold mb-2">
              No restaurants found
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Try a different cuisine filter or adjust your search.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-5">
              {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""}{" "}
              found
              {activeCuisine !== "All" ? ` · ${activeCuisine}` : ""}
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="restaurants.list"
            >
              {filtered.map((restaurant, i) => (
                <motion.div
                  key={restaurant.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.07, 0.35) }}
                >
                  <RestaurantCard restaurant={restaurant} index={i} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
