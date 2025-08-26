import React, { useEffect, useRef } from "react";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

// We assume your auth slice has a `setCredentials` action. Adjust path if needed.
import { setCredentials } from "./features/auth/authSlice";

import MainLayout from "./layout/MainLayout";
import Markets from "./pages/user/Markets";
import Career from "./pages/user/Career";
import HeroSection from "./pages/user/HeroSection";
import HomeAbout from "./pages/AboutHome";
import StatsSection from "./pages/StatsSection";
import MediaFinder from "./pages/MediaFinder";
import ServicesSection from "./pages/ServicesSection";
import ConnectSection from "./pages/ConnectSection";
import AboutUs from "./pages/user/About";
import Unipoles from "./pages/Media/ATL/Unipoles";
import BusBranding from "./pages/Media/ATL/BusBranding";
import BusStand from "./pages/Media/ATL/BusStand";
import CityGanteries from "./pages/Media/ATL/CityGanteries";
import KiosksAdvertisements from "./pages/Media/ATL/KiosksAdvertisements";
import CityMallAdvertisements from "./pages/Media/ATL/CityMallAdvertisements";
import VanActivity from "./pages/Media/ATL/VanActivity";
import PetrolPumps from "./pages/Media/ATL/PetrolPumps";
import WallWraps from "./pages/Media/ATL/WallWraps";
import WallPaintings from "./pages/Media/ATL/WallPaintings";
import IndianRailwayTrainsStations from "./pages/Media/ATL/IndianRailwayTrainsStations";
import MetroTrainsStations from "./pages/Media/ATL/MetroTrainsStations";
import AirportAdvertisements from "./pages/Media/ATL/AirportAdvertisements";
import NewspaperAdvertisements from "./pages/Media/ATL/NewspaperAdvertisements";
import TelevisionAdvertisements from "./pages/Media/ATL/TelevisionAdvertisements";
import FMRadioAdvertisements from "./pages/Media/ATL/FMRadioAdvertisements";
import CinemaAdvertising from "./pages/Media/BTL/CinemaAdvertising";
import DhabaBranding from "./pages/Media/BTL/DhabaBranding";
import EventBrandings from "./pages/Media/BTL/EventBrandings";
import LookWalker from "./pages/Media/BTL/LookWalker";
import PoleSunpacks from "./pages/Media/BTL/PoleSunpacks";
import RetailBranding from "./pages/Media/BTL/RetailBranding";
import SeminarsBranding from "./pages/Media/BTL/SeminarsBranding";
import TrafficBarricades from "./pages/Media/BTL/TrafficBarricades";
import ATLMarketing from "./pages/Media/ATL/ATL";
import BTLMarketing from "./pages/Media/BTL/BTL";
import BrandCollaboration from "./pages/Media/TTL/BrandCollaboration";
import EmailWhatsappMarketing from "./pages/Media/TTL/EmailWhatsappMarketing";
import GoogleAds from "./pages/Media/TTL/GoogleAds";
import MallInsideLedAds from "./pages/Media/TTL/MallInsideLedAds";
import McLedHoardingsAds from "./pages/Media/TTL/McLedHoardingsAds";
import SocialMediaAdvertising from "./pages/Media/TTL/SocialMediaAdvertising";
import TTLMarketing from "./pages/Media/TTL/TTL";
import AutoBranding from "./pages/Media/ATL/AutoBranding";
import Blogs from "./pages/Resources/Blogs";
import RegisterForm from "./pages/Forms/RegisterForm";
import ResetPasswordForm from "./pages/Forms/ResetPasswordForm";
import AuthForm from "./pages/Forms/AuthForm";
import ContactUs from "./pages/Forms/ContactUs";
import AdminPanel from "./pages/Admin/AdminPanel";
import Compaigns from "./pages/user/Compaigns";
import Products from "./pages/Resources/Products";
import BlogDetailPage from "./pages/Resources/BlogDetail/BlogDetailPage";
import JobPosition from "./pages/user/JobPosition";
import Media from "./pages/user/Media";
import AdEspressoSection from "./pages/AdEspressoSection";
import LatestBlogsSection from "./pages/LatestBlogSection";
import QuickEnquiry from "./pages/QuickEnquiry";
import TalkToExperts from "./pages/TalkToExperts";
import ChatWidget from "./pages/ChatBot/ChatWidget";

// --- ADMIN AUTH PROTECTION ---

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // When the user logs out, the `logout` action sets `userInfo` to null.
  // This check then fails, and the user is immediately redirected to the login page.
  // This is the primary protective layer for the admin route.
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // This is a secondary check to ensure the user has the correct role,
  // even if they have a valid token.
  const isAdmin = userInfo.role === "admin" || userInfo.role === "superAdmin";

  // If user is an admin, show the panel. Otherwise, redirect to the homepage.
  return isAdmin ? <AdminPanel /> : <Navigate to="/" replace />;
};

// Prevent logged-in admins from seeing auth pages
const GuestRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // If a logged-in admin tries to access a guest page (login/register),
  // redirect them to the admin panel.
  if (userInfo && (userInfo.role === "admin" || userInfo.role === "superAdmin")) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, show the guest page.
  return children;
};

