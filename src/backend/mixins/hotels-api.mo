import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import HotelsLib "../lib/hotels";
import HotelsTypes "../types/hotels";
import Common "../types/common";

mixin (
  hotels : List.List<HotelsTypes.Hotel>,
  roomTypes : List.List<HotelsTypes.RoomType>,
  nextHotelId : { var value : Nat },
  nextRoomTypeId : { var value : Nat },
  adminSet : { var admin : ?Principal },
) {
  public shared ({ caller }) func createHotel(input : HotelsTypes.CreateHotelInput) : async HotelsTypes.Hotel {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    let id = nextHotelId.value;
    nextHotelId.value += 1;
    HotelsLib.createHotel(hotels, id, input);
  };

  public shared ({ caller }) func updateHotel(input : HotelsTypes.UpdateHotelInput) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    HotelsLib.updateHotel(hotels, input);
  };

  public shared ({ caller }) func deleteHotel(id : Common.EntityId) : async Bool {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    HotelsLib.deleteHotel(hotels, id);
  };

  public query func getHotel(id : Common.EntityId) : async ?HotelsTypes.Hotel {
    HotelsLib.getHotel(hotels, id);
  };

  public query func listHotels() : async [HotelsTypes.Hotel] {
    HotelsLib.listHotels(hotels);
  };

  public query func searchHotels(term : Text) : async [HotelsTypes.Hotel] {
    HotelsLib.searchHotels(hotels, term);
  };

  public shared ({ caller }) func createRoomType(input : HotelsTypes.CreateRoomTypeInput) : async HotelsTypes.RoomType {
    if (not (switch (adminSet.admin) { case (?a) Principal.equal(a, caller); case null false })) Runtime.trap("Unauthorized: admin only");
    let id = nextRoomTypeId.value;
    nextRoomTypeId.value += 1;
    HotelsLib.createRoomType(roomTypes, id, input);
  };

  public query func getRoomTypesForHotel(hotelId : Common.EntityId) : async [HotelsTypes.RoomType] {
    HotelsLib.getRoomTypesForHotel(roomTypes, hotelId);
  };
};
