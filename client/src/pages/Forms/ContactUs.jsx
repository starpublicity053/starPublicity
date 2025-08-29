import React, { useRef, useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Smile,
  MessageSquareText,
  Clock,
  Headset,
  Globe as LucideGlobe,
} from "lucide-react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import { useSendContactInquiryMutation } from "../../features/auth/contactUs";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import mapImage from "/assets/map.png";
gsap.registerPlugin(ScrollTrigger);

// Defines the styles for the orbit and float animations
const animationStyles = `
    :root {
        --primary-blue: #1a2a80;
        --secondary-yellow: #facc15;
        --tertiary-purple: #8b5cf6;
    }
    @keyframes orbit-outer {
        from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    @keyframes orbit-inner {
        from { transform: rotate(360deg); } to { transform: rotate(0deg); }
    }
    @keyframes counter-orbit-outer {
        from { transform: rotate(0deg); } to { transform: rotate(-360deg); }
    }
    @keyframes counter-orbit-inner {
        from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    @keyframes icon-float {
        0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); }
    }
    .icon-wrapper-outer {
        animation: counter-orbit-outer 60s ease-in-out infinite, icon-float 5s ease-in-out infinite;
    }
    .icon-wrapper-inner {
        animation: counter-orbit-inner 40s ease-in-out infinite, icon-float 5s ease-in-out infinite 1s;
    }
    .rotate-from-center {
        transform-origin: center;
    }
    @keyframes pulse-glow {
        0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; }
    }
    @keyframes pulse-glow-2 {
        0%, 100% { transform: scale(0.9); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 0.8; }
    }
    .custom-cursor {
        position: fixed; top: 0; left: 0; border-radius: 50%; pointer-events: none; z-index: 9999;
    }
    .underline-input {
        background: transparent; border: none; border-bottom: 1px solid #d1d5db;
        padding: 0.75rem 0; transition: border-color 0.3s ease, box-shadow 0.3s ease;
        position: relative; box-shadow: 0 1px 0 0 #d1d5db;
    }
    .underline-input:focus {
        outline: none; border-color: #1a2a80;
    }
    .pulsing-marker {
        background-color: #1a2a80; width: 16px; height: 16px; border-radius: 50%;
        box-shadow: 0 0 10px #1a2a80, 0 0 20px #1a2a80; animation: pulse-blue 2s infinite;
    }
    @keyframes pulse-blue {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26, 42, 128, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 10px 10px rgba(26, 42, 128, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26, 42, 128, 0); }
    }
    .pulsing-marker-yellow {
        box-shadow: 0 0 8px #facc15, 0 0 16px #facc15;
        animation: pulse-yellow 2s infinite;
    }
    @keyframes pulse-yellow {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 8px 8px rgba(250, 204, 21, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(250, 204, 21, 0); }
    }
`;

// Variants for staggered entrance animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PromiseFeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col items-center text-center p-6 lg:p-8 rounded-2xl shadow-lg bg-white"
  >
    <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-4 rounded-full bg-yellow-400">
      <Icon
        className="w-10 h-10 lg:w-12 lg:h-12 text-primary-blue"
        strokeWidth={1.5}
      />
    </div>
    <h3 className="font-bold text-lg lg:text-xl text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

const SectionHeader = ({ title, onMouseEnter, onMouseLeave }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center mb-8 md:mb-10"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="w-3 h-3 sm:w-4 sm:h-4 bg-[#1a2a80]"
        ></motion.div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a2a80] tracking-tight">
          {title}
        </h2>
      </div>
      <motion.div
        className="h-1 mt-3 bg-gradient-to-r from-yellow-400 to-purple-500"
        initial={{ width: 0 }}
        animate={inView ? { width: "6rem" } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      ></motion.div>
    </div>
  );
};

const LocationMarker = ({ name, top, left, delay, inView }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={inView ? { opacity: 1, scale: 1 } : {}}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
    style={{ top, left }}
    className="absolute flex items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
  >
    <div className="w-3 h-3 bg-yellow-400 rounded-full pulsing-marker-yellow" />
    <span className="text-sm font-bold text-white bg-[#1a2a80] px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
      {name}
    </span>
  </motion.div>
);