// --- UNIFIED SESSION MANAGEMENT ---

// This single component handles both re-hydrating the session on app load
// and redirecting the user to the login page upon logout.
// It replaces the old AuthStateWatcher and the useEffect in the App component.
const SessionManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // A ref to track the previous user state to detect changes.
  const previousUserInfoRef = useRef(userInfo);

  // Effect 1: Handles re-hydrating the session from localStorage on initial app load.
  // This runs only once when the component mounts.
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const user = jwtDecode(token);
        dispatch(setCredentials({ user, token }));
      } catch (error) {
        console.error("Failed to decode token on app load, logging out:", error);
        localStorage.removeItem("adminToken");
      }
    }
  }, [dispatch]);

  // Effect 2: Watches for changes in the user's authentication state to handle logout.
  useEffect(() => {
    // If there was a user in the previous state, but not in the current one, it means they logged out.
    if (previousUserInfoRef.current && !userInfo) {
      navigate('/login');
    }
    // Update the ref with the current user info for the next render cycle.
    previousUserInfoRef.current = userInfo;
  }, [userInfo, navigate]);

  return null; // This component does not render anything to the UI.
};

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <MainLayout />
        <ToastContainer theme="colored" />
        <ChatWidget />
        <SessionManager />
      </>
    ),
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <AdEspressoSection />
            <HomeAbout />
            <MediaFinder />
            <ServicesSection />
            <ConnectSection />
            <LatestBlogsSection />
          </>
        ),
      },
      { path: "about", element: <AboutUs /> },

      {
        path: "media",
        children: [
          { index: true, element: <Media /> },
          { path: "ATL", element: <ATLMarketing /> },
          { path: "ATL/unipoles", element: <Unipoles /> },
          { path: "ATL/bus-branding", element: <BusBranding /> },
          { path: "ATL/bus-stands", element: <BusStand /> },
          { path: "ATL/auto-branding", element: <AutoBranding /> },
          { path: "ATL/city-gantries", element: <CityGanteries /> },
          { path: "ATL/kiosks", element: <KiosksAdvertisements /> },
          { path: "ATL/mall-ads", element: <CityMallAdvertisements /> },
          { path: "ATL/van-activity", element: <VanActivity /> },
          { path: "ATL/petrol-pumps", element: <PetrolPumps /> },
          { path: "ATL/wall-wraps", element: <WallWraps /> },
          { path: "ATL/wall-paintings", element: <WallPaintings /> },
          { path: "ATL/railway-ads", element: <IndianRailwayTrainsStations /> },
          { path: "ATL/metro-ads", element: <MetroTrainsStations /> },
          { path: "ATL/airport-ads", element: <AirportAdvertisements /> },
          { path: "ATL/newspaper-ads", element: <NewspaperAdvertisements /> },
          { path: "ATL/tv-ads", element: <TelevisionAdvertisements /> },
          { path: "ATL/radio-ads", element: <FMRadioAdvertisements /> },
          { path: "BTL", element: <BTLMarketing /> },
          { path: "BTL/cinema-advertising", element: <CinemaAdvertising /> },
          { path: "BTL/dhaba-advertising", element: <DhabaBranding /> },
          { path: "BTL/event-branding", element: <EventBrandings /> },
          { path: "BTL/look-walker", element: <LookWalker /> },
          { path: "BTL/pole-sunpacks", element: <PoleSunpacks /> },
          { path: "BTL/retail-branding", element: <RetailBranding /> },
          { path: "BTL/seminars-branding", element: <SeminarsBranding /> },
          { path: "BTL/traffic-barricades", element: <TrafficBarricades /> },
          { path: "TTL", element: <TTLMarketing /> },
          { path: "TTL/brand-collaboration", element: <BrandCollaboration /> },
          {
            path: "TTL/email-whatsapp-marketing",
            element: <EmailWhatsappMarketing />,
          },
          { path: "TTL/mall-inside-led", element: <MallInsideLedAds /> },
          { path: "TTL/mc-led-hoardings", element: <McLedHoardingsAds /> },
          { path: "TTL/social-media-ads", element: <SocialMediaAdvertising /> },
          { path: "TTL/google-ads", element: <GoogleAds /> },
        ],
      },
      {
        path: "resources",
        children: [
          { path: "blogs", element: <Blogs /> },
          { path: "blogs/:id", element: <BlogDetailPage /> },
          { path: "products", element: <Products /> },
        ],
      },
      { path: "campaigns", element: <Compaigns /> },
      { path: "career", element: <Career /> },
      { path: "JobPosition", element: <JobPosition /> },
      {
        path: "login",
        element: <GuestRoute><AuthForm /></GuestRoute>,
      },
      {
        path: "register",
        element: <GuestRoute><RegisterForm /></GuestRoute>,
      },
      {
        path: "forgot-password",
        // This now points to the unified ResetPasswordForm
        element: <GuestRoute><ResetPasswordForm /></GuestRoute>,
      },
      { path: "admin", element: <AdminRoute /> },
      { path: "contact", element: <ContactUs /> },
    ],
  },
]);

function App() {
  // All session logic has been moved into the SessionManager component
  // to keep the root App component clean.
  return <RouterProvider router={AppRouter} />;
}

export default App;
