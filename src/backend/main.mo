import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

import PlacesTypes "types/places";
import HotelsTypes "types/hotels";
import BookingsTypes "types/bookings";
import GuidesTypes "types/guides";
import ReviewsTypes "types/reviews";
import RestaurantsTypes "types/restaurants";
import AuthPayment "types/auth-payment";
import PlacesLib "lib/places";
import HotelsLib "lib/hotels";
import GuidesLib "lib/guides";
import ReviewsLib "lib/reviews";
import RestaurantsLib "lib/restaurants";
import PlacesApi "mixins/places-api";
import HotelsApi "mixins/hotels-api";
import BookingsApi "mixins/bookings-api";
import GuidesApi "mixins/guides-api";
import ReviewsApi "mixins/reviews-api";
import AdminApi "mixins/admin-api";
import RestaurantsApi "mixins/restaurants-api";
import UserAuthApi "mixins/user-auth-api";




actor {
  // Admin state — first user to call claimAdmin() becomes admin
  let adminSet = { var admin : ?Principal = null };

  // Tourist Places state
  let places = List.empty<PlacesTypes.Place>();
  let nextPlaceIdRef = { var value : Nat = 1 };

  // Hotels state
  let hotels = List.empty<HotelsTypes.Hotel>();
  let roomTypes = List.empty<HotelsTypes.RoomType>();
  let nextHotelIdRef = { var value : Nat = 1 };
  let nextRoomTypeIdRef = { var value : Nat = 1 };

  // Bookings state
  let bookings = List.empty<BookingsTypes.Booking>();
  let nextBookingIdRef = { var value : Nat = 1 };

  // Guides state
  let guides = List.empty<GuidesTypes.Guide>();
  let nextGuideIdRef = { var value : Nat = 1 };

  // Reviews state
  let reviews = List.empty<ReviewsTypes.Review>();
  let nextReviewIdRef = { var value : Nat = 1 };

  // Restaurants state
  let restaurants = List.empty<RestaurantsTypes.Restaurant>();
  let nextRestaurantIdRef = { var value : Nat = 1 };

  // User Auth state
  let usersByUsername = Map.empty<Text, AuthPayment.UserAccount>();
  let sessions = Map.empty<Text, AuthPayment.SessionToken>();
  let nextUserIdRef = { var value : Nat = 1 };

  // Seed sample data on first init
  PlacesLib.seedSamplePlaces(places, nextPlaceIdRef);
  HotelsLib.seedSampleHotels(hotels, roomTypes, nextHotelIdRef, nextRoomTypeIdRef);
  GuidesLib.seedSampleGuides(guides, nextGuideIdRef);
  ReviewsLib.seedSampleReviews(reviews, nextReviewIdRef, Principal.anonymous());
  RestaurantsLib.seedSampleRestaurants(restaurants, nextRestaurantIdRef);

  // Mixin compositions
  include PlacesApi(places, nextPlaceIdRef, adminSet);
  include HotelsApi(hotels, roomTypes, nextHotelIdRef, nextRoomTypeIdRef, adminSet);
  include BookingsApi(bookings, nextBookingIdRef, adminSet);
  include GuidesApi(guides, nextGuideIdRef, adminSet);
  include ReviewsApi(reviews, nextReviewIdRef, adminSet);
  include AdminApi(places, hotels, guides, bookings, reviews, restaurants, usersByUsername, adminSet);
  include RestaurantsApi(restaurants, nextRestaurantIdRef, adminSet);
  include UserAuthApi(usersByUsername, sessions, nextUserIdRef);
};
