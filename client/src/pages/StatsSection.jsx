import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const AnimatedCounter = ({ from = 0, to = 0, duration = 2 }) => {
  const [count, setCount] = useState(from);
  const ref = useRef();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / (duration * 1000), 1);
        const current = from + (to - from) * percentage;
        setCount(Math.floor(current));
        if (percentage < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(to);
        }
      };
      requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const StatsSection = () => {
  const stats = [
    {
      value: 5,
      suffix: "K",
      label: "Canvases",
      subLabel: "/ Explore Media",
      delay: 0,
    },
    {
      value: 14.1,
      suffix: "B",
      label: "Weekly Impressions",
      subLabel: "/ Find Your Audience",
      delay: 0.2,
    },
    {
      value: 65,
      suffix: "+",
      label: "Creatives",
      subLabel: "/ Creative Matters",
      delay: 0.4,
    },
  ];

  return (
    <section
      aria-labelledby="stats-heading"
      className="relative bg-white font-serif py-24 px-6 sm:px-10 lg:px-24 overflow-hidden"
    >
      <h2 id="stats-heading" className="sr-only">
        Key Statistics
      </h2>

      {/* Background map/pattern image */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="/map_pattern.png"
          alt="Background Map"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Stats content */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-x-20 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0, rotateX: -20 }}
            whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: stat.delay, duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-7xl md:text-8xl font-extrabold text-[#1A2A80] leading-none">
              {" "}
              {/* Changed text-zz */}
              <AnimatedCounter from={0} to={stat.value} duration={2} />
              {stat.suffix}
            </h2>
            <p className="text-xl font-semibold text-gray-700 mt-4">
              {stat.label}
            </p>
            <p className="text-lg font-bold italic text-black tracking-wide mt-2">
              {stat.subLabel}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;