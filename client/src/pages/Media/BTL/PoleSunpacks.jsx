import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion"; // Imported for the new CTA section

const PoleSunpacks = () => {
  const refs = [
    useRef(null), // Hero section container
    useRef(null), // What We Offer section container
    useRef(null), // Our Bespoke Process section container
    useRef(null), // Case Study section container
  ];

  const [visible, setVisible] = useState(Array(refs.length).fill(false));
  const [showFeaturedDetails, setShowFeaturedDetails] = useState(false); // State for featured case study details
  const [highlightedCardId, setHighlightedCardId] = useState(null); // New state for temporary card highlight

  useEffect(() => {
    // Observer for general section visibility
    const sectionObservers = refs.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          } else {
            setVisible((prev) => {
              const updated = [...prev];
              updated[index] = false;
              return updated;
            });
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }
      return observer;
    });

    return () => {
      sectionObservers.forEach((observer) => observer.disconnect());
    };
  }, [refs]);

  // Function to toggle details for the featured case study
  const handleDiscoverMoreClick = () => {
    setShowFeaturedDetails((prev) => !prev);
  };

  // Function for 'View Project' buttons - now logs to console and highlights the card
  const handleViewProjectClick = (studyId, title, category) => {
    console.log(`View Project clicked for: ${title}, Category: ${category}`);

    // Set the ID of the clicked card to highlight it
    setHighlightedCardId(studyId);

    // Remove the highlight after a short delay
    setTimeout(() => {
      setHighlightedCardId(null);
    }, 700); // Highlight for 0.7 seconds

    // In a real application, this would typically open a dedicated project page,
    // a modal with more details, or fetch dynamic content.
  };

  // Data for the "Our Approach" / Process Flow
  const processSteps = [
    {
      title: "Location Scouting ",
      description:
        "The whole process starts with identifying high-traffic poles in market areas, intersections, and community hubs.",
      // Placeholder for a dynamic icon/SVG
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19V6l12-3v13m-6 0V9.333M9 19l-4 2v-8.111m0 0l.93-.699M9 19v-8.111m0 0C6.852 11.239 5 13.931 5 17c0 2.209 2.115 4 4.727 4H19m-7 0a6 6 0 006-6v-6.333m-14 0V9.333m0 0a2 2 0 100-4h2m0 0a2 2 0 110-4h2m0 0a2 2 0 100-4h2m0 0V3m6 0a2 2 0 110-4h2m0 0a2 2 0 100-4h2m0 0a2 2 0 110-4h2M12 10a4 4 0 100-8 4 4 0 000 8z"
          />
        </svg>
      ),
    },
    {
      title: "Creative Production ",
      description:
        "Then, handed over to the designing team for the creation of vibrant, legible sunpack panels optimized for vertical layouts.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM13 3v5a1 1 0 001 1h5M11 15H9m4 0H9m4 0l-2-2m-2 2l-2-2M7 11h10"
          />
        </svg>
      ),
    },
    {
      title: "Professional Installation ",
      description:
        "We install your campaign securely and mount weather-resistant sunpack boards to poles, ensuring stability and placement across all selected areas.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6h.01M10 12h.01M10 18h.01M14 6h.01M14 12h.01M14 18h.01M18 6h.01M18 12h.01M18 18h.01M6 6h.01M6 12h.01M6 18h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      title: "Monitoring & Maintenance ",
      description:
        "Later, we start monitoring your campaign’s audits to confirm campaign health and visibility..",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 6l3 1m0 0l-3 18a.75 .75 0 00.97.97L18 18l3 1m-3-1l-6-5V3l2 2 2-2 2 2V3m0 6h.01M11 13h.01M16 16h.01M19 12h.01M6 6v.01M3 9h.01M12 21V6"
          />
        </svg>
      ),
    },
  ];

  // Mock data for Case Studies with unique IDs for highlighting
  const caseStudies = [
    {
      id: "tech-solutions", // Added unique ID
      title: "Visionary Tech Solutions",
      category: "Innovation & Tech",
      tagline:
        "Propelling futuristic tech into the urban spotlight with dynamic visuals.",
      description:
        "A successful campaign for a tech startup, achieving 40% user engagement increase and significant brand recognition.",
      fullDetails: `
        <p class="mb-3">This campaign for "TechPulse Innovations" achieved remarkable results:</p>
        <ul class="list-disc list-inside space-y-1 text-sm mb-4">
          <li><strong>40% surge in website traffic.</strong></li>
          <li><strong>25% increase in app downloads.</strong></li>
          <li>Strategic bus wraps on 20 key city routes.</li>
          <li>Interactive digital screens inside buses.</li>
          <li>Targeted business districts and tech parks.</li>
        </ul>
        <p class="text-sm">A testament to integrated physical and digital urban advertising.</p>
      `,
      image:
        "https://www.arbeitstipps.de/wp-content/uploads/2019/01/atl-btl-marketing.jpg",
    },
    {
      id: "urban-connectivity", // Added unique ID
      title: "Metropolitan Connectivity",
      category: "Urban Infrastructure",
      tagline:
        "Connecting communities through enhanced transit and strategic urban planning.",
      image:
        "https://www.arbeitstipps.de/wp-content/uploads/2019/01/atl-btl-marketing.jpg",
    },
    {
      id: "data-marketing", // Added unique ID
      title: "Data-Driven Marketing",
      category: "Analytics & AI",
      tagline:
        "Leveraging insights to craft campaigns that speak directly to the audience.",
      image:
        "https://www.arbeitstipps.de/wp-content/uploads/2019/01/atl-btl-marketing.jpg",
    },
    {
      id: "green-initiatives", // Added unique ID
      title: "Green City Initiatives",
      category: "Sustainability & Environment",
      tagline:
        "Inspiring eco-consciousness and promoting sustainable urban living solutions.",
      image:
        "https://www.arbeitstipps.de/wp-content/uploads/2019/01/atl-btl-marketing.jpg",
    },
    {
      id: "cultural-arts", // Added unique ID
      title: "Cultural Arts Amplification",
      category: "Arts & Community",
      tagline:
        "Bringing vibrant cultural events and artistic expressions to every corner of the city.",
      image:
        "https://www.arbeitstipps.de/wp-content/uploads/2019/01/atl-btl-marketing.jpg",
    },
    {
      id: "brand-evolution", // Added unique ID
      title: "Brand Identity Evolution",
      category: "Creative Strategy",
      tagline:
        "Sculpting unique brand identities that leave a lasting imprint on the urban landscape.",
      image:
        "https://www.arbeitstipps.de/wp-content/uploads/2019/01/atl-btl-marketing.jpg",
    },
  ];

  return (
    <>
      {/* Custom Styles & Keyframes */}
      <style>{`
        /* General Fade-In Effect */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-in.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Hero text animations for the new design */
        .hero-title-animation {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
            transition: opacity 1.5s ease-out, transform 1.5s ease-out;
        }
        .hero-title-animation.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .hero-subtitle-animation {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1.5s ease-out 0.5s, transform 1.5s ease-out 0.5s;
        }
        .hero-subtitle-animation.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .hero-button-animation {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1.5s ease-out 0.8s, transform 1.5s ease-out 0.8s;
        }
        .hero-button-animation.is-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Case Study Card Hover Effect */
        .case-study-grid-card .overlay {
          opacity: 0;
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
          transform: translateY(20px);
        }

        .case-study-grid-card:hover .overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .case-study-grid-card img {
          transition: transform 0.4s ease-in-out;
        }

        .case-study-grid-card:hover img {
          transform: scale(1.05);
        }

        /* New: Highlight class for clicked cards */
        .case-study-grid-card.highlight {
            border-color: #3b82f6; /* blue-500 */
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.7); /* Blue glow */
            transform: scale(1.02);
            transition: all 0.2s ease-out;
        }


        /* Process Step Card Hover Effect */
        .process-feature-card {
            transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, background-color 0.3s ease-out;
        }
        .process-feature-card:hover {
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            background-color: #1f293a; /* Slightly lighter on hover */
        }
        .process-feature-card .icon-wrapper {
            transition: transform 0.3s ease-out, background-color 0.3s ease-out;
        }
        .process-feature-card:hover .icon-wrapper {
            transform: rotate(5deg) scale(1.1);
            background-color: #3b82f6; /* blue-500 */
        }

        /* Animation for detail content */
        .details-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        .details-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .details-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .details-exit-active {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }

        /* STYLES MOVED FROM ATL.JSX FOR CTA SECTION */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite cubic-bezier(0.6, 0.2, 0.2, 0.8); }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* NEW Hero Section (Third Iteration) - Textured & Industrial Art */}
      <div
        ref={refs[0]}
        className={`relative w-full min-h-screen flex items-center justify-center p-8 md:p-16 bg-gray-900 text-white overflow-hidden`}
        style={{ transitionDelay: "0s" }}
      >
        {/* Textured Background with strong overlay */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/BTL marketing images/Pole Sunpacks/bg image.png')`, // Dark concrete texture
            filter: "brightness(0.5) contrast(1.1) grayscale(0.2)", // Darker, a bit desaturated, industrial feel
            transform: "scale(1.03)",
          }}
        >
          {/* Subtle gradient overlay to enhance depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-transparent to-gray-900/40 opacity-70"></div>
          {/* Optional: Add a subtle abstract pattern overlay for more texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('https://www.transparenttextures.com/patterns/black-linen.png')`,
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-6xl mx-auto py-20">
          <h1
            className={`text-6xl md:text-8xl lg:text-9xl font-serif font-extrabold leading-tight mb-4
                        text-white text-shadow-xl ${
                          visible[0] ? "hero-title-animation is-visible" : ""
                        }`}
            style={{
              textShadow: "4px 4px 15px rgba(0,0,0,0.7)",
              lineHeight: "0.9",
            }}
          >
            Radiant  
            <br />
            <span
              className={`block mt-4 text-5xl md:text-7xl lg:text-8xl text-blue-400 ${
                // Changed color for contrast
                visible[0] ? "hero-title-animation is-visible" : ""
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              Route Branding
            </span>
          </h1>
          <p
            className={`text-lg md:text-xl text-gray-300 tracking-wide leading-relaxed max-w-3xl mt-10
                        ${
                          visible[0] ? "hero-subtitle-animation is-visible" : ""
                        }`}
          >
           Let’s witness the power of vibrant sunpack panels mounted on poles where your brand shines day and night along with impactful local presence.
          </p>
          {/* <button
            className={`mt-12 px-10 py-4 text-xl font-bold rounded-full
                        bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-xl
                        hover:from-blue-600 hover:to-blue-800 transition duration-500 ease-in-out
                        transform hover:scale-105 ${
                          visible[0] ? "hero-button-animation is-visible" : ""
                        }`}
          >
            Launch Your Vision
          </button> */}
        </div>
      </div>

      {/* "What We Offer" / Benefits Section - Visual Vignettes with Asymmetric Layouts (Blue Accents) */}
      <div
        ref={refs[1]}
        className={`w-full py-24 px-6 md:px-16 bg-gray-50 text-gray-800 overflow-hidden ${
          visible[1] ? "is-visible" : "fade-in"
        }`}
        style={{ transitionDelay: "0s" }}
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight text-gray-900">
           Where Durability Meets Dazzle
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
           With Pole Sunpack advertising, every pole, every street can be a center stage for your brand.
          </p>
        </div>

        <div className="flex flex-col gap-16 max-w-7xl mx-auto">
          {/* Benefit 1: Full Canvas Branding */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch bg-white rounded-3xl shadow-xl overflow-hidden group">
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px] overflow-hidden">
              <img
                src="/assets/BTL marketing images/Pole Sunpacks/weatherproof.png" // Huge billboard in a bustling city
                alt="Full wrap advertisement on public transport"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
               Weatherproof Visuals
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                One of the most liked features of Sunpack pole ads is maintaining crisp, vibrant colors that don’t fade under any outdoor weather conditions.
              </p>
            </div>
          </div>

          {/* Benefit 2: Dynamic Interior Engagement */}
          <div className="flex flex-col md:flex-row-reverse items-center md:items-stretch bg-white rounded-3xl shadow-xl overflow-hidden group">
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px] overflow-hidden">
              <img
                src="/assets/BTL marketing images/Pole Sunpacks/strategically.png" // Digital advertising screen with abstract content
                alt="Digital screens inside public transport"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Strategically Positioned Panels
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
               Pole Sunpacks are mainly mounted on streetlights and electricity poles in premium locations like urban, commercial, and residential zones.
              </p>
            </div>
          </div>

          {/* Benefit 3: Strategic Route Optimization */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch bg-white rounded-3xl shadow-xl overflow-hidden group">
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px] overflow-hidden">
              <img
                src="/assets/BTL marketing images/Pole Sunpacks/day night.png" // Top-down view of complex road network
                alt="Map with highlighted routes and data"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Day-to-Night Visibility
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
               One of the popular and trending OOH media formats which are placed with semi-rigid surface paired with backlit options to command attention even after dark.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* THIRD SECTION: "Our Approach" / Process Flow Section - Grid Card Layout */}
      <div
        ref={refs[2]}
        className={`w-full bg-gray-950 py-24 px-6 md:px-16 text-white overflow-hidden ${
          visible[2] ? "is-visible" : "fade-in"
        }`}
        style={{ transitionDelay: "0s" }}
      >
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight text-[#1A2A80]">
Our Seamless Campaign Flow          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
From planning to pole, let’s understand the four smooth stages for more reach and engagement.          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="process-feature-card bg-[#1A2A80] rounded-xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-700"
            >
              <div className="icon-wrapper w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-6 shadow-lg transform transition-all duration-300 ease-in-out">
                {step.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold text-sky-300 mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="text-base text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOURTH SECTION: Case Study/Portfolio Section - Hero + Grid Layout */}
     
      
      {/* Call to Action Section - MOVED FROM ATL.JSX */}
      <section className="relative py-24 px-6 sm:px-12 bg-[#1A2A80] text-white text-center overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-8 text-white drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.5 }} >
            <span className="block text-blue-100 text-3xl font-semibold mb-2">Ready for a Change?</span> Transform Your Brand's Reach with Us!
          </motion.h2>
          <motion.p className="text-xl md:text-2xl font-light opacity-95 mb-12 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true, amount: 0.5 }} >
            Let's discuss how our BTL marketing expertise can create{" "} <span className="font-semibold text-white">unmissable impact</span> for your business.
          </motion.p>
          <motion.a 
            href="tel:+918839728739" 
            className="relative inline-flex items-center justify-center overflow-hidden bg-white text-[#1A2A80] font-extrabold text-xl py-5 px-12 rounded-full shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 hover:bg-blue-100 group" 
            initial={{ opacity: 0, scale: 0.8 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.4 }} 
            viewport={{ once: true, amount: 0.5 }} 
          >
            <span className="relative z-10">Get a Free Consultation</span>
            <svg className="ml-4 w-6 h-6 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg>
            <span className="absolute inset-0 w-full h-full bg-blue-500 opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0"></span>
          </motion.a>
        </div>
      </section>
    </>
  );
};

export default PoleSunpacks;