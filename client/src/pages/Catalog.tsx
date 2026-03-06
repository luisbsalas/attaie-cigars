import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { AnimatedFiligree } from "@/components/AnimatedFiligree";
import { DecorativeDivider } from "@/components/BaroqueFrame";
import { EmberParticles } from "@/components/EmberParticles";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Filter, Flame, Wind, Mountain, Zap, X, ChevronDown } from "lucide-react";

const strengthData = [
  { id: undefined, label: "All", icon: null, color: "#C5A059", description: "Browse our complete collection" },
  { id: "mild", label: "Mild", icon: Wind, color: "#A8E6CF", description: "Smooth & creamy, perfect for beginners" },
  { id: "medium", label: "Medium", icon: Mountain, color: "#FFD93D", description: "Balanced complexity with subtle spice" },
  { id: "medium-full", label: "Medium-Full", icon: Flame, color: "#FF8C42", description: "Rich flavors with bold character" },
  { id: "full", label: "Full", icon: Zap, color: "#E8736F", description: "Intense & powerful, for the connoisseur" },
];

function ParallaxHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.div 
      ref={ref}
      className="relative py-24 md:py-32 text-center overflow-hidden"
      initial={{ opacity: 1, scale: 1 }}
      style={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity, scale }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.15)_0%,transparent_60%)]"
        style={shouldReduceMotion ? { y: 0 } : { y }}
      />
      
      <AnimatedFiligree position="top-left" size="lg" delay={0} className="opacity-50" />
      <AnimatedFiligree position="top-right" size="lg" delay={0.2} className="opacity-50" />
      
      <motion.span 
        className="text-[#2DD4BF] text-xs tracking-[0.4em] uppercase mb-6 block relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        The Reserve Collection
      </motion.span>
      
      <motion.h1 
        className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight relative z-10" 
        data-testid="text-catalog-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Browse the{" "}
        <span className="bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">
          Humidor
        </span>
      </motion.h1>
      
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <DecorativeDivider variant="simple" className="w-48" />
      </motion.div>
      
      <motion.p 
        className="text-white/40 font-light max-w-xl mx-auto text-lg relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Explore our range of premium cigars, each crafted to deliver a unique and memorable experience.
      </motion.p>
    </motion.div>
  );
}

function LuxuryFilterPanel({ 
  strengthFilter, 
  setStrengthFilter 
}: { 
  strengthFilter: string | undefined; 
  setStrengthFilter: (s: string | undefined) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const currentStrength = strengthData.find(s => s.id === strengthFilter) || strengthData[0];

  return (
    <motion.div 
      className="mb-16 relative z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full md:w-auto mx-auto flex items-center justify-center gap-4 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-[#C5A059]/40 transition-all group"
        data-testid="button-toggle-filters"
      >
        <Filter className="w-4 h-4 text-[#C5A059]" />
        <span className="text-white text-sm tracking-wider">
          Filter: <span className="text-[#C5A059] font-medium">{currentStrength.label}</span>
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 mt-4 w-full max-w-3xl"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/60 text-xs uppercase tracking-wider">Select Strength</span>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {strengthData.map((strength, index) => {
                  const Icon = strength.icon;
                  const isActive = strengthFilter === strength.id;
                  
                  return (
                    <motion.button
                      key={strength.id || "all"}
                      onClick={() => {
                        setStrengthFilter(strength.id);
                        setIsExpanded(false);
                      }}
                      className={`relative p-4 rounded-lg border transition-all duration-300 text-left group ${
                        isActive 
                          ? "border-[#C5A059] bg-[#C5A059]/10" 
                          : "border-white/10 hover:border-white/30 bg-white/5"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={shouldReduceMotion ? {} : { delay: index * 0.05 }}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      data-testid={`button-filter-${strength.label.toLowerCase()}`}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          style={{ 
                            boxShadow: `0 0 20px ${strength.color}30`
                          }}
                          layoutId="activeFilter"
                        />
                      )}
                      
                      <div className="flex items-center gap-2 mb-2">
                        {Icon && (
                          <Icon 
                            className="w-4 h-4 transition-colors" 
                            style={{ color: isActive ? strength.color : 'rgba(255,255,255,0.4)' }}
                          />
                        )}
                        <span className={`text-sm font-medium transition-colors ${
                          isActive ? 'text-white' : 'text-white/70'
                        }`}>
                          {strength.label}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-white/40 line-clamp-2">
                        {strength.description}
                      </p>
                      
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg transition-opacity"
                        style={{ 
                          backgroundColor: strength.color,
                          opacity: isActive ? 1 : 0
                        }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap justify-center gap-2 mt-8 md:hidden">
        {strengthData.map((strength) => (
          <button
            key={strength.id || "all"}
            onClick={() => setStrengthFilter(strength.id)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
              strengthFilter === strength.id
                ? "bg-[#C5A059] text-black"
                : "bg-white/5 text-white/60 border border-white/10"
            }`}
          >
            {strength.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function StaggeredProductGrid({ products, isLoading }: { products: any[]; isLoading: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div 
            key={i} 
            className="product-card-teal p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="skeleton-teal aspect-[3/4] mb-6 rounded-lg" />
            <div className="skeleton-teal h-5 w-3/4 mx-auto mb-3 rounded" />
            <div className="skeleton-teal h-3 w-1/2 mx-auto mb-3 rounded" />
            <div className="skeleton-teal h-4 w-1/3 mx-auto rounded" />
          </motion.div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <motion.div 
        className="text-center py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
          <Filter className="w-8 h-8 text-white/20" />
        </div>
        <p className="text-white/40 text-xl font-light mb-2">No products found</p>
        <p className="text-white/30 text-sm">Try adjusting your filter selection</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
      layout
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const delay = shouldReduceMotion ? 0 : (row * 0.1) + (col * 0.05);
          
          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                delay,
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              data-testid={`card-product-${product.id}`}
            >
              <ProductCard product={product} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Catalog() {
  const [strengthFilter, setStrengthFilter] = useState<string | undefined>(undefined);
  const { data: products, isLoading } = useProducts({});

  const filteredProducts = strengthFilter 
    ? products?.filter(p => p.strength.toLowerCase() === strengthFilter.toLowerCase())
    : products;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-8 pb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,115,111,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(184,169,201,0.05)_0%,transparent_50%)]" />
      
      <EmberParticles count={15} colors={["gold", "coral"]} className="opacity-40" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ParallaxHeader />
        
        <LuxuryFilterPanel 
          strengthFilter={strengthFilter} 
          setStrengthFilter={setStrengthFilter} 
        />
        
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-white/30 text-sm">
            {filteredProducts?.length || 0} cigars
          </span>
          
          {strengthFilter && (
            <motion.button
              onClick={() => setStrengthFilter(undefined)}
              className="text-[#C5A059] text-sm flex items-center gap-2 hover:text-[#d4af68] transition-colors"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              data-testid="button-clear-filter"
            >
              <X className="w-3 h-3" />
              Clear filter
            </motion.button>
          )}
        </motion.div>

        <StaggeredProductGrid 
          products={filteredProducts || []} 
          isLoading={isLoading} 
        />
        
        <motion.div 
          className="flex justify-center mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <DecorativeDivider variant="ornate" />
        </motion.div>
      </div>
    </div>
  );
}
