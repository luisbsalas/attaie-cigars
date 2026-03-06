import { motion } from "framer-motion";
import { TropicalPattern } from "@/components/Decorations";
import { AnimatedFiligree } from "@/components/AnimatedFiligree";
import { DecorativeDivider } from "@/components/BaroqueFrame";
import { EmberParticles } from "@/components/EmberParticles";
import { DominicanRepublicMap, TransformationSlider } from "@/components/VisualStorytelling";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MapPin, Calendar, Award, Heart, Leaf, Globe, Landmark, Hand, Star, Flame, Quote, Car, CircleDot } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

const timelineEvents = [
  {
    year: "2019",
    title: "The Beginning",
    description: "Samay Attaie embarks on a journey to create cigars that capture the essence of Dominican craftsmanship and timeless tradition.",
    icon: Leaf,
    color: "#2DD4BF",
    image: "https://images.unsplash.com/photo-1550685347-5b47b7bbb6f0?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "2020",
    title: "First Harvest",
    description: "Our inaugural blend debuts, introducing the world to the distinctive Attaie flavor profile rooted in Nicaraguan and Dominican tobaccos.",
    icon: Calendar,
    color: "#C5A059",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "2021",
    title: "The Reserve Collection",
    description: "Launch of the Reserve line, featuring cigars aged in cedar vaults for 5+ years, earning acclaim from aficionados worldwide.",
    icon: Award,
    color: "#E8736F",
    image: "https://images.unsplash.com/photo-1596637508086-4c40590a5996?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "2023",
    title: "Dominican Roots",
    description: "Expansion into new growing regions while maintaining our commitment to hand-rolled excellence and small-batch production.",
    icon: Globe,
    color: "#B8A9C9",
    image: "https://images.unsplash.com/photo-1521193077363-228795906b3a?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "2024",
    title: "Global Recognition",
    description: "Attaie cigars recognized among the finest premium cigars, celebrated for their complexity, balance, and distinctive character.",
    icon: Heart,
    color: "#FFD4B8",
    image: "https://images.unsplash.com/photo-1627807452654-72944b58e7f1?auto=format&fit=crop&q=80&w=600"
  }
];

const values = [
  {
    title: "Heritage",
    description: "Every cigar carries the weight of tradition, honoring centuries-old techniques passed down through generations of master rollers.",
    Icon: Landmark,
    color: "#C5A059"
  },
  {
    title: "Craftsmanship",
    description: "Each cigar is hand-rolled by skilled artisans who dedicate their lives to perfecting the art of cigar making.",
    Icon: Hand,
    color: "#2DD4BF"
  },
  {
    title: "Quality",
    description: "We source only the finest tobaccos, aged to perfection in cedar-lined vaults before reaching your humidor.",
    Icon: Star,
    color: "#E8736F"
  },
  {
    title: "Passion",
    description: "Born from a love of the perfect smoke, our cigars represent the culmination of decades of pursuit for excellence.",
    Icon: Flame,
    color: "#B8A9C9"
  }
];

const lifestyleImages = [
  {
    src: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80&w=800",
    alt: "Tobacco fields in the Dominican Republic",
    span: "col-span-2 row-span-2"
  },
  {
    src: "https://images.unsplash.com/photo-1550685347-5b47b7bbb6f0?auto=format&fit=crop&q=80&w=600",
    alt: "Master roller in cigar factory",
    span: "col-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1574027057065-cfff0e4e4d82?auto=format&fit=crop&q=80&w=600",
    alt: "Premium hand-rolled cigars",
    span: "col-span-1"
  },
  {
    src: "https://images.unsplash.com/photo-1535683577427-75e8c571441f?auto=format&fit=crop&q=80&w=600",
    alt: "Cigar aging room",
    span: "col-span-1 row-span-2"
  },
  {
    src: "https://images.unsplash.com/photo-1596637508086-4c40590a5996?auto=format&fit=crop&q=80&w=600",
    alt: "Cigar collection display",
    span: "col-span-1"
  }
];

