import { motion, useInView, Variant } from "framer-motion";
import { useRef, ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "fade" | "scale" | "blur";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  threshold?: number;
}

const getVariants = (direction: RevealDirection, distance: number): { hidden: Variant; visible: Variant } => {
  const base = { opacity: 0 };
  const visible = { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" };

  switch (direction) {
    case "up":
      return { hidden: { ...base, y: distance }, visible };
    case "down":
      return { hidden: { ...base, y: -distance }, visible };
    case "left":
      return { hidden: { ...base, x: distance }, visible };
    case "right":
      return { hidden: { ...base, x: -distance }, visible };
    case "scale":
      return { hidden: { ...base, scale: 0.8 }, visible };
    case "blur":
      return { hidden: { ...base, filter: "blur(10px)" }, visible };
    case "fade":
    default:
      return { hidden: base, visible: { opacity: 1 } };
  }
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  className = "",
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const variants = getVariants(direction, distance);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: ReactNode[];
  staggerDelay?: number;
  direction?: RevealDirection;
  className?: string;
  childClassName?: string;
  once?: boolean;
}

export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  direction = "up",
  className = "",
  childClassName = "",
  once = true,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.1 });
  const variants = getVariants(direction, 30);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={variants}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={childClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
