import React, { useRef, useEffect, memo } from 'react';
// Updated import to include Instagram, Facebook, and the new X logo
import { FaLinkedin, FaInstagram, FaFacebook, FaXTwitter } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
// Import Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

//==============================================================================
// 1. DATA, HOOKS, and STATIC COMPONENTS
//==============================================================================

// Updated social links data with your specific URLs
const socialLinksData = [
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/shivam-kumar-0b17342a8/' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/starpublicityldh/' },
    { name: 'Facebook', icon: FaFacebook, href: 'https://www.facebook.com/starpublicity' },
    { name: 'X', icon: FaXTwitter, href: 'https://x.com/starpublicityld' },
];


// Canvas animation hook remains the same
const useParticleAnimation = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId; let particles = [];
        const mouse = { x: null, y: null, radius: 150 };
        class Particle {
            constructor(x, y) { this.x = x; this.y = y; this.size = 2; this.baseX = this.x; this.baseY = this.y; this.density = (Math.random() * 30) + 1; this.color = '#1a2a80'; }
            draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.closePath(); ctx.fill(); }
            update() {
                const dx = mouse.x - this.x, dy = mouse.y - this.y, distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) { const force = (mouse.radius - distance) / mouse.radius; this.x -= (dx / distance) * force * this.density; this.y -= (dy / distance) * force * this.density; }
                else { if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10; if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10; }
                this.draw();
            }
        }
        const init = () => {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight; particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        };
        const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => p.update()); animationFrameId = requestAnimationFrame(animate); };
        const handleMouseMove = (event) => { mouse.x = event.clientX; mouse.y = event.clientY; };
        const handleResize = () => init();
        window.addEventListener('mousemove', handleMouseMove); window.addEventListener('resize', handleResize);
        init(); animate();
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('resize', handleResize); };
    }, []);
    return canvasRef;
};

// SocialLink component remains the same
const SocialLink = memo(({ icon: Icon, name, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="group w-full max-w-sm flex items-center p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-black/10 group-hover:bg-[#1a2a80] transition-colors"><Icon size={20} className="text-black group-hover:text-white transition-colors" /></div>
    <span className="ml-4 text-xl font-medium group-hover:text-[#1a2a80] transition-colors">{name}</span>
  </a>
));

//==============================================================================
// 2. PROFESSIONAL-GRADE CONTACT FORM
//==============================================================================

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
  honeypot: z.string().optional(),
});

const submitApi = async (data) => {
  console.log('Submitting to API:', data);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { message: "Message sent successfully!" };
};

const ProContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const processForm = async (data) => {
    if (data.honeypot) return;
    await toast.promise(submitApi(data), {
      loading: 'Sending message...',
      success: 'Message sent successfully!',
      error: 'Oops! Something went wrong.',
    });
    reset();
  };

  return (
    <motion.form
      // Animation for the form container
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(processForm)}
      className="w-full max-w-md mt-8 space-y-6"
      noValidate
    >
      <input type="text" {...register('honeypot')} className="absolute -left-[5000px]" tabIndex={-1} autoComplete="off" />
      
      {/* Stagger animation for each form field */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="relative">
        <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
        <input id="name" {...register('name')} placeholder="Your Name" className={`peer w-full pl-12 pr-4 py-3 rounded-lg border bg-gray-50 transition-colors ${errors.name ? 'border-red-400' : 'border-gray-300'} focus:border-[#1a2a80] focus:ring-1 focus:ring-[#1a2a80] focus:outline-none`} />
        <AnimatePresence>
          {errors.name && <motion.p initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="mt-1 text-sm text-red-500">{errors.name.message}</motion.p>}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="relative">
        <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
        <input id="email" type="email" {...register('email')} placeholder="Your Email" className={`peer w-full pl-12 pr-4 py-3 rounded-lg border bg-gray-50 transition-colors ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:border-[#1a2a80] focus:ring-1 focus:ring-[#1a2a80] focus:outline-none`} />
        <AnimatePresence>
         {errors.email && <motion.p initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="mt-1 text-sm text-red-500">{errors.email.message}</motion.p>}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="relative">
        <FiMessageSquare className="absolute top-5 left-4 text-gray-400" />
        <textarea id="message" rows="4" {...register('message')} placeholder="Your Message" className={`peer w-full pl-12 pr-4 py-3 rounded-lg border bg-gray-50 resize-none transition-colors ${errors.message ? 'border-red-400' : 'border-gray-300'} focus:border-[#1a2a80] focus:ring-1 focus:ring-[#1a2a80] focus:outline-none`}></textarea>
        <AnimatePresence>
         {errors.message && <motion.p initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="mt-1 text-sm text-red-500">{errors.message.message}</motion.p>}
        </AnimatePresence>
      </motion.div>

      <motion.button variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-gradient-to-r from-black to-[#1a2a80] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a2a80] disabled:opacity-70 disabled:cursor-not-allowed">
        {isSubmitting ? (<div className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...</div>) : 'Send Message'}
      </motion.button>
    </motion.form>
  );
};


//==============================================================================
// 3. MAIN CONTAINER COMPONENT
//==============================================================================
const ContactHero = () => {
  const canvasRef = useParticleAnimation();
  
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animation of child elements
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center lg:items-start justify-center px-4 md:px-8 pt-32 lg:pt-40 pb-12 bg-white text-black font-sans overflow-hidden">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
      
      {/* Left Column */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-end text-center lg:text-right lg:pr-12 mb-12 lg:mb-0"
      >
        <motion.div variants={itemVariants} className="overflow-hidden">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-black to-[#1a2a80]">
            LET'S <br /> CONNECT
          </h1>
        </motion.div>
        <ProContactForm />
      </motion.div>

      {/* Right Column */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:pl-12 space-y-5"
      >
        <motion.div variants={itemVariants} className="text-sm uppercase tracking-widest text-black/50">
          Or find me here
        </motion.div>
        {socialLinksData.map((link, index) => (
          <motion.div key={link.name} variants={itemVariants} className="w-full">
            <SocialLink
              href={link.href}
              name={link.name}
              icon={link.icon}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ContactHero;