import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  Coffee,
  Dumbbell,
  IndianRupee,
  Star,
  Waves,
  Wifi,
} from "lucide-react";
import type { Hotel } from "../types";

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-3 h-3" />,
  "Free WiFi": <Wifi className="w-3 h-3" />,
  Pool: <Waves className="w-3 h-3" />,
  "Swimming Pool": <Waves className="w-3 h-3" />,
  Gym: <Dumbbell className="w-3 h-3" />,
  Fitness: <Dumbbell className="w-3 h-3" />,
  Parking: <Car className="w-3 h-3" />,
  "Free Parking": <Car className="w-3 h-3" />,
  Breakfast: <Coffee className="w-3 h-3" />,
  Restaurant: <Coffee className="w-3 h-3" />,
};

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  return (
    <Link
      to="/hotels/$id"
      params={{ id: hotel.id.toString() }}
      data-ocid={`hotel_card.item.${index + 1}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border surface-card hover:shadow-elevated hover:scale-[1.02] transition-smooth"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative bg-muted">
        {hotel.imageUrls[0] ? (
          <img
            src={hotel.imageUrls[0]}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🏨
          </div>
        )}
        {/* Star rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Star className="w-3 h-3 fill-chart-5 text-chart-5" />
          <span className="text-xs font-semibold text-foreground">
            {hotel.starRating.toString()}/5
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-base leading-snug mb-0.5 line-clamp-1">
          {hotel.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{hotel.location}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {hotel.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {hotel.amenities.slice(0, 4).map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 text-xs bg-secondary/8 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full"
            >
              {AMENITY_ICONS[a] ?? null}
              {a}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-0.5 text-base font-semibold text-primary">
            <IndianRupee className="w-3.5 h-3.5" />
            {hotel.pricePerNight.toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground ml-0.5">
              /night
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-secondary font-medium group-hover:gap-2 transition-smooth">
            Book Now
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
