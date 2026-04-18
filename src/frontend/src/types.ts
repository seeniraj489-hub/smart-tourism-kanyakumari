export type PlaceCategory =
  | "Beach"
  | "Waterfall"
  | "Temple"
  | "Historical"
  | "Nature"
  | "Viewpoint"
  | "Museum";

export type PlaceSection =
  | "All"
  | "Hidden Gems"
  | "Water Wonders"
  | "Unique Places"
  | "Nearby Attractions";

export type GuideSpecialization =
  | "Historical Tours"
  | "Nature & Wildlife"
  | "Local Cuisine"
  | "Photography Tours"
  | "Adventure"
  | "Cultural Heritage";

export type BookingType = "Hotel" | "Guide";

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export type ReviewTargetType = "Place" | "Hotel" | "Guide";

export type Timestamp = bigint;

export interface Place {
  id: bigint;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  bestTimeToVisit: string;
  imageUrls: string[];
  isFeatured: boolean;
  createdAt: Timestamp;
  tags?: string[];
  latitude?: number;
  longitude?: number;
}

export interface Hotel {
  id: bigint;
  name: string;
  location: string;
  description: string;
  imageUrls: string[];
  amenities: string[];
  pricePerNight: bigint;
  starRating: bigint;
  totalRooms: bigint;
  createdAt: Timestamp;
}

export interface Guide {
  id: bigint;
  name: string;
  specialization: GuideSpecialization;
  bio: string;
  languagesSpoken: string[];
  phoneNumber: string;
  ratePerDay: bigint;
  experienceYears: bigint;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: Timestamp;
}

export interface Booking {
  id: bigint;
  userId: string;
  bookingType: BookingType;
  referenceId: bigint;
  checkIn: string;
  checkOut: string;
  guestCount: bigint;
  status: BookingStatus;
  referenceNumber: string;
  totalAmount?: number;
  paymentMethod?: string;
  paymentTransactionId?: string;
  createdAt: Timestamp;
}

export interface Review {
  id: bigint;
  userId: string;
  reviewerName: string;
  targetType: ReviewTargetType;
  targetId: bigint;
  rating: bigint;
  comment: string;
  isApproved: boolean;
  createdAt: Timestamp;
}

export interface DashboardStats {
  totalPlaces: bigint;
  totalHotels: bigint;
  totalGuides: bigint;
  totalRestaurants: bigint;
  totalBookings: bigint;
  pendingReviews: bigint;
}

export interface Restaurant {
  id: bigint;
  name: string;
  cuisineTypes: string[];
  description: string;
  location: string;
  address: string;
  phone: string;
  ratingAverage: number;
  priceRange: number; // 1 = budget, 2 = mid-range, 3 = fine dining
  imageUrl: string;
  hoursOpen: string;
  isFeatured: boolean;
  createdAt: bigint;
}

