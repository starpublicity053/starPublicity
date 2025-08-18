// import React, { useRef, useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import SplitType from 'split-type';
// import backgroundImageURL from "../../../dist/images/BG_image.png";
// import busImageUrl from "../../../dist/images/BUS_Hero.png";
// // import unipoleImageUrl from "../../../dist/images/Unipole_Hero.png";

// gsap.registerPlugin(ScrollTrigger);

// const HeroSection = () => {
//   const heroSectionRef = useRef(null);
//   const textRef = useRef(null);
//   const buttonRef = useRef(null);
//   const busRef = useRef(null);
//   const unipoleRef = useRef(null);
//   const particlesRef = useRef(null);

//   // Particle animation setup
//   useEffect(() => {
//     const animateParticle = (particle) => {
//       // Random initial position
//       const x = Math.random() * window.innerWidth;
//       const y = Math.random() * window.innerHeight;

//       // Random animation properties
//       const duration = 15 + Math.random() * 15;
//       const scale = 0.5 + Math.random() * 1;

//       gsap.set(particle, {
//         x,
//         y,
//         scale,
//         opacity: 0,
//       });

//       gsap.to(particle, {
//         duration: duration,
//         x: x + (Math.random() - 0.5) * 200,
//         y: y - 200,
//         opacity: 0.8,
//         scale: scale * 1.2,
//         repeat: -1,
//         ease: "none",
//         yoyo: true,
//       });
//     };

//     const createParticles = () => {
//       const particles = particlesRef.current;
//       if (!particles) return;

//       // Clear existing particles
//       particles.innerHTML = "";

//       // Create new particles
//       for (let i = 0; i < 50; i++) {
//         const particle = document.createElement("div");
//         particle.className = "particle";
//         particles.appendChild(particle);
//         animateParticle(particle);
//       }
//     };

//     createParticles();

//     // Cleanup function
//     return () => {
//       const particles = particlesRef.current;
//       if (particles) {
//         gsap.killTweensOf(particles.children);
//       }
//     };
//   }, []);

//   useGSAP(() => {
//     // Text animation with better splitting and timing
//     const titleText = new SplitType('.main-title', {
//       types: 'chars,words',
//       tagName: 'span'
//     });

//     const subtitleText = new SplitType('.subtitle', {
//       types: 'lines,words',
//       tagName: 'span'
//     });

//     // Create timeline for smoother sequence
//     const tl = gsap.timeline();

//     tl.from(titleText.chars, {
//       opacity: 0,
//       y: 100,
//       rotateX: -90,
//       stagger: 0.02,
//       duration: 1,
//       ease: "back.out(1.7)",
//     })
//     .from(subtitleText.words, {
//       opacity: 0,
//       y: 20,
//       stagger: 0.05,
//       duration: 0.8,
//       ease: "power2.out"
//     }, "-=0.5")
//     .from(buttonRef.current, {
//       scale: 0,
//       opacity: 0,
//       duration: 0.5,
//       ease: "elastic.out(1, 0.5)"
//     }, "-=0.3");

//     // Initial position for bus image (off-screen left)
//     gsap.set(busRef.current, {
//       x: '-100vw',
//     });

//     // Entrance animation for bus - slower and smoother
//     gsap.to(busRef.current, {
//       x: 0,
//       duration: 3.5, // Increased from 2.5 to 3.5 for slower movement
//       ease: "power1.out", // Changed to power1.out for smoother deceleration
//       delay: 1 // Slight delay after text animations
//     });

//     // Scroll parallax for bus
//     gsap.to(busRef.current, {
//       y: -50,
//       scrollTrigger: {
//         trigger: heroSectionRef.current,
//         start: "top top",
//         end: "bottom top",
//         scrub: 1,
//       },
//     });

//     gsap.to(unipoleRef.current, {
//       y: -100,
//       scrollTrigger: {
//         trigger: heroSectionRef.current,
//         start: "top top",
//         end: "bottom top",
//         scrub: 2,
//       },
//     });
//   }, { scope: heroSectionRef });

//   return (
//     <section ref={heroSectionRef} className="hero-section">
//       <div className="particles" ref={particlesRef}></div>
//       <div className="gradient-overlay"></div>

//       <div className="content-wrapper">
//         <div className="text-content" ref={textRef}>
//           <h1 className="main-title">
//             Transform Your <span className="highlight">Brand</span>
//             <br />
//             Through Outdoor Media
//           </h1>
//           <p className="subtitle">
//             Elevate your presence with strategic placements and innovative displays
//           </p>
//           <button ref={buttonRef} className="cta-button">
//             <span className="button-text">Explore Solutions</span>
//             <span className="button-icon">→</span>
//           </button>
//         </div>

//         <div className="image-container">
//           <img
//             ref={busRef}
//             src={busImageUrl}
//             alt="Bus advertising"
//             className="bus-image"
//           />
//           {/* <img
//             ref={unipoleRef}
//             src={unipoleImageUrl}
//             alt="Unipole display"
//             className="unipole-image"
//           /> */}
//         </div>
//       </div>

