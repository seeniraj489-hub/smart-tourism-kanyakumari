import Time "mo:core/Time";
import Common "common";

module {
  public type Restaurant = {
    id : Common.EntityId;
    name : Text;
    cuisineTypes : [Text];
    description : Text;
    location : Text;
    address : Text;
    phone : Text;
    ratingAverage : Float;
    priceRange : Nat; // 1=cheap ₹, 2=mid ₹₹, 3=pricey ₹₹₹
    imageUrl : Text;
    hoursOpen : Text;
    isFeatured : Bool;
    createdAt : Common.Timestamp;
  };

  public type CreateRestaurantInput = {
    name : Text;
    cuisineTypes : [Text];
    description : Text;
    location : Text;
    address : Text;
    phone : Text;
    ratingAverage : Float;
    priceRange : Nat;
    imageUrl : Text;
    hoursOpen : Text;
    isFeatured : Bool;
  };
};
