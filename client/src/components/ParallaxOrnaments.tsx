import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ParallaxOrnamentsProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function ParallaxOrnaments({ 
  children, 
  className = "",
  intensity = 1
}: ParallaxOrnamentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * 0.02 * intensity);
      mouseY.set((e.clientY - centerY) * 0.02 * intensity);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, intensity, shouldReduceMotion]);

  const layer1X = useTransform(x, (v) => v * 3);
  const layer1Y = useTransform(y, (v) => v * 3);
  const layer2X = useTransform(x, (v) => v * 2);
  const layer2Y = useTransform(y, (v) => v * 2);
  const layer3X = useTransform(x, (v) => v * 1);
  const layer3Y = useTransform(y, (v) => v * 1);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div 
        className="absolute -top-10 -left-10 w-32 h-32 pointer-events-none"
        style={shouldReduceMotion ? { x: 0, y: 0 } : { x: layer1X, y: layer1Y }}
      >
        <FloatingGoldElement variant="spiral" />
      </motion.div>
      
      <motion.div 
        className="absolute -top-5 -right-10 w-24 h-24 pointer-events-none"
        style={shouldReduceMotion ? { x: 0, y: 0 } : { x: layer2X, y: layer2Y }}
      >
        <FloatingGoldElement variant="diamond" />
      </motion.div>
      
      <motion.div 
        className="absolute -bottom-10 -left-5 w-20 h-20 pointer-events-none"
        style={shouldReduceMotion ? { x: 0, y: 0 } : { x: layer2X, y: layer2Y }}
      >
        <FloatingGoldElement variant="circle" />
      </motion.div>
      
      <motion.div 
        className="absolute -bottom-5 -right-5 w-28 h-28 pointer-events-none"
        style={shouldReduceMotion ? { x: 0, y: 0 } : { x: layer3X, y: layer3Y }}
      >
        <FloatingGoldElement variant="flourish" />
      </motion.div>
      
      <motion.div 
        className="absolute top-1/2 -left-16 -translate-y-1/2 w-16 h-16 pointer-events-none opacity-50"
        style={shouldReduceMotion ? { x: 0, y: 0 } : { x: layer1X, y: layer1Y }}
      >
        <FloatingGoldElement variant="dot" />
      </motion.div>
      
      <motion.div 
        className="absolute top-1/2 -right-16 -translate-y-1/2 w-16 h-16 pointer-events-none opacity-50"
        style={shouldReduceMotion ? { x: 0, y: 0 } : { x: layer1X, y: layer1Y }}
      >
        <FloatingGoldElement variant="dot" />
      </motion.div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function FloatingGoldElement({ variant }: { variant: "spiral" | "diamond" | "circle" | "flourish" | "dot" }) {
  const shouldReduceMotion = useReducedMotion();
  const color = "#C5A059";
  
  const floatAnimation = shouldReduceMotion ? {} : {
    y: [0, -5, 0],
    rotate: variant === "spiral" ? [0, 5, 0] : [0, 0, 0],
    transition: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
  };

  if (variant === "spiral") {
    return (
      <motion.svg 
        viewBox="0 0 100 100" 
        fill="none" 
        className="w-full h-full"
        animate={floatAnimation}
        style={{ filter: `drop-shadow(0 0 10px ${color}50)` }}
      >
        <path
          d="M50 10 Q80 20 85 50 Q90 80 50 90 Q20 95 15 50 Q10 20 50 10"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M50 25 Q70 30 72 50 Q75 70 50 75 Q30 78 28 50 Q25 30 50 25"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <circle cx="50" cy="50" r="8" fill={color} opacity="0.3" />
      </motion.svg>
    );
  }

  if (variant === "diamond") {
    return (
      <motion.svg 
        viewBox="0 0 100 100" 
        fill="none" 
        className="w-full h-full"
        animate={floatAnimation}
        style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
      >
        <path
          d="M50 5 L95 50 L50 95 L5 50 Z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M50 20 L80 50 L50 80 L20 50 Z"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <circle cx="50" cy="50" r="5" fill={color} opacity="0.6" />
      </motion.svg>
    );
  }

  if (variant === "circle") {
    return (
      <motion.svg 
        viewBox="0 0 100 100" 
        fill="none" 
        className="w-full h-full"
        animate={floatAnimation}
        style={{ filter: `drop-shadow(0 0 6px ${color}30)` }}
      >
        <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
        <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="0.8" fill="none" opacity="0.3" />
        <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="0.6" fill="none" opacity="0.2" />
        <circle cx="50" cy="50" r="6" fill={color} opacity="0.5" />
      </motion.svg>
    );
  }

  if (variant === "flourish") {
    return (
      <motion.svg 
        viewBox="0 0 100 100" 
        fill="none" 
        className="w-full h-full"
        animate={floatAnimation}
        style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
      >
        <path
          d="M10 50 Q30 30 50 50 Q70 70 90 50"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M10 50 Q30 70 50 50 Q70 30 90 50"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <circle cx="50" cy="50" r="4" fill={color} opacity="0.7" />
        <circle cx="10" cy="50" r="3" fill={color} opacity="0.4" />
        <circle cx="90" cy="50" r="3" fill={color} opacity="0.4" />
      </motion.svg>
    );
  }

  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      fill="none" 
      className="w-full h-full"
      animate={floatAnimation}
      style={{ filter: `drop-shadow(0 0 4px ${color}30)` }}
    >
      <circle cx="50" cy="50" r="10" fill={color} opacity="0.4" />
      <circle cx="50" cy="50" r="5" fill={color} opacity="0.6" />
    </motion.svg>
  );
}

export function ParallaxLayer({
  children,
  depth = 1,
  className = ""
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * 0.01 * depth;
      const y = (e.clientY - window.innerHeight / 2) * 0.01 * depth;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [depth, shouldReduceMotion]);

  return (
    <motion.div
      className={className}
      animate={shouldReduceMotion ? {} : { x: offset.x, y: offset.y }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
}
