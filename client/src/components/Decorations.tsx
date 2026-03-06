import { motion } from "framer-motion";

// Elegant smoke/mist pattern for premium cigar aesthetic
export function TropicalPattern({ className = "", opacity = 0.05 }: { className?: string; opacity?: number }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity: opacity * 3 }}>
      {/* Layered smoke wisps using CSS animations */}
      <div className="absolute inset-0">
        {/* Smoke layer 1 - slow drift */}
        <div 
          className="absolute inset-0 animate-smoke-drift-slow"
          style={{
            background: `
              radial-gradient(ellipse 80% 40% at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 60% 30% at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 90% 50% at 50% 80%, rgba(255,255,255,0.04) 0%, transparent 70%)
            `
          }}
        />
        {/* Smoke layer 2 - medium drift */}
        <div 
          className="absolute inset-0 animate-smoke-drift-medium"
          style={{
            background: `
              radial-gradient(ellipse 70% 35% at 80% 60%, rgba(255,255,255,0.06) 0%, transparent 65%),
              radial-gradient(ellipse 50% 25% at 30% 40%, rgba(255,255,255,0.05) 0%, transparent 55%),
              radial-gradient(ellipse 100% 40% at 60% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)
            `
          }}
        />
        {/* Smoke layer 3 - fast subtle drift */}
        <div 
          className="absolute inset-0 animate-smoke-drift-fast"
          style={{
            background: `
              radial-gradient(ellipse 40% 20% at 40% 70%, rgba(255,255,255,0.04) 0%, transparent 50%),
              radial-gradient(ellipse 55% 28% at 85% 45%, rgba(255,255,255,0.03) 0%, transparent 55%),
              radial-gradient(ellipse 45% 22% at 15% 25%, rgba(255,255,255,0.04) 0%, transparent 50%)
            `
          }}
        />
      </div>
      {/* SVG smoke wisps for additional texture */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <filter id="smoke-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
          <linearGradient id="smoke-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="30%" stopColor="white" stopOpacity="0.3" />
            <stop offset="70%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Curved smoke paths */}
        <g filter="url(#smoke-blur)" opacity="0.15">
          <path 
            d="M-100 200 Q100 150 300 180 Q500 210 700 170 Q900 130 1100 160 Q1300 190 1500 150" 
            fill="none" 
            stroke="url(#smoke-fade)" 
            strokeWidth="60"
            className="animate-smoke-path-1"
          />
          <path 
            d="M-50 350 Q150 300 350 330 Q550 360 750 320 Q950 280 1150 310 Q1350 340 1550 300" 
            fill="none" 
            stroke="url(#smoke-fade)" 
            strokeWidth="40"
            className="animate-smoke-path-2"
          />
          <path 
            d="M0 100 Q200 70 400 90 Q600 110 800 80 Q1000 50 1200 70 Q1400 90 1600 60" 
            fill="none" 
            stroke="url(#smoke-fade)" 
            strokeWidth="50"
            className="animate-smoke-path-3"
          />
        </g>
      </svg>
    </div>
  );
}

// Standalone smoke pattern component for direct use
export function SmokePattern({ className = "", opacity = 0.15 }: { className?: string; opacity?: number }) {
  return <TropicalPattern className={className} opacity={opacity / 3} />;
}

// Legacy tobacco leaf pattern (keeping for backward compatibility)
export function TobaccoLeafPattern({ className = "", opacity = 0.03 }: { className?: string; opacity?: number }) {
  return <TropicalPattern className={className} opacity={opacity} />;
}

// Ornate filigree divider with teal accent option
export function FiligreeDivider({ className = "", color = "gold" }: { className?: string; color?: "gold" | "teal" }) {
  const colorClass = color === "teal" ? "text-[#1a6b6b]" : "text-[#C5A059]";
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <svg width="80" height="20" viewBox="0 0 80 20" className={colorClass}>
        <path 
          d="M0 10 Q10 5 20 10 Q30 15 40 10 Q35 8 30 10 Q25 12 20 10 Q15 8 10 10 Q5 12 0 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="40" cy="10" r="2" fill="currentColor" />
      </svg>
      <div className={`w-2 h-2 rotate-45 border ${color === "teal" ? "border-[#1a6b6b]" : "border-[#C5A059]"}`} />
      <svg width="80" height="20" viewBox="0 0 80 20" className={`${colorClass} transform scale-x-[-1]`}>
        <path 
          d="M0 10 Q10 5 20 10 Q30 15 40 10 Q35 8 30 10 Q25 12 20 10 Q15 8 10 10 Q5 12 0 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="40" cy="10" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

// Simple filigree line
export function FiligreeeLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 10" className={`h-3 text-[#C5A059] ${className}`}>
      <path 
        d="M0 5 L60 5 Q70 2 80 5 Q90 8 100 5 Q110 2 120 5 Q130 8 140 5 L200 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <circle cx="100" cy="5" r="3" fill="currentColor" />
      <circle cx="80" cy="5" r="1.5" fill="currentColor" />
      <circle cx="120" cy="5" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Ornate corner decoration
export function OrnateCorner({ position = "top-left", size = 60, color = "gold" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; size?: number; color?: "gold" | "teal" }) {
  const rotations = {
    "top-left": "rotate(0)",
    "top-right": "rotate(90)",
    "bottom-right": "rotate(180)",
    "bottom-left": "rotate(270)"
  };

  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0"
  };

  const colorClass = color === "teal" ? "text-[#1a6b6b]/40" : "text-[#C5A059]/30";

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 60 60" 
      className={`absolute ${positions[position]} ${colorClass}`}
      style={{ transform: rotations[position] }}
    >
      <path 
        d="M0 0 L0 20 Q0 15 5 10 Q10 5 20 5 L20 0 M0 0 L30 0 Q15 0 10 5 Q5 10 5 30 L0 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path 
        d="M5 5 Q8 8 5 15 M5 5 Q8 8 15 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="5" cy="5" r="2" fill="currentColor" />
    </svg>
  );
}

