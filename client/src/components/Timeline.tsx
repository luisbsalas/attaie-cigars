import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const milestones = [
  {
    year: "2018",
    title: "The Vision",
    description: "Samay Attaie began his journey, inspired by generations of tobacco artisans and a personal passion for the perfect smoke.",
    color: "#2DD4BF"
  },
  {
    year: "2020",
    title: "First Blend",
    description: "After years of refining techniques and sourcing the finest leaves from Nicaragua and the Dominican Republic, the first Attaie Reserve was born.",
    color: "#E8736F"
  },
  {
    year: "2022",
    title: "The Collection",
    description: "The complete Attaie Reserve line launched — Reserve, Black, Platinum, and Private — each a distinct expression of luxury and craftsmanship.",
    color: "#C5A059"
  },
  {
    year: "2024",
    title: "Global Reach",
    description: "Attaie Cigars expanded to over 50 premium retailers worldwide, bringing Dominican craftsmanship to aficionados everywhere.",
    color: "#B8A9C9"
  }
];

export function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const x = useMotionValue(0);
  
  // Responsive card dimensions
  const isMobile = containerWidth > 0 && containerWidth < 640;
  const cardWidth = isMobile ? Math.min(280, containerWidth - 48) : 340;
  const gap = isMobile ? 16 : 32;
  const totalWidth = milestones.length * (cardWidth + gap) - gap;

  // Calculate centering offset - how much to offset to center first card
  const centerOffset = Math.max(0, (containerWidth - cardWidth) / 2);
  
  // Drag bounds: allow centering of first card (right bound) to last card (left bound)
  const minX = centerOffset - (totalWidth - cardWidth);
  const maxX = centerOffset;

  // Measure container width for proper drag constraints (only on mount/resize)
  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };
    measureContainer();
    window.addEventListener("resize", measureContainer);
    return () => window.removeEventListener("resize", measureContainer);
  }, []);

  // Initialize position when container width is measured
  useEffect(() => {
    if (containerWidth > 0) {
      const offset = (containerWidth - cardWidth) / 2;
      x.set(offset - activeIndex * (cardWidth + gap));
    }
  }, [containerWidth]);

  const navigateTo = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(milestones.length - 1, index));
    setActiveIndex(clampedIndex);
    // Center the active card in the viewport
    const targetX = centerOffset - clampedIndex * (cardWidth + gap);
    animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();
    // Account for centerOffset when computing nearest index
    const nearestIndex = Math.round((centerOffset - currentX) / (cardWidth + gap));
    navigateTo(nearestIndex);
  };

  // Handle keyboard navigation only when section itself has focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle if the section itself is focused, not descendants
    if (e.target !== e.currentTarget) return;
    
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      navigateTo(activeIndex - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      navigateTo(activeIndex + 1);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="snap-section py-20 md:py-32 bg-[#0A0A0A] relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/50 focus:ring-inset"
      data-testid="section-timeline"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Dynamic background glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{ 
          background: `radial-gradient(ellipse, ${milestones[activeIndex].color}50 0%, transparent 60%)` 
        }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: milestones[i % milestones.length].color,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-3 md:mb-4 block">Our Journey</span>
          <h2 className="text-3xl md:text-6xl font-serif bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">
            Milestones
          </h2>
        </motion.div>

        {/* Navigation controls */}
        <div className="flex justify-center items-center gap-6 mb-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="rounded-full"
            data-testid="button-timeline-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          {/* Progress indicator */}
          <div className="flex gap-2 md:gap-3">
            {milestones.map((milestone, index) => (
              <button
                key={milestone.year}
                onClick={() => navigateTo(index)}
                className="p-1"
                data-testid={`dot-nav-${index}`}
              >
                <motion.div
                  className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full transition-all duration-300"
                  animate={{
                    background: activeIndex === index ? milestone.color : "rgba(255,255,255,0.2)",
                  }}
                  style={{
                    boxShadow: activeIndex === index ? `0 0 15px ${milestone.color}` : "none"
                  }}
                />
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTo(activeIndex + 1)}
            disabled={activeIndex === milestones.length - 1}
            className="rounded-full"
            data-testid="button-timeline-next"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Cards carousel */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing py-8"
        >
          <motion.div
            className="flex"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: minX, right: maxX }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            dragElastic={0.1}
          >
            <div className="flex" style={{ gap: `${gap}px` }}>
              {milestones.map((milestone, index) => {
                const isActive = index === activeIndex;
                
                return (
                  <motion.div
                    key={milestone.year}
                    className="relative flex-shrink-0 cursor-pointer"
                    style={{ width: cardWidth }}
                    onClick={() => !isDragging && navigateTo(index)}
                    animate={{
                      opacity: isActive ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.4 }}
                    data-testid={`card-milestone-${milestone.year}`}
                  >
                    {/* Card container */}
                    <div
                      className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl overflow-hidden transition-shadow duration-300"
                      style={{
                        boxShadow: isActive ? `0 0 30px ${milestone.color}30` : "none",
                      }}
                    >
                      {/* Animated border */}
                      <motion.div 
                        className="absolute inset-0 rounded-2xl"
                        animate={{
                          boxShadow: isActive 
                            ? `inset 0 0 0 2px ${milestone.color}, 0 20px 40px -15px ${milestone.color}50` 
                            : "inset 0 0 0 1px rgba(255,255,255,0.1)"
                        }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      {/* Header with year */}
                      <div 
                        className="relative h-24 md:h-32 flex items-center justify-center overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${milestone.color}30 0%, transparent 60%)` }}
                      >
                        {/* Large year watermark */}
                        <span 
                          className="absolute text-[80px] md:text-[120px] font-serif font-bold opacity-10 select-none"
                          style={{ color: milestone.color }}
                        >
                          {milestone.year}
                        </span>
                        
                        {/* Year badge */}
                        <div 
                          className="relative z-10 px-4 md:px-6 py-2 md:py-3 rounded-full text-base md:text-lg font-bold transition-all duration-300"
                          style={{ 
                            background: isActive ? `${milestone.color}40` : `${milestone.color}20`,
                            border: `2px solid ${milestone.color}`,
                            color: milestone.color,
                            boxShadow: isActive ? `0 0 20px ${milestone.color}50` : "none"
                          }}
                        >
                          {milestone.year}
                        </div>
                        
                        {/* Corner accent */}
                        <div 
                          className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24"
                          style={{ 
                            background: `linear-gradient(135deg, transparent 50%, ${milestone.color}20 50%)` 
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6 pt-3 md:pt-4">
                        <motion.h3 
                          className="text-lg md:text-2xl font-serif mb-2 md:mb-3"
                          animate={{ color: isActive ? milestone.color : "white" }}
                          transition={{ duration: 0.3 }}
                        >
                          {milestone.title}
                        </motion.h3>
                        <p className="text-white/50 leading-relaxed text-xs md:text-sm">
                          {milestone.description}
                        </p>
                      </div>

                      {/* Animated bottom accent */}
                      <motion.div 
                        className="h-1 bg-gradient-to-r"
                        style={{ 
                          backgroundImage: `linear-gradient(90deg, ${milestone.color}, ${milestone.color}50, transparent)` 
                        }}
                        animate={{ 
                          scaleX: isActive ? 1 : 0,
                          originX: 0
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* Glow behind card */}
                    <motion.div
                      className="absolute -inset-6 rounded-3xl blur-2xl -z-10"
                      animate={{ 
                        background: milestone.color,
                        opacity: isActive ? 0.2 : 0 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Current milestone info */}
        <motion.div 
          className="text-center mt-6"
          key={activeIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-white/30 text-sm">
            <motion.span 
              className="font-bold text-lg"
              style={{ color: milestones[activeIndex].color }}
            >
              {activeIndex + 1}
            </motion.span>
            <span className="mx-2 text-white/20">/</span>
            <span>{milestones.length} milestones</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
