import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; // Assuming lucide-react is installed

// Framer Motion Variants for this section
const slideInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.1,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.2,
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const staggeredFadeInUp = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger delay for children
    },
  },
};

const LatestBlogsSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-800 text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideInUp}
        >
          DISCOVER THE LATEST BLOG <br className="hidden md:inline" /> AND ARTICLES
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Main Blog Post - Enhanced hover and content structure */}
          <motion.div
            className="lg:w-3/5 bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300 ease-in-out"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            {/* THIS '<a>' TAG MAKES THE *ENTIRE* CARD CLICKABLE */}
            <a href="/resources/blogs" className="block">
              <div className="relative overflow-hidden">
                <img
                  src="https://image.pollinations.ai/prompt/industrial%20environmental%20responsibility%20case%20study"
                  alt="Industrial workers discussing environmental responsibility"
                  className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-4 left-4 bg-[#3B38A0] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {" "}
                  {/* Changed bg-blue-600 */}
                  NEWS
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#3B38A0] transition-colors duration-300">
                  {" "}
                  {/* Changed group-hover:text-blue-600 */}
                  ENVIRONMENTAL RESPONSIBILITY IN INDUSTRY: CASE STUDIES
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  By John Doe - September 11, 2023
                </p>
                <p className="text-gray-700 text-base leading-relaxed line-clamp-3">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                </p>
                {/* THIS '<a>' TAG FOR "READ MORE" IS ALSO PRESENT AND POINTS TO THE SAME PAGE */}
                <a
                  href="/resources/blogs"
                  className="mt-4 text-[#3B38A0] font-semibold flex items-center group-hover:underline" // Changed text-blue-600
                >
                  READ MORE
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </a>
          </motion.div>

          {/* Right Column: Smaller Article Snippets - Staggered animations */}
          <motion.div
            className="lg:w-2/5 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggeredFadeInUp} // Apply staggeredFadeInUp to the container
          >
            {/* Article Snippet 1 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between group hover:shadow-xl transition-shadow duration-300 ease-in-out"
              variants={slideInRight} // Each child uses slideInRight
            >
              {/* THIS '<a>' TAG MAKES THE *ENTIRE* CARD CLICKABLE */}
              <a href="/resources/blogs" className="block">
                <div className="relative overflow-hidden rounded-md mb-4">
                  <img
                    src="https://image.pollinations.ai/prompt/manufacturing%20innovation%20breakthroughs"
                    alt="Innovation in manufacturing"
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#3B38A0] transition-colors duration-300">
                    {" "}
                    {/* Changed group-hover:text-blue-600 */}
                    INNOVATION SPOTLIGHT: BREAKTHROUGHS IN MANUFACTURING
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    By Jane Smith - October 01, 2023
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cum sociis natoque penatibus et magnis dis parturient montes.
                  </p>
                </div>
                {/* THIS '<a>' TAG FOR "READ MORE" IS ALSO PRESENT AND POINTS TO THE SAME PAGE */}
                <a
                  href="/resources/blogs"
                  className="mt-4 text-[#3B38A0] font-semibold flex items-center group-hover:underline" // Changed text-blue-600
                >
                  READ MORE
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </a>
            </motion.div>

            {/* Article Snippet 2 */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between group hover:shadow-xl transition-shadow duration-300 ease-in-out"
              variants={slideInRight} // Each child uses slideInRight
            >
              {/* THIS '<a>' TAG MAKES THE *ENTIRE* CARD CLICKABLE */}
              <a href="/resources/blogs" className="block">
                <div className="relative overflow-hidden rounded-md mb-4">
                  <img
                    src="https://image.pollinations.ai/prompt/quality%20control%20inspection%20in%20factory"
                    alt="Quality control inspection"
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#3B38A0] transition-colors duration-300">
                    {" "}
                    {/* Changed group-hover:text-blue-600 */}
                    QUALITY CONTROL IN MANUFACTURING: BEST PRACTICES
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    By Alex Johnson - September 25, 2023
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cum sociis natoque penatibus et...
                  </p>
                </div>
                {/* THIS '<a>' TAG FOR "READ MORE" IS ALSO PRESENT AND POINTS TO THE SAME PAGE */}
                <a
                  href="/resources/blogs"
                  className="mt-4 text-[#3B38A0] font-semibold flex items-center group-hover:underline" // Changed text-blue-600
                >
                  READ MORE
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;