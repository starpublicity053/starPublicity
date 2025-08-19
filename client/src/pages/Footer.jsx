import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
  FaArrowRight,
  FaRegPaperPlane,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "About Us", path: "/about" },
      { name: "Career", path: "/career" },
      { name: "Campaigns", path: "/campaigns" },
      { name: "Contact", path: "/contact" },
    ],
    mediaServices: [
      { name: "ATL Marketing", path: "/media/ATL" },
      { name: "BTL Marketing", path: "/media/BTL" },
      { name: "TTL Marketing", path: "/media/TTL" },
      { name: "Digital Marketing", path: "/media/TTL/google-ads" },
    ],
    resources: [
      { name: "Blogs", path: "/resources/blogs" },
      { name: "Products", path: "/resources/products" },
      { name: "Job Positions", path: "/JobPosition" },
      { name: "Media Finder", path: "/media-finder" },
    ],
  };

  // Reusable component for footer link columns
  const LinkColumn = ({ title, links }) => (
    <div>
      <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-6">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden border-t border-slate-800">
      {/* Aurora Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900 rounded-full mix-blend-lighten filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-900 rounded-full mix-blend-lighten filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-900 rounded-full mix-blend-lighten filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Add keyframes for the blob animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10 z-10">
        {/* Top Section: Brand and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-slate-800 pb-12">
          {/* Brand Info */}
          <div className="space-y-4">
             <Link to="/" className="block">
              <h1 className="text-3xl font-bold tracking-wide">
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">STAR</span>
                <span className="text-gray-200"> PUBLICITY</span>
              </h1>
            </Link>
            <p className="text-slate-400 max-w-md">
              Elevating brands with impactful advertising. Your vision, amplified.
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><FaLinkedinIn size={20}/></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors"><FaInstagram size={20}/></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 transition-colors"><FaYoutube size={20}/></a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><FaXTwitter size={20}/></a>
            </div>
          </div>
          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-4">Subscribe for Insights</h4>
            <p className="text-slate-400 mb-4">
              Receive the latest marketing trends and case studies directly in your inbox.
            </p>
            <form className="flex items-center max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 px-4 bg-slate-800/60 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-500 text-sm"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="h-12 w-12 flex items-center justify-center bg-blue-600 rounded-r-lg hover:bg-blue-500 transition-colors"
              >
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <LinkColumn title="Company" links={footerLinks.quickLinks} />
          <LinkColumn title="Services" links={footerLinks.mediaServices} />
          <LinkColumn title="Resources" links={footerLinks.resources} />
          <div>
             <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-6">Contact Us</h4>
             <div className="space-y-4 text-gray-300">
                <a href="tel:+911234567890" className="flex items-center gap-3 hover:text-white transition-colors"><FaPhone size={14} /> +91 123-456-7890</a>
                <a href="mailto:info@starpublicity.com" className="flex items-center gap-3 hover:text-white transition-colors"><FaEnvelope size={14} /> info@starpublicity.com</a>
                <p className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1" size={14} /> 123 Marketing St, Digital City, 141001</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 text-sm text-slate-500 text-center">
          <p>&copy; {currentYear} Star Publicity. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
