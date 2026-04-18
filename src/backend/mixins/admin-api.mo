import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import PlacesTypes "../types/places";
import HotelsTypes "../types/hotels";
import BookingsTypes "../types/bookings";
import GuidesTypes "../types/guides";
import ReviewsTypes "../types/reviews";
import RestaurantsTypes "../types/restaurants";
import AuthPayment "../types/auth-payment";
import ReviewsLib "../lib/reviews";
import UserAuthLib "../lib/user-auth";
import Common "../types/common";

mixin (
  places : List.List<PlacesTypes.Place>,
  hotels : List.List<HotelsTypes.Hotel>,
  guides : List.List<GuidesTypes.Guide>,
  bookings : List.List<BookingsTypes.Booking>,
  reviews : List.List<ReviewsTypes.Review>,
  restaurants : List.List<RestaurantsTypes.Restaurant>,
  usersByUsername : Map.Map<Text, AuthPayment.UserAccount>,
  adminSet : { var admin : ?Principal },
) {
  func isAdmin(caller : Principal) : Bool {
    switch (adminSet.admin) {
      case (?a) Principal.equal(a, caller);
      case null false;
    };
  };

  public shared ({ caller }) func claimAdmin() : async Bool {
    switch (adminSet.admin) {
      case (?_) Runtime.trap("Admin already assigned");
      case null {
        if (caller.isAnonymous()) Runtime.trap("Must be logged in to claim admin");
        adminSet.admin := ?caller;
        true;
      };
    };
  };

  public query ({ caller }) func isAdminCaller() : async Bool {
    isAdmin(caller);
  };

  public shared ({ caller }) func getDashboardStats() : async Common.DashboardStats {
    if (not isAdmin(caller)) Runtime.trap("Unauthorized: admin only");
    {
      totalPlaces = places.size();
      totalHotels = hotels.size();
      totalGuides = guides.size();
      totalBookings = bookings.size();
      pendingReviews = ReviewsLib.listPendingReviews(reviews).size();
      totalRestaurants = restaurants.size();
      totalUsers = UserAuthLib.countUsers(usersByUsername);
    };
  };
};
