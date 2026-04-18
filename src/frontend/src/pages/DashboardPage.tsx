import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Building2,
  MapPin,
  Phone,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import HotelCard from "../components/HotelCard";
import PlaceCard from "../components/PlaceCard";
import {
  useDashboardStats,
  useFeaturedHotels,
  useFeaturedPlaces,
  useFeaturedRestaurants,
} from "../hooks/useBackend";
import type { Restaurant } from "../types";

function CardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

const PRICE_SYMBOLS: Record<number, string> = { 1: "₹", 2: "₹₹", 3: "₹₹₹" };

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
      <span className="text-xs text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function RestaurantCard({
  restaurant,
  index,
}: { restaurant: Restaurant; index: number }) {
  const imgSeed = `restaurant-${restaurant.id.toString()}`;
  return (
    <Link
      to="/restaurants/$id"
      params={{ id: restaurant.id.toString() }}
      data-ocid={`dashboard.restaurant_card.item.${index + 1}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border surface-card hover:shadow-elevated transition-smooth"
    >
      <div className="aspect-[4/3] overflow-hidden relative bg-muted">
        <img
          src={`https://picsum.photos/seed/${imgSeed}/800/600`}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-primary">
          {PRICE_SYMBOLS[restaurant.priceRange] ?? "₹"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-base leading-snug mb-1 line-clamp-1">
          {restaurant.name}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {restaurant.cuisineTypes.slice(0, 2).map((c) => (
            <span
              key={c}
              className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
            >
              {c}
            </span>
          ))}
        </div>
        <StarDisplay rating={restaurant.ratingAverage} />
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{restaurant.location}</span>
        </p>
      </div>
    </Link>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  linkTo: string;
  linkLabel: string;
  ocidPrefix: string;
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  linkTo,
  linkLabel,
  ocidPrefix,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-1.5">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg leading-relaxed">
          {subtitle}
        </p>
      </div>
      <Link
        to={linkTo as "/places" | "/restaurants" | "/hotels" | "/guides"}
        data-ocid={`${ocidPrefix}.see_all_link`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-smooth shrink-0"
      >
        {linkLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

const QUICK_LINKS = [
  {
    icon: MapPin,
    label: "Attractions",
    sub: "Beaches, temples & more",
    to: "/places",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: UtensilsCrossed,
    label: "Restaurants",
    sub: "Best local dining",
    to: "/restaurants",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Building2,
    label: "Hotels",
    sub: "Comfortable stays",
    to: "/hotels",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Users,
    label: "Local Guides",
    sub: "Expert companions",
    to: "/guides",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
];

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: places, isLoading: placesLoading } = useFeaturedPlaces();
  const { data: restaurants, isLoading: restaurantsLoading } =
    useFeaturedRestaurants();
  const { data: hotels, isLoading: hotelsLoading } = useFeaturedHotels();

  const STAT_CARDS = [
    {
      icon: MapPin,
      label: "Attractions",
      value: stats?.totalPlaces,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Building2,
      label: "Hotels",
      value: stats?.totalHotels,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Users,
      label: "Local Guides",
      value: stats?.totalGuides,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: UtensilsCrossed,
      label: "Restaurants",
      value: stats?.totalRestaurants,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
  ];

  return (
    <div data-ocid="dashboard.page">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-primary/12 via-background to-accent/8 py-16 md:py-24 border-b border-border"
        data-ocid="dashboard.hero_section"
      >
        <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full bg-accent/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-5">
              <BookOpen className="w-3.5 h-3.5" />
              Smart Tourism Kanyakumari
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08] mb-4">
              Discover <span className="text-primary">Kanyakumari</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Where three oceans meet at India's southernmost tip. Explore
              sacred temples, pristine beaches, local cuisine, and connect with
              guides who call this magical coast home.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/places" data-ocid="dashboard.hero_explore_button">
                <Button
                  size="lg"
                  className="gap-2 font-semibold transition-smooth"
                >
                  <MapPin className="w-4 h-4" />
                  Explore Places
                </Button>
              </Link>
              <Link
                to="/restaurants"
                data-ocid="dashboard.hero_restaurants_button"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 font-semibold transition-smooth"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Best Restaurants
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Ribbon ── */}
      <section
        className="bg-card border-b border-border py-8"
        data-ocid="dashboard.stats_section"
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsLoading
              ? [1, 2, 3, 4].map((k) => <StatSkeleton key={k} />)
              : STAT_CARDS.map(({ icon: Icon, label, value, color, bg }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 surface-card"
                    data-ocid={`dashboard.stat_card.${label.toLowerCase().replace(/ /g, "_")}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground leading-none mb-0.5">
                        {value !== undefined ? value.toString() : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Featured Attractions ── */}
      <section
        className="bg-background py-16 md:py-20"
        data-ocid="dashboard.places_section"
      >
        <div className="container">
          <SectionHeader
            eyebrow="Must-Visit Attractions"
            title="Iconic Places to Explore"
            subtitle="Ancient temples, pristine beaches, and breathtaking viewpoints — every corner of Kanyakumari holds a story."
            linkTo="/places"
            linkLabel="View all attractions"
            ocidPrefix="dashboard.places"
          />
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="dashboard.places_list"
          >
            {placesLoading
              ? [1, 2, 3].map((k) => <CardSkeleton key={k} />)
              : (places ?? []).slice(0, 3).map((place, i) => (
                  <motion.div
                    key={place.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                  >
                    <PlaceCard place={place} index={i} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Featured Restaurants ── */}
      <section
        className="bg-muted/30 border-y border-border py-16 md:py-20"
        data-ocid="dashboard.restaurants_section"
      >
        <div className="container">
          <SectionHeader
            eyebrow="Best Dining Experiences"
            title="Top Restaurants in Kanyakumari"
            subtitle="Fresh seafood, Kerala traditional dishes, and coastal flavours — savour the authentic taste of the southernmost tip."
            linkTo="/restaurants"
            linkLabel="Browse all restaurants"
            ocidPrefix="dashboard.restaurants"
          />
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="dashboard.restaurants_list"
          >
            {restaurantsLoading
              ? [1, 2, 3].map((k) => <CardSkeleton key={k} />)
              : (restaurants ?? []).slice(0, 3).map((restaurant, i) => (
                  <motion.div
                    key={restaurant.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                  >
                    <RestaurantCard restaurant={restaurant} index={i} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Featured Hotels ── */}
      <section
        className="bg-background py-16 md:py-20"
        data-ocid="dashboard.hotels_section"
      >
        <div className="container">
          <SectionHeader
            eyebrow="Handpicked Stays"
            title="Top-Rated Accommodations"
            subtitle="Wake up to ocean sunrises. Curated hotels and resorts for every budget and style."
            linkTo="/hotels"
            linkLabel="Browse all hotels"
            ocidPrefix="dashboard.hotels"
          />
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="dashboard.hotels_list"
          >
            {hotelsLoading
              ? [1, 2, 3].map((k) => <CardSkeleton key={k} />)
              : (hotels ?? []).slice(0, 3).map((hotel, i) => (
                  <motion.div
                    key={hotel.id.toString()}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                  >
                    <HotelCard hotel={hotel} index={i} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section
        className="bg-muted/40 border-t border-border py-14"
        data-ocid="dashboard.quicklinks_section"
      >
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
              Explore More
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              What Would You Like to Do?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map(({ icon: Icon, label, sub, to, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={to as "/places" | "/restaurants" | "/hotels" | "/guides"}
                  data-ocid={`dashboard.quicklink.${label.toLowerCase().replace(/ /g, "_")}`}
                  className="group flex flex-col items-center text-center gap-3 bg-card border border-border rounded-2xl p-6 hover:shadow-elevated hover:border-primary/30 transition-smooth"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-smooth`}
                  >
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm mb-0.5">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Local Guide CTA ── */}
      <section
        className="bg-primary py-16 relative overflow-hidden"
        data-ocid="dashboard.guide_cta_section"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5 pointer-events-none" />
        <div className="container relative text-center max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="w-14 h-14 rounded-full bg-primary-foreground/15 flex items-center justify-center mx-auto mb-5">
              <Phone className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold text-primary-foreground mb-3">
              Connect with a Local Guide
            </h2>
            <p className="text-primary-foreground/80 text-base leading-relaxed mb-7">
              Our certified local guides bring Kanyakumari's stories to life —
              from sacred temples to hidden waterfalls.
            </p>
            <Link to="/guides" data-ocid="dashboard.find_guide_button">
              <Button
                size="lg"
                className="gap-2 font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-smooth"
              >
                <Users className="w-4 h-4" />
                Meet Our Guides
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
