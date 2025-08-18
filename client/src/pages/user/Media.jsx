import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building,
  Bus,
  TrainFront,
  MapPin,
  Megaphone,
  Map,
  ShoppingBag,
  BusFront,
  Search,
  CheckCircle,
  ChevronDown,
  X,
  ChevronRight,
  Filter,
  Eye,
  BarChart,
  Tv,
  Users,
  Shuffle,
  Star,
  AreaChart,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- IMPORT YOUR PNG ICONS HERE ---
import billboardIcon from "../../assets/bilboard.png";
import busIcon from "../../assets/bus1.png";
import vanIcon from "../../assets/van.png";
import mallIcon from "../../assets/mall.png";
import busShelterIcon from "../../assets/busshelter.png";
import unipolIcon from "../../assets/unipole.png";

// --- FONT & NEW HEADING STYLES ---
const FontStyles = () => (
    <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap');
      
      body {
        font-family: 'Raleway', sans-serif;
      }

      .animated-gradient-text {
        background-image: linear-gradient(to right, #38bdf8, #818cf8, #c084fc, #38bdf8);
        background-size: 250% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient-flow 6s linear infinite;
      }

      @keyframes gradient-flow {
        to {
          background-position: 250% center;
        }
      }

      /* Custom scrollbar for a better look in dashboard panels */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #4A5568;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #718096;
      }
    `}
  </style>
);

// --- ModernHeroSection ---
const ModernHeroSection = () => {
  const heroRef = useRef(null);
  const animationWrapperRef = useRef(null);
  const elementsRef = useRef([]);
  const smallCirclesRef = useRef([]);

  const mediaOptions = [
    { text: "Billboard Ad", src: billboardIcon, alt: "Billboard Icon" },
    { text: "Bus Ad", src: busIcon, alt: "Bus Icon" },
    { text: "Van Ad", src: vanIcon, alt: "Van Icon" },
    { text: "Mall Branding", src: mallIcon, alt: "Mall Icon" },
    { text: "Bus Shelter Ad", src: busShelterIcon, alt: "Bus Shelter Icon" },
    { text: "Unipole Ad", src: unipolIcon, alt: "Unipole Icon" },
  ];

  useEffect(() => {
    if (!heroRef.current || !animationWrapperRef.current) return;

    let ctx = gsap.context(() => {
      gsap.to(heroRef.current, {
        backgroundPositionY: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      gsap.from(elementsRef.current.filter(Boolean), {
        opacity: 0, scale: 0.8, y: 50, stagger: 0.1, duration: 1, ease: "back.out(1.7)",
      });
      
      const circles = smallCirclesRef.current.filter(Boolean);
      if (circles.length === 0) return;

      let radius = 150;
      const updateOrbitRadius = () => {
        if (!animationWrapperRef.current) return;
        // RESPONSIVE: Adjust radius based on screen width
        const screenWidth = window.innerWidth;
        if (screenWidth < 640) {
            radius = animationWrapperRef.current.offsetWidth * 0.45;
        } else {
            radius = animationWrapperRef.current.offsetWidth * 0.42;
        }
      };
      
      const orbitTimeline = gsap.to({ angle: 0 }, {
        angle: Math.PI * 2,
        duration: 30,
        ease: "none",
        repeat: -1,
        onUpdate: function() {
          circles.forEach((circle, index) => {
            const initialAngle = (index / circles.length) * (Math.PI * 2);
            const currentAngle = initialAngle + this.targets()[0].angle;
            gsap.set(circle, {
              x: Math.cos(currentAngle) * radius,
              y: Math.sin(currentAngle) * radius,
            });
          });
        },
      });

      const setInitialPositions = () => {
        updateOrbitRadius();
        orbitTimeline.invalidate().restart();
      };

      setInitialPositions();
      window.addEventListener("resize", setInitialPositions);

      return () => window.removeEventListener("resize", setInitialPositions);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden py-16 px-4 md:px-8"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/34639/pexels-photo.jpg')",
        backgroundSize: "cover", backgroundPosition: "center 0%",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-blue-900/80 z-10"></div>
      <div className="absolute inset-0 z-10 opacity-10" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
      <div className="z-20 w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-y-12 lg:gap-y-16">
        {/* RESPONSIVE: Adjusted max-width for smaller screens */}
        <div ref={animationWrapperRef} className="relative flex-shrink-0 flex items-center justify-center w-full max-w-[300px] aspect-square sm:max-w-[400px] lg:max-w-[550px]">
          <div ref={(el) => (elementsRef.current[0] = el)} className="relative w-[55%] aspect-square bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/70 p-4">
            <div className="text-center text-slate-800 px-2 sm:px-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase leading-tight tracking-tight drop-shadow-lg">Own The Outdoors</h1>
              <p className="text-xs sm:text-sm mt-2 max-w-xs mx-auto text-slate-600">Unforgettable advertising that transforms spaces.</p>
            </div>
          </div>
          {mediaOptions.map((item, index) => (
            // RESPONSIVE: Adjusted circle and icon sizes
            <div
              key={index}
              ref={(el) => { elementsRef.current[index + 1] = el; smallCirclesRef.current[index] = el; }}
              className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-full flex flex-col items-center justify-center text-blue-900 p-1 sm:p-2 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-200 cursor-pointer"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            >
              <img src={item.src} alt={item.alt} className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight px-1 mt-1 block text-gray-800">{item.text}</span>
            </div>
          ))}
        </div>
        {/* RESPONSIVE: Stacks vertically on mobile, row on sm+ */}
        <div ref={(el) => (elementsRef.current[mediaOptions.length + 1] = el)} className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 text-white">
          <div className="flex items-center gap-3 text-center sm:text-left"><Map className="w-8 h-8 text-cyan-300 flex-shrink-0" /><div><h3 className="font-bold text-lg">PAN India</h3><p className="text-sm text-blue-200">Extensive Coverage</p></div></div>
          <div className="flex items-center gap-3 text-center sm:text-left"><ShoppingBag className="w-8 h-8 text-cyan-300 flex-shrink-0" /><div><h3 className="font-bold text-lg">500+ Brands</h3><p className="text-sm text-blue-200">Trusted By Leaders</p></div></div>
          <div className="flex items-center gap-3 text-center sm:text-left"><BusFront className="w-8 h-8 text-cyan-300 flex-shrink-0" /><div><h3 className="font-bold text-lg">Transit Media</h3><p className="text-sm text-blue-200">Experts in Mobility Ads</p></div></div>
        </div>
      </div>
    </section>
  );
};


// --- FULL DATA SOURCE (Restored) ---
const dashboardData = {
    states: [
        { name: "Punjab", cities: ["Ludhiana", "Amritsar", "Jalandhar"] },
        { name: "Haryana", cities: ["Gurugram", "Faridabad", "Panipat"] },
        { name: "Delhi-NCR", cities: ["New Delhi", "Noida"] },
        { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra"] },
        { name: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur"] },
    ],
    availability: {
        Ludhiana: [
            { id: 1, title: 'Feroze Gandhi Market Hoarding', type: 'Hoardings', category: 'ATL', image: 'https://images.pexels.com/photos/1649683/pexels-photo-1649683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Shoppers, Corporate', impressions: '2.5M/month' },
            { id: 2, title: 'City Circuit Bus Fleet', type: 'Bus Branding', category: 'ATL', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'General Commuters', impressions: '4.2M/month' },
            { id: 13, title: 'Wave Mall Activation', type: 'Van Activity', category: 'BTL', image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: '50k weekend footfall', impressions: '200k/month' },
            { id: 17, title: 'Highway Facing Unipole', type: 'Unipole', category: 'ATL', image: 'https://images.pexels.com/photos/2249602/pexels-photo-2249602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Highway Commuters', impressions: '3.1M/month' },
            { id: 18, title: 'City Bus Stop Network', type: 'Bus Stands', category: 'BTL', image: 'https://images.pexels.com/photos/1125277/pexels-photo-1125277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Daily Commuters, Students', impressions: '1.9M/month' },
            { id: 19, title: 'City-Wide Auto Branding', type: 'Auto Branding', category: 'BTL', image: 'https://images.pexels.com/photos/159820/auto-rickshaw-tuk-tuk-asia-159820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Local Residents, Shoppers', impressions: '2.8M/month' },
            { id: 20, title: 'Fuel Station Ad Network', type: 'Petrol Pumps', category: 'BTL', image: 'https://images.pexels.com/photos/8532454/pexels-photo-8532454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Vehicle Owners', impressions: '1.5M/month' },
            { id: 21, title: 'Highway Dhaba Network', type: 'Dhaba Advertising', category: 'BTL', image: 'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Travelers, Truckers', impressions: '900k/month' },
            { id: 22, title: 'Top FM Radio Spots', type: 'FM Radio', category: 'ATL', image: 'https://images.pexels.com/photos/5079604/pexels-photo-5079604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'General Listeners', impressions: '5M+ Reach' },
            { id: 23, title: 'City Centre LED Hoarding', type: 'MC LED Hoardings Ads', category: 'ATL', image: 'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Evening Crowds, Shoppers', impressions: '3.8M/month' },
        ],
        Amritsar: [
            { id: 3, title: 'Airport Arrival Zone', type: 'Airport', category: 'ATL', image: 'https://images.pexels.com/photos/1107775/pexels-photo-1107775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Travelers, Tourists', impressions: '1.8M/month' },
            { id: 14, title: 'Heritage Street Pamphlet Drive', type: 'Look Walker', category: 'BTL', image: 'https://images.pexels.com/photos/1462011/pexels-photo-1462011.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Targeted Tourist Groups', impressions: '50k direct reach' },
            { id: 24, title: 'Old City Wall Murals', type: 'Wall Paintings', category: 'BTL', image: 'https://images.pexels.com/photos/1603658/pexels-photo-1603658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Tourists, Locals', impressions: 'High Visibility' },
            { id: 25, title: 'Religious Event Branding', type: 'Event Branding', category: 'BTL', image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Devotees, Event Attendees', impressions: 'Variable' },
            { id: 27, title: 'Local Newspaper Ads', type: 'Newspaper', category: 'ATL', image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'City-wide Readership', impressions: '200k+ Circulation' },
        ],
        Gurugram: [
            { id: 4, title: 'Cyber Hub Digital Network', type: 'Mall inside LED Ads', category: 'BTL', image: 'https://images.pexels.com/photos/5072643/pexels-photo-5072643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Corporate, Youth', impressions: '3.1M/month' },
            { id: 5, title: 'NH8 Expressway Gantry', type: 'City Gantries', category: 'ATL', image: 'https://images.pexels.com/photos/7973302/pexels-photo-7973302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Highway Traffic', impressions: '5.5M/month' },
            { id: 15, title: 'Integrated Digital & OOH', type: 'Google Ads', category: 'TTL', image: 'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Synergized Reach', impressions: 'Custom' },
            { id: 28, title: 'Rapid Metro Train Wrap', type: 'Metro Trains', category: 'ATL', image: 'https://images.pexels.com/photos/1267438/pexels-photo-1267438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Corporate Commuters', impressions: '4.5M/month' },
            { id: 30, title: 'Corporate Email Campaign', type: 'Email & WhatsApp marketing', category: 'TTL', image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'IT/Corporate Professionals', impressions: 'High Open Rate' },
            { id: 31, title: 'Tech Park Collaborations', type: 'Brand Collaboration', category: 'TTL', image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Tech Employees', impressions: 'Direct Engagement' },
            { id: 32, title: 'Cyber City Traffic Barricades', type: 'Traffic Barricades', category: 'BTL', image: 'https://images.pexels.com/photos/93398/pexels-photo-93398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Daily Traffic', impressions: '2.2M/month' },
        ],
        Noida: [
            { id: 11, title: 'Film City Hoarding', type: 'Hoardings', category: 'ATL', image: 'https://images.pexels.com/photos/208537/pexels-photo-208537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Corporate, Media Professionals', impressions: '4.5M/month' },
            { id: 12, title: 'DLF Mall of India Branding', type: 'Retail Branding', category: 'BTL', image: 'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'High-end Shoppers, Families', impressions: '6.1M/month' },
            { id: 33, title: 'Blue Line Metro Branding', type: 'Metro Trains', category: 'ATL', image: 'https://images.pexels.com/photos/5634606/pexels-photo-5634606.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Students, Professionals', impressions: '7M+/month' },
            { id: 34, title: 'National News Channel Spots', type: 'News Channels', category: 'ATL', image: 'https://images.pexels.com/photos/7245464/pexels-photo-7245464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Nationwide Viewers', impressions: 'High TRP' },
            { id: 35, title: 'Expo Mart Seminar Branding', type: 'Seminars Branding', category: 'BTL', image: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Industry Professionals', impressions: 'Focused Reach' },
            { id: 36, title: 'Targeted Social Media Campaign', type: 'Social Media Advertising', category: 'TTL', image: 'https://images.pexels.com/photos/4559553/pexels-photo-4559553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Custom Demographics', impressions: 'Data-driven' },
        ],
        Jaipur: [
            { id: 7, title: 'MI Road Bus Fleet', type: 'Bus Branding', category: 'ATL', image: 'https://images.pexels.com/photos/3416825/pexels-photo-3416825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Tourists, Locals', impressions: '2.9M/month' },
            { id: 8, title: 'World Trade Park Atrium', type: 'City Mall', category: 'BTL', image: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'High-end Shoppers', impressions: '4.0M/month' },
            { id: 16, title: 'Social Media + Print QR Campaign', type: 'Brand Collaboration', category: 'TTL', image: 'https://images.pexels.com/photos/5989933/pexels-photo-5989933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'High Engagement', impressions: 'Variable' },
            { id: 37, title: 'Jaipur International Airport Ads', type: 'Airport', category: 'ATL', image: 'https://images.pexels.com/photos/1320669/pexels-photo-1320669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'International & Domestic Flyers', impressions: '2.5M/month' },
            { id: 38, title: 'Jaipur Junction Railway Ads', type: 'Indian Railways', category: 'ATL', image: 'https://images.pexels.com/photos/994471/pexels-photo-994471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Train Passengers', impressions: 'Massive Footfall' },
            { id: 39, title: 'Hawa Mahal Area Wall Wrap', type: 'Wall Wraps', category: 'BTL', image: 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Tourists', impressions: 'High Visibility' },
            { id: 40, title: 'Raj Mandir Cinema Ads', type: 'Cinema', category: 'ATL', image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Movie Goers', impressions: 'Captive Audience' },
            { id: 41, title: 'City-wide Information Kiosks', type: 'Kiosks', category: 'BTL', image: 'https://images.pexels.com/photos/7682333/pexels-photo-7682333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'General Public', impressions: '1.2M/month' },
        ]
    },
};

const categoryStyleMap = {
    ATL: { icon: <Tv size={14} />, color: "text-cyan-400", border: "border-cyan-400" },
    BTL: { icon: <Users size={14} />, color: "text-pink-400", border: "border-pink-400" },
    TTL: { icon: <Shuffle size={14} />, color: "text-amber-400", border: "border-amber-400" },
};

// --- MediaFinderSection ---
const DetailModal = ({ item, onClose }) => {
    if (!item) return null;
    const categoryStyle = categoryStyleMap[item.category] || {};

    return (
        <AnimatePresence>
            {/* RESPONSIVE: Outer container allows scrolling on mobile */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto"
            >
                {/* RESPONSIVE: Added margin for mobile view and vertical stacking */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-4xl my-8 bg-slate-800/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    <div className="w-full md:w-1/2 md:h-auto h-64">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                        <div className="flex-grow">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full border-2 ${categoryStyle.border} ${categoryStyle.color} bg-white/10 mb-3`}>
                                {categoryStyle.icon}
                                {item.category} Campaign
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{item.title}</h2>
                            <p className="text-slate-400 mb-6">{item.type}</p>

                            <div className="space-y-3 text-slate-200 text-sm">
                                <div className="flex items-center gap-3">
                                    <Users size={20} className="text-cyan-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Target Audience</p>
                                        <p className="text-slate-400">{item.audience}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AreaChart size={20} className="text-cyan-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Est. Monthly Impressions</p>
                                        <p className="text-slate-400">{item.impressions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/30">
                                Get a Quote
                            </button>
                            <button onClick={onClose} className="bg-slate-700/50 text-slate-300 font-bold p-3 rounded-lg hover:bg-slate-700 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const MediaFinderSection = () => {
    const [selectedState, setSelectedState] = useState(dashboardData.states[0].name);
    const [selectedCity, setSelectedCity] = useState(dashboardData.states[0].cities[0]);
    const [modalItem, setModalItem] = useState(null);

    const results = dashboardData.availability[selectedCity] || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
    };

    return (
        <section className="w-full bg-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 tracking-wide animated-gradient-text">
                        Chart Your Campaign's Course
                    </h2>
                    <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                        Navigate our extensive media network to find your perfect advertising launchpad.
                    </p>
                </div>

                {/* RESPONSIVE: Stacks on mobile, becomes 2-col on medium screens+ */}
                <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-6 md:min-h-[70vh]">
                    <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 flex flex-col">
                        <h3 className="text-xl font-bold mb-4 px-2">Select Location</h3>
                        <div className="overflow-y-auto custom-scrollbar flex-grow">
                            <LayoutGroup>
                                <ul className="space-y-2">
                                    {dashboardData.states.map(state => (
                                        <li key={state.name} className="bg-black/20 rounded-lg">
                                            <motion.button
                                                layout
                                                onClick={() => setSelectedState(state.name)}
                                                className="w-full text-left p-3 flex justify-between items-center"
                                            >
                                                <span className="font-semibold">{state.name}</span>
                                                <motion.div animate={{ rotate: selectedState === state.name ? 90 : 0 }}>
                                                    <ChevronRight size={18} />
                                                </motion.div>
                                            </motion.button>
                                            <AnimatePresence>
                                                {selectedState === state.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="pl-4 pb-2 pr-2"
                                                    >
                                                        {state.cities.map(city => (
                                                            <button
                                                                key={city}
                                                                onClick={() => setSelectedCity(city)}
                                                                className={`w-full text-left p-2.5 my-1 rounded-md text-sm transition-colors ${selectedCity === city ? 'bg-cyan-500 text-white font-bold' : 'hover:bg-slate-700/60'
                                                                    }`}
                                                            >
                                                                {city}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    ))}
                                </ul>
                            </LayoutGroup>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col">
                        <div className="flex-shrink-0 mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold">
                                Available Media in <span className="text-cyan-400">{selectedCity}</span>
                            </h3>
                            <p className="text-slate-400">{results.length} opportunities found</p>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCity}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="flex-grow overflow-y-auto custom-scrollbar -mr-2 pr-2"
                            >
                                {/* RESPONSIVE: Adjusts column count based on screen size */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {results.length > 0 ? (
                                        results.map(spot => {
                                            const categoryStyle = categoryStyleMap[spot.category] || {};
                                            return (
                                                <motion.div
                                                    key={spot.id}
                                                    variants={itemVariants}
                                                    onClick={() => setModalItem(spot)}
                                                    className="relative group cursor-pointer"
                                                >
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                                                    <div className="relative bg-slate-900/80 rounded-lg overflow-hidden h-full border border-white/10">
                                                        <div className="overflow-hidden h-40">
                                                            <img src={spot.image} alt={spot.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                                        </div>
                                                        <div className="p-4">
                                                            <p className={`text-xs font-semibold flex items-center gap-1.5 ${categoryStyle.color}`}>
                                                                {categoryStyle.icon}
                                                                {spot.type}
                                                            </p>
                                                            <h4 className="font-bold text-base text-white mt-1 truncate">{spot.title}</h4>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full h-full flex items-center justify-center text-slate-500">
                                            <p>No media found for this city.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {modalItem && <DetailModal item={modalItem} onClose={() => setModalItem(null)} />}
            </AnimatePresence>
        </section>
    );
};


// --- AdvertisingMediaSection ---
const AdvertisingMediaSection = () => {
    const mediaTypes = [
        { icon: <Building className="w-12 h-12 text-blue-600" />, title: "Hoardings & Billboards", description: "Capture attention on the busiest roads across North India with bold visuals." },
        { icon: <Bus className="w-12 h-12 text-blue-600" />, title: "Bus Branding", description: "Transform city and roadways buses into impactful brand ambassadors." },
        { icon: <TrainFront className="w-12 h-12 text-blue-600" />, title: "Metro & Railway Ads", description: "Engage daily commuters and urban travelers at key metro and railway locations." },
        { icon: <Megaphone className="w-12 h-12 text-blue-600" />, title: "Unipoles & Gantry Signs", description: "Stand tall with unskippable displays on major highways and city gateways." },
        { icon: <MapPin className="w-12 h-12 text-blue-600" />, title: "Airport Advertising", description: "Engage with prestigious, high-value audiences at major airports for premium brand’s visibility." },
        { icon: <Building className="w-12 h-12 text-blue-600" />, title: "Mall & Retail Branding", description: "Engage shoppers at top malls and retail hubs with creative placements." },
    ];

    return (
        // RESPONSIVE: Adjusted padding
        <motion.section className="bg-white pt-16 pb-24 px-4 sm:px-8 md:px-12 text-gray-800 relative">
            <div className="max-w-7xl mx-auto text-center">
                {/* RESPONSIVE: Adjusts column count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {mediaTypes.map((media, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 border border-blue-50"
                        >
                            <div className="mb-6 bg-blue-50 p-4 rounded-full shadow-inner">{media.icon}</div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">{media.title}</h3>
                            <p className="text-gray-700 text-base leading-relaxed mb-6">{media.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

// --- Main Media Page Component ---
const Media = () => {
    useEffect(() => {
        ScrollTrigger.refresh();
    }, []);

    return (
        <>
            <FontStyles />
            <ModernHeroSection />
            <MediaFinderSection />
            <div className="max-w-screen-xl mx-auto w-full">
                <div className="max-w-4xl mx-auto text-center py-16 px-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-1 leading-tight">
                        Discover Effective Outdoor Media Solutions Today{" "}
                    </h2>
                    <p className="text-base md:text-xl mb-0 max-w-xl mx-auto text-blue-800">
                        From city center hotspots to vibrant neighborhood corners, our
                        diverse outdoor media connects your brand with audiences wherever
                        they move.
                    </p>
                </div>
                <AdvertisingMediaSection />
            </div>
        </>
    );
};

export default Media;