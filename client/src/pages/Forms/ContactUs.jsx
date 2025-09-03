import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Send,
  MessageSquare,
  Smile,
  MessageSquareText,
  Clock,
  Headset,
  Globe as LucideGlobe,
  Facebook,
  Instagram,
  Linkedin,
  CheckCircle2,
} from "lucide-react";
import Confetti from "react-confetti";
import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { useSendContactInquiryMutation } from "../../features/auth/contactUs";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// --- HELPER COMPONENTS (All in one file) ---

const XLogoIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 1200 1227" width={size} height={size} className={className} fill="currentColor" aria-hidden="true" >
    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z" />
  </svg>
);

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 4.5 4 7 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2h0z"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);

const animationStyles = `
    :root { --primary-blue: #1a2a80; --secondary-yellow: #facc15; --tertiary-purple: #8b5cf6; }
    @keyframes orbit-outer { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes orbit-inner { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
    @keyframes counter-orbit-outer { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    @keyframes counter-orbit-inner { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes icon-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
    .icon-wrapper-outer { animation: counter-orbit-outer 60s ease-in-out infinite, icon-float 5s ease-in-out infinite; }
    .icon-wrapper-inner { animation: counter-orbit-inner 40s ease-in-out infinite, icon-float 5s ease-in-out infinite 1s; }
    .rotate-from-center { transform-origin: center; }
    @keyframes pulse-glow { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } }
    @keyframes pulse-glow-2 { 0%, 100% { transform: scale(0.9); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 0.8; } }
    .underline-input { background: transparent; border: none; border-bottom: 1px solid #d1d5db; padding: 0.75rem 0; transition: border-color 0.3s ease, box-shadow 0.3s ease; position: relative; box-shadow: 0 1px 0 0 #d1d5db; }
    .underline-input:focus { outline: none; border-color: #1a2a80; }
`;

// NEW: Advanced "Reveal" Success Modal
const SuccessRevealModal = ({ onClose }) => {
  const [runConfetti, setRunConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({ width, height });

    const timer = setTimeout(() => setRunConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 1.0 } // Delay children until after reveal
    },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 150, damping: 20 }
    },
  };

  const revealVariants = {
    hidden: { clipPath: 'circle(150% at 50% 50%)' },
    visible: {
      clipPath: 'circle(0% at 50% 50%)',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={runConfetti}
        numberOfPieces={runConfetti ? 200 : 0}
        gravity={0.1}
        colors={['#1a2a80', '#facc15', '#8b5cf6', '#ffffff']}
      />
      <motion.div
        variants={containerVariants}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg text-center flex flex-col items-center"
      >
        {/* The revealed content */}
        <motion.div variants={itemVariants}>
          <CheckCircle2 size={80} className="text-green-400" strokeWidth={1.5} />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-white mt-6">
          Message Received
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-3 text-lg text-slate-300 max-w-md">
          Thank you for your inquiry. We'll be in touch shortly.
        </motion.p>
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-[#1a2a80] text-white font-bold py-3 px-12 rounded-full transition-shadow duration-300 shadow-lg hover:shadow-blue-500/20"
          >
            All Done
          </motion.button>
        </motion.div>

        {/* The revealing curtain */}
        <motion.div
          className="absolute inset-0 bg-primary-blue"
          variants={revealVariants}
        />
      </motion.div>
    </motion.div>
  );
};


const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouse = (e) => { if (!ref.current) return; const { clientX, clientY } = e; const { height, width, left, top } = ref.current.getBoundingClientRect(); setPosition({ x: (clientX - (left + width / 2)) * 0.1, y: (clientY - (top + height / 2)) * 0.1 }); };
  const reset = () => { setPosition({ x: 0, y: 0 }); };
  const { x: magX, y: magY } = position;
  return <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} animate={{ x: magX, y: magY }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}>{children}</motion.div>;
};

const PromiseFeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div whileHover={{ y: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="flex flex-col items-center text-center p-6 lg:p-8 rounded-2xl shadow-lg bg-white h-full">
    <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-4 rounded-full bg-yellow-400 flex-shrink-0">
      <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-primary-blue" strokeWidth={1.5} />
    </div>
    <h3 className="font-bold text-lg lg:text-xl text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

const SectionHeader = ({ title }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="flex flex-col items-center mb-8 md:mb-10">
      <div className="flex items-center gap-4">
        <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }} className="w-3 h-3 sm:w-4 sm:h-4 bg-[#1a2a80]"></motion.div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a2a80] tracking-tight">{title}</h2>
      </div>
      <motion.div className="h-1 mt-3 bg-gradient-to-r from-yellow-400 to-purple-500" initial={{ width: 0 }} animate={inView ? { width: "6rem" } : {}} transition={{ duration: 0.6, ease: "easeOut" }}></motion.div>
    </div>
  );
};

