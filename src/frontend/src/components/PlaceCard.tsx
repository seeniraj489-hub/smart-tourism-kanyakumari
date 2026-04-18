import { Link } from "@tanstack/react-router";
import { Clock, MapIcon, MapPin } from "lucide-react";
import type { Place } from "../types";

interface PlaceCardProps {
  place: Place;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Beach: "bg-accent/15 text-accent border-accent/30",
  Waterfall: "bg-secondary/15 text-secondary border-secondary/30",
  Temple: "bg-primary/15 text-primary border-primary/30",
  Historical: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  Nature: "bg-secondary/15 text-secondary border-secondary/30",
  Viewpoint: "bg-accent/15 text-accent border-accent/30",
  Museum: "bg-muted text-muted-foreground border-border",
};

export default function PlaceCard({ place, index = 0 }: PlaceCardProps) {
  const colorClass =
    CATEGORY_COLORS[place.category] ??
    "bg-muted text-muted-foreground border-border";
  const hasCoords =
    place.latitude !== undefined && place.longitude !== undefined;
  const mapsUrl = hasCoords
    ? `https://maps.google.com/?q=${place.latitude},${place.longitude}`
    : undefined;

  return (
    <div
      data-ocid={`place_card.item.${index + 1}`}
      className="group bg-card rounded-xl overflow-hidden border border-border surface-card hover:shadow-elevated transition-smooth flex flex-col"
    >
      {/* Clickable image + content area */}
      <Link
        to="/places/$id"
        params={{ id: place.id.toString() }}
        className="block flex-1"
      >
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative bg-muted">
          {place.imageUrls[0] ? (
            <img
              src={place.imageUrls[0]}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🏛️
            </div>
          )}
          <span
            className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full border ${colorClass}`}
          >
            {place.category}
          </span>
          {place.isFeatured && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-primary text-primary-foreground">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pb-3">
          <h3 className="font-display font-semibold text-foreground text-base leading-snug mb-1 line-clamp-1">
            {place.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {place.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{place.address.split(",")[0]}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {place.bestTimeToVisit}
            </span>
          </div>
        </div>
      </Link>

      {/* View on Map button */}
      <div className="px-4 pb-4">
        {hasCoords ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`place_card.map_button.${index + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent/60 transition-smooth"
          >
            <MapIcon className="w-3.5 h-3.5" />
            View on Map
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Coordinates not available"
            data-ocid={`place_card.map_button.${index + 1}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold border border-border bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
          >
            <MapPin className="w-3.5 h-3.5" />
            Map Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
