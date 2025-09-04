import React, { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion";

// --- Data for the key points on the dotted circle ---
const keyPoints = [
  { text: "Localized Market", angle: 0 }, { text: "Consistent Brand", angle: 45 },
  { text: "Customized Creative", angle: 90 }, { text: "Cross-Regional Coordination", angle: 135 },
  { text: "Data-Driven Decision", angle: 180 }, { text: "Scalable Campaign", angle: 225 },
  { text: "Real-Time Performance", angle: 270 }, { text: "Client Collaboration", angle: 315 },
];

// --- CORRECTED: OrbitingPoint component ---
// Text rotation has been removed.
const OrbitingPoint = ({ point, autoRotation }) => {
  const outerRadius = 320;
  const parentSize = 720;
  const centerOffset = parentSize / 2;
  const pointSize = 80;

  const x = useTransform(autoRotation, (rotation) => {
    const angleInRadians = (point.angle + rotation - 90) * (Math.PI / 180);
    return centerOffset + outerRadius * Math.cos(angleInRadians) - pointSize / 2;
  });

  const y = useTransform(autoRotation, (rotation) => {
    const angleInRadians = (point.angle + rotation - 90) * (Math.PI / 180);
    return centerOffset + outerRadius * Math.sin(angleInRadians) - pointSize / 2;
  });
    
  // REMOVED: The textRotation constant is no longer needed.
  // const textRotation = useTransform(autoRotation, (rotation) => -rotation);

  return (
    <motion.div
      className="absolute bg-[#1A2A80] text-white rounded-full flex items-center justify-center p-2 text-center shadow-md z-30"
      style={{ 
        width: pointSize, 
        height: pointSize, 
        left: x, 
        top: y 
      }}
    >
      {/* REMOVED: The style prop that applied the rotation is gone. */}
      <motion.span className="font-medium text-xs">{point.text}</motion.span>
    </motion.div>
  );
};

const LiquidReveal = ({ isInView }) => {
  const DURATION = 1.2;
  const EASE = [0.45, 0, 0.55, 1];

  const initialPath = "M0,50 C0,25 25,0 50,0 S100,25 100,50 S75,100 50,100 S0,75 0,50";
  const openPath = "M0,50 C0,0 0,0 50,0 S100,0 100,50 S100,100 50,100 S0,100 0,50";

  const pathVariants = {
    initial: { d: initialPath },
    open: { d: openPath, transition: { duration: DURATION, ease: EASE } },
  };

  const svgVariants = {
    initial: { opacity: 1 },
    open: {
      scale: 30,
      transition: { duration: DURATION, delay: DURATION * 0.1, ease: EASE },
    },
  };

  return (
    <motion.svg
      width="100" height="100" viewBox="0 0 100 100"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
      variants={svgVariants}
      initial="initial"
      animate={isInView ? "open" : "initial"}
    >
      <motion.path fill="#1A2A80" variants={pathVariants} />
    </motion.svg>
  );
};

const AboutUs = () => {
  const welcomeSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: welcomeSectionRef,
    offset: ["start start", "end end"],
  });

  const circleScale = useTransform(scrollYProgress, [0, 0.8], [1, 80]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.1, 0.45], [0.7, 1]);
  const textY = useTransform(scrollYProgress, [0.1, 0.45], ["5vh", "0vh"]);

  const contactSectionRef = useRef(null);
  const isInView = useInView(contactSectionRef, { once: true, amount: 0.5 });

  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 1.2 },
    },
  };

  const contentItemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 18, mass: 0.8, },
    },
  };

  // --- Quote Section (Continuous Scroll Effect for Heading) ---
  const quoteSectionRef = useRef(null);
  const { scrollYProgress: quoteScrollProgress } = useScroll({
    target: quoteSectionRef,
    offset: ["start end", "end start"],
  });

  const xQuoteLine1 = useTransform(quoteScrollProgress, [0, 1], [-400, 400]);
  const xQuoteLine2 = useTransform(quoteScrollProgress, [0, 1], [400, -400]);
  const xQuoteLine3 = useTransform(quoteScrollProgress, [0, 1], [-300, 300]);

  // --- Quote Section (Entrance Animation for Attribution Text) ---
  const attributionRef = useRef(null);
  const isAttributionInView = useInView(attributionRef, { once: true, amount: 0.5 });
  const attributionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // --- Start: Automatic Rolling Circle Animation Setup ---
  const autoRotation = useMotionValue(0);

  useEffect(() => {
    const controls = animate(autoRotation, 360, {
      ease: "linear", duration: 20, repeat: Infinity, repeatType: "loop",
    });
    return controls.stop;
  }, [autoRotation]);
  
  return (
    <>
      {/* === Top Hero Section (UNCHANGED) === */}
      <section className="relative w-full min-h-[900px] lg:min-h-[100vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/assets/AboutpageImages/bg.png')`}}/>
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="absolute top-1/3 left-0 w-full z-0 pointer-events-none overflow-hidden">
            <div className="whitespace-nowrap font-black opacity-10 text-white select-none flex" style={{ fontSize: "20vw", animation: "slideStarInfinite 30s linear infinite", width: "max-content" }}>
                <span>STAR PUBLICITY • STAR PUBLICITY • STAR PUBLICITY • STAR PUBLICITY • STAR PUBLICITY • </span>
                <span>STAR PUBLICITY • STAR PUBLICITY • STAR PUBLICITY • STAR PUBLICITY • STAR PUBLICITY • </span>
            </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-20 max-w-xl px-4 md:px-8 lg:px-16 pt-40">
            <h1 className="text-white font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl leading-tight tracking-tight drop-shadow-lg text-justify">
                <span className="block">YOUR TRUSTED</span>
                <span className="block">PARTNER IN</span>
                <span className="block">OUTDOOR ADVERTISING</span>
            </h1>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.2, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative z-20 mt-6 h-2 bg-white opacity-20 w-full max-w-xl mx-4 md:mx-8 lg:mx-16" style={{ clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)" }}/>
        <div className="absolute bottom-0 left-0 w-full h-[200px] z-10 overflow-hidden">
            <svg className="w-full h-full block" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" fillOpacity="1" d="M0,160L60,144C120,128,240,96,360,90.7C480,85,600,107,720,138.7C840,171,960,213,1080,208C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"/>
            </svg>
        </div>
        <style>{`@keyframes slideStarInfinite { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } } ::-webkit-webkit-scrollbar { display: none; } html { scrollbar-width: none; }`}</style>
      </section>

      {/* === Y Section (UNCHANGED) === */}
      <section className="bg-white py-0 px-6 md:px-16 mt-20">
        <div className="max-w-4xl mx-auto text-black text-xl md:text-2xl leading-relaxed font-semibold space-y-6">
          <p>We build brands through targeted outdoor ads that effectively reach your ideal audience. By leveraging creative approaches and insights, we ensure your message resonates where it counts, driving engagement and brand loyalty.</p>
          <p>Moreover, our results-driven approach combines unique design with placement, with a proper strategy, to boost visibility and impact on customers. We focus on measurable outcomes that support sustainability for your brand in competitive markets.</p>
        </div>
      </section>

      {/* === UPGRADED: Expanding Circle Reveal Section (Fully Responsive) === */}
      <section ref={welcomeSectionRef} className="relative bg-white" style={{ height: '110vh' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* The expanding circle. It acts as a background reveal. */}
          <motion.div
            className="absolute bg-[#1A2A80] rounded-full"
            style={{
              scale: circleScale,
              width: 'clamp(50px, 20vw, 100px)',
              height: 'clamp(50px, 20vw, 100px)',
            }}
          />
          
          {/* The text that appears inside the circle reveal */}
          <motion.div
            className="relative flex flex-col items-center"
            style={{
              opacity: textOpacity,
              scale: textScale,
              y: textY,
            }}
          >
            {/* Responsive font sizes applied below */}
            <h2 className="font-black text-white text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none">WELCOME TO</h2>
            <h2 className="font-black text-white text-[18vw] md:text-[15vw] lg:text-[12vw] leading-none">STAR</h2>
            <h2 className="font-black text-white text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none">PUBLICITY</h2>
          </motion.div>
        </div>
      </section>

      {/* === "HOW WE WORK" Section (UNCHANGED) === */}
      <section className="bg-white py-2 px-4 md:px-8 lg:px-16 mt-7">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-4xl md:text-5xl text-black mb-12">HOW WE WORK</h2>
          <div className="max-w-4xl space-y-6 text-gray-800 text-lg md:text-xl leading-relaxed mb-16 lg:mb-24">
            <p>We start by identifying your goals and ideal audience to create effective outdoor campaigns for your brand. With a strategic planning and approach, Star Publicity always ensures that your brand message delivers valuable results.</p>
            <p>Through collaboration and clear communication, we manage the entire process, from creative development to execution, using smart technology & latest tools for maximum efficiency and results.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <img src="/assets/AboutpageImages/creativeengineroom.png" alt="People working in a creative studio" className="w-full max-w-lg lg:max-w-none h-auto rounded-lg shadow-xl"/>
            </div>
            <div className="text-gray-800">
              <h3 className="font-bold text-3xl text-[#1A2A80] md:text-4xl mb-6">CREATIVE ENGINE ROOM </h3>
              <p className="text-lg md:text-xl leading-relaxed">Star Publicity’s Creative Engine Room is the place where ideas and vision come to life and collaboration transforms them into impactful OOH campaigns. By merging creative strategy, design, and local data, we craft memorable brand experiences. This type of environment uplifts creativity through diverse perspectives, ensuring every campaign delivers mind-blowing results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* === Quote Section (Now Responsive) === */}
      <section className="bg-[#1A2A80] py-16 sm:py-20 mt-20 overflow-hidden" ref={quoteSectionRef}>
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto flex items-center justify-center min-w-[320px]">
          <div className="relative flex flex-col items-center text-center w-full max-w-4xl">
            <div className="relative z-10 font-sans leading-tight">
              <motion.p style={{ x: xQuoteLine1 }} className='text-3xl sm:text-5xl lg:text-7xl font-black mb-2 sm:mb-4 text-white sm:whitespace-nowrap'>"At Star Publicity, we believe</motion.p>
              <motion.p style={{ x: xQuoteLine2 }} className='text-4xl sm:text-6xl lg:text-8xl font-serif italic mb-3 sm:mb-6 text-white sm:whitespace-nowrap'>every bold idea can bring change in </motion.p>
              <motion.p style={{ x: xQuoteLine3 }} className='text-3xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-8 text-white sm:whitespace-nowrap'>our society and redefine what’s possible."</motion.p>
            </div>
            <div className="w-28 h-1 bg-black mx-auto mb-4 sm:mb-6"></div>
            <motion.div ref={attributionRef} variants={attributionVariants} initial="hidden" animate={isAttributionInView ? "visible" : "hidden"} className="relative z-10 text-lg md:text-2xl font-medium leading-normal text-white">
              <p>Founder's Desk</p>
              <p>M/s Star Publicity</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === IMPROVED: Multi-Market Approach Section (Now Responsive) === */}
      <section className="bg-white py-20 sm:py-28 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-center">
            {/* --- Graphic Container --- */}
            <div className="relative flex justify-center items-center w-full min-h-[550px] lg:min-h-[720px]">
                {/* Desktop: Orbiting Points Graphic */}
                <div className="hidden lg:flex justify-center items-center w-full h-full">
                    <div className="relative flex justify-center items-center w-[720px] h-[720px]">
                        {/* The main heading and text are now the central element */}
                        <div className="absolute z-20 text-black text-center max-w-lg">
                            <h2 className="font-bold text-3xl md:text-4xl mb-6 leading-tight">
                                OUR APPROACH WITH <br className="hidden md:inline" />MULTI-MARKET BRANDS
                            </h2>
                            <p className="text-lg md:text-xl leading-relaxed">
                                We partner with multi-market brands and businesses to deliver cohesive outdoor advertising solutions tailored to various provinces and target areas.
                            </p>
                        </div>
                        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 720 720">
                            <circle cx="360" cy="360" r="320" stroke="#E5E7EB" strokeWidth="3" fill="none" />
                        </svg>
                        {keyPoints.map((point, index) => {
                            return (<OrbitingPoint key={index} point={point} autoRotation={autoRotation} />);
                        })}
                    </div>
                </div>

                {/* Mobile: A clear, stacked layout */}
                <div className="lg:hidden w-full max-w-md px-4">
                    <div className="text-center text-black mb-10">
                        <h2 className="font-bold text-3xl mb-4 leading-tight">
                            OUR APPROACH WITH MULTI-MARKET BRANDS
                        </h2>
                        <p className="text-lg leading-relaxed">
                            We partner with multi-market brands and businesses to deliver cohesive outdoor advertising solutions tailored to various provinces and target areas.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 mt-8">
                        <h3 className="font-bold text-xl text-center mb-6 text-[#1A2A80]">Our Core Strategies</h3>
                        <ul className="grid grid-cols-2 gap-4 text-center">
                            {keyPoints.map((point) => (
                                <li key={point.text} className="bg-white p-3 rounded-lg shadow-sm">
                                    <p className="font-semibold text-sm text-gray-800">{point.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* === UPGRADED: Animated Contact Section (Modern & Responsive Design) === */}
      <section 
        ref={contactSectionRef} 
        className="relative w-full min-h-[90vh] sm:min-h-[800px] flex items-center justify-center overflow-hidden bg-gray-100 py-20 px-4 sm:px-6 lg:px-8 mt-20"
      >
        {/* The liquid background reveal animation remains the same */}
        <LiquidReveal isInView={isInView} />
        
        {/* Main content container with staggered animation */}
        <motion.div 
          variants={contentContainerVariants} 
          initial="hidden" 
          animate={isInView ? "visible" : "hidden"} 
          className="relative z-30 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* === Left Column: Headline & Text === */}
          <div className="text-center lg:text-left">
            <motion.h2 
              variants={contentItemVariants} 
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white"
            >
              Ready to Amplify Your Brand?
            </motion.h2>
            <motion.p 
              variants={contentItemVariants} 
              className="mt-6 text-lg sm:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0"
            >
              Let's connect. Whether you have a question or are ready to start a project, our team is here to provide the answers and guide you forward.
            </motion.p>
          </div>

          {/* === Right Column: Contact Action Cards === */}
          <div className="w-full max-w-md mx-auto lg:mx-0 flex flex-col gap-6">
            {/* Card 1: Phone Call */}
            <motion.a
              variants={contentItemVariants}
              href="tel:01614668602"
              className="group flex items-center p-5 rounded-xl bg-white/10 border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-shrink-0 bg-white/10 p-3 rounded-lg mr-5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <span className="text-md font-medium text-gray-300">Talk to us directly</span>
                <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">0161-4668602</p>
              </div>
            </motion.a>

            {/* Card 2: WhatsApp */}
            <motion.a
              variants={contentItemVariants}
              href="https://wa.me/917403434074?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-5 rounded-xl bg-white/10 border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-shrink-0 bg-white/10 p-3 rounded-lg mr-5">
                 {/* === NEW WHATSAPP ICON === */}
                 <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.11 4.93A9.92 9.92 0 0 0 12.01 2C6.51 2 2.11 6.4 2.11 11.9c0 1.79.46 3.49 1.29 4.99L2 22l5.34-1.39a9.92 9.92 0 0 0 4.67 1.18h.01c5.49 0 9.9-4.4 9.9-9.9.01-2.73-1.09-5.22-2.9-7.06zm-7.1 14.28c-1.4 0-2.79-.4-4-1.12l-.29-.17-3 1.52.78-2.93-.19-.31a8.13 8.13 0 0 1-1.26-4.38c0-4.53 3.68-8.21 8.22-8.21a8.13 8.13 0 0 1 8.21 8.21c-.01 4.54-3.69 8.22-8.22 8.22zm4.26-6.12c-.24-.12-1.42-.7-1.65-.78s-.39-.12-.56.12c-.17.24-.62.78-.77.94s-.29.18-.54.06c-.25-.12-1.06-.39-2-1.23s-1.44-1.93-1.68-2.27c-.24-.34-.03-.52.1-.68.12-.14.26-.35.39-.53s.18-.29.26-.49.04-.38-.02-.5c-.06-.12-.56-1.34-.76-1.84s-.4-.42-.55-.42h-.53c-.18 0-.47.06-.71.31s-.94.92-.94 2.25.96 2.61 1.1 2.79c.14.18 1.88 2.88 4.56 4.03.62.27 1.1.43 1.48.56.59.2 1.12.17 1.52.1.45-.08 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.12-.24-.18-.48-.3z"/>
                 </svg>
              </div>
              <div>
                <span className="text-md font-medium text-gray-300">Message us on WhatsApp</span>
                <p className="text-xl sm:text-2xl font-bold text-white">Start a Chat</p>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default AboutUs;
