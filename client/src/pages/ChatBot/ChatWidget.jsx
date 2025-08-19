import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FaTachometerAlt, FaDesktop, FaBus, FaBuilding, FaMapMarkedAlt, 
    FaCalculator, FaBookOpen, FaPencilRuler, FaPlaneDeparture, FaStar, 
    FaMapMarkerAlt, FaFileInvoiceDollar, FaChevronDown, FaTags, FaArrowLeft, 
    FaPaperPlane, FaMicrophone, FaFilm, FaTrain, FaHandshake, FaPaintBrush, 
    FaBullhorn, FaChartLine, FaLightbulb, FaBriefcase, FaSearch,
    FaCommentDots, FaPhone, FaQuestionCircle // Icons
} from 'react-icons/fa';
import io from 'socket.io-client';
import { useInitiateLiveChatMutation } from '../../features/auth/chatBot';

// ===================================================================
// 1. Styles for the UI
// ===================================================================
const styles = {
    // Keyframes are now injected directly in the component style tag for clarity
    
    // --- UPDATED: Sized down for the new, smaller opener ---
    chatOpenerContainer: (isOpen) => ({
        position: 'fixed', bottom: '25px', right: '25px', width: '64px', height: '64px',
        cursor: 'pointer', zIndex: '9999',
        transform: isOpen ? 'scale(0)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    
    // Main Chat Window (UNCHANGED)
    chatWindow: (isVisible) => ({
        position: 'fixed', bottom: '20px', right: '20px', width: '380px', maxHeight: 'min(650px, 90vh)',
        backgroundColor: '#FFFFFF', borderRadius: '16px', color: '#1F2937', zIndex: '10000',
        boxShadow: '0 15px 35px -5px rgba(0,0,0,0.15), 0 5px 15px -5px rgba(0,0,0,0.05)',
        border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
    }),

    // Header (UNCHANGED)
    chatHeader: {
        padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid #E5E7EB', flexShrink: 0,
        backgroundColor: '#6C63FF', color: 'white', borderRadius: '15px 15px 0 0',
        backgroundImage: 'linear-gradient(45deg, #4F46E5, #8B5CF6)',
    },
    headerBranding: { display: 'flex', alignItems: 'center', gap: '0.75rem', },
    avatar: {
        width: '44px', height: '44px', borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', fontWeight: 'bold',
        border: '2px solid rgba(255,255,255,0.4)',
    },
    headerTextContainer: { display: 'flex', flexDirection: 'column', },
    headerTitle: { margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'white', },
    headerStatus: { margin: 0, fontSize: '0.8rem', color: '#C4B5FD', display: 'flex', alignItems: 'center', gap: '6px', },
    statusDot: { width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', },
    closeButton: {
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
        fontSize: '1.5rem', cursor: 'pointer', padding: 0,
        transition: 'color 0.2s ease',
    },

    // (The rest of the styles object is unchanged...)
    // ...
    quickRepliesContainer: {
        padding: '1rem 1.5rem', borderTop: '1px solid #E5E7EB',
        flexShrink: 0, display: 'flex', justifyContent: 'center',
        position: 'relative',
    },
    quickReplyButton: (isHovered) => ({
        background: isHovered ? 'linear-gradient(45deg, #4F46E5, #8B5CF6)' : '#F3F4F6',
        border: `1px solid ${isHovered ? '#4F46E5' : '#D1D5DB'}`,
        borderRadius: '25px', padding: '0.6rem 1.25rem',
        fontSize: '0.85rem', fontWeight: '600',
        color: isHovered ? 'white' : '#4B5563',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
        gap: '0.6rem', transition: 'all 0.3s ease-out',
        boxShadow: isHovered ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    }),
    greetingArea: { padding: '1.5rem 1.5rem 0.5rem 1.5rem', flexShrink: 0 },
    greetingTitle: { margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' },
    greetingText: { margin: 0, color: '#4B5563', lineHeight: '1.5' },
    contentArea: { flexGrow: 1, overflowY: 'auto', padding: '0 1.5rem 1rem', },
    accordionMenu: { marginTop: '1.5rem' },
    accordionSection: { borderBottom: '1px solid #E5E7EB' },
    accordionHeader: {
        width: '100%', background: 'none', border: 'none',
        padding: '1rem 0', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    accordionTitleContainer: { display: 'flex', alignItems: 'center', gap: '1rem' },
    accordionIcon: { color: '#6C63FF', fontSize: '1.2rem' },
    accordionTitle: { fontSize: '1rem', fontWeight: '600', color: '#374151' },
    accordionChevron: (isOpen) => ({
        color: '#9CA3AF',
        transition: 'transform 0.3s ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    accordionContent: { padding: '0.5rem 0 1rem 0' },
    accordionGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
    gridButton: {
        background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px',
        padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '8px',
        cursor: 'pointer', textAlign: 'center', height: '100px',
        transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    gridButtonIcon: (color) => ({ color: color || '#6C63FF', fontSize: '2rem' }),
    gridButtonText: { fontSize: '0.8rem', color: '#374151', fontWeight: '500', lineHeight: '1.2' },
    offersView: { flexGrow: 1, overflowY: 'auto', padding: '1.5rem 1.5rem', },
    offersHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', },
    backButton: {
        background: 'none', border: 'none', color: '#6B7280', fontSize: '1.25rem',
        cursor: 'pointer', padding: '0', transition: 'color 0.2s ease',
    },
    offersTitle: { margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', },
    offerItem: {
        marginBottom: '1.25rem', padding: '1.25rem', backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    offerItemTitle: { margin: '0 0 0.5rem 0', fontWeight: '600', color: '#4F46E5', },
    offerItemDesc: { margin: 0, color: '#4B5563', fontSize: '0.9rem', lineHeight: '1.4' },
    inputArea: {
        display: 'flex', alignItems: 'center', padding: '1rem 1.5rem',
        borderTop: '1px solid #E5E7EB', gap: '0.75rem', flexShrink: 0,
    },
    textInput: {
        flexGrow: 1, border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB',
        borderRadius: '25px', padding: '0.75rem 1.25rem', color: '#111827',
        outline: 'none', fontSize: '1rem',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    micButton: {
        background: 'none', border: 'none', color: '#6C63FF', fontSize: '1.75rem',
        cursor: 'pointer', padding: '0', transition: 'color 0.2s ease',
    },
    chatConversation: {
        flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem',
        padding: '1.5rem 1.5rem 1rem', overflowY: 'auto',
    },
    userMessage: {
        alignSelf: 'flex-end', backgroundColor: '#6C63FF', color: 'white',
        padding: '0.8rem 1.2rem', borderRadius: '20px 20px 5px 20px',
        maxWidth: '75%', fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        lineHeight: '1.4',
    },
    botMessage: {
        alignSelf: 'flex-start', backgroundColor: '#F3F4F6', color: '#111827',
        padding: '0.8rem 1.2rem', borderRadius: '20px 20px 20px 5px',
        maxWidth: '75%', fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        lineHeight: '1.4',
    },
};

// ===================================================================
// 2. NEW Chat Opener Component
// ===================================================================
const RippleChatOpener = ({ isHovered }) => {
    const keyframes = `
        @keyframes ripple-effect {
            0% { transform: scale(0.9); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;

    const containerStyle = {
        position: 'relative',
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const rippleBaseStyle = {
        position: 'absolute',
        borderRadius: '50%',
        border: '2px solid rgba(79, 70, 229, 0.4)',
        animation: `ripple-effect 2s infinite cubic-bezier(0, 0, 0.2, 1)`,
        pointerEvents: 'none',
    };

    const iconButtonStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.75rem',
        backgroundImage: 'linear-gradient(45deg, #4F46E5, #8B5CF6)',
        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3), 0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    };
    
    const hoverTextStyle = {
        position: 'absolute',
        right: 'calc(100% + 16px)',
        padding: '8px 16px',
        backgroundColor: 'white',
        color: '#4F46E5',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
    };

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                {/* Ripples for attention */}
                <div style={{ ...rippleBaseStyle, width: '100%', height: '100%' }} />
                <div style={{ ...rippleBaseStyle, width: '100%', height: '100%', animationDelay: '1s' }} />

                {/* The main button */}
                <div style={iconButtonStyle}>
                    <FaCommentDots style={{ transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)', transition: 'transform 0.3s ease' }} />
                </div>
                
                {/* Text that appears on hover */}
                <div style={hoverTextStyle}>
                    Chat with us!
                </div>
            </div>
        </>
    );
};


// ===================================================================
// 3. Unchanged Logic Components
// ===================================================================
const ConfettiEffect = () => {
    const confettiColors = ['#F59E0B', '#10B981', '#4F46E5', '#EF4444', '#E53E3E'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => {
        const style = {
            position: 'absolute', top: 0, left: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 4}px`, height: `${Math.random() * 8 + 4}px`,
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            borderRadius: '50%',
            animation: `confettiFall ${Math.random() * 2 + 1.5}s ease-in-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            zIndex: 10001,
            opacity: 0,
        };
        return <div key={i} style={style} />;
    });
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {confettiPieces}
        </div>
    );
};
const QuickReplies = ({ onOffersClick }) => {
    const [isOffersHovered, setIsOffersHovered] = useState(false);
    return (
        <div style={styles.quickRepliesContainer}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    style={styles.quickReplyButton(isOffersHovered)} 
                    onClick={onOffersClick} 
                    onMouseEnter={() => setIsOffersHovered(true)} 
                    onMouseLeave={() => setIsOffersHovered(false)}
                >
                    <FaTags /> View Special Offers 
                </button>
            </div>
        </div>
    );
};
const getGreeting = () => { const hour = new Date().getHours(); if (hour < 12) return "Good Morning"; if (hour < 18) return "Good Afternoon"; return "Good Evening"; };
const GridButton = ({ item }) => { const navigate = useNavigate(); const [isHovered, setIsHovered] = useState(false); const hoverStyle = { transform: 'scale(1.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }; return (<button style={isHovered ? {...styles.gridButton, ...hoverStyle} : styles.gridButton} onClick={() => navigate(item.link)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}><span style={styles.gridButtonIcon(item.color)}>{item.icon}</span><span style={styles.gridButtonText}>{item.text}</span></button>); };
const AccordionSection = ({ section, isOpen, onToggle }) => ( <div style={styles.accordionSection}> <button style={styles.accordionHeader} onClick={onToggle}> <span style={styles.accordionTitleContainer}> <span style={styles.accordionIcon}>{section.icon}</span> <span style={styles.accordionTitle}>{section.title}</span> </span> <FaChevronDown style={styles.accordionChevron(isOpen)} /> </button> {isOpen && ( <div style={styles.accordionContent}> <div style={styles.accordionGrid}> {section.items.map(item => <GridButton key={item.text} item={item} />)} </div> </div> )} </div> );
const AccordionMenu = () => { const [openSection, setOpenSection] = useState('formats'); const ADVERTISING_DATA = [{ id: 'formats', title: 'Explore Ad Formats', icon: <FaPencilRuler size={20} />, items: [ { text: 'Billboards', icon: <FaTachometerAlt />, link: '/formats/billboards', color: '#3B82F6' }, { text: 'Digital Screens', icon: <FaDesktop />, link: '/formats/digital-ooh', color: '#10B981' }, { text: 'Transit Ads', icon: <FaBus />, link: '/formats/transit', color: '#F59E0B' }, { text: 'Mall Branding', icon: <FaBuilding />, link: '/formats/malls', color: '#8B5CF6' }, { text: 'Airport Ads', icon: <FaPlaneDeparture />, link: '/formats/airports', color: '#EF4444' }, { text: 'Custom Solutions', icon: <FaStar />, link: '/formats/custom', color: '#14B8A6' }, { text: 'Cinema Advertising', icon: <FaFilm />, link: '/formats/cinema', color: '#E53E3E' }, { text: 'Bus Shelter Ads', icon: <FaBus />, link: '/formats/bus-shelter', color: '#6B46C1' }, { text: 'Stadium Branding', icon: <FaBriefcase />, link: '/formats/stadium', color: '#E53E3E' } ] }, { id: 'locations', title: 'View Our Locations', icon: <FaMapMarkedAlt size={20} />, items: [ { text: 'Punjab', icon: <FaMapMarkerAlt/>, link: '/locations/punjab' }, { text: 'Haryana', icon: <FaMapMarkerAlt/>, link: '/locations/haryana' }, { text: 'Himachal Pradesh', icon: <FaMapMarkerAlt/>, link: '/locations/himachal' }, { text: 'Delhi', icon: <FaMapMarkerAlt/>, link: '/locations/delhi' }, { text: 'Chandigarh', icon: <FaMapMarkerAlt/>, link: '/locations/chandigarh' }, { text: 'Jammu & Kashmir', icon: <FaMapMarkerAlt/>, link: '/locations/jammu-kashmir' }, ] }, { id: 'services', title: 'Products & Services', icon: <FaCalculator size={20} />, items: [ { text: 'Request a Custom Plan', icon: <FaCalculator/>, link: '/quote' }, { text: 'View Our Portfolio', icon: <FaBookOpen/>, link: '/case-studies' }, { text: 'Consult with a Specialist', icon: <FaMicrophone/>, link: '/consult' }, { text: 'Creative & Design Services', icon: <FaPaintBrush />, link: '/design-services' }, { text: 'Event Sponsorship', icon: <FaHandshake />, link: '/sponsorship' }, { text: 'Digital Campaign Management', icon: <FaBullhorn />, link: '/digital-campaigns' }, { text: 'Outdoor Media Buying', icon: <FaTags />, link: '/media-buying' }, { text: 'Market Research & Analytics', icon: <FaChartLine />, link: '/research' }, { text: 'Branding & Activation', icon: <FaLightbulb />, link: '/branding-activation' } ] }, ]; const handleToggle = (id) => setOpenSection(prev => (prev === id ? null : id)); return <div style={styles.accordionMenu}>{ADVERTISING_DATA.map(section => <AccordionSection key={section.id} section={section} isOpen={openSection === section.id} onToggle={() => handleToggle(section.id)} />)}</div>; };
const OffersView = ({ onBack }) => { const offers = [ { title: "Monsoon Bonanza", description: "Get 20% OFF on your first billboard campaign this season. Limited time offer!" }, { title: "Digital Debut", description: "Book 2 digital screens and get a 3rd screen at 50% OFF for the first month." }, { title: "Long-Term Partner", description: "Enjoy 1 month of advertising absolutely FREE when you book any site for 6 consecutive months." }, { title: "Startup Special", description: "Are you a new business? Get special discounted rates on mall and transit advertising. Contact us to learn more." }, ]; return ( <div style={styles.offersView}> <div style={styles.offersHeader}> <button style={styles.backButton} onClick={onBack} title="Go Back"><FaArrowLeft /></button> <h2 style={styles.offersTitle}>Current Offers</h2> </div> {offers.map((offer, index) => ( <div key={index} style={styles.offerItem}> <h3 style={styles.offerItemTitle}>{offer.title}</h3> <p style={styles.offerItemDesc}>{offer.description}</p> </div> ))} </div> ); };
const ChatConversation = ({ messages }) => {
    const chatContainerRef = useRef(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div ref={chatContainerRef} style={styles.chatConversation}>
            {messages.map((msg, index) => (
                <div key={index} style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
                    {msg.text}
                </div>
            ))}
        </div>
    );
};
const ChatInput = ({ onSendMessage, placeholder, disabled }) => {
    const [input, setInput] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    return (
        <form style={styles.inputArea} onSubmit={handleSubmit}>
            <input
                style={styles.textInput}
                type="text"
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
            />
            <button type="submit" style={styles.micButton} title="Send Message" disabled={disabled}>
                <FaPaperPlane />
            </button>
        </form>
    );
};

// ===================================================================
// 4. Main ChatWidget Component
// ===================================================================
const ChatWidget = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isOpenerHovered, setIsOpenerHovered] = useState(false);
    const [currentView, setCurrentView] = useState('main');
    const [showCelebration, setShowCelebration] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversationState, setConversationState] = useState('AWAITING_INITIAL_MESSAGE');
    const [initialUserMessage, setInitialUserMessage] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [sendLeadEmail, { isLoading, isSuccess, isError, error }] = useInitiateLiveChatMutation();

    useEffect(() => {
        if (isError) {
            console.error("Failed to send lead email:", error);
            const errorMessage = { text: "Sorry, there was a technical issue sending your details. Please try again later.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        }
    }, [isSuccess, isError, error]);

    const handleSendMessage = (text) => {
        const userMessage = { text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        switch (conversationState) {
            case 'AWAITING_INITIAL_MESSAGE':
                setInitialUserMessage(text);
                const askForPhoneMsg = { text: "Thanks! Could you please provide your 10-digit phone number so our team can reach out to you?", sender: 'bot' };
                setMessages(prev => [...prev, askForPhoneMsg]);
                setConversationState('AWAITING_PHONE_NUMBER');
                break;
            case 'AWAITING_PHONE_NUMBER':
                const phoneRegex = /^\d{10}$/;
                if (phoneRegex.test(text.trim())) {
                    const capturedPhoneNumber = text.trim();
                    setUserPhoneNumber(capturedPhoneNumber);
                    sendLeadEmail({ message: initialUserMessage, phoneNumber: capturedPhoneNumber });
                    const thankYouMsg = { text: "Thank you! We've received your details and will be in touch shortly.", sender: 'bot' };
                    setMessages(prev => [...prev, thankYouMsg]);
                    setConversationState('LEAD_CAPTURED');
                } else {
                    const askAgainMsg = { text: "That doesn't seem to be a valid 10-digit number. Please provide a valid phone number.", sender: 'bot' };
                    setMessages(prev => [...prev, askAgainMsg]);
                }
                break;
            case 'LEAD_CAPTURED':
                const alreadyCapturedMsg = { text: "Our team will be in touch soon. For a new inquiry, you can refresh the page.", sender: 'bot' };
                setMessages(prev => [...prev, alreadyCapturedMsg]);
                break;
            default: break;
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleOffersClick = () => {
        setCurrentView('offers');
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
    };

    const getPlaceholderText = () => {
        switch (conversationState) {
            case 'AWAITING_INITIAL_MESSAGE': return "How can we help you today?";
            case 'AWAITING_PHONE_NUMBER': return "Enter your 10-digit phone number...";
            case 'LEAD_CAPTURED': return "Our team will contact you soon.";
            default: return "Type your message...";
        }
    };

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(650px) rotate(360deg); opacity: 0.5; }
                }
            `}</style>
            
            {/* --- UPDATED: Using the new RippleChatOpener --- */}
            <div 
                style={styles.chatOpenerContainer(isOpen)} 
                onClick={() => setIsOpen(true)} 
                onMouseEnter={() => setIsOpenerHovered(true)} 
                onMouseLeave={() => setIsOpenerHovered(false)}
                aria-label="Open chat"
                role="button"
            >
                <RippleChatOpener isHovered={isOpenerHovered} />
            </div>
            
            {isOpen && (
                <div style={styles.chatWindow(isVisible)}>
                    {showCelebration && <ConfettiEffect />}
                    <div style={styles.chatHeader}>
                        <div style={styles.headerBranding}>
                            <div style={styles.avatar}>SP</div>
                            <div style={styles.headerTextContainer}>
                                <h3 style={styles.headerTitle}>Star Publicity</h3>
                                <p style={styles.headerStatus}><span style={styles.statusDot}></span>Online</p>
                            </div>
                        </div>
                        <button style={styles.closeButton} title="Close Chat" onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    <div style={{...styles.contentArea, flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                        {messages.length > 0 ? (
                             <ChatConversation messages={messages} />
                        ) : (
                            <>
                                {currentView === 'main' && (
                                    <>
                                        <div style={styles.greetingArea}>
                                            <h2 style={styles.greetingTitle}>{getGreeting()}</h2>
                                            <p style={styles.greetingText}>Hello! How can we help you with your advertising needs today? Send us a message to get started.</p>
                                        </div>
                                        <AccordionMenu />
                                    </>
                                )}
                                {currentView === 'offers' && (
                                    <OffersView onBack={() => setCurrentView('main')} />
                                )}
                            </>
                        )}
                    </div>
                    {conversationState === 'AWAITING_INITIAL_MESSAGE' && currentView === 'main' && (
                        <QuickReplies onOffersClick={handleOffersClick} />
                    )}
                    <ChatInput 
                        onSendMessage={handleSendMessage} 
                        placeholder={getPlaceholderText()}
                        disabled={conversationState === 'LEAD_CAPTURED' || isLoading}
                    />
                </div>
            )}
        </>
    );
};

export default ChatWidget;