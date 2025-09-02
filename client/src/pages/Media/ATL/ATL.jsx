import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSendATLInquiryMutation } from "../../../features/auth/contactApi";

const atlServices = [
    { name: "Unipoles", image: "/assets/ATL marketing images/ATL marketing images/unipole.png", url: "/media/ATL/unipoles" },
    { name: "Bus Branding", image: "/assets/ATL marketing images/ATL marketing images/bus branding.png", url: "/media/ATL/bus-branding" },
    { name: "Bus Stands", image: "/assets/ATL marketing images/ATL marketing images/bus stand.png", url: "/media/ATL/bus-stands" },
    { name: "Auto Branding", image: "/assets/ATL marketing images/ATL marketing images/auto branding.png", url: "/media/ATL/auto-branding" },
    { name: "City Gantries", image: "/assets/ATL marketing images/ATL marketing images/city gantries.png", url: "/media/ATL/city-gantries" },
    { name: "Kiosks Advertisements", image: "/assets/ATL marketing images/ATL marketing images/kiosks ads.png", url: "/media/ATL/kiosks" },
    { name: "City Mall Advertisements", image: "/assets/ATL marketing images/ATL marketing images/city mall.png", url: "/media/ATL/mall-ads" },
    { name: "Van Activity", image: "/assets/ATL marketing images/ATL marketing images/van ads.png", url: "/media/ATL/van-activity" },
    { name: "Petrol Pumps", image: "/assets/ATL marketing images/ATL marketing images/petrol pump.png", url: "/media/ATL/petrol-pumps" },
    { name: "Wall Wraps", image: "/assets/ATL marketing images/ATL marketing images/Wall Wraps.png", url: "/media/ATL/wall-wraps" },
    { name: "Wall Paintings", image: "/assets/ATL marketing images/ATL marketing images/wall painting.png", url: "/media/ATL/wall-paintings" },
    { name: "Indian Railway Trains/Stations", image: "/assets/ATL marketing images/ATL marketing images/railway station.png", url: "/media/ATL/railway-ads" },
    { name: "Metro Trains/Stations", image: "/assets/ATL marketing images/ATL marketing images/metro ads.png", url: "/media/ATL/metro-ads" },
    { name: "Airports Advertisements", image: "/assets/ATL marketing images/ATL marketing images/Airport Advertising.png", url: "/media/ATL/airport-ads" },
    { name: "Newspaper Advertisements", image: "/assets/ATL marketing images/ATL marketing images/newspaper ad.png", url: "/media/ATL/newspaper-ads" },
    { name: "News Channels Advertisements", image: "/assets/ATL marketing images/ATL marketing images/News Channel ads.png", url: "/media/ATL/tv-ads" },
    { name: "FM Radio Advertisements", image: "/assets/ATL marketing images/ATL marketing images/FM radio.png", url: "/media/ATL/radio-ads" },
];

