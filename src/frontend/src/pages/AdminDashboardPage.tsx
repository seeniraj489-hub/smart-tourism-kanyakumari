import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useBookings,
  useClaimAdmin,
  useDashboardStats,
  useGuides,
  useHotels,
  useIsAdmin,
  usePlaces,
  useRestaurants,
} from "../hooks/useBackend";
import type {
  Booking,
  Guide,
  Hotel as HotelType,
  Place,
  Restaurant,
} from "../types";

export const ADMIN_SIDEBAR_LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/places", label: "Places", icon: MapPin },
  { to: "/admin/hotels", label: "Hotels", icon: Building2 },
  { to: "/admin/guides", label: "Guides", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
] as const;

export function AdminSidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="w-56 shrink-0 bg-card border-r border-border hidden lg:flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-sm text-foreground">
            Admin Panel
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5" aria-label="Admin navigation">
        {ADMIN_SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => {
          const isActive = activePath === to;
          return (
            <Link
              key={to}
              to={to}
              data-ocid={`admin.sidebar.${label.toLowerCase()}_link`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-secondary hover:bg-secondary/8"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          data-ocid="admin.sidebar.back_to_site_link"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}

export function AdminMobileNav({ activePath }: { activePath: string }) {
  return (
    <div className="lg:hidden flex gap-1 overflow-x-auto px-4 py-2 bg-card border-b border-border">
      {ADMIN_SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => {
        const isActive = activePath === to;
        return (
          <Link
            key={to}
            to={to}
            data-ocid={`admin.mobile.${label.toLowerCase()}_link`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-smooth ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-secondary hover:bg-secondary/8"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: bigint | undefined;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  ocid: string;
  idx: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  ocid,
  idx,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
    >
      <Card
        className="surface-card hover:shadow-elevated transition-smooth"
        data-ocid={ocid}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                {title}
              </p>
              {value === undefined ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                <p className="text-3xl font-display font-bold text-foreground">
                  {value.toString()}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
              <Icon className={`w-7 h-7 ${iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <div className="space-y-2" data-ocid="admin.data_table.loading_state">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }, (_, j) => `col-${j}`).map((k) => (
            <Skeleton key={k} className="h-9 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      data-ocid="admin.data_table.empty_state"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <MapPin className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

const statusColors: Record<string, string> = {
  Confirmed: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  Pending: "bg-accent/20 text-accent-foreground border-accent/30",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  Completed: "bg-muted text-muted-foreground border-border",
};

function HotelsTable({ data }: { data: HotelType[] }) {
  if (!data.length) return <EmptyState message="No hotels registered yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              #
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Hotel Name
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Location
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Rooms
            </th>
            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
              Price/Night
            </th>
            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
              Stars
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((hotel, i) => (
            <tr
              key={hotel.id.toString()}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
              data-ocid={`admin.hotels_table.item.${i + 1}`}
            >
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                {hotel.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {hotel.location}
              </td>
              <td className="px-4 py-3 text-foreground">
                {hotel.totalRooms.toString()}
              </td>
              <td className="px-4 py-3 text-right font-medium text-foreground">
                ₹{hotel.pricePerNight.toString()}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <Star className="w-3 h-3 fill-primary" />
                  {hotel.starRating.toString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlacesTable({ data }: { data: Place[] }) {
  if (!data.length) return <EmptyState message="No places added yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              #
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Place Name
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Category
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Address
            </th>
            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
              Featured
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((place, i) => (
            <tr
              key={place.id.toString()}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
              data-ocid={`admin.places_table.item.${i + 1}`}
            >
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                {place.name}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className="text-xs border-primary/30 text-primary bg-primary/5"
                >
                  {place.category}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                {place.address}
              </td>
              <td className="px-4 py-3 text-center">
                {place.isFeatured ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-border" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GuidesTable({ data }: { data: Guide[] }) {
  if (!data.length) return <EmptyState message="No guides registered yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              #
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Guide Name
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Specialization
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Phone
            </th>
            <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
              Exp. (yrs)
            </th>
            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((guide, i) => (
            <tr
              key={guide.id.toString()}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
              data-ocid={`admin.guides_table.item.${i + 1}`}
            >
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                {guide.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {guide.specialization}
              </td>
              <td className="px-4 py-3 text-foreground font-mono text-xs">
                {guide.phoneNumber}
              </td>
              <td className="px-4 py-3 text-right text-foreground">
                {guide.experienceYears.toString()}
              </td>
              <td className="px-4 py-3 text-center">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    guide.isAvailable
                      ? "border-secondary/40 text-secondary-foreground bg-secondary/10"
                      : "border-border text-muted-foreground bg-muted"
                  }`}
                >
                  {guide.isAvailable ? "Available" : "Busy"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RestaurantsTable({ data }: { data: Restaurant[] }) {
  const priceLabel = (p: number) =>
    ["", "Budget", "Mid-range", "Fine Dining"][p] ?? "—";
  if (!data.length) return <EmptyState message="No restaurants added yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              #
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Restaurant
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Cuisine
            </th>
            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
              Rating
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Price Range
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr
              key={r.id.toString()}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
              data-ocid={`admin.restaurants_table.item.${i + 1}`}
            >
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                {r.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">
                {r.cuisineTypes.join(", ")}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <Star className="w-3 h-3 fill-primary" />
                  {r.ratingAverage.toFixed(1)}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className="text-xs border-accent/30 text-accent-foreground bg-accent/5"
                >
                  {priceLabel(r.priceRange)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingsTable({ data }: { data: Booking[] }) {
  if (!data.length) return <EmptyState message="No bookings made yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              #
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Reference
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Type
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Check-In
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
              Check-Out
            </th>
            <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking, i) => (
            <tr
              key={booking.id.toString()}
              className="border-b border-border/60 hover:bg-muted/30 transition-colors"
              data-ocid={`admin.bookings_table.item.${i + 1}`}
            >
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">
                {booking.referenceNumber}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className="text-xs border-primary/30 text-primary bg-primary/5"
                >
                  {booking.bookingType}
                </Badge>
              </td>
              <td className="px-4 py-3 text-foreground">{booking.checkIn}</td>
              <td className="px-4 py-3 text-foreground">{booking.checkOut}</td>
              <td className="px-4 py-3 text-center">
                <Badge
                  variant="outline"
                  className={`text-xs ${statusColors[booking.status] ?? "border-border text-muted-foreground"}`}
                >
                  {booking.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { isAdmin } = useIsAdmin();
  const { isAuthenticated } = useInternetIdentity();
  const claimAdmin = useClaimAdmin();

  const { data: hotels = [], isLoading: hotelsLoading } = useHotels();
  const { data: places = [], isLoading: placesLoading } = usePlaces();
  const { data: guides = [], isLoading: guidesLoading } = useGuides();
  const { data: restaurants = [], isLoading: restaurantsLoading } =
    useRestaurants();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();

  const statCards = [
    {
      title: "Tourist Places",
      value: stats?.totalPlaces,
      icon: MapPin,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      ocid: "admin.dashboard.places_card",
    },
    {
      title: "Hotels",
      value: stats?.totalHotels,
      icon: Building2,
      iconColor: "text-secondary",
      iconBg: "bg-secondary/15",
      ocid: "admin.dashboard.hotels_card",
    },
    {
      title: "Local Guides",
      value: stats?.totalGuides,
      icon: Users,
      iconColor: "text-accent-foreground",
      iconBg: "bg-accent/20",
      ocid: "admin.dashboard.guides_card",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings,
      icon: CalendarCheck,
      iconColor: "text-secondary",
      iconBg: "bg-secondary/10",
      ocid: "admin.dashboard.bookings_card",
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews,
      icon: Star,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
      ocid: "admin.dashboard.pending_reviews_card",
    },
  ];

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)]"
      data-ocid="admin.dashboard_page"
    >
      <AdminSidebar activePath="/admin" />

      <div className="flex-1 min-w-0">
        <AdminMobileNav activePath="/admin" />

        <div className="p-6 lg:p-8 bg-background min-h-full space-y-10">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Dashboard
                </h1>
                {isAdmin && (
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/40 text-primary bg-primary/5 ml-1"
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Manage Smart Tourism Kanyakumari content
              </p>
            </div>

            {isAuthenticated && !isAdmin && (
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
                data-ocid="admin.dashboard.claim_admin_button"
                onClick={() => claimAdmin.mutate()}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Claim Admin
              </Button>
            )}
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 xl:grid-cols-5 gap-4"
            data-ocid="admin.dashboard.stats_section"
          >
            {isLoading
              ? ["places", "hotels", "guides", "bookings", "reviews"].map(
                  (k) => (
                    <Card key={k} className="surface-card">
                      <CardContent className="p-5">
                        <Skeleton className="h-4 w-24 mb-3" />
                        <Skeleton className="h-8 w-16" />
                      </CardContent>
                    </Card>
                  ),
                )
              : statCards.map((card, i) => (
                  <StatCard key={card.title} {...card} idx={i} />
                ))}
          </div>

          {/* Data Tables */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            data-ocid="admin.dashboard.data_section"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-display text-base font-semibold text-foreground">
                Registration Data
              </h2>
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary bg-primary/5 ml-1"
              >
                Admin Only
              </Badge>
            </div>

            <Card
              className="surface-card border-border"
              data-ocid="admin.dashboard.data_tables_card"
            >
              <Tabs defaultValue="hotels" data-ocid="admin.data.tabs">
                <CardHeader className="pb-0 border-b border-border">
                  <TabsList className="bg-transparent gap-0 h-auto p-0 -mb-px flex-wrap">
                    {[
                      {
                        value: "hotels",
                        label: "Hotels",
                        icon: Building2,
                        count: hotels.length,
                      },
                      {
                        value: "places",
                        label: "Places",
                        icon: MapPin,
                        count: places.length,
                      },
                      {
                        value: "guides",
                        label: "Guides",
                        icon: Users,
                        count: guides.length,
                      },
                      {
                        value: "restaurants",
                        label: "Restaurants",
                        icon: UtensilsCrossed,
                        count: restaurants.length,
                      },
                      {
                        value: "bookings",
                        label: "Bookings",
                        icon: CalendarCheck,
                        count: bookings.length,
                      },
                    ].map(({ value, label, icon: Icon, count }) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        data-ocid={`admin.data.${value}_tab`}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth gap-2"
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {label}
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {count}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CardHeader>

                <CardContent className="p-0">
                  <TabsContent
                    value="hotels"
                    className="mt-0"
                    data-ocid="admin.hotels_table"
                  >
                    {hotelsLoading ? (
                      <div className="p-6">
                        <TableSkeleton cols={6} />
                      </div>
                    ) : (
                      <HotelsTable data={hotels} />
                    )}
                  </TabsContent>

                  <TabsContent
                    value="places"
                    className="mt-0"
                    data-ocid="admin.places_table"
                  >
                    {placesLoading ? (
                      <div className="p-6">
                        <TableSkeleton cols={5} />
                      </div>
                    ) : (
                      <PlacesTable data={places} />
                    )}
                  </TabsContent>

                  <TabsContent
                    value="guides"
                    className="mt-0"
                    data-ocid="admin.guides_table"
                  >
                    {guidesLoading ? (
                      <div className="p-6">
                        <TableSkeleton cols={6} />
                      </div>
                    ) : (
                      <GuidesTable data={guides} />
                    )}
                  </TabsContent>

                  <TabsContent
                    value="restaurants"
                    className="mt-0"
                    data-ocid="admin.restaurants_table"
                  >
                    {restaurantsLoading ? (
                      <div className="p-6">
                        <TableSkeleton cols={5} />
                      </div>
                    ) : (
                      <RestaurantsTable data={restaurants} />
                    )}
                  </TabsContent>

                  <TabsContent
                    value="bookings"
                    className="mt-0"
                    data-ocid="admin.bookings_table"
                  >
                    {bookingsLoading ? (
                      <div className="p-6">
                        <TableSkeleton cols={6} />
                      </div>
                    ) : (
                      <BookingsTable data={bookings} />
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Quick nav */}
          <div data-ocid="admin.dashboard.quick_nav_section">
            <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ADMIN_SIDEBAR_LINKS.slice(1).map(
                ({ to, label, icon: Icon }, i) => (
                  <Link
                    key={to}
                    to={to}
                    data-ocid={`admin.dashboard.quick.item.${i + 1}`}
                  >
                    <Card className="surface-card hover:shadow-elevated hover:border-primary/30 transition-smooth cursor-pointer group">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground">
                            Manage {label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Add · Edit · Delete
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
