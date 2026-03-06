import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight, CreditCard, Truck, Shield, Loader2, Package, Check, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TropicalPattern } from "@/components/Decorations";
import { AnimatedFiligree } from "@/components/AnimatedFiligree";
import { useToast } from "@/hooks/use-toast";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  priceId: string;
  format?: string;
}

const checkoutSteps = [
  { id: 1, label: "Cart", icon: ShoppingBag },
  { id: 2, label: "Shipping", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirm", icon: Check }
];

function CheckoutStepper({ currentStep }: { currentStep: number }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <div className="w-full max-w-xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/10 -translate-y-1/2 z-0" />
        <motion.div 
          className="absolute left-0 top-1/2 h-[2px] bg-gradient-to-r from-[#2DD4BF] to-[#C5A059] -translate-y-1/2 z-0"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (checkoutSteps.length - 1)) * 100}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        />
        
        {checkoutSteps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <motion.div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isComplete 
                    ? 'bg-gradient-to-r from-[#2DD4BF] to-[#1a6b6b] border-transparent' 
                    : isActive 
                      ? 'bg-[#C5A059]/20 border-[#C5A059]' 
                      : 'bg-[#111] border-white/20'
                }`}
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#C5A059]' : 'text-white/40'}`} />
                )}
              </motion.div>
              <span className={`mt-2 text-xs tracking-wider ${
                isActive ? 'text-[#C5A059]' : isComplete ? 'text-[#2DD4BF]' : 'text-white/40'
              }`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart:', e);
      }
    }
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem('cart')) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      const items = cartItems.map(item => ({
        priceId: item.priceId,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Unable to proceed to checkout",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart",
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal - discount + shipping;

  const applyPromo = () => {
    if (promoCode.toLowerCase() === "attaie10") {
      setPromoApplied(true);
      toast({
        title: "Promo Applied!",
        description: "10% discount has been applied to your order",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The promo code you entered is not valid",
        variant: "destructive",
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen py-32 relative overflow-hidden">
        <TropicalPattern opacity={0.03} />
        <AnimatedFiligree position="top-left" size="lg" delay={0} className="opacity-30" />
        <AnimatedFiligree position="bottom-right" size="lg" delay={0.3} className="opacity-30" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#2DD4BF]/20 to-[#C5A059]/20 flex items-center justify-center border border-white/10"
              animate={shouldReduceMotion ? {} : { 
                boxShadow: [
                  '0 0 0 0 rgba(45, 212, 191, 0)',
                  '0 0 0 20px rgba(45, 212, 191, 0.1)',
                  '0 0 0 0 rgba(45, 212, 191, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShoppingBag className="w-10 h-10 text-[#2DD4BF]" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-empty-cart">
              Your Cart is <span className="italic bg-gradient-to-r from-[#C5A059] to-[#2DD4BF] bg-clip-text text-transparent">Empty</span>
            </h1>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Discover our premium cigars and start building your collection today.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#2DD4BF] to-[#1a6b6b] text-white font-medium uppercase tracking-wider"
              asChild
            >
              <Link href="/catalog" data-testid="link-browse-cigars">
                <Sparkles className="w-5 h-5 mr-2" />
                Browse Cigars
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <section className="snap-section py-16 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2DD4BF]/5 via-transparent to-[#C5A059]/5" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="text-[#2DD4BF] text-xs tracking-[0.3em] uppercase mb-4 block" data-testid="text-cart-subtitle">
              Your Selection
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white" data-testid="text-cart-title">
              Shopping <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Cart</span>
            </h1>
          </motion.div>
          
          <CheckoutStepper currentStep={1} />
        </div>
      </section>

      <section className="snap-section py-16 relative">
        <TropicalPattern opacity={0.02} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.05,
                      layout: { type: "spring", stiffness: 300, damping: 30 }
                    }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2DD4BF]/10 to-[#C5A059]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    
                    <div className="relative flex flex-wrap gap-6 p-6 bg-gradient-to-br from-[#111]/80 to-[#0d0d0d]/80 border border-white/10 rounded-xl hover:border-[#2DD4BF]/30 transition-all backdrop-blur-sm">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />
                      </div>

                      <div className="flex-1 flex flex-col min-w-[200px]">
                        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                          <div>
                            <h3 className="text-white font-serif text-lg group-hover:text-[#2DD4BF] transition-colors" data-testid={`text-cart-item-${item.id}`}>
                              {item.name}
                            </h3>
                            {item.format && (
                              <span className="text-white/40 text-sm">{item.format}</span>
                            )}
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-white/30 hover:text-[#E8736F] hover:bg-[#E8736F]/10"
                              data-testid={`button-remove-item-${item.id}`}
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                                data-testid={`button-decrease-${item.id}`}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </motion.div>
                            <motion.span 
                              key={item.quantity}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-white w-8 text-center font-bebas text-lg" 
                              data-testid={`text-quantity-${item.id}`}
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                                data-testid={`button-increase-${item.id}`}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </div>

                          <div className="text-right">
                            <motion.span 
                              key={item.price * item.quantity}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[#C5A059] text-xl font-bebas" 
                              data-testid={`text-item-total-${item.id}`}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </motion.span>
                            {item.quantity > 1 && (
                              <span className="text-white/40 text-sm font-bebas block">
                                ${item.price} each
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div 
                className="pt-6 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  className="text-white/50 hover:text-[#2DD4BF]"
                  asChild
                >
                  <Link href="/catalog" data-testid="link-continue-shopping">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Continue Shopping
                  </Link>
                </Button>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-24 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/10 via-transparent to-[#2DD4BF]/10 rounded-2xl blur-xl" />
                
                <div className="relative p-8 bg-[#111]/80 border border-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C5A059] to-[#d4af68] flex items-center justify-center">
                      <Package className="w-5 h-5 text-black" />
                    </div>
                    <h2 className="text-white font-serif text-xl" data-testid="text-order-summary">Order Summary</h2>
                  </div>

                  <div className="mb-6">
                    <label className="text-white/60 text-sm mb-2 block">Promo Code</label>
                    <div className="flex gap-2">
                      <Input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        disabled={promoApplied}
                        className="bg-white/5 border-white/10 text-white focus:border-[#C5A059] rounded-xl"
                        data-testid="input-promo-code"
                      />
                      <Button
                        onClick={applyPromo}
                        disabled={promoApplied || !promoCode}
                        className={`rounded-xl ${promoApplied ? 'bg-green-500' : 'bg-[#C5A059]'} text-black`}
                        data-testid="button-apply-promo"
                      >
                        {promoApplied ? <Check className="w-4 h-4" /> : 'Apply'}
                      </Button>
                    </div>
                    {promoApplied && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-500 text-xs mt-2 flex items-center gap-1" 
                        data-testid="text-promo-success"
                      >
                        <Check className="w-3 h-3" /> 10% discount applied!
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-4 text-sm mb-8">
                    <div className="flex justify-between text-white/60">
                      <span>Subtotal</span>
                      <span className="font-bebas text-base" data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                    <AnimatePresence>
                      {promoApplied && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between text-green-500"
                        >
                          <span>Discount (10%)</span>
                          <span className="font-bebas text-base" data-testid="text-discount">-${discount.toFixed(2)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex justify-between text-white/60">
                      <span>Shipping</span>
                      <span data-testid="text-shipping" className={`font-bebas text-base ${shipping === 0 ? 'text-green-500' : ''}`}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-green-500/60 text-xs">Free shipping on orders over $100</p>
                    )}
                    <div className="pt-4 border-t border-white/10 flex justify-between text-white text-lg font-medium">
                      <span>Total</span>
                      <motion.span 
                        key={total}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-[#C5A059] font-bebas text-3xl"
                        data-testid="text-total"
                      >
                        ${total.toFixed(2)}
                      </motion.span>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="w-full bg-gradient-to-r from-[#C5A059] to-[#d4af68] text-black font-medium uppercase tracking-wider h-12 rounded-xl btn-glow"
                      data-testid="button-checkout"
                      onClick={handleCheckout}
                      disabled={isCheckingOut || cartItems.length === 0}
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Proceed to Checkout
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-xs text-white/40">
                      <motion.div 
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/5"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <Truck className="w-5 h-5 text-[#2DD4BF]" />
                        <span>Free shipping $100+</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/5"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <Shield className="w-5 h-5 text-[#C5A059]" />
                        <span>Secure checkout</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="snap-section py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-2xl font-serif text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Complete Your <span className="italic text-[#C5A059]">Experience</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Gold Cutter", price: 75, image: "https://images.unsplash.com/photo-1611493620822-7ab5ebda3d55?auto=format&fit=crop&q=80&w=400" },
              { name: "Torch Lighter", price: 120, image: "https://images.unsplash.com/photo-1567626838537-cd3b6b84c437?auto=format&fit=crop&q=80&w=400" },
              { name: "Travel Case", price: 95, image: "https://images.unsplash.com/photo-1618225747879-abbffe64ba57?auto=format&fit=crop&q=80&w=400" },
              { name: "Cedar Spills", price: 25, image: "https://images.unsplash.com/photo-1576074321605-ea78c3bca1fb?auto=format&fit=crop&q=80&w=400" }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="aspect-square mb-3 rounded-xl overflow-hidden bg-[#111] relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-white text-sm group-hover:text-[#C5A059] transition-colors">
                  {item.name}
                </h3>
                <span className="text-white/50 text-sm">${item.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
