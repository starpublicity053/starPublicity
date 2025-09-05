import React, { useEffect, useState, useCallback } from "react";
import {
  MapPin,
  ShoppingBag,
  BarChart,
  Rocket,
  PhoneCall,
  Building,
  Bus,
  TrainFront,
  Megaphone,
  Tv,
  Users,
  Shuffle,
  AreaChart,
  Search,
  X,
  ChevronRight,
  ChevronsDown,
  User,
  Phone,
  Briefcase,
  Send,
  Wallpaper,
  Brush,
  Check, // ✅ Icon added
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { useRequestCallbackMutation } from "../../features/auth/mediaApi"; // Adjust path as needed

// --- FONT & STYLES ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap');
      .media-page-wrapper { font-family: 'Raleway', sans-serif; background-color: #ffffff; }
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
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [x, y]);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50">
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${x.get()}px ${y.get()}px, rgba(26, 42, 128, 0.4), transparent 80%)`,
        }}
      />
    </div>
  );
};

// --- StatCard Component ---
const StatCard = React.memo(({ icon, label, value, description }) => {
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } =
    useTiltEffect();
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="w-full"
    >
      <div className="relative w-full p-6 bg-white/60 border border-slate-200/80 rounded-2xl backdrop-blur-lg shadow-xl h-full">
        <div
          style={{ transform: "translateZ(40px)" }}
          className="flex flex-col h-full"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#1a2a80] p-3 rounded-lg text-white">{icon}</div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-slate-900">
                {value}
              </p>
              <p className="text-slate-600 font-semibold">{label}</p>
            </div>
          </div>
          <p className="mt-4 text-slate-500 text-sm flex-grow text-left">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

// --- ✅ NEW: Thank You Modal Component ---
const ThankYouModal = ({ isOpen, onClose }) => (
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
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
            <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-slate-500 mb-6">
            Your request has been received. We will call you back shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#1a2a80] text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-indigo-900/20"
          >
            Great!
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Request Callback Modal Component ---
const RequestCallbackModal = ({ isOpen, onClose, onSuccess }) => {
  // ✅ onSuccess prop added
  const [requestCallback, { isLoading }] = useRequestCallbackMutation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await requestCallback(formData).unwrap();
      setFormData({ name: "", phone: "", company: "" }); // Reset form
      if (onSuccess) onSuccess(); // ✅ Trigger success action
    } catch (err) {
      console.error("Failed to submit callback request:", err);
      setError(err.data?.message || "An error occurred. Please try again.");
    }
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
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-slate-800"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Request a Callback
            </h2>
            <p className="text-slate-500 mb-6">
              Our team will get back to you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2a80] focus:border-transparent outline-none transition"
                />
              </div>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2a80] focus:border-transparent outline-none transition"
                />
              </div>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name (Optional)"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a2a80] focus:border-transparent outline-none transition"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#1a2a80] text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 shadow-lg shadow-indigo-900/20 text-lg mt-4 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Hero Section ---
const ModernHeroSection = ({ onOpenModal }) => {
  // ... (This component remains unchanged)
  const handleScrollClick = (e) => {
    e.preventDefault();
    document
      .getElementById("media-finder-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-24">
      <InteractiveGradientBackground />
      <div className="relative z-10 w-full max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-tight tracking-tight"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 100 },
              },
            }}
            className="block"
          >
            Unforgettable Advertising,
          </motion.span>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 100 },
              },
            }}
            className="brand-color-text block mt-1 md:mt-2"
          >
            Unmissable Results.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-slate-600"
        >
          From bustling metropolitan centres to key transport hubs, we place
          your brand in the path of millions across North India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
          className="mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatCard
            icon={<MapPin size={28} />}
            value="40+"
            label="Cities Covered"
            description="Our network spans major commercial and transit hubs, putting your brand at the heart of the action where it matters most."
          />
          <StatCard
            icon={<ShoppingBag size={28} />}
            value="500+"
            label="Brands Served"
            description="From national industry leaders to cherished local favourites, brands trust us to deliver their message with impact and precision."
          />
          <StatCard
            icon={<BarChart size={28} />}
            value="95M+"
            label="Monthly Impressions"
            description="Generate massive brand awareness with strategically placed media that guarantees millions of views each month."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#media-finder-section"
            onClick={handleScrollClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 bg-[#1a2a80] text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg shadow-lg shadow-indigo-900/30 text-base md:text-lg"
          >
            <Rocket size={20} /> Start Your Campaign
          </motion.a>
          <motion.button
            onClick={onOpenModal}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 bg-white text-slate-800 font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg border-2 border-slate-300 text-base md:text-lg"
          >
            <PhoneCall size={20} /> Request a Callback
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a
          href="#media-finder-section"
          onClick={handleScrollClick}
          className="text-slate-500"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronsDown size={28} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};

// --- DATA SOURCE & OTHER COMPONENTS ---
// This is the updated section with all cities correctly placed under their respective states.
const dashboardData = {
  states: [
    {
      name: "Punjab",
      cities: [
        "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali",
        "Pathankot", "Hoshiarpur", "Moga", "Abohar", "Malerkotla", "Khanna",
        "Phagwara", "Firozpur", "Batala", "Kapurthala", "Sri Muktsar Sahib",
        "Barnala", "Rupnagar", "Faridkot", "Gurdaspur", "Sangrur", "Fazilka",
      ],
    },
    {
      name: "Haryana",
      cities: [
        "Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak",
        "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Jind",
        "Bahadurgarh", "Jhajjar", "Kaithal", "Rewari", "Palwal", "Kurukshetra",
        "Fatehabad", "Gohana", "Narnaul",
      ],
    },
    {
      name: "Himachal Pradesh",
      cities: [
        "Shimla", "Manali", "Dharamshala", "Kullu", "Solan", "Mandi",
        "Dalhousie", "Chamba", "Hamirpur", "Una", "Bilaspur", "Palampur",
      ],
    },
    {
      name: "Delhi-NCR",
      cities: ["New Delhi", "Noida", "Ghaziabad"],
    },
    {
      name: "Chandigarh",
      cities: ["Chandigarh"],
    },
  ],
  availability: {},
};

const mediaTemplates = {
  "Hoardings & Unipoles": {
    type: "Hoardings & Unipoles",
    category: "ATL",
    image: "/assets/media finder/unipole.png",
    audience: "General Public, Commuters",
    impressions: "Varies by location",
  },
  "Bus Branding": {
    type: "Bus Branding",
    category: "ATL",
    image: "/assets/media finder/bus branding.png",
    audience: "General Commuters, Tourists",
    impressions: "Varies by route",
  },
  "Corporate Branding": {
    type: "Corporate Branding",
    category: "BTL",
    image: "/assets/media finder/corporate branding.png",
    audience: "Businesses, Corporates, Professionals",
    impressions: "Varies by location",
  },
  "Wall Wraps": {
    type: "Wall Wraps",
    category: "BTL",
    image: "/assets/media finder/wall wrap.png",
    audience: "Shoppers, Local Residents",
    impressions: "Varies by location",
  },
  "Wall Painting": {
    type: "Wall Painting",
    category: "BTL",
    image: "/assets/media finder/wall painting.png",
    audience: "Pedestrians, Local Community",
    impressions: "Varies by location",
  },
  "Ludhiana City Bus": {
    type: "Ludhiana City Bus",
    category: "ATL",
    image: "/assets/media finder/city bus.png",
    audience: "City Commuters, Students",
    impressions: "3.8M/month",
  },
};

// --- ✅ NEW: All available media types ---
const allMediaTypes = [
  "Hoardings & Unipoles",
  "Bus Branding",
  "Corporate Branding",
  "Wall Wraps",
  "Wall Painting",
  "Ludhiana City Bus",
];

const getMediaTypeTemplate = (mediaType) => {
  return mediaTemplates[mediaType] || { type: mediaType, category: 'BTL', image: 'https://via.placeholder.com/400x300.png?text=Media', audience: 'General', impressions: 'Varies' };
};


let mediaIdCounter = 1;

dashboardData.states.forEach(state => {
  state.cities.forEach(city => {
    if (!dashboardData.availability[city]) {
      dashboardData.availability[city] = [];
    }

    allMediaTypes.forEach(mediaType => {
      // Special condition for Ludhiana City Bus
      if (mediaType === "Ludhiana City Bus" && city !== "Ludhiana") {
        return;
      }
      const template = getMediaTypeTemplate(mediaType);
      dashboardData.availability[city].push({
        ...template,
        id: mediaIdCounter++,
        title: `${city} ${mediaType}`,
      });
    });
  });
});

const categoryStyleMap = {
  ATL: {
    icon: <Tv size={14} />,
    color: "text-blue-700",
    border: "border-blue-700",
  },
  BTL: {
    icon: <Users size={14} />,
    color: "text-pink-700",
    border: "border-pink-700",
  },
  TTL: {
    icon: <Shuffle size={14} />,
    color: "text-amber-700",
    border: "border-amber-700",
  },
};
const MediaTypeModal = ({ type, details, image, onClose, onInquire }) => {
  if (!type || !details) return null;

  const handleInquireClick = () => {
    onClose(); // Close current modal
    if (onInquire) {
      onInquire(); // Open callback modal
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          <div className="w-full md:w-1/3 h-48 md:h-auto">
            <img
              src={image}
              alt={type}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg">{details.icon}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {type}
              </h2>
            </div>
            <div
              className="text-slate-600 space-y-4 overflow-y-auto custom-scrollbar pr-2"
              style={{ maxHeight: "calc(100vh - 250px)" }}
            >
              <p className="font-semibold">{details.description}</p>
              <p>{details.theory}</p>
            </div>
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <button
                onClick={handleInquireClick}
                className="flex items-center justify-center gap-2 bg-[#1a2a80] text-white font-bold py-3 px-5 rounded-lg transition-transform hover:scale-105 shadow-lg shadow-indigo-900/20"
              >
                <PhoneCall size={18} /> Inquire Now
              </button>
              <button
                onClick={onClose}
                className="bg-slate-200 text-slate-800 font-bold py-3 px-5 rounded-lg transition-colors hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
const MediaFinderSection = ({ onOpenModal }) => {
  const [selectedState, setSelectedState] = useState(
    dashboardData.states[0].name
  );
  const [selectedCity, setSelectedCity] = useState(
    dashboardData.states[0].cities[0]
  );
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');

  const availableSpots = dashboardData.availability[selectedCity] || [];
  const uniqueMediaTypes = Array.from(
    new Set(availableSpots.map((spot) => spot.type))
  );

  const handleLocationSearch = (e) => {
    setLocationSearchTerm(e.target.value);
  };

  const filteredCities = dashboardData.states
    .flatMap((state) =>
      state.cities.map((city) => ({ city, state: state.name }))
    )
    .filter(
      ({ city }) =>
        locationSearchTerm &&
        city.toLowerCase().includes(locationSearchTerm.toLowerCase())
    );

  const handleCitySelect = (city, stateName) => {
    setSelectedState(stateName);
    setSelectedCity(city);
    setLocationSearchTerm(''); // Clear search after selection
  };

  const mediaTypeDetails = {
    "Hoardings & Unipoles": {
      icon: <Building size={28} className="text-[#1a2a80]" />,
      description: "Large format billboards and unipoles on key routes.",
      theory:
        "Hoardings and Unipoles are a classic and powerful form of outdoor advertising. Placed along high-traffic roads and in key urban areas, they offer unparalleled visibility to a broad audience. Their large size makes them impossible to ignore, ensuring your brand message is seen by thousands of commuters, pedestrians, and drivers daily. They are perfect for brand-building, new product launches, and creating a massive local impact.",
    },
    "Bus Branding": {
      icon: <Bus size={28} className="text-[#1a2a80]" />,
      description: "Mobile advertising covering the entire city.",
      theory:
        "Bus branding turns public transport into moving billboards. Your advertisement travels throughout the city, reaching diverse demographics in various neighborhoods, commercial districts, and residential areas. This dynamic form of advertising ensures high-frequency exposure and a wide geographical reach, making it an excellent choice for city-wide campaigns and events.",
    },
    "Digital OOH": {
      icon: <Tv size={28} className="text-[#1a2a80]" />,
      description: "Dynamic digital screens in high-traffic areas.",
      theory:
        "Digital Out-of-Home (OOH) brings the flexibility and dynamism of online advertising to the physical world. Located in prime spots like malls, airports, and busy intersections, these screens can display video, animations, and changing messages. This allows for real-time updates, day-parting, and more engaging, contextually relevant advertising that captures modern audiences' attention.",
    },
    "Wall Wraps": {
      icon: <Wallpaper size={28} className="text-[#1a2a80]" />,
      description: "Large-scale graphics on building exteriors.",
      theory:
        "Wall wraps transform entire building facades into massive canvases for your brand. They create a high-impact, unmissable visual statement in urban environments. Ideal for high-traffic areas, they can generate significant buzz and social media sharing, making them perfect for major campaigns and brand launches.",
    },
    "Wall Painting": {
      icon: <Brush size={28} className="text-[#1a2a80]" />,
      description: "Artistic and durable hand-painted ads.",
      theory:
        "Wall paintings offer a unique, artistic, and authentic way to advertise. Hand-painted by skilled artists, these ads have a rustic charm and can become local landmarks. They are highly durable and offer a long-term presence in specific neighborhoods, connecting with the community on a deeper level.",
    },
    "Ludhiana City Bus": {
      icon: <Bus size={28} className="text-[#1a2a80]" />,
      description:
        "Exclusive branding on Ludhiana's dedicated city bus network.",
      theory:
        "Target the heart of Ludhiana with dedicated advertising on its city buses. This hyper-local approach ensures your message is seen by daily commuters, shoppers, and residents across all major routes within Ludhiana, providing high-frequency exposure to a captive urban audience.",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };
  return (
    <>
      <section
        id="media-finder-section"
        className="w-full bg-gray-50 text-black py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-screen-2xl mx-auto">
          <div className="relative text-center mb-16 sm:mb-20">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
            >
              <div className="mx-auto h-24 w-2/3 max-w-4xl rounded-full bg-indigo-400/10 blur-3xl"></div>
            </div>
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Our Advertising Network
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Explore Our Extensive Portfolio
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base text-gray-600 sm:text-lg">
                Browse our wide range of advertising solutions across North India. Filter by location to find the perfect media type for your campaign.
              </p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-8 md:min-h-[70vh]">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col shadow-lg">
              <h3 className="text-xl font-bold mb-4 px-2 text-black">
                Select Location
              </h3>
              <div className="overflow-y-auto custom-scrollbar flex-grow">
                <LayoutGroup>
                  <ul className="space-y-2">
                    {dashboardData.states.map((state) => (
                      <li
                        key={state.name}
                        className="bg-gray-100/60 rounded-lg"
                      >
                        <motion.button
                          layout
                          onClick={() => setSelectedState(state.name)}
                          className="w-full text-left p-3 flex justify-between items-center text-gray-800"
                        >
                          <span className="font-semibold">{state.name}</span>
                          <motion.div
                            animate={{
                              rotate: selectedState === state.name ? 90 : 0,
                            }}
                          >
                            <ChevronRight size={18} />
                          </motion.div>
                        </motion.button>
                        <AnimatePresence>
                          {selectedState === state.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 pb-2 pr-2"
                            >
                              {state.cities.map((city) => (
                                <button
                                  key={city}
                                  onClick={() => setSelectedCity(city)}
                                  className={`w-full text-left p-2.5 my-1 rounded-md text-sm transition-colors ${
                                    selectedCity === city
                                      ? "bg-[#1a2a80] text-white font-bold"
                                      : "text-gray-700 hover:bg-gray-200/70"
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
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col shadow-lg">
              <div className="flex-shrink-0 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-black">
                  Available Media Types in{" "}
                  <span className="text-[#1a2a80]">{selectedCity}</span>
                </h3>
                <p className="text-gray-600">
                  {uniqueMediaTypes.length} types found
                </p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {uniqueMediaTypes.length > 0 ? (
                      uniqueMediaTypes.map((type) => {
                        const representativeSpot = availableSpots.find(
                          (spot) => spot.type === type
                        );
                        const image = representativeSpot
                          ? representativeSpot.image
                          : "https://via.placeholder.com/400x300.png?text=No+Image";
                        const details = mediaTypeDetails[type] || {
                          icon: (
                            <Megaphone size={28} className="text-[#1a2a80]" />
                          ),
                          description: "Versatile advertising solutions.",
                          theory:
                            "This is a versatile advertising solution available in the selected city.",
                        };
                        return (
                          <motion.div
                            key={type}
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col group cursor-pointer"
                            onClick={() =>
                              setSelectedMedia({ type, details, image })
                            }
                          >
                            <div className="h-48 overflow-hidden">
                              <img
                                src={image}
                                alt={type}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                              <h3 className="text-lg font-bold text-black mb-2">
                                {type}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                                {details.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="col-span-full h-full flex items-center justify-center text-gray-500">
                        <p>No media types found for this city.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <MediaTypeModal
        type={selectedMedia?.type}
        details={selectedMedia?.details}
        image={selectedMedia?.image}
        onClose={() => setSelectedMedia(null)}
        onInquire={onOpenModal}
      />
    </>
  );
};
const AdvertisingMediaSection = () => {
  const mediaTypes = [
    {
      icon: <Building className="w-12 h-12 text-[#1a2a80]" />,
      title: "Hoardings & Unipoles",
      description:
        "Stand tall with unskippable displays on major highways and busiest roads.",
    },
    {
      icon: <Bus className="w-12 h-12 text-[#1a2a80]" />,
      title: "Bus Branding",
      description: "Transform city buses into impactful brand ambassadors.",
    },
    {
      icon: <TrainFront className="w-12 h-12 text-[#1a2a80]" />,
      title: "Metro & Railway Ads",
      description: "Engage daily commuters at key metro and railway locations.",
    },
    {
      icon: <MapPin className="w-12 h-12 text-[#1a2a80]" />,
      title: "Airport Advertising",
      description: "Engage with prestigious audiences at major airports.",
    },
    {
      icon: <Wallpaper className="w-12 h-12 text-[#1a2a80]" />,
      title: "Wall Wraps",
      description: "Create unmissable visual statements on building exteriors.",
    },
    {
      icon: <Brush className="w-12 h-12 text-[#1a2a80]" />,
      title: "Wall Painting",
      description:
        "Connect with communities through artistic, hand-painted advertisements.",
    },
  ];
  return (
    <section className="bg-white pb-24 px-4 sm:px-8 md:px-12">
      {" "}
      <div className="max-w-7xl mx-auto text-center">
        {" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {" "}
          {mediaTypes.map((media, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {" "}
              <div className="mb-6 bg-indigo-50 p-4 rounded-full">
                {media.icon}
              </div>{" "}
              <h3 className="text-xl font-bold text-black mb-3">
                {media.title}
              </h3>{" "}
              <p className="text-gray-600 text-base leading-relaxed">
                {media.description}
              </p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
};

// --- MAIN PAGE COMPONENT ---
const Media = () => {
  // ✅ State management for both modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  // ✅ Function to handle the successful form submission
  const handleFormSuccess = () => {
    setIsRequestModalOpen(false); // Close the form modal
    setIsThankYouModalOpen(true); // Open the thank you modal
  };

  const openRequestModal = () => setIsRequestModalOpen(true);

  return (
    <div className="media-page-wrapper">
      <FontStyles />
      <RequestCallbackModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={handleFormSuccess} // Pass the success handler
      />
      <ThankYouModal
        isOpen={isThankYouModalOpen}
        onClose={() => setIsThankYouModalOpen(false)}
      />

      <ModernHeroSection onOpenModal={openRequestModal} />

      <div className="bg-white">
        <MediaFinderSection onOpenModal={openRequestModal} />
        <div className="max-w-screen-xl mx-auto w-full">
          <div className="relative max-w-4xl mx-auto text-center pt-20 pb-16 sm:pt-24 px-4 sm:px-6 lg:px-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
            >
              <div className="mx-auto h-24 w-2/3 max-w-4xl rounded-full bg-indigo-400/10 blur-3xl"></div>
            </div>
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Comprehensive Solutions
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                A Medium for Every Message
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base text-gray-600 md:text-xl">
                From city center hotspots to vibrant corners, our diverse outdoor
                media connects your brand with audiences wherever they move.
              </p>
            </div>
          </div>
          <AdvertisingMediaSection />
        </div>
      </div>
    </div>
  );
};

export default Media;