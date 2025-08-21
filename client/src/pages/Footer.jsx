import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// Keep your existing fa6 imports
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";

// Add this new line for the specific icon
import { FaMapMarkerAlt } from "react-icons/fa";

// ===================================================================
// 1. DATA CONSTANTS
// Moved outside the component to prevent re-creation on every render.
// ===================================================================

const CONTACT_DETAILS = [
  { icon: FaEnvelope, text: "info@starpublicity.co.in", href: "mailto:info@starpublicity.co.in" },
  { icon: FaPhone, text: "0161-4668602", href: "tel:01614668602" },
  { icon: FaMapMarkerAlt, text: "SCO-137, Feroze Gandhi market, ludhiana Punjab, 141001", href: null },
];

const FOOTER_LINKS = {
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Career", path: "/career" },
    { name: "Campaigns", path: "/campaigns" },
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
  ],
};

const SOCIAL_LINKS = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/shivam-kumar-0b17342a8/", icon: FaLinkedinIn, hoverColor: "hover:text-blue-500" },
    { name: "Instagram", href: "https://www.instagram.com/starpublicityldh/", icon: FaInstagram, hoverColor: "hover:text-pink-500" },
    { name: "YouTube", href: "https://www.youtube.com/@StarPublicity", icon: FaYoutube, hoverColor: "hover:text-red-500" },
    { name: "X", href: "https://x.com/starpublicityld", icon: FaXTwitter, hoverColor: "hover:text-white" },
];


// ===================================================================
// 2. HELPER LOGIC / CUSTOM HOOK
// Encapsulates the spotlight effect logic for cleaner component code.
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
// Breaks down the UI into manageable, readable pieces.
// ===================================================================

const ShapeDivider = () => (
  <div className="absolute top-0 left-0 w-full z-10">
    <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="footer-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e40af" /><stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M1440 120H0V26.2402C120 48.0628 288 83.3333 480 83.3333C672 83.3333 840 48.0628 1032 26.2402C1224 4.41753 1320 -4.99384 1440 26.2402V120Z" fill="url(#footer-gradient)" className="opacity-10" />
      <path d="M1440 120H0V58.0463C120 71.7468 288 95 480 95C672 95 840 71.7468 1032 58.0463C1224 44.3458 1320 40.5891 1440 58.0463V120Z" fill="url(#footer-gradient)" className="opacity-20" />
    </svg>
  </div>
);

const LinkColumn = ({ title, links }) => (
  <div>
    <h4 className="font-semibold text-cyan-400/80 mb-4">{title}</h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link to={link.path} className="text-slate-300 hover:text-white transition-colors">{link.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLinks = () => (
    <div className="flex space-x-5">
    {SOCIAL_LINKS.map(({ name, href, icon: Icon, hoverColor }) => (
      <a key={name} href={href} aria-label={`Follow us on ${name}`} target="_blank" rel="noopener noreferrer"
         className={`text-slate-400 transition-all duration-300 ${hoverColor} hover:scale-125`}>
        <Icon size={20} />
      </a>
    ))}
  </div>
);


// ===================================================================
// 4. MAIN FOOTER COMPONENT
// Now cleaner and easier to read, composing the pieces from above.
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
        style={{ background: `radial-gradient(600px circle at var(--mouse-x, 800px) var(--mouse-y, 300px), rgba(29, 78, 216, 0.15), transparent 80%)` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center z-20 relative">
          
          {/* Call to Action */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to Amplify Your Brand?</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl">Let's collaborate to create advertising campaigns that captivate and convert. Your next big success story starts here.</p>
          <Link to="/contact" className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50">
            Launch Your Campaign
          </Link>

          {/* Links Container */}
          <div className="mt-20 w-full p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-left">
              
              {/* Brand Info */}
              <div className="col-span-2 md:col-span-4 lg:col-span-2 pr-8">
                <h1 className="text-2xl font-bold tracking-wide">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">STAR</span>
                  <span className="text-gray-200"> PUBLICITY</span>
                </h1>
                <div className="mt-4 space-y-4 text-slate-300">
                  {CONTACT_DETAILS.map(({ icon: Icon, text, href }) =>
                    href ? (
                      <a key={text} href={href} className="flex items-center gap-3 hover:text-cyan-400 transition-colors"><Icon size={14} /> {text}</a>
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
            <p className="text-sm text-slate-500 mb-4 sm:mb-0">&copy; {currentYear} Star Publicity. All Rights Reserved.</p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;