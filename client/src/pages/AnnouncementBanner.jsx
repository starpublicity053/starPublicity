import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { HiSparkles } from "react-icons/hi";

// Animation for a card sliding in from the bottom-left.
const cardVariants = {
  initial: { opacity: 0, y: 50, x: -50 },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.5 },
  },
  exit: {
    opacity: 0,
    y: 50,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const AnnouncementBanner = ({ onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          // PLACEMENT: Bottom-left corner.
          className="fixed bottom-5 left-5 z-50 w-full max-w-sm"
        >
          <div
            className="relative overflow-hidden rounded-xl border border-white/10 
                       bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-4">
              {/* ICON: Blue gradient and a matching blue glow. */}
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center 
                           rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 
                           shadow-lg shadow-blue-500/50"
              >
                <HiSparkles className="h-5 w-5 text-white" />
              </div>

              {/* TEXT: Original "Hot Off The Press!" content restored. */}
              <div className="flex-grow">
                <h3 className="font-bold text-base text-white">
                  Hot Off The Press!
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Dive into our new blog post on the future of transit ads.
                </p>
                <a
                  // --- CHANGE HERE ---
                  href="/resources/blogs" // The link has been updated.
                  // --- END CHANGE ---
                  className="mt-3 inline-block text-sm font-semibold text-cyan-300 
                             hover:text-cyan-200 transition-colors duration-200"
                >
                  Read more &rarr;
                </a>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 rounded-full p-1 text-slate-400 
                         hover:bg-white/10 hover:text-white transition-all"
              aria-label="Dismiss"
            >
              <AiOutlineClose className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;