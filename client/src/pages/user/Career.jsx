import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  easeInOut,
} from "framer-motion";
import { Link } from "react-router-dom";
const MotionLink = motion(Link);

// CORRECTED: The incorrect image import has been removed.

const GALLERY_IMAGES = [
  "/assets/Career images/square img 1.png",
  "/assets/Career images/career 1.png",
  "/assets/Career images/career 2.png",
  "/assets/Career images/career 3.png",
  "/assets/Career images/square img 2.png",
 ];

const Career = () => {
  const gallerySectionRef = useRef(null);
  const { scrollYProgress: galleryScrollYProgress } = useScroll({
    target: gallerySectionRef,
    offset: ["start end", "end start"],
  });

  const horizontalImagesRef = useRef(null);
  const [totalContentWidth, setTotalContentWidth] = useState(0);

  useEffect(() => {
    // Function to calculate and set the scrollable width
    const calculateWidth = () => {
      if (horizontalImagesRef.current) {
        setTotalContentWidth(horizontalImagesRef.current.scrollWidth);
      }
    };

    // Calculate on initial mount
    calculateWidth();

    // Recalculate on window resize to handle orientation changes or browser resizing
    window.addEventListener("resize", calculateWidth);

    // Also recalculate after a short delay to ensure images have loaded and rendered
    const imageLoadTimeout = setTimeout(calculateWidth, 500);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", calculateWidth);
      clearTimeout(imageLoadTimeout);
    };
  }, [GALLERY_IMAGES]);

  const xTransform = useTransform(
    galleryScrollYProgress,
    [0, 1],
    // Ensure the transform value doesn't go positive
    [0, -Math.max(0, totalContentWidth - (typeof window !== 'undefined' ? window.innerWidth : 0))],
    { ease: easeInOut }
  );

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const ctaSectionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const ctaTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      className="bg-white font-sans min-h-screen pt-0 px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 1. Hero Section */}
      <section
        className="relative w-full py-20 px-4 sm:px-6 md:px-20 flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 min-h-[100vh] overflow-hidden bg-[#1A2A80]"
      >
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "linear-gradient(135deg, #1A2A80 0%, #3B38A0 50%, #1A2A80 100%)",
              "linear-gradient(135deg, #1A2A80 0%, #1A2A80 50%, #3B38A0 100%)",
              "linear-gradient(135deg, #3B38A0 0%, #1A2A80 50%, #1A2A80 100%)",
              "linear-gradient(135deg, #1A2A80 0%, #3B38A0 50%, #1A2A80 100%)",
            ],
          }}
          transition={{
            duration: 20,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
          style={{ backgroundSize: "400% 400%" }}
        />
        {/* Floating Shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full filter blur-2xl"
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20], rotate: [0, 180, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 40, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/10 rounded-xl filter blur-3xl"
          animate={{ x: [30, -30, 30], y: [30, -30, 30], rotate: [0, -180, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 50, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 5 }}
        />
        {/* Hero Content */}
        <motion.div
          className="relative z-10 w-full md:w-1/2 text-center md:text-left text-white"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="text-base sm:text-lg md:text-xl font-medium text-blue-200 mb-4 tracking-wide uppercase"
            variants={itemVariants}
          >
            Empowering Vision. Driving Impact.
          </motion.p>

          <motion.h1 className="font-black uppercase text-5xl sm:text-6xl md:text-[7rem] lg:text-[9rem] leading-[1.1]">
            {"MAKE YOUR MARK".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2 md:mr-3"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        {/* Right Block: Supporting Copy + CTA */}
        <motion.div
          className="relative z-10 w-full md:w-1/2 flex justify-center items-center"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center md:text-left space-y-8"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              className="text-white text-base text-justify md:text-lg leading-relaxed max-w-md mx-auto md:mx-0"
              variants={itemVariants}
            >
              Join North India’s one of the top outdoor advertising agencies,
              where your ideas create impactful campaigns. Grow your career in a
              dynamic, innovative environment that values creativity, passion,
              and growth.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex justify-center md:justify-start"
            >
              <MotionLink
                to="/JobPosition"
                className="mt-6 inline-flex items-center justify-center bg-white text-[#1A2A80] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out group"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                See job openings
                <span className="ml-3 text-2xl transition-transform group-hover:translate-x-2">
                  &rarr;
                </span>
              </MotionLink>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Life at Star Publicity Section */}
      <section className="bg-white py-16 px-4 sm:px-6 md:py-24 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-4xl text-center md:text-left md:text-5xl lg:text-6xl font-bold text-[#1A2A80] leading-tight">
              Life at Star Publicity
            </h2>
          </div>
          <div className="md:col-span-3">
            <div className="mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Our Culture
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                At Star Publicity, our culture thrives on collaboration,
                creativity, and a shared passion for impactful advertising. We
                foster an inclusive environment where every voice is heard, and
                innovative ideas are encouraged, leading to groundbreaking
                campaigns that resonate deeply with audiences.
              </p>
            </div>
            <div className="mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Talent Development
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                We invest deeply in our people through continuous learning
                programs, personalized mentorship opportunities, and engaging
                cross-functional project assignments. Our unwavering commitment
                to professional growth ensures that every team member can expand
                their skills, embrace new challenges, and advance their career
                trajectory seamlessly within the company.
              </p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Benefits
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Star Publicity offers a comprehensive and competitive benefits
                package meticulously designed to support our employees' holistic
                well-being and long-term financial security. This includes
                highly competitive salaries, robust health and wellness
                programs, generous paid time off, and invaluable opportunities
                for professional certifications and industry conferences,
                ensuring a rewarding career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Image Gallery Section */}
      <section ref={gallerySectionRef} className="py-16 sm:py-20 md:py-10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-12 text-center">
          <div className="relative inline-block">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A2A80] leading-tight mb-4">
              Glimpse Into Our World
            </h2>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-[#3B38A0] to-transparent" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 p-1 bg-white rounded-full">
              <div className="w-3 h-3 bg-[#1A2A80] rounded-full" />
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Scroll down to explore the daily life, collaboration, and culture
            that make Star Publicity a truly unique place to thrive.
          </p>
        </div>

        <div className="overflow-hidden relative z-10">
          <motion.div
            ref={horizontalImagesRef}
            className="flex space-x-4 md:space-x-6 px-4 sm:px-6 md:px-12 w-max"
            style={{ x: xTransform }}
          >
            {GALLERY_IMAGES.map((src, index) => (
              <motion.div
                key={index}
                className="h-[450px] md:h-[550px] w-[280px] md:w-[360px] flex-shrink-0 overflow-hidden rounded-lg relative flex items-center justify-center"
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <img
                  src={src}
                  alt={`Life at Star Publicity Image ${index + 1}`}
                  className={`w-full object-cover transition-transform duration-300 ${
                    index % 2 === 0 ? "h-full" : "h-[280px] md:h-[350px]"
                  }`}
                />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-2 text-gray-600 text-sm">
          <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ repeat: Infinity, repeatType: "mirror", duration: 1 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
          <span>Scroll Down to See More</span>
          <motion.div className="w-24 h-1 bg-gray-300 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#1A2A80]" style={{ scaleX: galleryScrollYProgress, originX: 0 }} />
          </motion.div>
        </div>
      </section>

      {/* 4. "We Are Star Publicity" Section */}
      <motion.section
        id="we-are-star-publicity"
        className="relative w-full min-h-screen py-20 px-4 sm:px-6 md:py-32 flex items-center justify-center overflow-hidden text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={ctaSectionVariants}
        style={{
          backgroundColor: "#1A2A80",
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Animated Orbs */}
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-80 h-80 bg-purple-400/20 rounded-full filter blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 5 }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto md:px-12 flex flex-col items-center text-center">
          <motion.div className="relative" variants={ctaTextVariants}>
            <div className="mb-4 h-1 w-20 bg-white rounded-full mx-auto" />
            <motion.h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              WE ARE <br />
              <span className="text-white/80 inline-block">STAR PUBLICITY</span>
            </motion.h2>
          </motion.div>
          <motion.p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl mx-auto" variants={ctaTextVariants}>
            At Star Publicity, we blend creativity with deep market insights
            to deliver innovative outdoor advertising solutions across North
            India. Our team fuels impactful campaigns where new ideas are
            appreciated, talents grow, and every contribution shapes the
            future of outdoor advertising.
          </motion.p>
          <MotionLink to="/contact" className="relative inline-flex items-center justify-center px-8 py-4 sm:px-10 font-bold rounded-full bg-white text-[#1A2A80] shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105" variants={ctaTextVariants}>
            Connect with us
            <span className="ml-3 text-2xl transition-transform group-hover:translate-x-2">&rarr;</span>
          </MotionLink>
        </div>

        <motion.div
          className="absolute bottom-[-100px] right-[-150px] md:bottom-[-200px] md:right-[-200px] lg:bottom-[-300px] lg:right-[-300px] opacity-10 md:opacity-20 z-0"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: [0.1, 0.2], scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            // CORRECTED: Using direct path string for src
            src="/assets/herobus.png"
            alt="Star Publicity Team or Concept"
            className="w-[500px] h-auto md:w-[800px] lg:w-[1200px] object-contain"
            style={{ filter: "grayscale(100%) brightness(50%)" }}
          />
        </motion.div>
      </motion.section>
    </motion.section>
  );
};

export default Career;