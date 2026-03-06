import { motion } from "framer-motion";
import { useState } from "react";

interface FlavorNote {
  name: string;
  intensity: number; // 0-100
  color: string;
}

interface FlavorWheelProps {
  notes?: FlavorNote[];
  className?: string;
}

// Caribbean-inspired color palette for petals
const petalColors = [
  "#C5A059", // Gold
  "#2DD4BF", // Teal
  "#E8736F", // Coral
  "#B8A9C9", // Lavender
  "#FFD4B8", // Peach
  "#A8E6CF", // Mint
  "#E0C285", // Light Gold
  "#5EEAD4", // Light Teal
];

const defaultNotes: FlavorNote[] = [
  { name: "Earth", intensity: 85, color: petalColors[0] },
  { name: "Leather", intensity: 70, color: petalColors[1] },
  { name: "Cedar", intensity: 80, color: petalColors[2] },
  { name: "Coffee", intensity: 65, color: petalColors[3] },
  { name: "Chocolate", intensity: 75, color: petalColors[4] },
  { name: "Pepper", intensity: 55, color: petalColors[5] },
  { name: "Cream", intensity: 60, color: petalColors[6] },
  { name: "Nuts", intensity: 50, color: petalColors[7] },
];

// Tobacco leaf-shaped petal SVG path
const createLeafPath = (
  centerX: number,
  centerY: number,
  angle: number,
  length: number,
  width: number
) => {
  // Create a leaf shape pointing outward from center
  const tipX = centerX + length * Math.cos(angle);
  const tipY = centerY + length * Math.sin(angle);
  
  // Control points for the curved leaf shape
  const perpAngle = angle + Math.PI / 2;
  const baseWidth = width * 0.3;
  const midWidth = width;
  
  // Base points (near center)
  const baseLeft = {
    x: centerX + baseWidth * Math.cos(perpAngle),
    y: centerY + baseWidth * Math.sin(perpAngle),
  };
  const baseRight = {
    x: centerX - baseWidth * Math.cos(perpAngle),
    y: centerY - baseWidth * Math.sin(perpAngle),
  };
  
  // Mid curve control points
  const midDistance = length * 0.5;
  const midLeft = {
    x: centerX + midDistance * Math.cos(angle) + midWidth * Math.cos(perpAngle),
    y: centerY + midDistance * Math.sin(angle) + midWidth * Math.sin(perpAngle),
  };
  const midRight = {
    x: centerX + midDistance * Math.cos(angle) - midWidth * Math.cos(perpAngle),
    y: centerY + midDistance * Math.sin(angle) - midWidth * Math.sin(perpAngle),
  };

  return `
    M ${baseLeft.x} ${baseLeft.y}
    Q ${midLeft.x} ${midLeft.y} ${tipX} ${tipY}
    Q ${midRight.x} ${midRight.y} ${baseRight.x} ${baseRight.y}
    Q ${centerX} ${centerY} ${baseLeft.x} ${baseLeft.y}
    Z
  `;
};

