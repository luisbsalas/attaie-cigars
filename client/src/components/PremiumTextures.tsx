import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// =============================================================================
// TEXTURE OVERLAYS - Leather, Wood, and Embossed Patterns
// =============================================================================

export function LeatherTexture({ 
  className = "", 
  opacity = 0.15,
  color = "#8B4513"
}: { 
  className?: string; 
  opacity?: number;
  color?: string;
}) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23leather)' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E")
        `,
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay'
      }}
    />
  );
}

export function WoodGrainTexture({ 
  className = "", 
  opacity = 0.12,
  direction = "horizontal"
}: { 
  className?: string; 
  opacity?: number;
  direction?: "horizontal" | "vertical";
}) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `
          repeating-linear-gradient(
            ${direction === 'horizontal' ? '0deg' : '90deg'},
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.1) 2px,
            rgba(139, 69, 19, 0.1) 4px,
            transparent 4px,
            transparent 8px
          ),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.15' numOctaves='3' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23wood)' fill='%238B4513'/%3E%3C/svg%3E")
        `,
        backgroundSize: '100% 100%, 300px 300px',
        mixBlendMode: 'overlay'
      }}
    />
  );
}

export function EmbossedPattern({ 
  className = "", 
  pattern = "diamond",
  opacity = 0.08
}: { 
  className?: string; 
  pattern?: "diamond" | "floral" | "geometric";
  opacity?: number;
}) {
  const patterns = {
    diamond: `
      url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23C5A059' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M20 5L35 20L20 35L5 20Z' fill='none' stroke='%23C5A059' stroke-width='0.3' opacity='0.3'/%3E%3C/svg%3E")
    `,
    floral: `
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' fill='none' stroke='%23C5A059' stroke-width='0.5' opacity='0.4'/%3E%3Ccircle cx='30' cy='30' r='12' fill='none' stroke='%23C5A059' stroke-width='0.3' opacity='0.3'/%3E%3Cpath d='M30 10 Q35 20 30 30 Q25 20 30 10' fill='none' stroke='%23C5A059' stroke-width='0.4' opacity='0.3'/%3E%3Cpath d='M30 50 Q35 40 30 30 Q25 40 30 50' fill='none' stroke='%23C5A059' stroke-width='0.4' opacity='0.3'/%3E%3Cpath d='M10 30 Q20 35 30 30 Q20 25 10 30' fill='none' stroke='%23C5A059' stroke-width='0.4' opacity='0.3'/%3E%3Cpath d='M50 30 Q40 35 30 30 Q40 25 50 30' fill='none' stroke='%23C5A059' stroke-width='0.4' opacity='0.3'/%3E%3C/svg%3E")
    `,
    geometric: `
      url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='40' height='40' fill='none' stroke='%23C5A059' stroke-width='0.5' opacity='0.3'/%3E%3Crect x='15' y='15' width='20' height='20' fill='none' stroke='%23C5A059' stroke-width='0.3' opacity='0.25'/%3E%3Cline x1='0' y1='0' x2='50' y2='50' stroke='%23C5A059' stroke-width='0.2' opacity='0.2'/%3E%3Cline x1='50' y1='0' x2='0' y2='50' stroke='%23C5A059' stroke-width='0.2' opacity='0.2'/%3E%3C/svg%3E")
    `
  };

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: patterns[pattern],
        backgroundSize: pattern === 'floral' ? '60px 60px' : pattern === 'geometric' ? '50px 50px' : '40px 40px',
      }}
    />
  );
}

// =============================================================================
// CIGAR BAND BORDERS - Ornate decorative borders
// =============================================================================

export function CigarBandBorder({ 
  children, 
  className = "",
  variant = "classic"
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "classic" | "ornate" | "minimal";
}) {
  const borderStyles = {
    classic: {
      border: "2px solid transparent",
      backgroundImage: `
        linear-gradient(#111, #111),
        linear-gradient(90deg, #C5A059 0%, #d4af68 25%, #C5A059 50%, #d4af68 75%, #C5A059 100%)
      `,
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box"
    },
    ornate: {
      border: "3px solid transparent",
      backgroundImage: `
        linear-gradient(#0a0a0a, #0a0a0a),
        repeating-linear-gradient(90deg, #C5A059 0px, #C5A059 10px, #d4af68 10px, #d4af68 20px, #C5A059 20px)
      `,
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box"
    },
    minimal: {
      border: "1px solid #C5A05940",
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      style={borderStyles[variant]}
    >
      {variant === 'ornate' && (
        <>
          <div className="absolute -top-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
          <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
          <div className="absolute top-4 bottom-4 -left-1 w-0.5 bg-gradient-to-b from-transparent via-[#C5A059] to-transparent" />
          <div className="absolute top-4 bottom-4 -right-1 w-0.5 bg-gradient-to-b from-transparent via-[#C5A059] to-transparent" />
        </>
      )}
      {children}
    </div>
  );
}

export function OrnateDivider({ 
  className = "",
  width = "full",
  color = "#C5A059"
}: { 
  className?: string;
  width?: "full" | "half" | "third";
  color?: string;
}) {
  const widthClass = {
    full: "w-full",
    half: "w-1/2",
    third: "w-1/3"
  };

  return (
    <div className={`flex items-center justify-center ${widthClass[width]} mx-auto ${className}`}>
      <svg viewBox="0 0 400 20" className="w-full h-5" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor={color} />
            <stop offset="50%" stopColor={color} />
            <stop offset="80%" stopColor={color} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="0" y1="10" x2="170" y2="10" stroke="url(#dividerGradient)" strokeWidth="1" />
        <circle cx="180" cy="10" r="2" fill={color} />
        <path d="M190 10 L200 5 L210 10 L200 15 Z" fill={color} />
        <circle cx="220" cy="10" r="2" fill={color} />
        <line x1="230" y1="10" x2="400" y2="10" stroke="url(#dividerGradient)" strokeWidth="1" />
        <circle cx="185" cy="10" r="1" fill={color} opacity="0.5" />
        <circle cx="215" cy="10" r="1" fill={color} opacity="0.5" />
      </svg>
    </div>
  );
}

export function CornerOrnament({ 
  position,
  size = "md",
  color = "#C5A059"
}: { 
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  const sizeMap = { sm: 30, md: 50, lg: 70 };
  const dimension = sizeMap[size];
  
  const transforms = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)"
  };

  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0"
  };

  return (
    <div 
      className={`absolute ${positions[position]} pointer-events-none`}
      style={{ transform: transforms[position] }}
    >
      <svg width={dimension} height={dimension} viewBox="0 0 50 50">
        <path 
          d="M0 0 L0 20 Q0 10 10 10 L10 10 Q5 10 5 5 L5 5 Q5 0 0 0 Z" 
          fill="none" 
          stroke={color} 
          strokeWidth="1.5"
        />
        <path 
          d="M0 25 Q0 15 10 15 L20 15" 
          fill="none" 
          stroke={color} 
          strokeWidth="1" 
          opacity="0.6"
        />
        <path 
          d="M25 0 Q15 0 15 10 L15 20" 
          fill="none" 
          stroke={color} 
          strokeWidth="1" 
          opacity="0.6"
        />
        <circle cx="5" cy="5" r="2" fill={color} opacity="0.8" />
      </svg>
    </div>
  );
}

// =============================================================================
// WAX SEAL COMPONENT
// =============================================================================

export function WaxSeal({ 
  text = "AC",
  size = "md",
  color = "#8B0000",
  className = ""
}: { 
  text?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}) {
  const sizeMap = { sm: 60, md: 90, lg: 120 };
  const dimension = sizeMap[size];
  const fontSize = size === 'sm' ? 16 : size === 'md' ? 24 : 32;

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <radialGradient id="waxGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#4a0000" />
          </radialGradient>
          <filter id="waxEmboss">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#ffffff" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
        
        <path 
          d="M50 5 
             Q65 3, 75 10 
             Q88 15, 93 30 
             Q98 45, 95 55 
             Q93 70, 85 80 
             Q75 92, 60 95 
             Q45 98, 35 93 
             Q20 88, 12 75 
             Q5 62, 5 50 
             Q5 35, 15 22 
             Q25 10, 40 5 
             Q45 4, 50 5 Z"
          fill="url(#waxGradient)"
          filter="url(#waxEmboss)"
        />
        
        <circle cx="50" cy="50" r="32" fill="none" stroke="#ffffff20" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff15" strokeWidth="1" />
        
        <text 
          x="50" 
          y="55" 
          textAnchor="middle" 
          dominantBaseline="middle"
          fill="#d4af68"
          fontSize={fontSize}
          fontFamily="serif"
          fontWeight="bold"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

// =============================================================================
// AGED PAPER TEXTURE (for Founder's Note)
// =============================================================================

export function AgedPaperCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          background: `
            linear-gradient(135deg, #f5e6c8 0%, #e8d5b0 25%, #f0dfc4 50%, #dcc9a3 75%, #e8d5b0 100%)
          `,
          boxShadow: `
            inset 0 0 30px rgba(139, 69, 19, 0.15),
            inset 0 0 60px rgba(139, 69, 19, 0.08),
            0 10px 40px rgba(0, 0, 0, 0.4)
          `
        }}
      />
      <div 
        className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23paper)'/%3E%3C/svg%3E")
          `,
          backgroundSize: '200px 200px',
          mixBlendMode: 'multiply'
        }}
      />
      <div 
        className="absolute top-0 left-0 right-0 h-8 rounded-t-lg opacity-20"
        style={{
          background: 'linear-gradient(to bottom, rgba(139, 69, 19, 0.3), transparent)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 rounded-b-lg opacity-20"
        style={{
          background: 'linear-gradient(to top, rgba(139, 69, 19, 0.3), transparent)'
        }}
      />
      <div className="relative z-10 p-8 text-[#4a3728]">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// FOUNDER'S NOTE SECTION
// =============================================================================

export function FoundersNote({ 
  signature = "Roberto Attaie",
  title = "Founder & Master Blender",
  message,
  className = ""
}: { 
  signature?: string;
  title?: string;
  message: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className={`py-20 md:py-32 relative ${className}`}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <AgedPaperCard>
            <div className="text-center mb-6">
              <WaxSeal text="AC" size="md" className="mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-[#5c4332]">A Note from the Founder</h3>
            </div>
            
            <div className="font-serif text-lg leading-relaxed mb-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-[#8B4513]">
              {message}
            </div>
            
            <div className="text-right">
              <p 
                className="text-2xl mb-1 text-[#5c4332]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {signature}
              </p>
              <p className="text-sm uppercase tracking-wider text-[#8B7355]">{title}</p>
            </div>
          </AgedPaperCard>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// CERTIFICATE OF AUTHENTICITY
// =============================================================================

export function CertificateBadge({ 
  productName,
  certificateNumber,
  className = ""
}: { 
  productName: string;
  certificateNumber: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative p-6 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#C5A059]/30 rounded-lg">
        <CornerOrnament position="top-left" size="sm" />
        <CornerOrnament position="top-right" size="sm" />
        <CornerOrnament position="bottom-left" size="sm" />
        <CornerOrnament position="bottom-right" size="sm" />
        
        <div className="text-center py-4">
          <div className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-2">Certificate of Authenticity</div>
          <OrnateDivider width="half" className="mb-4" />
          
          <h4 className="text-white font-serif text-xl mb-2">{productName}</h4>
          <p className="text-white/40 text-xs tracking-wider mb-4">Hand-Rolled in the Dominican Republic</p>
          
          <div className="flex items-center justify-center gap-4">
            <WaxSeal text="AC" size="sm" />
            <div className="text-left">
              <p className="text-[#C5A059] text-xs uppercase tracking-wider">Certificate No.</p>
              <p className="text-white font-bebas text-lg">{certificateNumber}</p>
            </div>
          </div>
        </div>
        
        <EmbossedPattern pattern="diamond" opacity={0.05} />
      </div>
    </div>
  );
}

// =============================================================================
// AGE METER - Cigar Maturation Timeline
// =============================================================================

export function AgeMeter({ 
  currentAge = 3,
  maxAge = 10,
  unit = "years",
  className = ""
}: { 
  currentAge?: number;
  maxAge?: number;
  unit?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const percentage = (currentAge / maxAge) * 100;

  const stages = [
    { age: 0, label: "Fresh", color: "#A8E6CF" },
    { age: 2, label: "Young", color: "#FFD93D" },
    { age: 4, label: "Mature", color: "#C5A059" },
    { age: 7, label: "Aged", color: "#8B4513" },
    { age: 10, label: "Vintage", color: "#4a2c2a" }
  ];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="mb-4 flex justify-between items-end">
        <div>
          <span className="text-[#C5A059] text-xs tracking-[0.2em] uppercase">Aging Timeline</span>
          <h4 className="text-white font-serif text-xl mt-1">
            <span className="font-bebas text-3xl">{currentAge}</span> {unit} aged
          </h4>
        </div>
        <div className="text-right">
          <span className="text-white/40 text-sm">Optimal: 5-8 years</span>
        </div>
      </div>

      <div className="relative h-8 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/10">
        <div className="absolute inset-0 flex">
          {stages.map((stage, i) => (
            <div 
              key={stage.label}
              className="flex-1 border-r border-white/5 last:border-r-0"
              style={{ background: `linear-gradient(to right, ${stage.color}15, ${stages[i+1]?.color || stage.color}15)` }}
            />
          ))}
        </div>
        
        <motion.div 
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, #A8E6CF, #FFD93D, #C5A059, #8B4513)`
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-[#C5A059]"
          initial={{ left: 0 }}
          animate={isInView ? { left: `calc(${percentage}% - 8px)` } : { left: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-2">
        {stages.map((stage) => (
          <div 
            key={stage.label} 
            className="text-center"
            style={{ width: `${100 / stages.length}%` }}
          >
            <div 
              className="w-2 h-2 rounded-full mx-auto mb-1"
              style={{ backgroundColor: stage.color }}
            />
            <span className="text-white/40 text-[10px] uppercase tracking-wider">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// HUMIDOR INDICATOR GAUGE
// =============================================================================

export function HumidorGauge({ 
  humidity = 70,
  temperature = 70,
  className = ""
}: { 
  humidity?: number;
  temperature?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const humidityOptimal = humidity >= 65 && humidity <= 72;
  const tempOptimal = temperature >= 65 && temperature <= 70;

  const GaugeArc = ({ value, max, label, unit, optimal, color }: any) => {
    const angle = (value / max) * 180 - 90;
    
    return (
      <div className="relative w-32 h-20">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <defs>
            <linearGradient id={`gauge-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8736F" />
              <stop offset="35%" stopColor="#FFD93D" />
              <stop offset="45%" stopColor="#2DD4BF" />
              <stop offset="55%" stopColor="#2DD4BF" />
              <stop offset="65%" stopColor="#FFD93D" />
              <stop offset="100%" stopColor="#E8736F" />
            </linearGradient>
          </defs>
          
          <path
            d="M10 55 A40 40 0 0 1 90 55"
            fill="none"
            stroke="#333"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          <path
            d="M10 55 A40 40 0 0 1 90 55"
            fill="none"
            stroke={`url(#gauge-${label})`}
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          <motion.g
            initial={{ rotate: -90 }}
            animate={isInView ? { rotate: angle } : { rotate: -90 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformOrigin: '50px 55px' }}
          >
            <line 
              x1="50" y1="55" 
              x2="50" y2="20" 
              stroke={optimal ? "#2DD4BF" : "#E8736F"} 
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="50" cy="55" r="4" fill={optimal ? "#2DD4BF" : "#E8736F"} />
          </motion.g>
        </svg>
        
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <span className="font-bebas text-2xl text-white">{value}</span>
          <span className="text-white/60 text-sm">{unit}</span>
        </div>
        
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} className={`p-6 bg-[#111] border border-white/10 rounded-xl ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#d4af68]" />
        <h4 className="text-white font-serif">Humidor Conditions</h4>
      </div>

      <div className="flex justify-center gap-8 mb-8">
        <GaugeArc 
          value={humidity} 
          max={100} 
          label="Humidity" 
          unit="%" 
          optimal={humidityOptimal}
        />
        <GaugeArc 
          value={temperature} 
          max={100} 
          label="Temperature" 
          unit="°F" 
          optimal={tempOptimal}
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${humidityOptimal && tempOptimal ? 'bg-[#2DD4BF]' : 'bg-[#E8736F]'}`} />
        <span className={humidityOptimal && tempOptimal ? 'text-[#2DD4BF]' : 'text-[#E8736F]'}>
          {humidityOptimal && tempOptimal ? 'Optimal Storage Conditions' : 'Adjust Conditions'}
        </span>
      </div>

      <div className="mt-4 text-center text-white/30 text-xs">
        Ideal: 65-72% RH | 65-70°F
      </div>
    </div>
  );
}

// =============================================================================
// RING GAUGE COMPARISON TOOL
// =============================================================================

export function RingGaugeComparison({ 
  cigars = [
    { name: "Robusto", ringGauge: 50, length: 5 },
    { name: "Toro", ringGauge: 52, length: 6 },
    { name: "Churchill", ringGauge: 48, length: 7 }
  ],
  className = ""
}: { 
  cigars?: Array<{ name: string; ringGauge: number; length: number }>;
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const maxRing = Math.max(...cigars.map(c => c.ringGauge));
  const maxLength = Math.max(...cigars.map(c => c.length));

  return (
    <div ref={ref} className={`p-6 bg-[#111] border border-white/10 rounded-xl ${className}`}>
      <div className="text-center mb-6">
        <span className="text-[#C5A059] text-xs tracking-[0.2em] uppercase">Size Comparison</span>
        <h4 className="text-white font-serif text-xl mt-1">Ring Gauge Guide</h4>
      </div>

      <div className="flex items-end justify-center gap-6 mb-8 h-40">
        {cigars.map((cigar, index) => {
          const widthPercent = (cigar.ringGauge / maxRing) * 100;
          const heightPercent = (cigar.length / maxLength) * 100;
          const isSelected = selectedIndex === index;

          return (
            <motion.button
              key={cigar.name}
              className="flex flex-col items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-lg p-1"
              onClick={() => setSelectedIndex(index)}
              whileHover={{ scale: 1.05 }}
              aria-pressed={isSelected}
              aria-label={`Select ${cigar.name} cigar, ${cigar.ringGauge} ring gauge, ${cigar.length} inches`}
              data-testid={`button-cigar-${cigar.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <motion.div
                className={`rounded-full transition-all ${isSelected ? 'ring-2 ring-[#C5A059]' : ''}`}
                style={{
                  width: `${widthPercent * 0.6}px`,
                  minWidth: '30px',
                  height: `${heightPercent}%`,
                  minHeight: '60px',
                  background: isSelected 
                    ? 'linear-gradient(180deg, #8B4513, #654321, #4a2c2a)'
                    : 'linear-gradient(180deg, #5c4033, #3d2817, #2a1a0f)',
                  boxShadow: isSelected 
                    ? '0 0 20px rgba(197, 160, 89, 0.3)' 
                    : 'none'
                }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
              <span className={`mt-2 text-xs ${isSelected ? 'text-[#C5A059]' : 'text-white/40'}`}>
                {cigar.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
        <div className="text-center">
          <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Ring Gauge</span>
          <span className="font-bebas text-2xl text-[#C5A059]">{cigars[selectedIndex].ringGauge}</span>
          <span className="text-white/40 text-sm ml-1">/ 64"</span>
        </div>
        <div className="text-center">
          <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Length</span>
          <span className="font-bebas text-2xl text-[#2DD4BF]">{cigars[selectedIndex].length}</span>
          <span className="text-white/40 text-sm ml-1">inches</span>
        </div>
      </div>

      <p className="text-center text-white/30 text-xs mt-4">
        Ring gauge = diameter in 64ths of an inch
      </p>
    </div>
  );
}