//       <style jsx>{`
//         .hero-section {
//           min-height: 100vh;
//           background-image: url(${backgroundImageURL});
//           background-size: cover;
//           background-position: center;
//           background-repeat: no-repeat;
//           position: relative;
//           overflow: hidden;
//         }

//         .particles {
//           position: absolute;
//           width: 100%;
//           height: 100%;
//           z-index: 1;
//         }

//         .particle {
//           position: absolute;
//           width: 9px;
//           height: 7px;
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 50%;
//         }

//         .gradient-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: radial-gradient(
//             circle at top center,
//             rgba(61, 78, 129, 0.1) 0%, // Reduced opacity
//             rgba(26, 42, 128, 0.05) 100% // Reduced opacity
//           );
//           z-index: 2;
//         }

//         .content-wrapper {
//           position: relative;
//           z-index: 5; // Increased z-index
//           max-width: 1440px;
//           margin: 0 auto;
//           padding: 120px 24px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 48px;
//           align-items: center;
//         }

//         .text-content {
//           color: white;
//           text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//           position: relative;
//           z-index: 6;
//           padding-left: 4rem; // Added left padding
//           max-width: 90%; // Control text width
//         }

//         .main-title {
//           font-size: clamp(2.5rem, 5vw, 4.5rem);
//           color: white;
//           font-weight: 800;
//           line-height: 1.2;
//           margin-bottom: 24px;
//           font-family: 'Montserrat', sans-serif; // Changed font
//           position: relative;
//           z-index: 6;
//           letter-spacing: -0.02em; // Added letter spacing
//         }

//         .highlight {
//         color: #1A2A80;
//           background: linear-gradient(120deg, #3b38a0, #7a85c1);
//           -webkit-background-clip: text;
//            position: relative;
//         }

//         .subtitle {
//           font-size: clamp(1rem, 2vw, 1.25rem);
//           color: #cbd5e1;
//           margin-bottom: 40px;
//           line-height: 1.6;
//           opacity: 0.9;
//           position: relative;
//           z-index: 6;
//           font-family: 'Inter', sans-serif; // Added different font for subtitle
//           font-weight: 400; // Added font weight
//         }

//         .cta-button {
//           background: linear-gradient(90deg, #3b38a0, #5d4bb7);
//           border: none;
//           padding: 16px 32px;
//           border-radius: 12px;
//           color: white;
//           font-weight: 600;
//           font-size: 1.125rem;
//           cursor: pointer;
//           transition: transform 0.3s ease;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           box-shadow: 0 4px 15px rgba(59, 56, 160, 0.3);
//         }

//         .cta-button:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(59, 56, 160, 0.4);
//         }

//         .button-icon {
//           transition: transform 0.3s ease;
//         }

//         .cta-button:hover .button-icon {
//           transform: translateX(4px);
//         }

//         .image-container {
//           position: relative;
//           height: 100%;
//           min-height: 450px; // Increased from 500px to give more space for the lower bus
//         }

//         .bus-image {
//           position: absolute;
//           width: 110%;
//           right: -5%;
//           bottom: -17%; // Adjusted to move bus lower
//           z-index: 2;
//           will-change: transform;
//           transform-origin: center center;
//         }

//         .unipole-image {
//           position: absolute;
//           width: 70%; // Reduced from 80%
//           right: 15%; // Adjusted from 10%
//           top: -5%;  // Adjusted from -10%
//           z-index: 1;
//         }

//         @media (max-width: 1024px) {
//           .content-wrapper {
//             grid-template-columns: 1fr;
//             text-align: center;
//             padding: 80px 24px;
//           }

//           .image-container {
//             order: -1;
//             margin-bottom: 40px;
//             min-height: 400px; // Adjusted for mobile
//           }

//           .bus-image,
//           .unipole-image {
//             position: relative;
//             width: 90%; // Adjusted for better mobile display
//             margin: 0 auto;
//             right: auto;
//             top: auto;
//             bottom: auto;
//           }

//           .text-content {
//             padding-left: 0; // Remove padding on mobile
//             text-align: center;
//             max-width: 100%;
//             margin: 0 auto;
//           }
//         }

//         .main-title span,
//         .subtitle span {
//           display: inline-block;
//           will-change: transform;
//         }

//         .subtitle span {
//           display: inline-block;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default HeroSection;

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// CORRECTED: Removed incorrect image imports.
// We will use direct path strings below.

// The StatCard component is well-built and needs no changes.
const StatCard = ({ value, label, className = "" }) => (
  <div
    className={`bg-slate-900/40 backdrop-blur-sm border border-blue-400/30 rounded-2xl shadow-lg p-4 text-center w-full sm:w-auto flex-1 sm:flex-initial ${className}`}
  >
    <p className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
      {value}
    </p>
    <p className="text-xs md:text-sm font-light text-slate-300 uppercase tracking-widest">
      {label}
    </p>
  </div>
);

// Data for the mobile-view cards
const mobileStatsData = [
  { value: "24/7", label: "Visibility" },
  { value: "2437", label: "Pan-North India" },
  { value: "10,000+", label: "Hoardings" },
];

