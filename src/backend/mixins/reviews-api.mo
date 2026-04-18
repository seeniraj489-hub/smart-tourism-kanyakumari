import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import ReviewsLib "../lib/reviews";
import ReviewsTypes "../types/reviews";
import Common "../types/common";

mixin (
  reviews : List.List<ReviewsTypes.Review>,
  nextReviewId : { var value : Nat },
  adminSet : { var admin : ?Principal },
) {
  public shared ({ caller }) func approveReview(id : Common.EntityId) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    ReviewsLib.approveReview(reviews, id);
  };

  public shared ({ caller }) func rejectReview(id : Common.EntityId) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    ReviewsLib.rejectReview(reviews, id);
  };

  public query func getReviewsForTarget(targetType : ReviewsTypes.ReviewTargetType, targetId : Common.EntityId) : async [ReviewsTypes.Review] {
    ReviewsLib.getReviewsForTarget(reviews, targetType, targetId);
  };

  public shared ({ caller }) func listPendingReviews() : async [ReviewsTypes.Review] {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    ReviewsLib.listPendingReviews(reviews);
  };
};
