import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TropicalPattern } from "@/components/Decorations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedFiligree } from "@/components/AnimatedFiligree";
import { EmberParticles } from "@/components/EmberParticles";
import { FloatingSmokeLayer } from "@/components/CigarMotifs";
import { useToast } from "@/hooks/use-toast";

const accessories = [
  {
    id: 1,
    name: "Attaie Gold Cutter",
    category: "Cutters",
    price: 75,
    rating: 5,
    image: "https://images.unsplash.com/photo-1611493620822-7ab5ebda3d55?auto=format&fit=crop&q=80&w=600",
    description: "Precision double-blade guillotine cutter with 24k gold finish",
    featured: true
  },
  {
    id: 2,
    name: "Dominican Cedar Humidor",
    category: "Humidors",
    price: 350,
    rating: 5,
    image: "https://images.unsplash.com/photo-1629975450378-4906a9d3a0fc?auto=format&fit=crop&q=80&w=600",
    description: "50-count Spanish cedar-lined humidor with tropical design",
    featured: true
  },
  {
    id: 3,
    name: "Torch Triple Flame",
    category: "Lighters",
    price: 120,
    rating: 4,
    image: "https://images.unsplash.com/photo-1567626838537-cd3b6b84c437?auto=format&fit=crop&q=80&w=600",
    description: "Triple-jet butane lighter with windproof ignition",
    featured: true
  },
  {
    id: 4,
    name: "Travel Humidor Case",
    category: "Travel",
    price: 95,
    rating: 5,
    image: "https://images.unsplash.com/photo-1618225747879-abbffe64ba57?auto=format&fit=crop&q=80&w=600",
    description: "Premium leather 5-cigar travel case with built-in humidifier",
    featured: false
  },
  {
    id: 5,
    name: "Crystal Ashtray",
    category: "Ashtrays",
    price: 185,
    rating: 5,
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600",
    description: "Hand-cut crystal ashtray with four cigar rests",
    featured: false
  },
  {
    id: 6,
    name: "Cedar Spill Bundle",
    category: "Accessories",
    price: 25,
    rating: 4,
    image: "https://images.unsplash.com/photo-1576074321605-ea78c3bca1fb?auto=format&fit=crop&q=80&w=600",
    description: "100 Spanish cedar spills for the purist's lighting ritual",
    featured: false
  },
  {
    id: 7,
    name: "Punch Cutter Set",
    category: "Cutters",
    price: 55,
    rating: 4,
    image: "https://images.unsplash.com/photo-1611493620822-7ab5ebda3d55?auto=format&fit=crop&q=80&w=600",
    description: "Multi-gauge punch cutter set in leather case",
    featured: false
  },
  {
    id: 8,
    name: "Desktop Humidor",
    category: "Humidors",
    price: 595,
    rating: 5,
    image: "https://images.unsplash.com/photo-1629975450378-4906a9d3a0fc?auto=format&fit=crop&q=80&w=600",
    description: "100-count piano finish humidor with digital hygrometer",
    featured: false
  }
];

const categories = ["All", "Cutters", "Humidors", "Lighters", "Travel", "Ashtrays", "Accessories"];

