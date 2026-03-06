import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function TobaccoLeaf({
  className = "",
  color = "#C5A059",
  size = 60,
  rotation = 0,
  animated = true
}: {
  className?: string;
  color?: string;
  size?: number;
  rotation?: number;
  animated?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  
  const shouldAnimate = animated && !shouldReduceMotion;

  return (
    <motion.svg
      ref={ref}
      width={size}
      height={size * 1.5}
      viewBox="0 0 40 60"
      fill="none"
      className={`pointer-events-none ${className}`}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        filter: `drop-shadow(0 0 4px ${color}30)`
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={isInView && shouldAnimate ? { opacity: 1, scale: 1, y: 0 } : { opacity: shouldAnimate ? 0 : 1, scale: shouldAnimate ? 0.8 : 1, y: shouldAnimate ? 10 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <path
        d="M20 0 Q35 15 35 30 Q35 50 20 60 Q5 50 5 30 Q5 15 20 0"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <path
        d="M20 5 L20 55"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      <path d="M20 15 Q28 18 32 25" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
      <path d="M20 15 Q12 18 8 25" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
      <path d="M20 25 Q30 28 33 35" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
      <path d="M20 25 Q10 28 7 35" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
      <path d="M20 35 Q28 38 30 45" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
      <path d="M20 35 Q12 38 10 45" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
    </motion.svg>
  );
}

export function SmokeWisp({
  className = "",
  color = "#C5A059",
  position = "left",
  animated = true
}: {
  className?: string;
  color?: string;
  position?: "left" | "right" | "center";
  animated?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = animated && !shouldReduceMotion;

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: [0, 0.6, 0.3],
      transition: { 
        pathLength: { duration: 3, ease: "easeInOut" },
        opacity: { duration: 3, times: [0, 0.5, 1] }
      }
    },
    static: { pathLength: 1, opacity: 0.4 }
  };

  const floatVariants = {
    animate: shouldAnimate ? {
      y: [0, -20, -40],
      x: position === "left" ? [0, -10, -15] : position === "right" ? [0, 10, 15] : [0, 5, 0],
      opacity: [0.6, 0.4, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeOut" }
    } : { y: 0, x: 0, opacity: 0.4 }
  };

  return (
    <motion.svg
      width="60"
      height="120"
      viewBox="0 0 60 120"
      fill="none"
      className={`pointer-events-none ${className}`}
      style={{ filter: `blur(1px)` }}
      initial={{ y: 0, x: 0, opacity: 0.4 }}
      variants={floatVariants}
      animate="animate"
    >
      <motion.path
        d="M30 120 Q25 100 30 80 Q40 60 25 40 Q15 25 30 10 Q40 0 35 -10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
        variants={pathVariants}
        initial="initial"
        animate={shouldAnimate ? "animate" : "static"}
      />
      <motion.path
        d="M35 115 Q30 95 35 75 Q45 55 30 35 Q20 20 35 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
        variants={pathVariants}
        initial="initial"
        animate={shouldAnimate ? "animate" : "static"}
        transition={{ delay: 0.5 }}
      />
    </motion.svg>
  );
}

export function CigarBand({
  className = "",
  color = "#C5A059",
  size = 80,
  animated = true
}: {
  className?: string;
  color?: string;
  size?: number;
  animated?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  
  const shouldAnimate = animated && !shouldReduceMotion;

  return (
    <motion.svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={`pointer-events-none ${className}`}
      style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
      initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
      animate={isInView && shouldAnimate ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: shouldAnimate ? 0 : 1, scale: shouldAnimate ? 0.9 : 1, rotate: shouldAnimate ? -10 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <circle cx="40" cy="40" r="35" fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
      <circle cx="40" cy="40" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="40" cy="40" r="25" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      
      <circle cx="40" cy="40" r="18" fill={color} opacity="0.15" />
      <circle cx="40" cy="40" r="12" fill={color} opacity="0.25" />
      
      <text
        x="40"
        y="44"
        textAnchor="middle"
        fill={color}
        fontSize="8"
        fontFamily="serif"
        fontStyle="italic"
        opacity="0.9"
      >
        A
      </text>
      
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 40 + Math.cos(rad) * 32;
        const y = 40 + Math.sin(rad) * 32;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            opacity="0.6"
            initial={{ scale: 0 }}
            animate={isInView && shouldAnimate ? { scale: 1 } : { scale: shouldAnimate ? 0 : 1 }}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
          />
        );
      })}
    </motion.svg>
  );
}

export function FloatingSmokeLayer({
  className = "",
  color = "#C5A059"
}: {
  className?: string;
  color?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${color}20 0%, transparent 50%)`
          }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${color}15 0%, transparent 40%)`
        }}
        initial={{ x: 0, opacity: 0.3 }}
        animate={{
          x: [0, 50, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: `radial-gradient(ellipse at 70% 60%, ${color}10 0%, transparent 35%)`
        }}
        initial={{ x: 0, opacity: 0.2 }}
        animate={{
          x: [0, -40, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute w-full h-full"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${color}08 0%, transparent 45%)`
        }}
        initial={{ y: 0, opacity: 0.15 }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}

export function TobaccoLeafCluster({
  className = "",
  color = "#C5A059",
  position = "left"
}: {
  className?: string;
  color?: string;
  position?: "left" | "right";
}) {
  const isRight = position === "right";
  
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <TobaccoLeaf 
        size={50} 
        rotation={isRight ? 15 : -15} 
        color={color}
        className="absolute top-0 left-0"
      />
      <TobaccoLeaf 
        size={40} 
        rotation={isRight ? -10 : 10} 
        color={color}
        className="absolute top-8 left-6 opacity-70"
      />
      <TobaccoLeaf 
        size={35} 
        rotation={isRight ? 25 : -25} 
        color={color}
        className="absolute top-4 left-10 opacity-50"
      />
    </div>
  );
}

export function InteractiveShimmer({
  children,
  className = "",
  color = "#C5A059"
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover={shouldReduceMotion ? {} : "hover"}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            120deg,
            transparent 0%,
            transparent 40%,
            ${color}20 50%,
            transparent 60%,
            transparent 100%
          )`
        }}
        variants={{
          hover: {
            x: ["-100%", "100%"],
            transition: { duration: 0.8, ease: "easeInOut" }
          }
        }}
      />
    </motion.div>
  );
}

export function PulsingBorder({
  className = "",
  color = "#C5A059",
  borderWidth = 1
}: {
  className?: string;
  color?: string;
  borderWidth?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none rounded-inherit ${className}`}
      style={{
        border: `${borderWidth}px solid ${color}`,
        opacity: 0.5
      }}
      animate={shouldReduceMotion ? {} : {
        boxShadow: [
          `0 0 0 0 ${color}40`,
          `0 0 10px 2px ${color}60`,
          `0 0 0 0 ${color}40`
        ],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={shouldReduceMotion ? {} : {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
