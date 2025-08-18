import React from "react";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

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
const isAdminLoggedIn = () => {
  return localStorage.getItem("adminToken") !== null;
};

const AdminRoute = () => {
  return isAdminLoggedIn() ? <AdminPanel /> : <Navigate to="/login" replace />;
};

const AppRouter = createBrowserRouter([
  {
    path: "/",
    // We wrap the existing MainLayout and the ChatWidget in a React Fragment.
    // This correctly places the ChatWidget as a sibling to your layout, ensuring it is always rendered.
    element: (
      <>
        <MainLayout />
        <ChatWidget />
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
      { path: "media", element: <Media /> },

      {
        path: "media",
        children: [
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
      { path: "login", element: <AuthForm /> },
      { path: "admin", element: <AdminRoute /> },
      { path: "contact", element: <ContactUs /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={AppRouter} />;
}

export default App;