const differentiators = [
    { icon: ( <svg className="w-12 h-12 text-[#1A2A80] group-hover:text-white transition-colors duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 13h18M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path> </svg> ), title: " Strategic Creativity", description: "Ideas that captivate audiences with an unforgettable edge in every campaign" },
    { icon: ( <svg className="w-12 h-12 text-[#1A2A80] group-hover:text-white transition-colors duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" ></path> </svg> ), title: "Cutting-Edge Technology", description: "Utilizing the latest tools with precision for an impressive visual impact" },
    { icon: ( <svg className="w-12 h-12 text-[#1A2A80] group-hover:text-white transition-colors duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path> </svg> ), title: "Final Execution", description: "From ideas to implementation, every stage is handled by us." },
    { icon: ( <svg className="w-12 h-12 text-[#1A2A80] group-hover:text-white transition-colors duration-300 transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path> </svg> ), title: "Measurable Results", description: "Using data and analytical research on OOH campaigns to maximize your ROI" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function ATLMarketing() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sendATLInquiry, { isLoading }] = useSendATLInquiryMutation();

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await sendATLInquiry(formData);
            const successMessage = res?.data?.message || "Inquiry sent successfully!";
            alert(successMessage);
            
            setFormData({ firstName: "", lastName: "", phoneNumber: "", email: "" });
            closeModal();
        } catch (err) {
            const errorMessage = err?.data?.message || err?.error || "An unknown error occurred.";
            alert(`Failed to send inquiry: ${errorMessage}`);
            console.error("❌ ATL Inquiry error:", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 font-sans text-gray-800">
            <AnimatePresence>
                {isModalOpen && (
                    // MODAL: Ensured padding works on small screens and content is centered.
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
                        <motion.div
                            initial={{ opacity: 0, y: -40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            // MODAL: Adjusted padding for mobile (p-6) vs larger screens (sm:p-8).
                            className="relative w-full max-w-lg p-6 sm:p-8 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute -top-16 -left-20 w-48 h-48 bg-cyan-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                            <div className="absolute -bottom-16 -right-10 w-48 h-48 bg-blue-500/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

                            <button onClick={closeModal} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors z-10" aria-label="Close modal">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            
                            {/* --- CONTENT UPDATED --- */}
                            <div className="relative text-center mb-6 sm:mb-8">
                                {/* MODAL: Reduced font size for mobile (text-3xl) */}
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                                    Unlock Your Brand's Potential
                                </h2>
                                <p className="text-slate-400 max-w-sm mx-auto text-sm sm:text-base">
                                    Fill out the form for a <span className="font-semibold text-cyan-300">free, no-obligation consultation</span> with one of our ATL advertising experts.
                                </p>
                            </div>

                            <form className="relative space-y-5" onSubmit={handleSubmit}>
                                {/* FORM: The grid is already responsive, stacking on mobile and going to 2 columns on sm+ screens. */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="relative">
                                        <label htmlFor="modal-firstName" className="absolute -top-2 left-3 inline-block bg-slate-900 px-1 text-xs font-medium text-slate-400">First Name</label>
                                        <input type="text" name="firstName" id="modal-firstName" placeholder="e.g., John" value={formData.firstName} onChange={handleChange} className="block w-full rounded-xl border-0 py-3 px-4 bg-slate-900 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6" required />
                                    </div>
                                    <div className="relative">
                                        <label htmlFor="modal-lastName" className="absolute -top-2 left-3 inline-block bg-slate-900 px-1 text-xs font-medium text-slate-400">Last Name</label>
                                        <input type="text" name="lastName" id="modal-lastName" placeholder="e.g., Doe" value={formData.lastName} onChange={handleChange} className="block w-full rounded-xl border-0 py-3 px-4 bg-slate-900 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6" required />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label htmlFor="modal-phoneNumber" className="absolute -top-2 left-3 inline-block bg-slate-900 px-1 text-xs font-medium text-slate-400">Phone</label>
                                    <input type="tel" name="phoneNumber" id="modal-phoneNumber" placeholder="e.g., 9876543210" value={formData.phoneNumber} onChange={handleChange} className="block w-full rounded-xl border-0 py-3 px-4 bg-slate-900 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6" required />
                                </div>
                                <div className="relative">
                                    <label htmlFor="modal-email" className="absolute -top-2 left-3 inline-block bg-slate-900 px-1 text-xs font-medium text-slate-400">Email</label>
                                    <input type="email" name="email" id="modal-email" placeholder="e.g., john.doe@company.com" value={formData.email} onChange={handleChange} className="block w-full rounded-xl border-0 py-3 px-4 bg-slate-900 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6" required />
                                </div>

                                <div className="pt-3">
                                    <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent shadow-lg text-base sm:text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-[1.03] disabled:opacity-50" disabled={isLoading}>
                                        <span>{isLoading ? "Sending..." : "Get My Free Consultation"}</span>
                                        {!isLoading && (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </form>
                            <p className="text-center text-xs text-slate-500 mt-5">
                                🔒 Your information is confidential and will not be shared.
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <style>
                {`
                @keyframes glow {
                    0% { box-shadow: 0 0 5px rgba(178, 176, 232, 0.4), 0 0 15px rgba(122, 133, 193, 0.2); }
                    50% { box-shadow: 0 0 10px rgba(59, 56, 160, 0.7), 0 0 25px rgba(26, 42, 128, 0.4); }
                    100% { box-shadow: 0 0 5px rgba(178, 176, 232, 0.4), 0 0 15px rgba(122, 133, 193, 0.2); }
                }
                .feature-card-glow:hover {
                    animation: glow 1.5s infinite alternate;
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite cubic-bezier(0.6, 0.2, 0.2, 0.8); }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                .heading-glowing-effect { text-shadow: 0 0 5px #06B6D4, 0 0 15px #06B6D4, 0 0 30px rgba(0, 0, 0, 0.7), 0 0 50px rgba(0, 0, 0, 0.5); filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)); }
                .heading-glowing-effect .highlight-text { color: white; text-shadow: none; }

                .flip-card { perspective: 1000px; }
                .flip-card-inner { position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.8s; transform-style: preserve-3d; }
                .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
                .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 20px; overflow: hidden; }
                .flip-card-front { background-color: #bbb; color: black; }
                .flip-card-back { background: linear-gradient(145deg, #1D4ED8, #1A2A80); color: white; transform: rotateY(180deg); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1rem; }
                .flip-card-front img { width: 100%; height: 100%; object-fit: cover; }
                `}
            </style>

            {/* HERO: Adjusted padding and font sizes for mobile. */}
            <section className="relative w-full overflow-hidden pt-32 pb-16 md:pt-48 md:pb-28 bg-gradient-to-br from-[#3B38A0] to-[#1A2A80] text-white">
                <svg className="absolute bottom-0 left-0 w-full h-auto z-0 opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" > <path fill="currentColor" fillOpacity="1" d="M0,160L60,144C120,128,240,96,360,90.7C480,85,600,107,720,138.7C840,171,960,213,1080,208C1200,203,1320,149,1380,122.7L1440,96L1440,320L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" ></path> </svg>
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter drop-shadow-lg leading-tight" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} >
                        ATL Marketing
                    </motion.h1>
                    <motion.p className="mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} >
                        Reach thousands of targeted customers with impactful Above-the-line strategies that craft bold awareness for your brand.
                    </motion.p>
                </div>
            </section>

               {/* VIDEO: Adjusted padding and negative margin for a seamless look on all devices. */}
<section className="relative -mt-16 md:-mt-24 z-20 px-4 sm:px-8 pb-16 sm:pb-24">
    <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border-2 sm:border-4 border-white transform hover:scale-[1.005] transition-transform duration-300 ease-out bg-gray-100">
        <video src="/assets/hero.mp4" controls autoPlay muted loop playsInline className="w-full h-auto" />
    </div>
</section>

            {/* DESCRIPTION: Adjusted padding, font sizes, and grid layout for readability on mobile. */}
            <section className="py-16 md:py-24 px-6 sm:px-12 bg-white relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={containerVariants} >
                        <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A2A80] leading-tight mb-6" variants={itemVariants} >
                            Above The Line: <br /> <span className="text-gray-900">Unmissable Impact</span>
                        </motion.h2>
                        <motion.p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6" variants={itemVariants} >
                            With the major focus on{" "} <strong className="font-semibold text-[#1A2A80]"> Above-the-line (ATL) Marketing </strong> , Star Publicity provides their clients a mass-market advertising approach aimed at reaching a broad audience through traditional media channels like Unipoles, bus advertising, wall wraps, and outdoor billboards.
                        </motion.p>
                        <motion.p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6" variants={itemVariants} >
                            Our primary objective is to build brand awareness and shape public perception on a large scale.{" "} <strong className="font-semibold text-[#1A2A80]"> ATL campaigns </strong>{" "} often employ high-impact visuals, excellent storytelling, and emotional messaging to captivate viewers, fostering recognition and trust.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex items-center gap-4 mt-6" >
                            <div className="w-4 h-4 bg-[#1A2A80] rounded-full animate-pulse" />
                            <span className="text-sm sm:text-base text-gray-600 font-medium">
                                Creating memorable impressions, everywhere.
                            </span>
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} viewport={{ once: true, amount: 0.5 }} className="p-6 md:p-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl shadow-lg border border-blue-300 relative overflow-hidden" >
                        <div className="absolute top-0 left-0 w-24 h-24 bg-blue-300 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-xl"></div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1A2A80] mb-4 relative z-10"> The Secret Behind Mass Reach </h3>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed relative z-10">
                            ATL marketing always focuses on broad-reaching media to put your brand in front and center of your audience, delivering powerful messages that relate with millions. Moreover, this approach builds lasting brand credibility across diverse audiences.
                        </p>
                        <ul className="mt-6 space-y-3 relative z-10 text-sm sm:text-base">
                            <li className="flex items-start text-gray-700"> <svg className="w-6 h-6 mr-3 text-[#06B6D4] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" > <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" ></path> </svg> Massive Exposure </li>
                            <li className="flex items-start text-gray-700"> <svg className="w-6 h-6 mr-3 text-[#06B6D4] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" > <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" ></path> </svg> Instant Credibility </li>
                            <li className="flex items-start text-gray-700"> <svg className="w-6 h-6 mr-3 text-[#06B6D4] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" > <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" ></path> </svg> Rapid Engagement </li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* DIFFERENTIATORS: Adjusted padding, font sizes. The grid is already responsive. */}
            <section className="py-16 md:py-24 px-6 sm:px-12 bg-[#1A2A80] text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10"> <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <pattern id="diagonal-stripes-atl" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" > <path d="M-1 1L11 11M-1 5L5 11M5 -1L11 5" stroke="rgba(30, 58, 138, 0.5)" strokeWidth="1" /> </pattern> <rect x="0" y="0" width="100%" height="100%" fill="url(#diagonal-stripes-atl)" /> </svg> </div>
                <div className="absolute inset-0 z-0 opacity-20" style={{ background: `radial-gradient(circle at center, rgba(30, 58, 138, 0.4) 0%, transparent 70%)` }} ></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-14 leading-tight drop-shadow-lg" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.5 }} >
                        <span className="block text-[#06B6D4] text-2xl sm:text-3xl md:text-4xl font-semibold mb-2"> Unlock Your Potential </span> With Our Core Strengths
                    </motion.h2>
                    {/* GRID: The grid stacks on mobile (grid-cols-1) and expands on larger screens. Perfect. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {differentiators.map((differentiator, index) => (
                            <motion.div key={index} className="relative group rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-[1.02] hover:rotate-1 hover:shadow-2xl feature-card-glow border-2 border-transparent hover:border-blue-500" style={{ background: `linear-gradient(145deg, ${["#1E3A8A", "#172C6B", "#1A2B5B", "#1C2E60"][index % 4]}, ${["#101C46", "#0D193B", "#111D44", "#12204F"][index % 4]})` }} initial={{ opacity: 0, y: 50, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }} viewport={{ once: true, amount: 0.4 }} >
                                <div className="mb-6 w-20 h-20 bg-[#7A85C1] rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:bg-blue-400 group-hover:shadow-lg group-hover:shadow-inner">
                                    {differentiator.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white"> {differentiator.title} </h3>
                                <p className="text-base text-blue-200"> {differentiator.description} </p>
                                <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY TITLE: Adjusted padding and font sizes for mobile readability. */}
            <section className="py-16 sm:py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 mb-4" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.5 }} >
                        Enhance Your Brand’s Potential With
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1A2A80] to-[#3B38A0]"> Our Various ATL Formats </span>
                    </motion.h2>
                    <motion.div className="mt-6 w-32 h-2 mx-auto bg-gradient-to-r from-[#1A2A80] to-[#3B38A0] rounded-full" initial={{ width: 0 }} whileInView={{ width: "8rem" }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }} ></motion.div>
                </div>
            </section>

            {/* GALLERY: The grid is already perfectly responsive. Mobile gets 2 columns, which is a good choice for these cards. */}
            <section className="py-12 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
                 {/* GRID: Changed to 1 column on smallest screens for better vertical flow. */}
                <motion.div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ staggerChildren: 0.08 }} >
                    {atlServices.map((item, idx) => (
                        <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 50, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }} className="group relative h-72 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flip-card" >
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                <Link to={item.url} className="block w-full h-full">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-4 text-white">
                                            <h3 className="text-xl font-bold">{item.name}</h3>
                                        </div>
                                    </Link>
                                </div>
                                <div className="flip-card-back">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.name}</h3>
                                    <p className="text-center text-sm px-4">
                                        Explore our {item.name.toLowerCase()} services to amplify your brand's reach and impact.
                                    </p>
                                <Link to={item.url} className="mt-6 inline-block bg-white text-[#1A2A80] font-semibold py-2 px-5 sm:px-6 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300 text-sm" >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA: Adjusted padding and font sizes for mobile. */}
            <section className="relative py-16 sm:py-20 px-6 text-white text-center overflow-hidden bg-[#1A2A80]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1A2A80] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#7A85C1] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#B2B0E8] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 sm:mb-8 text-white drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.5 }} >
                        <span className="block text-blue-100 text-2xl sm:text-3xl font-semibold mb-2">
                            Ready to Make an Impact?
                        </span>
                        Take Your Brand Further With ATL
                    </motion.h2>
                    <motion.p className="text-base sm:text-lg md:text-xl font-light opacity-95 mb-10 sm:mb-12 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true, amount: 0.5 }} >
                        Let’s explore how our bold{" "} <span className="font-semibold text-white">ATL strategies</span> together can amplify your voice in the marketplace.
                    </motion.p>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }} viewport={{ once: true }} >
                        <button
                            onClick={openModal}
                            className="py-3 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full text-[#1A2A80] bg-white shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                        >
                            Get In Touch
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default ATLMarketing;