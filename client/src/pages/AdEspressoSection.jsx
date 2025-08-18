import React from "react";

// FeatureItem Component - Reusable for each feature card
const FeatureItem = ({ icon, title, description, delay }) => (
  <div
    className="group feature-item relative flex flex-col items-center text-center px-2 pt-8 pb-4 rounded-lg
                 bg-[#1A2A80] backdrop-filter backdrop-blur-sm border border-[#1A2A80]
                 transition-all duration-300 hover:shadow-xl hover:shadow-[#1A2A80]/40
                 transform hover:-translate-y-2 hover:bg-[#1A2A80]" // Subtle background and shadow on hover
    style={{ animationDelay: `${delay}s` }}
  >
    {/* Icon Wrapper: Blue border is maintained */}
    <div
      className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg
                   absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30
                   group-hover:scale-110 transition-transform duration-300
                   border-2 border-[#3B38A0] group-hover:border-[#7A85C1]"
    >
      {" "}
      {/* Border change on hover for emphasis */}
      {icon}{" "}
      {/* SVG icons now have subtle hover color change directly on them */}
    </div>
    <h3 className="text-white font-bold text-sm uppercase mt-4 group-hover:text-[#B2B0E8] transition-colors duration-300">
      {title}
    </h3>
    <p className="text-white text-xs sm:text-sm text-center max-w-[200px] mx-auto mt-1 group-hover:text-[#B2B0E8] transition-colors duration-300">
      {description}
    </p>
  </div>
);

const AdEspressoSection = () => {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#1A2A80] group-hover:text-[#B2B0E8] transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      title: "CREATE",
      description:
        "Easily create your advertising campaigns across multiple channels in minutes.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#1A2A80] group-hover:text-[#B2B0E8] transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.562.345 1.253.515 1.944.515z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "MANAGE",
      description: "Manage all your advertising campaigns in one place.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#1A2A80] group-hover:text-[#B2B0E8] transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 12l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
          />
        </svg>
      ),
      title: "ANALYZE",
      description: "Analyze your campaigns and get actionable insights.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#1A2A80] group-hover:text-[#B2B0E8] transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H9a2 2 0 00-2 2v1H5a2 2 0 00-2 2v11a2 2 0 002 2h2v-2h10v2z"
          />
        </svg>
      ),
      title: "COLLABORATE",
      description: "Collaborate effectively with your teams and clients.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#1A2A80] group-hover:text-[#B2B0E8] transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18s-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      title: "LEARN",
      description: "Grow your ads skills with the AdEspresso University.",
    },
  ];

  return (
    <section className="relative w-full flex flex-col justify-between bg-white font-sans overflow-hidden bottom-20">
      {/* Top Section: Hero-like content */}
      <div className="hero-content relative flex-grow flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 lg:py-32 z-10 shadow-2xl">
        {/* Astronaut Illustration REMOVED as per your request */}
        {/*
        <div className="hidden lg:block absolute bottom-[-20px] right-0 max-w-sm object-contain z-0 mr-12 astronaut-float">
          <img
            src="https://framerusercontent.com/images/33066914-cf4a-41d7-b43a-73d8a6efb9b4/astronaut-drinking-coffee.png"
            alt="Cartoon astronaut drinking coffee"
            aria-label="Astronaut illustration"
            className="w-full h-auto"
          />
        </div>
        */}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6 leading-tight animate-fade-in-up drop-shadow-md">
          Reach Your Ideal Audience
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-150">
          Engage your target audience where they live, work, and travel
          regularly. Additionally, our data-driven outdoor advertising
          strategies ensure that your brand message reaches your ideal
          customers.
        </p>
        {/* <button
          className="px-10 py-4 bg-green-500 text-white font-bold text-lg rounded-full shadow-xl
                      hover:bg-green-600 transition-all duration-300 transform hover:scale-105
                      active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300
                      animate-fade-in-up delay-300 hover:brightness-110 active:shadow-inner active:bg-green-700"
          aria-label="Start Your Free Trial Now!"
        >
          Start Your Free Trial Now!
        </button> */}
      </div>

      {/* Bottom Section: Features Grid */}
      <div className="w-full bg-[#1A2A80] relative z-20 mt-[-25] pt-0 pb-10 px-4 sm:px-8 border-t-4 border-[#1A2A80]">
        {" "}
        {/* Added border-t-4 border-blue-400 here */}
        <div
          className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5
                       gap-y-8 lg:gap-y-12 gap-x-6 justify-center items-start relative z-30"
        >
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.4 + index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Internal CSS for font, animations, and background effects */}
      <style jsx="true">{`
        /* Import Poppins from Google Fonts */
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap");

        /* Apply Poppins to the entire section */
        section {
          font-family: "Poppins", sans-serif;
        }

        /* Hero Section Background Overlay: Now completely plain, no patterns */
        .hero-content::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: none; /* Removed background patterns */
          z-index: -1;
        }

        /* Keyframe animations for fade-in effect */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Keyframe for staggered feature items */
        @keyframes fadeInUpFeature {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Astronaut floating animation REMOVED, as image is removed */
        /*
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        */

        /* Apply animations using utility classes */
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up.delay-150 {
          animation-delay: 0.15s;
        }

        .animate-fade-in-up.delay-300 {
          animation-delay: 0.3s;
        }

        /* Apply staggered animation to feature items */
        .feature-item {
          animation: fadeInUpFeature 0.8s ease-out forwards;
          opacity: 0;
        }

        /* Astronaut floating animation class REMOVED, as image is removed */
        /*
        .astronaut-float {
          animation: floating 3s ease-in-out infinite;
        }
        */

        /* Accessibility: Reduce motion for users who prefer it */
        @media (prefers-reduced-motion) {
          .animate-fade-in-up,
          .feature-item /*,
          .astronaut-float */ {
            /* Removed astronaut-float from here too */
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AdEspressoSection;