// Seed data helpers
export const SAMPLE_PLACES: Place[] = [
  // ── Original 6 places with HD images ──────────────────────────────────
  {
    id: 1n,
    name: "Vivekananda Rock Memorial",
    category: "Historical",
    description:
      "A magnificent memorial built on a rocky island in the sea, dedicated to Swami Vivekananda. A spiritual landmark where the three oceans meet.",
    address: "Vivekananda Puram, Kanyakumari, Tamil Nadu 629702",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/vivekananda-rock/800/500"],
    isFeatured: true,
    tags: ["unique", "mustSee"],
    latitude: 8.0761,
    longitude: 77.552,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    name: "Kanyakumari Beach (Sangam)",
    category: "Beach",
    description:
      "The iconic tip where the Bay of Bengal, Arabian Sea, and Indian Ocean converge. Watch stunning sunrises and sunsets from the southernmost point of India.",
    address: "Kanyakumari, Tamil Nadu 629702",
    bestTimeToVisit: "November to February",
    imageUrls: ["https://picsum.photos/seed/kanyakumari-beach/800/500"],
    isFeatured: true,
    tags: ["unique", "mustSee"],
    latitude: 8.0883,
    longitude: 77.5385,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    name: "Thirparappu Waterfalls",
    category: "Waterfall",
    description:
      "The most famous waterfall in Kanyakumari district — a majestic 50-foot cascade on the Kodayar River with a natural bathing pool, surrounded by lush tropical forests.",
    address: "Thirparappu, Kanyakumari District, Tamil Nadu 629159",
    bestTimeToVisit: "June to January",
    imageUrls: ["https://picsum.photos/seed/thirparappu-falls/800/500"],
    isFeatured: true,
    tags: ["water"],
    latitude: 8.32,
    longitude: 77.35,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 4n,
    name: "Kumari Amman Temple",
    category: "Temple",
    description:
      "One of the 108 Shakti Peethas, this ancient temple dedicated to Goddess Kanyakumari sits at the very tip of the Indian subcontinent.",
    address: "Kanyakumari, Tamil Nadu 629702",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/kumari-amman-temple/800/500"],
    isFeatured: false,
    tags: ["unique", "mustSee"],
    latitude: 8.0878,
    longitude: 77.538,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 5n,
    name: "Padmanabhapuram Palace",
    category: "Historical",
    description:
      "The largest wooden palace in Asia — a magnificent 16th century Travancore royal family palace, considered one of the finest examples of Kerala architecture with intricate wood carvings.",
    address: "Padmanabhapuram, Tamil Nadu 629151",
    bestTimeToVisit: "November to February",
    imageUrls: ["https://picsum.photos/seed/padmanabhapuram-palace/800/500"],
    isFeatured: true,
    tags: ["nearby"],
    latitude: 8.25,
    longitude: 77.33,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 6n,
    name: "Mathur Hanging Bridge",
    category: "Nature",
    description:
      "The longest hanging aqueduct in Asia, offering breathtaking views of the Pahrali River valley and the surrounding Western Ghats landscape.",
    address: "Mathur, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to February",
    imageUrls: ["https://picsum.photos/seed/mathur-hanging-bridge/800/500"],
    isFeatured: false,
    tags: ["nearby"],
    latitude: 8.3,
    longitude: 77.35,
    createdAt: BigInt(Date.now()),
  },

  // ── Hidden Places (Kanyakumari's secrets) ────────────────────────────
  {
    id: 7n,
    name: "Hidden Twin Beach",
    category: "Beach",
    description:
      "Two secluded beaches connected by a narrow rocky path, pristine and untouched by tourists. A paradise for those who seek solitude by the sea.",
    address: "Near Colachel, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/twin-beach-hidden/800/500"],
    isFeatured: false,
    tags: ["hidden"],
    latitude: 8.12,
    longitude: 77.51,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 8n,
    name: "Rasthakaadu Beach",
    category: "Beach",
    description:
      "A remote, peaceful beach with golden sand surrounded by casuarina trees, rarely visited by tourists. Experience the true tranquility of Kanyakumari's coast.",
    address: "Rasthakaadu, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "November to February",
    imageUrls: ["https://picsum.photos/seed/rasthakaadu-beach/800/500"],
    isFeatured: false,
    tags: ["hidden"],
    latitude: 8.135,
    longitude: 77.52,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 9n,
    name: "Marunthu Kottai Fort (Medicine Fort)",
    category: "Historical",
    description:
      "An ancient Portuguese fort hidden in the forest, said to have medicinal herb gardens. A mysterious ruin steeped in colonial history and local legends.",
    address: "Colachel, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/marunthu-kottai-fort/800/500"],
    isFeatured: false,
    tags: ["hidden"],
    latitude: 8.07,
    longitude: 77.53,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 10n,
    name: "Kalikesam Waterfalls",
    category: "Waterfall",
    description:
      "A hidden waterfall deep in the forest near Colachel, 60 feet high. Accessible only via a short jungle trek, rewarding visitors with pristine natural beauty.",
    address: "Near Colachel, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "June to January",
    imageUrls: ["https://picsum.photos/seed/kalikesam-falls/800/500"],
    isFeatured: false,
    tags: ["hidden", "water"],
    latitude: 8.2,
    longitude: 77.45,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 11n,
    name: "Vattaparai Falls",
    category: "Waterfall",
    description:
      "A beautiful, lesser-known waterfall surrounded by lush greenery. Off the beaten path and perfect for picnics, the falls are at their best during monsoon season.",
    address: "Vattaparai, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "July to January",
    imageUrls: ["https://picsum.photos/seed/vattaparai-falls/800/500"],
    isFeatured: false,
    tags: ["hidden", "water"],
    latitude: 8.45,
    longitude: 77.4,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 12n,
    name: "Chitharal Jain Rock Monuments",
    category: "Historical",
    description:
      "9th century Jain rock-cut reliefs and cave temple carvings hidden in the hills. Among the most significant archaeological sites in Tamil Nadu, rarely visited.",
    address: "Chitharal, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/chitharal-jain-monuments/800/500"],
    isFeatured: false,
    tags: ["hidden"],
    latitude: 8.3,
    longitude: 77.4,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 13n,
    name: "Sanguthurai Beach",
    category: "Beach",
    description:
      "A secluded fishing village beach with colorful boats and fresh catches brought in every morning. Experience authentic coastal life away from tourist crowds.",
    address: "Sanguthurai, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/sanguthurai-beach/800/500"],
    isFeatured: false,
    tags: ["hidden"],
    latitude: 8.095,
    longitude: 77.56,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 14n,
    name: "Chothavilai Beach",
    category: "Beach",
    description:
      "One of the quietest beaches in Kanyakumari, where the sea is calm and crystal clear. Untouched by commercialization — a secret shared only among locals.",
    address: "Chothavilai, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "November to February",
    imageUrls: ["https://picsum.photos/seed/chothavilai-beach/800/500"],
    isFeatured: false,
    tags: ["hidden"],
    latitude: 8.15,
    longitude: 77.53,
    createdAt: BigInt(Date.now()),
  },

  // ── Water Places ──────────────────────────────────────────────────────
  {
    id: 15n,
    name: "Ulakkai Aruvi (Rod Falls)",
    category: "Waterfall",
    description:
      "A picturesque waterfall resembling a cascade of glass rods as the water splits over smooth rocks. A tranquil spot in the heart of the Western Ghats foothills.",
    address: "Near Nagercoil, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "July to January",
    imageUrls: ["https://picsum.photos/seed/ulakkai-aruvi-falls/800/500"],
    isFeatured: false,
    tags: ["water"],
    latitude: 8.25,
    longitude: 77.4,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 16n,
    name: "Olakaruvi Waterfalls",
    category: "Waterfall",
    description:
      "A remote waterfall deep in the forest, best experienced during monsoon season when the flow is at its most dramatic. A trek destination for nature enthusiasts.",
    address: "Western Ghats, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "June to November",
    imageUrls: ["https://picsum.photos/seed/olakaruvi-waterfalls/800/500"],
    isFeatured: false,
    tags: ["water"],
    latitude: 8.3,
    longitude: 77.38,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 17n,
    name: "Pechiparai Dam Reservoir",
    category: "Nature",
    description:
      "A scenic dam with lush green hills perfectly reflected in calm turquoise waters. A popular spot for picnics and nature photography in Kanyakumari district.",
    address: "Pechiparai, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to February",
    imageUrls: ["https://picsum.photos/seed/pechiparai-dam/800/500"],
    isFeatured: false,
    tags: ["water"],
    latitude: 8.35,
    longitude: 77.3,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 18n,
    name: "Ananthankulam Boat House",
    category: "Nature",
    description:
      "Serene boat rides on a peaceful lake surrounded by nature. A perfect family outing spot offering paddleboat and rowboat rentals in a tranquil setting.",
    address: "Ananthankulam, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/ananthankulam-boathouse/800/500"],
    isFeatured: false,
    tags: ["water"],
    latitude: 8.15,
    longitude: 77.55,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 19n,
    name: "Chittar Lake",
    category: "Nature",
    description:
      "A beautiful reservoir surrounded by verdant hills, a haven for birds and nature lovers. The reflections of the surrounding hills make it a photographer's dream.",
    address: "Chittar, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to February",
    imageUrls: ["https://picsum.photos/seed/chittar-lake/800/500"],
    isFeatured: false,
    tags: ["water"],
    latitude: 8.2,
    longitude: 77.4,
    createdAt: BigInt(Date.now()),
  },

  // ── Unique Places ─────────────────────────────────────────────────────
  {
    id: 20n,
    name: "Triveni Sangamam",
    category: "Viewpoint",
    description:
      "The sacred confluence of the Bay of Bengal, Arabian Sea, and Indian Ocean — one of the rarest geographical phenomena on earth. A site of immense spiritual significance.",
    address: "Kanyakumari, Tamil Nadu 629702",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/triveni-sangamam/800/500"],
    isFeatured: true,
    tags: ["unique", "mustSee"],
    latitude: 8.0858,
    longitude: 77.541,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 21n,
    name: "Gandhi Memorial Mandapam",
    category: "Historical",
    description:
      "Memorial built where Mahatma Gandhi's ashes were kept before immersion in the sea. The structure is designed so that sunlight falls on the urn spot on Gandhi's birthday.",
    address: "Beach Road, Kanyakumari, Tamil Nadu 629702",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/gandhi-memorial-kk/800/500"],
    isFeatured: false,
    tags: ["unique"],
    latitude: 8.087,
    longitude: 77.54,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 22n,
    name: "Wax Museum Kanyakumari (Mayapuri)",
    category: "Museum",
    description:
      "India's southernmost wax museum with 60+ realistic wax figures of historical personalities, freedom fighters, scientists, and film stars. A must-visit for families.",
    address: "Main Road, Kanyakumari, Tamil Nadu 629702",
    bestTimeToVisit: "Year Round",
    imageUrls: ["https://picsum.photos/seed/wax-museum-kanyakumari/800/500"],
    isFeatured: false,
    tags: ["unique"],
    latitude: 8.088,
    longitude: 77.539,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 23n,
    name: "Thiruvalluvar Statue",
    category: "Viewpoint",
    description:
      "A 133-foot tall stone statue of the great Tamil poet Thiruvalluvar, standing majestically on a rocky islet in the sea. One of the tallest statues in India.",
    address: "Vivekananda Rock Island, Kanyakumari, Tamil Nadu 629702",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/thiruvalluvar-statue/800/500"],
    isFeatured: true,
    tags: ["unique", "mustSee"],
    latitude: 8.0752,
    longitude: 77.5527,
    createdAt: BigInt(Date.now()),
  },

  // ── Nearby Attractions ────────────────────────────────────────────────
  {
    id: 24n,
    name: "Mathur Aqueduct",
    category: "Historical",
    description:
      "India's longest and tallest aqueduct, known as the 'Mathur Hanging Bridge', stretching 1,674 feet across the Pahrali River valley. An engineering marvel of South India.",
    address: "Mathur, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to February",
    imageUrls: ["https://picsum.photos/seed/mathur-aqueduct/800/500"],
    isFeatured: false,
    tags: ["nearby"],
    latitude: 8.3,
    longitude: 77.35,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 25n,
    name: "Udayagiri Fort",
    category: "Historical",
    description:
      "An ancient fort with a rich history, built by the King of Travancore in the 17th century. The fort houses a Dutch cemetery and a statue of Eustachius De Lannoy.",
    address: "Udayagiri, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/udayagiri-fort/800/500"],
    isFeatured: false,
    tags: ["nearby"],
    latitude: 8.5,
    longitude: 77.25,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 26n,
    name: "Vattakottai Fort",
    category: "Historical",
    description:
      "A 17th century sea fort with stunning coastal views, built by the Travancore kings to guard against sea invasions. The fort offers panoramic views of the Laccadive Sea.",
    address: "Vattakottai, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/vattakottai-fort/800/500"],
    isFeatured: false,
    tags: ["nearby"],
    latitude: 8.15,
    longitude: 77.57,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 27n,
    name: "Suchindram Temple (Thanumalayan Temple)",
    category: "Temple",
    description:
      "An ancient temple dedicated to the Trinity (Brahma, Vishnu, Shiva) with a towering 134-foot gopuram. Famous for its musical pillars that produce different notes when tapped.",
    address: "Suchindram, Kanyakumari District, Tamil Nadu",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/suchindram-temple/800/500"],
    isFeatured: false,
    tags: ["nearby"],
    latitude: 8.15,
    longitude: 77.47,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 28n,
    name: "Nagercoil",
    category: "Historical",
    description:
      "The nearest city to Kanyakumari, known for the ancient Nagaraja Temple, vibrant local markets, and its unique blend of Tamil and Kerala cultures.",
    address: "Nagercoil, Kanyakumari District, Tamil Nadu 629001",
    bestTimeToVisit: "October to March",
    imageUrls: ["https://picsum.photos/seed/nagercoil-city/800/500"],
    isFeatured: false,
    tags: ["nearby"],
    latitude: 8.178,
    longitude: 77.434,
    createdAt: BigInt(Date.now()),
  },
];

