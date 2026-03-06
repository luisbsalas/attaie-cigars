import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ShoppingBag, ChevronRight, Pause, Play, Check } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import cigarImage from "@assets/egm_poderosos_single_cigar__36600_1769404816744.jpg";
import { useToast } from "@/hooks/use-toast";

function addToCart(product: Product, quantity: number = 1) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingIndex = cart.findIndex((item: any) => item.id === String(product.id));
  
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: String(product.id),
      name: product.name,
      price: Number(product.price),
      quantity,
      image: product.imageUrl,
      priceId: product.stripePriceId || `product_${product.id}`,
      format: product.format,
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

export function CigarSelector() {
  const { data: products, isLoading } = useProducts({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [addedToCart, setAddedToCart] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const selectedProduct = products?.[selectedIndex];

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, 1);
    setAddedToCart(true);
    toast({
      title: "Added to Cart",
      description: `${selectedProduct.name} has been added to your cart.`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Auto-showcase mode
  useEffect(() => {
    if (isAutoPlaying && products && products.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setSelectedIndex((prev) => (prev + 1) % products.length);
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, products]);

  // Parallax mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x: x * 20, y: y * 20 });
  };

  const handleSelectCigar = (index: number) => {
    setSelectedIndex(index);
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const getStrengthLevel = (strength: string): number => {
    switch (strength?.toLowerCase()) {
      case "mild": return 25;
      case "medium": return 50;
      case "medium-full": return 75;
      case "full": return 100;
      default: return 50;
    }
  };

  const getFlavorNotes = (product: Product): string[] => {
    const flavorMap: Record<string, string[]> = {
      "Mild": ["Cedar", "Cream", "Vanilla"],
      "Medium": ["Leather", "Coffee", "Nuts"],
      "Medium-Full": ["Chocolate", "Earth", "Spice"],
      "Full": ["Pepper", "Dark Chocolate", "Tobacco"],
    };
    return flavorMap[product.strength] || ["Rich", "Complex", "Smooth"];
  };

  if (isLoading || !products || products.length === 0) {
    return (
      <section className="snap-section py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-[600px] skeleton-teal rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="snap-section py-16 md:py-24 bg-gradient-to-b from-[#0A0A0A] via-[#0d0d0d] to-[#0A0A0A] relative overflow-hidden">
      {/* Background smoke effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="smoke-wisp" style={{ top: '20%', animationDelay: '0s' }} />
        <div className="smoke-wisp" style={{ top: '50%', animationDelay: '3s' }} />
        <div className="smoke-wisp" style={{ top: '80%', animationDelay: '6s' }} />
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-10 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-4 block">
            The Collection
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
            Explore Our <span className="italic text-[#C5A059]">Signature</span> Cigars
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Each cigar tells a story of heritage and craftsmanship
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div 
          ref={containerRef}
          className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
        >
          {/* Left Side - Featured Cigar Image */}
          <div className="relative order-2 md:order-1">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Glow effect behind cigar */}
              <div className="absolute inset-0 bg-gradient-radial from-[#C5A059]/10 via-transparent to-transparent blur-3xl" />
              
              {/* Cigar image with parallax */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProduct?.id}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotateY: 0,
                    x: mousePosition.x,
                    y: mousePosition.y,
                  }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  transition={{ 
                    duration: 0.7, 
                    ease: [0.23, 1, 0.32, 1],
                    x: { duration: 0.1 },
                    y: { duration: 0.1 },
                  }}
                  className="relative w-full h-full"
                >
                  <img
                    src={cigarImage}
                    alt={selectedProduct?.name || "Premium Cigar"}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                  
                  {/* Origin badge */}
                  <motion.div 
                    className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#C5A059]/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-[#C5A059] text-xs tracking-wider uppercase">
                      {selectedProduct?.origin}
                    </span>
                  </motion.div>

                  {/* Format badge */}
                  <motion.div 
                    className="absolute top-4 right-4 bg-[#C5A059] px-3 py-1.5 rounded-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-black text-xs font-semibold tracking-wider uppercase">
                      {selectedProduct?.format}
                    </span>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Smoke wisps around image */}
              <div className="absolute -left-10 top-1/4 w-20 h-40 opacity-30">
                <div className="w-full h-full bg-gradient-to-r from-white/10 to-transparent blur-xl animate-pulse" />
              </div>
              <div className="absolute -right-10 top-1/2 w-20 h-40 opacity-30">
                <div className="w-full h-full bg-gradient-to-l from-white/10 to-transparent blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>

            {/* Product Details Below Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProduct?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 text-center"
              >
                {/* Strength Meter */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-white/50 text-xs uppercase tracking-wider">Strength</span>
                    <span className="text-[#C5A059] text-sm font-medium">{selectedProduct?.strength}</span>
                  </div>
                  <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#C5A059] to-[#1a6b6b] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getStrengthLevel(selectedProduct?.strength || '')}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Flavor Notes */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {selectedProduct && getFlavorNotes(selectedProduct).map((note, i) => (
                    <motion.span
                      key={note}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs"
                    >
                      {note}
                    </motion.span>
                  ))}
                </div>

                {/* Price */}
                <div className="text-3xl font-bebas text-white mb-4">
                  ${selectedProduct?.price}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Link href={`/product/${selectedProduct?.id}`}>
                    <motion.button
                      className="px-6 py-3 bg-[#C5A059] text-black font-medium text-sm uppercase tracking-wider rounded hover:bg-[#d4af68] transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid="button-selector-view-details"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={handleAddToCart}
                    className={`p-3 border rounded transition-colors ${addedToCart ? 'bg-green-500 border-green-500 text-white' : 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="button-selector-add-cart"
                  >
                    {addedToCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Cigar Selection List */}
          <div className="order-1 md:order-2">
            <div className="relative">
              {/* Auto-play toggle */}
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <h3 className="text-white/40 text-xs uppercase tracking-[0.2em]">
                  Select a Cigar
                </h3>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="flex items-center gap-2 text-white/40 hover:text-[#C5A059] transition-colors text-xs uppercase tracking-wider"
                  data-testid="button-toggle-autoplay"
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3 h-3" />
                      Auto-Playing
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Paused
                    </>
                  )}
                </button>
              </div>

              {/* Cigar List */}
              <div className="space-y-1">
                {products.map((product, index) => (
                  <motion.button
                    key={product.id}
                    onClick={() => handleSelectCigar(index)}
                    className={`w-full text-left py-3 md:py-4 px-4 md:px-6 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                      selectedIndex === index
                        ? 'bg-gradient-to-r from-[#C5A059]/20 to-transparent border-l-2 border-[#C5A059]'
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    data-testid={`button-select-cigar-${product.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-serif text-xl md:text-2xl transition-colors ${
                          selectedIndex === index ? 'text-[#C5A059]' : 'text-white group-hover:text-[#C5A059]'
                        }`}>
                          {product.name.replace('Attaie Reserve ', '')}
                        </h4>
                        <p className="text-white/40 text-sm mt-1">
                          {product.format} • {product.strength}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bebas transition-colors ${
                          selectedIndex === index ? 'text-[#C5A059]' : 'text-white/50'
                        }`}>
                          ${product.price}
                        </span>
                        <ChevronRight className={`w-5 h-5 transition-all ${
                          selectedIndex === index 
                            ? 'text-[#C5A059] translate-x-1' 
                            : 'text-white/20 group-hover:text-[#C5A059] group-hover:translate-x-1'
                        }`} />
                      </div>
                    </div>

                    {/* Progress bar for auto-play */}
                    {selectedIndex === index && isAutoPlaying && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        key={`progress-${index}-${Date.now()}`}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* View All Link */}
              <motion.div 
                className="mt-8 pt-6 border-t border-white/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Link href="/catalog">
                  <span className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#d4af68] transition-colors cursor-pointer group">
                    <span className="text-sm uppercase tracking-wider">View Full Collection</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
