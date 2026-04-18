import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare, Star, XCircle } from "lucide-react";
import { useState } from "react";
import StarRating from "../components/StarRating";
import type { Review } from "../types";
import { AdminMobileNav, AdminSidebar } from "./AdminDashboardPage";

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1n,
    userId: "user1",
    reviewerName: "Priya Nair",
    targetType: "Place",
    targetId: 1n,
    rating: 5n,
    comment:
      "Absolutely breathtaking! Visiting Vivekananda Rock at sunrise was a life-changing experience. The spiritual energy of the place is incredible.",
    isApproved: false,
    createdAt: BigInt(Date.now() - 86400000),
  },
  {
    id: 2n,
    userId: "user2",
    reviewerName: "Arjun Krishnan",
    targetType: "Hotel",
    targetId: 1n,
    rating: 4n,
    comment:
      "Sparsa Resorts was excellent — great food, comfortable rooms, and the ocean view was stunning. Would highly recommend for a relaxing stay.",
    isApproved: false,
    createdAt: BigInt(Date.now() - 172800000),
  },
  {
    id: 3n,
    userId: "user3",
    reviewerName: "Lakshmi Devi",
    targetType: "Guide",
    targetId: 1n,
    rating: 5n,
    comment:
      "Rajan was an exceptional guide! His knowledge of local history and his storytelling made the trip unforgettable. Highly recommended!",
    isApproved: true,
    createdAt: BigInt(Date.now() - 259200000),
  },
];

const TARGET_BADGE: Record<string, { label: string; color: string }> = {
  Place: {
    label: "Place",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  Hotel: {
    label: "Hotel",
    color: "bg-accent/15 text-accent-foreground border-accent/20",
  },
  Guide: {
    label: "Guide",
    color: "bg-secondary/15 text-secondary-foreground border-secondary/20",
  },
};

function ReviewRow({
  review,
  index,
  onApprove,
  onReject,
}: {
  review: Review;
  index: number;
  onApprove: (id: bigint) => void;
  onReject: (id: bigint) => void;
}) {
  const badge = TARGET_BADGE[review.targetType];

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 surface-card"
      data-ocid={`admin.reviews.pending.item.${index}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
              {review.reviewerName.charAt(0)}
            </div>
            <span className="font-semibold text-sm text-foreground">
              {review.reviewerName}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}
            >
              {badge.label}
            </span>
            <StarRating rating={Number(review.rating)} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {review.comment}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onApprove(review.id)}
            className="border-secondary/40 text-secondary-foreground hover:bg-secondary/15 transition-smooth"
            data-ocid={`admin.reviews.approve_button.${index}`}
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(review.id)}
            className="border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth"
            data-ocid={`admin.reviews.reject_button.${index}`}
          >
            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const handleApprove = (id: bigint) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)),
    );
  };

  const handleReject = (id: bigint) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)]"
      data-ocid="admin.reviews_page"
    >
      <AdminSidebar activePath="/admin/reviews" />

      <div className="flex-1 min-w-0">
        <AdminMobileNav activePath="/admin/reviews" />

        <div className="p-6 lg:p-8 bg-background min-h-full">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
                Reviews
              </h1>
              <p className="text-sm text-muted-foreground">
                Moderate user-submitted reviews
              </p>
            </div>
            {pending.length > 0 && (
              <span
                className="bg-destructive/15 text-destructive text-xs px-3 py-1 rounded-full border border-destructive/20 font-medium"
                data-ocid="admin.reviews.pending_badge"
              >
                {pending.length} pending
              </span>
            )}
          </div>

          {/* Pending reviews */}
          <section className="mb-10" data-ocid="admin.reviews.pending_section">
            <h2 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-chart-5" />
              Pending Approval
              <span className="text-xs text-muted-foreground font-normal">
                ({pending.length})
              </span>
            </h2>

            {pending.length === 0 ? (
              <div
                className="text-center py-10 bg-card border border-dashed border-border rounded-xl"
                data-ocid="admin.reviews.pending_empty_state"
              >
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground font-medium">
                  All caught up!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  No reviews awaiting approval
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((review, i) => (
                  <ReviewRow
                    key={review.id.toString()}
                    review={review}
                    index={i + 1}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Approved reviews */}
          <section data-ocid="admin.reviews.approved_section">
            <h2 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-secondary" />
              Approved Reviews
              <span className="text-xs text-muted-foreground font-normal">
                ({approved.length})
              </span>
            </h2>

            {approved.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No approved reviews yet.
              </div>
            ) : (
              <div className="space-y-3">
                {approved.map((review, i) => {
                  const badge = TARGET_BADGE[review.targetType];
                  return (
                    <div
                      key={review.id.toString()}
                      className="bg-card border border-border rounded-xl p-4 opacity-70 hover:opacity-100 transition-smooth"
                      data-ocid={`admin.reviews.approved.item.${i + 1}`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-semibold text-sm text-foreground">
                          {review.reviewerName}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                        <StarRating rating={Number(review.rating)} size="sm" />
                        <span className="ml-auto text-xs bg-secondary/15 text-secondary-foreground px-2 py-0.5 rounded-full border border-secondary/20">
                          ✓ Approved
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
