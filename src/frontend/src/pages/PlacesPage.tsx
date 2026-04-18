import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PlaceCard from "../components/PlaceCard";
import { usePlaces } from "../hooks/useBackend";
import type { Place, PlaceCategory } from "../types";

const CATEGORIES: {
  value: PlaceCategory | "All";
  label: string;
  emoji: string;
}[] = [
  { value: "All", label: "All Places", emoji: "🗺️" },
  { value: "Beach", label: "Beach", emoji: "🏖️" },
  { value: "Temple", label: "Temple", emoji: "🛕" },
  { value: "Waterfall", label: "Waterfall", emoji: "🌊" },
  { value: "Historical", label: "Historical", emoji: "🏛️" },
  { value: "Nature", label: "Nature", emoji: "🌿" },
  { value: "Viewpoint", label: "Viewpoint", emoji: "🔭" },
  { value: "Museum", label: "Museum", emoji: "🏺" },
];

type SectionTab = "all" | "hidden" | "water" | "unique" | "nearby";

const SECTION_TABS: {
  value: SectionTab;
  label: string;
  emoji: string;
  color: string;
}[] = [
  {
    value: "all",
    label: "All Places",
    emoji: "🗺️",
    color: "bg-foreground text-background border-foreground",
  },
  {
    value: "hidden",
    label: "Hidden Gems",
    emoji: "🕵️",
    color: "bg-accent text-accent-foreground border-accent",
  },
  {
    value: "water",
    label: "Water Wonders",
    emoji: "💧",
    color: "bg-secondary text-secondary-foreground border-secondary",
  },
  {
    value: "unique",
    label: "Unique Places",
    emoji: "✨",
    color: "bg-chart-1 text-primary-foreground border-chart-1",
  },
  {
    value: "nearby",
    label: "Nearby Attractions",
    emoji: "📍",
    color: "bg-primary text-primary-foreground border-primary",
  },
];

const CATEGORY_ACTIVE: Record<string, string> = {
  All: "bg-foreground text-background border-foreground",
  Beach: "bg-accent text-accent-foreground border-accent",
  Temple: "bg-primary text-primary-foreground border-primary",
  Waterfall: "bg-secondary text-secondary-foreground border-secondary",
  Historical: "bg-chart-1 text-primary-foreground border-chart-1",
  Nature: "bg-secondary text-secondary-foreground border-secondary",
  Viewpoint: "bg-accent text-accent-foreground border-accent",
  Museum: "bg-muted-foreground text-background border-muted-foreground",
};

const CATEGORY_INACTIVE =
  "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-muted/50";

const SECTION_INACTIVE =
  "bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground hover:bg-muted/40";

function filterBySection(places: Place[], section: SectionTab): Place[] {
  if (section === "all") return places;
  const tagMap: Record<Exclude<SectionTab, "all">, string> = {
    hidden: "hidden",
    water: "water",
    unique: "unique",
    nearby: "nearby",
  };
  return places.filter((p) => p.tags?.includes(tagMap[section]));
}

export default function PlacesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PlaceCategory | "All">("All");
  const [section, setSection] = useState<SectionTab>("all");
  const { data: places, isLoading } = usePlaces(
    category !== "All" ? category : undefined,
  );

  const sectionFiltered = filterBySection(places ?? [], section);

  const filtered = sectionFiltered.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSectionChange = (s: SectionTab) => {
    setSection(s);
    setCategory("All");
  };

  return (
    <div className="min-h-screen" data-ocid="places.page">
      {/* Hero banner */}
      <div className="bg-gradient-to-b from-primary/10 via-accent/5 to-background py-14 border-b border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-3 border border-accent/30 bg-accent/10 px-3 py-1 rounded-full">
              Discover Kanyakumari
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
              Tourist Places
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mb-8 leading-relaxed">
              Explore hidden gems, water wonders, sacred temples, and unique
              attractions where three oceans meet at the tip of India.
            </p>
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search places…"
                className="pl-9 bg-card border-border shadow-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="places.search_input"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-8">
        {/* Section tabs */}
        <div className="mb-5" data-ocid="places.section_filter">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
            Browse by Section
          </p>
          <div className="flex flex-wrap gap-2">
            {SECTION_TABS.map(({ value, label, emoji, color }) => {
              const isActive = section === value;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => handleSectionChange(value)}
                  data-ocid="places.section.tab"
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-smooth ${
                    isActive ? color : SECTION_INACTIVE
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category filters — only shown on "All" section */}
        {section === "all" && (
          <div
            className="flex flex-wrap gap-2 mb-8 pt-4 border-t border-border/50"
            data-ocid="places.category_filter"
          >
            <p className="w-full text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Filter by Category
            </p>
            {CATEGORIES.map(({ value, label, emoji }) => {
              const isActive = category === value;
              const activeClass = CATEGORY_ACTIVE[value] ?? CATEGORY_ACTIVE.All;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setCategory(value)}
                  data-ocid="places.filter.tab"
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                    isActive ? activeClass : CATEGORY_INACTIVE
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Result count */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-sm text-muted-foreground mb-5">
            {filtered.length} {filtered.length === 1 ? "place" : "places"}{" "}
            {search ? `matching "${search}"` : ""}
            {section !== "all"
              ? ` in ${SECTION_TABS.find((s) => s.value === section)?.label}`
              : category !== "All"
                ? ` in ${category}`
                : ""}
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading places…" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center bg-muted/30 rounded-2xl border border-border"
            data-ocid="places.empty_state"
          >
            <span className="text-6xl mb-5">🗺️</span>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No places found
            </h3>
            <p className="text-muted-foreground max-w-xs">
              Try a different search term or select another section or category.
            </p>
            {(search || category !== "All" || section !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setSection("all");
                }}
                className="mt-4 text-sm text-primary hover:underline transition-smooth"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="places.list"
          >
            {filtered.map((place, i) => (
              <motion.div
                key={place.id.toString()}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.4) }}
              >
                <PlaceCard place={place} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