export const SAMPLE_HOTELS: Hotel[] = [
  {
    id: 1n,
    name: "Sparsa Resorts Kanyakumari",
    location: "Beachfront, Kanyakumari",
    description:
      "Luxurious beachfront resort with panoramic ocean views. Enjoy world-class amenities, authentic Tamil cuisine, and spa services by the sea.",
    imageUrls: [
      "https://picsum.photos/seed/sparsa-resorts-kk/800/500",
      "https://picsum.photos/seed/sparsa-resorts-pool/800/500",
      "https://picsum.photos/seed/sparsa-resorts-room/800/500",
    ],
    amenities: [
      "Swimming Pool",
      "Spa",
      "Restaurant",
      "WiFi",
      "Ocean View",
      "Gym",
    ],
    pricePerNight: 3600n,
    starRating: 4n,
    totalRooms: 48n,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    name: "Hotel Sea View",
    location: "East Car Street, Kanyakumari",
    description:
      "Comfortable hotel with spectacular sunrise views over the ocean. Centrally located for easy access to all major attractions.",
    imageUrls: [
      "https://picsum.photos/seed/hotel-sea-view-kk/800/500",
      "https://picsum.photos/seed/hotel-sea-view-room/800/500",
      "https://picsum.photos/seed/hotel-sea-view-lobby/800/500",
    ],
    amenities: ["Sea View", "Restaurant", "WiFi", "Room Service", "Parking"],
    pricePerNight: 3500n,
    starRating: 3n,
    totalRooms: 32n,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    name: "Annai Resorts",
    location: "Near Vivekananda Rock, Kanyakumari",
    description:
      "Serene heritage-style resort offering traditional hospitality with modern comforts. Perfect base for exploring the spiritual landmarks.",
    imageUrls: [
      "https://picsum.photos/seed/annai-resorts-kk/800/500",
      "https://picsum.photos/seed/annai-resorts-garden/800/500",
      "https://picsum.photos/seed/annai-resorts-spa/800/500",
    ],
    amenities: [
      "Pool",
      "Ayurvedic Spa",
      "Restaurant",
      "WiFi",
      "Garden",
      "Temple View",
    ],
    pricePerNight: 5500n,
    starRating: 5n,
    totalRooms: 60n,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 4n,
    name: "Hotel Seashore",
    location: "Kanyakumari Main Beach, Tamil Nadu",
    description:
      "A beachfront hotel offering spectacular views of the sunrise and sunset over the sea, just steps from the famous beach.",
    imageUrls: [
      "https://picsum.photos/seed/hotel-seashore-kk/800/500",
      "https://picsum.photos/seed/hotel-seashore-rooftop/800/500",
    ],
    amenities: [
      "Sea View",
      "Rooftop Restaurant",
      "Free WiFi",
      "AC Rooms",
      "24hr Room Service",
    ],
    pricePerNight: 2800n,
    starRating: 3n,
    totalRooms: 28n,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 5n,
    name: "Hotel Tri Sea",
    location: "Near Vivekananda Rock Ferry, Kanyakumari",
    description:
      "Named after the three seas meeting at Kanyakumari, Hotel Tri Sea offers comfortable rooms with ocean-facing balconies.",
    imageUrls: [
      "https://picsum.photos/seed/hotel-tri-sea-kk/800/500",
      "https://picsum.photos/seed/hotel-tri-sea-ocean/800/500",
    ],
    amenities: [
      "Ocean View Rooms",
      "Restaurant",
      "Parking",
      "Free WiFi",
      "Travel Desk",
    ],
    pricePerNight: 2200n,
    starRating: 3n,
    totalRooms: 24n,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 6n,
    name: "The Gopinivas Grand",
    location: "Main Road, Kanyakumari Town",
    description:
      "A premium hotel in the heart of Kanyakumari town, offering luxury amenities with easy access to all major attractions.",
    imageUrls: [
      "https://picsum.photos/seed/gopinivas-grand-kk/800/500",
      "https://picsum.photos/seed/gopinivas-grand-pool/800/500",
      "https://picsum.photos/seed/gopinivas-grand-suite/800/500",
    ],
    amenities: [
      "Swimming Pool",
      "Spa",
      "Multi-cuisine Restaurant",
      "Business Center",
      "Airport Transfer",
      "Free WiFi",
    ],
    pricePerNight: 5500n,
    starRating: 4n,
    totalRooms: 75n,
    createdAt: BigInt(Date.now()),
  },
];

