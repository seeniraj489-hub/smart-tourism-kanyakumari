import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminGuidesPage from "./pages/AdminGuidesPage";
import AdminHotelsPage from "./pages/AdminHotelsPage";
import AdminPlacesPage from "./pages/AdminPlacesPage";
import AdminReviewsPage from "./pages/AdminReviewsPage";
import DashboardPage from "./pages/DashboardPage";
import GuideDetailPage from "./pages/GuideDetailPage";
import GuidesPage from "./pages/GuidesPage";
import HomePage from "./pages/HomePage";
import HotelDetailPage from "./pages/HotelDetailPage";
import HotelsPage from "./pages/HotelsPage";
import LoginPage from "./pages/LoginPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import PlacesPage from "./pages/PlacesPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import RestaurantsPage from "./pages/RestaurantsPage";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: LoginPage,
});

const placesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/places",
  component: PlacesPage,
});

const placeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/places/$id",
  component: PlaceDetailPage,
});

const hotelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hotels",
  component: HotelsPage,
});

const hotelDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hotels/$id",
  component: HotelDetailPage,
});

const guidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guides",
  component: GuidesPage,
});

const guideDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guides/$id",
  component: GuideDetailPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const restaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants",
  component: RestaurantsPage,
});

const restaurantDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants/$id",
  component: RestaurantDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AuthGuard adminOnly>
      <AdminDashboardPage />
    </AuthGuard>
  ),
});

const adminPlacesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/places",
  component: () => (
    <AuthGuard adminOnly>
      <AdminPlacesPage />
    </AuthGuard>
  ),
});

const adminHotelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/hotels",
  component: () => (
    <AuthGuard adminOnly>
      <AdminHotelsPage />
    </AuthGuard>
  ),
});

const adminGuidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/guides",
  component: () => (
    <AuthGuard adminOnly>
      <AdminGuidesPage />
    </AuthGuard>
  ),
});

const adminReviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/reviews",
  component: () => (
    <AuthGuard adminOnly>
      <AdminReviewsPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  placesRoute,
  placeDetailRoute,
  hotelsRoute,
  hotelDetailRoute,
  guidesRoute,
  guideDetailRoute,
  dashboardRoute,
  restaurantsRoute,
  restaurantDetailRoute,
  profileRoute,
  adminRoute,
  adminPlacesRoute,
  adminHotelsRoute,
  adminGuidesRoute,
  adminReviewsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
