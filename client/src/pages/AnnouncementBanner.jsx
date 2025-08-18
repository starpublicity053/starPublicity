import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { FaFire } from "react-icons/fa";

const bannerVariants = {
  initial: { opacity: 0, y: -30, scale: 0.95, filter: "blur(10px)" },
  animate: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0, y: -40, scale: 0.9, filter: "blur(6px)",
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const iconPulse = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
  },
};

const AnnouncementBanner = ({ onClose, onHeightChange }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true); // shows on reload

  // report height up whenever visible/size changes
  useEffect(() => {
    if (!ref.current) return;
    const report = () => onHeightChange?.(visible ? ref.current.offsetHeight : 0);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(ref.current);
    window.addEventListener("resize", report);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", report);
    };
  }, [visible, onHeightChange]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
    // height will be reported as 0 on next render by effect
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        variants={bannerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed top-1 left-4 right-4 z-[80] rounded-full bg-gradient-to-r from-[#1a2a80] to-blue-500 shadow-lg border border-white/30 text-white py-3 px-6 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <motion.div variants={iconPulse} animate="animate">
            <FaFire className="text-xl text-yellow-400" />
          </motion.div>
          <p className="text-sm sm:text-base font-medium">
            <span className="font-semibold mr-1">Hot Off The Press!</span>
            Dive into our{" "}
            <a
              href="/resources/blogs"
              className="text-yellow-200 hover:text-yellow-50 transition-colors duration-300 font-semibold"
            >
              latest blog post<span aria-hidden="true"> →</span>
            </a>
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className="text-white text-xl opacity-70 hover:opacity-100 transition-opacity duration-200"
          aria-label="Dismiss announcement"
        >
          <AiOutlineClose />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
