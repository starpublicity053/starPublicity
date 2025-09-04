// Blogs.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useGetBlogsQuery } from "../../features/auth/blogApi";
import { Link, useNavigate, useLocation } from "react-router-dom";

// ===============================================
// MODAL COMPONENT (InternalModal)
// ===============================================
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    transition: { duration: 0.2 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const InternalModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  backdropColor = "bg-black/80",
  className = "",
  headerClassName = "",
  contentClassName = "",
}) => {
  const modalRef = useRef(null);
  const firstFocusableElement = useRef(null);
  const lastFocusableElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        firstFocusableElement.current = focusableElements[0];
        lastFocusableElement.current =
          focusableElements[focusableElements.length - 1];

        firstFocusableElement.current?.focus({ preventScroll: true });
      }
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (event) => {
      if (!isOpen) return;
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Tab") {
        if (
          document.activeElement === lastFocusableElement.current &&
          !event.shiftKey
        ) {
          event.preventDefault();
          firstFocusableElement.current?.focus({ preventScroll: true });
        } else if (
          document.activeElement === firstFocusableElement.current &&
          event.shiftKey
        ) {
          event.preventDefault();
          lastFocusableElement.current?.focus({ preventScroll: true });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const modalSizeClasses = {
    sm: "w-96",
    md: "w-[500px]",
    lg: "w-[768px]",
    xl: "w-[1024px]",
    full: "w-[90vw] max-w-[1200px]",
    custom: "",
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ✅ UPDATED: Increased z-index for the backdrop */}
          <motion.div
            className={`fixed inset-0 ${backdropColor} z-[1000]`}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ✅ UPDATED: Increased z-index for the modal content */}
          <motion.div
            ref={modalRef}
            className={`fixed inset-0 m-auto h-auto max-h-[90vh] rounded-2xl shadow-2xl z-[1001] p-8 md:p-10 flex flex-col font-sans overflow-hidden
                                  ${modalSizeClasses[size]} bg-gradient-to-br from-blue-700 to-blue-900 text-white border-2 border-blue-500
                                  ${className}`}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
            tabIndex="-1"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className={`relative pb-6 flex-shrink-0 flex justify-between items-center ${headerClassName}`}
            >
              <h3
                id="modal-title"
                className="text-[28px] font-extrabold leading-tight uppercase drop-shadow-md"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                type="button"
                className="relative p-2 rounded-full bg-blue-600/50 hover:bg-red-500/80 transition-all duration-300
                                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 group"
                aria-label="Close filter modal"
                ref={(el) => {
                  if (!firstFocusableElement.current)
                    firstFocusableElement.current = el;
                }}
              >
                <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                <span className="absolute inset-0 rounded-full animate-ping-slow opacity-0 group-hover:opacity-75 bg-red-400"></span>
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto px-2 ${contentClassName}`}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const modalRoot = document.getElementById("modal-root");
  return modalRoot ? createPortal(modalContent, modalRoot) : modalContent;
};

// ===============================================
// END MODAL COMPONENT
// ===============================================

const useGlobalTilt = (
  sensitivity = 0.03,
  springConfig = { stiffness: 150, damping: 20 }
) => {
  const tiltXSpring = useSpring(0, springConfig);
  const tiltYSpring = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / innerWidth;
      const y = (e.clientY - innerHeight / 2) / innerHeight;
      tiltXSpring.set(x * sensitivity);
      tiltYSpring.set(y * sensitivity);
    };

    const handleMouseLeave = () => {
      tiltXSpring.set(0);
      tiltYSpring.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [sensitivity, tiltXSpring, tiltYSpring]);

  return { x: tiltXSpring, y: tiltYSpring };
};

// ===============================================
// WorkCard Component
// ===============================================
const WorkCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [35, 0, 0, -35]
  );
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [-25, 0, 0, 25]
  );
  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["25%", "0%", "-25%"]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1, 0.75]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  const imageParallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Link to={`/resources/blogs/${item._id}`} className="block">
      <motion.div
        ref={cardRef}
        key={item._id || item.title + index}
        initial={{ opacity: 0, y: 150, rotateX: 30, rotateY: -15, scale: 0.7 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 15,
          delay: index * 0.08,
        }}
        whileHover={{
          scale: 1.08,
          boxShadow:
            "0 20px 40px -8px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.05)",
          y: -10,
          rotateX: 0,
          rotateY: 0,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        className="relative rounded-lg overflow-hidden shadow-md transform transition-all duration-300 cursor-pointer group bg-white text-gray-900"
        style={{
          rotateX,
          rotateY,
          translateY,
          scale,
          opacity,
          perspective: 1000,
        }}
      >
        <div
          className="absolute inset-0 z-10 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(45deg, #2563EB, #3B82F6, #2563EB)",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 3s ease infinite",
            padding: "2px",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="w-full aspect-[4/5] overflow-hidden relative z-0">
          <motion.img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-125 group-hover:brightness-105"
            style={{ y: imageParallaxY }}
          />
        </div>
        <div className="p-5 text-left relative z-10">
          <motion.h3
            className="text-xl md:text-2xl font-bold uppercase mb-1 text-gray-900"
            initial={{ y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {item.title}
          </motion.h3>
          <motion.p
            className="text-blue-600 text-sm md:text-base font-normal"
            initial={{ y: 0 }}
            whileHover={{ y: -3, opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            By: {item.author || item.category}{" "}
          </motion.p>
        </div>
      </motion.div>
    </Link>
  );
};

// ===============================================
// MAIN BLOGS COMPONENT
// ===============================================

const Blogs = () => {
  const globalTilt = useGlobalTilt(0.03);
  const navigate = useNavigate();
  const location = useLocation();

  const initialVisibleCards = 3;
  const cardsPerLoad = 6;
  const [visibleCards, setVisibleCards] = useState(initialVisibleCards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTagsFilter, setSelectedTagsFilter] = useState([]);
  const [tempSelectedTags, setTempSelectedTags] = useState([]);

  const {
    data: blogPosts = [],
    isLoading,
    isError,
    error,
  } = useGetBlogsQuery();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get("tag");
    if (tagParam) {
      const tagsFromUrl = tagParam
        .split(",")
        .map((tag) => decodeURIComponent(tag.trim()));
      setSelectedTagsFilter(tagsFromUrl);
      setTempSelectedTags(tagsFromUrl);
    } else {
      setSelectedTagsFilter([]);
      setTempSelectedTags([]);
    }
  }, [location.search]);

  const filteredWorkImages = blogPosts.filter((blog) => {
    if (selectedTagsFilter.length === 0) {
      return true;
    }
    return selectedTagsFilter.some(
      (selectedTag) => blog.tags && blog.tags.includes(selectedTag)
    );
  });

  const shouldShowLoadMoreButton = filteredWorkImages.length > visibleCards;

  const handleLoadMore = () => {
    setVisibleCards((prevVisibleCards) =>
      Math.min(prevVisibleCards + cardsPerLoad, filteredWorkImages.length)
    );
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTempSelectedTags(selectedTagsFilter);
  }, [selectedTagsFilter]);

  const handleApplyFilters = () => {
    setSelectedTagsFilter(tempSelectedTags);
    setVisibleCards(initialVisibleCards);
    setIsModalOpen(false);

    const params = new URLSearchParams();
    if (tempSelectedTags.length > 0) {
      params.set(
        "tag",
        tempSelectedTags.map((tag) => encodeURIComponent(tag)).join(",")
      );
    }
    navigate({ search: params.toString() });
  };

  const handleResetFilters = () => {
    setSelectedTagsFilter([]);
    setTempSelectedTags([]);
    setVisibleCards(initialVisibleCards);
    setIsModalOpen(false);
    navigate({ search: "" });
  };

  const handleTagFilterChange = (tagValue) => {
    setTempSelectedTags((prevTags) => {
      if (prevTags.includes(tagValue)) {
        return prevTags.filter((tag) => tag !== tagValue);
      } else {
        return [...prevTags, tagValue];
      }
    });
  };

  const heroImage = "/assets/blog.png";

  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(heroScrollProgress, [0, 1], ["0%", "50%"]);

  const filterRef = useRef(null);
  const showAllWorkRef = useRef(null);

  const [arrowPath, setArrowPath] = useState("");
  const [arrowOpacity, setArrowOpacity] = useState(0);
  const [arrowheadTransform, setArrowheadTransform] = useState("");

  useEffect(() => {
    const updateArrow = () => {
      if (filterRef.current && showAllWorkRef.current) {
        const filterRect = filterRef.current.getBoundingClientRect();
        const showAllWorkRect = showAllWorkRef.current.getBoundingClientRect();

        const startX = filterRect.left + filterRect.width / 2;
        const startY = filterRect.top + filterRect.height / 2;

        const endX = showAllWorkRect.right - 10;
        const endY = showAllWorkRect.top + showAllWorkRect.height * 0.3;

        const cp1x = startX + (endX - startX) * 0.4;
        const cp1y = startY - 100;

        const cp2x = endX - (endX - startX) * 0.4;
        const cp2y = endY - 100;

        const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        setArrowPath(path);

        const isFilterVisible =
          filterRect.top < window.innerHeight && filterRect.bottom > 0;
        const isShowAllWorkVisible =
          showAllWorkRect.top < window.innerHeight &&
          showAllWorkRect.bottom > 0;
        setArrowOpacity(isFilterVisible && isShowAllWorkVisible ? 1 : 0);

        const tangentX = 3 * (endX - cp2x);
        const tangentY = 3 * (endY - cp2y);
        const tangentAngle = Math.atan2(tangentY, tangentX) * (180 / Math.PI);

        setArrowheadTransform(
          `translate(${endX}, ${endY}) rotate(${tangentAngle})`
        );
      } else {
        setArrowOpacity(0);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          updateArrow();
        }
      },
      { threshold: 0.1 }
    );

    if (filterRef.current) observer.observe(filterRef.current);
    if (showAllWorkRef.current) observer.observe(showAllWorkRef.current);

    window.addEventListener("scroll", updateArrow);
    window.addEventListener("resize", updateArrow);
    updateArrow();

    return () => {
      if (filterRef.current) observer.unobserve(filterRef.current);
      if (showAllWorkRef.current) observer.unobserve(showAllWorkRef.current);
      window.removeEventListener("scroll", updateArrow);
      window.addEventListener("resize", updateArrow);
    };
  }, [filterRef, showAllWorkRef]);

  // ✅ UPDATED: The early returns for isLoading and isError have been removed.
  // The logic is now handled directly inside the JSX below.

  const uniqueTags = [
    ...new Set(blogPosts.flatMap((blog) => blog.tags || [])),
  ].filter(Boolean);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white text-gray-900 min-h-screen font-sans overflow-x-hidden">
      <section
        ref={heroRef}
        className="relative h-[90vh] flex flex-col items-start justify-end text-white overflow-hidden p-8 pb-16 md:p-16 md:pb-24 lg:p-24 lg:pb-32"
        style={{ paddingTop: "calc(2rem + 20px)" }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundPositionY: backgroundY,
            zIndex: 0,
          }}
        />
        <div
          className="absolute inset-0 bg-black"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 10,
          }}
        />
        <motion.div
          className="relative z-20 text-left max-w-2xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        >
          <motion.p
            className="text-lg md:text-xl font-bold text-yellow-500 uppercase tracking-widest mb-3 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            READ OUR BLOGS
          </motion.p>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            Ideas That Drive Change
          </motion.h1>
        </motion.div>
      </section>

      <motion.div
        style={{
          perspective: "1500px",
          rotateX: globalTilt.y,
          rotateY: globalTilt.x,
          transformOrigin: "center center",
        }}
        className="transform-gpu"
      >
        <section className="bg-white text-gray-900 py-20 px-10 relative overflow-hidden font-sans">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="max-w-[1200px] mx-auto text-center relative">
              <div className="flex flex-col items-center mb-8">
                <motion.h2 className="font-extrabold text-[clamp(48px,6vw,72px)] leading-none text-gray-900">
                  SHOW ME
                </motion.h2>

                <motion.p
                  ref={showAllWorkRef}
                  className="relative inline-block my-2"
                >
                  <span className="font-script text-blue-600 text-[clamp(48px,6vw,72px)] leading-none">
                    all
                  </span>
                  <span className="absolute left-0 right-0 bottom-[-5px] h-1.5 bg-blue-600 transform scale-x-110 -rotate-12 origin-left"></span>
                </motion.p>

                <motion.h2 className="font-extrabold text-[clamp(48px,6vw,72px)] leading-none text-gray-900">
                  WORK
                </motion.h2>

                <motion.button
                  ref={filterRef}
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                  className="relative inline-flex items-center mt-6 group cursor-pointer
                                                   text-blue-600 hover:text-blue-800 transition-colors duration-200 ease-in-out
                                                   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-md"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.3,
                  }}
                  aria-label="Open filter modal"
                >
                  <span className="font-cedarville font-bold italic uppercase tracking-wider text-blue-600 text-lg md:text-xl leading-none mr-2">
                    Filter Work
                  </span>
                </motion.button>
              </div>
            </div>

            <motion.svg
              className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
              style={{ opacity: arrowOpacity }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: arrowOpacity ? 1 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              {arrowPath && (
                <motion.path
                  d={arrowPath}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: arrowOpacity ? 1 : 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              )}
              {arrowPath && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: arrowOpacity ? 1 : 0 }}
                  transition={{ delay: arrowOpacity ? 0.8 : 0, duration: 0.5 }}
                  style={{ transform: arrowheadTransform }}
                >
                  <path
                    d="M -10 -5 L 0 0 L -10 5"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.g>
              )}
            </motion.svg>

            <div className="pt-20 pb-0">
              {/* ✅ UPDATED: Conditional rendering for loading and error states */}
              {isLoading ? (
                <div className="text-center py-20 text-gray-600">
                  <p>Loading blog posts...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-20 text-red-600">
                  <p>
                    Error loading posts: {error.message || "Could not connect to the server."}
                  </p>
                </div>
              ) : filteredWorkImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-w-[1200px] mx-auto">
                  {filteredWorkImages
                    .slice(0, visibleCards)
                    .map((item, index) => (
                      <WorkCard key={item._id} item={item} index={index} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-600">
                  <p>No blog posts found for the selected filter.</p>
                </div>
              )}

              {shouldShowLoadMoreButton && (
                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.2,
                  }}
                >
                  <Button
                    onClick={handleLoadMore}
                    type="button"
                    aria-label="Load more blog cards"
                    className="relative inline-flex items-center justify-center px-8 py-4 border-2 border-[#1A2A80] text-base font-semibold rounded-full text-[#1A2A80] bg-transparent overflow-hidden transition-all duration-300 ease-out hover:bg-fuchsia-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-fuchsia-300 focus:ring-offset-2 group"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-[#1A2A80] to-[#1A2A80] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    <motion.span className="relative z-10 flex items-center font-semibold">
                      Discover More Blogs
                      <ArrowRight className="ml-2 -mr-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </motion.span>

                    <motion.div
                      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{
                        opacity: 1,
                        transition: {
                          delay: 0.15,
                          duration: 0.4,
                          ease: "easeOut",
                        },
                      }}
                      whileTap={{ scale: 1.1, transition: { duration: 0.2 } }}
                    >
                      <Sparkles className="h-6 w-6 text-yellow-300 opacity-60 animate-pulse" />
                    </motion.div>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </motion.div>

      {/* --- FILTER MODAL --- */}
      <InternalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="FILTER BY TAGS"
        size="md"
        backdropColor="bg-black/80"
      >
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 md:gap-4 mt-4">
          <fieldset className="space-y-4">
            <legend className="sr-only">Select blog tags filter</legend>

            <div key="All Blogs">
              <label
                className="relative inline-flex items-center cursor-pointer text-white text-lg md:text-xl font-medium w-full
                                             p-3 md:p-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 ease-in-out"
              >
                <input
                  type="checkbox"
                  className="absolute h-0 w-0 opacity-0 peer"
                  name="blogTagFilter"
                  value="All Blogs"
                  checked={tempSelectedTags.length === 0}
                  onChange={() => setTempSelectedTags([])}
                />
                <span
                  className="relative flex-shrink-0 w-5 h-5 mr-3 md:w-6 md:h-6 md:mr-4
                                           border-2 border-white rounded-md transition-all duration-200
                                           peer-checked:bg-white peer-checked:border-blue-300
                                           peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-blue-700 peer-focus-visible:ring-white"
                >
                  <span
                    className="absolute inset-1 rounded-sm bg-blue-700 opacity-0
                                                   peer-checked:opacity-100 transition-opacity duration-200"
                  ></span>
                </span>
                <span className="select-none">All Blogs</span>
              </label>
            </div>

            {uniqueTags.map((tag) => (
              <div key={tag}>
                <label
                  className="relative inline-flex items-center cursor-pointer text-white text-lg md:text-xl font-medium w-full
                                               p-3 md:p-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 ease-in-out"
                >
                  <input
                    type="checkbox"
                    className="absolute h-0 w-0 opacity-0 peer"
                    name="blogTagFilter"
                    value={tag}
                    checked={tempSelectedTags.includes(tag)}
                    onChange={() => handleTagFilterChange(tag)}
                  />
                  <span
                    className="relative flex-shrink-0 w-5 h-5 mr-3 md:w-6 md:h-6 md:mr-4
                                             border-2 border-white rounded-md transition-all duration-200
                                             peer-checked:bg-white peer-checked:border-blue-300
                                             peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-blue-700 peer-focus-visible:ring-white"
                  >
                    <span
                      className="absolute inset-1 rounded-sm bg-blue-700 opacity-0
                                                       peer-checked:opacity-100 transition-opacity duration-200"
                    ></span>
                  </span>
                  <span className="select-none">{tag}</span>
                </label>
              </div>
            ))}
          </fieldset>
        </div>

        <div className="flex gap-4 mt-8 flex-shrink-0">
          <Button
            onClick={handleResetFilters}
            type="button"
            className="flex-1 border-2 border-white text-white px-6 py-3 bg-transparent rounded-full uppercase
                                       hover:bg-white hover:text-blue-700 transition-colors duration-200
                                       focus:outline-none focus:ring-2 focus:ring-white font-semibold text-base md:text-lg"
          >
            Reset
          </Button>
          <Button
            onClick={handleApplyFilters}
            type="button"
            className="flex-1 bg-white text-blue-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors duration-200 uppercase
                                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 font-semibold text-base md:text-lg"
          >
            Apply
          </Button>
        </div>
      </InternalModal>
    </div>
  );
};

export default Blogs;