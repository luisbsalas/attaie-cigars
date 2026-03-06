import { useRoute } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-products";
import { ShieldCheck, Truck, ArrowLeft, Flame, Wind, Coffee, Leaf, Star, Plus, Minus } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "wouter";
import { ShareButtons } from "@/components/ShareButtons";
import { useState, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { addToCart } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FloatingSmokeLayer } from "@/components/CigarMotifs";
import { AnimatedFiligree } from "@/components/AnimatedFiligree";
import { DecorativeDivider } from "@/components/BaroqueFrame";

const flavorProfiles: Record<string, { notes: string[]; colors: string[] }> = {
  mild: {
    notes: ["Cream", "Cedar", "Light Spice", "Honey"],
    colors: ["#A8E6CF", "#FFD4B8", "#FFF8E7", "#E8D5B7"]
  },
  medium: {
    notes: ["Leather", "Coffee", "Cocoa", "Nuts"],
    colors: ["#C5A059", "#8B7355", "#D4A574", "#B8A9C9"]
  },
  "medium-full": {
    notes: ["Dark Chocolate", "Espresso", "Earth", "Pepper"],
    colors: ["#8B4513", "#4A3728", "#654321", "#E8736F"]
  },
  full: {
    notes: ["Bold Pepper", "Oak", "Dark Roast", "Molasses"],
    colors: ["#2C1810", "#1a1a1a", "#3D2914", "#C5A059"]
  }
};

const strengthLevels = [
  { name: "Mild", color: "#A8E6CF", value: 25 },
  { name: "Medium", color: "#FFD93D", value: 50 },
  { name: "Medium-Full", color: "#FF8C42", value: 75 },
  { name: "Full", color: "#E8736F", value: 100 }
];

