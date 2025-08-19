import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  FiMail,
  FiPhone,
  FiSend,
  FiCheckCircle,
  FiUser,
  FiMapPin,
  FiGlobe,
  FiTag,
  FiFileText,
  FiFeather,
  FiAward,
  FiBriefcase,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSendContactInquiryMutation } from "../../features/auth/contactUs";
// Dynamically import the Globe component to ensure it only runs on the client-side
import Globe from "react-globe.gl";
import * as THREE from 'three'; // Import THREE.js for custom markers

// --- Constellation Background Component ---
const ConstellationBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let stars = [];
    let mouse = { x: null, y: null };
    const animationDuration = 2000; // 2 seconds for the initial animation
    let animationStartTime = Date.now();

    const easeOutQuad = (t) => t * (2 - t);

    const setup = () => {
      canvas.width = window.innerWidth;
      // RESPONSIVENESS: Changed height to be 100% of the parent container for better scaling.
      canvas.height = canvas.parentElement.offsetHeight;
      const numStars = window.innerWidth / 10; // Adjust density slightly for performance

      stars = [];
      animationStartTime = Date.now();

      for (let i = 0; i < numStars; i++) {
        stars.push({
          startX: canvas.width / 2,
          startY: canvas.height / 2,
          x: canvas.width / 2,
          y: canvas.height / 2,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 1,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          originalRadius: Math.random() * 1.5 + 1,
        });
      }
    };

    setup();

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener("resize", setup);
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      if (!ctx) return;
      const elapsedTime = Date.now() - animationStartTime;
      const animationProgress = Math.min(elapsedTime / animationDuration, 1);
      const easedProgress = easeOutQuad(animationProgress);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 0.4;
      stars.forEach((star1) => {
        stars.forEach((star2) => {
          if (star1 === star2) return;
          const dist = Math.sqrt(
            Math.pow(star1.x - star2.x, 2) + Math.pow(star1.y - star2.y, 2)
          );
          if (dist < 100) {
            ctx.strokeStyle = `rgba(173, 216, 230, ${1 - dist / 100})`;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        });
        if (mouse.x && mouse.y) {
          const distToMouse = Math.sqrt(
            Math.pow(star1.x - mouse.x, 2) + Math.pow(star1.y - mouse.y, 2)
          );
          if (distToMouse < 150) {
            ctx.strokeStyle = `rgba(173, 216, 230, ${1 - distToMouse / 150})`;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });

      stars.forEach((star) => {
        if (animationProgress < 1) {
          star.x = star.startX + (star.targetX - star.startX) * easedProgress;
          star.y = star.startY + (star.targetY - star.startY) * easedProgress;
        } else {
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
          if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
        }

        star.radius = star.originalRadius + Math.sin(Date.now() * 0.005 + star.x) * 0.5;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};


// --- Constants and Configuration ---
const formConfig = {
  states: [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ],
  topics: ["Sales", "Other"],
  mediaTypes: ["Billboards", "Transit", "Digital", "Other"],
  markets: [
    "Mumbai", "Delhi NCR", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Goa", "Nagpur", "Indore", "Coimbatore", "Visakhapatnam", "Surat", "Bhopal", "Ludhiana", "Agra", "Vadodara", "Madurai", "Patna", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Dhanbad", "Jabalpur", "Guwahati", "Thane", "Allahabad", "Ranchi", "Amritsar", "Gwalior", "Jodhpur", "Raipur", "Kota", "Chittoor", "Mysore", "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal",
  ],
};

const initialFormState = {
  advertisingState: "",
  advertisingMarket: "",
  topic: "",
  otherTopic: "",
  media: "",
  otherMedia: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  city: "",
  message: "",
};

const formFields = [
  {
    label: "Advertising State",
    name: "advertisingState",
    type: "select",
    options: formConfig.states,
    icon: FiGlobe,
  },
  {
    label: "Advertising Market",
    name: "advertisingMarket",
    type: "select",
    options: formConfig.markets,
    icon: FiMapPin,
  },
  {
    label: "Topic",
    name: "topic",
    type: "select",
    options: formConfig.topics,
    icon: FiTag,
  },
  {
    label: "Media",
    name: "media",
    type: "select",
    options: formConfig.mediaTypes,
    icon: FiFileText,
  },
  { label: "First Name", name: "firstName", type: "text", icon: FiUser },
  { label: "Last Name", name: "lastName", type: "text", icon: FiUser },
  { label: "Phone Number", name: "phone", type: "tel", icon: FiPhone },
  { label: "Email", name: "email", type: "email", icon: FiMail },
  {
    label: "City",
    name: "city",
    type: "text",
    icon: FiMapPin,
    gridSpan: "sm:col-span-2",
  },
];

// --- Reusable Form Components ---
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  icon: Icon,
}) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        className={`w-full rounded-xl border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white ${
          Icon ? "pl-11" : "pl-4"
        } pr-4 py-3 text-gray-800 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
  icon: Icon,
}) => (
  <div className="relative flex flex-col">
    <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white ${
          Icon ? "pl-11" : "pl-4"
        } pr-8 py-3 text-gray-800 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200 appearance-none`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// --- Thank You Modal Component ---
const ThankYouModal = ({ show, onClose }) => {
  const modalRef = React.useRef(null);
  useEffect(() => {
    if (show && modalRef.current) {
      modalRef.current.focus();
    }
  }, [show]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
  };
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            ref={modalRef}
            tabIndex="-1"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden transform transition-all duration-300 ease-in-out"
            variants={modalVariants}
          >
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.2,
                }}
                className="mx-auto bg-green-100 text-green-600 rounded-full p-5 inline-flex items-center justify-center text-6xl mb-6 shadow-lg"
              >
                <FiCheckCircle />
              </motion.div>
              <h3
                id="modal-title"
                className="font-poppins text-4xl font-extrabold text-blue-800 mb-4 leading-tight"
              >
                Thank You!
              </h3>
              <p className="text-gray-700 text-lg mb-8">
                Your message has been successfully sent. We appreciate you
                reaching out and will get back to you shortly.
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- REDESIGNED and RESPONSIVE Map Section Component ---
const MapSection = () => {
    const globeRef = useRef(null);
    const containerRef = useRef(null);
    const [isClient, setIsClient] = useState(false);
    const [dimensions, setDimensions] = useState(null);
    const [hoveredPoint, setHoveredPoint] = useState(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !containerRef.current) return;
        const observer = new ResizeObserver(() => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isClient]);

    const pointsData = useMemo(() => [
        { lat: 30.9010, lng: 75.8573, color: '#FFD700', name: 'Punjab' },
        { lat: 31.1048, lng: 77.1734, color: '#FFC300', name: 'Himachal Pradesh' },
        { lat: 29.0588, lng: 76.0856, color: '#FFD700', name: 'Haryana' },
        { lat: 28.7041, lng: 77.1025, color: '#FFFFFF', name: 'Delhi' },
        { lat: 30.7333, lng: 76.7794, color: '#FFC300', name: 'Chandigarh' },
        { lat: 34.0837, lng: 74.7973, color: '#FFFFFF', name: 'Jammu & Kashmir' }
    ], []);

    const arcsData = useMemo(() => {
        const connections = [];
        for (let i = 0; i < pointsData.length; i++) {
            for (let j = i + 1; j < pointsData.length; j++) {
                connections.push({
                    startLat: pointsData[i].lat,
                    startLng: pointsData[i].lng,
                    endLat: pointsData[j].lat,
                    endLng: pointsData[j].lng,
                    color: hoveredPoint === pointsData[i] || hoveredPoint === pointsData[j]
                        ? '#FFFFFF90'
                        : [`${pointsData[i].color}80`, `${pointsData[j].color}80`],
                });
            }
        }
        return connections;
    }, [pointsData, hoveredPoint]);

    useEffect(() => {
        if (globeRef.current && dimensions) {
            const altitude = dimensions.width < 768 ? 3.0 : 2.2;
            globeRef.current.pointOfView({ lat: 26, lng: 80, altitude }, 1000);
            
            const controls = globeRef.current.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.4;
            controls.enableZoom = true;
            controls.minDistance = 150; 
            controls.maxDistance = 600;
        }
    }, [dimensions]);

    const createGlowMaterial = (color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, color);
        gradient.addColorStop(0.4, `${color}40`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.SpriteMaterial({ map: texture, blending: THREE.AdditiveBlending });
    };

    return (
        <section className="relative w-full h-[80vh] md:h-screen bg-[#000010] text-white overflow-hidden">
            <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
                {isClient && dimensions && (
                    <Globe
                        ref={globeRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                        
                        arcsData={arcsData}
                        arcColor="color"
                        arcDashLength={0.4}
                        arcDashGap={0.8}
                        arcDashAnimateTime={2000}
                        arcStroke={0.25}
                        
                        pointsData={pointsData}
                        pointLabel={p => `<div style="background: rgba(20, 20, 40, 0.7); border-radius: 4px; padding: 4px 8px; color: white; font-family: sans-serif;"><b>${p.name}</b></div>`}
                        pointThreeObjectExtend={true}
                        pointThreeObject={point => {
                            const isHovered = hoveredPoint === point;
                            const material = createGlowMaterial(isHovered ? '#FFFFFF' : point.color);
                            const sprite = new THREE.Sprite(material);
                            const size = isHovered ? 12 : 8;
                            sprite.scale.set(size, size, 1);
                            return sprite;
                        }}
                        onPointHover={setHoveredPoint}
                        
                        atmosphereColor="#3a5fb5"
                        atmosphereAltitude={0.25}
                    />
                )}
            </div>

            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none"></div>

            <div className="absolute top-0 left-0 right-0 z-20 pt-16 sm:pt-20 md:pt-24 px-4 text-center">
                <motion.h2
                    className="font-poppins text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                        Our Network, Visualized
                    </span>
                </motion.h2>
                <motion.p
                    className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mt-4 font-light"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    Explore our expansive digital network. Each connection represents our commitment to nationwide reach and impact.
                </motion.p>
            </div>
        </section>
    );
};

// --- Main ContactUs Component ---
const ContactUs = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [validationErrors, setValidationErrors] = useState({});
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [sendContactInquiry, { isLoading, isSuccess, isError, error, reset }] =
    useSendContactInquiryMutation();
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowThankYouModal(true);
      setSubmissionAttempted(false);
      setFormData(initialFormState);
      reset();
    }
  }, [isSuccess, reset]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowThankYouModal(false);
  }, []);

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.advertisingState) errors.advertisingState = "Please select an advertising state.";
    if (!formData.advertisingMarket) errors.advertisingMarket = "Please select an advertising market.";
    if (!formData.topic) errors.topic = "Please select a topic.";
    if (!formData.media) errors.media = "Please select a media type.";
    if (!formData.firstName) errors.firstName = "First name is required.";
    if (!formData.lastName) errors.lastName = "Last name is required.";
    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Invalid phone number. Please enter a 10-digit Indian number.";
    }
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address.";
    }
    if (!formData.city) errors.city = "City is required.";
    if (!formData.message) errors.message = "Message is required.";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionAttempted(true);
    if (!validateForm()) {
      console.error("Form validation failed.");
      return;
    }
    try {
      await sendContactInquiry(formData).unwrap();
    } catch (err) {
      console.error("Error sending form:", err);
    }
  };

  const formIsValid = Object.keys(validationErrors).length === 0;
  const showSummaryError = submissionAttempted && !formIsValid;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20, delay: i * 0.1, },
    }),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=Lato:wght@300;400;700&display=swap');
        .font-inter { font-family: 'Lato', sans-serif; }
        .font-poppins { font-family: 'Exo 2', sans-serif; }
      `}</style>
      <div className="min-h-screen font-inter text-gray-900 overflow-x-hidden bg-white">
        
        {/* RESPONSIVENESS: Revamped Hero and Form layout for all screen sizes */}
        <div className="relative">
          {/* Background Section */}
          <div className="absolute inset-x-0 top-0 h-[70vh] sm:h-[80vh]">
            <div className="absolute inset-0 bg-[#1a2a80]"></div>
            <ConstellationBackground />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a80]/50 via-transparent to-transparent"></div>
          </div>
          
          {/* Hero Content Section */}
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center text-white pt-24 sm:pt-28 pb-32 sm:pb-48">
               <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-shadow-lg mb-4 sm:mb-6">
                    Let’s Connect for Outdoor Impact
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
                    Reach out to Star Publicity for customized Out-of-home marketing
                    strategies, expert guidance, and partnership opportunities that
                    drive real results.
                  </p>
                  <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                    <div className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 text-sm backdrop-blur-sm bg-white/10 shadow-md">
                      <FiAward className="text-cyan-300" />
                      <span>Expert Strategy</span>
                    </div>
                    <div className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 text-sm backdrop-blur-sm bg-white/10 shadow-md">
                      <FiGlobe className="text-cyan-300" />
                      <span>Nationwide Reach</span>
                    </div>
                    <div className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 text-sm backdrop-blur-sm bg-white/10 shadow-md">
                      <FiBriefcase className="text-cyan-300" />
                      <span>Proven Results</span>
                    </div>
                  </div>
                </motion.div>
            </div>

            {/* RESPONSIVENESS: Replaced absolute positioning with a CSS Grid layout. */}
            {/* This new container will stack items on mobile and create columns on desktop. */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start mt-[-100px] sm:mt-[-150px] z-10 relative">
              
              {/* --- Contact Info Card (Grid Item 1) --- */}
              <motion.div
                className="w-full lg:col-span-2" // Takes up 2 of 5 columns on large screens
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10, delay: 0.7 }}
              >
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col gap-8 text-gray-900 border border-gray-100 h-full">
                    <div className="text-center lg:text-left">
                        <h3 className="font-poppins text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-cyan-600">
                          Get in Touch With Us
                        </h3>
                        <p className="text-gray-600 font-light text-lg mb-8 max-w-md mx-auto lg:mx-0">
                          Don't wait! Let’s turn every space into your brand’s
                          stage and make your mark today.
                        </p>
                    </div>
                    <div className="space-y-4 text-left">
                      <motion.a href="mailto:info@starpublicity.co.in" className="flex items-center text-gray-700 hover:text-blue-800 transition-all duration-300 p-3 rounded-xl hover:bg-blue-50 group">
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mr-4 text-blue-600 text-2xl md:text-3xl"> <FiMail /> </motion.div>
                        <motion.span whileHover={{ x: 5 }} className="text-base md:text-lg font-medium"> info@starpublicity.co.in </motion.span>
                      </motion.a>
                      <motion.a href="tel:0161-4668602" className="flex items-center text-gray-700 hover:text-blue-800 transition-all duration-300 p-3 rounded-xl hover:bg-blue-50 group">
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mr-4 text-blue-600 text-2xl md:text-3xl"> <FiPhone /> </motion.div>
                        <motion.span whileHover={{ x: 5 }} className="text-base md:text-lg font-medium"> 0161-4668602 </motion.span>
                      </motion.a>
                      <motion.a href="https://maps.app.goo.gl/your-link" target="_blank" rel="noopener noreferrer" className="flex items-start text-gray-700 hover:text-blue-800 transition-all duration-300 p-3 rounded-xl hover:bg-blue-50 group">
                         <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mr-4 text-blue-600 text-2xl md:text-3xl mt-1"> <FiMapPin /> </motion.div>
                         <motion.span whileHover={{ x: 5 }} className="text-base md:text-lg font-medium text-left">
                           SCO- 137, 1st Floor, opp. Apra Tower, Feroz Gandhi Market, Ludhiana, Punjab 141001
                         </motion.span>
                      </motion.a>
                    </div>
                </div>
              </motion.div>

              {/* --- Contact Form (Grid Item 2) --- */}
              <motion.div
                className="w-full lg:col-span-3" // Takes up 3 of 5 columns on large screens
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10, delay: 1 }}
              >
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-300 hover:shadow-3xl">
                  <h2 className="font-poppins text-3xl font-extrabold text-blue-800 mb-6 text-center border-b pb-4 border-gray-200">
                    Contact Us
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {showSummaryError && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-400 font-medium" role="alert">
                        Please correct the highlighted fields and try again.
                      </motion.div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {formFields.map((field) => {
                        const Component = field.type === "select" ? FormSelect : FormInput;
                        return (
                          <div key={field.name} className={`${field.gridSpan || ""}`}>
                            <Component label={field.label} name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange} options={field.options} error={validationErrors[field.name]} icon={field.icon} />
                          </div>
                        );
                      })}
                      {formData.topic === "Other" && (
                        <div className="col-span-1 sm:col-span-2">
                          <FormInput label="Specify Topic" name="otherTopic" value={formData.otherTopic} onChange={handleChange} error={validationErrors.otherTopic} icon={FiTag} />
                        </div>
                      )}
                      {formData.media === "Other" && (
                        <div className="col-span-1 sm:col-span-2">
                          <FormInput label="Specify Media" name="otherMedia" value={formData.otherMedia} onChange={handleChange} error={validationErrors.otherMedia} icon={FiFileText} />
                        </div>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="block mb-2 text-sm font-semibold text-gray-700">Message</label>
                      <div className="relative">
                        <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Your message..." className={`w-full rounded-xl border ${validationErrors.message ? "border-red-500" : "border-gray-300"} bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 resize-none transition duration-200`} />
                      </div>
                      {validationErrors.message && (<p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>)}
                    </div>
                    {isError && (
                      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-800 font-semibold text-center bg-red-100 p-3 rounded-lg border border-red-400">
                        Failed to send message:{" "}{error?.data?.message || "Unknown error."}
                      </motion.p>
                    )}
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.01] hover:shadow-xl hover:-translate-y-0.5">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>Send Message <FiSend /></>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <MapSection />

        {/* 'Expand Your Reach' Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.2, }, }, }}
          className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100"
        >
          <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4 leading-tight">
              Expand Your Reach
            </h2>
            <p className="text-base sm:text-lg text-blue-700 max-w-3xl mx-auto opacity-90 font-medium">
              Explore how our tailored outdoor media strategies can elevate your brand. Connect with our experts for insights into market trends and innovative ad formats.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
             <motion.div variants={cardVariants} custom={0} className="group bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center border border-transparent hover:border-blue-200">
               <div className="bg-blue-500 text-white p-5 rounded-full text-4xl shadow-md mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-blue-600">
                 <FiFeather />
               </div>
               <h3 className="font-poppins text-xl sm:text-2xl font-bold mb-2 text-blue-800">
                 Campaign Success Support
               </h3>
               <p className="text-gray-700 text-sm sm:text-base flex-grow">
                 From concept to post-campaign analysis, our team provides comprehensive support to ensure your advertising achieves its full potential.
               </p>
             </motion.div>
             <motion.div variants={cardVariants} custom={1} className="group bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center border border-transparent hover:border-indigo-200">
                <div className="bg-indigo-500 text-white p-5 rounded-full text-4xl shadow-md mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-indigo-600">
                  <FiAward />
                </div>
                <h3 className="font-poppins text-xl sm:text-2xl font-bold mb-2 text-blue-800">
                  Strategic Media Partnerships
                </h3>
                <p className="text-gray-700 text-sm sm:text-base flex-grow">
                  Leverage our extensive network of premium outdoor sites. We forge powerful partnerships to secure the best locations for your brand.
                </p>
             </motion.div>
             <motion.div variants={cardVariants} custom={2} className="group bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center border border-transparent hover:border-purple-200">
                <div className="bg-purple-500 text-white p-5 rounded-full text-4xl shadow-md mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-purple-600">
                  <FiBriefcase />
                </div>
                <h3 className="font-poppins text-xl sm:text-2xl font-bold mb-2 text-blue-800">
                  Innovate with Us: OOH Careers
                </h3>
                <p className="text-gray-700 text-sm sm:text-base flex-grow">
                  Join a team at the forefront of advertising innovation. Discover roles in media planning, creative design, and site management.
                </p>
             </motion.div>
          </div>
        </motion.section>

        <ThankYouModal show={showThankYouModal} onClose={handleCloseModal} />
      </div>
    </>
  );
};

export default ContactUs;