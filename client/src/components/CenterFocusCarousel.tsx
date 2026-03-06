import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LazyImage } from "./LazyImage";
import type { Product } from "@shared/schema";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface CenterFocusCarouselProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function CenterFocusCarousel({ 
  products, 
  onQuickView,
  onAddToCart 
}: CenterFocusCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(Math.floor(products.length / 2));
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const x = useMotionValue(0);
  
  const CARD_WIDTH = 320;
  const CARD_GAP = 24;
  const VISIBLE_CARDS = 5;
  
  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(products.length - 1, index));
    setActiveIndex(clampedIndex);
    
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const centerOffset = (containerWidth - CARD_WIDTH) / 2;
      const targetX = -(clampedIndex * (CARD_WIDTH + CARD_GAP)) + centerOffset;
      
      if (shouldReduceMotion) {
        x.set(targetX);
      } else {
        animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
      }
    }
  };
  
  useEffect(() => {
    scrollToIndex(activeIndex);
    
    const handleResize = () => scrollToIndex(activeIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, products.length]);
  
  const handlePrev = () => {
    scrollToIndex(activeIndex - 1);
  };
  
  const handleNext = () => {
    scrollToIndex(activeIndex + 1);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="overflow-hidden py-8"
      >
        <motion.div 
          className="flex gap-6"
          style={{ x }}
        >
          {products.map((product, index) => {
            const distance = Math.abs(index - activeIndex);
            const isActive = index === activeIndex;
            const scale = isActive ? 1.15 : Math.max(0.75, 1 - distance * 0.12);
            const opacity = isActive ? 1 : Math.max(0.4, 1 - distance * 0.25);
            const zIndex = isActive ? 20 : 10 - distance;
            
            return (
              <motion.div
                key={product.id}
                className="flex-shrink-0 cursor-pointer"
                style={{ 
                  width: CARD_WIDTH,
                  zIndex
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ 
                  scale,
                  opacity
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => {
                  if (!isActive) {
                    e.preventDefault();
                    scrollToIndex(index);
                  }
                }}
                data-testid={`card-carousel-product-${product.id}`}
              >
                <Link href={isActive ? `/product/${product.id}` : "#"} onClick={(e) => !isActive && e.preventDefault()}>
                  <div className={`relative group overflow-hidden rounded-lg transition-all duration-500 ${
                    isActive 
                      ? 'ring-2 ring-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.3)]' 
                      : 'ring-1 ring-white/10'
                  }`}>
                    <div className="relative aspect-[3/4] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                      <LazyImage
                        src={product.imageUrl}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isActive ? 'scale-105' : 'scale-100 grayscale-[30%]'
                        } group-hover:scale-110`}
                      />
                      
                      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-300 ${
                        isActive ? 'opacity-80' : 'opacity-60'
                      }`} />
                      
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="absolute top-0 left-0 w-16 h-16">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent" />
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#C5A059] to-transparent" />
                          </div>
                          <div className="absolute top-0 right-0 w-16 h-16">
                            <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#C5A059] to-transparent" />
                            <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#C5A059] to-transparent" />
                          </div>
                          <div className="absolute bottom-0 left-0 w-16 h-16">
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent" />
                            <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-[#C5A059] to-transparent" />
                          </div>
                          <div className="absolute bottom-0 right-0 w-16 h-16">
                            <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#C5A059] to-transparent" />
                            <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-[#C5A059] to-transparent" />
                          </div>
                        </motion.div>
                      )}
                      
                      {isActive && (
                        <motion.div 
                          className="absolute top-3 left-3"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="bg-gradient-to-r from-[#C5A059] to-[#d4af68] text-black px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase font-semibold">
                            Featured
                          </div>
                        </motion.div>
                      )}
                      
                      <div className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onQuickView?.(product);
                          }}
                          className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70"
                          data-testid={`button-quickview-${product.id}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleAddToCart(product, e)}
                          className={`h-8 w-8 rounded-full backdrop-blur-sm border transition-colors ${
                            addedToCart === product.id
                              ? 'bg-green-500 border-green-500'
                              : 'bg-[#C5A059]/80 border-[#C5A059] hover:bg-[#C5A059]'
                          }`}
                          data-testid={`button-addcart-${product.id}`}
                        >
                          {addedToCart === product.id ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <ShoppingBag className="w-3.5 h-3.5 text-black" />
                          )}
                        </Button>
                      </div>
                      
                      <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
                        isActive ? 'translate-y-0' : 'translate-y-2'
                      }`}>
                        <h3 className={`font-serif text-lg mb-1 transition-colors ${
                          isActive ? 'text-[#C5A059]' : 'text-white/80'
                        }`}>
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <span className={`text-xs tracking-wider uppercase ${
                            isActive ? 'text-white/60' : 'text-white/40'
                          }`}>
                            {product.origin}
                          </span>
                          <span className={`font-bebas ${
                            isActive ? 'text-[#2DD4BF]' : 'text-white/60'
                          }`}>
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            className="flex items-center gap-2 mt-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded ${
                              product.strength === 'mild' ? 'bg-green-500/20 text-green-400' :
                              product.strength === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              product.strength === 'medium-full' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {product.strength}
                            </span>
                            <span className="text-white/40 text-xs">
                              {product.format}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      <button
        onClick={handlePrev}
        disabled={activeIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-[#C5A059]/30 flex items-center justify-center transition-all hover:bg-[#C5A059]/20 hover:border-[#C5A059] disabled:opacity-30 disabled:cursor-not-allowed"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="w-6 h-6 text-[#C5A059]" />
      </button>
      
      <button
        onClick={handleNext}
        disabled={activeIndex === products.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-[#C5A059]/30 flex items-center justify-center transition-all hover:bg-[#C5A059]/20 hover:border-[#C5A059] disabled:opacity-30 disabled:cursor-not-allowed"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="w-6 h-6 text-[#C5A059]" />
      </button>
      
      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex 
                ? 'w-8 h-2 bg-[#C5A059]' 
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
      
      <motion.div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/40 text-xs tracking-wider">
          Click or use arrows to browse
        </p>
      </motion.div>
    </div>
  );
}
