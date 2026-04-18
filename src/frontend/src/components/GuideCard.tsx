import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  Binoculars,
  Briefcase,
  Calendar,
  Globe,
  IndianRupee,
  Landmark,
  Leaf,
  Mountain,
  Phone,
  Star,
} from "lucide-react";
import type { Guide } from "../types";

interface GuideCardProps {
  guide: Guide;
  index?: number;
}

/** Map specialization keywords to icons */
function SpecializationIcon({ spec }: { spec: string }) {
  const lower = spec.toLowerCase();
  if (
    lower.includes("heritage") ||
    lower.includes("temple") ||
    lower.includes("history")
  )
    return <Landmark className="w-3.5 h-3.5" />;
  if (
    lower.includes("nature") ||
    lower.includes("wildlife") ||
    lower.includes("forest")
  )
    return <Leaf className="w-3.5 h-3.5" />;
  if (
    lower.includes("adventure") ||
    lower.includes("trek") ||
    lower.includes("hike")
  )
    return <Mountain className="w-3.5 h-3.5" />;
  return <Binoculars className="w-3.5 h-3.5" />;
}

export default function GuideCard({ guide, index = 0 }: GuideCardProps) {
  return (
    <div
      data-ocid={`guide_card.item.${index + 1}`}
      className="bg-card rounded-xl border border-border surface-card overflow-hidden hover:shadow-elevated transition-smooth"
    >
      {/* Header image + avatar */}
      <div className="relative h-28 bg-gradient-to-br from-secondary/20 to-accent/20">
        <div className="absolute -bottom-6 left-4">
          <div className="w-16 h-16 rounded-full border-2 border-card overflow-hidden bg-muted shadow-elevated">
            {guide.imageUrl ? (
              <img
                src={guide.imageUrl}
                alt={guide.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              guide.isAvailable
                ? "bg-secondary/20 text-secondary border border-secondary/30"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {guide.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 p-4">
        <h3 className="font-display font-semibold text-foreground text-base mb-0.5">
          {guide.name}
        </h3>

        {/* Specialization with icon */}
        <div className="flex items-center gap-1.5 text-xs text-accent font-medium mb-2">
          <Briefcase className="w-3.5 h-3.5 text-accent" />
          <span>{guide.specialization}</span>
          <span className="ml-1 text-accent/70">
            <SpecializationIcon spec={guide.specialization} />
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {guide.bio}
        </p>

        {/* Languages */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          <Globe className="w-3.5 h-3.5 text-secondary shrink-0" />
          {guide.languagesSpoken.map((lang) => (
            <span
              key={lang}
              className="text-xs bg-secondary/8 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full"
            >
              {lang}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            {guide.experienceYears.toString()} yrs exp.
          </span>
          <span className="flex items-center gap-0.5 font-semibold text-primary">
            <IndianRupee className="w-3 h-3" />
            {guide.ratePerDay.toLocaleString()}
            <span className="text-muted-foreground font-normal">/day</span>
          </span>
        </div>

        {/* Call button */}
        <a
          href={`tel:${guide.phoneNumber}`}
          data-ocid={`guide_card.call_button.${index + 1}`}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 text-sm font-medium hover:bg-secondary hover:text-secondary-foreground hover:scale-[1.02] transition-smooth"
        >
          <Phone className="w-3.5 h-3.5" />
          {guide.phoneNumber}
        </a>
      </div>
    </div>
  );
}
