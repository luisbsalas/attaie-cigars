import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface BaroqueFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: "simple" | "ornate" | "elegant";
  color?: string;
  animated?: boolean;
}

export function BaroqueFrame({ 
  children, 
  className = "",
  variant = "ornate",
  color = "#C5A059",
  animated = true
}: BaroqueFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const shouldAnimate = animated && !shouldReduceMotion;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <CornerOrnament 
        position="top-left" 
        variant={variant} 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0}
      />
      <CornerOrnament 
        position="top-right" 
        variant={variant} 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0.1}
      />
      <CornerOrnament 
        position="bottom-left" 
        variant={variant} 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0.2}
      />
      <CornerOrnament 
        position="bottom-right" 
        variant={variant} 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0.3}
      />
      
      <EdgeBorder 
        position="top" 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0.4}
      />
      <EdgeBorder 
        position="bottom" 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0.5}
      />
      <EdgeBorder 
        position="left" 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0.6}
      />
      <EdgeBorder 
        position="right" 
        color={color} 
        animate={shouldAnimate && isInView}
        delay={0.7}
      />

      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function CornerOrnament({
  position,
  variant,
  color,
  animate,
  delay = 0
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  variant: "simple" | "ornate" | "elegant";
  color: string;
  animate: boolean;
  delay?: number;
}) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0"
  };

  const rotations = {
    "top-left": 0,
    "top-right": 90,
    "bottom-left": -90,
    "bottom-right": 180
  };

  const size = variant === "ornate" ? 80 : variant === "elegant" ? 60 : 40;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={`absolute pointer-events-none ${positionClasses[position]}`}
      style={{ 
        transform: `rotate(${rotations[position]}deg)`,
        filter: `drop-shadow(0 0 6px ${color}40)`
      }}
      initial={animate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
      animate={animate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {variant === "ornate" && (
        <>
          <path
            d="M0 0 L0 30 Q0 5 25 5 L30 5 Q10 5 5 25 L5 30 L0 30"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          <path
            d="M0 0 Q0 40 40 40"
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M5 5 Q5 25 25 25"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.8"
          />
          <circle cx="3" cy="3" r="3" fill={color} opacity="0.9" />
          <circle cx="20" cy="8" r="2" fill={color} opacity="0.5" />
          <circle cx="8" cy="20" r="2" fill={color} opacity="0.5" />
          <path
            d="M15 15 Q25 10 35 15 Q40 25 35 35"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.4"
          />
          <ellipse cx="12" cy="12" rx="4" ry="6" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" transform="rotate(-45 12 12)" />
        </>
      )}
      
      {variant === "elegant" && (
        <>
          <path
            d="M0 0 L0 25 Q0 5 20 5 L25 5"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M0 0 Q0 30 30 30"
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.5"
          />
          <circle cx="3" cy="3" r="2.5" fill={color} opacity="0.8" />
          <circle cx="15" cy="6" r="1.5" fill={color} opacity="0.4" />
          <circle cx="6" cy="15" r="1.5" fill={color} opacity="0.4" />
        </>
      )}
      
      {variant === "simple" && (
        <>
          <path
            d="M0 0 L0 20 L5 20 L5 5 L20 5 L20 0"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
          <circle cx="2" cy="2" r="2" fill={color} opacity="0.7" />
        </>
      )}
    </motion.svg>
  );
}

function EdgeBorder({
  position,
  color,
  animate,
  delay = 0
}: {
  position: "top" | "bottom" | "left" | "right";
  color: string;
  animate: boolean;
  delay?: number;
}) {
  const isHorizontal = position === "top" || position === "bottom";
  
  const positionClasses = {
    "top": "top-0 left-1/2 -translate-x-1/2",
    "bottom": "bottom-0 left-1/2 -translate-x-1/2",
    "left": "left-0 top-1/2 -translate-y-1/2",
    "right": "right-0 top-1/2 -translate-y-1/2"
  };

  if (isHorizontal) {
    return (
      <motion.div 
        className={`absolute h-px pointer-events-none ${positionClasses[position]}`}
        style={{ 
          width: "calc(100% - 100px)",
          background: `linear-gradient(to right, transparent, ${color}40 20%, ${color}60 50%, ${color}40 80%, transparent)`
        }}
        initial={animate ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
        animate={animate ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    );
  }

  return (
    <motion.div 
      className={`absolute w-px pointer-events-none ${positionClasses[position]}`}
      style={{ 
        height: "calc(100% - 100px)",
        background: `linear-gradient(to bottom, transparent, ${color}40 20%, ${color}60 50%, ${color}40 80%, transparent)`
      }}
      initial={animate ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
      animate={animate ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  );
}

export function EmbossedPanel({
  children,
  className = "",
  color = "#C5A059"
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div 
      className={`relative ${className}`}
      style={{
        boxShadow: `
          inset 2px 2px 4px rgba(0,0,0,0.3),
          inset -2px -2px 4px rgba(255,255,255,0.05),
          0 0 20px ${color}20
        `
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color}10 0%, transparent 50%, ${color}05 100%)`
        }}
      />
      {children}
    </div>
  );
}

export function DecorativeDivider({
  className = "",
  color = "#C5A059",
  variant = "ornate"
}: {
  className?: string;
  color?: string;
  variant?: "simple" | "ornate" | "elegant";
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  const width = variant === "ornate" ? 400 : variant === "elegant" ? 300 : 200;
  const height = variant === "ornate" ? 40 : variant === "elegant" ? 30 : 20;

  return (
    <motion.svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`pointer-events-none ${className}`}
      style={{ filter: `drop-shadow(0 0 4px ${color}30)` }}
      initial={shouldReduceMotion ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
      animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <line 
        x1="0" 
        y1={height / 2} 
        x2={width} 
        y2={height / 2} 
        stroke={color} 
        strokeWidth="1" 
        opacity="0.4" 
      />
      
      <circle cx={width / 2} cy={height / 2} r="6" fill={color} opacity="0.8" />
      <circle cx={width / 2} cy={height / 2} r="10" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      
      {variant === "ornate" && (
        <>
          <circle cx={width / 2 - 50} cy={height / 2} r="3" fill={color} opacity="0.5" />
          <circle cx={width / 2 + 50} cy={height / 2} r="3" fill={color} opacity="0.5" />
          <path
            d={`M${width / 2 - 30} ${height / 2 - 5} Q${width / 2} ${height / 2 - 15} ${width / 2 + 30} ${height / 2 - 5}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d={`M${width / 2 - 30} ${height / 2 + 5} Q${width / 2} ${height / 2 + 15} ${width / 2 + 30} ${height / 2 + 5}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.6"
          />
        </>
      )}
      
      {variant === "elegant" && (
        <>
          <circle cx={width / 2 - 40} cy={height / 2} r="2" fill={color} opacity="0.4" />
          <circle cx={width / 2 + 40} cy={height / 2} r="2" fill={color} opacity="0.4" />
        </>
      )}
    </motion.svg>
  );
}