function InteractiveStrengthMeter({ strength }: { strength: string }) {
  const shouldReduceMotion = useReducedMotion();
  const currentStrength = strengthLevels.find(s => s.name.toLowerCase() === strength.toLowerCase()) || strengthLevels[1];
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-4 h-4 text-[#C5A059]" />
        <span className="text-white/60 text-xs uppercase tracking-wider">Strength Profile</span>
      </div>
      
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, #A8E6CF 0%, #FFD93D 33%, #FF8C42 66%, #E8736F 100%)`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${currentStrength.value}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
        />
        
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: currentStrength.color }}
          initial={{ left: 0 }}
          animate={{ left: `calc(${currentStrength.value}% - 10px)` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        {strengthLevels.map((level) => (
          <span 
            key={level.name}
            className={`text-[9px] uppercase tracking-wider transition-colors ${
              level.name.toLowerCase() === strength.toLowerCase() 
                ? 'text-[#C5A059]' 
                : 'text-white/30'
            }`}
          >
            {level.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function FlavorWheel({ strength }: { strength: string }) {
  const shouldReduceMotion = useReducedMotion();
  const profile = flavorProfiles[strength.toLowerCase()] || flavorProfiles.medium;
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <Coffee className="w-4 h-4 text-[#C5A059]" />
        <span className="text-white/60 text-xs uppercase tracking-wider">Tasting Notes</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {profile.notes.map((note, index) => (
          <motion.div
            key={note}
            className="relative px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            whileHover={shouldReduceMotion ? {} : { 
              scale: 1.05,
              borderColor: profile.colors[index]
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full opacity-20"
              style={{ backgroundColor: profile.colors[index] }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3 + index * 0.1 }}
            />
            <span className="relative text-sm text-white/80">{note}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ParallaxProductImage({ src, alt, featured }: { src: string; alt: string; featured: boolean | null }) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { stiffness: 150, damping: 20 };
  const x = useSpring(useTransform(mouseX, [0, 1], [15, -15]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, 1], [15, -15]), springConfig);
  const scale = useSpring(isZoomed ? 1.15 : 1, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  
  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div 
      ref={containerRef}
      className="aspect-[4/5] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] overflow-hidden relative group cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FloatingSmokeLayer className="opacity-30" />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.1)_0%,transparent_70%)]" />
      
      <motion.img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover object-center relative z-10"
        style={shouldReduceMotion ? { x: 0, y: 0, scale: 1 } : { x, y, scale }}
        data-testid="img-product-main"
      />
      
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isZoomed ? 1 : 0 }}
      >
        <div className="absolute top-0 left-0 w-20 h-20">
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div 
            className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#C5A059] to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "top" }}
          />
        </div>
        <div className="absolute top-0 right-0 w-20 h-20">
          <motion.div 
            className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#C5A059] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "right" }}
          />
          <motion.div 
            className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#C5A059] to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "top" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20">
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-[#C5A059] to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "bottom" }}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20">
          <motion.div 
            className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#C5A059] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "right" }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-[#C5A059] to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isZoomed ? 1 : 0 }}
            style={{ transformOrigin: "bottom" }}
          />
        </div>
      </motion.div>
      
      {featured && (
        <motion.div 
          className="absolute top-6 left-6 z-30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-[#C5A059] to-[#d4af68] text-black px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-semibold shadow-lg">
            Featured Selection
          </div>
        </motion.div>
      )}
      
      <motion.div
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl bg-[#C5A059]/20 z-0"
        animate={shouldReduceMotion ? {} : { opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

function PairWithSection() {
  const { data: products } = useProducts({});
  const accessories = [
    { name: "Premium Cutter", price: 45, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400", category: "Cutting" },
    { name: "Cedar Humidor", price: 189, image: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=400", category: "Storage" },
    { name: "Torch Lighter", price: 65, image: "https://images.unsplash.com/photo-1551410224-699683e15636?w=400", category: "Lighting" },
  ];

  return (
    <motion.div 
      className="mt-20 pt-16 border-t border-white/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-3 mb-8">
        <Leaf className="w-5 h-5 text-[#C5A059]" />
        <h3 className="text-xl font-serif text-white">Complete Your Experience</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accessories.map((item, index) => (
          <motion.div
            key={item.name}
            className="group relative bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-[#C5A059]/40 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-[#2DD4BF] text-[9px] uppercase tracking-wider">{item.category}</span>
              <h4 className="text-white font-medium mt-1">{item.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#C5A059] font-bebas">${item.price}</span>
                <Button size="sm" variant="outline" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Add
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Link href="/accessories">
        <motion.div 
          className="mt-8 text-center"
          whileHover={{ x: 5 }}
        >
          <span className="text-[#C5A059] text-sm tracking-wider hover:underline cursor-pointer">
            View All Accessories →
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: product, isLoading, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <motion.div 
        className="w-16 h-16 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A]">
      <h2 className="text-3xl font-serif text-white mb-6">Product Not Found</h2>
      <Link href="/catalog">
        <span className="text-[#C5A059] hover:underline cursor-pointer flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </span>
      </Link>
    </div>
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-12 pb-32 relative overflow-hidden">
      <AnimatedFiligree position="top-left" size="lg" delay={0} className="opacity-40" />
      <AnimatedFiligree position="top-right" size="lg" delay={0.2} className="opacity-40" />
      
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#C5A059]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/catalog">
            <span className="group flex items-center gap-3 text-white/40 hover:text-[#C5A059] transition-colors cursor-pointer text-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-[0.15em] text-[11px]">Back to Collection</span>
            </span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ParallaxProductImage 
              src={product.imageUrl} 
              alt={product.name}
              featured={product.featured}
            />
            
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i} 
                  className="aspect-square bg-white/5 cursor-pointer overflow-hidden border border-white/10 hover:border-[#C5A059]/50 transition-colors rounded-sm"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="lg:sticky lg:top-32"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-10 pb-10 border-b border-white/10">
              <motion.span 
                className="text-[#C5A059] text-[10px] tracking-[0.4em] uppercase mb-4 block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Attaie Reserve
              </motion.span>
              <motion.h1 
                className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight" 
                data-testid="text-product-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {product.name}
              </motion.h1>
              <motion.div 
                className="flex items-center gap-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-3xl text-[#C5A059] font-bebas" data-testid="text-product-price">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border rounded-sm ${
                  product.strength === 'mild' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                  product.strength === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                  product.strength === 'medium-full' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                  'border-red-500/30 text-red-400 bg-red-500/10'
                }`}>
                  {product.strength}
                </span>
              </motion.div>
              <motion.p 
                className="text-white/50 leading-relaxed font-light text-lg mb-6" 
                data-testid="text-product-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {product.description}
              </motion.p>
              <ShareButtons 
                url={`/product/${product.id}`} 
                title={`${product.name} - Attaie Cigars`}
                description={product.description || ""}
              />
            </div>

            <motion.div 
              className="mb-10 pb-10 border-b border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <InteractiveStrengthMeter strength={product.strength} />
            </motion.div>

            <motion.div 
              className="mb-10 pb-10 border-b border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <FlavorWheel strength={product.strength} />
            </motion.div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-6 mb-12">
              {[
                { label: "Origin", value: product.origin, icon: "🌍" },
                { label: "Format", value: product.format, icon: "📏" },
                { label: "Wrapper", value: "Ecuadorian Connecticut", icon: "🍂" },
                { label: "Binder", value: "Dominican San Vicente", icon: "🌿" },
              ].map((attr, index) => (
                <motion.div
                  key={attr.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <span className="text-white/30 block text-[10px] uppercase tracking-[0.2em] mb-2">{attr.label}</span>
                  <span className="text-white font-medium">{attr.value}</span>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-5 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex border border-white/20 w-36 rounded-sm overflow-hidden">
                <motion.button 
                  className="w-12 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <input 
                  type="text" 
                  value={quantity} 
                  className="w-full text-center border-x border-white/20 outline-none text-white font-medium bg-transparent" 
                  readOnly 
                  data-testid="input-quantity"
                />
                <motion.button 
                  className="w-12 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              <motion.button 
                className="btn-luxury flex-1 gold-gradient text-black uppercase tracking-[0.2em] text-sm font-semibold py-5 relative overflow-hidden group"
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <span className="relative z-10">Add to Cart</span>
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.button>
            </motion.div>

            <div className="space-y-5">
              <motion.div 
                className="flex items-center gap-5 p-5 border border-white/10 bg-white/[0.02] rounded-sm"
                whileHover={{ borderColor: "rgba(197, 160, 89, 0.3)" }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                data-testid="card-free-shipping"
              >
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <span className="block font-medium text-white text-sm">Free Shipping</span>
                  <span className="text-white/40 text-xs">Store wide during grand opening</span>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-5 p-5 border border-white/10 bg-white/[0.02] rounded-sm"
                whileHover={{ borderColor: "rgba(197, 160, 89, 0.3)" }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                data-testid="card-authenticity"
              >
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <span className="block font-medium text-white text-sm">Authenticity Guaranteed</span>
                  <span className="text-white/40 text-xs">Hand-rolled by master craftsmen</span>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-5 p-5 border border-white/10 bg-white/[0.02] rounded-sm"
                whileHover={{ borderColor: "rgba(197, 160, 89, 0.3)" }}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                data-testid="card-rating"
              >
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <span className="block font-medium text-white text-sm">Highly Rated</span>
                  <span className="text-white/40 text-xs">4.9/5 from 200+ reviews</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <PairWithSection />
        
        <div className="flex justify-center mt-16">
          <DecorativeDivider variant="ornate" />
        </div>
      </div>
    </div>
  );
}
