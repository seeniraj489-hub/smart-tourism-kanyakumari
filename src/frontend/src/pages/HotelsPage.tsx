import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import HotelCard from "../components/HotelCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useHotels } from "../hooks/useBackend";

// Picsum seed-based images per hotel name
const HOTEL_IMAGES: Record<string, string[]> = {
  "Sparsa Resorts Kanyakumari": [
    "https://picsum.photos/seed/sparsa-resorts-kk/800/500",
    "https://picsum.photos/seed/sparsa-resorts-pool/800/500",
    "https://picsum.photos/seed/sparsa-resorts-room/800/500",
  ],
  "Hotel Sea View": [
    "https://picsum.photos/seed/hotel-sea-view-kk/800/500",
    "https://picsum.photos/seed/hotel-sea-view-room/800/500",
    "https://picsum.photos/seed/hotel-sea-view-lobby/800/500",
  ],
  "Annai Resorts": [
    "https://picsum.photos/seed/annai-resorts-kk/800/500",
    "https://picsum.photos/seed/annai-resorts-garden/800/500",
    "https://picsum.photos/seed/annai-resorts-spa/800/500",
  ],
  "Hotel Seashore": [
    "https://picsum.photos/seed/hotel-seashore-kk/800/500",
    "https://picsum.photos/seed/hotel-seashore-rooftop/800/500",
  ],
  "Hotel Tri Sea": [
    "https://picsum.photos/seed/hotel-tri-sea-kk/800/500",
    "https://picsum.photos/seed/hotel-tri-sea-ocean/800/500",
  ],
  "The Gopinivas Grand": [
    "https://picsum.photos/seed/gopinivas-grand-kk/800/500",
    "https://picsum.photos/seed/gopinivas-grand-pool/800/500",
    "https://picsum.photos/seed/gopinivas-grand-suite/800/500",
  ],
  // Mock backend hotels
  "Hotel Sangam Kanyakumari": [
    "https://picsum.photos/seed/hotel-sangam-kk/800/500",
    "https://picsum.photos/seed/hotel-sangam-room/800/500",
  ],
  "Sparsa Resort Kanyakumari": [
    "https://picsum.photos/seed/sparsa-resort-kk/800/500",
    "https://picsum.photos/seed/sparsa-resort-pool/800/500",
  ],
  "Hotel Madurai Residency": [
    "https://picsum.photos/seed/hotel-madurai-residency/800/500",
    "https://picsum.photos/seed/hotel-madurai-room/800/500",
  ],
  "Cape Hotel Kanyakumari": [
    "https://picsum.photos/seed/cape-hotel-kk/800/500",
    "https://picsum.photos/seed/cape-hotel-terrace/800/500",
  ],
};

const DEFAULT_HOTEL_IMAGE = [
  "https://picsum.photos/seed/hotel-default-kk/800/500",
];

export function getHotelImages(name: string): string[] {
  return HOTEL_IMAGES[name] ?? DEFAULT_HOTEL_IMAGE;
}

const STAR_FILTERS = [0, 3, 4, 5];

export default function HotelsPage() {
  const [search, setSearch] = useState("");
  const [minStars, setMinStars] = useState(0);
  const { data: hotels, isLoading } = useHotels();

  const filtered = (hotels ?? []).filter((h) => {
    const matchSearch =
      !search || h.name.toLowerCase().includes(search.toLowerCase());
    const matchStars = Number(h.starRating) >= minStars;
    return matchSearch && matchStars;
  });

  // Enrich hotels with picsum images (use backend imageUrls if already set, otherwise override)
  const enriched = filtered.map((h) => {
    const hasRealImage =
      h.imageUrls.length > 0 && h.imageUrls[0].includes("picsum.photos");
    return {
      ...h,
      imageUrls: hasRealImage ? h.imageUrls : getHotelImages(h.name),
    };
  });

  return (
    <div className="min-h-screen" data-ocid="hotels.page">
      {/* Hero / search section */}
      <div className="bg-gradient-to-b from-accent/10 to-background py-12 border-b border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-accent mb-3 border border-accent/30 bg-accent/10 px-3 py-1 rounded-full">
              Kanyakumari Stays
            </span>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Hotels &amp; Resorts
            </h1>
            <p className="text-muted-foreground mb-6">
              Find the perfect stay — from cozy guesthouses to luxury beachfront
              resorts in Kanyakumari.
            </p>
          </motion.div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search hotels by name…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="hotels.search_input"
            />
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Star filters */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          data-ocid="hotels.star_filter"
        >
          {STAR_FILTERS.map((s) => (
            <button
              type="button"
              key={`star-filter-${s}`}
              onClick={() => setMinStars(s)}
              data-ocid="hotels.filter.tab"
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                minStars === s
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {s === 0 ? "All Stars" : `${s}★ & above`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading hotels…" />
          </div>
        ) : enriched.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="hotels.empty_state"
          >
            <span className="text-5xl mb-4">🏨</span>
            <h3 className="font-display text-xl font-semibold mb-2">
              No hotels found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {enriched.length} hotel{enriched.length !== 1 ? "s" : ""} found
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="hotels.list"
            >
              {enriched.map((hotel, i) => (
                <motion.div
                  key={hotel.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.08, 0.4) }}
                >
                  <HotelCard hotel={hotel} index={i} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
