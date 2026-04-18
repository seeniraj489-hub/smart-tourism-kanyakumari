import Common "common";

module {
  public type Hotel = {
    id : Common.EntityId;
    name : Text;
    location : Text;
    description : Text;
    imageUrls : [Text];
    amenities : [Text];
    pricePerNight : Nat;
    starRating : Nat;
    totalRooms : Nat;
    createdAt : Common.Timestamp;
  };

  public type RoomType = {
    id : Common.EntityId;
    hotelId : Common.EntityId;
    name : Text;
    description : Text;
    pricePerNight : Nat;
    maxGuests : Nat;
    availability : Nat;
  };

  public type CreateHotelInput = {
    name : Text;
    location : Text;
    description : Text;
    imageUrls : [Text];
    amenities : [Text];
    pricePerNight : Nat;
    starRating : Nat;
    totalRooms : Nat;
  };

  public type UpdateHotelInput = {
    id : Common.EntityId;
    name : Text;
    location : Text;
    description : Text;
    imageUrls : [Text];
    amenities : [Text];
    pricePerNight : Nat;
    starRating : Nat;
    totalRooms : Nat;
  };

  public type CreateRoomTypeInput = {
    hotelId : Common.EntityId;
    name : Text;
    description : Text;
    pricePerNight : Nat;
    maxGuests : Nat;
    availability : Nat;
  };
};