function FeaturedCarousel() {
  const shouldReduceMotion = useReducedMotion();
  const featuredItems = accessories.filter(a => a.featured);
  const [activeIndex, setActiveIndex] = useState(1);
  const { toast } = useToast();

  const next = () => setActiveIndex((i) => (i + 1) % featuredItems.length);
  const prev = () => setActiveIndex((i) => (i - 1 + featuredItems.length) % featuredItems.length);

  const addToCart = (item: typeof accessories[0]) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((c: any) => c.id === `accessory-${item.id}`);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: `accessory-${item.id}`,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        priceId: `price_accessory_${item.id}`,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B8A9C9]/5 to-transparent" />
      <EmberParticles count={8} colors={["lavender", "coral"]} className="opacity-20" />
      
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#B8A9C9] text-xs tracking-[0.3em] uppercase mb-4 block">
            Editor's Picks
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Featured <span className="italic text-[#B8A9C9]">Essentials</span>
          </h2>
        </motion.div>

        <div className="relative flex items-center justify-center h-[500px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="absolute left-0 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Button>

          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {featuredItems.map((item, index) => {
                const offset = index - activeIndex;
                const absOffset = Math.abs(offset);
                const isCenter = offset === 0;
                
                let xPos = offset * 250;
                let scale = isCenter ? 1 : 0.7;
                let zIndex = isCenter ? 30 : 20 - absOffset;
                let opacity = absOffset > 1 ? 0 : isCenter ? 1 : 0.5;

                return (
                  <motion.div
                    key={item.id}
                    className="absolute cursor-pointer"
                    initial={{ opacity: 0, scale: 0.5, x: xPos }}
                    animate={shouldReduceMotion ? { opacity, x: xPos, scale } : { 
                      opacity, 
                      x: xPos, 
                      scale,
                      rotateY: offset * 5,
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex }}
                    onClick={() => !isCenter && setActiveIndex(index)}
                  >
                    <div 
                      className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                        isCenter ? 'shadow-2xl shadow-[#B8A9C9]/20' : ''
                      }`}
                      style={{ width: 280, height: 380 }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isCenter ? 'group-hover:scale-105' : ''}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {isCenter && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 p-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge className="mb-3 bg-[#B8A9C9]/20 text-[#B8A9C9] border-[#B8A9C9]/30">
                            {item.category}
                          </Badge>
                          <h3 className="text-white text-xl font-serif mb-2">{item.name}</h3>
                          <p className="text-white/60 text-sm mb-4 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#C5A059] text-2xl font-bebas">${item.price}</span>
                            <Button 
                              size="sm"
                              className="bg-[#B8A9C9] text-black hover:bg-[#a99ab9]"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item);
                              }}
                              data-testid={`button-add-featured-${item.id}`}
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Add
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      
                      {isCenter && (
                        <>
                          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#C5A059] opacity-60" />
                          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#C5A059] opacity-60" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#C5A059] opacity-60" />
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#C5A059] opacity-60" />
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="absolute right-0 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {featuredItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex 
                  ? 'bg-[#B8A9C9] w-6' 
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              data-testid={`button-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="snap-section relative h-[70vh] flex items-center justify-center overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={shouldReduceMotion ? { y: 0 } : { y }}
      >
        <img 
          src="https://images.unsplash.com/photo-1629975450378-4906a9d3a0fc?auto=format&fit=crop&q=80&w=2000"
          alt="Cigar accessories"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <FloatingSmokeLayer className="opacity-40" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-black/50 to-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#B8A9C9]/20 via-transparent to-[#C5A059]/15" />
      
      <AnimatedFiligree position="top-left" size="lg" delay={0.3} className="opacity-50" />
      <AnimatedFiligree position="top-right" size="lg" delay={0.5} className="opacity-50" />
      
      <motion.div 
        className="relative z-10 text-center max-w-4xl px-6"
        initial={{ opacity: 1 }}
        style={shouldReduceMotion ? { opacity: 1 } : { opacity }}
      >
        <motion.div
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="w-4 h-4 text-[#B8A9C9]" />
          <span className="text-white/60 text-sm">Complete Your Experience</span>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-serif text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          data-testid="text-accessories-title"
        >
          Premium <span className="italic bg-gradient-to-r from-[#C5A059] via-[#B8A9C9] to-[#2DD4BF] bg-clip-text text-transparent">Accessories</span>
        </motion.h1>
        <motion.p 
          className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Elevate your cigar ritual with our curated collection of luxury accessories
        </motion.p>
      </motion.div>
    </section>
  );
}

export default function Accessories() {
  const [activeCategory, setActiveCategory] = useState("All");
  const shouldReduceMotion = useReducedMotion();
  const { toast } = useToast();

  const filteredAccessories = activeCategory === "All" 
    ? accessories 
    : accessories.filter(a => a.category === activeCategory);

  const addToCart = (item: typeof accessories[0]) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((c: any) => c.id === `accessory-${item.id}`);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: `accessory-${item.id}`,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        priceId: `price_accessory_${item.id}`,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <ParallaxHero />
      
      <FeaturedCarousel />

      <section className="snap-section py-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`rounded-full uppercase tracking-wider text-sm transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-[#B8A9C9] to-[#E8736F] text-white border-none'
                      : 'border-[#B8A9C9]/40 text-white/70 hover:border-[#B8A9C9] hover:text-white'
                  }`}
                  onClick={() => setActiveCategory(category)}
                  data-testid={`button-category-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="snap-section py-24 relative">
        <TropicalPattern opacity={0.02} />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredAccessories.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout={!shouldReduceMotion}
                  className="group cursor-pointer"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.05 }}
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-[#111] group">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.div
                      className="absolute bottom-4 left-4 right-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-[#B8A9C9] to-[#E8736F] text-white font-medium text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => addToCart(product)}
                        data-testid={`button-add-accessory-${product.id}`}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </motion.div>

                    <Badge 
                      variant="secondary"
                      className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-[#B8A9C9] text-xs uppercase tracking-wider border-none"
                    >
                      {product.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-serif text-lg group-hover:text-[#B8A9C9] transition-colors" data-testid={`text-accessory-name-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-white/40 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-lg font-bebas" data-testid={`text-accessory-price-${product.id}`}>${product.price}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < product.rating ? 'text-[#C5A059] fill-[#C5A059]' : 'text-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="snap-section py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a6b6b]/20 via-transparent to-[#1a6b6b]/20" />
        <TropicalPattern opacity={0.1} />
        <EmberParticles count={6} colors={["gold"]} className="opacity-30" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <AnimatedFiligree position="top-left" size="md" delay={0} className="opacity-40" />
            <AnimatedFiligree position="top-right" size="md" delay={0.2} className="opacity-40" />
            
            <span className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-4 block">
              Perfect Pairing
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
              The Attaie <span className="italic bg-gradient-to-r from-[#C5A059] to-[#E8736F] bg-clip-text text-transparent">Starter Set</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Everything you need to begin your journey. Gold cutter, torch lighter, 
              travel case, and a selection of three signature cigars—all at a special bundle price.
            </p>
            
            <motion.div 
              className="flex items-center justify-center gap-6 mb-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white/40 line-through text-2xl">$295</span>
              <motion.span 
                className="text-[#C5A059] text-5xl font-serif"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                $249
              </motion.span>
              <Badge className="bg-[#E8736F] text-white border-none">Save $46</Badge>
            </motion.div>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#C5A059] to-[#d4af68] text-black font-medium text-sm uppercase tracking-wider btn-glow"
              data-testid="button-shop-bundle"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop the Bundle
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="snap-section py-24 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Accessory <span className="italic text-[#C5A059]">Care Tips</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Humidor Maintenance",
                tips: ["Season with distilled water before first use", "Maintain 70% humidity consistently", "Rotate cigars monthly for even aging"],
                color: "#2DD4BF"
              },
              {
                title: "Cutter Care",
                tips: ["Clean blades after each use", "Store in protective case", "Sharpen or replace annually"],
                color: "#C5A059"
              },
              {
                title: "Lighter Upkeep",
                tips: ["Use only premium butane fuel", "Bleed tank before refilling", "Adjust flame height as needed"],
                color: "#E8736F"
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                className="p-6 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { y: -5 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${section.color}10 0%, transparent 50%)` }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-10 h-1 rounded-full mb-4"
                    style={{ backgroundColor: section.color }}
                  />
                  <h3 className="text-white font-serif text-xl mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/50 text-sm">
                        <span 
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: section.color }}
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
