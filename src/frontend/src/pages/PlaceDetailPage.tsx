import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  MapIcon,
  MapPin,
  MessageSquare,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import ImageGallery from "../components/ImageGallery";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";
import { usePlace } from "../hooks/useBackend";
import type { Review } from "../types";

// Seed-based picsum images per place id for variety
const PLACE_IMAGES: Record<string, string[]> = {
  "1": [
    "https://picsum.photos/seed/vivekananda/800/500",
    "https://picsum.photos/seed/kanyakumari-rock/800/500",
    "https://picsum.photos/seed/ocean-memorial/800/500",
  ],
  "2": [
    "https://picsum.photos/seed/sangam-beach/800/500",
    "https://picsum.photos/seed/sunrise-tip/800/500",
    "https://picsum.photos/seed/ocean-convergence/800/500",
  ],
  "3": [
    "https://picsum.photos/seed/thirparappu/800/500",
    "https://picsum.photos/seed/kodayar-falls/800/500",
    "https://picsum.photos/seed/tropical-waterfall/800/500",
  ],
  "4": [
    "https://picsum.photos/seed/kumari-temple/800/500",
    "https://picsum.photos/seed/shakti-peetha/800/500",
    "https://picsum.photos/seed/kanyakumari-temple/800/500",
  ],
  "5": [
    "https://picsum.photos/seed/padmanabhapuram/800/500",
    "https://picsum.photos/seed/travancore-palace/800/500",
    "https://picsum.photos/seed/kerala-woodwork/800/500",
  ],
  "6": [
    "https://picsum.photos/seed/mathur-aqueduct/800/500",
    "https://picsum.photos/seed/pahrali-river/800/500",
    "https://picsum.photos/seed/western-ghats-bridge/800/500",
  ],
};