const HeroSection = () => {
  const heroSectionRef = useRef(null);
  const mobileCardsRef = useRef([]);

  // GSAP animations are already well-implemented and untouched.
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(".animated-text", {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        delay: 0.2,
      });

      let mm = gsap.matchMedia(heroSectionRef);

      mm.add("(min-width: 768px)", () => {
        tl.from(
          ".desktop-stat-card",
          { opacity: 0, scale: 0.5, stagger: 0.15 },
          "<0.5"
        );
        gsap.to(".float-1", {
          y: -15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 3,
        });
        gsap.to(".float-2", {
          y: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 2.5,
        });
        gsap.to(".float-3", {
          y: -10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 4,
        });
        gsap.to(".float-4", {
          y: 12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 3.2,
        });
      });

      mm.add("(max-width: 767px)", () => {
        tl.from(
          mobileCardsRef.current,
          { opacity: 0, y: 20, stagger: 0.15, delay: 0.5 },
          "<"
        );
      });

      gsap.to(".subtle-particle", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        scale: "random(0.8, 1.2)",
        opacity: "random(0.4, 0.7)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: "random(20, 30)",
        stagger: { each: 1, from: "random" },
      });
      gsap.to(".background-glow", {
        scale: 1.15,
        opacity: 0.45,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 6,
      });
    },
    { scope: heroSectionRef }
  );

  return (
    // By using min-h-screen and padding, the section adapts better than using a fixed vh unit.
    <section
      ref={heroSectionRef}
      className="relative min-h-[109vh] w-full flex items-center font-sans text-white overflow-hidden py-24 sm:py-32"
      style={{
        // CORRECTED: Using direct path string for backgroundImage
        backgroundImage: `url("/assets/Hero_section.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background elements remain unchanged */}
      <div className="background-glow absolute top-0 left-auto -translate-x-1/2 w-[80vw] h-[80vh] bg-blue-500/30 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {" "}
        {/* Particles... */}
      </div>

      {/* The main container now uses gap for consistent spacing */}
      <div className="relative max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between z-10 p-4 sm:p-6 lg:p-8 gap-16">
        {/* Text container: Removed aggressive negative margins for more stable alignment */}
        <div className="text-center md:text-left md:w-1/2 lg:w-3/5 z-10">
          <h1 className="animated-text text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight tracking-tight">
            Launch Your Brand On The Move.
          </h1>
          <p className="animated-text mt-6 text-base sm:text-lg text-white max-w-xl mx-auto md:mx-0">
            From iconic billboards to dynamic digital displays on transport, we
            provide the canvas for your brand's story. Precision, visibility,
            and unparalleled reach.
          </p>
          <div className="animated-text mt-8">
            <button className="px-10 py-4 bg-[#1A2A80] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
              Explore Services
            </button>
          </div>
        </div>

        {/* --- MAJOR IMPROVEMENT AREA --- */}
        {/* This container now handles both mobile and desktop layouts for the image and stats */}
        <div className="w-full md:w-1/2 lg:w-2/5">
          {/* DESKTOP: Image and cards are grouped. The cards are positioned relative to the image, not a fixed container. */}
          <div className="hidden md:block relative">
            <img
              // CORRECTED: Using direct path string for src
              src="/assets/hero__image.png"
              alt="Bus with digital advertising"
              className="w-full h-auto"
            />
            <StatCard
              value="24/7"
              label="Visibility"
              className="desktop-stat-card float-1 absolute top-[-15%] left-[5%] -translate-x-1/2"
            />
            <StatCard
              value="2 Million+"
              label="Monthly Impressions"
              className="desktop-stat-card float-2 absolute top-[-15%] right-[5%] translate-x-1/2"
            />
            <StatCard
              value="4.6x Boost+"
              label="in Client ROI"
              className="desktop-stat-card float-3 absolute bottom-[-18%] right-[-5%] translate-x-1/2"
            />
            <StatCard
              value="Up To 5.8%"
              label="Industry Growth"
              className="desktop-stat-card float-4 absolute bottom-[-18%] left-[-5%] -translate-x-1/2"
            />
          </div>

          {/* MOBILE: A simple, unbreakable vertical layout. Image is on top, cards are stacked below. */}
          <div className="block md:hidden">
            <img
              // CORRECTED: Using direct path string for src
              src="/assets/hero__image.png"
              alt="Bus with digital advertising"
              className="w-full h-auto px-8"
            />
            {/* Switched to a single-column flex layout for maximum compatibility on small screens. */}
            <div className="flex flex-col gap-4 mt-8 px-4">
              {mobileStatsData.map((stat, index) => (
                <StatCard
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  ref={(el) => (mobileCardsRef.current[index] = el)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        /* The custom CSS remains unchanged */
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Inter:wght@300;400;600&display=swap");
        .font-sans {
          font-family: "Inter", sans-serif;
        }
        h1 {
          font-family: "Outfit", sans-serif;
        }
        .subtle-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, #b9d8ff 0%, #ffffff 100%);
          box-shadow: 0 0 5px #b9d8ff, 0 0 10px #ffffff;
          filter: blur(1px);
          opacity: 0.5;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;