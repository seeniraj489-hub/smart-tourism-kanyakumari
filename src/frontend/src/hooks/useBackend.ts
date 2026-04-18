import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  DashboardStats,
  Guide,
  GuideSpecialization,
  Hotel,
  Place,
  PlaceCategory,
  Restaurant,
} from "../types";
import {
  SAMPLE_GUIDES as guidesData,
  SAMPLE_HOTELS as hotelsData,
  SAMPLE_PLACES as placesData,
  SAMPLE_RESTAURANTS as restaurantsData,
} from "../types";

// ── In-memory booking store (user-visible) ───────────────────────────────────
// This is shared across the module so mutations are visible across hooks.
const userBookings: Booking[] = [];
let nextBookingId = 100n;

// ── In-memory mutable stores (client-side simulation) ────────────────────────
const places: Place[] = [...placesData];
const hotels: Hotel[] = [...hotelsData];
const guides: Guide[] = [...guidesData];
const restaurants: Restaurant[] = [...restaurantsData];
let nextPlaceId = BigInt(places.length + 1);
let nextHotelId = BigInt(hotels.length + 1);
let nextGuideId = BigInt(guides.length + 1);
let nextRestaurantId = BigInt(restaurants.length + 1);

// ── Admin bookings store (all bookings for admin panel) ───────────────────────
const ADMIN_SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 1n,
    userId: "user-001",
    bookingType: "Hotel",
    referenceId: 1n,
    checkIn: "2025-05-10",
    checkOut: "2025-05-13",
    guestCount: 2n,
    status: "Confirmed",
    referenceNumber: "KK-HTL-00001",
    totalAmount: 8700,
    paymentTransactionId: "pi_test_001",
    paymentMethod: "card",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    userId: "user-002",
    bookingType: "Guide",
    referenceId: 2n,
    checkIn: "2025-05-15",
    checkOut: "2025-05-15",
    guestCount: 4n,
    status: "Pending",
    referenceNumber: "KK-GDE-00002",
    totalAmount: 2400,
    paymentMethod: "offline",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    userId: "user-003",
    bookingType: "Hotel",
    referenceId: 3n,
    checkIn: "2025-06-01",
    checkOut: "2025-06-05",
    guestCount: 3n,
    status: "Completed",
    referenceNumber: "KK-HTL-00003",
    totalAmount: 15600,
    paymentTransactionId: "UPI_GPAY_1715000000000",
    paymentMethod: "gpay",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 4n,
    userId: "user-004",
    bookingType: "Guide",
    referenceId: 1n,
    checkIn: "2025-06-10",
    checkOut: "2025-06-10",
    guestCount: 2n,
    status: "Cancelled",
    referenceNumber: "KK-GDE-00004",
    totalAmount: 1200,
    paymentMethod: "phonepe",
    createdAt: BigInt(Date.now()),
  },
];

const allBookings: Booking[] = [...ADMIN_SAMPLE_BOOKINGS];

// ---------- Restaurants ----------
export function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => [...restaurants],
  });
}

export function useFeaturedRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: ["restaurants", "featured"],
    queryFn: async () => restaurants.filter((r) => r.isFeatured),
  });
}

export function useRestaurant(id: bigint | undefined) {
  return useQuery<Restaurant | undefined>({
    queryKey: ["restaurant", id?.toString()],
    queryFn: async () => restaurants.find((r) => r.id === id),
    enabled: id !== undefined,
  });
}

export function useSearchRestaurants(query: string) {
  return useQuery<Restaurant[]>({
    queryKey: ["restaurants", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [...restaurants];
      const q = query.toLowerCase();
      return restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisineTypes.some((c) => c.toLowerCase().includes(q)) ||
          r.location.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    },
  });
}