const ContactUsPage = () => {
  const mapSectionRef = useRef(null);
  const mapInView = useInView(mapSectionRef, { once: true, amount: 0.2 });
  const [animationData, setAnimationData] = useState(null);
  const headingRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  const handleMouseMove = (event) => {
    if (!headingRef.current) return;
    const rect = headingRef.current.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleMouse = (e) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      setPosition({
        x: (clientX - (left + width / 2)) * 0.1,
        y: (clientY - (top + height / 2)) * 0.1,
      });
    };
    const reset = () => {
      setPosition({ x: 0, y: 0 });
    };
    const { x: magX, y: magY } = position;
    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: magX, y: magY }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    );
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({ message: "", type: "" });
  const [sendInquiry, { isLoading }] = useSendContactInquiryMutation();

  useEffect(() => { 
    fetch(
      "https://lottie.host/a12f93b1-0872-4cb7-acb3-6b00363d7509/40tCm2hisF.json"
    )
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((error) =>
        console.error("Error fetching Lottie animation:", error)
      );
  }, []);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      width: 16,
      height: 16,
      backgroundColor: "#1a2a80",
      mixBlendMode: "difference",
    },
    text: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      width: 64,
      height: 64,
      backgroundColor: "#fff",
      mixBlendMode: "difference",
    },
    magnetic: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      width: 80,
      height: 80,
      backgroundColor: "#fff",
      mixBlendMode: "difference",
    },
  };
  const textEnter = () => setCursorVariant("text");
  const textLeave = () => setCursorVariant("default");
  const magneticEnter = () => setCursorVariant("magnetic");
  const magneticLeave = () => setCursorVariant("default");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: "", type: "" });
    try {
      await sendInquiry(formData).unwrap();
      setSubmitStatus({
        message: "Message sent successfully!",
        type: "success",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setSubmitStatus({
        message: "Failed to send message. Please try again.",
        type: "error",
      });
    }
  };

  const outerNodes = [
    { icon: MessageCircle, angle: 0 },
    { icon: Phone, angle: 90 },
    { icon: Mail, angle: 180 },
    { icon: LucideGlobe, angle: 270 },
  ];
  const innerNodes = [
    { icon: Headset, angle: 45 },
    { icon: Clock, angle: 135 },
    { icon: Smile, angle: 225 },
    { icon: MessageSquareText, angle: 315 },
  ];
  const locations = [
    { name: "Punjab", top: "30%", left: "30%", delay: 0.8 },
    { name: "Haryana", top: "45%", left: "45%", delay: 1.0 },
    { name: "Delhi", top: "53%", left: "52%", delay: 1.2 },
    { name: "Rajasthan", top: "60%", left: "25%", delay: 1.4 },
  ];

  return (
    <>
      <motion.div
        className="custom-cursor"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <style>
        {` @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
                    .font-poppins { font-family: 'Poppins', sans-serif; } `}
        {` body { cursor: none; } `}
        {animationStyles}
      </style>

      <div className="w-full bg-gray-100 font-poppins text-gray-800 relative overflow-hidden">
        {/* === Hero Section === */}
        <div className="w-full min-h-screen flex flex-col justify-center px-6 sm:px-8 py-20 lg:py-24 xl:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            <div className="flex flex-col">
              <motion.div
                ref={headingRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                  handleMouseLeave();
                  textLeave();
                }}
                onMouseEnter={textEnter}
                className="flex flex-col items-start"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-600 tracking-tight"
                >
                  Let's Make Your
                </motion.h2>
                <div style={{ perspective: "1000px" }}>
                  <motion.h1
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.6, -0.05, 0.01, 0.99],
                      delay: 0.4,
                    }}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#1a2a80] tracking-tighter my-1"
                  >
                    BRAND
                  </motion.h1>
                </div>
                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-600 tracking-tight self-end"
                >
                  Unforgettable.
                </motion.h2>
              </motion.div>
              <motion.p
                variants={itemVariants}
                className="mt-6 text-base md:text-lg text-gray-600 max-w-lg"
              >
                From towering billboards to dynamic bus ads, we put your brand
                in front of thousands. Let's discuss your next high-impact
                campaign.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-3 text-gray-500"
              >
                <div onMouseEnter={magneticEnter} onMouseLeave={magneticLeave}>
                  <Magnetic>
                    <a
                      href="mailto:info@starpublicity.co.in"
                      className="block hover:text-[#1a2a80] transition-colors"
                    >
                      info@starpublicity.co.in
                    </a>
                  </Magnetic>
                </div>
                <div onMouseEnter={magneticEnter} onMouseLeave={magneticLeave}>
                  <Magnetic>
                    <a
                      href="tel:01614668602"
                      className="block hover:text-[#1a2a80] transition-colors"
                    >
                      0161-4668602
                    </a>
                  </Magnetic>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="bg-white/50 backdrop-blur-sm p-8 lg:p-10 rounded-2xl shadow-lg border border-white/50"
            >
              <motion.form
                className="space-y-6 text-left"
                onSubmit={handleSubmit}
              >
                <div>
                  <input
                    type="text"
                    id="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full underline-input text-gray-900 text-lg placeholder-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full underline-input text-gray-900 text-lg placeholder-gray-500"
                  />
                </div>
                <div>
                  <textarea
                    id="message"
                    rows="3"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full underline-input text-gray-900 text-lg placeholder-gray-500"
                  />
                </div>
                <div
                  onMouseEnter={magneticEnter}
                  onMouseLeave={magneticLeave}
                  className="flex justify-start pt-2"
                >
                  <Magnetic>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 bg-[#1a2a80] text-white font-bold py-3 px-8 lg:py-4 lg:px-10 rounded-full transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </Magnetic>
                </div>
                {submitStatus.message && (
                  <p
                    className={`mt-3 ${
                      submitStatus.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                )}
              </motion.form>
            </motion.div>
          </motion.div>
        </div>

        {/* Merged Map and "Beyond the Billboard" sections */}
        <div
          ref={mapSectionRef}
          className="w-full relative flex flex-col items-center justify-center overflow-hidden py-20 lg:py-24 px-6 sm:px-8 bg-gray-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-100 to-gray-200"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-secondary-yellow/30 animate-[pulse-glow_4s_ease-in-out_infinite] blur-2xl"></div>
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-tertiary-purple/20 animate-[pulse-glow-2_4s_ease-in-out_infinite_2s] blur-xl"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center px-4">
            <SectionHeader
              title="Our Reach & Your Impact"
              onMouseEnter={textEnter}
              onMouseLeave={textLeave}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={mapInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto mb-12 lg:mb-16"
            >
              From our strategic hub in Ludhiana, we combine geographical
              dominance with creative technology to put your brand on the map and
              in the minds of millions.
            </motion.p>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column: Map Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={mapInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="relative w-full max-w-lg mx-auto flex justify-center items-center"
            >
              <img
                src={mapImage}
                alt="Map showing office location in Feroze Gandhi Market, Ludhiana"
                className="w-full h-auto object-contain rounded-xl"
              />
              {locations.map((loc) => (
                <LocationMarker key={loc.name} {...loc} inView={mapInView} />
              ))}
            </motion.div>

            {/* Right Column: Lottie Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={mapInView ? "visible" : "hidden"}
              className="relative z-10 flex flex-col items-center w-full"
            >
              <motion.div
                variants={itemVariants}
                className="relative w-full aspect-square max-w-[400px] sm:max-w-[500px] flex justify-center items-center"
              >
                <svg
                  className="absolute w-full h-full"
                  viewBox="0 0 700 700"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="comet-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--tertiary-purple)"
                        stopOpacity="0"
                      />
                      <stop
                        offset="50%"
                        stopColor="var(--tertiary-purple)"
                        stopOpacity="1"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary-blue)"
                        stopOpacity="1"
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="350"
                    cy="350"
                    r="325"
                    stroke="var(--tertiary-purple)"
                    strokeOpacity="0.15"
                    strokeWidth="1"
                  />
                  <circle
                    cx="350"
                    cy="350"
                    r="225"
                    stroke="var(--tertiary-purple)"
                    strokeOpacity="0.15"
                    strokeWidth="1"
                  />
                  <circle
                    cx="350"
                    cy="350"
                    r="325"
                    stroke="url(#comet-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="15 45"
                    className="rotate-from-center animate-[orbit-outer_60s_ease-in-out_infinite]"
                  />
                  <circle
                    cx="350"
                    cy="350"
                    r="225"
                    stroke="url(#comet-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="15 45"
                    className="rotate-from-center animate-[orbit-inner_40s_ease-in-out_infinite]"
                  />
                </svg>
                <div className="absolute w-full h-full animate-[orbit-outer_60s_ease-in-out_infinite]">
                  {outerNodes.map((node, index) => (
                    <div
                      key={`outer-${index}`}
                      className="absolute inset-0"
                      style={{ transform: `rotate(${node.angle}deg)` }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer group icon-wrapper-outer">
                        <div className="relative flex items-center justify-center w-14 h-14">
                          <div className="absolute w-full h-full bg-primary-blue/50 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
                          <div className="relative flex items-center justify-center w-12 h-12 bg-white/80 border border-purple-400/50 rounded-full backdrop-blur-sm transition-all group-hover:scale-105">
                            <node.icon size={22} className="text-primary-blue" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute w-[64.2%] h-[64.2%] animate-[orbit-inner_40s_ease-in-out_infinite]">
                  {innerNodes.map((node, index) => (
                    <div
                      key={`inner-${index}`}
                      className="absolute inset-0"
                      style={{ transform: `rotate(${node.angle}deg)` }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer group icon-wrapper-inner">
                        <div className="relative flex items-center justify-center w-12 h-12">
                          <div className="absolute w-full h-full bg-secondary-yellow/50 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
                          <div className="relative flex items-center justify-center w-10 h-10 bg-white/80 border border-purple-400/50 rounded-full backdrop-blur-sm transition-all group-hover:scale-105">
                            <node.icon size={18} className="text-primary-blue" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative flex justify-center items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={mapInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden"
                  >
                    {animationData && (
                      <Lottie
                        animationData={animationData}
                        loop={true}
                        autoplay={true}
                        className="w-full h-full"
                      />
                    )}
                  </motion.div>

                  <motion.div
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1, 1, 0.5],
                      y: [10, 0, 0, 10],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "loop",
                      times: [0, 0.2, 0.8, 1], // Fade in 20%, stay 60%, fade out 20%
                    }}
                    className="absolute -top-4 -right-20 sm:-top-8 sm:-right-28 w-48 sm:w-56 z-20"
                  >
                    <svg viewBox="0 0 200 130" className="drop-shadow-lg filter">
                      <path
                        d="M171.3,5.1C148.9-6,117.2-1.3,100,10.1C82.8-1.3,51.1-6,28.7,5.1C-3.4,20.6-9.1,57.1,17.4,82.4c10.4,9.9,25.3,15,40.5,14.6c2.4,10,10.2,17.9,20.7,21.1c-0.8-4.7-1.3-9.5-1.5-14.3c-0.2-5.4,0-10.8,0.5-16.2c7.2,1.3,14.7,1.8,22.3,1.5c18-0.7,35-6.7,46.8-19.3C196.1,65.3,193.8,20.6,171.3,5.1z"
                        fill="#FFFFFF"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pb-8 sm:pb-10">
                      <p className="text-center text-sm sm:text-base font-semibold text-[#1a2a80] px-4">
                        Hey! Welcome to <br /> Star Publicity
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center relative overflow-hidden font-poppins py-20 lg:py-24 px-6 sm:px-8 xl:px-16 z-10 bg-gray-50">
          <div className="relative z-10 text-center flex flex-col items-center w-full max-w-6xl mx-auto">
            <SectionHeader
              title="The Star Publicity Advantage"
              onMouseEnter={textEnter}
              onMouseLeave={textLeave}
            />
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-12 lg:mb-16">
              We combine speed, strategy, and creative excellence to deliver
              campaigns that get noticed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
              <PromiseFeatureCard
                icon={Clock}
                title="Speed to Market"
                description="We launch your campaigns quickly to seize market opportunities and maximize relevance."
              />
              <PromiseFeatureCard
                icon={Headset}
                title="Strategic Placement" 
                description="Using data-driven insights, we place your ads in high-traffic locations for maximum impact."
              />
              <PromiseFeatureCard
                icon={Smile}
                title="Creative Excellence"
                description="From concept to execution, our creative team designs ads that captivate and convert."
              />
              <PromiseFeatureCard
                icon={MessageSquareText}
                title="Measurable Results"
                description="We provide clear reporting and analytics to track your campaign's performance and ROI."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;