// Sample reviews per place
const PLACE_REVIEWS: Record<string, Review[]> = {
  "1": [
    {
      id: 1n,
      userId: "user1",
      reviewerName: "Arjun Ramesh",
      targetType: "Place",
      targetId: 1n,
      rating: 5n,
      comment:
        "Absolutely breathtaking! The ferry ride to the rock itself is an adventure. The meditation hall inside Vivekananda's room is deeply spiritual. A must-visit.",
      isApproved: true,
      createdAt: 1705000000000n,
    },
    {
      id: 2n,
      userId: "user2",
      reviewerName: "Priya Nair",
      targetType: "Place",
      targetId: 1n,
      rating: 5n,
      comment:
        "Watching the sunrise from here is a life-changing experience. The three oceans meeting at the tip of India gives you chills. Very well maintained.",
      isApproved: true,
      createdAt: 1707000000000n,
    },
    {
      id: 3n,
      userId: "user3",
      reviewerName: "Vikram Subramaniam",
      targetType: "Place",
      targetId: 1n,
      rating: 4n,
      comment:
        "A truly iconic landmark. Can get crowded during peak season, but the experience is worth it. Arrive early to beat the queues for the ferry.",
      isApproved: true,
      createdAt: 1709000000000n,
    },
  ],
  "2": [
    {
      id: 4n,
      userId: "user4",
      reviewerName: "Divya Krishnamurthy",
      targetType: "Place",
      targetId: 2n,
      rating: 5n,
      comment:
        "Witnessing the sunrise at Sangam is like watching nature paint the sky in gold. Standing at the southernmost tip of India is incredibly humbling.",
      isApproved: true,
      createdAt: 1706000000000n,
    },
    {
      id: 5n,
      userId: "user5",
      reviewerName: "Karthik Balaji",
      targetType: "Place",
      targetId: 2n,
      rating: 4n,
      comment:
        "The beach is clean and the views are spectacular. The convergence of the three seas with their distinct colors is truly unique in the world.",
      isApproved: true,
      createdAt: 1708000000000n,
    },
  ],
  "3": [
    {
      id: 6n,
      userId: "user6",
      reviewerName: "Ananya Pillai",
      targetType: "Place",
      targetId: 3n,
      rating: 5n,
      comment:
        "The waterfall is magnificent especially after monsoon. The natural bathing pool is refreshing. The surrounding forest is lush and serene.",
      isApproved: true,
      createdAt: 1705500000000n,
    },
    {
      id: 7n,
      userId: "user7",
      reviewerName: "Suresh Menon",
      targetType: "Place",
      targetId: 3n,
      rating: 4n,
      comment:
        "A great picnic spot for families. The waterfall view is stunning. Can be slippery near the rocks — wear good footwear.",
      isApproved: true,
      createdAt: 1707500000000n,
    },
  ],
  "4": [
    {
      id: 8n,
      userId: "user8",
      reviewerName: "Lakshmi Iyer",
      targetType: "Place",
      targetId: 4n,
      rating: 5n,
      comment:
        "One of the most powerful Shakti temples I have visited. The ocean backdrop adds to the divine atmosphere. Dress code is strictly followed.",
      isApproved: true,
      createdAt: 1706500000000n,
    },
    {
      id: 9n,
      userId: "user9",
      reviewerName: "Mani Thevar",
      targetType: "Place",
      targetId: 4n,
      rating: 5n,
      comment:
        "A deeply spiritual place. The temple is beautifully maintained. The sound of the ocean waves during prayers is an unforgettable experience.",
      isApproved: true,
      createdAt: 1708500000000n,
    },
  ],
  "5": [
    {
      id: 10n,
      userId: "user10",
      reviewerName: "Revathi Varma",
      targetType: "Place",
      targetId: 5n,
      rating: 5n,
      comment:
        "The intricate wooden architecture is jaw-dropping. The palace is huge and each room tells a story about the Travancore dynasty. A must for history buffs.",
      isApproved: true,
      createdAt: 1705200000000n,
    },
    {
      id: 11n,
      userId: "user11",
      reviewerName: "Bala Chandran",
      targetType: "Place",
      targetId: 5n,
      rating: 4n,
      comment:
        "Excellent preservation of heritage architecture. The mica windows and hanging lamps are unique. Allow at least 2 hours to explore fully.",
      isApproved: true,
      createdAt: 1707200000000n,
    },
  ],
  "6": [
    {
      id: 12n,
      userId: "user12",
      reviewerName: "Senthil Nathan",
      targetType: "Place",
      targetId: 6n,
      rating: 4n,
      comment:
        "The views from the aqueduct are stunning — the river valley stretches for miles. Best visited in the morning when the mist is still on the mountains.",
      isApproved: true,
      createdAt: 1706200000000n,
    },
    {
      id: 13n,
      userId: "user13",
      reviewerName: "Geetha Murugan",
      targetType: "Place",
      targetId: 6n,
      rating: 4n,
      comment:
        "Unique landmark and engineering marvel. The surrounding landscape of the Western Ghats is breathtaking. A hidden gem worth visiting.",
      isApproved: true,
      createdAt: 1708200000000n,
    },
  ],
};

const CATEGORY_BADGE: Record<string, string> = {
  Beach: "bg-accent/15 text-accent border-accent/30",
  Waterfall: "bg-secondary/15 text-secondary border-secondary/30",
  Temple: "bg-primary/15 text-primary border-primary/30",
  Historical: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  Nature: "bg-secondary/15 text-secondary border-secondary/30",
  Viewpoint: "bg-accent/15 text-accent border-accent/30",
  Museum: "bg-muted text-muted-foreground border-border",
};

