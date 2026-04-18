import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/places";
import Common "../types/common";

module {
  public func createPlace(
    places : List.List<Types.Place>,
    nextId : Nat,
    input : Types.CreatePlaceInput,
  ) : Types.Place {
    let place : Types.Place = {
      id = nextId;
      name = input.name;
      category = input.category;
      description = input.description;
      address = input.address;
      bestTimeToVisit = input.bestTimeToVisit;
      imageUrls = input.imageUrls;
      isFeatured = input.isFeatured;
      createdAt = Time.now();
      latitude = input.latitude;
      longitude = input.longitude;
    };
    places.add(place);
    place;
  };

  public func updatePlace(
    places : List.List<Types.Place>,
    input : Types.UpdatePlaceInput,
  ) : Bool {
    var found = false;
    places.mapInPlace(func(p) {
      if (p.id == input.id) {
        found := true;
        {
          p with
          name = input.name;
          category = input.category;
          description = input.description;
          address = input.address;
          bestTimeToVisit = input.bestTimeToVisit;
          imageUrls = input.imageUrls;
          isFeatured = input.isFeatured;
          latitude = input.latitude;
          longitude = input.longitude;
        };
      } else { p };
    });
    found;
  };

  public func deletePlace(
    places : List.List<Types.Place>,
    id : Common.EntityId,
  ) : Bool {
    let sizeBefore = places.size();
    let filtered = places.filter(func(p) { p.id != id });
    places.clear();
    places.append(filtered);
    places.size() < sizeBefore;
  };

  public func getPlace(
    places : List.List<Types.Place>,
    id : Common.EntityId,
  ) : ?Types.Place {
    places.find(func(p) { p.id == id });
  };

  public func listPlaces(places : List.List<Types.Place>) : [Types.Place] {
    places.toArray();
  };

  public func listFeaturedPlaces(places : List.List<Types.Place>) : [Types.Place] {
    places.filter(func(p) { p.isFeatured }).toArray();
  };

  public func searchPlaces(
    places : List.List<Types.Place>,
    term : Text,
    category : ?Types.PlaceCategory,
  ) : [Types.Place] {
    let lowerTerm = term.toLower();
    places.filter(func(p) {
      let matchesTerm = term == "" or
        p.name.toLower().contains(#text lowerTerm) or
        p.description.toLower().contains(#text lowerTerm);
      let matchesCategory = switch (category) {
        case null true;
        case (?cat) {
          switch (p.category, cat) {
            case (#beach, #beach) true;
            case (#waterfall, #waterfall) true;
            case (#temple, #temple) true;
            case (#viewpoint, #viewpoint) true;
            case (#other, #other) true;
            case _ false;
          };
        };
      };
      matchesTerm and matchesCategory;
    }).toArray();
  };

  public func seedSamplePlaces(
    places : List.List<Types.Place>,
    nextIdRef : { var value : Nat },
  ) {
    let samples : [Types.CreatePlaceInput] = [
      {
        name = "Kanyakumari Beach";
        category = #beach;
        description = "The famous confluence of the Arabian Sea, Bay of Bengal, and Indian Ocean. Watch spectacular sunrises and sunsets at India's southernmost tip.";
        address = "Kanyakumari, Tamil Nadu 629702";
        bestTimeToVisit = "October to February";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.0883;
        longitude = ?77.5385;
      },
      {
        name = "Thiruvalluvar Statue";
        category = #viewpoint;
        description = "A 133-foot stone sculpture of the Tamil poet-saint Thiruvalluvar, standing on a small island near Vivekananda Rock Memorial.";
        address = "Vivekananda Rock, Kanyakumari 629702";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.0752;
        longitude = ?77.5527;
      },
      {
        name = "Vivekananda Rock Memorial";
        category = #viewpoint;
        description = "A famous Hindu temple and memorial built on one of two rocks off the southeastern tip of mainland India where Swami Vivekananda meditated.";
        address = "Vivekananda Rock, Kanyakumari 629702";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.0761;
        longitude = ?77.5520;
      },
      {
        name = "Padmanabhapuram Palace";
        category = #other;
        description = "A 16th-century palace built in the traditional Kerala architectural style, featuring impressive woodwork and murals. One of the largest wooden palaces in Asia.";
        address = "Padmanabhapuram, Kanyakumari District 629175";
        bestTimeToVisit = "November to February";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.2500;
        longitude = ?77.3300;
      },
      {
        name = "Sunset Point";
        category = #viewpoint;
        description = "The perfect vantage point to witness the breathtaking sunset over the sea. A popular spot for photography and evening walks along the promenade.";
        address = "Beach Road, Kanyakumari 629702";
        bestTimeToVisit = "Year round";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.0870;
        longitude = ?77.5400;
      },
      {
        name = "Tiruchendur Murugan Temple";
        category = #temple;
        description = "One of the six abodes of Lord Murugan, this ancient seaside temple is a major pilgrimage site known for its magnificent Dravidian architecture.";
        address = "Tiruchendur, Thoothukudi District 628215";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.4950;
        longitude = ?78.1220;
      },
      {
        name = "Kumariamman Temple";
        category = #temple;
        description = "Ancient temple dedicated to Goddess Kumari at the southernmost tip of India. One of the 51 Shakti Peethas, it is a major pilgrimage site.";
        address = "Kanyakumari, Tamil Nadu 629702";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.0878;
        longitude = ?77.5380;
      },
      {
        name = "Gandhi Memorial";
        category = #other;
        description = "A beautiful memorial built in the spot where Mahatma Gandhi's ashes were kept before immersion. Designed to allow sunlight to fall on the ashes on his birthday.";
        address = "Kanyakumari, Tamil Nadu 629702";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.0870;
        longitude = ?77.5400;
      },
      {
        name = "Triveni Sangamam";
        category = #viewpoint;
        description = "The confluence of three seas — Arabian Sea, Bay of Bengal, and Indian Ocean — at the southernmost tip of India. A spiritually significant spot.";
        address = "Kanyakumari, Tamil Nadu 629702";
        bestTimeToVisit = "October to February";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.0858;
        longitude = ?77.5410;
      },
      {
        name = "Twin Beach";
        category = #beach;
        description = "A hidden gem with two adjacent pristine beaches separated by a rocky outcrop. Secluded and serene, perfect for nature lovers seeking peace away from crowds.";
        address = "Near Kanyakumari, Tamil Nadu";
        bestTimeToVisit = "October to February";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.1200;
        longitude = ?77.5100;
      },
      {
        name = "Rasthakaadu Beach";
        category = #beach;
        description = "A tranquil, largely undiscovered beach with golden sands and gentle waves. A wonderful escape for those looking for solitude by the sea.";
        address = "Near Kanyakumari, Tamil Nadu";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.1350;
        longitude = ?77.5200;
      },
      {
        name = "Sanguthurai Beach";
        category = #beach;
        description = "A scenic fishing village beach offering an authentic glimpse into local coastal life, with traditional fishing boats and fresh seafood.";
        address = "Sanguthurai, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.0950;
        longitude = ?77.5600;
      },
      {
        name = "Chothavilai Beach";
        category = #beach;
        description = "A pristine and secluded beach known for its clean sands and clear waters. Ideal for a quiet day by the sea away from the tourist crowds.";
        address = "Chothavilai, Kanyakumari District";
        bestTimeToVisit = "November to February";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.1500;
        longitude = ?77.5300;
      },
      {
        name = "Kalikesam Waterfalls";
        category = #waterfall;
        description = "A hidden waterfall deep in the forest, accessible via a trekking trail through lush greenery. The falls are especially spectacular during and after the monsoon season.";
        address = "Near Kanyakumari, Tamil Nadu";
        bestTimeToVisit = "July to November";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.2000;
        longitude = ?77.4500;
      },
      {
        name = "Vattaparai Falls";
        category = #waterfall;
        description = "A stunning tiered waterfall surrounded by dense forest. The area offers beautiful trekking opportunities and breathtaking natural scenery.";
        address = "Vattaparai, Kanyakumari District";
        bestTimeToVisit = "July to December";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.4500;
        longitude = ?77.4000;
      },
      {
        name = "Thirparappu Waterfalls";
        category = #waterfall;
        description = "A picturesque waterfall on the Kodayar River, with a bathing pool below. One of the most popular picnic spots in Kanyakumari district.";
        address = "Thirparappu, Kanyakumari District";
        bestTimeToVisit = "June to February";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.3200;
        longitude = ?77.3500;
      },
      {
        name = "Ulakkai Aruvi Falls";
        category = #waterfall;
        description = "A scenic waterfall nestled in a forested valley, offering a refreshing retreat from the heat. The surrounding landscape is rich in biodiversity.";
        address = "Near Kanyakumari, Tamil Nadu";
        bestTimeToVisit = "August to January";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.2500;
        longitude = ?77.4000;
      },
      {
        name = "Olakaruvi Waterfalls";
        category = #waterfall;
        description = "A majestic waterfall set amidst lush tropical forest. The trek to the falls takes visitors through diverse flora and offers rewarding views.";
        address = "Near Kanyakumari, Tamil Nadu";
        bestTimeToVisit = "July to November";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.3000;
        longitude = ?77.3800;
      },
      {
        name = "Pechiparai Dam";
        category = #other;
        description = "A scenic reservoir surrounded by lush hills and forests. Boating facilities are available and the area is home to diverse wildlife and migratory birds.";
        address = "Pechiparai, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.3500;
        longitude = ?77.3000;
      },
      {
        name = "Ananthankulam Boat House";
        category = #other;
        description = "A serene lake offering peaceful boating experiences amidst scenic surroundings. Popular with families and nature lovers seeking a relaxing outing.";
        address = "Ananthankulam, Kanyakumari District";
        bestTimeToVisit = "October to February";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.1500;
        longitude = ?77.5500;
      },
      {
        name = "Chittar Lake";
        category = #other;
        description = "A tranquil lake surrounded by forested hills and diverse birdlife. An excellent spot for birdwatching and peaceful nature walks.";
        address = "Chittar, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.2000;
        longitude = ?77.4000;
      },
      {
        name = "Chitharal Jain Monuments";
        category = #other;
        description = "Ancient rock-cut Jain carvings and sculptures dating back over a thousand years. One of the hidden historical gems of Kanyakumari district.";
        address = "Chitharal, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.3000;
        longitude = ?77.4000;
      },
      {
        name = "Marunthu Kottai Fort";
        category = #other;
        description = "A historic fort with panoramic coastal views, steeped in tales of maritime trade and battles. Largely unexplored, it offers a unique glimpse into the region's past.";
        address = "Near Kanyakumari, Tamil Nadu";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.0700;
        longitude = ?77.5300;
      },
      {
        name = "Wax Museum";
        category = #other;
        description = "A fascinating museum featuring life-size wax figures of famous personalities from India and abroad. A unique attraction for visitors of all ages.";
        address = "Kanyakumari, Tamil Nadu 629702";
        bestTimeToVisit = "Year round";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.0880;
        longitude = ?77.5390;
      },
      {
        name = "Mathur Aqueduct";
        category = #other;
        description = "The longest and tallest aqueduct in Asia, stretching over 1.5 km. An impressive feat of engineering that supplies water to surrounding farmlands.";
        address = "Mathur, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.3000;
        longitude = ?77.3500;
      },
      {
        name = "Udayagiri Fort";
        category = #other;
        description = "A historical fort built by the king of Travancore in the 18th century. It played an important role in repelling Dutch invasions and offers panoramic views.";
        address = "Udayagiri, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.5000;
        longitude = ?77.2500;
      },
      {
        name = "Vattakottai Fort";
        category = #other;
        description = "A well-preserved 18th-century fort at the confluence of the sea and backwaters. Built by the Travancore kingdom, it offers stunning ocean views and historical insights.";
        address = "Vattakottai, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.1500;
        longitude = ?77.5700;
      },
      {
        name = "Suchindram Temple";
        category = #temple;
        description = "A magnificent temple dedicated to the Hindu trinity — Brahma, Vishnu, and Shiva. Known for its stunning Dravidian architecture, musical pillars, and 40-foot Hanuman statue.";
        address = "Suchindram, Kanyakumari District";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = true;
        latitude = ?8.1500;
        longitude = ?77.4700;
      },
      {
        name = "Nagercoil";
        category = #other;
        description = "The capital city of Kanyakumari district, known for its ancient temples, diverse culture, and as a gateway to the scenic landscapes of South India's southernmost region.";
        address = "Nagercoil, Kanyakumari District 629001";
        bestTimeToVisit = "October to March";
        imageUrls = [];
        isFeatured = false;
        latitude = ?8.1780;
        longitude = ?77.4340;
      },
    ];
    for (input in samples.values()) {
      let id = nextIdRef.value;
      nextIdRef.value += 1;
      ignore createPlace(places, id, input);
    };
  };
};
