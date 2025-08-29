import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useVelocity,
  useScroll,
  useAnimationFrame,
} from "framer-motion";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { FaMoon, FaSun } from "react-icons/fa6";
import { Link } from "react-router-dom";

const wrap = (min, max, value) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

const GlobalAnimations = () => (
  <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Slab:wght@700;900&display=swap');

      .campaign-font-scope { font-family: 'Roboto', sans-serif; }
      .font-heading { font-family: 'Roboto Slab', serif; }
      .font-body { font-family: 'Roboto', sans-serif; }
      
      .moon-glow {
        filter: drop-shadow(0 0 25px rgba(220, 220, 255, 0.6));
      }
      .sun-glow {
        filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.7));
      }
    `}</style>
);

const TrailStar = ({ x, y, size }) => {
  return (
    <motion.div
      // MODIFICATION 1: Changed 'fixed' to 'absolute' to contain stars within the hero section.
      className="absolute rounded-full z-[9999] pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 10px #FFFFFF, 0 0 20px #FFFFFF",
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 1, opacity: 1 }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 1.2, ease: "easeOut" },
      }}
    />
  );
};
const AbstractDayBackground = () => (
  <div className="absolute inset-0">
    {" "}
    <div className="absolute top-0 left-0 w-full h-full bg-[#f4f7fc]" />{" "}
    <div
      className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full"
      style={{ opacity: 0.2, filter: "blur(100px)" }}
    />{" "}
    <div
      className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-gray-200"
      style={{
        opacity: 0.3,
        clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
      }}
    />{" "}
  </div>
);
const Stars = () => {
  const starCount = 150;
  const stars = useMemo(
    () =>
      Array.from({ length: starCount }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 80}%`,
        size: `${Math.random() * 1.5 + 0.5}px`,
        delay: Math.random() * 5,
      })),
    []
  );
  return (
    <div className="absolute inset-0 z-0">
      {" "}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.y,
            left: star.x,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1, 0] }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}{" "}
    </div>
  );
};

