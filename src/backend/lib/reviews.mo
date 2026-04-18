import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/reviews";
import Common "../types/common";

module {
  public func createReview(
    reviews : List.List<Types.Review>,
    nextId : Nat,
    userId : Common.UserId,
    input : Types.CreateReviewInput,
  ) : Types.Review {
    let review : Types.Review = {
      id = nextId;
      userId;
      reviewerName = input.reviewerName;
      targetType = input.targetType;
      targetId = input.targetId;
      rating = if (input.rating > 5) 5 else input.rating;
      comment = input.comment;
      isApproved = false;
      createdAt = Time.now();
    };
    reviews.add(review);
    review;
  };

  public func approveReview(
    reviews : List.List<Types.Review>,
    id : Common.EntityId,
  ) : Bool {
    var found = false;
    reviews.mapInPlace(func(r) {
      if (r.id == id) {
        found := true;
        { r with isApproved = true };
      } else { r };
    });
    found;
  };

  public func rejectReview(
    reviews : List.List<Types.Review>,
    id : Common.EntityId,
  ) : Bool {
    let sizeBefore = reviews.size();
    let filtered = reviews.filter(func(r) { r.id != id });
    reviews.clear();
    reviews.append(filtered);
    reviews.size() < sizeBefore;
  };

  public func getReviewsForTarget(
    reviews : List.List<Types.Review>,
    targetType : Types.ReviewTargetType,
    targetId : Common.EntityId,
  ) : [Types.Review] {
    reviews.filter(func(r) {
      r.isApproved and r.targetId == targetId and
      (switch (r.targetType, targetType) {
        case (#hotel, #hotel) true;
        case (#guide, #guide) true;
        case _ false;
      });
    }).toArray();
  };

  public func listPendingReviews(reviews : List.List<Types.Review>) : [Types.Review] {
    reviews.filter(func(r) { not r.isApproved }).toArray();
  };

  public func seedSampleReviews(
    reviews : List.List<Types.Review>,
    nextIdRef : { var value : Nat },
    sampleUserId : Common.UserId,
  ) {
    // Approved reviews for hotels (ids 1–4) and guides (ids 1–4)
    type ReviewSeed = {
      reviewerName : Text;
      targetType : Types.ReviewTargetType;
      targetId : Common.EntityId;
      rating : Nat;
      comment : Text;
    };
    let seeds : [ReviewSeed] = [
      {
        reviewerName = "Priya Nair";
        targetType = #hotel;
        targetId = 1;
        rating = 5;
        comment = "Fantastic hotel with stunning sea views! The staff were incredibly warm and the food was delicious. Highly recommend for anyone visiting Kanyakumari.";
      },
      {
        reviewerName = "Rajesh Kumar";
        targetType = #hotel;
        targetId = 1;
        rating = 4;
        comment = "Great location, clean rooms and good service. The breakfast spread was excellent. A bit pricey but worth it for the experience.";
      },
      {
        reviewerName = "Sunita Mehta";
        targetType = #hotel;
        targetId = 2;
        rating = 5;
        comment = "The resort is absolutely beautiful with a wonderful pool and spa. Perfect for a relaxing getaway. The staff went above and beyond.";
      },
      {
        reviewerName = "Arjun Sharma";
        targetType = #hotel;
        targetId = 3;
        rating = 4;
        comment = "Good value for money. Clean, comfortable rooms and friendly staff. Very close to the beach, which is a huge plus!";
      },
      {
        reviewerName = "Deepa Krishnan";
        targetType = #hotel;
        targetId = 4;
        rating = 5;
        comment = "Woke up to the most amazing sunrise I have ever seen! The heritage decor is beautiful and the rooftop terrace is a must.";
      },
      {
        reviewerName = "Venkat Raman";
        targetType = #guide;
        targetId = 1;
        rating = 5;
        comment = "Murugan is an absolute gem! His knowledge of local history and temples is extraordinary. Made our trip truly memorable.";
      },
      {
        reviewerName = "Meena Anand";
        targetType = #guide;
        targetId = 2;
        rating = 5;
        comment = "Lakshmi took us on an amazing nature walk. She identified birds we had never seen before and knew every hidden viewpoint. Simply superb!";
      },
      {
        reviewerName = "Vikram Iyer";
        targetType = #guide;
        targetId = 3;
        rating = 4;
        comment = "Arjun organized a fantastic kayaking tour along the coast. Safety was a priority and the experience was thrilling. Highly recommended for adventure lovers.";
      },
      {
        reviewerName = "Kavitha Suresh";
        targetType = #guide;
        targetId = 4;
        rating = 5;
        comment = "Valli made sure we didn't miss a single thing in Kanyakumari. From sunrise at the beach to the best local restaurants, she covered it all. Wonderful guide!";
      },
    ];
    for (seed in seeds.values()) {
      let id = nextIdRef.value;
      nextIdRef.value += 1;
      let review : Types.Review = {
        id;
        userId = sampleUserId;
        reviewerName = seed.reviewerName;
        targetType = seed.targetType;
        targetId = seed.targetId;
        rating = seed.rating;
        comment = seed.comment;
        isApproved = true;
        createdAt = Time.now();
      };
      reviews.add(review);
    };
  };
};