export const SAMPLE_RESTAURANTS: Restaurant[] = [
  {
    id: 1n,
    name: "Hotel Saravana Bhavan (KK Branch)",
    cuisineTypes: ["South Indian", "Vegetarian"],
    description:
      "Beloved institution serving piping-hot idli, crispy dosas, and aromatic filter coffee. The go-to morning spot for locals and pilgrims heading to the temple.",
    location: "Main Road, Kanyakumari",
    address: "Main Rd, Near Bus Stand, Kanyakumari 629702",
    phone: "+91 94430 11111",
    ratingAverage: 4.5,
    priceRange: 1,
    imageUrl: "https://picsum.photos/seed/saravana-bhavan-kk/800/600",
    hoursOpen: "6:00 AM – 10:30 PM",
    isFeatured: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    name: "Leela Café & Sea View",
    cuisineTypes: ["Seafood", "Kerala", "Tamil"],
    description:
      "Fresh-catch seafood with panoramic views of the three-ocean confluence. Try the butter garlic prawns and coconut fish curry on the open-air terrace.",
    location: "Beach Road, Kanyakumari",
    address: "Beach Rd, East Car Street, Kanyakumari 629702",
    phone: "+91 94430 22222",
    ratingAverage: 4.7,
    priceRange: 2,
    imageUrl: "https://picsum.photos/seed/leela-cafe-seaview/800/600",
    hoursOpen: "11:00 AM – 11:00 PM",
    isFeatured: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    name: "Muttom Beach Restaurant",
    cuisineTypes: ["Seafood", "Coastal Tamil"],
    description:
      "No-frills shack on the quieter Muttom beach serving the freshest grilled fish, squid fry, and crab masala directly from the morning catch.",
    location: "Muttom Beach, Kanyakumari District",
    address: "Muttom Village, Kanyakumari 629177",
    phone: "+91 98765 33333",
    ratingAverage: 4.3,
    priceRange: 1,
    imageUrl: "https://picsum.photos/seed/muttom-beach-restaurant/800/600",
    hoursOpen: "10:00 AM – 9:00 PM",
    isFeatured: false,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 4n,
    name: "The Coral Dining Room",
    cuisineTypes: ["Multi-Cuisine", "Continental", "Indian"],
    description:
      "Signature restaurant of Sparsa Resorts offering an elevated dining experience. The terracotta-tiled hall serves Kerala sadya on banana leaf every Sunday.",
    location: "Sparsa Resorts, Kanyakumari",
    address: "Beach Rd, Kanyakumari 629702",
    phone: "+91 94430 44444",
    ratingAverage: 4.6,
    priceRange: 3,
    imageUrl: "https://picsum.photos/seed/coral-dining-room/800/600",
    hoursOpen: "7:00 AM – 11:00 PM",
    isFeatured: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 5n,
    name: "Kaaviyam Heritage Kitchen",
    cuisineTypes: ["Traditional Tamil", "Tribal Cuisine"],
    description:
      "Community-run kitchen championing indigenous recipes of the Kanyakumari tribal communities — jackfruit biriyani, bamboo shoot curry, and wild honey desserts.",
    location: "Gandhi Nagar, Kanyakumari",
    address: "Gandhi Nagar, Kanyakumari 629702",
    phone: "+91 87654 55555",
    ratingAverage: 4.8,
    priceRange: 2,
    imageUrl: "https://picsum.photos/seed/kaaviyam-heritage-kitchen/800/600",
    hoursOpen: "12:00 PM – 9:00 PM",
    isFeatured: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 6n,
    name: "Ocean Pearl Bar & Grill",
    cuisineTypes: ["Seafood", "Grills", "North Indian"],
    description:
      "Rooftop grill with sunset views over the Arabian Sea. House specialty is the tandoor-grilled pomfret marinated in coastal spices, served with coconut chutney.",
    location: "Hotel Sea View, Kanyakumari",
    address: "East Car St, Kanyakumari 629702",
    phone: "+91 98765 66666",
    ratingAverage: 4.4,
    priceRange: 2,
    imageUrl: "https://picsum.photos/seed/ocean-pearl-bar-grill/800/600",
    hoursOpen: "6:00 PM – 11:30 PM",
    isFeatured: false,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 7n,
    name: "Triveni Juice Corner",
    cuisineTypes: ["Juices", "Snacks", "Vegetarian"],
    description:
      "Famous since 1989, this tiny stall at the three-ocean point serves fresh coconut water, sugarcane juice, and spicy sundal — the perfect post-sunrise snack.",
    location: "Sangam Point, Kanyakumari",
    address: "Sangam Point, Kanyakumari 629702",
    phone: "+91 94430 77777",
    ratingAverage: 4.2,
    priceRange: 1,
    imageUrl: "https://picsum.photos/seed/triveni-juice-corner/800/600",
    hoursOpen: "5:30 AM – 7:30 PM",
    isFeatured: false,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 8n,
    name: "Nagercoil Chettiyar Mess",
    cuisineTypes: ["Chettinad", "Tamil", "Non-Vegetarian"],
    description:
      "Authentic Chettinad-style mess just 20 km away in Nagercoil, renowned for pepper chicken, mutton kola urundai, and fiery rasam that warms the soul.",
    location: "Nagercoil, Kanyakumari District",
    address: "11 Bazaar St, Nagercoil 629001",
    phone: "+91 87654 88888",
    ratingAverage: 4.6,
    priceRange: 1,
    imageUrl: "https://picsum.photos/seed/nagercoil-chettiyar-mess/800/600",
    hoursOpen: "7:00 AM – 3:00 PM, 7:00 PM – 10:00 PM",
    isFeatured: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 9n,
    name: "Tip of India Café",
    cuisineTypes: ["Café", "Bakery", "Continental"],
    description:
      "Artisan café with hand-roasted Coorg coffee, sourdough toast, and fresh fruit bowls — a peaceful retreat for travellers seeking a slow morning by the sea.",
    location: "Near Sunset Point, Kanyakumari",
    address: "West Car St, Kanyakumari 629702",
    phone: "+91 98765 99999",
    ratingAverage: 4.5,
    priceRange: 2,
    imageUrl: "https://picsum.photos/seed/tip-of-india-cafe/800/600",
    hoursOpen: "7:00 AM – 8:00 PM",
    isFeatured: true,
    createdAt: BigInt(Date.now()),
  },
];

