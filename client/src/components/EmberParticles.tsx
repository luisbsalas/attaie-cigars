import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Ember {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: "gold" | "coral" | "orange";
}

interface EmberParticlesProps {
  count?: number;
  className?: string;
  interactive?: boolean;
  colors?: Array<"gold" | "coral" | "orange">;
}

export function EmberParticles({ 
  count = 15, 
  className = "",
  interactive = true,
  colors = ["gold", "coral", "orange"]
}: EmberParticlesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [embers, setEmbers] = useState<Ember[]>([]);
  const [sparks, setSparks] = useState<Ember[]>([]);

  const colorMap = {
    gold: "#C5A059",
    coral: "#E8736F",
    orange: "#D4783D"
  };

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const initialEmbers: Ember[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setEmbers(initialEmbers);
  }, [count, colors, shouldReduceMotion]);

  const createSpark = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    if (shouldReduceMotion || !interactive) return;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    const newSparks: Ember[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      size: 1 + Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
      delay: 0,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setSparks(prev => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
    }, 1000);
  }, [colors, interactive, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#C5A059] opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      onMouseMove={interactive ? (e) => {
        if (Math.random() > 0.95) {
          const rect = e.currentTarget.getBoundingClientRect();
          createSpark(e.clientX, e.clientY, rect);
        }
      } : undefined}
      style={{ pointerEvents: interactive ? "auto" : "none" }}
    >
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            top: `${ember.y}%`,
            width: ember.size,
            height: ember.size,
            backgroundColor: colorMap[ember.color],
            boxShadow: `0 0 ${ember.size * 2}px ${colorMap[ember.color]}, 0 0 ${ember.size * 4}px ${colorMap[ember.color]}50`
          }}
          initial={{ y: 0, x: 0, opacity: 0.2, scale: 1 }}
          animate={{
            y: [0, -30 - Math.random() * 20, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: ember.duration,
            repeat: Infinity,
            delay: ember.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full"
            style={{
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: spark.size,
              height: spark.size,
              backgroundColor: colorMap[spark.color],
              boxShadow: `0 0 ${spark.size * 3}px ${colorMap[spark.color]}`
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [1, 1.5, 0],
              opacity: [1, 0.8, 0],
              y: -20 - Math.random() * 30,
              x: (Math.random() - 0.5) * 40
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: spark.duration, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function EmberGlow({
  className = "",
  color = "#C5A059",
  size = "md",
  pulse = true
}: {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  
  const sizeMap = {
    sm: { width: 60, height: 20, blur: 15 },
    md: { width: 120, height: 40, blur: 25 },
    lg: { width: 200, height: 60, blur: 40 }
  };
  
  const { width, height, blur } = sizeMap[size];

  return (
    <motion.div
      className={`rounded-full pointer-events-none ${className}`}
      style={{
        width,
        height,
        background: `radial-gradient(ellipse at center, ${color}60 0%, ${color}20 50%, transparent 70%)`,
        filter: `blur(${blur}px)`
      }}
      initial={{ opacity: 0.4, scale: 1 }}
      animate={!shouldReduceMotion && pulse ? {
        opacity: [0.4, 0.7, 0.4],
        scale: [1, 1.1, 1]
      } : { opacity: 0.4, scale: 1 }}
      transition={{
        duration: !shouldReduceMotion && pulse ? 2 : 0,
        repeat: !shouldReduceMotion && pulse ? Infinity : 0,
        ease: "easeInOut"
      }}
    />
  );
}

export function SparkBurst({
  x,
  y,
  onComplete
}: {
  x: number;
  y: number;
  onComplete?: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const sparkCount = 8;
  const colors = ["#C5A059", "#E8736F", "#D4783D"];

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  if (shouldReduceMotion) return null;

  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {Array.from({ length: sparkCount }).map((_, i) => {
        const angle = (i / sparkCount) * 360;
        const distance = 30 + Math.random() * 20;
        const rad = (angle * Math.PI) / 180;
        
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              boxShadow: `0 0 4px ${colors[0]}`
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(rad) * distance,
              y: Math.sin(rad) * distance,
              scale: 0,
              opacity: 0
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