// Decorative frame with all four corners
export function OrnateFrame({ children, className = "", color = "gold" }: { children: React.ReactNode; className?: string; color?: "gold" | "teal" }) {
  return (
    <div className={`relative ${className}`}>
      <OrnateCorner position="top-left" color={color} />
      <OrnateCorner position="top-right" color={color} />
      <OrnateCorner position="bottom-left" color={color} />
      <OrnateCorner position="bottom-right" color={color} />
      {children}
    </div>
  );
}

// Animated decorative border with teal/gold options
export function AnimatedBorder({ className = "", color = "gold" }: { className?: string; color?: "gold" | "teal" }) {
  const colorClass = color === "teal" ? "[#1a6b6b]" : "[#C5A059]";
  return (
    <motion.div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Top border */}
      <div className={`absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-${colorClass}/40 to-transparent`} />
      {/* Bottom border */}
      <div className={`absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-${colorClass}/40 to-transparent`} />
      {/* Left border */}
      <div className={`absolute left-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-${colorClass}/40 to-transparent`} />
      {/* Right border */}
      <div className={`absolute right-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-${colorClass}/40 to-transparent`} />
    </motion.div>
  );
}

// Leaf wreath decoration (like in your logo)
export function LeafWreath({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`text-[#C5A059] ${className}`}
    >
      {/* Create leaves in a circle */}
      {[...Array(16)].map((_, i) => (
        <path
          key={i}
          d="M50 8 Q52 12 51 18 Q50 22 48 18 Q47 12 50 8"
          fill="currentColor"
          transform={`rotate(${i * 22.5}, 50, 50)`}
          opacity={0.6}
        />
      ))}
      {/* Inner circle */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

// Teal gradient overlay section with tropical pattern
export function TealGradientSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Teal gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a5f5f] via-[#1a6b6b] to-[#0d4545]" />
      {/* Tropical pattern texture */}
      <TropicalPattern opacity={0.08} />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

// New: Tropical sunset gradient background - inspired by brand image
export function TropicalSunsetBg({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Base teal gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d4545] via-[#1a6b6b] to-[#1a5f5f]" />
      {/* Sunset glow at horizon */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#C5A059]/10 via-transparent to-transparent" />
      {/* Tropical pattern overlay */}
      <TropicalPattern opacity={0.1} />
    </div>
  );
}

// Attaie brand medallion decoration
export function BrandMedallion({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`${className}`}
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#C5A059" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#C5A059" strokeWidth="1" opacity="0.5" />
      {/* Inner circle with teal */}
      <circle cx="50" cy="50" r="35" fill="#1a6b6b" />
      {/* Gold leaf accents around the circle */}
      {[...Array(12)].map((_, i) => (
        <path
          key={i}
          d="M50 10 Q52 15 51 20 Q50 25 48 20 Q47 15 50 10"
          fill="#C5A059"
          transform={`rotate(${i * 30}, 50, 50)`}
        />
      ))}
      {/* Center A logo placeholder */}
      <text x="50" y="58" textAnchor="middle" fill="#C5A059" fontSize="24" fontFamily="serif" fontWeight="bold">A</text>
    </svg>
  );
}

// Decorative gold line separator
export function GoldLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-[#C5A059]" />
      <div className="w-1.5 h-1.5 bg-[#C5A059] rotate-45" />
      <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-[#C5A059]" />
    </div>
  );
}

// Teal accent line
export function TealLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-[#1a6b6b]" />
      <div className="w-1.5 h-1.5 bg-[#1a6b6b] rotate-45" />
      <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-[#1a6b6b]" />
    </div>
  );
}
