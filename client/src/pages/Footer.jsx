import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Icons
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

// ===================================================================
// 1. DATA CONSTANTS
// ===================================================================

const CONTACT_DETAILS = [
  { icon: FaEnvelope, text: "info@starpublicity.co.in", href: "mailto:info@starpublicity.co.in" },
  { icon: FaPhone, text: "0161-4668602", href: "tel:01614668602" },
  { icon: FaMapMarkerAlt, text: "SCO-137, Feroze Gandhi market, Ludhiana, Punjab, 141001", href: null },
];

const FOOTER_LINKS = {
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Career", path: "/career" },
  ],
  Services: [
    { name: "ATL Marketing", path: "/media/ATL" },
    { name: "BTL Marketing", path: "/media/BTL" },
    { name: "TTL Marketing", path: "/media/TTL" },
  ],
  Resources: [
    { name: "Blogs", path: "/resources/blogs" },
    { name: "Media Finder", path: "/media-finder" },
    { name: "Job Positions", path: "/JobPosition" },
    { name: "Production", path: "/resources/products" },
  ],
};

const SOCIAL_LINKS = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/shivam-kumar-0b17342a8/", icon: FaLinkedinIn },
    { name: "Instagram", href: "https://www.instagram.com/starpublicityldh/", icon: FaInstagram },
    { name: "YouTube", href: "https://www.youtube.com/@StarPublicity", icon: FaYoutube },
    { name: "X", href: "https://x.com/starpublicityld", icon: FaXTwitter },
];

// ===================================================================
// 2. HELPER LOGIC / CUSTOM HOOK
// ===================================================================
const useMousePositionEffect = (ref) => {
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        ref.current.style.setProperty("--mouse-x", `${x}px`);
        ref.current.style.setProperty("--mouse-y", `${y}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ref]);
};

// ===================================================================
// 3. INTERNAL SUB-COMPONENTS
// ===================================================================

const ShapeDivider = () => {
  const [pathD1, setPathD1] = useState("");
  const [pathD2, setPathD2] = useState("");

  useEffect(() => {
    let animationFrameId;
    let t = 0;

    // More detailed config for a richer, more organic wave
    const waveConfig = {
      one: {
        yOffset: 45,
        amplitude: 25,
        speed: 0.02,
        // Each wave is a sum of multiple sine waves for complexity
        sines: [
          { frequency: 2.5, amplitude: 0.6 },
          { frequency: 1.0, amplitude: 0.3 },
          { frequency: 0.5, amplitude: 0.1 },
        ],
      },
      two: {
        yOffset: 60,
        amplitude: 20,
        speed: 0.025,
        sines: [
          { frequency: 2.0, amplitude: 0.7 },
          { frequency: 1.5, amplitude: 0.2 },
          { frequency: 0.8, amplitude: 0.1 },
        ],
      },
    };

    const generateWavePath = (time, config) => {
      const width = 1440;
      const segments = 15; // Fewer segments needed for smooth curves
      const points = [];

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        
        let y = 0;
        // Sum of sines for a more natural, complex wave form
        config.sines.forEach((sine, index) => {
          const phase = (Math.PI / 2) * index;
          y += Math.sin(time + (i / segments) * sine.frequency + phase) * sine.amplitude;
        });
        
        // Normalize y to be between -1 and 1 before applying main amplitude
        const totalSineAmplitude = config.sines.reduce((acc, s) => acc + s.amplitude, 0);
        y = (y / totalSineAmplitude) * config.amplitude;

        points.push({ x, y: config.yOffset + y });
      }

      // Create a smooth path using cubic Bezier curves instead of straight lines
      let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        d += ` C ${midX.toFixed(2)},${p1.y.toFixed(2)} ${midX.toFixed(2)},${p2.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
      }
      
      d += ` L ${width} 120 L 0 120 Z`;
      return d;
    };

    const animate = () => {
      t += 1; // Base time increment

      setPathD1(generateWavePath(t * waveConfig.one.speed, waveConfig.one));
      setPathD2(generateWavePath(t * waveConfig.two.speed + 1.5, waveConfig.two));

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full z-10">
      <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="footer-top-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2a80" />
            <stop offset="100%" stopColor="#0b0f19" />
          </linearGradient>
        </defs>
        <path d={pathD1} fill="url(#footer-top-gradient)" className="opacity-40" />
        <path d={pathD2} fill="url(#footer-top-gradient)" className="opacity-60" />
      </svg>
    </div>
  );
};

const LinkColumn = ({ title, links }) => (
  <div>
    <h4 className="font-semibold text-white mb-4">{title}</h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link to={link.path} className="text-white/70 hover:text-white transition-colors">{link.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLinks = () => (
    <div className="flex space-x-5">
    {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
      <a key={name} href={href} aria-label={`Follow us on ${name}`} target="_blank" rel="noopener noreferrer"
         className="text-white/60 transition-all duration-300 hover:text-white hover:scale-125">
        <Icon size={20} />
      </a>
    ))}
  </div>
);

// ===================================================================
// 4. MAIN FOOTER COMPONENT
// ===================================================================
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  useMousePositionEffect(footerRef);

  return (
    <footer className="bg-[#0b0f19] text-white relative">
      <ShapeDivider />
      <div
        ref={footerRef}
        className="relative overflow-hidden pt-32 pb-12 px-6"
        style={{ background: `radial-gradient(600px circle at var(--mouse-x, 800px) var(--mouse-y, 300px), rgba(255, 255, 255, 0.05), transparent 80%)` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center z-20 relative">
          
          {/* Call to Action */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to Amplify Your Brand?</h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">Let's collaborate to create advertising campaigns that captivate and convert. Your next big success story starts here.</p>
          
          {/* SOLID BG APPLIED HERE */}
          <Link to="/contact" className="mt-8 px-8 py-4 bg-[#1a2a80] text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:brightness-125 hover:shadow-lg hover:shadow-[#1a2a80]/50">
            Launch Your Campaign
          </Link>

          {/* Links Container */}
          <div className="mt-20 w-full p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-left">
              
              {/* Brand Info */}
              <div className="col-span-2 md:col-span-4 lg:col-span-2 pr-8">
                <h1 className="text-2xl font-bold tracking-wide">
                  <span className="bg-gradient-to-r from-blue-400 to-[#1a2a80] bg-clip-text text-transparent">
                    STAR PUBLICITY
                  </span>
                </h1>
                <div className="mt-4 space-y-4 text-white/80">
                  {CONTACT_DETAILS.map(({ icon: Icon, text, href }) =>
                    href ? (
                      <a key={text} href={href} className="flex items-center gap-3 hover:text-white transition-colors"><Icon size={14} /> {text}</a>
                    ) : (
                      <p key={text} className="flex items-start gap-3"><Icon className="mt-1 flex-shrink-0" size={14} /> {text}</p>
                    )
                  )}
                </div>
              </div>

              {/* Link Columns */}
              {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <LinkColumn key={title} title={title} links={links} />
              ))}
            </div>
          </div>

          {/* Copyright & Socials */}
          <div className="w-full mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-white/50 mb-4 sm:mb-0">&copy; {currentYear} Star Publicity. All Rights Reserved.</p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;