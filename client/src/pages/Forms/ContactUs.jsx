import React, { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Smile, MessageSquareText, Clock, Headset, Globe as LucideGlobe } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Lottie from "lottie-react";
import { useSendContactInquiryMutation } from "../../features/auth/contactUs";

// Defines the styles for the orbit and float animations
const animationStyles = `
    :root {
      --primary-blue: #1a2a80;
      --secondary-yellow: #facc15;
      --tertiary-purple: #8b5cf6;
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
      100% { transform: translateY(0px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes pulse-glow {
      0%, 100% {
        transform: scale(1);
        opacity: 0.6;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
    @keyframes pulse-glow-2 {
      0%, 100% {
        transform: scale(0.9);
        opacity: 0.4;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.8;
      }
    }
    /* This keyframe animation handles the rotation for the outer circle */
    @keyframes orbit-outer {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    /* This keyframe animation handles the rotation for the inner circle */
    @keyframes orbit-inner {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes icon-float {
      0% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-3px) rotate(1deg); }
      50% { transform: translateY(0px) rotate(0deg); }
      75% { transform: translateY(3px) rotate(-1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
        animation: spin 30s linear infinite;
    }
`;

// The JSON data for your Lottie animation
const lottieAnimationData = {
    src: "https://lottie.host/a12f93b1-0872-4cb7-acb3-6b00363d7509/40tCm2hisF.json"
};

// Variants for staggered entrance animation
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// Component for the promise feature cards (original)
const PromiseFeatureCard = ({ icon: Icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`flex flex-col items-center text-center p-8 rounded-2xl shadow-lg transition-colors duration-300 bg-white`}
        >
            <div className={`w-16 h-16 flex items-center justify-center mb-4 rounded-full bg-yellow-400`}>
                <Icon className="w-12 h-12 text-primary-blue" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </motion.div>
    );
};

