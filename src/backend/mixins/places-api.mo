import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import PlacesLib "../lib/places";
import PlacesTypes "../types/places";
import Common "../types/common";

mixin (
  places : List.List<PlacesTypes.Place>,
  nextPlaceId : { var value : Nat },
  adminSet : { var admin : ?Principal },
) {
  public shared ({ caller }) func createPlace(input : PlacesTypes.CreatePlaceInput) : async PlacesTypes.Place {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    let id = nextPlaceId.value;
    nextPlaceId.value += 1;
    PlacesLib.createPlace(places, id, input);
  };

  public shared ({ caller }) func updatePlace(input : PlacesTypes.UpdatePlaceInput) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    PlacesLib.updatePlace(places, input);
  };

  public shared ({ caller }) func deletePlace(id : Common.EntityId) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    PlacesLib.deletePlace(places, id);
  };

  public query func getPlace(id : Common.EntityId) : async ?PlacesTypes.Place {
    PlacesLib.getPlace(places, id);
  };

  public query func listPlaces() : async [PlacesTypes.Place] {
    PlacesLib.listPlaces(places);
  };

  public query func listFeaturedPlaces() : async [PlacesTypes.Place] {
    PlacesLib.listFeaturedPlaces(places);
  };

  public query func searchPlaces(term : Text, category : ?PlacesTypes.PlaceCategory) : async [PlacesTypes.Place] {
    PlacesLib.searchPlaces(places, term, category);
  };
};
