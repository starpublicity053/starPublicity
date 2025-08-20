import React, { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion";

const AboutUs = () => {
  // --- Animation setup for Expanding Circle Reveal ---
  const welcomeSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: welcomeSectionRef,
    offset: ["start start", "end end"],
  });

  // Animate the circle's scale to grow and fill the screen
  const circleScale = useTransform(scrollYProgress, [0, 0.8], [1, 80]);

  // Animate the text's properties to appear within the circle's animation
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.1, 0.45], [0.7, 1]);
  const textY = useTransform(scrollYProgress, [0.1, 0.45], ["5vh", "0vh"]);


  // Ref and inView for the Animated Contact Section
  const contactSectionRef = useRef(null);
  const isInView = useInView(contactSectionRef, { once: true, amount: 0.5 });

  // Variants for the staggered reveal of the main text content in the contact section
  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 1.5 },
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
  
  // Data for the key points on the dotted circle
  const keyPoints = [
    { text: "Localized Market", angle: 0 }, { text: "Consistent Brand", angle: 45 },
    { text: "Customized Creative", angle: 90 }, { text: "Cross-Regional Coordination", angle: 135 },
    { text: "Data-Driven Decision", angle: 180 }, { text: "Scalable Campaign", angle: 225 },
    { text: "Real-Time Performance", angle: 270 }, { text: "Client Collaboration", angle: 315 },
  ];

  // --- Start: Automatic Rolling Circle Animation Setup ---
  const autoRotation = useMotionValue(0);

  useEffect(() => {
    const controls = animate(autoRotation, 360, {
      ease: "linear", duration: 20, repeat: Infinity, repeatType: "loop",
    });
    return controls.stop;
  }, [autoRotation]);

  const autoCounterRotation = useTransform(autoRotation, (value) => -value);
  
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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white opacity-10 font-black select-none z-10" style={{ fontSize: "30vw", lineHeight: "0.8" }}>C</div>
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

      {/* === Quote Section (UNCHANGED) === */}
      <section className="bg-[#1A2A80] py-20 mt-20 overflow-hidden" ref={quoteSectionRef}>
        <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto flex items-center justify-center min-w-[320px]">
          <div className="relative flex flex-col items-center text-center w-full max-w-4xl">
            <div className="relative z-10 font-sans leading-tight">
              <motion.p style={{ x: xQuoteLine1 }} className='text-5xl md:text-6xl lg:text-7xl font-black mb-4 text-white whitespace-nowrap'>"At Star Publicity, we believe</motion.p>
              <motion.p style={{ x: xQuoteLine2 }} className='text-6xl md:text-7xl lg:text-8xl font-serif italic mb-6 text-white whitespace-nowrap'>every bold idea can bring change in </motion.p>
              <motion.p style={{ x: xQuoteLine3 }} className='text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white whitespace-nowrap'>our society and redefine what’s possible."</motion.p>
            </div>
            <div className="w-28 h-1 bg-black mx-auto mb-6"></div>
            <motion.div ref={attributionRef} variants={attributionVariants} initial="hidden" animate={isAttributionInView ? "visible" : "hidden"} className="relative z-10 text-xl md:text-2xl font-medium leading-normal text-white">
              <p>Founder's Desk</p>
              <p>M/s Star Publicity</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === MULTI-MARKET CLIENTS Section (UNCHANGED) === */}
      <section className="bg-white py-20 px-4 md:px-8 lg:px-16 mt-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative flex justify-center items-center h-[450px] lg:h-[550px] w-full">
                <motion.div className="relative flex justify-center items-center w-full h-full max-w-[500px] max-h-[500px]" style={{ rotate: autoRotation }}>
                    <div className="absolute bg-white rounded-full flex items-center justify-center w-[180px] h-[180px] md:w-[220px] md:h-[220px] z-20 shadow-lg">
                        <motion.div className="text-center text-black p-2" style={{ rotate: autoCounterRotation }}>
                            <p className="font-bold text-xl md:text-2xl mb-1">OUR CREATIVE STRATEGY</p>
                        </motion.div>
                    </div>
                    <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 500 500">
                        <circle cx="250" cy="250" r="210" stroke="#0F2633" strokeWidth="2" fill="none" strokeDasharray="5 10"/>
                    </svg>
                    {keyPoints.map((point, index) => {
                        const outerRadius = 210; const parentSize = 500; const centerOffset = parentSize / 2; const pointSize = 80;
                        const angleRad = (point.angle - 90) * (Math.PI / 180);
                        const xPos = centerOffset + outerRadius * Math.cos(angleRad) - pointSize / 2;
                        const yPos = centerOffset + outerRadius * Math.sin(angleRad) - pointSize / 2;
                        return (<motion.div key={index} className="absolute bg-[#1A2A80] text-white rounded-full flex items-center justify-center p-2 text-center shadow-md z-30" style={{ width: pointSize, height: pointSize, left: xPos, top: yPos, }}>
                          <motion.span className="font-medium text-xs" style={{ rotate: autoCounterRotation }}>{point.text}</motion.span>
                        </motion.div>);
                    })}
                </motion.div>
            </div>
            <div className="text-black lg:pl-12">
                <h2 className="font-bold text-3xl md:text-4xl mb-6 leading-tight">OUR APPROACH WITH <br className="hidden md:inline" />MULTI-MARKET BRANDS</h2>
                <p className="text-lg md:text-xl leading-relaxed">We partner with multi-market brands and businesses to deliver cohesive outdoor advertising solutions tailored to various provinces and target areas. By adapting our creative strategies to local insights while keeping brand texture, we ensure your message communicates effectively. Our streamlined coordination and understanding of geographical dynamics help brands achieve a unified impact and measurable outcomes.</p>
            </div>
        </div>
      </section>

      {/* === Animated Contact Section (UNCHANGED) === */}
      <section ref={contactSectionRef} className="relative w-full flex items-center justify-center min-h-[700px] overflow-hidden py-20 px-4 sm:px-6 lg:px-8 mt-20" style={{ backgroundColor: "#FFFFFF" }}>
        <motion.div initial={{ opacity: 1, scale: 1, rotate: 0, x: "-50%", y: "-50%", width: "clamp(200px, 50vw, 400px)", height: "clamp(200px, 50vw, 400px)", backgroundColor: "#000000", borderRadius: "50%", top: "50%", left: "50%"}} animate={isInView ? { scale: [1, 2, 10, 50], opacity: [1, 1, 1, 1], rotate: [0, 0, 0, 0], x: "-50%", y: "-50%", borderRadius: ["50%", "50%", "0%", "0%"], backgroundColor: "#0F2633", width: "100vw", height: "100vh" } : {}} transition={{ duration: 1.5, delay: 0.1, ease: "easeInOut" }} className="absolute z-10 flex items-center justify-center">
            <motion.span initial={{ opacity: 1, scale: 1 }} animate={isInView ? { opacity: 0, scale: 0.5 } : {}} transition={{ duration: 0.3, ease: "easeOut" }} className="font-black text-white select-none" style={{ fontSize: "clamp(150px, 30vw, 300px)", lineHeight: "1" }}>?</motion.span>
        </motion.div>
        <motion.div variants={contentContainerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} className="relative z-30 text-white text-center px-4 max-w-2xl mx-auto w-full h-full flex flex-col justify-center items-center" style={{ opacity: 1, backgroundColor: "transparent" }}>
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.08 } : {}} transition={{ duration: 1.5, delay: 1.8, ease: "easeOut" }} className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: `url('/question-mark-bg.png')`, backgroundSize: "95% auto", backgroundRepeat: "no-repeat", backgroundPosition: "center 80%", filter: "grayscale(100%) brightness(0.7)", }}/>
            <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
                <motion.h2 variants={contentItemVariants} className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-center">HAVE ANY QUESTIONS? WE'RE HERE TO PROVIDE THE ANSWERS.</motion.h2>
                <motion.p variants={contentItemVariants} className="text-xl md:text-2xl font-medium text-gray-300">Try it</motion.p>
                <motion.a variants={contentItemVariants} href="tel:0308700260" className="block text-4xl md:text-5xl font-extrabold mb-2 hover:text-[#1A2A80] transition-colors duration-300 tracking-tight" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>030 87 00 260</motion.a>
                <motion.p variants={contentItemVariants} className="text-xl md:text-2xl mb-4 font-medium text-gray-300">Or send an app</motion.p>
                <motion.a variants={contentItemVariants} href="https://wa.me/918839728739?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-[#1A2A80] text-white px-6 py-3 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-full text-base sm:text-lg md:text-xl font-bold hover:bg-[#153D52] transition-colors duration-300 shadow-lg" whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(27, 73, 101, 0.4)", }} whileTap={{ scale: 0.95 }}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.04 2C7.35 2 3.56 5.79 3.56 10.48C3.56 12.07 4.01 13.59 4.79 14.93L3.6 18.23L7.04 17.11C8.29 17.76 9.64 18.11 11.02 18.11C15.71 18.11 19.5 14.32 19.5 9.63C19.5 4.94 15.71 2 12.04 2ZM15.89 13.79C15.72 14.07 15.51 14.16 15.25 14.28C14.86 14.47 13.06 15.34 12.78 15.39C12.49 15.45 12.28 15.42 12.07 15.36C11.87 15.3 11.3 15.06 10.74 14.62C10.18 14.18 9.77 13.56 9.61 13.31C9.46 13.06 8.57 11.96 8.57 11.01C8.57 10.06 9.3 9.77 9.54 9.65C9.77 9.54 10.05 9.52 10.23 9.52C10.42 9.52 10.65 9.55 10.83 9.59C11.02 9.64 11.16 9.8 11.35 10.15C11.55 10.49 11.98 11.13 12.07 11.26C12.16 11.4 12.24 11.53 12.4 11.75C12.56 11.97 12.74 12.23 12.89 12.35C13.06 12.48 13.19 12.57 13.36 12.67C13.54 12.78 13.71 12.88 14.1 13.09C14.47 13.29 14.77 13.40 15.02 13.53C15.26 13.67 15.45 13.75 15.61 13.84C15.77 13.94 15.89 13.97 15.89 13.79Z" />
                    </svg>
                    WhatsApp
                </motion.a>
            </div>
        </motion.div>
      </section>
    </>
  );
};

export default AboutUs;