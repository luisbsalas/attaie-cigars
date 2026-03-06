import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "./SearchBar";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const hasAnimated = useRef(false);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    hasAnimated.current = true;
  }, []);

  const links = [
    { href: "/catalog", label: "Cigars", color: "#2DD4BF" },
    { href: "/accessories", label: "Accessories", color: "#E8736F" },
    { href: "/heritage", label: "Our Story", color: "#C5A059" },
    { href: "/guide", label: "Cigar Guide", color: "#B8A9C9" },
    { href: "/retailers", label: "Retailers", color: "#FFD4B8" },
    { href: "/contact", label: "Contact", color: "#A8E6CF" },
  ];

  const leftLinks = links.slice(0, 3);
  const rightLinks = links.slice(3);

  const containerVariants = {
    hidden: { opacity: hasAnimated.current ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: hasAnimated.current ? 0 : 0.08,
        delayChildren: hasAnimated.current ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: hasAnimated.current ? 1 : 0, y: hasAnimated.current ? 0 : -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: hasAnimated.current ? 0 : 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <>
      {/* Gradient Announcement Bar */}
      <motion.div 
        className="bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] text-black text-center py-2 text-[10px] tracking-[0.25em] uppercase font-semibold"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Grand Opening — Free Shipping Store Wide
      </motion.div>
      
      {/* Clean Modern Navigation */}
      <motion.nav 
        className={`sticky top-0 z-[9999] transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-xl py-3 border-b border-[#2DD4BF]/30' 
            : 'bg-black/80 backdrop-blur-md py-5'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            
            {/* Mobile Menu Button */}
            <motion.button 
              className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              data-testid="button-mobile-menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>

            {/* Desktop Navigation Left - 3 links */}
            <motion.div 
              className="hidden lg:flex items-center gap-10 flex-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {leftLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link href={link.href}>
                    <span 
                      className="group relative text-[11px] tracking-[0.2em] uppercase cursor-pointer transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]/50 rounded px-1 -mx-1"
                      data-testid={`link-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                      tabIndex={0}
                    >
                      <span className={`${location === link.href ? 'text-white' : 'text-white/60 group-hover:text-white group-focus-visible:text-white'} transition-colors`}>
                        {link.label}
                      </span>
                      <span 
                        className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-300 ${
                          location === link.href ? 'w-full' : 'w-0 group-hover:w-full group-focus-visible:w-full'
                        }`}
                        style={{ backgroundColor: link.color }}
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Logo Center */}
            <motion.div 
              className="flex-shrink-0 flex items-center justify-center px-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/">
                <motion.div 
                  className="relative cursor-pointer group" 
                  data-testid="link-logo"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img 
                    src="https://age.gminfotech.net/assets/img/visual_images/1753980479.png" 
                    alt="Attaie Cigars" 
                    className={`object-contain transition-all duration-300 ${isScrolled ? 'h-10' : 'h-14'}`}
                  />
                  <div className="absolute inset-0 bg-[#C5A059]/0 group-hover:bg-[#C5A059]/10 rounded-lg transition-colors duration-300" />
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Navigation Right - 3 links + Cart */}
            <motion.div 
              className="hidden lg:flex items-center justify-end gap-10 flex-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {rightLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link href={link.href}>
                    <span 
                      className="group relative text-[11px] tracking-[0.2em] uppercase cursor-pointer transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]/50 rounded px-1 -mx-1"
                      data-testid={`link-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                      tabIndex={0}
                    >
                      <span className={`${location === link.href ? 'text-white' : 'text-white/60 group-hover:text-white group-focus-visible:text-white'} transition-colors`}>
                        {link.label}
                      </span>
                      <span 
                        className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-300 ${
                          location === link.href ? 'w-full' : 'w-0 group-hover:w-full group-focus-visible:w-full'
                        }`}
                        style={{ backgroundColor: link.color }}
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
              
              {/* Search Icon */}
              <motion.div variants={itemVariants} className="pl-6 ml-6 border-l border-white/10">
                <SearchBar />
              </motion.div>
              
              {/* Cart Icon */}
              <motion.div variants={itemVariants}>
                <Link href="/cart">
                  <motion.div 
                    className="text-white/60 hover:text-white transition-colors relative cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2DD4BF]/50 rounded p-1 outline-none"
                    data-testid="button-cart"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    tabIndex={0}
                    aria-label="Shopping cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#2DD4BF] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bebas">{cartCount > 99 ? '99+' : cartCount}</span>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile Cart Icon */}
            <div className="lg:hidden">
              <Link href="/cart">
                <motion.div 
                  className="p-2 text-white/80 hover:text-white transition-colors relative" 
                  data-testid="button-cart-mobile"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#2DD4BF] text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bebas">{cartCount > 99 ? '99+' : cartCount}</span>
                  )}
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated bottom border on scroll */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'linear-gradient(90deg, transparent, #2DD4BF, #C5A059, #E8736F, transparent)'
          }}
        />
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="h-full relative overflow-y-auto"
            >
              {/* Mobile Header */}
              <div className="p-6 flex justify-between items-center border-b border-white/10">
                <span className="text-[#2DD4BF] text-xs tracking-[0.3em] uppercase font-medium">Menu</span>
                <motion.button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="button-mobile-menu-close"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Mobile Links */}
              <div className="p-8 flex flex-col gap-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + 0.15 }}
                  >
                    <Link href={link.href}>
                      <span 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center gap-4 cursor-pointer"
                        data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <span 
                          className="w-2 h-2 rounded-full transition-transform group-hover:scale-150"
                          style={{ backgroundColor: link.color }}
                        />
                        <span className={`text-2xl font-light tracking-wide transition-colors duration-300 ${
                          location === link.href ? 'text-white' : 'text-white/60 group-hover:text-white'
                        }`}>
                          {link.label}
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom gradient line */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                  background: 'linear-gradient(90deg, #2DD4BF, #C5A059, #E8736F, #B8A9C9)'
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
