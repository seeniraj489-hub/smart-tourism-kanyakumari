import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

const SIZE_MAP = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  showCount = false,
  count,
}: StarRatingProps) {
  const starClass = SIZE_MAP[size];

  const stars = Array.from({ length: max }, (_, i) => ({
    id: `star-pos-${i + 1}`,
    filled: i < rating,
  }));

  return (
    <div className="flex items-center gap-1">
      {stars.map(({ id, filled }) => (
        <Star
          key={id}
          className={`${starClass} ${
            filled
              ? "fill-chart-5 text-chart-5"
              : "fill-muted text-muted-foreground/40"
          }`}
        />
      ))}
      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}