export interface RestaurantInput {
  name: string;
  cuisineTypes: string[];
  description: string;
  location: string;
  address: string;
  phone: string;
  ratingAverage: number;
  priceRange: number;
  imageUrl: string;
  hoursOpen: string;
  isFeatured: boolean;
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RestaurantInput): Promise<Restaurant> => {
      nextRestaurantId += 1n;
      const restaurant: Restaurant = {
        ...input,
        id: nextRestaurantId,
        createdAt: BigInt(Date.now()),
      };
      restaurants.push(restaurant);
      return restaurant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<void> => {
      const idx = restaurants.findIndex((r) => r.id === id);
      if (idx !== -1) restaurants.splice(idx, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// ---------- Places ----------
export function usePlaces(category?: string) {
  return useQuery<Place[]>({
    queryKey: ["places", category],
    queryFn: async () => {
      return category
        ? places.filter((p) => p.category === category)
        : [...places];
    },
  });
}

export function useFeaturedPlaces() {
  return useQuery<Place[]>({
    queryKey: ["places", "featured"],
    queryFn: async () => places.filter((p) => p.isFeatured),
  });
}

export function usePlace(id: bigint | undefined) {
  return useQuery<Place | undefined>({
    queryKey: ["place", id?.toString()],
    queryFn: async () => places.find((p) => p.id === id),
    enabled: id !== undefined,
  });
}

export interface PlaceInput {
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  bestTimeToVisit: string;
  imageUrls: string[];
  isFeatured: boolean;
}

export function useCreatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PlaceInput): Promise<Place> => {
      nextPlaceId += 1n;
      const place: Place = {
        ...input,
        id: nextPlaceId,
        createdAt: BigInt(Date.now()),
      };
      places.push(place);
      return place;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: PlaceInput }): Promise<Place> => {
      const idx = places.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Place not found");
      const updated: Place = { ...places[idx], ...input };
      places[idx] = updated;
      return updated;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      queryClient.invalidateQueries({ queryKey: ["place", id.toString()] });
    },
  });
}

export function useDeletePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<void> => {
      const idx = places.findIndex((p) => p.id === id);
      if (idx !== -1) places.splice(idx, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// ---------- Hotels ----------
export function useHotels() {
  return useQuery<Hotel[]>({
    queryKey: ["hotels"],
    queryFn: async () => [...hotels],
  });
}

export function useFeaturedHotels() {
  return useQuery<Hotel[]>({
    queryKey: ["hotels", "featured"],
    queryFn: async () => hotels.slice(0, 3),
  });
}

export function useHotel(id: bigint | undefined) {
  return useQuery<Hotel | undefined>({
    queryKey: ["hotel", id?.toString()],
    queryFn: async () => hotels.find((h) => h.id === id),
    enabled: id !== undefined,
  });
}

export interface HotelInput {
  name: string;
  location: string;
  description: string;
  imageUrls: string[];
  amenities: string[];
  pricePerNight: bigint;
  starRating: bigint;
  totalRooms: bigint;
}

export function useCreateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: HotelInput): Promise<Hotel> => {
      nextHotelId += 1n;
      const hotel: Hotel = {
        ...input,
        id: nextHotelId,
        createdAt: BigInt(Date.now()),
      };
      hotels.push(hotel);
      return hotel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: HotelInput }): Promise<Hotel> => {
      const idx = hotels.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error("Hotel not found");
      const updated: Hotel = { ...hotels[idx], ...input };
      hotels[idx] = updated;
      return updated;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotel", id.toString()] });
    },
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<void> => {
      const idx = hotels.findIndex((h) => h.id === id);
      if (idx !== -1) hotels.splice(idx, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// ---------- Guides ----------
export function useGuides() {
  return useQuery<Guide[]>({
    queryKey: ["guides"],
    queryFn: async () => [...guides],
  });
}

export function useFeaturedGuides() {
  return useQuery<Guide[]>({
    queryKey: ["guides", "featured"],
    queryFn: async () => guides.slice(0, 3),
  });
}

export function useGuide(id: bigint | undefined) {
  return useQuery<Guide | undefined>({
    queryKey: ["guide", id?.toString()],
    queryFn: async () => guides.find((g) => g.id === id),
    enabled: id !== undefined,
  });
}

export interface GuideInput {
  name: string;
  specialization: GuideSpecialization;
  bio: string;
  languagesSpoken: string[];
  phoneNumber: string;
  ratePerDay: bigint;
  experienceYears: bigint;
  imageUrl: string;
  isAvailable: boolean;
}

export function useCreateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: GuideInput): Promise<Guide> => {
      nextGuideId += 1n;
      const guide: Guide = {
        ...input,
        id: nextGuideId,
        createdAt: BigInt(Date.now()),
      };
      guides.push(guide);
      return guide;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: GuideInput }): Promise<Guide> => {
      const idx = guides.findIndex((g) => g.id === id);
      if (idx === -1) throw new Error("Guide not found");
      const updated: Guide = { ...guides[idx], ...input };
      guides[idx] = updated;
      return updated;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["guides"] });
      queryClient.invalidateQueries({ queryKey: ["guide", id.toString()] });
    },
  });
}

