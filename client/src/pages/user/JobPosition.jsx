import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaSearch,
  FaFilter,
  FaTimesCircle,
  FaChevronRight,
  FaArrowLeft,
  FaSuitcase,
  FaBuilding,
  FaInfoCircle,
  FaUsers,
  FaHandshake,
  FaHeart,
  FaGift,
  FaLightbulb,
  FaEnvelopeOpenText,
  FaRocket,
  FaSeedling,
  FaSun,
  FaShareAlt,
  FaTag,
  FaPhoneAlt,
  // FaUserTie, // Removed as 'For Employers' button is gone
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useGetJobsQuery } from "../../features/auth/jobApi"; // Adjust path if necessary

// Import the JobApplicationForm component (adjust path if necessary)
import JobApplicationForm from "../../pages/Forms/JobApplicationForm";

/**
 * Utility function to calculate days ago.
 * @param {Date | string} date - The date to compare against.
 * @returns {string} Formatted string like "Posted 3 days ago".
 */
const getDaysAgo = (date) => {
  const now = new Date();
  const postedDate = new Date(date);
  now.setHours(0, 0, 0, 0); // Normalize to start of day
  postedDate.setHours(0, 0, 0, 0); // Normalize to start of day
  const diffTime = Math.abs(now.getTime() - postedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  return `Posted ${diffDays} days ago`;
};

// Custom Hook for Debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

/**
 * JobPosition component.
 * Displays career opportunities with an immersive card layout and a sliding detail panel.
 */
const JobPosition = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTimeType, setSelectedTimeType] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplicationFormOpen, setIsApplicationFormFormOpen] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const { data: jobs, isLoading, error } = useGetJobsQuery();
  const previousActiveElement = useRef(null);
  const detailPanelRef = useRef(null); // Ref for the detail panel for scrolling

  // Effect to control body overflow and focus when detail panel or modals are open
  useEffect(() => {
    const isOverlayOpen =
      selectedJob || isApplicationFormOpen || showThankYouModal;
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
      previousActiveElement.current = document.activeElement;
    } else {
      document.body.style.overflow = "auto";
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }
    return () => {
      document.body.style.overflow = "auto";
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [selectedJob, isApplicationFormOpen, showThankYouModal]);

  const handleJobCardClick = useCallback((job) => {
    setSelectedJob(job);
    setIsApplicationFormFormOpen(false); // Close form if open when a new job is selected
    if (detailPanelRef.current) {
      detailPanelRef.current.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  }, []);

  const handleProceedToApplication = useCallback(() => {
    setIsApplicationFormFormOpen(true);
  }, []);

  const handleCloseDetailPanel = useCallback(() => {
    setSelectedJob(null);
    setIsApplicationFormFormOpen(false); // Ensure form is closed too
  }, []);

  const handleCloseApplicationForm = useCallback(() => {
    setIsApplicationFormFormOpen(false);
  }, []);

  const handleApplicationSubmitSuccess = useCallback(() => {
    handleCloseApplicationForm();
    setSelectedJob(null); // Clear selected job after successful application
    setShowThankYouModal(true);
  }, [handleCloseApplicationForm]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedTimeType("");
  }, []);

  // UPDATED: Filter and search logic now includes summary, responsibilities, and requirements
  const filteredJobs =
    jobs?.filter((job) => {
      const lowerCaseDebouncedSearchTerm = debouncedSearchTerm.toLowerCase();

      const summaryMatch =
        job.summary?.toLowerCase().includes(lowerCaseDebouncedSearchTerm) ||
        false;
      const responsibilitiesMatch =
        job.responsibilities
          ?.join(" ")
          .toLowerCase()
          .includes(lowerCaseDebouncedSearchTerm) || false;
      const requirementsMatch =
        job.requirements
          ?.join(" ")
          .toLowerCase()
          .includes(lowerCaseDebouncedSearchTerm) || false;

      const matchesSearchTerm =
        job.title.toLowerCase().includes(lowerCaseDebouncedSearchTerm) ||
        summaryMatch ||
        responsibilitiesMatch ||
        requirementsMatch ||
        job.location.toLowerCase().includes(lowerCaseDebouncedSearchTerm) ||
        job.timeType.toLowerCase().includes(lowerCaseDebouncedSearchTerm) ||
        job.category?.toLowerCase().includes(lowerCaseDebouncedSearchTerm);

      const matchesLocation =
        selectedLocation === "" || job.location === selectedLocation;
      const matchesTimeType =
        selectedTimeType === "" || job.timeType === selectedTimeType;

      return matchesSearchTerm && matchesLocation && matchesTimeType;
    }) || [];

  const uniqueLocations = [...new Set(jobs?.map((job) => job.location))].sort();
  const uniqueTimeTypes = [...new Set(jobs?.map((job) => job.timeType))].sort();
  const activeFiltersCount = [
    searchTerm,
    selectedLocation,
    selectedTimeType,
  ].filter(Boolean).length;

  // Framer Motion variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const jobCardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.4,
      },
    },
  };

  const detailPanelVariants = {
    hidden: {
      x: "100%",
      transition: { type: "spring", stiffness: 100, damping: 30 },
    },
    visible: {
      x: "0%",
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <motion.section
      className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen pt-24 relative overflow-hidden"
      initial="initial"
      animate="animate"
      variants={pageVariants}
      id="job-openings"
    >
      {/* Hero Section with Search and Filters */}
      <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 py-20 px-4 md:px-8 lg:px-20 text-white shadow-xl overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg
            className="w-full h-full"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <path d="M0,0 L0,100 L100,100 L100,0 Z M50,0 C22.385,0 0,22.385 0,50 C0,77.615 22.385,100 50,100 C77.615,100 100,77.615 100,50 C100,22.385 77.615,0 50,0 Z" />
          </svg>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explore Your Next Role
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Explore exciting career paths and make an impact with us.
          </motion.p>

          {/* Search and Filter Bar */}
          <motion.div
            className="bg-white p-5 md:p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 items-center mx-auto max-w-4xl border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="relative flex-grow w-full md:w-auto">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, keyword, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search job postings"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Clear search term"
                >
                  <FaTimesCircle />
                </button>
              )}
            </div>

            <div className="relative w-full md:w-auto md:min-w-[180px]">
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by location"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15 9.293l-1.414-1.414L10 11.586l-3.293-3.293L5.293 9.293z" />
                </svg>
              </div>
            </div>

            <div className="relative w-full md:w-auto md:min-w-[180px]">
              <FaSuitcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
                value={selectedTimeType}
                onChange={(e) => setSelectedTimeType(e.target.value)}
                aria-label="Filter by employment type"
              >
                <option value="">All Types</option>
                {uniqueTimeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15 9.293l-1.414-1.414L10 11.586l-3.293-3.293L5.293 9.293z" />
                </svg>
              </div>
            </div>

            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.button
                  className="flex-shrink-0 px-5 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                  onClick={handleClearFilters}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  aria-label={`Clear ${activeFiltersCount} active filters`}
                >
                  <FaTimesCircle /> Clear ({activeFiltersCount})
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area - Job Cards Grid */}
      <div
        className={`relative z-10 transition-all duration-300 ${
          selectedJob
            ? "scale-[0.97] blur-sm opacity-50 pointer-events-none"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:px-20">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 border-l-4 border-blue-600 pl-4">
            All Open Roles
            {filteredJobs?.length > 0 && (
              <span className="ml-3 text-blue-500 text-2xl font-semibold">
                ({filteredJobs.length})
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-xl shadow-md border border-gray-100 animate-pulse h-64 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-8 bg-blue-100 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-blue-100 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-blue-100 rounded w-2/3 mb-6"></div>
                    <div className="h-16 bg-blue-100 rounded mb-4"></div>
                  </div>
                  <div className="h-10 bg-blue-100 rounded-full w-1/3 ml-auto"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 text-xl">
              <FaInfoCircle className="text-6xl mb-4 mx-auto text-blue-400" />
              <p className="mb-4 font-semibold">
                Oops! There was an issue loading job openings.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Please check your internet connection or try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Reload Page
              </button>
            </div>
          ) : filteredJobs?.length === 0 ? (
            <div className="text-center py-16 text-blue-500 text-lg max-w-xl mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
              >
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/no-job-found-7917719-6331908.png?f=webp"
                  alt="No jobs found"
                  className="mx-auto mb-6 w-40 h-40"
                />
                <p className="text-3xl font-bold text-blue-800 mb-3">
                  No Results Found
                </p>
                <p className="text-blue-700 mb-6">
                  It looks like no jobs match your current criteria. Try
                  broadening your search or clearing your filters.
                </p>
                {activeFiltersCount > 0 && (
                  <motion.button
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
                    onClick={handleClearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Clear all active filters"
                  >
                    <FaTimesCircle /> Clear All Filters
                  </motion.button>
                )}
              </motion.div>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    layout
                    variants={jobCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    onClick={() => handleJobCardClick(job)}
                    className="relative p-6 bg-white rounded-xl shadow-md border border-gray-100 cursor-pointer overflow-hidden group hover:border-blue-300"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleJobCardClick(job);
                      }
                    }}
                    role="button"
                    aria-label={`View details for ${job.title} job`}
                  >
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500 opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-all duration-300 ease-out" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-blue-800 mb-2 group-hover:text-blue-600 transition">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                        <span className="inline-flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs text-blue-500" />{" "}
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FaClock className="text-xs text-blue-500" />{" "}
                          {job.timeType}
                        </span>
                        <span className="text-gray-400">
                          {getDaysAgo(job.postedDate)}
                        </span>
                      </div>
                      {job.category && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
                          <FaTag className="text-blue-500" /> {job.category}
                        </span>
                      )}
                      {/* UPDATED: Display job summary instead of description */}
                      <p className="text-gray-700 text-base mb-4 line-clamp-3">
                        {job.summary}
                      </p>
                      <button
                        className="inline-flex items-center text-blue-600 font-semibold text-sm hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJobCardClick(job);
                        }}
                        aria-label={`Learn more about ${job.title}`}
                      >
                        View Details <FaChevronRight className="ml-1 text-xs" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Why Join Us? Section */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-950 text-white py-20 px-4 md:px-8 lg:px-20 text-center relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 z-0 opacity-10">
          {/* Subtle parallax effect for background elements */}
          <motion.div
            className="absolute top-1/4 left-1/4"
            style={{ y: 0 }}
            whileInView={{ y: -50 }}
            transition={{
              type: "tween",
              ease: "linear",
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            viewport={{ amount: 0.1, once: false }}
          >
            <FaRocket className="text-blue-400 text-opacity-20 text-9xl animate-spin-slow-reverse" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 right-1/4"
            style={{ y: 0 }}
            whileInView={{ y: 50 }}
            transition={{
              type: "tween",
              ease: "linear",
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            viewport={{ amount: 0.1, once: false }}
          >
            <FaSeedling className="text-blue-400 text-opacity-20 text-8xl animate-spin-slow" />
          </motion.div>
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ y: 0 }}
            whileInView={{ y: 20 }}
            transition={{
              type: "tween",
              ease: "linear",
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            viewport={{ amount: 0.1, once: false }}
          >
            <FaSun className="text-blue-400 text-opacity-20 text-[12rem] blur-sm animate-pulse-slow" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg leading-tight"
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Discover Your Potential with Us
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            We are committed to creating an ecosystem where innovation thrives
            and every individual has the opportunity to grow with us.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <FaUsers className="text-6xl text-blue-300 mb-4 drop-shadow-md" />
                ),
                title: "Inclusive Community",
                description:
                  "We promote a workplace where every voice is valued, embracing diverse perspectives to foster a supportive and collaborative team.",
              },
              {
                icon: (
                  <FaLightbulb className="text-6xl text-blue-300 mb-4 drop-shadow-md" />
                ),
                title: " Pioneering Innovation",
                description:
                  "Our culture promotes bold thinking and creative ideas, driving innovative solutions that set new standards in the industry.",
              },
              {
                icon: (
                  <FaGift className="text-6xl text-blue-300 mb-4 drop-shadow-md" />
                ),
                title: "Exceptional Benefits",
                description:
                  "We offer a list of comprehensive benefits to our employees designed to support their growth, well-being, physical/mental health, and work-life balance.",
              },
              {
                icon: (
                  <FaHandshake className="text-6xl text-blue-300 mb-4 drop-shadow-md" />
                ),
                title: "Unleash Your Growth",
                description:
                  "We invest a portion of our income in your professional development with mentorship, training, and opportunities that help you advance your career.",
              },
              {
                icon: (
                  <FaHeart className="text-6xl text-blue-300 mb-4 drop-shadow-md" />
                ),
                title: "Balanced Work-Life",
                description:
                  "Experience a positive and flexible work environment that encourages balance, creativity, and employee well-being.",
              },
              {
                icon: (
                  <FaEnvelopeOpenText className="text-6xl text-blue-300 mb-4 drop-shadow-md" />
                ),
                title: "Open & Empowering Leadership",
                description:
                  "Our senior leaders and managers always communicate openly with the team, empowering you to contribute confidently, execute your ideas, and grow within the organization.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-xl border border-white/20 flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer"
                initial={{ y: 80, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)",
                }}
              >
                {item.icon}
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-blue-100 text-center leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Keyframe Animations for background icons (add to your global CSS) */}
        <style jsx>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes spin-slow-reverse {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(-360deg);
            }
          }
          @keyframes pulse-slow {
            0% {
              transform: scale(1);
              opacity: 0.15;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.25;
            }
            100% {
              transform: scale(1);
              opacity: 0.15;
            }
          }
          .animate-spin-slow {
            animation: spin-slow 60s linear infinite;
          }
          .animate-spin-slow-reverse {
            animation: spin-slow-reverse 60s linear infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 8s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Simplified Contact Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-200 py-16 px-4 md:px-8 lg:px-20 text-center relative overflow-hidden">
        {/* Subtle geometric pattern in background */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(#93c5fd 1px, transparent 1px), radial-gradient(#93c5fd 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto p-10 bg-white rounded-3xl shadow-2xl border border-blue-100/50 transform-gpu hover:shadow-3xl transition-all duration-500 ease-out">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 leading-tight"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Ready to Connect?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-700 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            We’re eagerly waiting to hear from you and feel free to reach out to Star Publicity.
            <br className="hidden md:block" />
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              href="tel:+919876543210" // Replace with your actual phone number
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg transform-gpu"
              whileHover={{
                scale: 1.07,
                boxShadow: "0 12px 25px rgba(0,100,255,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Call us"
            >
              <FaPhoneAlt className="mr-3 text-xl" /> Call Us
            </motion.a>
            <motion.a
              href="mailto:careers@yourcompany.com?subject=General Inquiry from Website" // Replace with your actual email address
              className="inline-flex items-center justify-center bg-blue-100 text-blue-800 border border-blue-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-200 transition-all duration-300 shadow-lg transform-gpu"
              whileHover={{
                scale: 1.07,
                boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Email us"
            >
              <FaEnvelopeOpenText className="mr-3 text-xl" /> Email Us
            </motion.a>
          </div>
        </div>
      </div>

      {/* Sliding Job Detail Panel */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            ref={detailPanelRef} // Attach ref here
            className="fixed top-0 right-0 h-full w-full lg:w-2/5 bg-white shadow-2xl z-[999] overflow-y-auto pt-4 md:pt-6 lg:pt-8"
            variants={detailPanelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="p-8 pb-20 relative">
              <button
                onClick={handleCloseDetailPanel}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors text-3xl z-50 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close job details panel"
              >
                <FaArrowLeft />
              </button>

              {isApplicationFormOpen && selectedJob ? (
                <JobApplicationForm
                  job={selectedJob}
                  onClose={handleCloseApplicationForm}
                  onSubmitSuccess={handleApplicationSubmitSuccess}
                />
              ) : (
                <>
                  <div className="mb-6 mt-10">
                    <h2 className="text-4xl font-bold text-blue-800 mb-2 leading-tight">
                      {selectedJob.title}
                    </h2>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-md">
                      <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                        <FaMapMarkerAlt className="text-sm" />
                        {selectedJob.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                        <FaClock className="text-sm" />
                        {selectedJob.timeType}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {getDaysAgo(selectedJob.postedDate)}
                      </span>
                    </div>
                    {selectedJob.category && (
                      <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        <FaTag className="text-blue-500" />{" "}
                        {selectedJob.category}
                      </span>
                    )}
                  </div>
                  
                  {/* UPDATED: Structured Job Details Section */}
                  <div className="text-gray-700 text-base space-y-6 mb-8 leading-relaxed job-description-content">
                    {/* Job Summary */}
                    {selectedJob.summary && (
                      <>
                        <h3 className="text-2xl font-semibold text-blue-800 mb-3 border-b border-blue-100 pb-2">
                          Job Summary
                        </h3>
                        <p className="mb-2 last:mb-0">
                          {selectedJob.summary}
                        </p>
                      </>
                    )}

                    {/* Responsibilities */}
                    {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                      <>
                        <h3 className="text-2xl font-semibold text-blue-800 mb-3 pt-4 border-b border-blue-100 pb-2">
                          Roles & Responsibilities
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                          {selectedJob.responsibilities.map((res, i) => (
                            <li key={i} className="mb-1">
                              {res}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* Requirements */}
                    {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                       <>
                        <h3 className="text-2xl font-semibold text-blue-800 mb-3 pt-4 border-b border-blue-100 pb-2">
                          Requirements
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                          {selectedJob.requirements.map((req, i) => (
                            <li key={i} className="mb-1">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>


                  {/* Share Buttons */}
                  <div className="mt-8 flex gap-3 justify-center border-t border-gray-200 pt-6">
                    <p className="text-gray-600 font-medium mr-2">
                      Share this job:
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:text-blue-800 text-2xl"
                      aria-label="Share on Facebook"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      <FaShareAlt />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-400 hover:text-blue-600 text-2xl"
                      aria-label="Share on Twitter"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            window.location.href
                          )}&text=${encodeURIComponent(
                            `Check out this job: ${selectedJob.title}`
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      <FaShareAlt />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-500 hover:text-blue-700 text-2xl"
                      aria-label="Share via Email"
                      onClick={() =>
                        window.open(
                          `mailto:?subject=${encodeURIComponent(
                            `Job Opportunity: ${selectedJob.title}`
                          )}&body=${encodeURIComponent(
                            `Check out this exciting job opening: ${selectedJob.title}\n\n${window.location.href}`
                          )}`
                        )
                      }
                    >
                      <FaEnvelopeOpenText />
                    </motion.button>
                  </div>

                  {/* Apply Button - Sticky at bottom of panel */}
                  <div className="sticky bottom-0 left-0 right-0 z-10 bg-white pt-4 pb-6 border-t border-gray-200">
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 8px 20px rgba(0, 100, 255, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceedToApplication}
                      className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-xl hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-3"
                    >
                      Apply Now
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYouModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-xl px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            aria-modal="true"
            role="dialog"
            aria-labelledby="thank-you-title"
            aria-describedby="thank-you-desc"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: 5 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateY: -5 }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 10,
                delay: 0.15,
              }}
              className="relative w-full max-w-md p-10 bg-gradient-to-br from-blue-500/10 to-blue-900/5 rounded-3xl shadow-glass-xl border border-blue-200/15 backdrop-blur-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.6), inset 0 0 50px rgba(255,255,255,0.08)",
              }}
            >
              <div className="absolute -top-1/3 -left-1/3 w-3/4 h-3/4 bg-blue-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-flow-subtle-1" />
              <div className="absolute -bottom-1/3 -right-1/3 w-3/4 h-3/4 bg-blue-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-flow-subtle-2" />

              <div className="relative z-10 flex flex-col items-center gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.2}
                    stroke="currentColor"
                    className="w-24 h-24 text-white drop-shadow-lg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>

                <h3
                  id="thank-you-title"
                  className="text-4xl font-extrabold text-white tracking-tight mb-2 leading-tight"
                  style={{ textShadow: "0px 0px 15px rgba(0, 191, 255, 0.3)" }}
                >
                  Thank You
                </h3>
                <p
                  id="thank-you-desc"
                  className="text-white/80 text-lg leading-relaxed text-justify mb-8 font-light max-w-md"
                >
                  Your application for the role has been successfully submitted.
                  We genuinely appreciate you taking the time to apply and share
                  your experience with us. Our team will review your
                  qualifications thoroughly, and we'll be in touch regarding the
                  next steps in the hiring process. Thank you again for your
                  your interest in joining our team!
                </p>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 15px 30px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 200, 255, 0.3)",
                    background: "linear-gradient(to right, #00C6FF, #0072FF)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThankYouModal(false)}
                  className="inline-flex items-center justify-center px-10 py-3 text-lg font-bold rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-900 transition-all duration-300 ease-out transform relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Close Thank You Modal"
                >
                  <span className="relative z-10">Proceed</span>
                  <motion.span
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 opacity-0 group-hover:opacity-100"
                  />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default JobPosition;