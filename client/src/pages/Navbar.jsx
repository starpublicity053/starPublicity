import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";

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

// --- NEW: Custom Icons for the Attractive Dropdown ---
const dropdownIcons = {
  ATL: (props) => (
    <path {...props} d="M4 7v10m16-10v10M8 7v10m8-10v10m-4-8v6m-3-3h6" />
  ), // Broadcast / TV icon
  BTL: (props) => (
    <path
      {...props}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ), // Target audience icon
  TTL: (props) => (
    <path
      {...props}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 21v-1.01M12 3v1.01M20.364 16.228l.707.707M17.657 15.52l-.707-.707M3.636 7.772l-.707-.707M6.343 8.48l.707.707M16.228 3.636l.707.707M15.52 6.343l-.707-.707M7.772 20.364l-.707-.707M8.48 17.657l.707.707"
    />
  ), // Integrated / Hybrid icon
};

// --- REVAMPED Dropdown Component ---
const Dropdown = React.memo(function Dropdown({ open, items, location, id }) {
  const getDropdownItemClass = (href) => {
    const isActive = location.pathname.startsWith(href);
    return `group flex items-start gap-4 p-4 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-[#3B38A0]/10" : "hover:bg-[#3B38A0]/10"
    }`;
  };

  const getTitleClass = (href) => {
    const isActive = location.pathname.startsWith(href);
    return `font-semibold transition-colors duration-200 ${
      isActive ? "text-[#3B38A0]" : "text-gray-800 group-hover:text-[#3B38A0]"
    }`;
  };

  // Animation variants for staggering children
  const containerVariants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
    closed: {
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          id={id}
          // --- UPDATED: Glassmorphism effect ---
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 rounded-xl bg-white/80 backdrop-blur-xl shadow-lg ring-1 ring-black/5 z-50 transform"
        >
          {/* --- NEW: Dropdown caret --- */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-white/80"></div>
          </div>

          <motion.ul
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="p-2"
          >
            {items.map((item) => (
              <motion.li key={item.name} variants={itemVariants}>
                <Link
                  to={item.href}
                  className={getDropdownItemClass(item.href)}
                >
                  {/* --- UPDATED: Using new custom icons --- */}
                  <div className="mt-0.5 text-[#3B38A0] transition-transform duration-300 group-hover:scale-110">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      {dropdownIcons[item.name]({
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      })}
                    </svg>
                  </div>
                  <div>
                    <p className={getTitleClass(item.href)}>{item.name}</p>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// --- NEW: Extracted Pill component for memoization ---
const Pill = ({ isNavbarSolid }) => (
  <motion.div
    layoutId="desktop-nav-pill"
    className={`absolute inset-0 rounded-full ${
      isNavbarSolid ? "bg-black/5" : "bg-white/10"
    }`}
    style={{ backdropFilter: "blur(5px)" }}
    transition={{ type: "spring", stiffness: 350, damping: 35 }}
  />
);

// --- REVAMPED: DesktopNav with Sliding Glass Pill ---
const DesktopNav = React.memo(function DesktopNav({ navigation, location, isNavbarSolid }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navRef = useRef(null);

  // --- NEW: Close dropdown on click outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // --- NEW: Close dropdown on Escape key ---
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const activeLinkName =
    navigation.find((link) => location.pathname.startsWith(link.href))?.name ||
    null;
  const highlightedItem = hoveredItem || activeLinkName;

  const getTextColor = (linkName) => {
    const isHighlighted = linkName === highlightedItem;
    if (isHighlighted) {
      return isNavbarSolid ? "text-[#3B38A0]" : "text-white";
    }
    return isNavbarSolid
      ? "text-gray-600 hover:text-gray-900"
      : "text-white/80 hover:text-white";
  };

  return (
    <div className="flex items-center" ref={navRef}>
      {navigation.map((link) => (
        <div // This div now handles focus containment for the dropdown
          key={link.name}
          className="relative px-1 py-1"
          onMouseEnter={() => setHoveredItem(link.name)}
          onMouseLeave={() => setHoveredItem(null)}
          onFocus={() => link.dropdown && setOpenDropdown(link.name)}
          onBlur={(e) => {
            if (link.dropdown && !e.currentTarget.contains(e.relatedTarget)) {
              setOpenDropdown(null);
            }
          }}
        >
          {link.dropdown ? (
            <button
              className={`relative flex items-center gap-x-1.5 font-semibold text-base leading-6 px-4 py-2 transition-colors duration-300 ${getTextColor(
                link.name
              )}`}
              onClick={() =>
                setOpenDropdown(openDropdown === link.name ? null : link.name)
              }
              aria-haspopup="true"
              aria-expanded={openDropdown === link.name || hoveredItem === link.name}
              aria-controls={`desktop-dropdown-${link.name}`}
            >
              <span className="relative z-10">{link.name}</span>
              <motion.svg
                animate={{ rotate: hoveredItem === link.name ? 180 : 0 }}
                className="relative z-10 ml-1 h-4 w-4"
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
              </motion.svg>
            </button>
          ) : (
            <Link
              to={link.href}
              className={`relative block font-semibold text-base leading-6 px-4 py-2 transition-colors duration-300 ${getTextColor(
                link.name
              )}`}
            >
              <span className="relative z-10">{link.name}</span>
            </Link>
          )}
          {highlightedItem === link.name && <Pill isNavbarSolid={isNavbarSolid} />}
          {link.dropdown && (
            <Dropdown
              open={openDropdown === link.name || hoveredItem === link.name}
              items={link.dropdown}
              location={location}
              id={`desktop-dropdown-${link.name}`}
            />
          )}
        </div>
      ))}
    </div>
  );
});

// --- Mobile Menu (NO CHANGES HERE) ---
const MobileMenu = React.memo(function MobileMenu({ isOpen, onClose }) {
  const [openMedia, setOpenMedia] = useState(false);
  const location = useLocation();
  const dialogRef = useRef(null);

  // --- REVAMPED: Animation variants for a more engaging feel ---
  const menuVariants = {
    open: {
      clipPath: `circle(150% at calc(100% - 44px) 44px)`,
      transition: {
        type: "spring",
        stiffness: 40,
        restDelta: 2,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    closed: {
      clipPath: `circle(24px at calc(100% - 44px) 44px)`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        when: "afterChildren",
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

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
            <div className="flex items-center justify-between px-2">
              <h2
                id="mobileMenuTitle"
                className="text-lg font-semibold text-gray-800"
              >
                Menu
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-700 hover:text-[#3B38A0] focus:outline-none focus:ring-2 focus:ring-[#3B38A0]/40"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
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
                            <svg
                              className="w-6 h-6 text-[#1A2A80]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              {mobileNavIcons[link.name]({
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                              })}
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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
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
                        <svg
                          className="w-6 h-6 text-[#1A2A80]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          {mobileNavIcons[link.name]({
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                          })}
                        </svg>
                        {link.name}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
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
});

// --- Main Navbar (NO CHANGES HERE) ---
const Navbar = ({ offset, bannerHeight = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // --- OPTIMIZED: Close mobile menu on navigation ---
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isTransparentPage = location.pathname === "/";
  const isNavbarSolid = scrolled || !isTransparentPage || isOpen;
  const baseOffsetPx = offset ? 24 : 8;
  const topPx = bannerHeight + baseOffsetPx;
  const handleCloseMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 w-[98%] max-w-screen-2xl z-[100] transition-all duration-300 ease-in-out ${
          isNavbarSolid ? "mt-2" : ""
        }`}
        style={{ top: `calc(${topPx}px + env(safe-area-inset-top))` }}
      >
        <motion.div
          className="absolute inset-0 h-full w-full rounded-[3rem] border"
          initial={false}
          animate={{
            backgroundColor: isNavbarSolid
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(255, 255, 255, 0)",
            borderColor: isNavbarSolid
              ? "rgba(230, 230, 230, 0.5)"
              : "rgba(255, 255, 255, 0)",
            backdropFilter: isNavbarSolid ? "blur(16px)" : "blur(0px)",
            boxShadow: isNavbarSolid
              ? "0 10px 30px rgba(0,0,0,0.1)"
              : "0 0px 0px rgba(0,0,0,0)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 50 }}
        />
        <div className="relative mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-24">
            <div className="flex-shrink-0">
              <Link to="/" aria-label="Home" className="block">
                <img
                  className="h-10 sm:h-12 lg:h-16 w-auto"
                  src="/assets/logo2.png"
                  alt="Star Publicity Logo"
                />
              </Link>
            </div>
            <div className="hidden lg:flex items-center">
              <DesktopNav
                navigation={navigationConfig}
                location={location}
                isNavbarSolid={isNavbarSolid}
              />
            </div>
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
                className="px-8 py-3 rounded-full font-bold tracking-wide shadow-md bg-[#3B38A0] text-white hover:shadow-xl hover:bg-[#4c49c3] transform hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
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
                <motion.div
                  animate={isOpen ? "open" : "closed"}
                  aria-hidden="true"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    className="block h-0.5 w-6 bg-current"
                  />
                  <motion.span
                    variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                    className="block h-0.5 w-6 bg-current my-1.5"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    className="block h-0.5 w-6 bg-current"
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenu isOpen={isOpen} onClose={handleCloseMenu} />
    </>
  );
};

export default Navbar;