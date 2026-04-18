import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/hotels";
import Common "../types/common";

module {
  public func createHotel(
    hotels : List.List<Types.Hotel>,
    nextId : Nat,
    input : Types.CreateHotelInput,
  ) : Types.Hotel {
    let hotel : Types.Hotel = {
      id = nextId;
      name = input.name;
      location = input.location;
      description = input.description;
      imageUrls = input.imageUrls;
      amenities = input.amenities;
      pricePerNight = input.pricePerNight;
      starRating = input.starRating;
      totalRooms = input.totalRooms;
      createdAt = Time.now();
    };
    hotels.add(hotel);
    hotel;
  };

  public func updateHotel(
    hotels : List.List<Types.Hotel>,
    input : Types.UpdateHotelInput,
  ) : Bool {
    var found = false;
    hotels.mapInPlace(func(h) {
      if (h.id == input.id) {
        found := true;
        {
          h with
          name = input.name;
          location = input.location;
          description = input.description;
          imageUrls = input.imageUrls;
          amenities = input.amenities;
          pricePerNight = input.pricePerNight;
          starRating = input.starRating;
          totalRooms = input.totalRooms;
        };
      } else { h };
    });
    found;
  };

  public func deleteHotel(
    hotels : List.List<Types.Hotel>,
    id : Common.EntityId,
  ) : Bool {
    let sizeBefore = hotels.size();
    let filtered = hotels.filter(func(h) { h.id != id });
    hotels.clear();
    hotels.append(filtered);
    hotels.size() < sizeBefore;
  };

  public func getHotel(
    hotels : List.List<Types.Hotel>,
    id : Common.EntityId,
  ) : ?Types.Hotel {
    hotels.find(func(h) { h.id == id });
  };

  public func listHotels(hotels : List.List<Types.Hotel>) : [Types.Hotel] {
    hotels.toArray();
  };

  public func searchHotels(
    hotels : List.List<Types.Hotel>,
    term : Text,
  ) : [Types.Hotel] {
    let lowerTerm = term.toLower();
    hotels.filter(func(h) {
      term == "" or
        h.name.toLower().contains(#text lowerTerm) or
        h.description.toLower().contains(#text lowerTerm) or
        h.location.toLower().contains(#text lowerTerm);
    }).toArray();
  };

  public func createRoomType(
    roomTypes : List.List<Types.RoomType>,
    nextId : Nat,
    input : Types.CreateRoomTypeInput,
  ) : Types.RoomType {
    let roomType : Types.RoomType = {
      id = nextId;
      hotelId = input.hotelId;
      name = input.name;
      description = input.description;
      pricePerNight = input.pricePerNight;
      maxGuests = input.maxGuests;
      availability = input.availability;
    };
    roomTypes.add(roomType);
    roomType;
  };

  public func getRoomTypesForHotel(
    roomTypes : List.List<Types.RoomType>,
    hotelId : Common.EntityId,
  ) : [Types.RoomType] {
    roomTypes.filter(func(rt) { rt.hotelId == hotelId }).toArray();
  };

  public func seedSampleHotels(
    hotels : List.List<Types.Hotel>,
    roomTypes : List.List<Types.RoomType>,
    nextHotelIdRef : { var value : Nat },
    nextRoomTypeIdRef : { var value : Nat },
  ) {
    let samples : [Types.CreateHotelInput] = [
      {
        name = "Hotel Sangam Kanyakumari";
        location = "Main Road, Kanyakumari";
        description = "A premium seafront hotel offering panoramic views of the ocean. Experience world-class hospitality with modern amenities and traditional Tamil Nadu cuisine.";
        imageUrls = [];
        amenities = ["Free WiFi", "Restaurant", "Room Service", "Sea View Rooms", "Parking", "AC"];
        pricePerNight = 3500;
        starRating = 4;
        totalRooms = 60;
      },
      {
        name = "Sparsa Resort Kanyakumari";
        location = "East Car Street, Kanyakumari";
        description = "A serene resort near the beach with beautifully landscaped gardens. Ideal for families seeking comfort and relaxation with easy access to major attractions.";
        imageUrls = [];
        amenities = ["Swimming Pool", "Free WiFi", "Restaurant", "Spa", "Parking", "AC", "Gym"];
        pricePerNight = 4800;
        starRating = 4;
        totalRooms = 45;
      },
      {
        name = "Hotel Madurai Residency";
        location = "Beach Road, Kanyakumari";
        description = "A comfortable budget-friendly hotel located just steps from the famous Kanyakumari Beach. Perfect for pilgrims and tourists looking for clean, affordable accommodation.";
        imageUrls = [];
        amenities = ["Free WiFi", "Restaurant", "Room Service", "Parking", "AC"];
        pricePerNight = 1800;
        starRating = 3;
        totalRooms = 35;
      },
      {
        name = "Cape Hotel Kanyakumari";
        location = "Cape Road, Kanyakumari";
        description = "Nestled at the southernmost tip of India, this heritage-style hotel offers authentic South Indian hospitality. Wake up to stunning ocean sunrise views from your room.";
        imageUrls = [];
        amenities = ["Sea View", "Free WiFi", "Restaurant", "Parking", "AC", "Rooftop Terrace"];
        pricePerNight = 2800;
        starRating = 3;
        totalRooms = 40;
      },
    ];

    let roomSeeds : [[Types.CreateRoomTypeInput]] = [
      // Hotel 1 rooms
      [
        { hotelId = 0; name = "Standard Room"; description = "Comfortable room with garden view"; pricePerNight = 3500; maxGuests = 2; availability = 20 },
        { hotelId = 0; name = "Deluxe Sea View"; description = "Spacious room with panoramic sea view"; pricePerNight = 4500; maxGuests = 2; availability = 15 },
        { hotelId = 0; name = "Suite"; description = "Luxury suite with private balcony and sea view"; pricePerNight = 7500; maxGuests = 4; availability = 5 },
      ],
      // Hotel 2 rooms
      [
        { hotelId = 0; name = "Garden Room"; description = "Cozy room overlooking lush gardens"; pricePerNight = 4800; maxGuests = 2; availability = 18 },
        { hotelId = 0; name = "Pool View Room"; description = "Room with direct pool access"; pricePerNight = 5500; maxGuests = 2; availability = 10 },
        { hotelId = 0; name = "Premium Suite"; description = "Expansive suite with lounge area"; pricePerNight = 9000; maxGuests = 4; availability = 5 },
      ],
      // Hotel 3 rooms
      [
        { hotelId = 0; name = "Standard Room"; description = "Clean comfortable room with all basic amenities"; pricePerNight = 1800; maxGuests = 2; availability = 15 },
        { hotelId = 0; name = "Deluxe Room"; description = "Larger room with extra amenities"; pricePerNight = 2200; maxGuests = 3; availability = 10 },
      ],
      // Hotel 4 rooms
      [
        { hotelId = 0; name = "Ocean View Room"; description = "Room with stunning ocean sunrise views"; pricePerNight = 2800; maxGuests = 2; availability = 15 },
        { hotelId = 0; name = "Heritage Suite"; description = "Spacious suite with traditional decor and ocean views"; pricePerNight = 4200; maxGuests = 3; availability = 8 },
      ],
    ];

    var i = 0;
    for (input in samples.values()) {
      let hotelId = nextHotelIdRef.value;
      nextHotelIdRef.value += 1;
      ignore createHotel(hotels, hotelId, input);

      // seed room types for this hotel
      if (i < roomSeeds.size()) {
        for (roomInput in roomSeeds[i].values()) {
          let roomId = nextRoomTypeIdRef.value;
          nextRoomTypeIdRef.value += 1;
          ignore createRoomType(roomTypes, roomId, { roomInput with hotelId = hotelId });
        };
      };
      i += 1;
    };
  };
};