export function FlavorWheel({ notes = defaultNotes, className = "" }: FlavorWheelProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const centerX = 150;
  const centerY = 150;
  const minLength = 45;
  const maxLength = 110;
  const baseWidth = 18;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="-20 -20 340 340" className="w-full max-w-[350px] mx-auto overflow-visible">
        {/* Subtle background glow */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(197, 160, 89, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Glow filters for each color */}
          {notes.map((note, index) => (
            <filter key={`glow-${index}`} id={`petalGlow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Background glow circle */}
        <circle cx={centerX} cy={centerY} r={120} fill="url(#centerGlow)" />

        {/* Decorative inner rings */}
        {[30, 50].map((r) => (
          <circle
            key={r}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Tobacco leaf petals */}
        {notes.map((note, index) => {
          const angle = (index / notes.length) * 2 * Math.PI - Math.PI / 2;
          const length = minLength + ((maxLength - minLength) * note.intensity) / 100;
          const width = baseWidth + (note.intensity / 100) * 8;
          const isActive = activeNote === note.name;
          const color = petalColors[index % petalColors.length];
          
          // Label position
          const labelDistance = maxLength + 25;
          const labelX = centerX + labelDistance * Math.cos(angle);
          const labelY = centerY + labelDistance * Math.sin(angle);

          return (
            <g key={note.name}>
              {/* Petal shadow for depth */}
              <motion.path
                d={createLeafPath(centerX + 2, centerY + 2, angle, length, width)}
                fill="rgba(0,0,0,0.3)"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              />
              
              {/* Main petal */}
              <motion.path
                d={createLeafPath(centerX, centerY, angle, length, width)}
                fill={color}
                fillOpacity={isActive ? 0.9 : 0.6}
                stroke={isActive ? "#fff" : color}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 0.8 : 0.3}
                filter={isActive ? `url(#petalGlow-${index})` : undefined}
                onMouseEnter={() => setActiveNote(note.name)}
                onMouseLeave={() => setActiveNote(null)}
                onClick={() => setActiveNote(isActive ? null : note.name)}
                className="cursor-pointer transition-all duration-300"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                whileHover={{ scale: 1.08 }}
                data-testid={`petal-${note.name.toLowerCase()}`}
              />

              {/* Leaf vein detail */}
              <motion.line
                x1={centerX + 15 * Math.cos(angle)}
                y1={centerY + 15 * Math.sin(angle)}
                x2={centerX + (length - 10) * Math.cos(angle)}
                y2={centerY + (length - 10) * Math.sin(angle)}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
              />

              {/* Flavor label */}
              <motion.text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[9px] md:text-[10px] uppercase tracking-wider font-medium transition-all duration-300 ${
                  isActive ? "fill-white" : "fill-white/50"
                }`}
                style={{ 
                  textShadow: isActive ? `0 0 10px ${color}` : "none",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {note.name}
              </motion.text>
            </g>
          );
        })}

        {/* Center circle with logo area */}
        <circle
          cx={centerX}
          cy={centerY}
          r={28}
          fill="#0A0A0A"
          stroke="rgba(197, 160, 89, 0.3)"
          strokeWidth="1"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={22}
          fill="none"
          stroke="rgba(197, 160, 89, 0.2)"
          strokeWidth="1"
        />
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#C5A059] text-[7px] uppercase tracking-[0.2em] font-medium"
        >
          Flavor
        </text>
        <text
          x={centerX}
          y={centerY + 6}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white/40 text-[6px] uppercase tracking-wider"
        >
          Profile
        </text>
      </svg>

      {/* Active note detail card */}
      {activeNote && (
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/95 border rounded-lg px-5 py-3 text-center pointer-events-none z-10 min-w-[140px]"
          style={{ 
            borderColor: `${petalColors[notes.findIndex(n => n.name === activeNote) % petalColors.length]}50`,
            boxShadow: `0 0 20px ${petalColors[notes.findIndex(n => n.name === activeNote) % petalColors.length]}20`,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p 
            className="text-sm font-serif font-medium mb-1"
            style={{ color: petalColors[notes.findIndex(n => n.name === activeNote) % petalColors.length] }}
          >
            {activeNote}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: petalColors[notes.findIndex(n => n.name === activeNote) % petalColors.length] }}
                initial={{ width: 0 }}
                animate={{ width: `${notes.find((n) => n.name === activeNote)?.intensity}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-white/60 text-xs">
              {notes.find((n) => n.name === activeNote)?.intensity}%
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Strength meter component
export function StrengthMeter({ strength, className = "" }: { strength: "Mild" | "Medium" | "Medium-Full" | "Full"; className?: string }) {
  const levels = ["Mild", "Medium", "Medium-Full", "Full"];
  const activeIndex = levels.indexOf(strength);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white/30 text-[10px] uppercase tracking-wider">Strength</span>
        <span className="text-[#C5A059] text-sm font-medium">{strength}</span>
      </div>
      <div className="flex gap-1">
        {levels.map((level, index) => (
          <motion.div
            key={level}
            className="h-2 flex-1 bg-white/10 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`h-full ${index <= activeIndex ? "bg-[#C5A059]" : ""}`}
              initial={{ width: 0 }}
              whileInView={{ width: index <= activeIndex ? "100%" : "0%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Tasting notes card with flip animation
interface TastingNoteCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

export function TastingNoteCard({ icon, title, description, delay = 0 }: TastingNoteCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative h-48 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent border border-white/10 flex flex-col items-center justify-center p-6 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-4xl mb-4">{icon}</span>
          <h4 className="text-white font-serif text-lg">{title}</h4>
          <span className="text-[#C5A059] text-[10px] uppercase tracking-wider mt-2">Tap to learn more</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full bg-[#C5A059] flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-black text-sm text-center leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
