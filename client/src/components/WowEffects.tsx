import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function VideoMarqueeBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-black py-4 md:py-6">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
      
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 md:gap-16 mx-8 md:mx-16">
            <span className="text-[#C5A059] text-sm md:text-xl lg:text-2xl font-serif tracking-[0.2em] uppercase">
              Made In Dominican Republic
            </span>
            <span className="text-[#2DD4BF] text-xl md:text-2xl">◆</span>
            <span className="text-white text-sm md:text-xl lg:text-2xl tracking-[0.2em] uppercase">
              Est. <span className="font-bebas">2025</span>
            </span>
            <span className="text-[#E8736F] text-xl md:text-2xl">◆</span>
            <span className="text-[#C5A059] text-sm md:text-xl lg:text-2xl font-bold tracking-[0.3em] uppercase">
              Attaie Cigars
            </span>
            <span className="text-[#2DD4BF] text-xl md:text-2xl">◆</span>
          </div>
        ))}
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />
    </div>
  );
}

export function SplitTextReveal({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = children.split(" ");
  const midpoint = Math.ceil(words.length / 2);
  const leftWords = words.slice(0, midpoint);
  const rightWords = words.slice(midpoint);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap justify-center gap-x-4">
        <motion.span
          className="inline-block"
          initial={{ x: "-100%", opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {leftWords.join(" ")}
        </motion.span>
        <motion.span
          className="inline-block"
          initial={{ x: "100%", opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {rightWords.join(" ")}
        </motion.span>
      </div>
    </div>
  );
}

export function BurnAwayText({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-transparent"
          initial={{ x: "-100%" }}
          animate={isInView ? { x: "200%" } : { x: "-100%" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          style={{ mixBlendMode: "overlay" }}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-[#E8736F]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: [0, 1, 0] } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />
    </div>
  );
}

export function ParallaxZoomSection({ 
  children, 
  backgroundImage,
  overlayColor = "rgba(10, 10, 10, 0.7)"
}: { 
  children: React.ReactNode; 
  backgroundImage?: string;
  overlayColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden">
      {backgroundImage && (
        <motion.div
          className="absolute inset-0"
          style={{ scale }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor }} />
        </motion.div>
      )}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 1 }}
        style={{ opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function StickyProductReveal({ 
  products 
}: { 
  products: Array<{ name: string; image: string; description: string }> 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(products.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {products.map((product, index) => {
          const start = index / products.length;
          const end = (index + 1) / products.length;
          
          return (
            <ProductRevealItem 
              key={index}
              product={product}
              scrollProgress={scrollYProgress}
              start={start}
              end={end}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProductRevealItem({ 
  product, 
  scrollProgress, 
  start, 
  end,
  index 
}: { 
  product: { name: string; image: string; description: string };
  scrollProgress: any;
  start: number;
  end: number;
  index: number;
}) {
  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [0.8, 1, 1, 0.8]
  );
  const y = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [100, 0, 0, -100]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-8"
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      style={{ opacity, scale, y }}
    >
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="w-full md:w-1/2">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-3xl md:text-5xl font-serif text-[#C5A059] mb-4">{product.name}</h3>
          <p className="text-white/70 text-lg leading-relaxed">{product.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function HorizontalScrollGallery({ 
  images 
}: { 
  images: Array<{ src: string; alt: string; caption?: string }> 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(images.length - 1) * 100}%`]);

  return (
    <div ref={containerRef} className="relative" style={{ height: `${images.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div 
          className="flex"
          style={{ x }}
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-8"
            >
              <div className="relative max-w-5xl w-full">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-auto max-h-[70vh] object-cover rounded-lg shadow-2xl"
                />
                {image.caption && (
                  <p className="absolute bottom-4 left-4 right-4 text-center text-white/80 text-lg bg-black/50 backdrop-blur-sm py-3 px-6 rounded">
                    {image.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-white/30"
              style={{
                backgroundColor: useTransform(
                  scrollYProgress,
                  [index / images.length, (index + 0.5) / images.length, (index + 1) / images.length],
                  ["rgba(255,255,255,0.3)", "rgba(197,160,89,1)", "rgba(255,255,255,0.3)"]
                )
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmberGlowButton({ 
  children, 
  className = "",
  onClick
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className={`relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#d4af68] text-black font-semibold tracking-wider uppercase ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-[#E8736F]"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ opacity: 0.3 }}
      />
      <motion.div
        className="absolute -inset-1 rounded blur-md bg-[#C5A059]"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ zIndex: -1 }}
      />
    </motion.button>
  );
}

export function GoldParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    size: 2 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#C5A059]"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{
            y: window.innerHeight + 50,
            opacity: 0,
            x: 0,
          }}
          animate={{
            y: [window.innerHeight + 50, -50],
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.sin(particle.id) * 30],
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

export function CinematicPageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeritageStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-48 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a6b6b]/10 via-transparent to-[#1a6b6b]/10" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#2DD4BF] text-xs md:text-sm tracking-[0.4em] uppercase mb-8 block">
            Our Heritage
          </span>
        </motion.div>
        
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
          <motion.div
            className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-[#C5A059]"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.span
            className="text-[120px] md:text-[200px] lg:text-[280px] font-bebas text-transparent bg-clip-text bg-gradient-to-b from-[#C5A059] via-[#d4af68] to-[#C5A059]/30 leading-none tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            2025
          </motion.span>
          <motion.div
            className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-[#C5A059]"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        
        <motion.p
          className="text-white/60 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Born from a passion for excellence in the heart of the 
          <span className="text-[#2DD4BF]"> Dominican Republic</span>, 
          crafting moments that transcend time.
        </motion.p>
      </div>
    </section>
  );
}

export function FullBleedQuote({ 
  quote, 
  author, 
  role,
  backgroundImage 
}: { 
  quote: string; 
  author: string; 
  role?: string;
  backgroundImage?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {backgroundImage && (
        <motion.div
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </motion.div>
      )}
      
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
        >
          <span className="text-8xl md:text-9xl text-[#C5A059]/40 font-serif block mb-4">"</span>
          
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif text-white leading-relaxed mb-12 -mt-16">
            {quote}
          </blockquote>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#C5A059]" />
            <div>
              <p className="text-[#C5A059] text-lg md:text-xl tracking-wider">{author}</p>
              {role && <p className="text-white/50 text-sm tracking-widest uppercase mt-1">{role}</p>}
            </div>
            <div className="h-px w-16 bg-[#C5A059]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function AssemblingPhotoGrid({ 
  images 
}: { 
  images: Array<{ src: string; alt: string }> 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const gridPositions = [
    { gridColumn: "1 / 2", gridRow: "1 / 2" },
    { gridColumn: "2 / 3", gridRow: "1 / 3" },
    { gridColumn: "1 / 2", gridRow: "2 / 3" },
    { gridColumn: "3 / 4", gridRow: "1 / 2" },
    { gridColumn: "3 / 4", gridRow: "2 / 3" },
  ];

  return (
    <div ref={ref} className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
        {images.slice(0, 5).map((image, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg"
            style={gridPositions[index]}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              x: (index % 2 === 0 ? -1 : 1) * 100,
              y: (index < 2 ? -1 : 1) * 100,
              rotate: (index % 2 === 0 ? -10 : 10)
            }}
            animate={isInView ? { 
              opacity: 1, 
              scale: 1,
              x: 0,
              y: 0,
              rotate: 0
            } : { 
              opacity: 0, 
              scale: 0.5,
              x: (index % 2 === 0 ? -1 : 1) * 100,
              y: (index < 2 ? -1 : 1) * 100,
              rotate: (index % 2 === 0 ? -10 : 10)
            }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function LetterByLetterReveal({ 
  text, 
  className = "",
  delay = 0
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap justify-center">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ y: 100, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.03,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function ScaleOnScrollSection({ 
  children,
  className = ""
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.85, 1]),
    { stiffness: 100, damping: 30 }
  );
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.85, opacity: 0.3 }}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

export function ThreeDPerspectiveText({ 
  text, 
  className = "" 
}: { 
  text: string; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div 
      ref={ref} 
      className={`perspective-[1000px] ${className}`}
    >
      <motion.div
        className="transform-gpu"
        initial={{ rotateX: 45, opacity: 0, y: 50 }}
        animate={isInView ? { rotateX: 0, opacity: 1, y: 0 } : { rotateX: 45, opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.div>
    </div>
  );
}
