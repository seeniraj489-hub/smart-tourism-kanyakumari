import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Phone, Star, Users, Waves } from "lucide-react";
import { motion } from "motion/react";
import GuideCard from "../components/GuideCard";
import HotelCard from "../components/HotelCard";
import PlaceCard from "../components/PlaceCard";
import {
  useFeaturedGuides,
  useFeaturedHotels,
  useFeaturedPlaces,
} from "../hooks/useBackend";

// Picsum seed hero image of Kanyakumari coastline
const HERO_BG = "https://picsum.photos/seed/kanyakumari-hero/1600/900";

const STATS = [
  { icon: MapPin, label: "Attractions", value: "25+", color: "text-primary" },
  { icon: Waves, label: "Km of Coast", value: "71", color: "text-accent" },
  { icon: Star, label: "Verified Hotels", value: "40+", color: "text-chart-5" },
  { icon: Users, label: "Local Guides", value: "30+", color: "text-secondary" },
  { icon: Phone, label: "Languages", value: "6+", color: "text-chart-1" },
];

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

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  linkTo: "/places" | "/hotels" | "/guides";
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
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {title}
        </h2>
        <p className="mt-2 text-base text-muted-foreground max-w-xl leading-relaxed">
          {subtitle}
        </p>
      </div>
      <Link
        to={linkTo}
        data-ocid={`${ocidPrefix}.see_all_link`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-smooth shrink-0"
      >
        {linkLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { data: places, isLoading: placesLoading } = useFeaturedPlaces();
  const { data: hotels, isLoading: hotelsLoading } = useFeaturedHotels();
  const { data: guides, isLoading: guidesLoading } = useFeaturedGuides();

  return (
    <div data-ocid="home.page">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        id="hero"
        data-ocid="home.hero_section"
        className="relative overflow-hidden min-h-[92vh] flex items-center"
      >
        {/* Background */}
        <img
          src={HERO_BG}
          alt="Kanyakumari coastline at golden hour"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

        {/* Text content */}
        <div className="relative container flex flex-col gap-7 py-28 md:py-36 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-primary/75 text-primary-foreground mb-5 backdrop-blur-sm">
              Southernmost Tip of India
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.07] text-primary-foreground">
              Discover
              <br />
              <span className="text-chart-5">Kanyakumari</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-lg md:text-xl text-primary-foreground/85 max-w-xl leading-relaxed"
          >
            Where the Bay of Bengal, Arabian Sea, and Indian Ocean converge at
            sunrise. Explore sacred temples, pristine beaches, thundering
            waterfalls, and the warmth of coastal communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/places" data-ocid="home.hero_places_button">
              <Button
                size="lg"
                className="gap-2 font-semibold shadow-elevated transition-smooth"
              >
                <MapPin className="w-4 h-4" />
                Explore Places
              </Button>
            </Link>
            <Link to="/hotels" data-ocid="home.hero_hotels_button">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold bg-card/15 border-primary-foreground/40 text-primary-foreground hover:bg-card/30 backdrop-blur-sm transition-smooth"
              >
                Find Hotels
              </Button>
            </Link>
            <Link to="/guides" data-ocid="home.hero_guides_button">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold bg-card/15 border-primary-foreground/40 text-primary-foreground hover:bg-card/30 backdrop-blur-sm transition-smooth"
              >
                <Phone className="w-4 h-4" />
                Local Guides
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.52 }}
          className="absolute bottom-0 inset-x-0 bg-card/90 backdrop-blur-md border-t border-border"
          data-ocid="home.stats_section"
        >
          <div className="container py-5">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 divide-x divide-border/60">
              {STATS.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-0.5 px-3 first:pl-0 last:pr-0"
                >
                  <Icon className={`w-4 h-4 ${color} mb-0.5`} />
                  <span className="font-display text-xl font-bold text-foreground">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground text-center leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Featured Places ───────────────────────────────────── */}
      <section
        id="places"
        data-ocid="home.places_section"
        className="bg-background py-20 md:py-28 scroll-mt-16"
      >
        <div className="container">
          <SectionHeader
            eyebrow="Must-Visit Attractions"
            title="Iconic Places to Explore"
            subtitle="From ancient temples to pristine beaches — every corner of Kanyakumari holds a story waiting to be discovered."
            linkTo="/places"
            linkLabel="View all places"
            ocidPrefix="home.places"
          />

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="home.places_list"
          >
            {placesLoading
              ? [1, 2, 3].map((k) => <CardSkeleton key={k} />)
              : (places ?? []).slice(0, 3).map((place, i) => (
                  <motion.div
                    key={place.id.toString()}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <PlaceCard place={place} index={i} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Pull-quote divider ────────────────────────────────── */}
      <div className="bg-muted/40 border-y border-border py-12">
        <div className="container text-center">
          <p className="font-display italic text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            "Where the Bay of Bengal, the Arabian Sea, and the Indian Ocean
            converge — Kanyakumari is truly where India ends and wonder begins."
          </p>
        </div>
      </div>

      {/* ── Featured Hotels ───────────────────────────────────── */}
      <section
        id="hotels"
        data-ocid="home.hotels_section"
        className="bg-muted/30 py-20 md:py-28 scroll-mt-16"
      >
        <div className="container">
          <SectionHeader
            eyebrow="Charming Stays"
            title="Handpicked Accommodations"
            subtitle="Wake up to ocean sunrises and coastal breezes. Carefully selected hotels and resorts for every budget and style."
            linkTo="/hotels"
            linkLabel="Browse all hotels"
            ocidPrefix="home.hotels"
          />

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="home.hotels_list"
          >
            {hotelsLoading
              ? [1, 2, 3].map((k) => <CardSkeleton key={k} />)
              : (hotels ?? []).slice(0, 3).map((hotel, i) => (
                  <motion.div
                    key={hotel.id.toString()}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -18 : 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                  >
                    <HotelCard hotel={hotel} index={i} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Local Guides ──────────────────────────────────────── */}
      <section
        id="guides"
        data-ocid="home.guides_section"
        className="bg-background py-20 md:py-28 scroll-mt-16"
      >
        <div className="container">
          <SectionHeader
            eyebrow="Local Experts"
            title="Connect with Certified Guides"
            subtitle="Our local guides are passionate storytellers, naturalists, and cultural ambassadors who bring Kanyakumari's soul to life."
            linkTo="/guides"
            linkLabel="Meet all guides"
            ocidPrefix="home.guides"
          />

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="home.guides_list"
          >
            {guidesLoading
              ? [1, 2, 3].map((k) => <CardSkeleton key={k} />)
              : (guides ?? []).slice(0, 3).map((guide, i) => (
                  <motion.div
                    key={guide.id.toString()}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                  >
                    <GuideCard guide={guide} index={i} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section
        data-ocid="home.cta_section"
        className="bg-primary py-20 md:py-28 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-foreground/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-20 w-72 h-72 rounded-full bg-primary-foreground/5 pointer-events-none" />

        <div className="container relative text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground leading-tight mb-4">
              Ready to Experience Kanyakumari?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Book your stay, discover hidden gems, and connect with guides who
              call this magical land home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/places" data-ocid="home.cta_places_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 font-semibold border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/15 transition-smooth"
                >
                  <MapPin className="w-4 h-4" />
                  Explore Places
                </Button>
              </Link>
              <Link to="/hotels" data-ocid="home.cta_hotels_button">
                <Button
                  size="lg"
                  className="gap-2 font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-smooth"
                >
                  Book a Stay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
