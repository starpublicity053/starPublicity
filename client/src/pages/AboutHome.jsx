import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// CORRECTED: The local image imports have been removed.

function App() {
  const [activeTab, setActiveTab] = useState("who");

  const tabs = {
    who: {
      label: "Who we are?",
      // CORRECTED: Using a direct path string
      thumbnailImage: "/assets/HomePageImages/abouthome1.png",
      infoBoxHeading: "Created For You",
      infoBoxText1: (
        <>
          We are one of <strong className="font-bold">North India’s</strong>{" "}
          most innovative outdoor advertising agencies, delivering high-impact
          outdoor ad solutions for your brand.
        </>
      ),
      infoBoxText2: (
        <>
          From initial strategy{" "}
          <strong className="font-bold">to final execution,</strong>
          our team
          <strong className="font-bold"> always guides you</strong> and
          collaborates with you at every step, ensuring your outdoor campaign
          fits perfectly with your vision, business goals, and changing market
          trends.
        </>
      ),
      ctaLinkText: "Talk to one of us",
    },
    solutions: {
      label: "AUDIENCE",
      // CORRECTED: Using a direct path string
      thumbnailImage: "/assets/HomePageImages/abouthome2.png",
      infoBoxHeading: "Know Your Crowd",
      infoBoxText1: (
        <>
          We are <strong className="font-bold">extremely understand</strong>{" "}
          your target audience to create campaigns that truly engage and
          connect.
        </>
      ),
      infoBoxText2: (
        <>
          Firstly, we analyze local demographics, consumer behaviors, and market
          trends to upscale your brand message in the right places at the right
          time, improving consumer impact and attracting measurable, handsome
          results.
        </>
      ),
      ctaLinkText: "Explore our services",
    },
    tools: {
      label: "CREATIVITY",
      // CORRECTED: Using a direct path string
      thumbnailImage: "/assets/HomePageImages/abouthome3.png",
      infoBoxHeading: "Ideas That Spark",
      infoBoxText1: (
        <>
          Our <strong className="font-bold">creative</strong> approach turns
          outdoor ad spaces into unforgettable brand experiences.
        </>
      ),
      infoBoxText2: (
        <>
          By combining innovative concepts with cutting-edge
          technology and the latest design, Star Publicity creates OOH ads that
          stand out in the market, ensuring your brand is noticed, discussed,
          and remembered.
        </>
      ),
      ctaLinkText: "Discover our tech",
    },
  };

  const currentTab = tabs[activeTab];

  return (
    <section className="relative w-full overflow-hidden bg-white font-inter pb-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left Column */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#1A2A80] mb-6">
            <span>Your Outdoor </span>
            <span className="italic text-[#1A2A80]">marketing,</span>
            <br />
            <span className="text-gray-900">
              unified, optimized, efficient.
            </span>
          </h1>

          {/* Tabs */}
          <div className="relative flex flex-wrap gap-3 mb-10">
            {Object.keys(tabs).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300
                  ${
                    activeTab === tabKey
                      ? "bg-[#1A2A80] text-white"
                      : "bg-[#B2B0E8] text-[#1A2A80] hover:bg-[#7A85C1]"
                  }
                `}
              >
                {tabs[tabKey].label}
              </button>
            ))}
          </div>

          {/* Info Box with Image at Bottom */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="bg-[#1A2A80] text-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-[#1A2A80] w-full flex flex-col gap-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                    {currentTab.infoBoxHeading}
                  </h2>
                  <p className="text-[#B2B0E8] text-base leading-relaxed mb-2">
                    {currentTab.infoBoxText1}
                  </p>
                  <p className="text-[#B2B0E8] text-base leading-relaxed">
                    {currentTab.infoBoxText2}
                  </p>
                </div>

                <motion.a
                  href="/contact"
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center bg-[#7A85C1] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3B38A0] transition-colors shadow-md w-max"
                >
                  {currentTab.ctaLinkText}
                  <span className="ml-2">→</span>
                </motion.a>

                <div className="w-full h-[240px] rounded-xl overflow-hidden mt-4 group">
                  <motion.img
                    src={currentTab.thumbnailImage}
                    alt="Tab"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
          {/* Static Phone Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-[600px] rounded-xl overflow-hidden shadow-xl mb-10"
          >
            <img
              // CORRECTED: Using a direct path string
              src="/assets/HomePageImages/hero section.png"
              alt="Phone Screen"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Stats Section */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {/* Box 1 */}
            <div className="bg-white p-6 h-[300px] flex flex-col justify-between rounded-xl shadow-md border border-[#B2B0E8]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌍</span>
                <h4 className="text-[#3B38A0] text-sm font-semibold uppercase tracking-wide">
                  Market Coverage
                </h4>
              </div>
              <div>
                <h3 className="text-[#1A2A80] text-5xl font-extrabold mb-2">
                  150+
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  North Indian Cities Connecting brands with diverse urban and regional audiences.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-6 h-[300px] flex flex-col justify-between rounded-xl shadow-md border border-[#B2B0E8]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎓</span>
                <h4 className="text-[#1A2A80] text-sm font-semibold uppercase tracking-wide">
                  Community Projects
                </h4>
              </div>
              <div>
                <h3 className="text-[#1A2A80] text-5xl font-extrabold mb-2">
                  100+
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Initiatives led Fostering local growth and positive change throughout North India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;