const DigitalCityscape = ({ theme }) => {
  const buildings = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        height: `${Math.random() * 25 + 5}%`,
      })),
    []
  );
  const cityVariants = {
    night: { backgroundColor: "rgba(255, 255, 255, 0.05)" },
    day: { backgroundColor: "#cdd6e4" },
  };
  return (
    // [RESPONSIVE-SM] Reduced height on small screens
    <div className="absolute bottom-0 left-0 w-full h-1/4 sm:h-1/3 flex items-end justify-center gap-[0.5%] z-10">
      {buildings.map((building) => (
        <motion.div
          key={building.id}
          className="w-full"
          initial={{ height: "0%" }}
          animate={{ height: building.height }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: Math.random() * 1.5,
          }}
        >
          <motion.div
            className="w-full h-full"
            variants={cityVariants}
            animate={theme}
            transition={{ duration: 1 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

const Sky = ({ theme }) => {
  return (
    <div className="absolute inset-0 z-0">
      {" "}
      <AnimatePresence>
        {" "}
        {theme === "night" && (
          <motion.div
            key="nightSky"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #020111 10%, #20202c 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {" "}
            <motion.div key="moon" className="absolute top-[15%] left-[10%]">
              {/* [RESPONSIVE-SM] Smaller icon on small screens */}
              <FaMoon className="text-6xl sm:text-8xl text-slate-200 moon-glow" />
            </motion.div>{" "}
          </motion.div>
        )}{" "}
        {theme === "day" && (
          <motion.div
            key="daySky"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {" "}
            <AbstractDayBackground />{" "}
            <motion.div key="sun" className="absolute top-[15%] right-[10%]">
              {/* [RESPONSIVE-SM] Smaller icon on small screens */}
              <FaSun className="text-7xl sm:text-9xl text-yellow-500 sun-glow" />
            </motion.div>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>{" "}
    </div>
  );
};

const ThemeToggle = ({ theme, setTheme }) => {
  return (
    <motion.button
      onClick={() => setTheme(theme === "night" ? "day" : "night")}
      className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/20"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {" "}
      <AnimatePresence mode="wait" initial={false}>
        {" "}
        {theme === "night" ? (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {" "}
            <BsSunFill className="h-6 w-6 text-yellow-400" />{" "}
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {" "}
            <BsMoonStarsFill className="h-6 w-6 text-slate-300" />{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>{" "}
    </motion.button>
  );
};

const MotionLink = motion(Link);

const HeroSection = () => {
  const [theme, setTheme] = useState("night");
  const [stars, setStars] = useState([]);

  const handleMouseMove = (e) => {
    if (theme !== "night") return;
    const size = Math.random() * 2.5 + 1;
    setStars((prev) => [
      ...prev,
      // MODIFICATION 2: Changed to clientX/clientY for viewport-relative coordinates.
      { id: Date.now(), x: e.clientX, y: e.clientY, size },
    ]);
  };
  useEffect(() => {
    if (theme === "day") setStars([]);
    const interval = setInterval(() => {
      setStars((prev) => prev.slice(Math.max(0, prev.length - 20)));
    }, 500);
    return () => clearInterval(interval);
  }, [theme]);

  const contentVariants = {
    night: { color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.7)" },
    day: { color: "#1A202C", textShadow: "none" },
  };
  const paragraphVariants = {
    night: { color: "#E2E8F0" },
    day: { color: "#4A5568" },
  };
  const buttonVariants = {
    night: {
      background: "linear-gradient(to right, #1a2a80, #6978D1)",
      color: "#FFF",
    },
    day: { background: "#2563eb", color: "#FFF" },
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden font-body bg-black"
    >
      <AnimatePresence>
        {" "}
        {stars.map((star) => (
          <TrailStar key={star.id} x={star.x} y={star.y} size={star.size} />
        ))}{" "}
      </AnimatePresence>
      <Sky theme={theme} />
      {theme === "night" && <Stars />}
      <DigitalCityscape theme={theme} />
      <div className="relative w-full h-full flex items-center justify-center p-4 z-20 pointer-events-none">
        <div className="w-full max-w-xl md:max-w-3xl text-center">
          {/* [RESPONSIVE-SM] Reduced base heading size */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-4 md:mb-6 leading-tight"
            variants={contentVariants}
            animate={theme}
            transition={{ duration: 1 }}
          >
            Campaigns That Captivate & Convert.
          </motion.h1>
          <motion.p
            className="text-base md:text-xl max-w-sm sm:max-w-lg md:max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
            variants={paragraphVariants}
            animate={theme}
            transition={{ duration: 1 }}
          >
            Based in Ludhiana, we engineer strategic campaigns that deliver
            measurable impact and build lasting brand legacies.
          </motion.p>
          {/* [RESPONSIVE-SM] Reduced base button padding and text size */}
          <MotionLink
            to="/contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            variants={buttonVariants}
            animate={theme}
            transition={{ duration: 1 }}
            className="inline-block px-6 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-bold rounded-full shadow-lg pointer-events-auto"
          >
            Start Your Project
          </MotionLink>
        </div>
      </div>
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </section>
  );
};

const LogoCarousel = ({ baseVelocity = 2.5 }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const resolvedBaseVelocity = isDesktop ? 4 : baseVelocity;

  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`);

  const directionFactor = useRef(-1);
  const isHovering = useRef(false);

  useAnimationFrame((t, delta) => {
    if (isHovering.current) return;
    baseX.set(baseX.get() + directionFactor.current * resolvedBaseVelocity * (delta / 1000));
  });
  const logos = useMemo(
    () => [
      "/assets/Logos/big bazaar.png",
      "/assets/Logos/eicher.png",
      "/assets/Logos/havells.png",
      "/assets/Logos/hdfc.png",
      "/assets/Logos/muthoot.png",
      "/assets/Logos/ola.png",
      "/assets/Logos/oppo.png",
      "/assets/Logos/prince pipes.png",
      "/assets/Logos/samsung.png",
      "/assets/Logos/tata.png",
    ],
    []
  );

  // We need to duplicate the logos multiple times to create a seamless loop that works on very wide screens.
  const duplicatedLogos = useMemo(() => [...logos, ...logos, ...logos, ...logos], [logos]);

  return (
    <div
      className="relative w-full overflow-hidden py-4 md:py-8"
      onMouseEnter={() => (isHovering.current = true)}
      onMouseLeave={() => (isHovering.current = false)}
    >
      {/* Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#0D121B] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#0D121B] to-transparent z-10 pointer-events-none" />

      <motion.div className="flex" style={{ x }}>
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.split("/").pop()}-${index}`}
            className="flex-shrink-0 w-[120px] h-[60px] sm:w-[180px] sm:h-[90px] mx-4 sm:mx-8 flex items-center justify-center"
          >
            <img
              src={logo}
              alt={`Partner Logo ${index + 1}`}
              loading="lazy"
              className={`max-w-full max-h-full object-contain ${
                logo.includes("prince pipes.png")
                  ? "scale-[2.4]"
                  : ""
              }`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
const MarqueeText = ({ children, baseVelocity = 100 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    moveBy += directionFactor.current * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      {" "}
      <motion.div className="inline-block" style={{ x }}>
        {" "}
        {[...Array(6)].map((_, i) => (
          <span key={i} className="mr-8">
            {children}
          </span>
        ))}{" "}
      </motion.div>{" "}
    </div>
  );
};

const NewCampaignShowcaseSection = () => {
  const campaigns = [
    {
      title: "CityPulse Urban Campaign",
      img: "/assets/Featured campaigns/Capture 1.PNG",
    },
    {
      title: "Bus Wrap Initiative",
      img: "/assets/Featured campaigns/Capture 2.PNG",
    },
    {
      title: "Airport Experience",
      img: "/assets/Featured campaigns/Capture.PNG",
    },
    {
      title: "Metro Branding Takeover",
      img: "/assets/Featured campaigns/Capture 3.PNG",
    },
    {
      title: "Digital Billboard Network",
      img: "/assets/Featured campaigns/Capture 4.PNG",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(campaigns.length / 2)
  );

  // [RESPONSIVE-SM] Adjusted values for smaller screens
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const cardWidth = isSmallScreen ? 220 : 320;
  const cardHeight = isSmallScreen ? 300 : 420;
  const offsetXValue = isSmallScreen ? 160 : 250;

  return (
    <section className="bg-gray-100 text-gray-900 py-20 sm:py-32 font-body w-full flex flex-col items-center overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
        <HeaderSection
          title="Featured Campaigns"
          subtitle="Explore our most impactful advertising solutions"
        />
      </div>

      <div className="relative w-full h-[380px] sm:h-[550px] flex items-center justify-center mb-12 sm:mb-24">
        {campaigns.map((campaign, index) => {
          const isActive = index === activeIndex;
          const distance = Math.abs(index - activeIndex);
          const scale = 1 - distance * 0.15;
          const offsetX = (index - activeIndex) * offsetXValue;
          const zIndex = campaigns.length - distance;
          return (
            <motion.div
              key={campaign.title}
              className="absolute cursor-pointer"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                zIndex,
                transformOrigin: "center center",
              }}
              animate={{
                x: offsetX,
                scale: isActive ? 1.1 : scale,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => setActiveIndex(index)}
              whileHover={
                !isActive ? { scale: scale + 0.05, opacity: 0.6 } : {}
              }
            >
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative shadow-2xl transition-shadow duration-300">
                <img
                  src={campaign.img}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.h3
          key={campaigns[activeIndex].title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-gray-900 text-2xl font-bold font-heading drop-shadow-md text-center -mt-8 sm:-mt-16 px-4"
        >
          {campaigns[activeIndex].title}
        </motion.h3>
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 w-full mt-8">
        <FeaturesSection />
      </div>
    </section>
  );
};

const ClientLogosSection = () => {
  const sectionRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = null;
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollProgress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);
      setParallaxOffset((scrollProgress - 0.5) * 60);
    };
    const onScroll = () => {
      if (prefersReduced) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        handleScroll();
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-20 sm:py-32 flex flex-col items-center justify-center font-body"
      style={{
        background: `linear-gradient(180deg, #1A202C 0%, #0D121B 100%)`,
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {/* [RESPONSIVE-SM] Smaller base text size */}
        <span
          className="text-[8rem] sm:text-[10rem] md:text-[18rem] lg:text-[22rem] font-bold text-white opacity-[0.03] select-none font-heading leading-none"
          style={{
            lineHeight: "1",
            letterSpacing: "-0.05em",
            textShadow: "0px 0px 50px rgba(255,255,255,0.05)",
            willChange: "transform",
          }}
        >
          {" "}
          Partners{" "}
        </span>
      </div>
      <div className="relative z-20 text-center max-w-5xl mx-auto px-4 mb-8 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight drop-shadow-md font-heading">
          Trusted by Leading Brands
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed opacity-90">
          {" "}
          Our commitment has earned us the trust of leading brands.{" "}
        </p>
      </div>
      <LogoCarousel />
      <div className="relative z-20 text-center mt-8 md:mt-12 text-gray-400 text-sm opacity-80">
        <p>Collaborating to shape the future of digital presence.</p>
      </div>
    </section>
  );
};
const HeaderSection = ({ title, subtitle }) => {
  return (
    <div className="text-center font-body mb-12 sm:mb-16 px-4">
      {" "}
      <p className="text-sm sm:text-base font-medium tracking-[0.2em] uppercase mb-2">
        {" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
          {" "}
          {subtitle}{" "}
        </span>{" "}
      </p>{" "}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-wide font-heading">
        {" "}
        {title}{" "}
      </h2>{" "}
    </div>
  );
};
const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto mb-2 text-white"
        >
          {" "}
          <circle cx="20" cy="20" r="18" /> <path d="M20 10v10l7 7" />{" "}
        </svg>
      ),
      title: "Strategic Targeting",
      desc: "Precision audience identification for maximum impact.",
    },
    {
      icon: (
        <svg
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto mb-2 text-white"
        >
          {" "}
          <rect x="8" y="8" width="24" height="24" rx="4" />{" "}
          <path d="M16 16l8 8" />{" "}
        </svg>
      ),
      title: "Creative Deployment",
      desc: "Engaging and memorable ad creatives that convert.",
    },
    {
      icon: (
        <svg
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto mb-2 text-white"
        >
          {" "}
          <rect x="6" y="14" width="28" height="16" rx="4" />{" "}
          <path d="M14 10v4" /> <path d="M26 10v4" />{" "}
        </svg>
      ),
      title: "Impact Monitoring",
      desc: "Real-time campaign performance tracking and analytics.",
    },
    {
      icon: (
        <svg
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto mb-2 text-white"
        >
          {" "}
          <rect x="6" y="14" width="28" height="16" rx="4" />{" "}
          <path d="M14 10v4" /> <path d="M26 10v4" />{" "}
        </svg>
      ),
      title: "Flexibility & Rotation",
      desc: "Easily rotate or update campaigns across formats.",
    },
  ];
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mx-auto w-full">
      {" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
        {" "}
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            {" "}
            <div className="mb-4">{feature.icon}</div>{" "}
            <h3 className="text-white font-semibold text-lg mb-2 font-heading">
              {feature.title}
            </h3>{" "}
            <p className="text-gray-300 text-sm font-body">{feature.desc}</p>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
};
const MarqueeLegacyCTA = ({ emailAddress }) => {
  return (
    <section className="relative w-full bg-zinc-50 font-body py-20 sm:py-32 md:py-48 overflow-hidden">
      {" "}
      <div className="absolute inset-0 z-0 flex flex-col justify-center items-center opacity-[0.06] pointer-events-none">
        {" "}
        <div className="w-full text-5xl sm:text-7xl md:text-9xl font-black text-zinc-900 select-none -skew-y-3">
          {" "}
          <MarqueeText baseVelocity={-1}>
            {" "}
            LEGACY • STRATEGY • DESIGN{" "}
          </MarqueeText>{" "}
          <MarqueeText baseVelocity={1}>
            {" "}
            IMPACT • LUDHIANA • PARTNERSHIP{" "}
          </MarqueeText>{" "}
        </div>{" "}
      </div>{" "}
      <motion.div
        className="relative z-10 text-center flex flex-col items-center px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {" "}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading text-zinc-900 max-w-4xl">
          {" "}
          Let's Build Your Legacy.{" "}
        </h2>{" "}
        <p className="mt-6 text-lg text-zinc-600 max-w-2xl leading-relaxed">
          {" "}
          A brand that endures is a brand that was built with intention. We are
          your architectural partners in **Ludhiana**, crafting brand identities
          and strategies designed not just for today, but for tomorrow.{" "}
        </p>{" "}
        <motion.a
          href={`mailto:${emailAddress}`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="group inline-flex items-center justify-center px-8 py-4 mt-10 text-lg font-bold text-white bg-zinc-900 rounded-full shadow-lg transition-all duration-300 hover:bg-zinc-700"
        >
          {" "}
          Begin Consultation{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />{" "}
          </svg>{" "}
        </motion.a>{" "}
      </motion.div>{" "}
    </section>
  );
};

const Campaigns = () => {
  return (
    <div className="campaign-font-scope">
      <main
        className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-start relative"
        style={{
          width: "100vw",
          height: "auto",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <GlobalAnimations />
        <HeroSection />
        <NewCampaignShowcaseSection />
        <ClientLogosSection />
        <MarqueeLegacyCTA emailAddress="info@starpublicity.co.in" />
      </main>
    </div>
  );
};

export default Campaigns;