import React, { useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion"; // <-- Corrected line
import gsap from "gsap";
// --- Helper Components for Background Elements (for better readability) ---

// A subtle grid pattern for the background
const GridPattern = () => (
  <svg className="absolute inset-0 h-full w-full opacity-5 pointer-events-none" aria-hidden="true">
    <defs>
      <pattern id="grid-pattern-connect" width="40" height="40" x="50%" y="100%" patternUnits="userSpaceOnUse">
        <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern-connect)" strokeWidth="0" />
  </svg>
);

// Floating abstract "particles" for depth
const FloatingShapes = () => {
  const shapes = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: gsap.utils.random(8, 30),
      top: `${gsap.utils.random(0, 100)}%`,
      left: `${gsap.utils.random(0, 100)}%`,
      delay: gsap.utils.random(0, 2), // Stagger initial animation
      color: gsap.utils.random(["#7a85c1", "#3b38a0", "#1A2A80", "#c0c0c0"]), // Vary colors
      blur: gsap.utils.random(2, 6),
      opacity: gsap.utils.random(0.05, 0.2),
    }));
  }, []);

  useEffect(() => {
    gsap.to(".floating-shape", {
      y: (i) => (i % 2 === 0 ? -40 : 40), // Different float directions
      x: (i) => (i % 3 === 0 ? -20 : 20),
      rotation: (i) => (i % 4 === 0 ? 30 : -30),
      duration: (i) => gsap.utils.random(4, 8),
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      stagger: {
        each: 0.5,
        from: "random",
      },
      delay: (i) => shapes[i].delay,
    });
  }, [shapes]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {shapes.map(shape => (
        <div
          key={shape.id}
          className="floating-shape absolute rounded-full"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            top: shape.top,
            left: shape.left,
            backgroundColor: shape.color,
            filter: `blur(${shape.blur}px)`,
            opacity: shape.opacity,
          }}
        />
      ))}
    </div>
  );
};

// --- Main ConnectSection Component ---

const ConnectSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yContent = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacitySection = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const ctx = gsap.context(
      () => {
        gsap.to(".gradient-bg", {
          backgroundPosition: "200% 50%",
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      },
      sectionRef
    );

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className="relative flex items-center justify-center py-20 md:py-24 lg:py-28 overflow-hidden text-white bg-gray-950 rounded-xl mx-4 my-8"
      style={{ opacity: opacitySection }}
      aria-labelledby="connect-heading"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="gradient-bg absolute inset-0 transform scale-125 origin-center rounded-lg blur-2xl opacity-50" />
        <motion.div
            className="absolute -top-1/4 left-1/4 w-60 h-60 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10"
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
            className="absolute -bottom-1/4 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10"
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </div>

      <GridPattern />
      <FloatingShapes />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-4">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          style={{ y: yContent }}
        >
          <motion.h1
            id="connect-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            SETTING
            <span className="gradient-text block mt-1 md:mt-2"> STANDARDS</span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg lg:text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            We transform bold ideas into stunning realities with cutting-edge design and robust development. Partner with us to define the future of your brand online.
          </motion.p>

          <motion.a
            href="mailto:info@starpublicity.co.in"
            target="_blank"
            rel="noopener noreferrer"
            // --- MODIFIED CLASSES FOR BORDER COLOR ONLY ---
            className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg
                       bg-gradient-to-br from-purple-600 to-blue-500 /* Reverted background to original gradient */
                       border-2 border-[#1A2A80] /* Explicit border color */
                       hover:from-purple-700 hover:to-blue-600 /* Slightly darker gradient on hover */
                       focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300"
            // --- END MODIFIED CLASSES ---
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-lg font-bold text-gray-900 dark:text-black group-hover:text-black">
              Let's Grow Together
            </span>
          </motion.a>
        </motion.div>
      </div>

      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(
            135deg,
            #1A2A80,
            #1A2A80,
            #7a85c1,
            #3b38a0,
            #1A2A80
          );
          background-size: 200% 100%;
          animation: gradientBgShift 30s ease infinite alternate;
        }

        @keyframes gradientBgShift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        .gradient-text {
          background: linear-gradient(
            to right,
            #fff 20%,
            #c9d1fc 40%,
            #909ae6 60%,
            #6c74d3 80%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 6s linear infinite;
          display: inline-block;
        }

        @keyframes shine {
          to {
            background-position: -200% center;
          }
        }

        /* Reinstated/modified some button styles if needed, or rely solely on Tailwind */
        .glow-button {
          box-shadow: 0 0 20px rgba(122, 133, 193, 0.6); /* Kept a subtle initial glow */
          transition: all 0.4s ease; /* Smoother transitions */
          cursor: pointer;
        }

        /* Inner span for the main button text */
        /* Adjusted padding from the previous version, aligning with Tailwind's px-5 py-2.5 */
        .glow-button > span {
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2); /* Subtle inner shadow for depth */
        }

        /* Hover effect for the inner span */
        .glow-button:hover > span {
          box-shadow: none; /* Remove inner shadow on hover for a cleaner look */
        }


        @keyframes blob-move {
            0% { transform: scale(1) translate(0px, 0px); }
            33% { transform: scale(1.1) translate(20px, -30px); }
            66% { transform: scale(0.9) translate(-20px, 30px); }
            100% { transform: scale(1) translate(0px, 0px); }
        }
        .animate-blob {
            animation: blob-move 12s infinite ease-in-out;
        }


        /* Responsive Adjustments */
        @media (max-width: 1024px) {
            .text-5xl { font-size: 3rem; }
            .text-6xl { font-size: 3.5rem; }
            .text-7xl { font-size: 4.5rem; }
            .text-8xl { font-size: 5.5rem; }

            .glow-button > span {
                padding: 0.8rem 2.5rem;
                font-size: 1rem;
            }
            .text-base { font-size: 0.9rem; }
            .text-lg { font-size: 1rem; }
            .text-xl { font-size: 1.15rem; }
        }

        @media (max-width: 768px) {
            .py-20 { padding-top: 4rem; padding-bottom: 4rem; }
            .text-5xl { font-size: 2.5rem; }
            .text-6xl { font-size: 3rem; }
            .text-7xl { font-size: 3.8rem; }
            .text-8xl { font-size: 4.5rem; }

            .glow-button > span {
                padding: 0.7rem 2rem;
                font-size: 0.9rem;
            }
            .text-base { font-size: 0.85rem; }
            .text-lg { font-size: 0.95rem; }
            .mb-4 { margin-bottom: 0.75rem; }
            .mb-8 { margin-bottom: 1.5rem; }
            .mb-12 { margin-bottom: 2rem; }
        }

        @media (max-width: 640px) {
            .py-20 { padding-top: 3rem; padding-bottom: 3rem; }
            .text-5xl { font-size: 2rem; }
            .text-6xl { font-size: 2.5rem; }
            .text-7xl { font-size: 3.2rem; }
            .text-8xl { font-size: 4rem; }

            .glow-button > span {
                padding: 0.6rem 1.8rem;
                font-size: 0.85rem;
            }
            .text-base { font-size: 0.8rem; }
        }
      `}</style>
    </motion.section>
  );
};

export default ConnectSection;