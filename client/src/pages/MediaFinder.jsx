import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Link } from "react-router-dom"; // Import Link

const AdSpotSection = () => {
  return (
    <section
      className="flex flex-col lg:flex-row font-serif items-center justify-between
                         px-8 lg:px-24 py-20 lg:gap-x-20
                         bg-white overflow-hidden"
    >
      {/* Left Content */}
      <motion.div
        className="lg:w-1/2 z-10"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl lg:text-5xl font-black leading-tight text-black">
          LOCATE THE <span className="text-[#1A2A80]">PERFECT SPACES</span>{" "}
          {/* Changed text-blue-900 */}
          <br />
          For Your Brand
        </h1>
        <p className="mt-8 text-lg text-gray-700 max-w-lg">
          Explore our diverse products in high-traffic markets and beyond. Let’s
          find the perfect outdoor advertising solution that can reach your
          target audience and fulfill your business goals.
        </p>
        {/* Use Link component for navigation */}
        <Link to="/media">
          <button className="mt-10 bg-gradient-to-r from-[#3B38A0] to-[#1A2A80] text-white text-xl font-bold px-8 py-4 rounded-full hover:bg-[#1A2A80] transition">
            {" "}
            {/* Changed from-blue-700, to-blue-900, hover:bg-blue-800 */}
            Browse Media Finder
          </button>
        </Link>
      </motion.div>

      {/* Right Image with Advanced Tilt Effect */}
      <motion.div
        className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <Tilt
          glareEnable={true}
          glareMaxOpacity={0.25}
          glareColor="#ffffff"
          glarePosition="all"
          scale={1.05}
          transitionSpeed={1500}
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          className="w-[90%] md:w-[80%] lg:w-[70%]"
        >
          <img
            src="/assets/HomePageImages/media finder.png"
            alt="Ad Spot"
            className="rounded-2xl shadow-2xl"
          />
        </Tilt>
      </motion.div>
    </section>
  );
};

export default AdSpotSection;