export function useDeleteGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint): Promise<void> => {
      const idx = guides.findIndex((g) => g.id === id);
      if (idx !== -1) guides.splice(idx, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// ---------- Dashboard Stats ----------
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => ({
      totalPlaces: BigInt(places.length),
      totalHotels: BigInt(hotels.length),
      totalGuides: BigInt(guides.length),
      totalRestaurants: BigInt(restaurants.length),
      totalBookings: BigInt(allBookings.length + userBookings.length),
      pendingReviews: 3n,
    }),
  });
}

// ---------- Admin Bookings (all users) ----------
export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => [...allBookings, ...userBookings],
  });
}

// ---------- User Bookings (current session) ----------
export function useUserBookings() {
  return useQuery<Booking[]>({
    queryKey: ["user-bookings"],
    queryFn: async () => [...userBookings],
  });
}

// ---------- Create Booking ----------
export interface CreateBookingInput {
  hotelId: bigint;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalAmount: number;
  paymentMethod: string;
  referenceNumber: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBookingInput): Promise<Booking> => {
      await new Promise((r) => setTimeout(r, 300));
      nextBookingId += 1n;
      const booking: Booking = {
        id: nextBookingId,
        userId: "current-user",
        bookingType: "Hotel",
        referenceId: input.hotelId,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guestCount: BigInt(input.guestCount),
        status: "Pending",
        referenceNumber: input.referenceNumber,
        totalAmount: input.totalAmount,
        paymentMethod: input.paymentMethod,
        createdAt: BigInt(Date.now()),
      };
      userBookings.push(booking);
      allBookings.push(booking);
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// ---------- Confirm Booking Payment ----------
export interface ConfirmPaymentInput {
  bookingId: bigint;
  transactionId: string;
  amount: number;
}

export function useConfirmBookingPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ConfirmPaymentInput): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 400));
      // Update in userBookings
      const uIdx = userBookings.findIndex((b) => b.id === input.bookingId);
      if (uIdx !== -1) {
        userBookings[uIdx] = {
          ...userBookings[uIdx],
          status: "Confirmed",
          paymentTransactionId: input.transactionId,
          totalAmount: input.amount,
        };
      }
      // Update in allBookings
      const aIdx = allBookings.findIndex((b) => b.id === input.bookingId);
      if (aIdx !== -1) {
        allBookings[aIdx] = {
          ...allBookings[aIdx],
          status: "Confirmed",
          paymentTransactionId: input.transactionId,
          totalAmount: input.amount,
        };
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// ---------- Cancel User Booking ----------
export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: bigint): Promise<void> => {
      await new Promise((r) => setTimeout(r, 600));
      const uIdx = userBookings.findIndex((b) => b.id === bookingId);
      if (uIdx !== -1)
        userBookings[uIdx] = { ...userBookings[uIdx], status: "Cancelled" };
      const aIdx = allBookings.findIndex((b) => b.id === bookingId);
      if (aIdx !== -1)
        allBookings[aIdx] = { ...allBookings[aIdx], status: "Cancelled" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ---------- User Role ----------
export function useIsAdmin() {
  const { isAuthenticated, identity } = useInternetIdentity();
  return {
    isAdmin: isAuthenticated && !!identity,
    isAuthenticated,
  };
}

// ---------- Admin Claim ----------
export function useClaimAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-role"] });
    },
  });
}