const OrbitNode = ({ node, isOuter }) => {
  const isExternal = node.href.startsWith("http") || node.href.startsWith("mailto") || node.href.startsWith("tel");
  const isPathLink = !isExternal && node.href.startsWith("/");
  const Component = isPathLink ? Link : "a";
  const linkProps = { [isPathLink ? "to" : "href"]: node.href, ...(isExternal && { target: "_blank", rel: "noopener noreferrer" }) };
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ transform: `rotate(${node.angle}deg)` }}>
      <Component {...linkProps} aria-label={node.label} className={`absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer group pointer-events-auto ${isOuter ? 'icon-wrapper-outer' : 'icon-wrapper-inner'}`}>
        <div className={`relative flex items-center justify-center ${isOuter ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12'}`}>
          <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 group-hover:opacity-100 ${isOuter ? 'bg-primary-blue/50' : 'bg-secondary-yellow/50'}`}></div>
          <div className={`relative flex items-center justify-center bg-white/80 border border-purple-400/50 rounded-full backdrop-blur-sm transition-all group-hover:scale-105 ${isOuter ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10'}`}>
            <node.icon size={isOuter ? 20 : 16} className="text-primary-blue" />
          </div>
        </div>
      </Component>
    </div>
  );
};

// --- PAGE DATA & CONSTANTS ---
const pageData = {
  outerNodes: [
    { icon: Mail, angle: 0, label: "Email", href: "mailto:info@starpublicity.co.in" },
    { icon: Phone, angle: 90, label: "Call", href: "tel:01614668602" },
    { icon: MessageSquare, angle: 180, label: "WhatsApp", href: "https://wa.me/917403434074" },
    { icon: LucideGlobe, angle: 270, label: "Website", href: "/" }
  ],
  innerNodes: [
    { icon: Facebook, angle: 0, label: "Facebook", href: "https://www.facebook.com/starpublicityldh" },
    { icon: Instagram, angle: 72, label: "Instagram", href: "https://www.instagram.com/starpublicityldh/" },
    { icon: XLogoIcon, angle: 144, label: "X", href: "https://x.com/starpublicityld" },
    { icon: Linkedin, angle: 216, label: "LinkedIn", href: "https://www.linkedin.com/in/shivam-kumar-0b17342a8/" },
    { icon: YoutubeIcon, angle: 288, label: "YouTube", href: "https://www.youtube.com/@StarPublicity" }
  ],
  features: [
    { icon: Clock, title: "Speed to Market", description: "We launch your campaigns quickly to seize market opportunities and maximize relevance." },
    { icon: Headset, title: "Strategic Placement", description: "Using data-driven insights, we place your ads in high-traffic locations for maximum impact." },
    { icon: Smile, title: "Creative Excellence", description: "From concept to execution, our creative team designs ads that captivate and convert." },
    { icon: MessageSquareText, title: "Measurable Results", description: "We provide clear reporting and analytics to track your campaign's performance and ROI." }
  ]
};

// --- SECTION COMPONENTS ---

