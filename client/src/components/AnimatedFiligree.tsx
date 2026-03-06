import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedFiligreeProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
  color?: string;
  delay?: number;
  className?: string;
}

export function AnimatedFiligree({ 
  position = "top-left", 
  size = "md",
  color = "#C5A059",
  delay = 0,
  className = ""
}: AnimatedFiligreeProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const sizeMap = { sm: 60, md: 100, lg: 150 };
  const svgSize = sizeMap[size];

  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
    "top": "top-0 left-1/2 -translate-x-1/2",
    "bottom": "bottom-0 left-1/2 -translate-x-1/2 rotate-180"
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { duration: shouldReduceMotion ? 0 : 2, ease: "easeInOut", delay },
        opacity: { duration: 0.3, delay }
      }
    }
  };

  const branchVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({ 
      pathLength: 1, 
      opacity: 0.7,
      transition: { 
        pathLength: { duration: shouldReduceMotion ? 0 : 1.5, ease: "easeOut", delay: delay + 0.5 + i * 0.2 },
        opacity: { duration: 0.3, delay: delay + 0.5 + i * 0.2 }
      }
    })
  };

  return (
    <svg
      ref={ref}
      width={svgSize}
      height={svgSize}
      viewBox="0 0 100 100"
      fill="none"
      className={`absolute pointer-events-none ${positionClasses[position]} ${className}`}
      style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
    >
      <motion.path
        d="M5 95 Q5 50 30 30 Q50 15 70 10 Q85 5 95 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        variants={pathVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.path
        d="M20 75 Q25 60 40 50"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        variants={branchVariants}
        custom={0}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.path
        d="M35 55 Q45 45 60 40"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        variants={branchVariants}
        custom={1}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.path
        d="M55 35 Q65 28 80 25"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        variants={branchVariants}
        custom={2}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.circle
        cx="10"
        cy="90"
        r="4"
        fill={color}
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 0.8,
            transition: { duration: shouldReduceMotion ? 0 : 0.5, delay: delay + 1.5 }
          }
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.circle
        cx="90"
        cy="10"
        r="3"
        fill={color}
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 0.6,
            transition: { duration: shouldReduceMotion ? 0 : 0.5, delay: delay + 2 }
          }
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      {[15, 30, 45, 60, 75].map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos}
          cy={100 - pos - 5 + Math.sin(i) * 10}
          r="1.5"
          fill={color}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: 1, 
              opacity: 0.4,
              transition: { duration: shouldReduceMotion ? 0 : 0.3, delay: delay + 0.8 + i * 0.15 }
            }
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        />
      ))}
    </svg>
  );
}

export function VineFiligree({ 
  position = "left",
  color = "#C5A059",
  className = ""
}: { 
  position?: "left" | "right";
  color?: string;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const drawPath = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { duration: shouldReduceMotion ? 0 : 3, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <svg
      ref={ref}
      width="40"
      height="400"
      viewBox="0 0 40 400"
      fill="none"
      className={`absolute ${position === "left" ? "left-0" : "right-0 scale-x-[-1]"} top-1/2 -translate-y-1/2 pointer-events-none ${className}`}
      style={{ filter: `drop-shadow(0 0 6px ${color}30)` }}
    >
      <motion.path
        d="M20 0 Q30 50 20 100 Q10 150 20 200 Q30 250 20 300 Q10 350 20 400"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        variants={drawPath}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      {[50, 150, 250, 350].map((y, i) => (
        <motion.g key={i}>
          <motion.path
            d={i % 2 === 0 ? `M20 ${y} Q35 ${y-15} 38 ${y-25}` : `M20 ${y} Q5 ${y-15} 2 ${y-25}`}
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { 
                pathLength: 1, 
                opacity: 0.7,
                transition: { 
                  pathLength: { duration: shouldReduceMotion ? 0 : 1, delay: 1 + i * 0.3 },
                  opacity: { duration: 0.3, delay: 1 + i * 0.3 }
                }
              }
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
          <motion.ellipse
            cx={i % 2 === 0 ? 36 : 4}
            cy={y - 20}
            rx="6"
            ry="10"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.5"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: { 
                scale: 1, 
                opacity: 0.5,
                transition: { duration: shouldReduceMotion ? 0 : 0.5, delay: 1.5 + i * 0.3 }
              }
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
        </motion.g>
      ))}
    </svg>
  );
}

export function CenterOrnament({
  color = "#C5A059",
  width = 300,
  className = ""
}: {
  color?: string;
  width?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const drawPath = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { duration: shouldReduceMotion ? 0 : 1.5, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    }
  };

  return (
    <svg
      ref={ref}
      width={width}
      height="30"
      viewBox="0 0 300 30"
      fill="none"
      className={`pointer-events-none ${className}`}
      style={{ filter: `drop-shadow(0 0 4px ${color}30)` }}
    >
      <motion.path
        d="M0 15 Q50 15 75 5 Q100 0 150 0 Q200 0 225 5 Q250 15 300 15"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        variants={drawPath}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.path
        d="M0 15 Q50 15 75 25 Q100 30 150 30 Q200 30 225 25 Q250 15 300 15"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        variants={drawPath}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.circle
        cx="150"
        cy="15"
        r="5"
        fill={color}
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 0.8,
            transition: { duration: shouldReduceMotion ? 0 : 0.5, delay: 1 }
          }
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      {[50, 100, 200, 250].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={15 + (i < 2 ? -5 : 5) * (i % 2 === 0 ? 1 : -1)}
          r="2"
          fill={color}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: 1, 
              opacity: 0.5,
              transition: { duration: shouldReduceMotion ? 0 : 0.3, delay: 1.2 + i * 0.1 }
            }
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        />
      ))}
    </svg>
  );
}
