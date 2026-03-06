import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Clock, Hand, Blend, Globe } from "lucide-react";
import { TropicalPattern } from "./Decorations";
import { AnimatedFiligree } from "./AnimatedFiligree";
import { EmberParticles } from "./EmberParticles";
import { DecorativeDivider } from "./BaroqueFrame";
import { CigarBand } from "./CigarMotifs";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  avatar?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "James Richardson",
    title: "Cigar Enthusiast, New York",
    quote: "The Attaie Reserve Toro is unlike anything I've experienced. The complexity of flavors unfolds beautifully, and the construction is impeccable. This is my new go-to for special occasions.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Private Collector, San Francisco",
    quote: "I've sampled cigars from every major producer, and Attaie stands in a class of its own. The aging process creates a smoothness that's hard to find. Truly exceptional craftsmanship.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Thompson",
    title: "Restaurant Owner, Miami",
    quote: "Our members demand the best, and we exclusively stock Attaie for our humidor lounge. The consistency and quality reflect the care put into every cigar.",
    rating: 5,
  },
  {
    id: 4,
    name: "Robert Martinez",
    title: "Corporate Executive, Chicago",
    quote: "Perfect for closing deals or celebrating milestones. The Black edition has become my signature smoke — bold yet refined, just like the moments I share it with.",
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="snap-section py-16 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Tropical pattern background */}
      <TropicalPattern opacity={0.02} />
      
      {/* Vibrant gradient accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(45,212,191,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,115,111,0.05),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(184,169,201,0.05),transparent_50%)]" />
      
      {/* Decorative vibrant borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2DD4BF] via-[#C5A059] to-[#E8736F] opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-[#2DD4BF] opacity-40" />
      
      {/* Animated corner filigree */}
      <AnimatedFiligree position="top-left" size="md" delay={0} />
      <AnimatedFiligree position="top-right" size="md" delay={0.2} />
      <AnimatedFiligree position="bottom-left" size="md" delay={0.4} />
      <AnimatedFiligree position="bottom-right" size="md" delay={0.6} />
      
      {/* Cigar band decorations */}
      <CigarBand className="absolute top-8 left-8 opacity-30 hidden md:block" size={60} />
      <CigarBand className="absolute bottom-8 right-8 opacity-30 hidden md:block" size={60} />
      
      {/* Ember particles */}
      <EmberParticles count={10} interactive={false} colors={["gold", "coral"]} />
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#E8736F] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 md:mb-6 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white">What <span className="bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Connoisseurs</span> Say</h2>
          {/* Ornate divider */}
          <div className="flex justify-center mt-6">
            <DecorativeDivider variant="elegant" />
          </div>
        </motion.div>

        {/* Testimonial carousel */}
        <div className="relative min-h-[300px]">
          {/* Quote icon */}
          <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 text-[#2DD4BF]/30" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center px-4 md:px-16"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6 md:mb-8">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-[#C5A059] text-lg"
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-white/70 text-lg md:text-2xl font-light leading-relaxed mb-8 md:mb-10 italic">
                "{testimonials[current].quote}"
              </blockquote>

              {/* Author */}
              <div>
                <p className="text-white font-medium text-lg">{testimonials[current].name}</p>
                <p className="text-white/40 text-sm">{testimonials[current].title}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all"
            data-testid="button-testimonial-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all"
            data-testid="button-testimonial-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10 md:mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 transition-all duration-300 ${
                index === current ? "bg-[#C5A059] w-6 md:w-8" : "bg-white/20 hover:bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Awards/Press section
export function Awards() {
  const awards = [
    { name: "Cigar Aficionado", rating: "94 Rating", year: "2024" },
    { name: "Cigar Journal", rating: "Best New Brand", year: "2023" },
    { name: "Tobacco Business", rating: "Editor's Pick", year: "2024" },
    { name: "Halfwheel", rating: "Top 25 Cigars", year: "2023" },
  ];

  return (
    <section className="snap-section py-12 md:py-20 bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] uppercase">As Featured In</span>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {awards.map((award, index) => (
            <motion.div
              key={award.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-white/80 font-serif text-lg md:text-xl mb-1">{award.name}</p>
              <p className="text-[#C5A059] text-xs md:text-sm font-medium">{award.rating}</p>
              <p className="text-white/30 text-[10px] md:text-xs">{award.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats section with animated counters - Vibrant Caribbean design
export function Stats() {
  const statColors = [
    { gradient: "from-[#2DD4BF] to-[#1a6b6b]", accent: "#2DD4BF", bg: "rgba(45,212,191,0.15)" },
    { gradient: "from-[#E8736F] to-[#C5A059]", accent: "#E8736F", bg: "rgba(232,115,111,0.15)" },
    { gradient: "from-[#C5A059] to-[#FFD4B8]", accent: "#C5A059", bg: "rgba(197,160,89,0.15)" },
    { gradient: "from-[#B8A9C9] to-[#E8736F]", accent: "#B8A9C9", bg: "rgba(184,169,201,0.15)" },
  ];

  return (
    <section className="snap-section py-20 md:py-32 relative overflow-hidden">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/15 via-[#0A0A0A] to-[#E8736F]/15" />
      
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(45,212,191,0.2)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,115,111,0.2)_0%,transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(197,160,89,0.1)_0%,transparent_60%)]" />
      </div>

      {/* Multi-color floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: 15, top: 20, size: 5, color: "#2DD4BF" },
          { left: 85, top: 30, size: 4, color: "#E8736F" },
          { left: 45, top: 70, size: 6, color: "#C5A059" },
          { left: 75, top: 80, size: 4, color: "#B8A9C9" },
          { left: 25, top: 60, size: 5, color: "#FFD4B8" },
          { left: 60, top: 15, size: 4, color: "#2DD4BF" },
          { left: 10, top: 85, size: 5, color: "#E8736F" },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            animate={{ 
              y: [0, -25, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 4 + i * 0.5, 
              repeat: Infinity, 
              delay: i * 0.4 
            }}
          />
        ))}
      </div>

      {/* Animated corner filigree with different colors */}
      <AnimatedFiligree position="top-left" size="lg" color="#2DD4BF" delay={0} />
      <AnimatedFiligree position="top-right" size="lg" color="#E8736F" delay={0.2} />
      <AnimatedFiligree position="bottom-left" size="lg" color="#B8A9C9" delay={0.4} />
      <AnimatedFiligree position="bottom-right" size="lg" color="#FFD4B8" delay={0.6} />
      
      {/* Tobacco leaf decorations */}
      <div className="absolute top-20 left-4 opacity-20 hidden lg:block">
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
          <path d="M20 0 Q35 15 35 30 Q35 50 20 60 Q5 50 5 30 Q5 15 20 0" stroke="#C5A059" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M20 5 L20 55" stroke="#C5A059" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-4 opacity-20 hidden lg:block rotate-180">
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
          <path d="M20 0 Q35 15 35 30 Q35 50 20 60 Q5 50 5 30 Q5 15 20 0" stroke="#C5A059" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M20 5 L20 55" stroke="#C5A059" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      <div className="hidden">
        {/* Keeping empty div for backwards compatibility */}
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-[#FFD4B8] via-[#C5A059] to-transparent" />
      </div>

      {/* Top and bottom vibrant lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2DD4BF] via-[#C5A059] to-[#E8736F] opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-[#2DD4BF] opacity-60" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#2DD4BF] text-xs tracking-[0.4em] uppercase mb-4 block">By The Numbers</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
            Excellence <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Delivered</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: 5, suffix: "+", label: "Years Aged", Icon: Clock },
            { value: 100, suffix: "%", label: "Hand-Rolled", Icon: Hand },
            { value: 6, suffix: "", label: "Premium Blends", Icon: Blend },
            { value: 50, suffix: "+", label: "Countries Shipped", Icon: Globe },
          ].map((stat, index) => {
            const colorScheme = statColors[index];
            return (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              >
                {/* Card with colorful glassmorphism */}
                <div 
                  className="relative p-6 md:p-8 backdrop-blur-sm rounded-xl text-center hover-elevate overflow-visible"
                  style={{ 
                    background: `linear-gradient(135deg, ${colorScheme.bg}, rgba(255,255,255,0.02))`,
                    border: `1px solid ${colorScheme.accent}30`
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${colorScheme.accent}20`,
                      border: `2px solid ${colorScheme.accent}50`
                    }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <stat.Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: colorScheme.accent }} />
                  </motion.div>

                  {/* Number with gradient */}
                  <motion.div
                    className="relative mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <span 
                      className={`text-5xl md:text-7xl font-bebas text-transparent bg-clip-text bg-gradient-to-r ${colorScheme.gradient} tracking-tight`}
                    >
                      {stat.value}{stat.suffix}
                    </span>
                  </motion.div>

                  {/* Label */}
                  <span className="text-white/80 text-xs md:text-sm tracking-[0.15em] uppercase font-medium">{stat.label}</span>
                  
                  {/* Bottom accent line */}
                  <motion.div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 rounded-full group-hover:w-3/4 transition-all duration-500"
                    style={{ background: `linear-gradient(to right, transparent, ${colorScheme.accent}, transparent)` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
