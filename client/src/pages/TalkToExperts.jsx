// src/pages/user/TalkToExperts.jsx (Interactive Pop-Out)
import React from 'react';
import { FaUserTie } from 'react-icons/fa';

const TalkToExperts = () => {
  const handleButtonClick = () => {
    window.location.href = '/contact';
  };

  return (
    <button
      onClick={handleButtonClick}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] group"
    >
      <div className="relative flex items-center justify-center h-48 w-12 rounded-r-xl shadow-2xl bg-gradient-to-r from-[#1a2a80] to-indigo-600 text-white transition-all duration-500 ease-in-out transform hover:h-12 hover:w-48 hover:rounded-r-full">
        
        {/* Icon for the collapsed state */}
        <FaUserTie 
          className="absolute w-8 h-8 -rotate-90 transition-all duration-500 group-hover:opacity-0 group-hover:invisible" 
        />
        
        {/* Container for the expanded text */}
        <div 
          className="absolute inset-0 flex items-center space-x-3 px-4 opacity-0 invisible transition-all duration-500 group-hover:opacity-100 group-hover:visible group-hover:relative"
        >
          <FaUserTie className="w-6 h-6 flex-shrink-0" />
          <span className="font-bold whitespace-nowrap text-lg">Talk to Experts</span>
        </div>
      </div>
    </button>
  );
};

export default TalkToExperts;