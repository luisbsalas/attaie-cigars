import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

interface AgeGateProps {
  children: ReactNode;
}

export function AgeGate({ children }: AgeGateProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [location] = useLocation();

  const handleVerify = () => {
    setIsVerified(true);
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  // Allow Terms and Privacy pages to bypass age gate
  const bypassRoutes = ["/terms", "/privacy"];
  if (bypassRoutes.includes(location)) {
    return <>{children}</>;
  }

  // If verified, show the main site content
  if (isVerified) {
    return <>{children}</>;
  }

  // Otherwise show the age gate page
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
      data-testid="page-age-gate"
    >
      {/* SVG Smoke Effect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Turbulence filter for organic smoke texture */}
          <filter id="smokeFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.015" 
              numOctaves="3" 
              seed="5"
              result="noise"
            >
              <animate 
                attributeName="baseFrequency" 
                dur="30s" 
                values="0.015;0.02;0.015" 
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="8" />
          </filter>
          
          {/* Gradient for smoke color */}
          <linearGradient id="smokeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="40%" stopColor="rgba(200,200,200,0.3)" />
            <stop offset="70%" stopColor="rgba(150,150,150,0.15)" />
            <stop offset="100%" stopColor="rgba(100,100,100,0)" />
          </linearGradient>

          {/* Radial gradient for individual smoke puffs */}
          <radialGradient id="puffGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="50%" stopColor="rgba(220,220,220,0.3)" />
            <stop offset="100%" stopColor="rgba(180,180,180,0)" />
          </radialGradient>
        </defs>

        {/* Animated smoke columns */}
        {[...Array(5)].map((_, i) => {
          const xPos = 30 + i * 10;
          const delay = i * 0.8;
          const duration = 12 + i * 2;
          
          return (
            <g key={i} filter="url(#smokeFilter)">
              <ellipse
                cx={`${xPos}%`}
                cy="110%"
                rx="15%"
                ry="60%"
                fill="url(#smokeGradient)"
                opacity="0.7"
              >
                <animate
                  attributeName="cy"
                  dur={`${duration}s`}
                  values="110%;-20%"
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                />
                <animate
                  attributeName="rx"
                  dur={`${duration}s`}
                  values="8%;20%;35%"
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                />
                <animate
                  attributeName="opacity"
                  dur={`${duration}s`}
                  values="0;0.6;0.4;0.2;0"
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                />
              </ellipse>
            </g>
          );
        })}

        {/* Floating smoke puffs */}
        {[...Array(12)].map((_, i) => {
          const startX = 20 + ((i * 23) % 60);
          const delay = (i * 1.3) % 10;
          const duration = 14 + (i % 4) * 3;
          const size = 80 + (i * 15) % 100;
          const drift = ((i * 17) % 40) - 20;
          
          return (
            <circle
              key={`puff-${i}`}
              cx={`${startX}%`}
              cy="105%"
              r={size}
              fill="url(#puffGradient)"
              filter="url(#smokeFilter)"
              opacity="0"
            >
              <animate
                attributeName="cy"
                dur={`${duration}s`}
                values="105%;-10%"
                repeatCount="indefinite"
                begin={`${delay}s`}
              />
              <animate
                attributeName="cx"
                dur={`${duration}s`}
                values={`${startX}%;${startX + drift}%`}
                repeatCount="indefinite"
                begin={`${delay}s`}
              />
              <animate
                attributeName="r"
                dur={`${duration}s`}
                values={`${size};${size * 2};${size * 3.5}`}
                repeatCount="indefinite"
                begin={`${delay}s`}
              />
              <animate
                attributeName="opacity"
                dur={`${duration}s`}
                values="0;0.5;0.35;0.15;0"
                repeatCount="indefinite"
                begin={`${delay}s`}
              />
            </circle>
          );
        })}
      </svg>

      {/* Layered smoke haze at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none z-[5]">
        <div className="absolute inset-0 bg-gradient-to-t from-white/25 via-white/10 to-transparent blur-2xl" />
      </div>

      {/* Subtle warm glow at smoke origin */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(255,180,120,0.5) 0%, transparent 70%)" }}
      />

      {/* Main content card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md mx-4 text-center px-8 py-16 bg-black backdrop-blur-md rounded-lg border border-white/10 z-[15]"
      >
        {/* Colorful decorative corners */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#2DD4BF] to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-[#2DD4BF] to-transparent" />
        </div>
        <div className="absolute top-0 right-0 w-20 h-20">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#E8736F] to-transparent" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-[#E8736F] to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#B8A9C9] to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-[#B8A9C9] to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#C5A059] to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-[#C5A059] to-transparent" />
        </div>
        
        {/* Logo */}
        <motion.img 
          src="https://age.gminfotech.net/assets/img/visual_images/1753980479.png" 
          alt="Attaie Cigars" 
          className="h-24 mx-auto mb-8 object-contain"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          data-testid="img-logo"
        />

        <motion.h2
          className="text-2xl font-serif mb-3 bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Age Verification
        </motion.h2>
        
        <motion.p 
          className="text-white/60 text-sm uppercase tracking-[0.15em] mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          You must be <span className="text-[#2DD4BF] font-semibold">21+</span> to enter this site
        </motion.p>

        <motion.div 
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={handleVerify}
            className="relative w-full py-4 text-sm tracking-[0.2em] uppercase font-semibold text-black overflow-hidden rounded-md group"
            data-testid="button-verify-age"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Yes, I am 21 or Older</span>
          </button>
          
          <button
            onClick={handleDeny}
            className="w-full py-4 text-sm tracking-[0.2em] uppercase font-medium border border-white/20 text-white/50 hover:text-white hover:border-[#E8736F]/50 hover:bg-[#E8736F]/10 transition-all duration-500 rounded-md"
            data-testid="button-decline-age"
          >
            No, I am Under 21
          </button>
        </motion.div>

        <motion.p 
          className="text-white/30 text-xs mt-10 max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          By entering this site you are agreeing to the <Link href="/terms" className="text-[#B8A9C9] hover:text-white transition-colors underline underline-offset-2" data-testid="link-terms-of-use">Terms of Use</Link> and <Link href="/privacy" className="text-[#B8A9C9] hover:text-white transition-colors underline underline-offset-2" data-testid="link-privacy-policy">Privacy Policy</Link>.
        </motion.p>
      </motion.div>
    </div>
  );
}
