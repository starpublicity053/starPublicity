import React, { useRef, useEffect, useState, memo } from 'react';
import { FaEnvelope, FaLinkedin, FaInstagram, FaFacebook, FaXTwitter, FaPinterest } from 'react-icons/fa6';
import { FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// CONFIG & DATA
// ============================================================================
const socialLinksData = [
  { name: 'Email', icon: FaEnvelope, href: 'mailto:info@starpublicity.co.in' },
  { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/shivam-kumar-0b17342a8/' },
  { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/starpublicityldh/' },
  { name: 'Facebook', icon: FaFacebook, href: 'https://www.facebook.com/starpublicity' },
  { name: 'X', icon: FaXTwitter, href: 'https://x.com/starpublicityld' },
  { name: 'Pinterest', icon: FaPinterest, href: 'https://in.pinterest.com/starpublicityldh/' }, // ✅ Added Pinterest
];

// ============================================================================
// BACKGROUND: Constellation Particles + Gradient Blobs
// ============================================================================
const useConstellation = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId; let particles = [];

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: null, y: null, radius: 130 };

    class Particle {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(26,42,128,0.5)';
        ctx.fill();
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // mouse repulsion
        const dx = (mouse.x ?? -9999) - this.x;
        const dy = (mouse.y ?? -9999) - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.vx -= (dx / dist) * force * 0.6;
          this.vy -= (dy / dist) * force * 0.6;
        }
        this.draw();
      }
    }

    const connect = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(26,42,128,${0.15 * (1 - dist/120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const init = () => {
      const { innerWidth:w, innerHeight:h } = window;
      canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      particles = [];
      const count = Math.floor((w * h) / 12000);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(Math.random() * w, Math.random() * h));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onResize = () => init();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    init(); animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return canvasRef;
};

// Decorative gradient blobs
const GradientBlobs = () => (
  <>
    <div className="pointer-events-none absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-[#1a2a80] to-black opacity-20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-black to-[#1a2a80] opacity-20 blur-3xl" />
  </>
);

// ============================================================================
// LITTLE UTIL: 3D tilt on hover for tiles
// ============================================================================
const Tilt = ({ children, className }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6; // rotateX
    const ry = ((x / rect.width) - 0.5) * 6;  // rotateY
    setStyle({ transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)` });
  };
  const onLeave = () => setStyle({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)' });
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={style}>
      {children}
    </div>
  );
};

// ============================================================================
// FORM SCHEMA & API
// ============================================================================
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
  honeypot: z.string().optional(),
});

const submitApi = async (data) => {
  // Simulate API
  await new Promise((r) => setTimeout(r, 1400));
  return { message: 'Message sent successfully!' };
};

// ============================================================================
// SOCIAL TILE
// ============================================================================
const SocialTile = memo(({ icon: Icon, name, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" title={name}
     className="group relative flex items-center justify-center h-24 rounded-2xl bg-white/70 backdrop-blur-md border border-black/10 shadow-sm hover:shadow-xl transition-all overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[#1a2a80]/20 to-black/20" />
    <Icon size={26} className="text-black group-hover:text-[#1a2a80] transition-colors" />
    <span className="absolute bottom-2 text-xs font-medium text-black/60 group-hover:text-[#1a2a80]">{name}</span>
  </a>
));

// ============================================================================
// CONTACT FORM CARD
// ============================================================================
const ContactCard = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(contactSchema) });

  const processForm = async (data) => {
    if (data.honeypot) return;
    await toast.promise(submitApi(data), {
      loading: 'Sending your message…',
      success: 'Message sent! We will get back soon.',
      error: 'Oops! Something went wrong.',
    });
    reset();
  };

  return (
    <Tilt className="relative">
      <div className="relative bg-gradient-to-br from-[#1a2a80] to-black p-[2px] rounded-3xl shadow-2xl">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit(processForm)} className="w-full max-w-xl">
            <input type="text" {...register('honeypot')} className="hidden" />

            <label className="block mb-4">
              <span className="mb-2 block text-sm font-semibold text-black/70">Name</span>
              <div className="relative">
                <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input {...register('name')} placeholder="Your Name" className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-300'} focus:border-[#1a2a80] focus:ring-1 focus:ring-[#1a2a80] focus:outline-none bg-white`} />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </label>

            <label className="block mb-4">
              <span className="mb-2 block text-sm font-semibold text-black/70">Email</span>
              <div className="relative">
                <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input type="email" {...register('email')} placeholder="you@example.com" className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:border-[#1a2a80] focus:ring-1 focus:ring-[#1a2a80] focus:outline-none bg-white`} />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </label>

            <label className="block mb-6">
              <span className="mb-2 block text-sm font-semibold text-black/70">Message</span>
              <div className="relative">
                <FiMessageSquare className="absolute top-5 left-4 text-gray-400" />
                <textarea rows={5} {...register('message')} placeholder="Tell us a bit about your project…" className={`w-full pl-12 pr-4 py-3 rounded-xl border resize-none ${errors.message ? 'border-red-400' : 'border-gray-300'} focus:border-[#1a2a80] focus:ring-1 focus:ring-[#1a2a80] focus:outline-none bg-white`} />
              </div>
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
            </label>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="relative w-full py-3 rounded-xl font-semibold text-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a2a80] disabled:opacity-70 disabled:cursor-not-allowed">
              <span className="absolute inset-0 bg-gradient-to-r from-black via-[#1a2a80] to-black animate-[gradientMove_6s_ease_infinite]" />
              <span className="relative z-10">{isSubmitting ? 'Sending…' : 'Send Message'}</span>
            </button>

            {/* Indeterminate progress bar when submitting */}
            <AnimatePresence>
              {isSubmitting && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#1a2a80]" initial={{ x: '-100%' }} animate={{ x: ['-100%', '0%', '100%'] }} transition={{ duration: 1.2, repeat: Infinity }} />
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </Tilt>
  );
};

// ============================================================================
// SOCIAL CARD
// ============================================================================
const SocialCard = () => (
  <Tilt className="relative">
    <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-black to-[#1a2a80] shadow-2xl">
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-black">Connect on Social</h3>
          <p className="text-black/60 mt-1">Prefer socials? Reach out via any platform.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {socialLinksData.map((s) => (
            <SocialTile key={s.name} {...s} />
          ))}
        </div>
      </div>
    </div>
  </Tilt>
);

// ============================================================================
// MAIN COMPONENT: Hero Contact Experience
// ============================================================================
const ContactHero = () => {
  const canvasRef = useConstellation();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-10 pt-48 pb-24 bg-white text-black overflow-hidden">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff' } }} />
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <GradientBlobs />

      {/* Headline */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-black to-[#1a2a80]">
          Let’s Build Something Great Together
        </h1>
        <p className="mt-4 text-black/60 max-w-2xl mx-auto">
          Tell us about your goals. We’ll come back with ideas, timelines, and a clear next step.
        </p>
      </motion.div>

      {/* Card Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <ContactCard />
        <SocialCard />
      </motion.div>

      {/* Footer small line */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="relative z-10 mt-10 text-xs text-black/50">
        © {new Date().getFullYear()} Star Publicity — All rights reserved.
      </motion.p>

      {/* keyframes for gradient button */}
      <style jsx>{`
        @keyframes gradientMove {
          0% { transform: translateX(-30%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(30%); }
        }
      `}</style>
    </section>
  );
};

export default ContactHero;
