import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- Centralized Navigation Configuration ---
const navigationConfig = [
  {
    name: "Media",
    href: "/media",
    dropdown: [
      { name: "ATL", href: "/media/atl", desc: "Above-the-line campaigns" },
      { name: "BTL", href: "/media/btl", desc: "Below-the-line strategies" },
      { name: "TTL", href: "/media/ttl", desc: "Hybrid approaches" },
    ],
  },
  { name: "Blogs", href: "/resources/blogs" },
  { name: "Best Campaigns", href: "/campaigns" },
  { name: "About", href: "/about" },
  { name: "Careers", href: "/career" },
];

const mobileNavIcons = {
  Media: (p) => (
    <path
      {...p}
      d="M10 21h7a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM12 21v-4"
    />
  ),
  Blogs: (p) => (
    <path
      {...p}
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6"
    />
  ),
  "Best Campaigns": (p) => (
    <path
      {...p}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  ),
  About: (p) => (
    <path
      {...p}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  Careers: (p) => (
    <path
      {...p}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
};

// --- Dropdown Component ---
const Dropdown = ({ open, items, location }) => {
  const getDropdownItemClass = (href) => {
    const isActive = location.pathname.startsWith(href);
    return `group flex items-start gap-3 px-4 py-3 transition-colors duration-200 ${
      isActive ? "bg-gray-100" : "hover:bg-gray-100"
    }`;
  };

  const getTitleClass = (href) => {
    const isActive = location.pathname.startsWith(href);
    return `font-semibold ${
      isActive
        ? "text-[#3B38A0] transition-colors duration-200"
        : "text-gray-800 group-hover:text-[#3B38A0]"
    }`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform"
        >
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={getDropdownItemClass(item.href)}
            >
              <div className="mt-1 text-[#1A2A80] transition-transform duration-200 group-hover:scale-110">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className={getTitleClass(item.href)}>{item.name}</p>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Desktop Navigation (WITH "SPLIT UNDERLINE" ANIMATION) ---
const DesktopNav = ({ navigation, location, isNavbarSolid }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    const isDropdownOpen = activeDropdown === "Media";
    const isMediaLink = path === "/media";

    const baseClasses =
      "relative font-semibold text-base leading-6 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md group";

    if (!isNavbarSolid) {
      return `${baseClasses} text-white ${
        isActive ? "bg-white/20" : "hover:text-white/80"
      } ${isMediaLink && isDropdownOpen ? "bg-white/20" : ""}`;
    }

    return `${baseClasses} ${
      isActive ? "text-[#3B38A0]" : "text-gray-700 hover:text-[#3B38A0]"
    } ${isMediaLink && isDropdownOpen ? "text-[#3B38A0] bg-gray-100" : ""}`;
  };

  const Underline = ({ isNavbarSolid }) => {
    const color = isNavbarSolid ? "#3B38A0" : "white";
    return (
      <motion.div
        layoutId="underline"
        className="absolute left-0 right-0 h-[3px] bg-current bottom-0"
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ backgroundColor: color }}
      />
    );
  };

  return (
    <>
      {navigation.map((link) => {
        const isActive = location.pathname.startsWith(link.href);
        const isHovered = hoveredItem === link.name;

        return (
          <div
            key={link.name}
            className="relative"
            onMouseEnter={() => {
              setActiveDropdown(link.name);
              setHoveredItem(link.name);
            }}
            onMouseLeave={() => {
              setActiveDropdown(null);
              setHoveredItem(null);
            }}
          >
            {link.dropdown ? (
              <>
                <motion.button
                  className={`flex items-center gap-x-1 ${getLinkClass(
                    link.href
                  )}`}
                >
                  {link.name}
                  <svg
                    className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                      activeDropdown === link.name ? "rotate-180" : ""
                    } ${isNavbarSolid ? "text-[#1A2A80]" : "text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>
                <Dropdown
                  open={activeDropdown === link.name}
                  items={link.dropdown}
                  location={location}
                />
              </>
            ) : (
              <Link
                to={link.href}
                className={`relative ${getLinkClass(link.href)}`}
              >
                {link.name}
                {isActive && <Underline isNavbarSolid={isNavbarSolid} />}
              </Link>
            )}

            {/* --- NEW "SPLIT" HOVER ANIMATION --- */}
            <AnimatePresence>
              {isHovered && !isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] flex">
                  <motion.div
                    className="w-1/2 h-full"
                    style={{
                      originX: 1, // Grow from the right
                      backgroundColor: isNavbarSolid ? "#3B38A0" : "white",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  <motion.div
                    className="w-1/2 h-full"
                    style={{
                      originX: 0, // Grow from the left
                      backgroundColor: isNavbarSolid ? "#3B38A0" : "white",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
};


// --- Mobile Menu (improved for small screens) ---
const MobileMenu = ({ isOpen, onClose }) => {
  const [openMedia, setOpenMedia] = useState(false);
  const location = useLocation();
  const dialogRef = useRef(null);

  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.04, duration: 0.25 },
    },
    closed: {
      opacity: 0,
      x: "-100%",
      transition: { when: "afterChildren", duration: 0.2 },
    },
  };

  const itemVariants = { open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -12 } };

  // Focus trap + Esc close
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first && first.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key === "Tab" && focusable.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Close menu on route change
  useEffect(() => {
    if (isOpen) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobileMenuTitle"
          className="fixed inset-0 bg-white/95 backdrop-blur-lg z-[150] p-safe pb-[max(env(safe-area-inset-bottom),1rem)] pt-[max(1rem,env(safe-area-inset-top))] lg:hidden"
          ref={dialogRef}
        >
          <div className="flex flex-col h-full">
            {/* Header row */}
            <div className="flex items-center justify-between px-2">
              <h2 id="mobileMenuTitle" className="text-lg font-semibold text-gray-800">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-700 hover:text-[#3B38A0] focus:outline-none focus:ring-2 focus:ring-[#3B38A0]/40"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable nav */}
            <nav className="flex-grow overflow-y-auto mt-4">
              <ul className="space-y-1 px-2">
                {navigationConfig.map((link) => (
                  <motion.li key={link.name} variants={itemVariants}>
                    {link.dropdown ? (
                      <div className="rounded-lg">
                        <button
                          onClick={() => setOpenMedia((v) => !v)}
                          className="flex items-center justify-between w-full px-4 py-3 text-xl font-semibold text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B38A0]/30"
                          aria-expanded={openMedia}
                          aria-controls="mobile-sub-media"
                        >
                          <span className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-[#1A2A80]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              {mobileNavIcons[link.name]({ strokeLinecap: "round", strokeLinejoin: "round" })}
                            </svg>
                            {link.name}
                          </span>
                          <motion.svg
                            animate={{ rotate: openMedia ? 180 : 0 }}
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>

                        <AnimatePresence initial={false}>
                          {openMedia && (
                            <motion.ul
                              id="mobile-sub-media"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="overflow-hidden pl-12 pr-2 py-1 space-y-1"
                            >
                              {link.dropdown.map((subLink) => (
                                <li key={subLink.name}>
                                  <Link
                                    to={subLink.href}
                                    className="block px-3 py-2 text-lg text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B38A0]/30"
                                  >
                                    {subLink.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={link.href}
                        className="flex items-center gap-3 px-4 py-3 text-xl font-semibold text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B38A0]/30"
                      >
                        <svg className="w-6 h-6 text-[#1A2A80]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          {mobileNavIcons[link.name]({ strokeLinecap: "round", strokeLinejoin: "round" })}
                        </svg>
                        {link.name}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom actions */}
            <div className="mt-4 px-2 pb-2">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/media"
                  className="w-full text-center px-4 py-3 rounded-full border-2 border-[#3B38A0] text-[#3B38A0] font-semibold hover:bg-[#3B38A0] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3B38A0]/40"
                >
                  Media Finder
                </Link>
                <Link
                  to="/contact"
                  className="w-full text-center px-4 py-3 rounded-full bg-[#3B38A0] text-white font-bold hover:bg-[#3B38A0]/90 focus:outline-none focus:ring-2 focus:ring-[#3B38A0]/40"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main Navbar ---
const Navbar = ({ offset, bannerHeight = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isTransparentPage = location.pathname === "/";
  const isNavbarSolid = scrolled || !isTransparentPage || isOpen;

  // Base top gap: mimic previous `${offset ? "top-6" : "top-2"}` => 24px / 8px
  const baseOffsetPx = offset ? 24 : 8;
  const topPx = bannerHeight + baseOffsetPx;

  // Close handler passed to MobileMenu
  const handleCloseMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 w-[98%] max-w-screen-2xl z-[100] transition-all duration-300 ease-in-out ${
          isNavbarSolid
            ? "bg-white/70 shadow-2xl backdrop-blur-md rounded-[3rem] mt-2"
            : "bg-transparent"
        }`}
        // Respect notches & banner height
        style={{
          top: `calc(${topPx}px + env(safe-area-inset-top))`,
        }}
      >
        <div className="mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" aria-label="Home" className="block">
                <img
                  className="h-10 sm:h-12 lg:h-16 w-auto"
                  src="/assets/logo2.png" // This is the corrected path
                  alt="Star Publicity Logo"
                />
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-x-1">
              <DesktopNav
                navigation={navigationConfig}
                location={location}
                isNavbarSolid={isNavbarSolid}
              />
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-x-4">
              <Link
                to="/media"
                className={`px-6 py-3 rounded-full border-2 text-base font-semibold transition-colors duration-300 ${
                  isNavbarSolid
                    ? "border-[#3B38A0] text-[#3B38A0] hover:bg-[#3B38A0] hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-[#3B38A0]"
                }`}
              >
                Media Finder
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 rounded-full font-bold tracking-wide shadow-md bg-[#3B38A0] text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile burger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen((v) => !v)}
                className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isNavbarSolid
                    ? "text-gray-700 hover:text-[#3B38A0] focus:ring-[#3B38A0]/40"
                    : "text-white hover:text-gray-300 focus:ring-white/40"
                }`}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <motion.div animate={isOpen ? "open" : "closed"}>
                  <motion.span
                    variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } }}
                    className="block h-0.5 w-6 bg-current"
                  />
                  <motion.span
                    variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                    className="block h-0.5 w-6 bg-current my-1.5"
                  />
                  <motion.span
                    variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -6 } }}
                    className="block h-0.5 w-6 bg-current"
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <MobileMenu isOpen={isOpen} onClose={handleCloseMenu} />
    </>
  );
};

export default Navbar;