import Time "mo:core/Time";

module {
  public type Timestamp = Time.Time;
  public type UserId = Principal;
  public type EntityId = Nat;

  public type DashboardStats = {
    totalPlaces : Nat;
    totalHotels : Nat;
    totalGuides : Nat;
    totalBookings : Nat;
    pendingReviews : Nat;
    totalRestaurants : Nat;
    totalUsers : Nat;
  };
};
