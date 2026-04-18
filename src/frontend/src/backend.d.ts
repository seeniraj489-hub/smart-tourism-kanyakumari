import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface UpdateGuideInput {
    id: EntityId;
    bio: string;
    name: string;
    ratePerDay: bigint;
    isAvailable: boolean;
    imageUrl: string;
    experienceYears: bigint;
    specialization: GuideSpecialization;
    phoneNumber: string;
    languagesSpoken: Array<string>;
}
export type EntityId = bigint;
export interface CreatePlaceInput {
    latitude?: number;
    imageUrls: Array<string>;
    name: string;
    bestTimeToVisit: string;
    description: string;
    isFeatured: boolean;
    longitude?: number;
    address: string;
    category: PlaceCategory;
}
export interface CreateHotelInput {
    starRating: bigint;
    imageUrls: Array<string>;
    pricePerNight: bigint;
    name: string;
    description: string;
    amenities: Array<string>;
    location: string;
    totalRooms: bigint;
}
export interface RoomType {
    id: EntityId;
    pricePerNight: bigint;
    name: string;
    hotelId: EntityId;
    description: string;
    availability: bigint;
    maxGuests: bigint;
}
export interface Restaurant {
    id: EntityId;
    ratingAverage: number;
    name: string;
    createdAt: Timestamp;
    cuisineTypes: Array<string>;
    description: string;
    priceRange: bigint;
    hoursOpen: string;
    imageUrl: string;
    isFeatured: boolean;
    address: string;
    phone: string;
    location: string;
}
export interface Guide {
    id: EntityId;
    bio: string;
    name: string;
    createdAt: Timestamp;
    ratePerDay: bigint;
    isAvailable: boolean;
    imageUrl: string;
    experienceYears: bigint;
    specialization: GuideSpecialization;
    phoneNumber: string;
    languagesSpoken: Array<string>;
}
export interface UpdateHotelInput {
    id: EntityId;
    starRating: bigint;
    imageUrls: Array<string>;
    pricePerNight: bigint;
    name: string;
    description: string;
    amenities: Array<string>;
    location: string;
    totalRooms: bigint;
}
export interface Place {
    id: EntityId;
    latitude?: number;
    imageUrls: Array<string>;
    name: string;
    createdAt: Timestamp;
    bestTimeToVisit: string;
    description: string;
    isFeatured: boolean;
    longitude?: number;
    address: string;
    category: PlaceCategory;
}
export interface DashboardStats {
    totalBookings: bigint;
    totalRestaurants: bigint;
    totalHotels: bigint;
    totalGuides: bigint;
    totalUsers: bigint;
    pendingReviews: bigint;
    totalPlaces: bigint;
}
export type UserId = Principal;
export interface CreateRestaurantInput {
    ratingAverage: number;
    name: string;
    cuisineTypes: Array<string>;
    description: string;
    priceRange: bigint;
    hoursOpen: string;
    imageUrl: string;
    isFeatured: boolean;
    address: string;
    phone: string;
    location: string;
}
export interface CreateBookingInput {
    checkIn: string;
    paymentTransactionId?: string;
    guestCount: bigint;
    referenceId: EntityId;
    bookingType: BookingType;
    checkOut: string;
    paymentAmount: bigint;
}
export interface Hotel {
    id: EntityId;
    starRating: bigint;
    imageUrls: Array<string>;
    pricePerNight: bigint;
    name: string;
    createdAt: Timestamp;
    description: string;
    amenities: Array<string>;
    location: string;
    totalRooms: bigint;
}
export interface UpdatePlaceInput {
    id: EntityId;
    latitude?: number;
    imageUrls: Array<string>;
    name: string;
    bestTimeToVisit: string;
    description: string;
    isFeatured: boolean;
    longitude?: number;
    address: string;
    category: PlaceCategory;
}
export interface SessionToken {
    token: string;
    expiresAt: Timestamp;
    username: string;
    userId: Principal;
    fullName: string;
    mobileNumber: string;
    email: string;
}
export interface CreateRoomTypeInput {
    pricePerNight: bigint;
    name: string;
    hotelId: EntityId;
    description: string;
    availability: bigint;
    maxGuests: bigint;
}
export interface CreateGuideInput {
    bio: string;
    name: string;
    ratePerDay: bigint;
    isAvailable: boolean;
    imageUrl: string;
    experienceYears: bigint;
    specialization: GuideSpecialization;
    phoneNumber: string;
    languagesSpoken: Array<string>;
}
export interface Booking {
    id: EntityId;
    status: BookingStatus;
    checkIn: string;
    paymentStatus: PaymentStatus;
    referenceNumber: string;
    paymentTransactionId?: string;
    userId: UserId;
    guestCount: bigint;
    createdAt: Timestamp;
    referenceId: EntityId;
    bookingType: BookingType;
    checkOut: string;
    paymentAmount: bigint;
}
export interface Review {
    id: EntityId;
    isApproved: boolean;
    userId: UserId;
    createdAt: Timestamp;
    reviewerName: string;
    comment: string;
    targetType: ReviewTargetType;
    rating: bigint;
    targetId: EntityId;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum GuideSpecialization {
    nature = "nature",
    adventure = "adventure",
    general = "general",
    heritage = "heritage"
}
export enum PaymentStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum PlaceCategory {
    other = "other",
    viewpoint = "viewpoint",
    beach = "beach",
    temple = "temple",
    waterfall = "waterfall"
}
export enum ReviewTargetType {
    hotel = "hotel",
    guide = "guide"
}
export interface backendInterface {
    approveReview(id: EntityId): Promise<boolean>;
    cancelBooking(id: EntityId): Promise<boolean>;
    claimAdmin(): Promise<boolean>;
    confirmBookingPayment(bookingId: EntityId, transactionId: string, amount: bigint): Promise<boolean>;
    createBooking(input: CreateBookingInput): Promise<Booking>;
    createGuide(input: CreateGuideInput): Promise<Guide>;
    createHotel(input: CreateHotelInput): Promise<Hotel>;
    createPlace(input: CreatePlaceInput): Promise<Place>;
    createRestaurant(input: CreateRestaurantInput): Promise<Restaurant>;
    createRoomType(input: CreateRoomTypeInput): Promise<RoomType>;
    deleteGuide(id: EntityId): Promise<boolean>;
    deleteHotel(id: EntityId): Promise<boolean>;
    deletePlace(id: EntityId): Promise<boolean>;
    deleteRestaurant(id: EntityId): Promise<boolean>;
    getBooking(id: EntityId): Promise<Booking | null>;
    getDashboardStats(): Promise<DashboardStats>;
    getGuide(id: EntityId): Promise<Guide | null>;
    getHotel(id: EntityId): Promise<Hotel | null>;
    getPlace(id: EntityId): Promise<Place | null>;
    getRestaurant(id: EntityId): Promise<Restaurant | null>;
    getReviewsForTarget(targetType: ReviewTargetType, targetId: EntityId): Promise<Array<Review>>;
    getRoomTypesForHotel(hotelId: EntityId): Promise<Array<RoomType>>;
    getUserBookings(): Promise<Array<Booking>>;
    isAdminCaller(): Promise<boolean>;
    listAllBookings(): Promise<Array<Booking>>;
    listFeaturedPlaces(): Promise<Array<Place>>;
    listFeaturedRestaurants(): Promise<Array<Restaurant>>;
    listGuides(): Promise<Array<Guide>>;
    listHotels(): Promise<Array<Hotel>>;
    listPendingReviews(): Promise<Array<Review>>;
    listPlaces(): Promise<Array<Place>>;
    listRestaurants(): Promise<Array<Restaurant>>;
    loginUser(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: SessionToken;
    } | {
        __kind__: "err";
        err: string;
    }>;
    logoutUser(token: string): Promise<boolean>;
    registerUser(username: string, password: string, fullName: string, mobileNumber: string, email: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    rejectReview(id: EntityId): Promise<boolean>;
    searchGuides(term: string, specialization: GuideSpecialization | null): Promise<Array<Guide>>;
    searchHotels(term: string): Promise<Array<Hotel>>;
    searchPlaces(term: string, category: PlaceCategory | null): Promise<Array<Place>>;
    searchRestaurants(term: string): Promise<Array<Restaurant>>;
    updateGuide(input: UpdateGuideInput): Promise<boolean>;
    updateHotel(input: UpdateHotelInput): Promise<boolean>;
    updatePlace(input: UpdatePlaceInput): Promise<boolean>;
    validateSession(token: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
