import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@shared/schema";

interface CigarShowcaseProps {
  products: Product[];
}

export function CigarShowcase({ products }: CigarShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % products.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

  const activeProduct = products[activeIndex];

  if (!activeProduct) return null;

  return (
    <section className="snap-section py-16 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Decorative smoke SVG - hidden on mobile for performance */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none hidden md:block">
        <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,400 Q360,300 720,400 T1440,400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#C5A059]"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,400 Q360,300 720,400 T1440,400;
                      M0,400 Q360,500 720,400 T1440,400;
                      M0,400 Q360,300 720,400 T1440,400"
            />
          </path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-10 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 md:mb-6 block">Discover Your Experience</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white italic">What's Your Indulgence?</h2>
        </motion.div>

        {/* Product Tabs - Horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-4 mb-8 md:mb-16 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <div className="flex md:justify-center gap-2 min-w-max md:min-w-0 md:flex-wrap">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                onClick={() => setActiveIndex(index)}
                className={`px-4 md:px-6 py-2.5 md:py-3 text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                  index === activeIndex 
                    ? "bg-[#C5A059] text-black font-semibold" 
                    : "text-white/50 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
                whileTap={{ scale: 0.98 }}
                data-testid={`tab-cigar-${product.id}`}
              >
                {product.name.replace("Attaie Reserve ", "")}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Showcase Card */}
        <div className="relative">
          {/* Navigation Arrows - adjusted for mobile */}
          <button 
            onClick={prev}
            className="absolute left-0 top-1/3 md:top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all bg-black/80 md:bg-black/50 md:-translate-x-12"
            data-testid="button-prev-cigar"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button 
            onClick={next}
            className="absolute right-0 top-1/3 md:top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all bg-black/80 md:bg-black/50 md:translate-x-12"
            data-testid="button-next-cigar"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center px-12 md:px-0"
            >
              {/* Image */}
              <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
                <motion.img 
                  src={activeProduct.imageUrl} 
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              </div>

              {/* Details */}
              <div className="space-y-6 md:space-y-8">
                <div>
                  <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-3 md:mb-4 block">What's Your Indulgence?</span>
                  <h3 className="text-2xl md:text-4xl font-serif text-white mb-4 md:mb-6">{activeProduct.name}</h3>
                  <p className="text-white/50 text-base md:text-lg leading-relaxed font-light">
                    {activeProduct.description}
                  </p>
                </div>

                {/* Cigar Anatomy */}
                <div className="border-t border-b border-white/10 py-6 md:py-8">
                  <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] mb-4 md:mb-6 font-medium">Cigar Anatomy</h4>
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    <div>
                      <span className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-[0.15em] block mb-1 md:mb-2">Wrapper</span>
                      <span className="text-white font-medium text-sm md:text-base">Ecuadorian</span>
                    </div>
                    <div>
                      <span className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-[0.15em] block mb-1 md:mb-2">Binder</span>
                      <span className="text-white font-medium text-sm md:text-base">Dominican</span>
                    </div>
                    <div>
                      <span className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-[0.15em] block mb-1 md:mb-2">Filler</span>
                      <span className="text-white font-medium text-sm md:text-base">{activeProduct.origin}</span>
                    </div>
                  </div>
                </div>

                {/* Available Sizes */}
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] mb-3 md:mb-4 font-medium">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    <span className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 text-white/60 text-xs md:text-sm">{activeProduct.format}</span>
                    <span className="px-3 md:px-4 py-1.5 md:py-2 border border-white/10 text-white/30 text-xs md:text-sm">Robusto</span>
                    <span className="px-3 md:px-4 py-1.5 md:py-2 border border-white/10 text-white/30 text-xs md:text-sm">Gran Toro</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-2 md:pt-4">
                  <span className="text-2xl md:text-3xl text-[#C5A059] font-bebas">${Number(activeProduct.price).toFixed(2)}</span>
                  <motion.button 
                    className="btn-luxury gold-gradient text-black px-8 md:px-10 py-3 md:py-4 text-xs tracking-[0.2em] uppercase font-semibold w-full sm:w-auto"
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-12">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 transition-all duration-300 ${
                index === activeIndex ? "bg-[#C5A059] w-6 md:w-8" : "bg-white/20 hover:bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
