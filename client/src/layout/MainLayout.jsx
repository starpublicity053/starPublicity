import AnnouncementBanner from "@/pages/AnnouncementBanner";
import Footer from "@/pages/Footer";
import Navbar from "@/pages/Navbar";
import ScrollToTop from "@/pages/ScrollToTop";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const [showBanner, setShowBanner] = useState(true); // shows on reload
  const [bannerHeight, setBannerHeight] = useState(0); // measured height
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <ScrollToTop /> {/* ✅ 2. ADD THE COMPONENT HERE */}

      {!isAdminPage && showBanner && (
        <AnnouncementBanner
          onClose={() => setShowBanner(false)}
          onHeightChange={setBannerHeight}
        />
      )}

      {!isAdminPage && (
        <Navbar
          bannerHeight={showBanner ? bannerHeight : 0}
          offset={showBanner} // keep your existing offset logic if you want
        />
      )}

      <main>
        <Outlet />
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
}

export default MainLayout;