function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1550685347-5b47b7bbb6f0?auto=format&fit=crop&q=80&w=2000"
          alt="Master cigar craftsman"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.8)_70%)]" />
      </div>
      
      <AnimatedFiligree position="top-left" size="lg" delay={0.5} className="opacity-40" />
      <AnimatedFiligree position="top-right" size="lg" delay={0.7} className="opacity-40" />
      <AnimatedFiligree position="bottom-left" size="lg" delay={0.9} className="opacity-30" />
      <AnimatedFiligree position="bottom-right" size="lg" delay={1.1} className="opacity-30" />
      
      <div className="relative z-10 text-center max-w-5xl px-6">
        <motion.div 
          className="inline-flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#2DD4BF]" />
          <span className="text-[#2DD4BF] text-xs tracking-[0.4em] uppercase font-light">
            Est. 2019 • Dominican Republic
          </span>
          <div className="h-px w-12 bg-gradient-to-r from-[#2DD4BF] to-transparent" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-8 leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Our{" "}
          <span className="block italic bg-gradient-to-r from-[#C5A059] via-[#E8736F] to-[#2DD4BF] bg-clip-text text-transparent pb-2">
            Heritage
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          A story of passion, tradition, and the relentless pursuit of the perfect cigar—crafted in the heart of the Dominican Republic.
        </motion.p>
        
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <DecorativeDivider variant="ornate" className="w-64" />
        </motion.div>
      </div>
      
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-[#C5A059] to-transparent mx-auto"
          initial={{ scaleY: 1 }}
          animate={shouldReduceMotion ? { scaleY: 1 } : { scaleY: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

function FounderQuoteSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <TropicalPattern opacity={0.03} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0d0d0d] to-[#0A0A0A]" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Quote className="w-16 h-16 text-[#C5A059]/30 mx-auto mb-8" />
          
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif text-white/90 leading-relaxed mb-10">
            <span className="text-[#2DD4BF]">"</span>
            My cigars are the culmination of a decades-long passion—a pursuit of that perfect moment when time 
            <span className="italic text-[#C5A059]"> stands still</span>, 
            and all that matters is the pleasure of the perfect smoke.
            <span className="text-[#E8736F]">"</span>
          </blockquote>
          
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
            <div className="text-center">
              <p className="text-[#C5A059] font-serif text-xl mb-1">Samay Attaie</p>
              <p className="text-white/40 text-sm tracking-widest uppercase">Founder & Master Blender</p>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LifestyleGallery() {
  return (
    <section className="py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {lifestyleImages.map((image, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-xl group ${image.span}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-[#C5A059]/30 rounded-xl transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0d0d0d] to-[#0A0A0A]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.05)_0%,transparent_50%)]" />
      
      <EmberParticles count={8} colors={["gold", "coral"]} className="opacity-20" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#E8736F] text-xs tracking-[0.4em] uppercase mb-4 block font-light">
            Our Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            A Legacy{" "}
            <span className="italic bg-gradient-to-r from-[#C5A059] to-[#E8736F] bg-clip-text text-transparent">
              in the Making
            </span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            From humble beginnings to global recognition, every year marks a new chapter in our story.
          </p>
        </motion.div>

        <div className="space-y-16">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={event.year}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="lg:w-1/2">
                  <div className="relative overflow-hidden rounded-2xl group">
                    <img 
                      src={event.image}
                      alt={event.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{ background: `linear-gradient(135deg, ${event.color}40 0%, transparent 50%)` }}
                    />
                    
                    <div className="absolute bottom-6 left-6">
                      <span 
                        className="text-6xl md:text-7xl font-serif font-bold"
                        style={{ 
                          color: event.color,
                          textShadow: `0 0 40px ${event.color}40`
                        }}
                      >
                        {event.year}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`lg:w-1/2 ${isEven ? 'lg:pl-8' : 'lg:pr-8'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${event.color}20`,
                        border: `2px solid ${event.color}40`
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: event.color }} />
                    </div>
                    <div 
                      className="h-px flex-1 max-w-24"
                      style={{ background: `linear-gradient(to right, ${event.color}, transparent)` }}
                    />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                    {event.title}
                  </h3>
                  <p className="text-white/50 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#0A0A0A] to-[#0d0d0d]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(197,160,89,0.05)_0%,transparent_60%)]" />
      
      <AnimatedFiligree position="top-left" size="lg" delay={0} className="opacity-20" />
      <AnimatedFiligree position="bottom-right" size="lg" delay={0.2} className="opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C5A059] text-xs tracking-[0.4em] uppercase mb-4 block font-light">
            What Drives Us
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white">
            Our <span className="italic text-[#C5A059]">Values</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top right, ${value.color}10, transparent 60%)` }}
                />
                
                <div className="relative z-10 flex gap-6">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundColor: `${value.color}15`,
                      border: `1px solid ${value.color}30`
                    }}
                  >
                    <value.Icon className="w-8 h-8" style={{ color: value.color }} />
                  </div>
                  
                  <div>
                    <h3 
                      className="text-2xl font-serif mb-3 transition-colors duration-300"
                      style={{ color: value.color }}
                    >
                      {value.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DominicanSoulSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <TropicalPattern opacity={0.05} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#B8A9C9] text-xs tracking-[0.4em] uppercase mb-4 block font-light">
              Where It All Begins
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
              Dominican{" "}
              <span className="italic bg-gradient-to-r from-[#B8A9C9] to-[#E8736F] bg-clip-text text-transparent">
                Soul
              </span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              The Dominican Republic isn't just where our tobaccos grow—it's the essence of who we are. 
              The rhythm of island life, the warmth of the sun, the richness of the soil—all 
              these elements come together in every Attaie cigar.
            </p>
            <p className="text-white/40 leading-relaxed mb-8">
              From the volcanic highlands of Nicaragua to the fertile valleys of the Dominican 
              Republic, each region contributes its unique character to our blends. This is 
              the art of terroir—the taste of a place, captured in tobacco.
            </p>
            
            <div className="flex gap-8">
              {[
                { label: "Regions", value: "3" },
                { label: "Years Aging", value: "5+" },
                { label: "Master Rollers", value: "12" }
              ].map((stat, index) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-serif text-[#C5A059] mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-sm tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80&w=1200"
                alt="Dominican tobacco fields"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 to-transparent" />
            </div>
            
            <motion.div
              className="absolute -bottom-8 -left-8 w-56 h-56 rounded-2xl overflow-hidden border-4 border-[#0A0A0A] shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1550685347-5b47b7bbb6f0?auto=format&fit=crop&q=80&w=400"
                alt="Master roller at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
            
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-[#C5A059]/20 to-transparent blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const lifestyleCards = [
  {
    icon: Car,
    title: "Supercars: Power Meets Prestige",
    color: "#E8736F",
    accentGlow: "from-[#E8736F]/20",
    borderColor: "border-[#E8736F]/20",
    description: "At the heart of Samay Attaie's lifestyle is an enviable collection of supercars. These machines are more than transportation—they are statements. Each engine's growl, each sculpted line, embodies achievement and ambition. Whether arriving at an exclusive event or taking an open highway drive, his vehicles mirror a relentless pursuit of excellence."
  },
  {
    icon: CircleDot,
    title: "Golf: Precision in Motion",
    color: "#2DD4BF",
    accentGlow: "from-[#2DD4BF]/20",
    borderColor: "border-[#2DD4BF]/20",
    description: "Beyond the speed and spectacle lies another passion—golf. On the course, Samay channels discipline and strategy, embracing the elegance the game demands. Golf offers balance to the adrenaline of supercars, blending refinement with competition in a setting that complements his sophisticated persona."
  },
  {
    icon: Flame,
    title: "The Signature Finish: Attaie Cigars",
    color: "#C5A059",
    accentGlow: "from-[#C5A059]/20",
    borderColor: "border-[#C5A059]/20",
    description: "No moment of triumph or relaxation is complete without an Attaie Cigar. Crafted for those who appreciate depth, complexity, and indulgence, it serves as the finishing touch to a day defined by success. Whether celebrating milestones or savoring a quiet evening, the ritual of lighting a cigar underscores a commitment to living exceptionally."
  }
];

function LifestyleProfileSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 md:py-36 relative overflow-hidden" data-testid="section-lifestyle-profile">
      <TropicalPattern opacity={0.02} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-[#C5A059]/5 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#2DD4BF]/5 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-[2px] bg-gradient-to-r from-[#C5A059] to-[#2DD4BF] mx-auto mb-8"
          />
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-[1.1] pb-2" data-testid="text-lifestyle-title">
            The <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Attaie</span> Lifestyle
          </h2>
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-10">Where Performance, Elegance & Indulgence Converge</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mb-20"
        >
          <div className="relative p-8 md:p-12 rounded-lg border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#C5A059]/60 to-transparent" />
              <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-[#C5A059]/60 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24">
              <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-[#C5A059]/60 to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-[#C5A059]/60 to-transparent" />
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/30 flex items-center justify-center">
                <span className="text-[#C5A059] font-serif text-xl font-bold">SA</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-serif text-white mb-1" data-testid="text-lifestyle-intro-heading">What Sets Samay Attaie Apart?</h3>
                <div className="w-12 h-[1px] bg-[#C5A059]/40 mb-5" />
                <p className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                  Samay Attaie is synonymous with a life lived at full throttle—where supercars roar, fairways stretch endlessly, and every defining moment is marked by the unmistakable presence of an Attaie Cigar.
                </p>
                <p className="text-white/45 text-base md:text-lg leading-relaxed font-light mt-4">
                  Driven by an appreciation for craftsmanship, performance, and prestige, he has curated a lifestyle that reflects distinction at every turn. From the gleam of exotic automobiles to the quiet focus of the golf course, his world is defined by precision, power, and luxury.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          {lifestyleCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.15 }}
              className="group relative"
              data-testid={`card-lifestyle-${index}`}
            >
              <div
                className="relative h-full p-8 rounded-lg border transition-all duration-500"
                style={{
                  borderColor: `${card.color}25`,
                  background: `linear-gradient(to bottom, ${card.color}08, transparent)`
                }}
              >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-radial ${card.accentGlow} to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 border"
                  style={{
                    borderColor: `${card.color}30`,
                    background: `linear-gradient(135deg, ${card.color}15, transparent)`
                  }}
                >
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>

                <h3 className="text-lg font-serif text-white mb-4 leading-snug" style={{ color: card.color }}>
                  {card.title}
                </h3>

                <p className="text-white/50 text-sm leading-relaxed font-light">
                  {card.description}
                </p>

                <div
                  className="mt-6 w-8 h-[1px] opacity-40 group-hover:w-16 transition-all duration-500"
                  style={{ background: card.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <div className="relative p-10 md:p-14 rounded-lg bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.04]">
            <Quote className="w-8 h-8 text-[#C5A059]/20 mx-auto mb-6 rotate-180" />
            <p className="text-white/55 text-base md:text-lg leading-relaxed font-light italic mb-10">
              Supercars, golf, and Attaie Cigars don't just define his lifestyle—they elevate it into an experience few can rival.
            </p>

            <div className="flex flex-col items-end">
              <p className="text-2xl md:text-3xl font-serif italic bg-gradient-to-r from-[#C5A059] to-[#d4af68] bg-clip-text text-transparent mb-1">
                Samay Attaie
              </p>
              <p className="text-white/30 text-xs uppercase tracking-[0.25em]">Founder & Visionary</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Heritage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <HeroSection />
      
      <FounderQuoteSection />
      
      <LifestyleGallery />
      
      <TimelineSection />
      
      <ValuesSection />
      
      <DominicanRepublicMap />
      
      <DominicanSoulSection />
      
      <TransformationSlider />
      
      <LifestyleProfileSection />
      
      <div className="flex justify-center py-16">
        <DecorativeDivider variant="ornate" />
      </div>
    </div>
  );
}
