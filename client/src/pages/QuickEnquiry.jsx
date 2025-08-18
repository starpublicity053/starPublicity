// src/pages/user/QuickEnquiry.jsx (Floating Chat Card Style)
import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const QuickEnquiry = () => {
  const phoneNumber = '+91 98168 98068';
  const whatsappMessage = encodeURIComponent("Hello! I would like to make a quick enquiry.");
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  const [displayText, setDisplayText] = useState("");
  const messageText = "Hi! Need help? Chat with us.";

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(messageText.slice(0, index));
      index++;
      if (index > messageText.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-end">
      {/* Chat Card */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative max-sm:hidden bg-white/80 backdrop-blur-lg rounded-2xl px-5 py-4 shadow-xl border border-gray-200/40 flex items-center space-x-3 transition-transform hover:scale-105 hover:shadow-2xl"
      >
        {/* Icon Badge */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-green-500 rounded-full p-3 shadow-lg border-4 border-white">
          <FaWhatsapp className="w-6 h-6 text-white" />
        </div>

        {/* Chat Text */}
        <div>
          <p className="font-semibold pl-3 text-gray-900">Quick Enquiry</p>
          <p className="text-sm pl-3.5 text-gray-600">{displayText}</p>
        </div>
      </a>

      {/* Mobile Floating Icon Only */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden bg-green-500 p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <FaWhatsapp className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};

export default QuickEnquiry;