export const SAMPLE_GUIDES: Guide[] = [
  {
    id: 1n,
    name: "Rajan Pillai",
    specialization: "Historical Tours",
    bio: "Born and raised in Kanyakumari, Rajan has 15 years of experience guiding tourists through ancient temples, palaces, and historical landmarks with rich storytelling.",
    languagesSpoken: ["Tamil", "English", "Malayalam", "Hindi"],
    phoneNumber: "+91 94430 12345",
    ratePerDay: 1200n,
    experienceYears: 15n,
    imageUrl: "https://picsum.photos/seed/guide-rajan-pillai/400/400",
    isAvailable: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    name: "Meenakshi Devi",
    specialization: "Cultural Heritage",
    bio: "A passionate cultural ambassador with deep knowledge of local tribal traditions, folk arts, and Kanyakumari's unique blend of Tamil and Kerala cultures.",
    languagesSpoken: ["Tamil", "English", "Malayalam"],
    phoneNumber: "+91 98765 43210",
    ratePerDay: 1000n,
    experienceYears: 8n,
    imageUrl: "https://picsum.photos/seed/guide-meenakshi-devi/400/400",
    isAvailable: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    name: "Suresh Kumar",
    specialization: "Nature & Wildlife",
    bio: "Expert naturalist and trekker who leads expeditions to the Western Ghats, waterfalls, and wildlife sanctuaries surrounding Kanyakumari district.",
    languagesSpoken: ["Tamil", "English", "Hindi"],
    phoneNumber: "+91 87654 32109",
    ratePerDay: 1500n,
    experienceYears: 12n,
    imageUrl: "https://picsum.photos/seed/guide-suresh-kumar/400/400",
    isAvailable: false,
    createdAt: BigInt(Date.now()),
  },
];
