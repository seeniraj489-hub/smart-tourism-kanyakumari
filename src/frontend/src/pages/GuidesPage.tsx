import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Globe, Phone, Search, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import GuideCard from "../components/GuideCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGuides } from "../hooks/useBackend";
import type { GuideSpecialization } from "../types";

const SPECS: (GuideSpecialization | "All")[] = [
  "All",
  "Historical Tours",
  "Cultural Heritage",
  "Nature & Wildlife",
  "Local Cuisine",
  "Photography Tours",
  "Adventure",
];

const SPEC_ICONS: Record<string, string> = {
  All: "🗺️",
  "Historical Tours": "🏛️",
  "Cultural Heritage": "🎭",
  "Nature & Wildlife": "🌿",
  "Local Cuisine": "🍛",
  "Photography Tours": "📸",
  Adventure: "🧗",
};

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState<GuideSpecialization | "All">("All");
  const { data: guides, isLoading } = useGuides();

  const filtered = (guides ?? []).filter((g) => {
    const matchSearch =
      !search ||
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.specialization.toLowerCase().includes(search.toLowerCase()) ||
      g.languagesSpoken.some((l) =>
        l.toLowerCase().includes(search.toLowerCase()),
      );
    const matchSpec = spec === "All" || g.specialization === spec;
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen" data-ocid="guides.page">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-secondary/15 via-accent/8 to-background py-14 border-b border-border">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-xs font-medium mb-4">
              <Globe className="w-3.5 h-3.5" />
              Certified Local Experts
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
              Meet Your Local Guides
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-7 leading-relaxed">
              Explore Kanyakumari's hidden gems with passionate guides born and
              raised in this coastal paradise. Call them directly — no
              middlemen.
            </p>
            <div className="flex items-center gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search by name, specialty or language…"
                  className="pl-9 bg-card"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="guides.search_input"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-5xl py-8">
        {/* Specialization filter pills */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          data-ocid="guides.spec_filter"
        >
          {SPECS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSpec(s)}
              data-ocid="guides.filter.tab"
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                spec === s
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-secondary/50 hover:text-foreground hover:bg-secondary/8"
              }`}
            >
              <span>{SPEC_ICONS[s]}</span>
              {s}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} guide{filtered.length !== 1 ? "s" : ""} found
            {spec !== "All" ? ` in ${spec}` : ""}
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Finding guides…" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="guides.empty_state"
          >
            <span className="text-6xl mb-4">👤</span>
            <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
              No guides found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or selecting a different specialization.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSpec("All");
              }}
              className="text-sm text-accent underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="guides.list"
          >
            {filtered.map((guide, i) => (
              <motion.div
                key={guide.id.toString()}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.08, 0.5), duration: 0.4 }}
              >
                {/* Wrap GuideCard with View Profile link */}
                <div className="relative group">
                  <GuideCard guide={guide} index={i} />
                  <Link
                    to="/guides/$id"
                    params={{ id: guide.id.toString() }}
                    data-ocid={`guides.view_profile.${i + 1}`}
                    className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label={`View profile for ${guide.name}`}
                  />
                  {/* View Profile overlay on hover */}
                  <div className="pointer-events-none absolute bottom-[3.6rem] left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="text-center text-xs font-medium text-accent bg-card/90 border border-accent/20 rounded-lg py-1.5 backdrop-blur-sm">
                      View Full Profile →
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA banner */}
        {!isLoading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 rounded-2xl p-6 text-center"
          >
            <Phone className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Ready to Explore?
            </h3>
            <p className="text-muted-foreground text-sm">
              Click any guide profile to see their full details and call them
              directly on your phone.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
