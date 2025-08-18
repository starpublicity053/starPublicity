import React, { useState, useEffect, useRef } from "react";
import { RefreshCcw, MapPin, Bus, TrainFront, Building, Megaphone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const random = (min, max) => Math.random() * (max - min) + min;

const marketData = [
  {
    id: "delhi",
    state: "DELHI",
    vibeWord: "Metropolitan Hub",
    color: "#60A5FA",
    heroImage: "https://images.pexels.com/photos/1036087/pexels-photo-1036087.jpeg",
    details: {
      intro:
        "India's pulsating capital, a strategic nexus for brand dominance. Delhi's vibrant consumer base and high-traffic corridors offer unparalleled visibility for ambitious campaigns.",
    },
  },
  {
    id: "jk",
    state: "Jammu & Kashmir",
    vibeWord: "Himalayan Serenity",
    color: "#818CF8",
    heroImage: "https://images.pexels.com/photos/4236109/pexels-photo-4236109.jpeg",
    details: {
      intro:
        "Navigating the unique beauty and emerging markets of Jammu & Kashmir requires sensitivity and local expertise. We blend tradition with modern media to capture hearts amidst breathtaking backdrops.",
    },
  },
  {
    id: "hp",
    state: "Himachal Pradesh",
    vibeWord: "Mountainous Charm",
    color: "#A78BFA",
    heroImage: "https://images.pexels.com/photos/1018507/pexels-photo-1018507.jpeg",
    details: {
      intro:
        "Himachal Pradesh, with its blend of vibrant tourism and growing local commerce, offers a unique advertising canvas. We tailor campaigns to capture both transient visitors and permanent residents.",
    },
  },
  {
    id: "haryana",
    state: "Haryana",
    vibeWord: "Industrial Powerhouse",
    color: "#C4B5FD",
    heroImage: "https://images.pexels.com/photos/2569500/pexels-photo-2569500.jpeg",
    details: {
      intro:
        "A rapidly industrializing state, Haryana provides fertile ground for outdoor advertising, especially in its burgeoning business and manufacturing hubs like Gurugram and Faridabad.",
    },
  },
];

const getRandomPosition = (width, height) => ({
  x: Math.random() * (width - 200) + 100,
  y: Math.random() * (height - 100) + 50,
});

// New component for individual 3D background shapes
const FloatingShape = ({ scrollYProgress, index, type }) => {
    const size = random(80, 200); // Random size for the shape
    // Random initial positions, potentially outside the viewport
    const initialX = random(0, window.innerWidth);
    const initialY = random(0, window.innerHeight);

    // Determines the shape and a soft, translucent color
    let shapeClass = "";
    const baseColor = [random(100, 200), random(150, 250), random(200, 255)]; // Blue/Purple range
    const bgColor = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${random(0.05, 0.15)})`;

    if (type === 'circle') {
        shapeClass = "rounded-full";
    } else if (type === 'square') {
        shapeClass = "rounded-xl";
    }

    // Subtle parallax effect based on scroll position of the parent section
    const yParallax = useTransform(scrollYProgress, [0, 1], [random(-100, 100), random(100, -100)]);
    const xParallax = useTransform(scrollYProgress, [0, 1], [random(-50, 50), random(50, -50)]);

    return (
        <motion.div
            className={`absolute ${shapeClass} filter blur-lg`}
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor,
                left: initialX,
                top: initialY,
                zIndex: 0, // Ensure it stays behind content
                // Apply scroll-driven parallax
                y: yParallax,
                x: xParallax,
            }}
            // Continuous floating and rotating animation
            animate={{
                x: [0, random(-50, 50), 0], // Small horizontal drift
                y: [0, random(-50, 50), 0], // Small vertical drift
                rotateX: [0, 360], // Full rotation
                rotateY: [0, 360],
                rotateZ: [0, 360],
                opacity: [random(0.05, 0.1), random(0.1, 0.2), random(0.05, 0.1)], // Subtle opacity variation
            }}
            transition={{
                duration: random(30, 70), // Very slow, long animation
                repeat: Infinity,
                repeatType: "reverse", // Makes motion smooth and continuous
                ease: "linear", // Consistent speed
                delay: index * random(1, 4), // Stagger start times for different shapes
            }}
        />
    );
};


// Advertising Media Section with a new, advanced scrolling effect (Staggered Fade-in with Horizontal Scale)
const AdvertisingMediaSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform for heading and subheading (fade in and slide up)
  const headingY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const mediaTypes = [
    {
      icon: <Building className="w-12 h-12 text-blue-600" />,
      title: "Hoardings & Billboards",
      description: "Command attention with large-format displays in high-traffic urban and highway locations, ensuring unmissable brand presence.",
      link: "#hoardings"
    },
    {
      icon: <Bus className="w-12 h-12 text-blue-600" />,
      title: "Bus Branding",
      description: "Turn city buses into moving billboards, reaching diverse demographics across extensive routes daily and generating widespread awareness.",
      link: "#busbranding"
    },
    {
      icon: <TrainFront className="w-12 h-12 text-blue-600" />,
      title: "Metro & Railway Ads",
      description: "Engage captive audiences within bustling metro stations and railway platforms, delivering high-frequency exposure to commuters.",
      link: "#metro"
    },
    {
      icon: <Megaphone className="w-12 h-12 text-blue-600" />,
      title: "Unipoles & Gantry Signs",
      description: "Elevate your brand with prominent, towering unipoles and expansive gantry signs strategically placed for maximum impact on arterial roads.",
      link: "#unipoles"
    },
    {
      icon: <MapPin className="w-12 h-12 text-blue-600" />,
      title: "Airport Advertising",
      description: "Target affluent travelers with premium advertising spaces in airport lounges, terminals, and baggage claim areas for exclusive reach.",
      link: "#airport"
    },
    {
      icon: <Building className="w-12 h-12 text-blue-600" />,
      title: "Mall & Retail Branding",
      description: "Influence purchasing decisions directly at the point of sale with eye-catching displays and activations within shopping malls and retail outlets.",
      link: "#mall"
    },
  ];

  // Card variants for "Staggered Fade-in with Horizontal Scale and subtle vertical shift"
  const cardScaleYVariants = {
    hidden: { opacity: 0, y: 40, scaleX: 0.7 }, // Start transparent, slightly below, and horizontally compressed
    visible: {
      opacity: 1,
      y: 0,
      scaleX: 1,
      transition: {
        type: "spring",
        stiffness: 70, // Slightly less stiff for a smoother stretch
        damping: 15,
        duration: 0.7,
        ease: "easeOut",
      }
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4 md:px-12 lg:px-24 text-gray-800 relative overflow-hidden"
      style={{ perspective: '1200px' }} // Add perspective to enable 3D transforms on children
    >
      {/* Existing Background blobs */}
      <motion.div
        className="absolute w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 -left-20 -top-20"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 -right-30 -bottom-30"
        style={{ y: useTransform(scrollYProgress, [0, 1], [100, -100]) }}
      />

      {/* NEW: 3D Animated Background Shapes */}
      {Array.from({ length: 8 }).map((_, i) => ( // Create 8 shapes
          <FloatingShape
              key={i}
              index={i}
              scrollYProgress={scrollYProgress}
              type={i % 2 === 0 ? 'circle' : 'square'} // Alternate shapes
          />
      ))}

      <div className="max-w-7xl mx-auto text-center relative z-10"> {/* Ensure content is above shapes */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 leading-tight"
          style={{ y: headingY, opacity: headingOpacity }}
        >
          Diverse Outdoor Advertising Solutions
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-16 max-w-3xl mx-auto text-blue-800"
          style={{ y: headingY, opacity: headingOpacity }}
        >
          From bustling city centers to national highways, we provide tailored outdoor media options to ensure your brand stands out in every landscape.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {mediaTypes.map((media, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-blue-100"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardScaleYVariants}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-6 bg-blue-100 p-4 rounded-full shadow-inner">
                {media.icon}
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">{media.title}</h3>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {media.description}
              </p>
              <a
                href={media.link}
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
              >
                  Learn More
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};


function Markets() {
  const [key, setKey] = useState(0);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const resetVibe = () => setKey((prevKey) => prevKey + 1);

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
      scale: [0, 1, 0.8, 1.2, 0.9, 1],
      opacity: [0, 1, 0.8, 1, 0.7, 1, 0.5, 0],
      y: [0, -50, 50, -20, 30, -10, 0],
      x: [0, 30, -40, 20, -10, 0],
      transition: {
        duration: Math.random() * 20 + 10,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: i * 0.5,
      },
    }),
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
      opacity: [0, 1, 0.8, 0.5, 0],
      y: [20, 0, -20, -40, -60],
      transition: {
        duration: Math.random() * 15 + 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: i * 0.8 + 2,
      },
    }),
  };

  return (
    <>
      {/* SECTION 1: Abstract Journey */}
      <div
        ref={containerRef}
        className="w-full min-h-screen relative overflow-hidden font-sans flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900"
      >
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(187,222,251,0.5) 0%, rgba(200,230,201,0) 90%), radial-gradient(circle at 90% 80%, rgba(144,202,249,0.5) 0%, rgba(200,230,201,0) 90%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <AnimatePresence key={key}>
            {containerSize.width > 0 && containerSize.height > 0 && (
              <motion.div className="relative w-full h-full">
                {Array.from({ length: 30 }).map((_, i) => {
                  const size = Math.random() * 150 + 50;
                  const initialPos = getRandomPosition(
                    containerSize.width,
                    containerSize.height
                  );
                  const colorOpacity = 0.1 + Math.random() * 0.3;
                  return (
                    <motion.div
                      key={`bubble-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: `rgba(59, 130, 246, ${colorOpacity})`,
                        filter: `blur(${size / 10}px)`,
                        left: initialPos.x,
                        top: initialPos.y,
                      }}
                      custom={i}
                      variants={bubbleVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0 }}
                    />
                  );
                })}
                {marketData.map((market, i) => {
                  const initialPos = getRandomPosition(
                    containerSize.width,
                    containerSize.height
                  );
                  return (
                    <motion.div
                      key={`vibe-text-${market.id}-${i}`}
                      className="absolute font-semibold text-xl md:text-3xl whitespace-nowrap"
                      style={{
                        left: initialPos.x,
                        top: initialPos.y,
                        color: market.color,
                      }}
                      custom={i}
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0 }}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-6 h-6" />
                        {market.state}
                        <span className="font-normal italic text-base md:text-xl opacity-80">
                          ({market.vibeWord})
                        </span>
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 drop-shadow-lg leading-tight">
            <span className="block text-blue-700">Feel the Pulse of Our</span>
            <span className="block mt-2">North India Markets</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-800 mt-4 max-w-2xl mx-auto drop-shadow-md">
            An abstract journey through our vibrant and expansive network.
          </p>
        </div>
        <motion.button
          onClick={resetVibe}
          className="absolute bottom-6 right-6 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition z-50 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCcw className="w-5 h-5" />
          <span className="hidden md:inline">Refresh Vibe</span>
        </motion.button>
      </div>

      {/* SECTION 2: Immersive Cards */}
      <div className="w-full bg-gradient-to-b from-white via-blue-50 to-white py-20 px-4 md:px-12 lg:px-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 mb-12">
          Immersive Market Snapshots
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {marketData.map((market, i) => (
            <motion.div
              key={market.id}
              whileHover={{ scale: 1.02, rotateY: 4, rotateX: -2 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-transform duration-500 perspective"
            >
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={market.heroImage}
                  alt={market.state}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
                <div className="absolute bottom-4 left-4">
                  <span
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                    style={{ borderColor: market.color }}
                  >
                    {market.vibeWord}
                  </span>
                  <h3 className="text-2xl text-white font-bold">{market.state}</h3>
                </div>
              </div>
              <div className="p-6 text-blue-800 backdrop-blur-md bg-white/70 rounded-b-3xl">
                <p className="text-sm">{market.details.intro}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Advertising Media Section with the fixed horizontal scale and fade effect and new 3D background */}
      <AdvertisingMediaSection />
    </>
  );
}

export default Markets;