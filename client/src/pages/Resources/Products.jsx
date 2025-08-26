import React, { useRef } from "react";
import {
  Star,
  Plug,
  Cog,
  Factory,
  ArrowRight,
  Search,
  Lightbulb,
  Hammer,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const Products = () => {
  // Create a ref for the CTA section to track its scroll position
  const ctaSectionRef = useRef(null);

  // Scroll animations for Hero section background
  const { scrollYProgress: heroScrollProgress } = useScroll();
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 1.1]); // Zoom out effect
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.3], [1, 0.5]); // Fade out effect

  // Scroll animations for Call to Action background
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaSectionRef, // Use the ref to target the section
    offset: ["start end", "end start"],
  });
  const ctaScale = useTransform(ctaScrollProgress, [0, 1], [1, 1.1]); // Zoom out effect
  const ctaOpacity = useTransform(ctaScrollProgress, [0.2, 0.8], [1, 0.5]); // Fade out effect

  // Animation variants for reusability
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const slideInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggeredFadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.2, // Delay children animation
      },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen text-white overflow-hidden"
        aria-label="High-end Industrial Manufacturing Company Hero Section"
      >
        {/* Background Image Layer with Parallax/Zoom effect */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/ProductionpageImages/bg.png')",
            scale: heroScale,
            opacity: heroOpacity,
            zIndex: 0,
          }}
        ></motion.div>

        {/* Overlay Layer */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.70)",
            zIndex: 10,
          }}
        ></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full px-6 md:px-12 max-w-7xl mx-auto py-10">
          <motion.div
            className="max-w-2xl text-center lg:text-left lg:w-3/5 mb-10 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={staggeredFadeInUp}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold leading-tight uppercase font-sans drop-shadow-lg"
              variants={slideInUp}
            >
              ADVANCE <span className="text-1A2A80">MANUFACTURING</span>{" "}
              EXCELLENCE
            </motion.h1>
            <motion.p
              className="mt-6 text-gray-100 text-base md:text-lg max-w-xl mx-auto lg:mx-0 drop-shadow-md"
              variants={slideInUp}
            >
              Equipped with advanced technology and skilled professionals, our
              manufacturing unit is dedicated to delivering top-quality
              products. From raw materials to final output, we maintain proper
              quality controls to ensure every element meets the highest
              standards. This dedication to precision and excellence enables us
              to support innovative outdoor ad solutions that stand out in the
              market.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              variants={slideInUp}
            >
              <button className="bg-[#1A2A80] hover:bg-[#1A2A80] text-white px-8 py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1A2A80] focus:ring-opacity-75">
                CONTACT US
              </button>
              <button className="border-2 border-white hover:border-[#1A2A80] hover:bg-white hover:text-[#1A2A80] px-8 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75">
                LEARN MORE
              </button>
            </motion.div>
          </motion.div>

          {/* This is the card in the top section that needs the border-radius adjustment */}
          <motion.div
            className="hidden lg:block absolute bottom-0 right-10 w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-t-xl shadow-md overflow-hidden" /* Changed rounded-xl to rounded-t-xl */
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          >
            <div className="p-4">
              <img
                src="/assets/ProductionpageImages/review card.png"
                alt="Industrial Team"
                className="object-cover w-full h-64 rounded-md mb-4"
              />
              <div className="text-white">
                <p className="text-sm font-semibold">5K+ Clients — 4.8 Stars</p>
                <div className="flex items-center mt-3">
                  <div className="flex -space-x-2">
                    <img
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      src="https://randomuser.me/api/portraits/men/10.jpg"
                      alt="Client Avatar 1"
                    />
                    <img
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      src="https://randomuser.me/api/portraits/women/20.jpg"
                      alt="Client Avatar 2"
                    />
                    <img
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      src="https://randomuser.me/api/portraits/men/30.jpg"
                      alt="Client Avatar 3"
                    />
                    <img
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      src="https://randomuser.me/api/portraits/women/40.jpg"
                      alt="Client Avatar 4"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-200">
                    Based on 5,798 Reviews
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section: Three Feature Cards */}
      <section className="bg-gray-50 py-16 px-6">
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-[-4rem]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggeredFadeInUp}
        >
          {/* Card 1: Renewable Energy */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
            variants={slideInUp}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              QUALITY CONTROL
            </h3>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              We ensure every product undergoes strict quality inspections at
              every step of manufacturing. Our dedication to high standards
              guarantees reliable and durable outputs that meet client
              expectations consistently.
            </p>
            <div className="flex justify-between items-end mt-auto w-full">
              <div className="w-16 h-16 bg-[#1A2A80] rounded-lg flex items-center justify-center">
                <Plug className="w-8 h-8 text-white" />
              </div>
              <a
                href="#"
                className="text-[#1A2A80] font-semibold flex items-center group"
              >
                LEARN MORE{" "}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Latest Technology */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
            variants={slideInUp}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              FLEXIBLE PRODUCTION
            </h3>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              Our manufacturing unit swiftly adapts to changing demands and
              project needs. This flexibility in the process allows us to handle
              a wide range of products and volumes efficiently, ensuring timely
              delivery without compromising quality.
            </p>
            <div className="flex justify-between items-end mt-auto w-full">
              <div className="w-16 h-16 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                <Cog className="w-8 h-8 text-gray-600" />
              </div>
              <a
                href="#"
                className="text-[#1A2A80] font-semibold flex items-center group"
              >
                LEARN MORE{" "}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Card 3: Industry Solution */}
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
            variants={slideInUp}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              FAST DELIVERY
            </h3>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              We prioritize quick reversal times through pre-planned processes
              and efficient workflows. Our goal is to deliver your demands
              quickly, ensuring your brand stays ahead in fast-paced markets.
            </p>
            <div className="flex justify-between items-end mt-auto w-full">
              <div className="w-16 h-16 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                <Factory className="w-8 h-8 text-gray-600" />
              </div>
              <a
                href="#"
                className="mt-auto text-[#1A2A80] font-semibold flex items-center group"
              >
                LEARN MORE{" "}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section: About Us */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Left Column: About Us Text and Button */}
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            <p className="text-[#1A2A80] text-sm font-semibold uppercase mb-4">
              ABOUT US
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-800 mb-6">
              Fueling Productivity with Industry Expertise
            </h2>
            <button className="bg-[#1A2A80] hover:bg-[#1A2A80] text-white px-8 py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1A2A80] focus:ring-opacity-75">
              READ MORE
            </button>
          </motion.div>

          {/* Right Column: Manufacturing Description and Image */}
          <motion.div
            className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 uppercase">
              Our manufacturing is centered on a commitment to excellence, where
              innovation meets quality control.
              <br />
              Each stage of production is well-optimized to ensure accuracy,
              durability, and timely delivery for our valued clients.
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Every step should be well researched, so, our team firstly does a
              deep research about the industry and then starts the process with
              full dedication that always fuels every step of our production
              process. By combining skilled craftsmanship with productive
              practices, we consistently deliver outstanding outcomes for our
              clients. This strategy ensures that every project not only meets
              but exceeds expectations, prioritizing the new standards of
              quality and productivity in the industry.
            </p>
            {/* <img
              src="https://image.pollinations.ai/prompt/industrial%20workers%20in%20modern%20factory"
              alt="Industrial workers in a facility"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            /> */}
          </motion.div>
        </div>
      </section>

      {/* Section: Our Services - Dynamic 3D Flip Card Grid */}
      <style jsx>{`
        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 320px; /* Fixed height for consistency */
          perspective: 1000px; /* Establishes 3D space */
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d; /* Crucial for 3D flip */
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden; /* Hide the back of the element when facing away */
          border-radius: 0.75rem; /* Equivalent to Tailwind's rounded-xl */
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Equivalent to Tailwind's shadow-xl */
        }

        .flip-card-front {
          background-color: #334155; /* slate-700 */
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .flip-card-front img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .flip-card-front .content-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0) 50%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          z-index: 2;
          color: white;
        }

        .flip-card-front h3 {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          margin-bottom: 0.5rem;
        }

        .flip-card-back {
          background-color: #1a2a80; /* blue-600 */
          color: white;
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem;
          text-align: left;
        }
        .flip-card-back h3 {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          margin-bottom: 1rem;
        }
        .flip-card-back p {
          font-size: 1rem; /* text-base */
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
      `}</style>
      <section className="bg-gray-100 py-16 px-6 text-gray-800">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.p
            className="text-[#1A2A80] text-sm font-semibold uppercase mb-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            OUR SERVICES
          </motion.p>
          <motion.h2
            className="text-3xl md:text-5xl font-extrabold leading-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={slideInUp}
          >
            DISCOVER OUR EXPERTISE: <br className="hidden md:inline" /> FLIP TO
            LEARN MORE
          </motion.h2>
        </div>

        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggeredFadeInUp}
        >
          {/* Service Card 1: Robotics & AI */}
          <motion.div className="flip-card" variants={slideInUp}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={
                    "/assets/ProductionpageImages/robotics & ai.png"
                  }
                  alt="Robotics & AI"
                />
                <div className="content-overlay">
                  <h3>Robotics & AI</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>Robotics & AI</h3>
                <p>
                  We are going with advanced automation to simplify production
                  and deliver consistent, high-quality results.
                </p>
                {/* <a
                  href="#"
                  className="text-white font-semibold flex items-center group hover:underline"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a> */}
              </div>
            </div>
          </motion.div>

          {/* Service Card 2: Expert Engineering */}
          <motion.div className="flip-card" variants={slideInUp}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={
                    "/assets/ProductionpageImages/expert engineering.png"
                  }
                  alt="Expert Engineering"
                />
                <div className="content-overlay">
                  <h3>Expert Engineering</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>Expert Engineering</h3>
                <p>
                  Our experienced engineers ensure every project is constructed
                  with safety, precision, and reliability in mind.
                </p>
                {/* <a
                  href="#"
                  className="text-white font-semibold flex items-center group hover:underline"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a> */}
              </div>
            </div>
          </motion.div>

          {/* Service Card 3: Precision Manufacturing */}
          <motion.div className="flip-card" variants={slideInUp}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={
                    "/assets/ProductionpageImages/precision manufacturing.png"
                  }
                  alt="Precision Manufacturing"
                />
                <div className="content-overlay">
                  <h3>Precision Manufacturing</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>Precision Manufacturing</h3>
                <p>
                  We produce each advertising solution with thorough attention
                  and a commitment to excellence.
                </p>
                {/* <a
                  href="#"
                  className="text-white font-semibold flex items-center group hover:underline"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a> */}
              </div>
            </div>
          </motion.div>

          {/* Service Card 4: Sustainable Solutions */}
          <motion.div className="flip-card" variants={slideInUp}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={
                    "/assets/ProductionpageImages/sustainable solutions.png"
                  }
                  alt="Sustainable Solutions"
                />
                <div className="content-overlay">
                  <h3>Sustainable Solutions</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>Sustainable Solutions</h3>
                <p>
                  We utilize eco-friendly processes to ensure that your outdoor
                  campaigns have a positive impact.
                </p>
                {/* <a
                  href="#"
                  className="text-white font-semibold flex items-center group hover:underline"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a> */}
              </div>
            </div>
          </motion.div>

          {/* Service Card 5: Advanced Machinery */}
          <motion.div className="flip-card" variants={slideInUp}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={
                    "/assets/ProductionpageImages/advanced machinery.png"
                  }
                  alt="Advanced Machinery"
                />
                <div className="content-overlay">
                  <h3>Advanced Machinery</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>Advanced Machinery</h3>
                <p>
                  Our advanced equipment provides precision and efficiency,
                  creating visually striking displays.
                </p>
                {/* <a
                  href="#"
                  className="text-white font-semibold flex items-center group hover:underline"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a> */}
              </div>
            </div>
          </motion.div>

          {/* Service Card 6: Quality Assurance */}
          <motion.div className="flip-card" variants={slideInUp}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img
                  src={
                    "/assets/ProductionpageImages/Quality Assurance.png"
                  }
                  alt="Quality Assurance"
                />
                <div className="content-overlay">
                  <h3>Quality Assurance</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>Quality Assurance</h3>
                <p>
                  Deep inspections and testing guarantee that every product
                  meets the highest standards for durability and safety.
                </p>
                {/* <a
                  href="#"
                  className="text-white font-semibold flex items-center group hover:underline"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a> */}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* NEW SECTION: How We Work */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column: Image with animation */}
          <motion.div
            className="lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            <img
              src="/assets/ProductionpageImages/3-tier process.png"
              alt="Industrial workers collaborating in a modern factory"
              className="w-full h-auto object-cover rounded-lg shadow-xl"
            />
          </motion.div>

          {/* Right Column: Process Steps with animation */}
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggeredFadeInUp}
          >
            <motion.p
              className="text-gray-500 text-sm font-semibold uppercase mb-2"
              variants={fadeIn}
            >
              OUR PROCESS
            </motion.p>
            <motion.h2
              className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-800 mb-10"
              variants={slideInUp}
            >
              Our Three-Tier Process{" "}
            </motion.h2>

            <div className="space-y-8">
              {/* Process Step 1: Exploration */}
              <motion.div
                className="flex items-start gap-4"
                variants={slideInUp}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#1A2A80] rounded-lg flex items-center justify-center shadow-md">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    CONCEPT & DESIGN
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    We start by understanding your brand goals and creating
                    eye-catching outdoor designs that stand out
                  </p>
                </div>
              </motion.div>

              {/* Process Step 2: Development */}
              <motion.div
                className="flex items-start gap-4"
                variants={slideInUp}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#1A2A80] rounded-lg flex items-center justify-center shadow-md">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    PRODUCTION & QUALITY
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Our in-house team utilizes high-quality materials and strict
                    quality control for durable, vibrant results.
                  </p>
                </div>
              </motion.div>

              {/* Process Step 3: Production */}
              <motion.div
                className="flex items-start gap-4"
                variants={slideInUp}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#1A2A80] rounded-lg flex items-center justify-center shadow-md">
                  <Hammer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    INSTALLATION & IMPACT
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    We always ensure seamless installation at prime locations
                    for effective brand connection and maximum reach.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: Let's Talk About Project! */}
      <section
        id="cta-section" // Added ID for scroll tracking
        ref={ctaSectionRef} // Attach the ref here
        className="relative py-20 md:py-32 flex flex-col items-center justify-center text-white overflow-hidden"
      >
        <motion.div // This div will handle the background image with scroll effects
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://image.pollinations.ai/prompt/dark%20industrial%20factory%20interior%20wide%20angle%20overhead%20lighting')",
            scale: ctaScale,
            opacity: ctaOpacity,
            zIndex: 0,
          }}
        />
        <div // This div handles the solid color overlay
          className="absolute inset-0 bg-black"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.70)",
            zIndex: 10,
          }}
        />
        <motion.div
          className="relative z-20 max-w-4xl mx-auto text-center px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggeredFadeInUp}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 uppercase drop-shadow-lg"
            variants={slideInUp}
          >
            Let’s Talk About Your Next Project!
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md"
            variants={slideInUp}
          >
            Ready to bring your outdoor advertising vision to life? Connect with
            us today.{" "}
          </motion.p>
          <motion.button
            className="bg-[#1A2A80] hover:bg-[#1A2A80] text-white px-10 py-4 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1A2A80] focus:ring-opacity-75" // Changed from red-600/red-700
            variants={slideInUp}
          >
            CONTACT US
          </motion.button>
        </motion.div>
      </section>
    </>
  );
};

export default Products;
