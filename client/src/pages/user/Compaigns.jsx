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

const MotionLink = motion(Link); 

const WaveBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-white">
      <svg
        className="absolute bottom-0 left-0 w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <defs>
          <motion.path
            id="wave-path"
            d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,133.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,133.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,170.7C96,149,192,107,288,112C384,117,480,171,576,197.3C672,224,768,224,864,202.7C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,133.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        </defs>
        <use href="#wave-path" fill="rgba(239, 246, 255, 1)" /> 
        <use href="#wave-path" fill="rgba(219, 234, 254, 0.5)" transform="translate(20, 20)" />
        <use href="#wave-path" fill="rgba(191, 219, 254, 0.3)" transform="translate(-20, 40)" />
      </svg>
    </div>
  );
};

const HeroSection = () => {
  const words = ["Captivate", "Engage", "Convert", "Inspire"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="relative w-full h-screen overflow-hidden font-body bg-white text-gray-800 flex items-center justify-center"
    >
      <WaveBackground />
      <motion.div
        className="relative w-full max-w-4xl text-center p-4 z-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="flex flex-wrap items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold font-heading mb-4 md:mb-6 leading-tight"
          variants={itemVariants}
        >
          <span className="mr-2 sm:mr-4">Campaigns That</span>
          <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom min-w-[180px] sm:min-w-[280px] md:min-w-[350px] text-left">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>
        <motion.p
          className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
          variants={itemVariants}
        >
          Based in Ludhiana, we engineer strategic campaigns that deliver
          measurable impact and build lasting brand legacies.
        </motion.p>
        <motion.div variants={itemVariants}>
          <MotionLink
            to="/contact"
            className="inline-block px-8 py-4 text-lg font-bold rounded-full shadow-lg pointer-events-auto bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/40"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project
          </MotionLink>
        </motion.div>
      </motion.div>
    </section>
  );
};

const LogoCarousel = ({ baseVelocity = 5 }) => {
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
            key={`${logo.split("/").pop()}-${index}`} // [RESPONSIVE-SM] Adjusted logo sizes and margins for small screens
            className="flex-shrink-0 w-[100px] h-[50px] sm:w-[180px] sm:h-[90px] mx-4 sm:mx-8 flex items-center justify-center"
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

const MobileCampaignShowcase = ({ campaigns }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section className="bg-[#f0f2f5] text-gray-900 py-16 font-body w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
        <HeaderSection
          title="Featured Campaigns"
          subtitle="Explore our most impactful advertising solutions"
        />
      </div>
      <div className="max-w-md mx-auto mt-12 px-4 space-y-10">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.title}
            ref={cardRef}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200/80"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-full h-60 overflow-hidden">
              <motion.img
                src={campaign.img}
                alt={campaign.title}
                className="w-full h-full object-cover"
                style={{ y: imageY }}
                loading="lazy"
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold font-heading text-gray-800">
                {campaign.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                This campaign showcases our innovative approach to creating
                memorable and effective advertising solutions that resonate
                with audiences.
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const NewCampaignShowcaseSection = () => {
  const campaigns = [
    {
      title: "Downtown Digital Display",
      img: "https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Bus Wrap Initiative",
      img: "https://images.pexels.com/photos/342214/pexels-photo-342214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Airport Experience",
      img: "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Metro Branding Takeover",
      img: "https://images.pexels.com/photos/712780/pexels-photo-712780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Digital Billboard Network",
      img: "https://images.pexels.com/photos/544247/pexels-photo-544247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(campaigns.length / 2)
  );

  // [RESPONSIVE-SM] Adjusted values for smaller screens
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const cardWidth = isSmallScreen ? 180 : 320;
  const cardHeight = isSmallScreen ? 250 : 420;
  const offsetXValue = isSmallScreen ? 130 : 250;

  if (isSmallScreen) {
    return <MobileCampaignShowcase campaigns={campaigns} />;
  }

  return (
    <section className="bg-gray-100 text-gray-900 py-20 sm:py-32 font-body w-full flex flex-col items-center overflow-hidden" style={{ perspective: "1200px" }}>
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
        <HeaderSection
          title="Featured Campaigns"
          subtitle="Explore our most impactful advertising solutions"
        />
      </div>

      <div className="relative w-full h-[380px] sm:h-[550px] flex items-center justify-center mb-12 sm:mb-24" style={{ transformStyle: "preserve-3d" }}>
        {campaigns.map((campaign, index) => {
          const isActive = index === activeIndex;
          const distance = Math.abs(index - activeIndex);
          const offsetX = (index - Math.floor(campaigns.length / 2)) * offsetXValue;
          const rotateY = (index - Math.floor(campaigns.length / 2)) * -15;
          const zIndex = campaigns.length - distance;
          return (
            <motion.div
              key={campaign.title}
              className="absolute cursor-pointer"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                zIndex,
              }}
              animate={{
                x: offsetX,
                scale: isActive ? 1.1 : 1,
                translateZ: isActive ? 0 : -distance * 100,
                rotateY: isActive ? 0 : rotateY,
                opacity: isActive ? 1 : 0.5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => setActiveIndex(index)}
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