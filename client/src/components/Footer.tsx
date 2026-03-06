import { Link } from "wouter";
import { motion } from "framer-motion";
import { TropicalPattern } from "./Decorations";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 md:pt-24 pb-8 md:pb-10 border-t border-[#2DD4BF]/20 relative overflow-hidden">
      {/* Tropical pattern background */}
      <TropicalPattern opacity={0.03} />
      
      {/* Vibrant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#2DD4BF]/8" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(232,115,111,0.05)_0%,transparent_40%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(184,169,201,0.05)_0%,transparent_40%)]" />
      
      {/* Decorative multi-color line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2DD4BF] via-[#C5A059] to-[#E8736F] opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12 md:mb-20">
          
          <div className="col-span-2 md:col-span-1">
            <motion.img 
              src="https://age.gminfotech.net/assets/img/visual_images/1753980479.png" 
              alt="Attaie Cigars" 
              className="h-12 md:h-16 object-contain mb-4 md:mb-8"
              whileHover={{ scale: 1.02 }}
            />
            <p className="text-white/40 text-xs md:text-sm leading-relaxed font-light">
              Born from passion and perfected through tradition. A statement of taste, legacy, and distinction.
            </p>
          </div>

          <div>
            <h4 className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-8 text-[#2DD4BF] font-medium">Collections</h4>
            <ul className="space-y-2 md:space-y-4 text-xs md:text-sm text-white/40">
              <li><Link href="/catalog"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Reserve</span></Link></li>
              <li><Link href="/catalog"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Black</span></Link></li>
              <li><Link href="/catalog"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Platinum</span></Link></li>
              <li><Link href="/catalog"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Private</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-8 text-[#E8736F] font-medium">Support</h4>
            <ul className="space-y-2 md:space-y-4 text-xs md:text-sm text-white/40">
              <li><Link href="/contact"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Contact</span></Link></li>
              <li><Link href="/shipping"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Shipping & Returns</span></Link></li>
              <li><Link href="/guide"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Cigar Guide</span></Link></li>
              <li><Link href="/retailers"><span className="gold-underline pb-1 hover:text-white transition-colors cursor-pointer">Find Retailers</span></Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-8 text-[#B8A9C9] font-medium">Newsletter</h4>
            <p className="text-white/40 text-xs md:text-sm mb-4 md:mb-6 font-light">Subscribe for exclusive offers and new releases.</p>
            <div className="flex border-b border-white/20 pb-2 md:pb-3 group focus-within:border-[#C5A059]/50 transition-colors">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20 text-xs md:text-sm"
                data-testid="input-newsletter-email"
              />
              <motion.button 
                className="text-[#C5A059] uppercase text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] font-semibold hover:text-white transition-colors whitespace-nowrap"
                data-testid="button-newsletter-subscribe"
                whileHover={{ x: 3 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Surgeon General Warning */}
        <motion.div 
          className="border border-white/10 p-4 md:p-8 mb-8 md:mb-12 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute -top-2.5 left-4 md:left-8 bg-black px-2 md:px-4">
            <span className="text-white/40 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[8px] md:text-[9px] font-medium">Warning</span>
          </div>
          <p className="text-white/60 text-xs md:text-base text-center leading-relaxed">
            Cigar Smoking Can Cause Cancers Of The Mouth And Throat, Even If You Do Not Inhale.
          </p>
        </motion.div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8 md:mb-12">
          <motion.a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#C5A059]/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            data-testid="link-social-instagram"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </motion.a>
          <motion.a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#C5A059]/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            data-testid="link-social-facebook"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </motion.a>
          <motion.a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#C5A059]/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            data-testid="link-social-twitter"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </motion.a>
          <motion.a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#C5A059]/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            data-testid="link-social-youtube"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </motion.a>
        </div>

        <div className="border-t border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] text-white/30 relative z-10">
          <p>&copy; {new Date().getFullYear()} Attaie Cigars. All rights reserved.</p>
          <div className="flex space-x-4 md:space-x-8 mt-3 md:mt-0">
            <span className="gold-underline pb-1 hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="gold-underline pb-1 hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="gold-underline pb-1 hover:text-white cursor-pointer transition-colors">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
