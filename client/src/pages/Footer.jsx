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
import { FaMapMarkerAlt } from "react-icons/fa"; // Importing from 'fa' for MapMarkerAlt


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "About Us", path: "/about" },
      { name: "Career", path: "/career" },
      { name: "Campaigns", path: "/campaigns" },
      { name: "Contact", path: "/contact" },
      { name: "Printing & Production", path: "/resources/products" },
    ],
    mediaServices: [
      { name: "ATL Marketing", path: "/media/ATL" },
      { name: "BTL Marketing", path: "/media/BTL" },
      { name: "TTL Marketing", path: "/media/TTL" },
      { name: "Digital Marketing", path: "/media/TTL/google-ads" },
      { name: "Social Media", path: "/media/TTL/social-media-ads" },
    ],
    resources: [
      { name: "Blogs", path: "/resources/blogs" },
      { name: "Products", path: "/resources/products" },
      { name: "Job Positions", path: "/JobPosition" },
      { name: "Media Finder", path: "/media-finder" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-[#0f1729] to-black text-white">
      {/* Decorative Top Border - Using #1A2A80 and a slightly lighter blue variant for a consistent blue gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A2A80] to-[#2A3A90]"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="block">
              <h1 className="text-4xl font-black tracking-wider">
                {/* Brand name STAR gradient changed to blue variants */}
                <span className="bg-gradient-to-r from-[#1A2A80] via-[#2A3A90] to-[#3A4AA0] bg-clip-text text-transparent">
                  STAR
                </span>
                <span className="text-white"> PUBLICITY</span>
              </h1>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier partner for comprehensive marketing solutions. From
              traditional to digital, we transform your brand presence across all
              media channels.
            </p>
            <div className="flex flex-col space-y-3">
              <a
                href="tel:+1234567890"
                className="text-gray-400 hover:text-white flex items-center gap-3"
              >
                {/* Phone icon color changed */}
                <FaPhone className="text-[#1A2A80]" /> +1 234 567 890
              </a>
              <a
                href="mailto:info@starpublicity.com"
                className="text-gray-400 hover:text-white flex items-center gap-3"
              >
                {/* Envelope icon color changed */}
                <FaEnvelope className="text-[#1A2A80]" />{" "}
                info@starpublicity.com
              </a>
              <p className="text-gray-400 flex items-center gap-3">
                {/* Map marker icon color changed */}
                <FaMapMarkerAlt className="text-[#1A2A80]" />{" "}
                123 Marketing Street, Digital City
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-6 relative inline-block">
              Quick Links
              {/* Underline gradient changed to blue variants */}
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#1A2A80] to-[#2A3A90]"></span>
            </h4>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white flex items-center group"
                  >
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" />
                    <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Media Services */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold mb-6 relative inline-block">
              Media Services
              {/* Underline gradient changed to blue variants */}
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#1A2A80] to-[#2A3A90]"></span>
            </h4>
            <ul className="space-y-4">
              {footerLinks.mediaServices.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white flex items-center group"
                  >
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" />
                    <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold mb-6 relative inline-block">
              Stay Connected
              {/* Underline gradient changed to blue variants */}
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[#1A2A80] to-[#2A3A90]"></span>
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for industry insights and updates.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2A80] text-gray-200 placeholder-gray-400" // Focus ring changed
                />
                <button
                  type="submit"
                  // Submit button gradient changed to blue variants
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#1A2A80] to-[#2A3A90] p-2 rounded-md hover:shadow-lg hover:shadow-[#1A2A80]/30 transition-all duration-300"
                >
                  <FaRegPaperPlane className="text-white" />
                </button>
              </div>
            </form>
            <div className="flex gap-4 mt-6">
              {[
                {
                  Icon: FaLinkedinIn,
                  color: "hover:bg-blue-600", // This will still use Tailwind's default blue-600 on hover
                  url: "https://www.linkedin.com/company/yourcompany/",
                },
                {
                  Icon: FaInstagram,
                  color: "hover:bg-pink-600", // This will still use Tailwind's default pink-600 on hover
                  url: "https://www.instagram.com/yourcompany/",
                },
                {
                  Icon: FaYoutube,
                  color: "hover:bg-red-600", // This will still use Tailwind's default red-600 on hover
                  url: "https://www.youtube.com/yourchannel/",
                },
                {
                  Icon: FaXTwitter,
                  color: "hover:bg-blue-400", // This will still use Tailwind's default blue-400 on hover
                  url: "https://twitter.com/yourcompany",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} bg-gray-800/50 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10`}
                >
                  <social.Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Star Publicity. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;