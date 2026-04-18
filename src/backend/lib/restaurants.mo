import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/restaurants";
import Common "../types/common";

module {
  public func createRestaurant(
    restaurants : List.List<Types.Restaurant>,
    nextId : Nat,
    input : Types.CreateRestaurantInput,
  ) : Types.Restaurant {
    let restaurant : Types.Restaurant = {
      id = nextId;
      name = input.name;
      cuisineTypes = input.cuisineTypes;
      description = input.description;
      location = input.location;
      address = input.address;
      phone = input.phone;
      ratingAverage = input.ratingAverage;
      priceRange = input.priceRange;
      imageUrl = input.imageUrl;
      hoursOpen = input.hoursOpen;
      isFeatured = input.isFeatured;
      createdAt = Time.now();
    };
    restaurants.add(restaurant);
    restaurant;
  };

  public func listRestaurants(restaurants : List.List<Types.Restaurant>) : [Types.Restaurant] {
    restaurants.toArray();
  };

  public func listFeaturedRestaurants(restaurants : List.List<Types.Restaurant>) : [Types.Restaurant] {
    restaurants.filter(func(r) { r.isFeatured }).toArray();
  };

  public func getRestaurant(
    restaurants : List.List<Types.Restaurant>,
    id : Common.EntityId,
  ) : ?Types.Restaurant {
    restaurants.find(func(r) { r.id == id });
  };

  public func searchRestaurants(
    restaurants : List.List<Types.Restaurant>,
    term : Text,
  ) : [Types.Restaurant] {
    let lowerTerm = term.toLower();
    restaurants.filter(func(r) {
      term == "" or
        r.name.toLower().contains(#text lowerTerm) or
        r.location.toLower().contains(#text lowerTerm) or
        r.cuisineTypes.any(func(c) { c.toLower().contains(#text lowerTerm) });
    }).toArray();
  };

  public func deleteRestaurant(
    restaurants : List.List<Types.Restaurant>,
    id : Common.EntityId,
  ) : Bool {
    let sizeBefore = restaurants.size();
    let filtered = restaurants.filter(func(r) { r.id != id });
    restaurants.clear();
    restaurants.append(filtered);
    restaurants.size() < sizeBefore;
  };

  public func seedSampleRestaurants(
    restaurants : List.List<Types.Restaurant>,
    nextIdRef : { var value : Nat },
  ) {
    let samples : [Types.CreateRestaurantInput] = [
      {
        name = "Sangam Restaurant";
        cuisineTypes = ["South Indian", "Tamil Nadu Traditional", "Seafood"];
        description = "One of Kanyakumari's most beloved restaurants serving authentic Tamil Nadu cuisine with a spectacular view of the confluence of three seas. Famous for fresh seafood thali and filter coffee.";
        location = "Kanyakumari Town";
        address = "Main Road, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 10001";
        ratingAverage = 4.5;
        priceRange = 2;
        imageUrl = "";
        hoursOpen = "7:00 AM – 10:00 PM";
        isFeatured = true;
      },
      {
        name = "Hotel Saravana Bhavan Kanyakumari";
        cuisineTypes = ["South Indian Vegetarian", "Tamil Brahmin"];
        description = "A branch of the renowned Saravana Bhavan chain offering signature South Indian vegetarian fare. Consistently excellent idli, dosa, pongal, and the famous meals served on banana leaf.";
        location = "Kanyakumari Town";
        address = "Kovalam Road, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 20002";
        ratingAverage = 4.3;
        priceRange = 1;
        imageUrl = "";
        hoursOpen = "6:30 AM – 10:30 PM";
        isFeatured = true;
      },
      {
        name = "Hotel Tamil Nadu Restaurant";
        cuisineTypes = ["Tamil Nadu Traditional", "North Indian", "Chinese"];
        description = "The TTDC-run restaurant offering a wide variety of dishes in a comfortable, government-standard setting. A reliable choice for families, popular for its spacious dining hall and multi-cuisine menu.";
        location = "Beach Road, Kanyakumari";
        address = "Beach Road, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 30003";
        ratingAverage = 3.9;
        priceRange = 2;
        imageUrl = "";
        hoursOpen = "7:00 AM – 10:00 PM";
        isFeatured = false;
      },
      {
        name = "Kovil Puram";
        cuisineTypes = ["Temple-Style South Indian", "Vegetarian"];
        description = "An authentic vegetarian restaurant adjacent to the Kanyakumari Amman Temple precinct, known for prasad-style meals and pure, traditional Tamil vegetarian cooking with no onion or garlic.";
        location = "Temple Area, Kanyakumari";
        address = "Temple Street, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 40004";
        ratingAverage = 4.2;
        priceRange = 1;
        imageUrl = "";
        hoursOpen = "6:00 AM – 9:00 PM";
        isFeatured = true;
      },
      {
        name = "Beach View Restaurant";
        cuisineTypes = ["Seafood", "South Indian", "Kerala Style"];
        description = "Perched right on the beach promenade with panoramic views of the Indian Ocean. Specialises in freshly caught fish, prawns, and crab prepared in both Tamil and Kerala coastal styles.";
        location = "Kanyakumari Beach";
        address = "Beach Promenade, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 50005";
        ratingAverage = 4.4;
        priceRange = 2;
        imageUrl = "";
        hoursOpen = "8:00 AM – 11:00 PM";
        isFeatured = true;
      },
      {
        name = "Archana Restaurant";
        cuisineTypes = ["Multi-Cuisine", "South Indian", "North Indian"];
        description = "A family-friendly multi-cuisine restaurant in the heart of Kanyakumari town, popular for its generous portions and welcoming atmosphere. Serves both vegetarian and non-vegetarian dishes.";
        location = "Kanyakumari Town";
        address = "Sannathi Street, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 60006";
        ratingAverage = 4.0;
        priceRange = 2;
        imageUrl = "";
        hoursOpen = "7:30 AM – 10:30 PM";
        isFeatured = false;
      },
      {
        name = "Sri Annapoorna";
        cuisineTypes = ["South Indian Vegetarian", "Chettinad"];
        description = "A beloved local institution serving wholesome, home-style vegetarian cooking. The lunch thali is legendary — unlimited rice, sambar, rasam, kootu, and payasam served with warmth.";
        location = "Kanyakumari Town";
        address = "Raja Street, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 70007";
        ratingAverage = 4.6;
        priceRange = 1;
        imageUrl = "";
        hoursOpen = "6:00 AM – 9:30 PM";
        isFeatured = true;
      },
      {
        name = "Sparsa Resort Restaurant";
        cuisineTypes = ["Seafood", "South Indian", "Continental"];
        description = "The fine-dining restaurant at Sparsa Resort offering a sophisticated menu with stunning sea views. Their seafood platters and sunset dinner packages are particularly sought after by guests and visitors alike.";
        location = "Lighthouse Road, Kanyakumari";
        address = "Lighthouse Road, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 80008";
        ratingAverage = 4.7;
        priceRange = 3;
        imageUrl = "";
        hoursOpen = "7:00 AM – 11:00 PM";
        isFeatured = true;
      },
      {
        name = "Hotel Tri Star Restaurant";
        cuisineTypes = ["Tamil Nadu Traditional", "Seafood", "North Indian"];
        description = "A well-established restaurant in the Hotel Tri Star complex, known for its consistent quality and wide menu. Popular among pilgrims and tourists for its affordable meals and central location.";
        location = "Kanyakumari Town";
        address = "Cross Road, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 90009";
        ratingAverage = 4.1;
        priceRange = 2;
        imageUrl = "";
        hoursOpen = "7:00 AM – 10:00 PM";
        isFeatured = false;
      },
      {
        name = "Leela's Seafood Corner";
        cuisineTypes = ["Coastal Seafood", "Nadar Traditional"];
        description = "A small, family-run gem tucked near the fishing harbour. Leela and her daughters prepare the freshest catch — pearl spot fish, seer fish, and king prawns grilled or curried to perfection.";
        location = "Fishing Harbour, Kanyakumari";
        address = "Harbour Road, Kanyakumari, Tamil Nadu 629702";
        phone = "+91 94432 00010";
        ratingAverage = 4.8;
        priceRange = 2;
        imageUrl = "";
        hoursOpen = "11:00 AM – 9:00 PM";
        isFeatured = true;
      },
    ];
    for (input in samples.values()) {
      let id = nextIdRef.value;
      nextIdRef.value += 1;
      ignore createRestaurant(restaurants, id, input);
    };
  };
};