const HeroSection = ({ headingRef, handleMouseMove, handleMouseLeave, rotateX, rotateY, formData, handleChange, handleSubmit, isLoading, submitStatus }) => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="w-full min-h-[90vh] flex flex-col justify-center px-4 sm:px-8 pt-24 pb-16 xl:px-16">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col text-center lg:text-left">
          <motion.div ref={headingRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="flex flex-col items-center lg:items-start">
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-600 tracking-tight">Let's Make Your</motion.h2>
            <div style={{ perspective: "1000px" }}>
              <motion.h1 style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.4 }} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#1a2a80] tracking-tighter my-1">BRAND</motion.h1>
            </div>
            <motion.h2 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }} className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-600 tracking-tight self-center lg:self-end">Unforgettable.</motion.h2>
          </motion.div>
          <motion.p variants={itemVariants} className="mt-6 text-base md:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">From towering billboards to dynamic bus ads, we put your brand in front of thousands. Let's discuss your next high-impact campaign.</motion.p>
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-gray-500">
            <div><Magnetic><a href="mailto:info@starpublicity.co.in" className="block hover:text-[#1a2a80] transition-colors">info@starpublicity.co.in</a></Magnetic></div>
            <div><Magnetic><a href="tel:01614668602" className="block hover:text-[#1a2a80] transition-colors">0161-4668602</a></Magnetic></div>
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-sm p-8 lg:p-10 rounded-2xl shadow-lg border border-white/50">
          <form id="contact-form" className="space-y-6 text-left" onSubmit={handleSubmit}>
            <div><input type="text" id="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full underline-input text-gray-900 text-lg placeholder-gray-500" required /></div>
            <div><input type="email" id="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full underline-input text-gray-900 text-lg placeholder-gray-500" required /></div>
            <div><textarea id="message" rows="3" placeholder="Your Message" value={formData.message} onChange={handleChange} className="w-full underline-input text-gray-900 text-lg placeholder-gray-500" required /></div>
            <div className="flex justify-start pt-2"><Magnetic><motion.button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 bg-[#1a2a80] text-white font-bold py-3 px-8 lg:py-4 lg:px-10 rounded-full transition-all duration-300 disabled:opacity-50">{isLoading ? "Sending..." : (<><Send className="w-5 h-5" /><span>Send Message</span></>)}</motion.button></Magnetic></div>
            {submitStatus.message && submitStatus.type === 'error' && (<p className="mt-3 text-red-600">{submitStatus.message}</p>)}
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

const OrbitSection = ({ orbitSectionRef, orbitSectionInView, orbitAnimationData, outerNodes, innerNodes }) => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div ref={orbitSectionRef} className="w-full relative flex flex-col items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-8 bg-gray-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-100 to-gray-200">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-secondary-yellow/30 animate-[pulse-glow_4s_ease-in-out_infinite] blur-2xl"></div><div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-tertiary-purple/20 animate-[pulse-glow-2_4s_ease-in-out_infinite_2s] blur-xl"></div></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center px-4">
        <SectionHeader title="Our Reach & Your Impact" />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={orbitSectionInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto mb-10 sm:mb-12">From our strategic hub in Ludhiana, we combine geographical dominance with creative technology to put your brand on the map and in the minds of millions.</motion.p>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-center items-center">
        <motion.div variants={containerVariants} initial="hidden" animate={orbitSectionInView ? "visible" : "hidden"} className="relative z-10 flex flex-col items-center w-full">
          <motion.div variants={itemVariants} className="relative w-11/12 aspect-square max-w-[400px] sm:w-full sm:max-w-[500px] flex justify-center items-center">
            <svg className="absolute w-full h-full" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="comet-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="var(--tertiary-purple)" stopOpacity="0" /><stop offset="50%" stopColor="var(--tertiary-purple)" stopOpacity="1" /><stop offset="100%" stopColor="var(--primary-blue)" stopOpacity="1" /></linearGradient></defs><circle cx="350" cy="350" r="325" stroke="var(--tertiary-purple)" strokeOpacity="0.15" strokeWidth="1" /><circle cx="350" cy="350" r="225" stroke="var(--tertiary-purple)" strokeOpacity="0.15" strokeWidth="1" /><circle cx="350" cy="350" r="325" stroke="url(#comet-gradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="15 45" className="rotate-from-center animate-[orbit-outer_60s_ease-in-out_infinite]" /><circle cx="350" cy="350" r="225" stroke="url(#comet-gradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="15 45" className="rotate-from-center animate-[orbit-inner_40s_ease-in-out_infinite]" /></svg>
            <div className="absolute w-full h-full animate-[orbit-outer_60s_ease-in-out_infinite]">{outerNodes.map((node, index) => (<OrbitNode key={`outer-${index}`} node={node} isOuter={true} />))}</div>
            <div className="absolute w-[64.2%] h-[64.2%] animate-[orbit-inner_40s_ease-in-out_infinite]">{innerNodes.map((node, index) => (<OrbitNode key={`inner-${index}`} node={node} isOuter={false} />))}</div>
            <div className="relative flex justify-center items-center">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={orbitSectionInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6 }} className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden">{orbitAnimationData && (<Lottie animationData={orbitAnimationData} loop={true} autoplay={true} className="w-full h-full" />)}</motion.div>
              <motion.div animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5], y: [10, 0, 0, 10] }} transition={{ duration: 5, repeat: Infinity, repeatType: "loop", times: [0, 0.2, 0.8, 1] }} className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 sm:left-auto sm:translate-x-0 sm:-top-8 sm:-right-28 sm:w-56 z-20"><svg viewBox="0 0 200 130" className="drop-shadow-lg filter"><path d="M171.3,5.1C148.9-6,117.2-1.3,100,10.1C82.8-1.3,51.1-6,28.7,5.1C-3.4,20.6-9.1,57.1,17.4,82.4c10.4,9.9,25.3,15,40.5,14.6c2.4,10,10.2,17.9,20.7,21.1c-0.8-4.7-1.3-9.5-1.5-14.3c-0.2-5.4,0-10.8,0.5-16.2c7.2,1.3,14.7,1.8,22.3,1.5c18-0.7,35-6.7,46.8-19.3C196.1,65.3,193.8,20.6,171.3,5.1z" fill="#FFFFFF" /></svg><div className="absolute inset-0 flex items-center justify-center pb-8 sm:pb-10"><p className="text-center text-sm sm:text-base font-semibold text-[#1a2a80] px-4">Hey! Welcome to <br /> Star Publicity</p></div></motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const AdvantageSection = ({ advantageSectionRef, features }) => {
  useGSAP(() => {
    if (advantageSectionRef.current) {
      gsap.from(".feature-card", { scrollTrigger: { trigger: advantageSectionRef.current, start: "top 80%", toggleActions: "play none none none" }, opacity: 0, y: 100, stagger: 0.2, duration: 0.8, ease: "power3.out" });
    }
  }, { scope: advantageSectionRef, dependencies: [advantageSectionRef] });

  return (
    <div ref={advantageSectionRef} className="w-full flex flex-col justify-center items-center relative overflow-hidden font-poppins py-16 sm:py-20 px-4 sm:px-8 xl:px-16 z-10 bg-gray-50">
      <div className="relative z-10 text-center flex flex-col items-center w-full max-w-6xl mx-auto">
        <SectionHeader title="The Star Publicity Advantage" />
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-10 sm:mb-12">We combine speed, strategy, and creative excellence to deliver campaigns that get noticed.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <PromiseFeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ContactUsPage = () => {
  const [orbitAnimationData, setOrbitAnimationData] = useState(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false); // NEW: State for aura screen
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState({ message: "", type: "" });
  const [sendInquiry, { isLoading }] = useSendContactInquiryMutation();

  const headingRef = useRef(null);
  const orbitSectionRef = useRef(null);
  const advantageSectionRef = useRef(null);

  const orbitSectionInView = useInView(orbitSectionRef, { once: true, amount: 0.2 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  useEffect(() => {
    fetch("https://lottie.host/a12f93b1-0872-4cb7-acb3-6b00363d7509/40tCm2hisF.json").then((res) => res.json()).then(setOrbitAnimationData);
  }, []);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: "", type: "" });
    try {
      await sendInquiry(formData).unwrap();
      setFormData({ name: "", email: "", message: "" });
      setShowSuccessOverlay(true); // NEW: Trigger the aura screen
    } catch (err) {
      setSubmitStatus({ message: "Failed to send message. Please try again.", type: "error" });
    }
  };
  const handleMouseMove = (event) => { if (!headingRef.current) return; const rect = headingRef.current.getBoundingClientRect(); x.set(event.clientX - rect.left - rect.width / 2); y.set(event.clientY - rect.top - rect.height / 2); };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <>
      <style>{animationStyles}</style>

      <AnimatePresence>
        {showSuccessOverlay && <SuccessRevealModal onClose={() => setShowSuccessOverlay(false)} />}
      </AnimatePresence>

      <div className="w-full bg-gray-100 font-poppins text-gray-800 relative overflow-hidden">
        <HeroSection
          headingRef={headingRef}
          handleMouseMove={handleMouseMove}
          handleMouseLeave={handleMouseLeave}
          rotateX={rotateX}
          rotateY={rotateY}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          submitStatus={submitStatus}
        />
        <OrbitSection
          orbitSectionRef={orbitSectionRef}
          orbitSectionInView={orbitSectionInView}
          orbitAnimationData={orbitAnimationData}
          outerNodes={pageData.outerNodes}
          innerNodes={pageData.innerNodes}
        />
        <AdvantageSection
          advantageSectionRef={advantageSectionRef}
          features={pageData.features}
        />
      </div>
    </>
  );
};

export default ContactUsPage;