// The ContactUsPage component
const ContactUsPage = () => {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, amount: 0.3 });

    const [animationData, setAnimationData] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
    const [sendInquiry, { isLoading }] = useSendContactInquiryMutation();

    useEffect(() => {
        const fetchAnimation = async () => {
            try {
                const response = await fetch("https://lottie.host/a12f93b1-0872-4cb7-acb3-6b00363d7509/40tCm2hisF.json");
                const data = await response.json();
                setAnimationData(data);
            } catch (error) {
                console.error("Error fetching Lottie animation data:", error);
            }
        };

        fetchAnimation();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ message: '', type: '' });

        try {
            await sendInquiry(formData).unwrap();
            setSubmitStatus({ message: 'Message sent successfully!', type: 'success' });
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error('Failed to send message:', err);
            setSubmitStatus({ message: 'Failed to send message. Please try again.', type: 'error' });
        }
    };

    // Icons for the two different orbital paths
    const outerNodes = [
        { icon: MessageCircle, angle: 0 },
        { icon: Phone, angle: 90 },
        { icon: Mail, angle: 180 },
        { icon: LucideGlobe, angle: 270 },
    ];

    const innerNodes = [
        { icon: LucideGlobe, angle: 45 },
        { icon: Headset, angle: 135 },
        { icon: Clock, angle: 225 },
        { icon: Smile, angle: 315 },
    ];

    return (
        <>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }
                `}
                {animationStyles}
            </style>

            {/* Main Container */}
            <div className="min-h-screen flex flex-col items-center bg-gray-100 font-poppins text-gray-800">

                {/* Hero Section - Original */}
                <div className="w-full flex justify-center px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Left Section */}
                        <div className="bg-[#1a2a80] text-white p-10 lg:p-16 flex flex-col justify-center">
                            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                                Let’s Advertise <span className="text-yellow-400">Something Great</span>
                            </h1>
                            <p className="text-lg text-gray-200 mb-12">
                                Reach out to us and we’ll get back to you as soon as possible.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-8">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Mail className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <a href="mailto:hello@yourwebsite.com" className="text-gray-300 hover:text-yellow-400 transition">
                                            hello@yourwebsite.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Phone className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <a href="tel: 01614668602" className="text-gray-300 hover:text-yellow-400 transition">
                                            0161-4668602
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <MapPin className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Location</h3>
                                        <p className="text-gray-300">
                                            Feroze gandhi market <br /> ludhiana, punjab
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Form */}
                        <div className="p-10 lg:p-16 bg-gray-50 flex items-center">
                            <div className="w-full">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#1a2a80] focus:border-[#1a2a80] shadow-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#1a2a80] focus:border-[#1a2a80] shadow-sm outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#1a2a80] focus:border-[#1a2a80] shadow-sm outline-none"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center space-x-2 bg-[#1a2a80] text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:bg-[#152063] transition disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                <span>Submit</span>
                                            </>
                                        )}
                                    </motion.button>
                                    
                                    {submitStatus.message && (
                                        <p className={`mt-4 text-center ${submitStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                            {submitStatus.message}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* The Section We Were Working On - Updated with new Heading and perfect circles */}
                <div ref={sectionRef} className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden py-20 pb-40 z-10 bg-gray-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-100 to-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-96 h-96 rounded-full bg-secondary-yellow/30 animate-[pulse-glow_4s_ease-in-out_infinite] blur-2xl"></div>
                        <div className="absolute w-80 h-80 rounded-full bg-tertiary-purple/20 animate-[pulse-glow-2_4s_ease-in-out_infinite_2s] blur-xl"></div>
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        className="relative z-10 text-center flex flex-col items-center max-w-6xl mx-auto px-4"
                    >
                        {/* NEW DESIGNED HEADING */}
                        <motion.div
                            variants={itemVariants}
                            className="mb-8 md:mb-12"
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a2a80] tracking-tight drop-shadow-lg leading-snug">
                                Step Inside Our World
                            </h2>
                            <p className="text-gray-600 mt-2 md:mt-4 text-lg max-w-xl mx-auto">
                                Explore our services and take a virtual tour of our innovative space.
                            </p>
                        </motion.div>

                        {/* This is the newly made responsive section */}
                        <motion.div
                            variants={itemVariants}
                            className="relative w-full aspect-square max-w-[500px] flex justify-center items-center mt-12 md:mt-16"
                        >
                            {/* Outer Orbit with responsive sizing */}
                            <div className="absolute w-full h-full md:w-[700px] md:h-[700px] rounded-full border border-purple-400/20 z-0 animate-[orbit-outer_60s_linear_infinite]">
                                {outerNodes.map((node, index) => (
                                    <motion.div
                                        key={`outer-${index}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                                        className="absolute inset-0 flex justify-center items-center"
                                        style={{ transform: `rotate(${node.angle}deg)` }}
                                    >
                                        <motion.div
                                            className="absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer group animate-[icon-float_4s_ease-in-out_infinite]"
                                            whileHover={{ scale: 1.15 }}
                                        >
                                            <div className="relative flex items-center justify-center w-14 h-14">
                                                <div className="absolute w-full h-full bg-primary-blue/50 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
                                                <div className="relative flex items-center justify-center w-12 h-12 bg-white/80 border border-purple-400/50 rounded-full backdrop-blur-sm transition-all group-hover:scale-105">
                                                    <node.icon size={22} className="text-primary-blue" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Inner Orbit with responsive sizing */}
                            <div className="absolute w-[80%] h-[80%] md:w-[500px] md:h-[500px] rounded-full border border-purple-400/20 z-0 animate-[orbit-inner_40s_linear_infinite]">
                                {innerNodes.map((node, index) => (
                                    <motion.div
                                        key={`inner-${index}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 1.3 + index * 0.2 }}
                                        className="absolute inset-0 flex justify-center items-center"
                                        style={{ transform: `rotate(${node.angle}deg)` }}
                                    >
                                        <motion.div
                                            className="absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer group animate-[icon-float_4s_ease-in-out_infinite_1s]"
                                            whileHover={{ scale: 1.15 }}
                                        >
                                            <div className="relative flex items-center justify-center w-12 h-12">
                                                <div className="absolute w-full h-full bg-secondary-yellow/50 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
                                                <div className="relative flex items-center justify-center w-10 h-10 bg-white/80 border border-purple-400/50 rounded-full backdrop-blur-sm transition-all group-hover:scale-105">
                                                    <node.icon size={18} className="text-primary-blue" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Central Lottie animation with responsive sizing */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 flex justify-center items-center rounded-full overflow-hidden"
                            >
                                {animationData && (
                                    <Lottie
                                        animationData={animationData}
                                        loop={true}
                                        autoplay={true}
                                        className="w-full h-full"
                                    />
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Final Section: Our Commitment to You - Updated Heading */}
                <div className="w-full flex flex-col justify-center items-center relative overflow-hidden font-poppins p-8 md:p-16 z-10 bg-gray-50">
                    <div className="relative z-10 text-center flex flex-col items-center w-full max-w-6xl mx-auto">
                        {/* Original Heading Design */}
                        <div className="flex flex-col items-center mb-4">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a2a80] tracking-tight">Our Commitment to You</h2>
                            <div className="w-24 h-1 bg-gray-400 mt-4 rounded-full"></div>
                        </div>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">Fast response, expert guidance, and a smile every time you reach out.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-12">
                            <PromiseFeatureCard
                                icon={Clock}
                                title="Quick Replies"
                                description="We ensure a rapid response to all your inquiries and requests."
                            />
                            <PromiseFeatureCard
                                icon={Headset}
                                title="Personalized Support"
                                description="Get tailored support from a dedicated team that understands your needs."
                            />
                            <PromiseFeatureCard
                                icon={Smile}
                                title="Friendly Experts"
                                description="Our team of friendly professionals is ready to provide expert guidance."
                            />
                            <PromiseFeatureCard
                                icon={MessageSquareText}
                                title="24/7 Assistance"
                                description="We are here to help you around the clock, whenever you need us."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsPage;