import React, { useEffect, useState, useCallback } from "react";
import {
  MapPin, ShoppingBag, BarChart, Rocket, PhoneCall, Building, Bus, TrainFront, Megaphone, Tv, Users, Shuffle, AreaChart, X, ChevronRight, ChevronsDown, User, Phone, Briefcase, Send,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useTransform, useSpring } from "framer-motion";

// --- FONT & STYLES ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap');
      body { font-family: 'Raleway', sans-serif; background-color: #ffffff; }
      .brand-color-text { color: #1a2a80; }
      .custom-scrollbar::-webkit-scrollbar { width: 8px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    `}
  </style>
);

// --- Reusable Custom Hook for 3D Tilt Effect ---
const useTiltEffect = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
    const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
};

// --- Interactive Mouse-Following Gradient Background ---
const InteractiveGradientBackground = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        const updateMousePosition = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, [x, y]);

    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50">
            <motion.div
                className="absolute inset-0 z-0 opacity-20"
                style={{ background: `radial-gradient(600px circle at ${x.get()}px ${y.get()}px, rgba(26, 42, 128, 0.4), transparent 80%)` }}
            />
        </div>
    );
};

// --- StatCard Component ---
const StatCard = React.memo(({ icon, label, value, description }) => {
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTiltEffect();
    return (
        <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1000px' }} className="w-full">
            <div className="relative w-full p-6 bg-white/60 border border-slate-200/80 rounded-2xl backdrop-blur-lg shadow-xl h-full">
                <div style={{ transform: 'translateZ(40px)' }} className="flex flex-col h-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1a2a80] p-3 rounded-lg text-white">{icon}</div>
                        <div>
                            <p className="text-3xl lg:text-4xl font-bold text-slate-900">{value}</p>
                            <p className="text-slate-600 font-semibold">{label}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-500 text-sm flex-grow text-left">{description}</p>
                </div>
            </div>
        </motion.div>
    );
});

// --- Request Callback Modal Component ---
const RequestCallbackModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', company: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Callback Request Submitted:", formData);
        alert(`Thank you, ${formData.name}! We will call you back shortly.`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request a Callback</h2>
                        <p className="text-slate-500 mb-6">Our team will get back to you within 24 hours.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2a80] focus:border-transparent outline-none transition" />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2a80] focus:border-transparent outline-none transition" />
                            </div>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" name="company" placeholder="Company Name (Optional)" value={formData.company} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2a80] focus:border-transparent outline-none transition" />
                            </div>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#1a2a80] text-white font-bold py-3 px-4 rounded-lg transition-transform hover:scale-105 shadow-lg shadow-indigo-900/20 text-lg mt-4">
                                <Send size={20} />
                                Submit Request
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Hero Section with UPDATED North India Content ---
const ModernHeroSection = ({ onOpenModal }) => {
    const handleScrollClick = (e) => {
        e.preventDefault();
        document.getElementById('media-finder-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 py-24">
            <InteractiveGradientBackground />
            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tight"
                >
                    <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }} className="block">Unforgettable Advertising,</motion.span>
                    <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }} className="brand-color-text block mt-2">Unmissable Results.</motion.span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }} className="mt-6 max-w-2xl text-lg md:text-xl text-slate-600">
                    From bustling metropolitan centres to key transport hubs, we place your brand in the path of millions across North India.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.6 }} className="mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        icon={<MapPin size={28} />} 
                        value="40+" 
                        label="Cities Covered" 
                        description="Our network spans major commercial and transit hubs, putting your brand at the heart of the action where it matters most." 
                    />
                    <StatCard 
                        icon={<ShoppingBag size={28} />} 
                        value="100+" 
                        label="Brands Served" 
                        description="From national industry leaders to cherished local favourites, brands trust us to deliver their message with impact and precision." 
                    />
                    <StatCard 
                        icon={<BarChart size={28} />} 
                        value="2M+" 
                        label="Monthly Impressions" 
                        description="Generate massive brand awareness with strategically placed media that guarantees millions of views each month." 
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.8 }} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a href="#media-finder-section" onClick={handleScrollClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-3 bg-[#1a2a80] text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-indigo-900/30 text-lg">
                        <Rocket size={20} /> Start Your Campaign
                    </motion.a>
                    <motion.button onClick={onOpenModal} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center gap-3 bg-white text-slate-800 font-bold py-4 px-8 rounded-lg border-2 border-slate-300 text-lg">
                        <PhoneCall size={20} /> Request a Callback
                    </motion.button>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <a href="#media-finder-section" onClick={handleScrollClick} className="text-slate-500">
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                        <ChevronsDown size={28} />
                    </motion.div>
                </a>
            </motion.div>
        </section>
    );
};

// --- DATA SOURCE & OTHER COMPONENTS ---
const dashboardData = { states: [ { name: "Punjab", cities: ["Ludhiana", "Amritsar", "Jalandhar"] }, { name: "Haryana", cities: ["Gurugram", "Faridabad"] }, { name: "Delhi-NCR", cities: ["New Delhi", "Noida"] }, { name: "Rajasthan", cities: ["Jaipur", "Jodhpur"] } ], availability: { Ludhiana: [ { id: 1, title: 'Feroze Gandhi Market Hoarding', type: 'Hoardings', category: 'ATL', image: 'https://images.pexels.com/photos/1649683/pexels-photo-1649683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'Shoppers, Corporate', impressions: '2.5M/month' }, { id: 2, title: 'City Circuit Bus Fleet', type: 'Bus Branding', category: 'ATL', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'General Commuters', impressions: '4.2M/month' } ], Jaipur: [ { id: 3, title: 'World Trade Park Digital Screen', type: 'Digital OOH', category: 'ATL', image: 'https://images.pexels.com/photos/226589/pexels-photo-226589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', audience: 'High-End Shoppers', impressions: '3.1M/month' }] } };
const categoryStyleMap = { ATL: { icon: <Tv size={14} />, color: "text-blue-700", border: "border-blue-700" }, BTL: { icon: <Users size={14} />, color: "text-pink-700", border: "border-pink-700" }, TTL: { icon: <Shuffle size={14} />, color: "text-amber-700", border: "border-amber-700" } };

// --- Media Finder Section with North India Content ---
const MediaFinderSection = () => { 
    const [selectedState, setSelectedState] = useState(dashboardData.states[0].name); 
    const [selectedCity, setSelectedCity] = useState(dashboardData.states[0].cities[0]); 
    const [modalItem, setModalItem] = useState(null); 
    const results = dashboardData.availability[selectedCity] || []; 
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }; 
    const itemVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }; 
    return ( 
        <section id="media-finder-section" className="w-full bg-gray-50 text-black py-16 sm:py-20 px-4 sm:px-6 lg:px-8"> 
            <div className="max-w-screen-2xl mx-auto"> 
                <div className="text-center mb-12 sm:mb-16"> 
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 tracking-wide brand-color-text">Find Your Perfect Ad Space</h2> 
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Filter by state and city to explore our real-time inventory of billboards, transit ads, and more. Your ideal campaign launchpad is just a few clicks away.</p> 
                </div> 
                <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-8 md:min-h-[70vh]"> 
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-lg"> 
                        <h3 className="text-xl font-bold mb-4 px-2 text-black">Select Location</h3> 
                        <div className="overflow-y-auto custom-scrollbar flex-grow"> 
                            <LayoutGroup> 
                                <ul className="space-y-2"> 
                                    {dashboardData.states.map(state => ( 
                                        <li key={state.name} className="bg-gray-100/60 rounded-lg"> 
                                            <motion.button layout onClick={() => setSelectedState(state.name)} className="w-full text-left p-3 flex justify-between items-center text-gray-800"> 
                                                <span className="font-semibold">{state.name}</span> 
                                                <motion.div animate={{ rotate: selectedState === state.name ? 90 : 0 }}><ChevronRight size={18} /></motion.div> 
                                            </motion.button> 
                                            <AnimatePresence> 
                                                {selectedState === state.name && ( 
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-4 pb-2 pr-2"> 
                                                        {state.cities.map(city => ( 
                                                            <button key={city} onClick={() => setSelectedCity(city)} className={`w-full text-left p-2.5 my-1 rounded-md text-sm transition-colors ${selectedCity === city ? 'bg-[#1a2a80] text-white font-bold' : 'text-gray-700 hover:bg-gray-200/70' }`}>{city}</button> 
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
                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col shadow-lg"> 
                        <div className="flex-shrink-0 mb-6"> 
                            <h3 className="text-xl sm:text-2xl font-bold text-black">Available Media in <span className="text-[#1a2a80]">{selectedCity}</span></h3> 
                            <p className="text-gray-600">{results.length} opportunities found</p> 
                        </div> 
                        <AnimatePresence mode="wait"> 
                            <motion.div key={selectedCity} variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="flex-grow overflow-y-auto custom-scrollbar -mr-2 pr-2"> 
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5"> 
                                    {results.length > 0 ? ( 
                                        results.map(spot => { const categoryStyle = categoryStyleMap[spot.category] || {}; return ( 
                                            <motion.div key={spot.id} variants={itemVariants} onClick={() => setModalItem(spot)} className="relative group cursor-pointer"> 
                                                <div className="relative bg-white rounded-lg overflow-hidden h-full border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1"> 
                                                    <div className="overflow-hidden h-40"><img src={spot.image} alt={spot.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" /></div> 
                                                    <div className="p-4"><p className={`text-xs font-semibold flex items-center gap-1.5 ${categoryStyle.color}`}>{categoryStyle.icon} {spot.type}</p><h4 className="font-bold text-base text-black mt-1 truncate">{spot.title}</h4></div> 
                                                </div> 
                                            </motion.div> 
                                        ); }) 
                                    ) : (<div className="col-span-full h-full flex items-center justify-center text-gray-500"><p>No media found for this city.</p></div>)} 
                                </div> 
                            </motion.div> 
                        </AnimatePresence> 
                    </div> 
                </div> 
            </div> 
            <AnimatePresence>{modalItem && <DetailModal item={modalItem} onClose={() => setModalItem(null)} />}</AnimatePresence> 
        </section> 
    ); 
};

const DetailModal = ({ item, onClose }) => { if (!item) return null; const categoryStyle = categoryStyleMap[item.category] || {}; return ( <AnimatePresence> <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto"> <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 200 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl my-8 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"> <div className="w-full md:w-1/2 md:h-auto h-64"><img src={item.image} alt={item.title} className="w-full h-full object-cover" /></div> <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col"> <div className="flex-grow"> <div className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full border-2 ${categoryStyle.border} ${categoryStyle.color} bg-gray-100 mb-3`}>{categoryStyle.icon} {item.category} Campaign</div> <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">{item.title}</h2> <p className="text-gray-600 mb-6">{item.type}</p> <div className="space-y-3 text-gray-800 text-sm"> <div className="flex items-center gap-3"><Users size={20} className="text-[#1a2a80] flex-shrink-0" /><div><p className="font-semibold">Target Audience</p><p className="text-gray-600">{item.audience}</p></div></div> <div className="flex items-center gap-3"><AreaChart size={20} className="text-[#1a2a80] flex-shrink-0" /><div><p className="font-semibold">Est. Monthly Impressions</p><p className="text-gray-600">{item.impressions}</p></div></div> </div> </div> <div className="mt-8 flex flex-col sm:flex-row gap-4"> <button className="w-full bg-[#1a2a80] text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-opacity-90">Get a Quote</button> <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold p-3 rounded-lg hover:bg-gray-300 transition-colors"><X size={20} /></button> </div> </div> </motion.div> </motion.div> </AnimatePresence> ); };
const AdvertisingMediaSection = () => { const mediaTypes = [ { icon: <Building className="w-12 h-12 text-[#1a2a80]" />, title: "Hoardings & Billboards", description: "Capture attention on the busiest roads across North India with bold visuals." }, { icon: <Bus className="w-12 h-12 text-[#1a2a80]" />, title: "Bus Branding", description: "Transform city buses into impactful brand ambassadors." }, { icon: <TrainFront className="w-12 h-12 text-[#1a2a80]" />, title: "Metro & Railway Ads", description: "Engage daily commuters at key metro and railway locations." }, { icon: <Megaphone className="w-12 h-12 text-[#1a2a80]" />, title: "Unipoles & Gantry Signs", description: "Stand tall with unskippable displays on major highways." }, { icon: <MapPin className="w-12 h-12 text-[#1a2a80]" />, title: "Airport Advertising", description: "Engage with prestigious audiences at major airports." }, { icon: <Building className="w-12 h-12 text-[#1a2a80]" />, title: "Mall & Retail Branding", description: "Engage shoppers at top malls with creative placements." } ]; return ( <section className="bg-white pt-16 pb-24 px-4 sm:px-8 md:px-12"> <div className="max-w-7xl mx-auto text-center"> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"> {mediaTypes.map((media, index) => ( <motion.div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100"> <div className="mb-6 bg-indigo-50 p-4 rounded-full">{media.icon}</div> <h3 className="text-xl font-bold text-black mb-3">{media.title}</h3> <p className="text-gray-600 text-base leading-relaxed">{media.description}</p> </motion.div> ))} </div> </div> </section> ); };

// --- MAIN PAGE COMPONENT ---
const Media = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <FontStyles />
            <RequestCallbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <ModernHeroSection onOpenModal={() => setIsModalOpen(true)} />

            <div className="bg-white">
                <MediaFinderSection />
                <div className="max-w-screen-xl mx-auto w-full">
                    <div className="max-w-4xl mx-auto text-center py-16 px-4">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-3 leading-tight">Discover Effective Outdoor Solutions</h2>
                        <p className="text-base md:text-xl mb-0 max-w-2xl mx-auto text-gray-600">From city center hotspots to vibrant corners, our diverse outdoor media connects your brand with audiences wherever they move.</p>
                    </div>
                    <AdvertisingMediaSection />
                </div>
            </div>
        </>
    );
};

export default Media;