import type { Review } from "../types";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const date = new Date(Number(review.createdAt)).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      data-ocid={`review_card.item.${index + 1}`}
      className="bg-card border border-border rounded-xl p-4 surface-card"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-display font-semibold text-sm shrink-0">
          {review.reviewerName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground truncate">
              {review.reviewerName}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {date}
            </span>
          </div>
          <StarRating rating={Number(review.rating)} size="sm" />
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
          {!review.isApproved && (
            <span className="inline-block mt-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              Pending review
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
