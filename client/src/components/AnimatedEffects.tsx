import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Floating gold dust particles
export function GoldDustParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#C5A059]"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            filter: "blur(1px)",
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0.3, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Animated smoke effect for hero
export function SmokeEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice">
        <defs>
          <filter id="smoke-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
          <linearGradient id="smoke-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <motion.ellipse
            key={i}
            cx={300 + i * 400}
            cy={700}
            rx={200}
            ry={100}
            fill="url(#smoke-gradient)"
            filter="url(#smoke-blur)"
            initial={{ cy: 800, opacity: 0, rx: 200, ry: 100 }}
            animate={{ 
              cy: [800, 500, 200, 200],
              rx: [200, 280, 400, 400],
              ry: [100, 140, 200, 200],
              opacity: [0, 0.4, 0.3, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              delay: i * 4,
              ease: "linear",
              times: [0, 0.4, 0.7, 1]
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Scroll progress indicator
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#C5A059] origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// Magnetic button wrapper
export function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.2;
    const y = (clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation - letter by letter
export function TextReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const letters = text.split("");
  
  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.03,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block"
          style={{ display: letter === " " ? "inline" : "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

// Counter animation
export function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

// Back to top button
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-12 h-12 bg-[#C5A059] text-black flex items-center justify-center z-50 shadow-lg"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      data-testid="button-back-to-top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  );
}

// Parallax image component
export function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} className="w-full h-[120%] object-cover" style={{ y }} />
    </div>
  );
}

// Reveal on scroll wrapper
export function RevealOnScroll({ 
  children, 
  className = "",
  direction = "up"
}: { 
  children: React.ReactNode; 
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Animated line decoration
export function AnimatedLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  );
}
