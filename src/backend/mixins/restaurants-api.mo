import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Types "../types/restaurants";
import RestaurantsLib "../lib/restaurants";
import Common "../types/common";

mixin (
  restaurants : List.List<Types.Restaurant>,
  nextRestaurantIdRef : { var value : Nat },
  adminSet : { var admin : ?Principal },
) {
  func checkIsAdmin(caller : Principal) : Bool {
    switch (adminSet.admin) {
      case (?a) Principal.equal(a, caller);
      case null false;
    };
  };

  public query func listRestaurants() : async [Types.Restaurant] {
    RestaurantsLib.listRestaurants(restaurants);
  };

  public query func listFeaturedRestaurants() : async [Types.Restaurant] {
    RestaurantsLib.listFeaturedRestaurants(restaurants);
  };

  public query func getRestaurant(id : Common.EntityId) : async ?Types.Restaurant {
    RestaurantsLib.getRestaurant(restaurants, id);
  };

  public query func searchRestaurants(term : Text) : async [Types.Restaurant] {
    RestaurantsLib.searchRestaurants(restaurants, term);
  };

  public shared ({ caller }) func createRestaurant(input : Types.CreateRestaurantInput) : async Types.Restaurant {
    if (not checkIsAdmin(caller)) Runtime.trap("Unauthorized: admin only");
    let id = nextRestaurantIdRef.value;
    nextRestaurantIdRef.value += 1;
    RestaurantsLib.createRestaurant(restaurants, id, input);
  };

  public shared ({ caller }) func deleteRestaurant(id : Common.EntityId) : async Bool {
    if (not checkIsAdmin(caller)) Runtime.trap("Unauthorized: admin only");
    RestaurantsLib.deleteRestaurant(restaurants, id);
  };
};
