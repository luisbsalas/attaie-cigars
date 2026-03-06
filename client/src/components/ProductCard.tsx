import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, ShoppingBag, X, Plus, Minus, Check } from "lucide-react";
import type { Product } from "@shared/schema";
import { StrengthMeter } from "./FlavorWheel";
import { LazyImage } from "./LazyImage";
import { CompareButton } from "./CompareButton";
import { useToast } from "@/hooks/use-toast";

export function addToCart(product: Product, quantity: number = 1) {
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

interface ProductCardProps {
  product: Product;
}

// Get strength badge class
function getStrengthBadgeClass(strength: string): string {
  switch (strength?.toLowerCase()) {
    case 'mild': return 'badge-mild';
    case 'medium': return 'badge-medium';
    case 'medium-full': return 'badge-medium-full';
    case 'full': return 'badge-full';
    default: return 'badge-medium';
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(true);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <motion.div 
        className="group cursor-pointer luxury-card product-card-teal relative" 
        data-testid={`card-product-${product.id}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative aspect-[4/5] bg-white/5 overflow-hidden mb-6 md:mb-8">
          {/* Main Image with lazy loading and parallax zoom */}
          <Link href={`/product/${product.id}`}>
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <LazyImage 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full"
                imgClassName="object-center"
              />
            </motion.div>
          </Link>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Quick action buttons */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 px-4 text-[10px] tracking-[0.15em] uppercase font-medium flex items-center justify-center gap-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300"
              data-testid={`button-quickview-${product.id}`}
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
            <button
              onClick={handleAddToCart}
              className={`py-3 px-4 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 ${addedToCart ? 'bg-green-500' : 'bg-[#C5A059]'} text-black hover:brightness-110`}
              data-testid={`button-addcart-${product.id}`}
            >
              {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>

          {/* Featured badge */}
          {product.featured && (
            <motion.div 
              className="absolute top-4 left-4 bg-[#C5A059] text-black px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Featured
            </motion.div>
          )}

          {/* Strength badge - always visible */}
          <div className="absolute top-4 right-4">
            <div className={`${getStrengthBadgeClass(product.strength || '')} px-3 py-1.5 backdrop-blur-sm`}>
              <span className="text-[9px] uppercase tracking-wider font-medium">{product.strength}</span>
            </div>
          </div>
        </div>

        <Link href={`/product/${product.id}`}>
          <div className="text-center space-y-2 md:space-y-3">
            <h3 className="font-serif text-lg md:text-xl text-white group-hover:text-[#C5A059] transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-white/30 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px]">
              {product.origin} | {product.format}
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-[#C5A059] text-lg font-bebas tracking-wide">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
            <div className="mt-3 flex justify-center">
              <CompareButton product={product} />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </>
  );
}

// Quick View Modal Component - exported for use in other components
export function QuickViewModal({ product, isOpen, onClose }: { product: Product; isOpen: boolean; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
    setTimeout(() => {
      setAddedToCart(false);
      onClose();
    }, 1500);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mock additional images
  const images = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-5xl md:h-auto md:max-h-[85vh] bg-[#0A0A0A] border border-white/10 z-50 overflow-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              data-testid="button-close-quickview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-6 md:gap-0">
              {/* Image gallery */}
              <div className="p-4 md:p-8">
                <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-white/5 mb-4">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 border-2 transition-colors ${
                        selectedImage === index ? "border-[#C5A059]" : "border-transparent"
                      }`}
                      data-testid={`button-thumbnail-${index}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product details */}
              <div className="p-4 md:p-8 flex flex-col justify-center">
                <span className="text-[#C5A059] text-[10px] tracking-[0.3em] uppercase mb-3">
                  {product.origin} | {product.format}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">{product.name}</h2>
                <p className="text-white/50 leading-relaxed mb-6 font-light">
                  {product.description}
                </p>

                {/* Strength meter */}
                <StrengthMeter 
                  strength={product.strength as "Mild" | "Medium" | "Medium-Full" | "Full"} 
                  className="mb-6"
                />

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl text-[#C5A059] font-medium">${Number(product.price).toFixed(2)}</span>
                  <span className="text-white/30 text-sm">per cigar</span>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-white/50 text-sm">Quantity</span>
                  <div className="flex items-center border border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                      data-testid="button-quantity-decrease"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-white" data-testid="text-quantity">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                      data-testid="button-quantity-increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <motion.button
                  onClick={handleAddToCart}
                  className={`w-full py-4 text-xs tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-3 mb-4 ${addedToCart ? 'bg-green-500' : 'bg-[#C5A059]'} text-black`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  data-testid="button-modal-addcart"
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart — ${(Number(product.price) * quantity).toFixed(2)}
                    </>
                  )}
                </motion.button>

                {/* View full details link */}
                <Link href={`/product/${product.id}`}>
                  <span 
                    onClick={onClose}
                    className="block text-center text-white/50 hover:text-[#C5A059] transition-colors text-sm underline cursor-pointer"
                  >
                    View Full Details
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
