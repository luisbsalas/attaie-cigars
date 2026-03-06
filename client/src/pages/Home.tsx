import { useProducts } from "@/hooks/use-products";
import type { Product } from "@shared/schema";
import { ProductCard, QuickViewModal, addToCart } from "@/components/ProductCard";
import { CigarShowcase } from "@/components/CigarShowcase";
import { CigarSelector } from "@/components/CigarSelector";
import { Timeline } from "@/components/Timeline";
import { CigarAnatomy } from "@/components/CigarAnatomy";
import { FAQ } from "@/components/FAQ";
import { TobaccoLeafPattern, TropicalPattern, FiligreeDivider, OrnateFrame, AnimatedBorder, GoldLine, BrandMedallion } from "@/components/Decorations";
import { GoldDustParticles, SmokeEffect, ScrollProgressBar, TextReveal, AnimatedLine, MagneticButton } from "@/components/AnimatedEffects";
import { CigarQuiz } from "@/components/CigarQuiz";
import { Testimonials, Awards, Stats } from "@/components/Testimonials";
import { FlavorWheel } from "@/components/FlavorWheel";
import { HumidorGauge, RingGaugeComparison, OrnateDivider } from "@/components/PremiumTextures";
import { 
  VideoMarqueeBanner, 
  SplitTextReveal, 
  BurnAwayText, 
  HeritageStatement, 
  EmberGlowButton,
  ScaleOnScrollSection,
  LetterByLetterReveal,
  GoldParticleField
} from "@/components/WowEffects";
import { AnimatedFiligree, VineFiligree } from "@/components/AnimatedFiligree";
import { EmberParticles } from "@/components/EmberParticles";
import { DecorativeDivider } from "@/components/BaroqueFrame";
import { FloatingSmokeLayer, TobaccoLeafCluster } from "@/components/CigarMotifs";
import { CenterFocusCarousel } from "@/components/CenterFocusCarousel";
import { ArrowRight, ArrowDown, Mountain, Layers, TreePine, Coffee, Eye, ShoppingBag, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import attaieLogo from "@assets/attaie_logo_1769129187784.webp";
import cigarImage from "@assets/DSC3200_1769129439681.webp";
import heroVideo from "@assets/Untitled_1769136903478.mp4";

export default function Home() {
  const { data: products, isLoading } = useProducts({});
  const { data: featuredProducts } = useProducts({ featured: true });
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const [spotlightQuickView, setSpotlightQuickView] = useState(false);
  const [spotlightAddedToCart, setSpotlightAddedToCart] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Simple video loop with subtle opacity pulse to mask loop point
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeLeft = video.duration - video.currentTime;
      
      // Fade out slightly near end (last 0.3 seconds)
      if (timeLeft <= 0.3) {
        setVideoOpacity(0.85 + (timeLeft / 0.3) * 0.15);
      } 
      // Fade back in at start (first 0.3 seconds)
      else if (video.currentTime <= 0.3) {
        setVideoOpacity(0.85 + (video.currentTime / 0.3) * 0.15);
      }
      else {
        setVideoOpacity(1);
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <div className="bg-[#0A0A0A] overflow-hidden">
      {/* Global Effects */}
      <ScrollProgressBar />
      <GoldDustParticles />
      {/* Hero Section - Full Screen Cinematic */}
      <section ref={heroRef} className="snap-section relative h-screen flex items-center justify-center overflow-hidden">
        {/* Looping Background Video */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroImageY }}
        >
          {/* Looping video with subtle opacity pulse at loop point */}
          <video 
            ref={videoRef}
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-[120%] object-cover"
            style={{ opacity: videoOpacity, transition: 'opacity 0.15s ease-out' }}
          />
        </motion.div>
        
        {/* Smoke Effect */}
        <SmokeEffect />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0A0A0A] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10" />

        {/* Content */}
        <motion.div 
          className="relative z-20 text-center max-w-5xl px-4 md:px-6"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="inline-block text-[#2DD4BF] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-6 md:mb-8 font-medium">
              Established in Excellence
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-7xl lg:text-8xl font-serif text-white mb-8 md:mb-10 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <span className="italic">Hand-rolled with</span>
            <br />
            <span className="text-gold-shimmer">legacy & perfection</span>
          </motion.h1>
          
          <motion.p
            className="text-white/60 text-base md:text-xl font-light mb-10 md:mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Timeless artistry for the discerning aficionado
          </motion.p>
          
          {/* Brand Story Tagline */}
          <motion.div
            className="text-white/40 text-[10px] md:text-xs tracking-[0.12em] md:tracking-[0.15em] uppercase mb-8 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <span className="text-[#2DD4BF]">Dominican Republic</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#C5A059]">Aged to Perfection</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#E8736F]">Since 2025</span>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <MagneticButton>
              <Link href="/catalog">
                <span 
                  className="btn-glow inline-block px-8 md:px-12 py-4 md:py-5 gold-gradient text-black text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] uppercase font-semibold cursor-pointer"
                  data-testid="button-browse-humidor"
                >
                  Browse the Humidor
                </span>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="#quiz">
                <span 
                  className="btn-luxury inline-block px-8 md:px-12 py-4 md:py-5 border-2 border-[#2DD4BF] text-[#2DD4BF] text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] uppercase font-medium cursor-pointer hover:bg-[#2DD4BF] hover:text-black transition-colors"
                  data-testid="button-find-cigar"
                >
                  Find Your Cigar
                </span>
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            initial={{ y: 0, opacity: 0.4 }}
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-2 md:gap-3 text-white"
          >
            <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Video Marquee Banner */}
      <VideoMarqueeBanner />
      
      {/* Awards/Press Section */}
      <Awards />
      {/* Samay Attaie Quote Section - Spectacular Design */}
      <section className="snap-section py-24 md:py-40 relative overflow-hidden">
        {/* Dramatic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0d1212] to-[#0A0A0A]" />
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.08)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(26,107,107,0.1)_0%,transparent_60%)]" />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.05) 0%, transparent 70%)' }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating gold particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: 10, top: 15, size: 3 },
            { left: 90, top: 25, size: 4 },
            { left: 25, top: 80, size: 3 },
            { left: 75, top: 70, size: 5 },
            { left: 50, top: 10, size: 4 },
            { left: 85, top: 85, size: 3 },
            { left: 15, top: 50, size: 4 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#C5A059]"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
              initial={{ y: 0, opacity: 0.2 }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </div>

        {/* Elaborate corner ornaments */}
        <svg className="absolute top-4 left-4 w-32 h-32 text-[#C5A059]/40" viewBox="0 0 100 100">
          <path d="M0 60 Q0 0 60 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 45 Q0 10 35 0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M0 75 Q0 20 55 0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.8" />
          <circle cx="20" cy="5" r="2" fill="currentColor" opacity="0.5" />
          <circle cx="5" cy="20" r="2" fill="currentColor" opacity="0.5" />
          <path d="M15 0 L15 25 M0 15 L25 15" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M30 5 Q20 10 25 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>
        <svg className="absolute top-4 right-4 w-32 h-32 text-[#C5A059]/40 scale-x-[-1]" viewBox="0 0 100 100">
          <path d="M0 60 Q0 0 60 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 45 Q0 10 35 0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M0 75 Q0 20 55 0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.8" />
          <circle cx="20" cy="5" r="2" fill="currentColor" opacity="0.5" />
          <circle cx="5" cy="20" r="2" fill="currentColor" opacity="0.5" />
          <path d="M15 0 L15 25 M0 15 L25 15" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M30 5 Q20 10 25 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>
        <svg className="absolute bottom-4 left-4 w-32 h-32 text-[#C5A059]/40 scale-y-[-1]" viewBox="0 0 100 100">
          <path d="M0 60 Q0 0 60 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 45 Q0 10 35 0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M0 75 Q0 20 55 0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.8" />
          <circle cx="20" cy="5" r="2" fill="currentColor" opacity="0.5" />
          <circle cx="5" cy="20" r="2" fill="currentColor" opacity="0.5" />
          <path d="M15 0 L15 25 M0 15 L25 15" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M30 5 Q20 10 25 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>
        <svg className="absolute bottom-4 right-4 w-32 h-32 text-[#C5A059]/40 scale-[-1]" viewBox="0 0 100 100">
          <path d="M0 60 Q0 0 60 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 45 Q0 10 35 0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M0 75 Q0 20 55 0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="8" cy="8" r="4" fill="currentColor" opacity="0.8" />
          <circle cx="20" cy="5" r="2" fill="currentColor" opacity="0.5" />
          <circle cx="5" cy="20" r="2" fill="currentColor" opacity="0.5" />
          <path d="M15 0 L15 25 M0 15 L25 15" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M30 5 Q20 10 25 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>

        {/* Elaborate filigree borders */}
        <div className="absolute top-0 left-0 right-0">
          <svg className="w-full h-16" viewBox="0 0 1200 64" preserveAspectRatio="none">
            <defs>
              <linearGradient id="filiGradTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="#C5A059" />
                <stop offset="50%" stopColor="#d4af68" />
                <stop offset="80%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M0 64 L0 32 Q150 48 300 32 Q450 16 600 32 Q750 48 900 32 Q1050 16 1200 32 L1200 64" fill="none" stroke="url(#filiGradTop)" strokeWidth="1" opacity="0.4" />
            <path d="M0 56 Q300 40 600 56 Q900 72 1200 56" fill="none" stroke="url(#filiGradTop)" strokeWidth="0.5" opacity="0.2" />
            <circle cx="600" cy="40" r="6" fill="#C5A059" opacity="0.6" />
            <circle cx="580" cy="44" r="3" fill="#C5A059" opacity="0.4" />
            <circle cx="620" cy="44" r="3" fill="#C5A059" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 rotate-180">
          <svg className="w-full h-16" viewBox="0 0 1200 64" preserveAspectRatio="none">
            <path d="M0 64 L0 32 Q150 48 300 32 Q450 16 600 32 Q750 48 900 32 Q1050 16 1200 32 L1200 64" fill="none" stroke="url(#filiGradTop)" strokeWidth="1" opacity="0.4" />
            <path d="M0 56 Q300 40 600 56 Q900 72 1200 56" fill="none" stroke="url(#filiGradTop)" strokeWidth="0.5" opacity="0.2" />
            <circle cx="600" cy="40" r="6" fill="#C5A059" opacity="0.6" />
            <circle cx="580" cy="44" r="3" fill="#C5A059" opacity="0.4" />
            <circle cx="620" cy="44" r="3" fill="#C5A059" opacity="0.4" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center relative z-10">
          {/* Animated ornate divider */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <svg className="w-full max-w-md mx-auto h-12" viewBox="0 0 300 48">
              <defs>
                <linearGradient id="ornateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="30%" stopColor="#C5A059" />
                  <stop offset="50%" stopColor="#d4af68" />
                  <stop offset="70%" stopColor="#C5A059" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <line x1="0" y1="24" x2="100" y2="24" stroke="url(#ornateGrad)" strokeWidth="1" />
              <line x1="200" y1="24" x2="300" y2="24" stroke="url(#ornateGrad)" strokeWidth="1" />
              <path d="M100 24 Q120 10 150 24 Q180 38 200 24" fill="none" stroke="#C5A059" strokeWidth="1.5" />
              <path d="M110 24 Q130 15 150 24 Q170 33 190 24" fill="none" stroke="#C5A059" strokeWidth="1" opacity="0.6" />
              <circle cx="150" cy="24" r="8" fill="none" stroke="#C5A059" strokeWidth="1.5" />
              <circle cx="150" cy="24" r="4" fill="#C5A059" />
              <circle cx="120" cy="20" r="2" fill="#C5A059" opacity="0.6" />
              <circle cx="180" cy="28" r="2" fill="#C5A059" opacity="0.6" />
              <path d="M130 12 Q140 18 150 12 Q160 6 150 0" fill="none" stroke="#C5A059" strokeWidth="0.5" opacity="0.4" />
              <path d="M130 36 Q140 30 150 36 Q160 42 150 48" fill="none" stroke="#C5A059" strokeWidth="0.5" opacity="0.4" />
            </svg>
          </motion.div>
          
          {/* Title with shimmer */}
          <motion.h2 
            className="text-3xl md:text-5xl font-serif mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">Handcrafted Tradition </span>
            <span className="text-shimmer-gold italic">in Every Leaf</span>
          </motion.h2>
          
          {/* Ornate quote frame */}
          <motion.div
            className="relative py-12 md:py-16 px-6 md:px-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Frame border with glow */}
            <div className="absolute inset-0 border border-[#C5A059]/30 rounded-sm" />
            <div className="absolute inset-[3px] border border-[#C5A059]/15 rounded-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 via-transparent to-[#1a6b6b]/5" />
            
            {/* Corner ornaments on frame */}
            <div className="absolute -top-2 -left-2 w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#C5A059] to-transparent" />
              <div className="absolute top-1 left-1 w-2 h-2 border border-[#C5A059]/50" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#C5A059] to-transparent" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#C5A059] to-transparent" />
              <div className="absolute top-1 right-1 w-2 h-2 border border-[#C5A059]/50" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent" />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-[#C5A059] to-transparent" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border border-[#C5A059]/50" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#C5A059] to-transparent" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-[#C5A059] to-transparent" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border border-[#C5A059]/50" />
            </div>

            <blockquote className="relative text-white/60 text-lg md:text-2xl leading-[1.9] md:leading-[2] font-light italic">
              <motion.span 
                className="absolute -top-4 -left-2 text-6xl md:text-8xl text-[#C5A059]/80 font-serif leading-none"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              >"</motion.span>
              <span className="relative z-10">
                My cigars are the culmination of a decades-long passion in pursuit of perfection, a passion for a loss of time you can only get in the pleasure of the right cigar. All to find a flavor that seduces you into a lapse of time where you can't but stop and see what and who is around you... this is yours, singular. Time stopped, for this your <span className="text-[#C5A059] font-medium not-italic">one, and only.</span>
              </span>
              <motion.span 
                className="absolute -bottom-8 -right-2 text-6xl md:text-8xl text-[#C5A059]/80 font-serif leading-none"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >"</motion.span>
            </blockquote>
          </motion.div>
          
          {/* Author signature */}
          <motion.div 
            className="mt-12 flex items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent to-[#C5A059]/50" />
            <div className="text-center">
              <p className="text-[#C5A059] text-sm md:text-base tracking-[0.3em] uppercase font-medium mb-1">
                Samay Attaie
              </p>
              <p className="text-white/40 text-[10px] md:text-xs tracking-[0.2em] uppercase">Founder & Master Blender</p>
            </div>
            <div className="flex-1 max-w-[100px] h-px bg-gradient-to-l from-transparent to-[#C5A059]/50" />
          </motion.div>
        </div>
      </section>
      {/* Stats Section */}
      <Stats />
      
      {/* Heritage Statement - Bold Typography */}
      <HeritageStatement />
      
      {/* Interactive Cigar Selector */}
      <CigarSelector />
      {/* ONE & ONLY - Luxury Cinematic Brand Section */}
      <section className="snap-section relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Multi-layer gradient mesh background */}
        <div className="absolute inset-0">
          {/* Base dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0d1a1a] to-[#0A0A0A]" />
          {/* Teal gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a6b6b]/20 via-transparent to-[#1a5f5f]/10" />
          <div className="absolute inset-0 bg-gradient-to-tl from-[#1a6b6b]/15 via-transparent to-transparent" />
          {/* Gold accent glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#C5A059]/5 rounded-full blur-3xl" />
        </div>

        {/* Leather/aged paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

        {/* Animated smoke layers */}
        <TropicalPattern opacity={0.08} />

        {/* Dynamic light rays emanating from center */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-light-rays opacity-20">
            <div className="absolute top-1/2 left-1/2 w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#C5A059]/30 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-[15deg]" />
            <div className="absolute top-1/2 left-1/2 w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-[35deg]" />
            <div className="absolute top-1/2 left-1/2 w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#C5A059]/25 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-[-20deg]" />
            <div className="absolute top-1/2 left-1/2 w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#C5A059]/15 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-[-40deg]" />
            <div className="absolute top-1/2 left-1/2 w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-[55deg]" />
            <div className="absolute top-1/2 left-1/2 w-[2px] h-[150%] bg-gradient-to-b from-transparent via-[#C5A059]/15 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-[-55deg]" />
          </div>
        </div>

        {/* Floating gold particles - deterministic positions */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { left: 15, top: 20, duration: 5, delay: 0.5 },
            { left: 85, top: 35, duration: 6, delay: 1.2 },
            { left: 42, top: 60, duration: 4.5, delay: 2.0 },
            { left: 73, top: 15, duration: 5.5, delay: 0.8 },
            { left: 28, top: 75, duration: 6.2, delay: 3.1 },
            { left: 92, top: 50, duration: 4.8, delay: 1.5 },
            { left: 8, top: 45, duration: 5.3, delay: 2.8 },
            { left: 55, top: 85, duration: 6.5, delay: 0.2 },
            { left: 35, top: 30, duration: 4.2, delay: 4.0 },
            { left: 68, top: 70, duration: 5.8, delay: 1.8 },
            { left: 12, top: 90, duration: 5.1, delay: 3.5 },
            { left: 78, top: 25, duration: 6.8, delay: 0.9 },
          ].map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#C5A059] rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)]" />

        {/* Decorative corner flourishes */}
        <svg className="absolute top-8 left-8 w-24 h-24 text-[#C5A059]/30" viewBox="0 0 100 100">
          <path d="M0 50 Q0 0 50 0" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 40 Q0 10 30 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
          <path d="M10 0 L10 15 M0 10 L15 10" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        <svg className="absolute top-8 right-8 w-24 h-24 text-[#C5A059]/30 rotate-90" viewBox="0 0 100 100">
          <path d="M0 50 Q0 0 50 0" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 40 Q0 10 30 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
          <path d="M10 0 L10 15 M0 10 L15 10" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        <svg className="absolute bottom-8 left-8 w-24 h-24 text-[#C5A059]/30 -rotate-90" viewBox="0 0 100 100">
          <path d="M0 50 Q0 0 50 0" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 40 Q0 10 30 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
          <path d="M10 0 L10 15 M0 10 L15 10" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        <svg className="absolute bottom-8 right-8 w-24 h-24 text-[#C5A059]/30 rotate-180" viewBox="0 0 100 100">
          <path d="M0 50 Q0 0 50 0" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 40 Q0 10 30 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="5" cy="5" r="3" fill="currentColor" />
          <path d="M10 0 L10 15 M0 10 L15 10" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        {/* Elegant curved top border */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <svg className="w-full h-8" viewBox="0 0 1200 32" preserveAspectRatio="none">
            <path 
              d="M0 32 Q300 0 600 16 Q900 32 1200 0 L1200 0 L0 0 Z" 
              fill="url(#goldGradientTop)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="goldGradientTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="#C5A059" />
                <stop offset="70%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Elegant curved bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <svg className="w-full h-8 rotate-180" viewBox="0 0 1200 32" preserveAspectRatio="none">
            <path 
              d="M0 32 Q300 0 600 16 Q900 32 1200 0 L1200 0 L0 0 Z" 
              fill="url(#goldGradientBottom)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="goldGradientBottom" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="#C5A059" />
                <stop offset="70%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Main content with asymmetric layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
            
            {/* Left side - Premium cigar image with parallax */}
            <motion.div 
              className="hidden lg:block lg:col-span-2 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/10 to-transparent blur-2xl transform scale-150" />
                {/* Featured image */}
                <img 
                  src={cigarImage}
                  alt="Premium Attaie Cigar Experience"
                  className="relative w-full max-w-md mx-auto rounded-lg shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
                />
                {/* Smoke wisp overlay */}
                <div className="absolute -top-20 left-1/2 w-32 h-64 bg-gradient-to-t from-transparent via-white/5 to-transparent blur-xl animate-smoke-rise" />
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div 
              className="lg:col-span-3 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {/* Brand logo */}
              <motion.div
                className="flex justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="relative">
                  {/* Outer glow effect */}
                  <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-xl animate-pulse-slow" style={{ transform: 'scale(1.3)' }} />
                  <img 
                    src={attaieLogo} 
                    alt="Attaie Cigars Logo" 
                    className="relative w-24 h-24 md:w-28 md:h-28 object-contain"
                  />
                </div>
              </motion.div>

              {/* Attaie Cigars header */}
              <motion.p
                className="text-[#C5A059] text-xs md:text-sm tracking-[0.5em] uppercase mb-6 font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Attaie Cigars Presents
              </motion.p>

              {/* One & Only title with shimmer effect */}
              <motion.h2 
                className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-tight relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-shimmer-gold">One & Only</span>
              </motion.h2>

              {/* Curved gold divider */}
              <motion.div 
                className="flex justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <svg width="200" height="20" viewBox="0 0 200 20" className="text-[#C5A059]">
                  <path 
                    d="M0 10 Q50 0 100 10 Q150 20 200 10" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  <circle cx="100" cy="10" r="4" fill="currentColor" />
                  <circle cx="85" cy="10" r="2" fill="currentColor" opacity="0.5" />
                  <circle cx="115" cy="10" r="2" fill="currentColor" opacity="0.5" />
                </svg>
              </motion.div>

              {/* Tagline with letter animation */}
              <motion.div className="mb-10 md:mb-12">
                <motion.p 
                  className="text-white/80 text-base md:text-xl tracking-[0.1em] uppercase mb-2 font-light italic"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  "If you're going to smoke one cigar"
                </motion.p>
                <motion.p 
                  className="text-white text-lg md:text-2xl tracking-[0.1em] uppercase font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  Make it a <span className="text-[#C5A059]">One & Only</span>
                </motion.p>
              </motion.div>

              {/* Testimonial quote */}
              <motion.div
                className="mb-10 pl-4 border-l-2 border-[#C5A059]/30 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-white/50 text-sm italic mb-2">"The finest cigar I've ever experienced. Pure luxury in every draw."</p>
                <p className="text-[#C5A059]/70 text-xs tracking-wider">— James R., Connoisseur</p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
              >
                <MagneticButton>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-[#C5A059] to-[#d4af68] text-black text-xs tracking-[0.2em] uppercase font-bold border-none"
                    data-testid="button-one-and-only"
                  >
                    <Link href="/catalog" data-testid="link-one-and-only">
                      Discover the Collection
                      <ArrowRight className="w-4 h-4 ml-3" />
                    </Link>
                  </Button>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Interactive Cigar Showcase - Blackbird inspired */}
      {products && products.length > 0 && <CigarShowcase products={products} />}
      {/* Flavor Profile Section - Enhanced */}
      <section className="snap-section py-20 md:py-32 relative overflow-hidden">
        {/* Multi-layer atmospheric background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A]" />
        
        {/* Radial gradient mesh for depth */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a6b6b]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(26,107,107,0.06)_0%,transparent_70%)]" />
        </div>

        {/* Floating smoke particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: 10, top: 30, size: 150, duration: 20, delay: 0 },
            { left: 80, top: 60, size: 100, duration: 18, delay: 2 },
            { left: 50, top: 20, size: 120, duration: 22, delay: 4 },
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/[0.02] blur-2xl animate-smoke-drift-slow"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: particle.size,
                height: particle.size,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Decorative corner flourishes */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[#C5A059]/20" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-[#C5A059]/20" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-[#C5A059]/20" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-[#C5A059]/20" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Section label with animated line */}
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C5A059]" />
                <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase">Flavor Profile</span>
              </motion.div>

              {/* Title with shimmer effect */}
              <motion.h2 
                className="text-4xl md:text-6xl font-serif mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-white">Complex </span>
                <span className="text-shimmer-gold italic">Notes</span>
              </motion.h2>

              <motion.p 
                className="text-white/50 leading-relaxed mb-10 font-light text-base md:text-lg max-w-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Each Attaie cigar delivers a symphony of carefully balanced flavors. From the first draw to the final inch, discover layers of complexity that unfold with every puff.
              </motion.p>

              {/* Decorative divider */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <svg width="150" height="12" viewBox="0 0 150 12" className="text-[#C5A059]">
                  <line x1="0" y1="6" x2="50" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                  <circle cx="60" cy="6" r="3" fill="currentColor" opacity="0.6" />
                  <circle cx="75" cy="6" r="5" fill="currentColor" />
                  <circle cx="90" cy="6" r="3" fill="currentColor" opacity="0.6" />
                  <line x1="100" y1="6" x2="150" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                </svg>
              </motion.div>

              {/* Enhanced flavor notes with icons */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Earth", color: "#8B4513", description: "Rich, grounding base notes", Icon: Mountain },
                  { name: "Leather", color: "#5C4033", description: "Sophisticated depth", Icon: Layers },
                  { name: "Cedar", color: "#C19A6B", description: "Aromatic woodiness", Icon: TreePine },
                  { name: "Coffee", color: "#3C1414", description: "Bold roasted finish", Icon: Coffee },
                ].map((note, index) => (
                  <motion.div
                    key={note.name}
                    className="group relative flex items-center gap-4 p-3 rounded-sm bg-white/[0.02] border border-white/10 hover-elevate"
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                    data-testid={`flavor-note-${note.name.toLowerCase()}`}
                  >
                    {/* Icon with glow */}
                    <div className="relative">
                      <motion.div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${note.color}30` }}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      >
                        <note.Icon className="w-4 h-4" style={{ color: note.color }} />
                      </motion.div>
                      <div 
                        className="absolute inset-0 rounded-lg opacity-30 blur-md"
                        style={{ backgroundColor: note.color }}
                      />
                    </div>
                    <div>
                      <span className="text-white/90 text-sm font-medium" data-testid={`text-flavor-${note.name.toLowerCase()}`}>{note.name}</span>
                      <p className="text-white/40 text-[10px]" data-testid={`text-flavor-desc-${note.name.toLowerCase()}`}>{note.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* FlavorWheel with glowing aura */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 -m-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.1)_0%,transparent_60%)] animate-pulse-slow" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,107,107,0.08)_0%,transparent_50%)]" />
              </div>
              
              {/* Rotating accent ring */}
              <motion.div
                className="absolute inset-0 -m-4 rounded-full border border-[#C5A059]/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#C5A059]/30 rounded-full" />
              </motion.div>

              <FlavorWheel />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Second Hero - Cinematic */}
      <section className="snap-section relative h-[60vh] md:h-[80vh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src="https://attaiecigars.com/cdn/shop/files/DSC3152.jpg?v=1753984227&width=3840"
            alt="Begin the Indulgence" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
        
        <motion.div 
          className="relative z-20 max-w-7xl w-full px-4 md:px-16"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 md:mb-6 block">The Experience</span>
          <h2 className="text-4xl md:text-7xl font-serif text-white mb-6 md:mb-8 italic leading-tight">
            Begin the<br />Indulgence
          </h2>
          <MagneticButton>
            <Link href="/catalog">
              <span 
                className="btn-luxury inline-block px-8 md:px-10 py-3 md:py-4 border-2 border-[#C5A059] text-[#C5A059] text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] uppercase hover:bg-[#C5A059] hover:text-black transition-all duration-500 cursor-pointer font-medium"
                data-testid="link-discover-collection"
              >
                Discover the Experience
              </span>
            </Link>
          </MagneticButton>
        </motion.div>
      </section>
      {/* Cigar Anatomy - Blackbird inspired */}
      <CigarAnatomy />
      {/* Find Your Cigar Quiz */}
      <div id="quiz">
        <CigarQuiz />
      </div>
      {/* Timeline - Our History */}
      <Timeline />
      {/* Testimonials */}
      <Testimonials />
      {/* Featured Products - Premium Showcase */}
      <section className="snap-section py-24 md:py-40 bg-[#0A0A0A] relative overflow-hidden">
        {/* Background effects */}
        <TobaccoLeafPattern opacity={0.015} />
        
        {/* Gold gradient glow behind section */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.08)_0%,transparent_60%)]" />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#C5A059]/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#C5A059]/5 to-transparent" />
        </div>

        {/* Animated self-drawing corner filigree */}
        <AnimatedFiligree position="top-left" size="lg" delay={0} />
        <AnimatedFiligree position="top-right" size="lg" delay={0.2} />
        <AnimatedFiligree position="bottom-left" size="lg" delay={0.4} />
        <AnimatedFiligree position="bottom-right" size="lg" delay={0.6} />
        
        {/* Vine filigree on sides */}
        <VineFiligree position="left" className="hidden md:block opacity-40" />
        <VineFiligree position="right" className="hidden md:block opacity-40" />
        
        {/* Tobacco leaf clusters */}
        <TobaccoLeafCluster position="left" className="top-1/4 -left-4 opacity-30 hidden lg:block" />
        <TobaccoLeafCluster position="right" className="top-2/3 -right-4 opacity-30 hidden lg:block" />
        
        {/* Floating smoke layer */}
        <FloatingSmokeLayer />

        {/* Ember particles - cigar-themed floating embers */}
        <EmberParticles count={20} interactive={true} colors={["gold", "coral", "orange"]} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          {/* Centered Section Header with Split Text Animation */}
          <motion.div 
            className="text-center mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#2DD4BF] text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 md:mb-6 block">
              Reserve Collection
            </span>
            
            {/* Split Text Heading */}
            <div className="overflow-hidden mb-4">
              <motion.h2 
                className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight"
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                data-testid="text-featured-title"
              >
                <span className="text-white">Featured </span>
                <span className="text-shimmer-gold italic">Cigars</span>
              </motion.h2>
            </div>
            
            {/* Tagline */}
            <motion.p
              className="text-white/50 text-sm md:text-base tracking-[0.15em] uppercase"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Hand-Selected Excellence
            </motion.p>

            {/* Ornate decorative divider */}
            <div className="flex justify-center mt-8">
              <DecorativeDivider variant="ornate" />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center gap-6 py-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0" style={{ width: 320 }}>
                  <div className="skeleton-luxury aspect-[3/4] rounded-lg mb-4" />
                  <div className="skeleton-luxury h-5 w-3/4 mx-auto mb-2" />
                  <div className="skeleton-luxury h-4 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <>
              {/* Center-Focus Carousel */}
              <CenterFocusCarousel 
                products={featuredProducts}
                onQuickView={(product) => {
                  setQuickViewProduct(product);
                }}
                onAddToCart={(product) => {
                  addToCart(product, 1);
                  toast({
                    title: "Added to Cart",
                    description: `${product.name} has been added to your cart.`,
                  });
                }}
              />

              {/* Quick View Modal */}
              {quickViewProduct && (
                <QuickViewModal 
                  product={quickViewProduct} 
                  isOpen={!!quickViewProduct} 
                  onClose={() => setQuickViewProduct(null)} 
                />
              )}

              {/* Centered CTA with Ember Glow */}
              <motion.div 
                className="text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div className="relative inline-block">
                  <Link href="/catalog">
                    <motion.span 
                      className="relative inline-block px-10 md:px-14 py-4 md:py-5 bg-gradient-to-r from-[#C5A059] to-[#d4af68] text-black text-[10px] md:text-xs tracking-[0.25em] uppercase font-semibold cursor-pointer overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      data-testid="button-view-collection"
                    >
                      <span className="relative z-10">View Full Collection</span>
                      {!shouldReduceMotion && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-[#E8736F]"
                          initial={{ x: '-100%' }}
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                          style={{ opacity: 0.3 }}
                        />
                      )}
                    </motion.span>
                  </Link>
                  
                  {/* Ember glow effect - positioned relative to button wrapper */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-48 h-12 rounded-full blur-xl bg-[#C5A059]/40 -z-10"
                    initial={{ opacity: 0.2 }}
                    animate={shouldReduceMotion ? { opacity: 0.2 } : { opacity: [0.2, 0.4, 0.2] }}
                    transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </>
          ) : null}
        </div>
      </section>
      {/* FAQ Section - Blackbird inspired */}
      <FAQ />

      {/* Cigar Education Section */}
      <section className="snap-section py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0D0808] to-[#0A0A0A]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-4 block">Cigar Knowledge</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              The <span className="italic bg-gradient-to-r from-[#C5A059] to-[#2DD4BF] bg-clip-text text-transparent">Essentials</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Master the fundamentals of cigar appreciation with our interactive guides
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <HumidorGauge humidity={70} temperature={68} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <RingGaugeComparison 
                cigars={[
                  { name: "Petit Corona", ringGauge: 42, length: 4.5 },
                  { name: "Robusto", ringGauge: 50, length: 5 },
                  { name: "Toro", ringGauge: 52, length: 6 },
                  { name: "Churchill", ringGauge: 48, length: 7 }
                ]}
              />
            </motion.div>
          </div>

          <OrnateDivider className="mt-16" />
        </div>
      </section>

      {/* Two Column Feature */}
      <section className="snap-section grid grid-cols-1 md:grid-cols-2">
        <motion.div 
          className="relative h-[400px] md:h-[600px] overflow-hidden group"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img 
            src="https://attaiecigars.com/cdn/shop/files/DSC3122.jpg?v=1755641149&width=1500"
            alt="From Leaf to Legacy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-3 md:mb-4">From Leaf to Legacy</span>
            <h3 className="text-2xl md:text-4xl font-serif text-white italic mb-3 md:mb-4">The Heart of Attaie</h3>
            <p className="text-white/60 text-xs md:text-sm max-w-md leading-relaxed">
              Every Attaie cigar begins with hand-selected leaves, nurtured under the perfect climate and aged with patience.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="relative h-[400px] md:h-[600px] overflow-hidden group"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img 
            src="https://attaiecigars.com/cdn/shop/files/DSC3236.jpg?v=1755641149&width=1500"
            alt="The Attaie Experience"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-3 md:mb-4">Crafted for Connoisseurs</span>
            <h3 className="text-2xl md:text-4xl font-serif text-white italic mb-3 md:mb-4">The Attaie Experience</h3>
            <p className="text-white/60 text-xs md:text-sm max-w-md leading-relaxed">
              An Attaie cigar is more than smoke — it's tradition, indulgence, and refinement for those who demand the extraordinary.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
