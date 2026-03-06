import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  minDuration?: number;
}

export function LoadingScreen({ isLoading, minDuration = 1500 }: LoadingScreenProps) {
  const [showLoader, setShowLoader] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else {
      const timer = setTimeout(() => setShowLoader(false), minDuration);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0A0A0A]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          data-testid="loading-screen"
        >
          {/* Animated smoke background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-10"
                style={{
                  background: `radial-gradient(circle, ${
                    ["#C5A059", "#2DD4BF", "#E8736F", "#B8A9C9", "#FFD4B8"][i]
                  } 0%, transparent 70%)`,
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 0.1 }}
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -40, 20, 0],
                  scale: [1, 1.2, 0.9, 1],
                  opacity: [0.1, 0.2, 0.1, 0.1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Main loader content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Cigar animation */}
            <div className="relative">
              {/* Cigar body */}
              <motion.div
                className="relative w-48 h-8 rounded-r-full overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #8B4513 0%, #654321 50%, #4A3520 100%)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                {/* Cigar band */}
                <div 
                  className="absolute left-8 top-0 bottom-0 w-8"
                  style={{
                    background: "linear-gradient(180deg, #C5A059 0%, #A08040 50%, #C5A059 100%)",
                  }}
                >
                  <div className="absolute inset-1 border border-[#0A0A0A]/30 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-[#0A0A0A] tracking-wider">AC</span>
                  </div>
                </div>
                
                {/* Ash tip */}
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-4 rounded-r-full"
                  style={{
                    background: "linear-gradient(180deg, #9E9E9E 0%, #757575 50%, #616161 100%)",
                  }}
                  initial={{ width: "1rem" }}
                  animate={{ width: ["1rem", "1.25rem", "1rem"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Ember glow */}
              <motion.div
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-6 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, #FF6B35 0%, #FF4500 50%, transparent 100%)",
                }}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{
                  opacity: [0.8, 1, 0.6, 1, 0.8],
                  scale: [1, 1.1, 0.95, 1.05, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Smoke wisps */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    right: "-10px",
                    top: "50%",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                  }}
                  initial={{ x: 0, y: -10 - i * 5, opacity: 0, scale: 0.5 }}
                  animate={{
                    x: [0, 20 + i * 10, 40 + i * 15],
                    y: [-10 - i * 5, -30 - i * 10, -60 - i * 15],
                    opacity: [0, 0.4, 0],
                    scale: [0.5, 1.5, 3],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Brand text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 
                className="text-2xl font-serif tracking-[0.3em] bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ATTAIE
              </h2>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-2">
                Crafting Excellence
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: minDuration / 1000, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