export default function PlaceDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: place, isLoading } = usePlace(id ? BigInt(id) : undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner text="Loading place details…" />
      </div>
    );
  }

  if (!place) {
    return (
      <div
        className="container py-20 text-center"
        data-ocid="place_detail.error_state"
      >
        <span className="text-6xl mb-4 block">🗺️</span>
        <h2 className="font-display text-2xl font-bold mb-3">
          Place not found
        </h2>
        <p className="text-muted-foreground mb-5">
          This destination doesn't exist or may have been removed.
        </p>
        <Link
          to="/places"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all places
        </Link>
      </div>
    );
  }

  const images = PLACE_IMAGES[id] ?? place.imageUrls;
  const reviews = PLACE_REVIEWS[id] ?? [];
  const approvedReviews = reviews.filter((r) => r.isApproved);
  const avgRating =
    approvedReviews.length > 0
      ? Math.round(
          approvedReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
            approvedReviews.length,
        )
      : 0;
  const badgeClass =
    CATEGORY_BADGE[place.category] ??
    "bg-muted text-muted-foreground border-border";

  const hasCoords =
    place.latitude !== undefined && place.longitude !== undefined;
  const mapsUrl = hasCoords
    ? `https://maps.google.com/?q=${place.latitude},${place.longitude}`
    : undefined;
  const embedUrl = hasCoords
    ? `https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`
    : undefined;

  return (
    <div data-ocid="place_detail.page">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <Link
            to="/places"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-smooth"
            data-ocid="place_detail.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tourist Places
          </Link>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        {/* Top layout: gallery + info */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <ImageGallery images={images} alt={place.name} />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            {/* Category + featured badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full border ${badgeClass}`}
              >
                {place.category}
              </span>
              {place.isFeatured && (
                <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/15">
                  ⭐ Featured
                </Badge>
              )}
              {approvedReviews.length > 0 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <StarRating rating={avgRating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {avgRating}/5 · {approvedReviews.length}{" "}
                    {approvedReviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {place.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-7 text-base">
              {place.description}
            </p>

            {/* Details card */}
            <div className="space-y-4 bg-muted/30 rounded-2xl p-5 border border-border mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Address
                  </p>
                  <p className="text-sm text-foreground leading-snug">
                    {place.address}
                  </p>
                </div>
                {/* View on Map button (inline with address) */}
                {hasCoords && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="place_detail.view_on_map_button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/60 transition-smooth shrink-0"
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View on Map</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
              </div>
              <div className="border-t border-border" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Best Time to Visit
                  </p>
                  <p className="text-sm text-foreground">
                    {place.bestTimeToVisit}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 text-secondary border border-secondary/30 rounded-xl text-sm font-medium hover:bg-secondary/20 transition-smooth"
              data-ocid="place_detail.find_guide_button"
            >
              🧭 Find a Local Guide for This Place
            </Link>
          </motion.div>
        </div>

        {/* Location Map section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
          data-ocid="place_detail.map_section"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Location Map
            </h2>
            {hasCoords && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="place_detail.open_maps_link"
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-smooth border border-accent/30 bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Google Maps
              </a>
            )}
          </div>

          {hasCoords ? (
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <iframe
                src={embedUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${place.name}`}
                data-ocid="place_detail.map_embed"
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-14 text-center bg-muted/20 rounded-2xl border border-border border-dashed"
              data-ocid="place_detail.map_unavailable"
            >
              <MapPin className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground font-medium">
                Map not available for this location.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Coordinates have not been added yet.
              </p>
            </div>
          )}
        </motion.div>

        {/* Reviews section */}
        <div
          className="border-t border-border pt-10"
          data-ocid="place_detail.reviews_section"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Visitor Reviews
              </h2>
            </div>
            {approvedReviews.length > 0 && (
              <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl px-4 py-2">
                <Star className="w-4 h-4 fill-chart-5 text-chart-5" />
                <span className="font-display font-bold text-foreground text-lg leading-none">
                  {avgRating}
                </span>
                <span className="text-xs text-muted-foreground">
                  / 5 · {approvedReviews.length}{" "}
                  {approvedReviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}
          </div>

          {approvedReviews.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-14 text-center bg-muted/20 rounded-2xl border border-border"
              data-ocid="place_detail.reviews.empty_state"
            >
              <span className="text-5xl mb-4">💬</span>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No reviews yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Be the first to share your experience at this place.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-ocid="place_detail.reviews.list"
            >
              {approvedReviews.map((review, i) => (
                <motion.div
                  key={review.id.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ReviewCard review={review} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
