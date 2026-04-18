import Common "common";

module {
  public type ReviewTargetType = {
    #hotel;
    #guide;
  };

  public type Review = {
    id : Common.EntityId;
    userId : Common.UserId;
    reviewerName : Text;
    targetType : ReviewTargetType;
    targetId : Common.EntityId;
    rating : Nat;
    comment : Text;
    isApproved : Bool;
    createdAt : Common.Timestamp;
  };

  public type CreateReviewInput = {
    reviewerName : Text;
    targetType : ReviewTargetType;
    targetId : Common.EntityId;
    rating : Nat;
    comment : Text;
  };
};
