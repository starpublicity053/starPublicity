import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ResearchAndInsights() {
  const [activeTab, setActiveTab] = useState("planning");
  const [tabRect, setTabRect] = useState(null);
  const tabRefs = useRef({});
  const navRef = useRef(null);

  const tabs = {
    planning: {
      label: "Planning",
      image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=600&q=80",
      title: (
        <>
          ANALYTICS-BASED <br /> INSIGHTS
        </>
      ),
      text: (
        <>
          Our outdoor advertising services assist customers in developing
          comprehensive advertising strategies. By understanding target areas,
          choosing strategic locations, and crafting compelling messages,
          clients can maximize the effectiveness of their outdoor advertising
          campaigns.
        </>
      ),
    },
    research: {
      label: "Advanced Research",
      image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=600&q=80",
      title: (
        <>
          MARKET <br /> RESEARCH
        </>
      ),
      text: (
        <>
          Our outdoor advertising serves as a wide resource for industry
          professionals to enhance brand visibility. It presents detailed
          analyses of consumer insights, current market trends, and rising
          advertising technologies, enabling advertisers to achieve greater
          success in outdoor advertising initiatives.
        </>
      ),
    },
    attribution: {
      label: "Attribution Approach",
      image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=600&q=80",
      title: (
        <>
          MEASURING <br /> OUTCOMES
        </>
      ),
      text: (
        <>
          We describe our strategy for assessing the success of outdoor
          advertising campaigns. This includes examining consumer engagement and
          the relationship between outdoor advertisements and increased brand
          recognition.
        </>
      ),
    },
  };

  useEffect(() => {
    if (activeTab && tabRefs.current[activeTab] && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const activeTabRect = tabRefs.current[activeTab].getBoundingClientRect();
      setTabRect({
        left: activeTabRect.left - navRect.left,
        width: activeTabRect.width,
      });
    }
  }, [activeTab]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-8 py-24 flex flex-col items-center font-serif max-w-7xl mx-auto mt-9 relative overflow-hidden">
      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center text-6xl md:text-7xl font-extrabold uppercase tracking-tight mb-16 max-w-5xl mx-auto leading-tight text-blue-900"
        style={{ letterSpacing: "0.05em" }}
      >
        Research and Insight
        <span className="block w-36 h-2 bg-blue-600 mx-auto mt-5 rounded-full shadow-lg shadow-blue-500/50"></span>
      </motion.h1>

      {/* Hero Section - Clean Image with Blue Overlay and Content */}
      <div className="relative w-full h-[550px] md:h-[650px] mb-24 overflow-hidden rounded-xl shadow-xl z-10">
        <img
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&h=600&q=80" // Confirm this path is correct for your project's public folder
          alt="Research and Insight"
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
        />
        {/* Blue Gradient Overlay for Text Clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-transparent"></div>

        {/* Hero Content Box */}
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="max-w-3xl p-10 rounded-lg text-white" // No background for text card, relies on overlay
          >
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white drop-shadow-md">
              Transforming Brands with Data-Driven Insight
            </h2>
            <p className="text-base md:text-xl leading-relaxed text-blue-100 drop-shadow-sm">
              Discover the power of analytics and creativity in outdoor
              advertising. We utilize prime locations and innovative designs to
              amplify your brand’s reach.
              <br />
              <br />
              With cutting-edge technology and deep market research, we craft
              campaigns that not only capture attention but drive engagement.
              Let us help you convert visibility into measurable success and
              lasting brand value.
            </p>
          </motion.div>
        </div>
      </div>

{/* Tabs Navigation - BOLD & STRUCTURED */}
      <nav
        ref={navRef}
        className="relative flex justify-center gap-6 md:gap-10 mb-20 flex-wrap bg-white p-4 rounded-lg shadow-lg z-10 border-b-2 border-blue-200"
      >
        {Object.keys(tabs).map((key) => (
          <button
            key={key}
            ref={(el) => (tabRefs.current[key] = el)}
            onClick={() => setActiveTab(key)}
            className={`relative z-10 text-base md:text-lg font-medium py-3 px-8 rounded-md transition-colors duration-300 whitespace-nowrap
              ${
                activeTab === key
                  ? "text-white bg-blue-700 shadow-md shadow-blue-600/30"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
          >
            {tabs[key].label}
          </button>
        ))}
        {tabRect && (
          <motion.span
            className="absolute bottom-0 h-1 bg-blue-700 rounded-full" // Solid blue indicator line
            initial={false}
            animate={{
              left: tabRect.left,
              width: tabRect.width,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}
      </nav>

      {/* Content Display Area - BOLD & STRUCTURED */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-6xl w-full p-12 rounded-xl shadow-2xl bg-white z-10 border border-blue-200"
          // Clearer lift and blue-tinted shadow on hover
          whileHover={{ 
            y: -5, 
            borderColor: 'rgb(37, 99, 235)', // Tailwind blue-600
            borderWidth: '2px', 
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' // Tailwind blue-500 with opacity
          }}
           
        >
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text Content */}
            <div className="md:order-1 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold uppercase mb-6 leading-tight text-blue-900 tracking-wide">
                {tabs[activeTab].title}
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">
                {tabs[activeTab].text}
              </p>
            </div>

            {/* Image for each tab */}
            <motion.div
              key={`img-${activeTab}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 md:mt-0 rounded-lg overflow-hidden shadow-lg border border-blue-300 transition-all duration-300 hover:scale-103 hover:shadow-xl"
            >
              <img
                src={tabs[activeTab].image}
                alt={tabs[activeTab].label}
                className="w-full h-72 md:h-96 object-cover object-center"
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default ResearchAndInsights;
