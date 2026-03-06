import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { MapPin, Leaf, Wind, Sun, Droplets, ChevronLeft, ChevronRight } from "lucide-react";

// =============================================================================
// DOMINICAN REPUBLIC TOBACCO MAP
// =============================================================================

const tobaccoRegions = [
  {
    id: "santiago",
    name: "Santiago",
    description: "The heart of Dominican tobacco. Home to the finest wrapper leaves and most prestigious cigar factories.",
    coords: { x: 35, y: 42 },
    specialty: "Premium Wrapper Leaves",
    climate: "Tropical, 70-80°F year-round"
  },
  {
    id: "cibao",
    name: "Cibao Valley",
    description: "The fertile Cibao Valley produces exceptional filler and binder tobacco with rich, complex flavors.",
    coords: { x: 42, y: 38 },
    specialty: "Filler & Binder Tobacco",
    climate: "Humid subtropical"
  },
  {
    id: "villa-gonzalez",
    name: "Villa González",
    description: "Traditional tobacco farming community known for generations of expertise in tobacco cultivation.",
    coords: { x: 32, y: 45 },
    specialty: "Artisan Farming",
    climate: "Optimal growing conditions"
  },
  {
    id: "tamboril",
    name: "Tamboril",
    description: "Growing region famous for producing tobacco with unique earthy and spicy characteristics.",
    coords: { x: 38, y: 48 },
    specialty: "Spicy Ligero Leaves",
    climate: "Mountain microclimate"
  }
];

export function DominicanRepublicMap({ className = "" }: { className?: string }) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const activeRegion = tobaccoRegions.find(r => r.id === (hoveredRegion || selectedRegion));

  return (
    <section ref={ref} className={`py-20 md:py-32 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#1a6b6b]/10 to-[#0A0A0A]" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#2DD4BF] text-xs tracking-[0.3em] uppercase mb-4 block">Origin Story</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Dominican <span className="italic bg-gradient-to-r from-[#C5A059] to-[#2DD4BF] bg-clip-text text-transparent">Tobacco Regions</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Explore the legendary tobacco-growing regions that give our cigars their distinctive character
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-[4/3] bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
              <svg viewBox="0 0 100 70" className="w-full h-full">
                <defs>
                  <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a6b6b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M15 35 Q20 20 35 18 Q50 15 65 20 Q80 25 85 35 Q88 45 80 52 Q70 60 55 58 Q40 56 30 52 Q20 48 15 40 Q12 38 15 35 Z"
                  fill="url(#mapGradient)"
                  stroke="#2DD4BF"
                  strokeWidth="0.5"
                  className="drop-shadow-lg"
                />

                <text x="5" y="15" fill="#2DD4BF" fontSize="3" opacity="0.5">ATLANTIC OCEAN</text>
                <text x="60" y="65" fill="#2DD4BF" fontSize="3" opacity="0.5">CARIBBEAN SEA</text>

                {tobaccoRegions.map((region, index) => (
                  <motion.g
                    key={region.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${region.name} tobacco region`}
                    data-testid={`button-map-region-${region.id}`}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(region.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedRegion(region.id);
                      }
                    }}
                  >
                    <circle
                      cx={region.coords.x}
                      cy={region.coords.y}
                      r={(hoveredRegion === region.id || selectedRegion === region.id) ? 4 : 3}
                      fill={(hoveredRegion === region.id || selectedRegion === region.id) ? "#C5A059" : "#2DD4BF"}
                      filter={(hoveredRegion === region.id || selectedRegion === region.id) ? "url(#glow)" : ""}
                      className="transition-all duration-300"
                    />
                    {(hoveredRegion === region.id || selectedRegion === region.id) && (
                      <motion.circle
                        cx={region.coords.x}
                        cy={region.coords.y}
                        r="6"
                        fill="none"
                        stroke="#C5A059"
                        strokeWidth="0.5"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.g>
                ))}

                <text x="50" y="55" fill="white" fontSize="4" textAnchor="middle" fontWeight="bold" opacity="0.8">
                  DOMINICAN REPUBLIC
                </text>
              </svg>

              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/40 text-xs">
                <MapPin className="w-3 h-3" />
                <span>Click regions to explore</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {activeRegion ? (
                <motion.div
                  key={activeRegion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 bg-[#111] border border-white/10 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <h3 className="text-2xl font-serif text-white">{activeRegion.name}</h3>
                  </div>

                  <p className="text-white/60 mb-6">{activeRegion.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-4 h-4 text-[#2DD4BF]" />
                        <span className="text-white/40 text-xs uppercase tracking-wider">Specialty</span>
                      </div>
                      <p className="text-white text-sm">{activeRegion.specialty}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-4 h-4 text-[#C5A059]" />
                        <span className="text-white/40 text-xs uppercase tracking-wider">Climate</span>
                      </div>
                      <p className="text-white text-sm">{activeRegion.climate}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 bg-[#111]/50 border border-dashed border-white/10 rounded-2xl text-center"
                >
                  <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">Select a region on the map to learn more about our tobacco sources</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Tobacco region selection">
              {tobaccoRegions.map(region => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  aria-pressed={selectedRegion === region.id}
                  data-testid={`button-region-${region.id}`}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedRegion === region.id
                      ? 'bg-[#C5A059] text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// BEFORE/AFTER TRANSFORMATION SLIDER
// =============================================================================

export function TransformationSlider({ 
  className = "",
  beforeImage = "https://images.unsplash.com/photo-1589750602846-60028879da9b?w=800",
  afterImage = "https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=800"
}: { 
  className?: string;
  beforeImage?: string;
  afterImage?: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <section ref={ref} className={`py-20 md:py-32 relative ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#2DD4BF] text-xs tracking-[0.3em] uppercase mb-4 block">The Journey</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            From <span className="text-[#A8E6CF]">Leaf</span> to <span className="text-[#C5A059]">Legend</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Drag the slider to see the transformation from raw tobacco leaf to hand-rolled perfection
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize select-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          role="slider"
          aria-label="Before and after transformation comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPosition)}
          tabIndex={0}
          data-testid="slider-transformation"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              setSliderPosition(Math.max(0, sliderPosition - 5));
            } else if (e.key === 'ArrowRight') {
              setSliderPosition(Math.min(100, sliderPosition + 5));
            }
          }}
        >
          <div className="absolute inset-0">
            <img 
              src={afterImage}
              alt="Finished cigar"
              className="w-full h-full object-cover"
            />
          </div>

          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img 
              src={beforeImage}
              alt="Tobacco leaf"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                maxWidth: 'none'
              }}
            />
          </div>

          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
              <div className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
            <span className="text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Leaf className="w-3 h-3 text-[#A8E6CF]" />
              Raw Tobacco
            </span>
          </div>

          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
            <span className="text-white text-xs uppercase tracking-wider flex items-center gap-2">
              Premium Cigar
              <span className="text-[#C5A059]">✦</span>
            </span>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Leaf, label: "Hand-Selected", value: "Premium Leaves", color: "#A8E6CF" },
            { icon: Wind, label: "Aged", value: "5+ Years", color: "#C5A059" },
            { icon: Sun, label: "Rolled By", value: "Master Artisans", color: "#E8736F" }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="p-4 bg-[#111] border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.color }} />
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-white font-medium">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// CIGAR ANATOMY DIAGRAM
// =============================================================================

const cigarLayers = [
  {
    id: "wrapper",
    name: "Wrapper",
    nameEs: "Capa",
    description: "The outermost leaf that gives the cigar its appearance and contributes significantly to flavor. Our wrappers are aged Connecticut Shade or rich Maduro.",
    color: "#8B4513",
    percentage: 60,
    position: 0
  },
  {
    id: "binder",
    name: "Binder",
    nameEs: "Capote", 
    description: "Holds the filler together and helps the cigar burn evenly. We use carefully selected Dominican binder leaves.",
    color: "#A0522D",
    percentage: 25,
    position: 1
  },
  {
    id: "filler",
    name: "Filler",
    nameEs: "Tripa",
    description: "The heart of the cigar, comprised of a blend of different tobacco leaves that create the cigar's unique flavor profile.",
    color: "#654321",
    percentage: 15,
    position: 2
  }
];

export function CigarAnatomyDiagram({ className = "" }: { className?: string }) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const hoveredLayer = cigarLayers.find(l => l.id === activeLayer);

  return (
    <section ref={ref} className={`py-20 md:py-32 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B4513]/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-4 block">Anatomy</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Layers of <span className="italic bg-gradient-to-r from-[#C5A059] to-[#8B4513] bg-clip-text text-transparent">Perfection</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Every premium cigar is composed of three essential layers, each contributing to the final experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative flex items-center justify-center h-80"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <svg viewBox="0 0 300 120" className="w-full max-w-md">
              <defs>
                {cigarLayers.map(layer => (
                  <linearGradient key={layer.id} id={`${layer.id}Gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={layer.color} stopOpacity="1" />
                    <stop offset="50%" stopColor={layer.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={layer.color} stopOpacity="0.7" />
                  </linearGradient>
                ))}
                <filter id="cigarShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
                </filter>
              </defs>

              <motion.g
                animate={{ y: isExploded ? -25 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.rect
                  x="20" y="30" width="260" height="15" rx="7.5"
                  fill={`url(#wrapperGradient)`}
                  filter="url(#cigarShadow)"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveLayer("wrapper")}
                  onMouseLeave={() => setActiveLayer(null)}
                  animate={{ 
                    opacity: activeLayer && activeLayer !== "wrapper" ? 0.4 : 1,
                    scale: activeLayer === "wrapper" ? 1.02 : 1
                  }}
                />
                <ellipse cx="280" cy="37.5" rx="8" ry="7.5" fill="#8B4513" filter="url(#cigarShadow)" />
                <ellipse cx="20" cy="37.5" rx="8" ry="7.5" fill="#654321" />
              </motion.g>

              <motion.g
                animate={{ y: isExploded ? 0 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.rect
                  x="30" y="52" width="240" height="12" rx="6"
                  fill={`url(#binderGradient)`}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveLayer("binder")}
                  onMouseLeave={() => setActiveLayer(null)}
                  animate={{ 
                    opacity: activeLayer && activeLayer !== "binder" ? 0.4 : 1,
                    scale: activeLayer === "binder" ? 1.02 : 1,
                    y: isExploded ? 5 : 0
                  }}
                />
              </motion.g>

              <motion.g
                animate={{ y: isExploded ? 25 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.rect
                  x="40" y="70" width="220" height="10" rx="5"
                  fill={`url(#fillerGradient)`}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveLayer("filler")}
                  onMouseLeave={() => setActiveLayer(null)}
                  animate={{ 
                    opacity: activeLayer && activeLayer !== "filler" ? 0.4 : 1,
                    scale: activeLayer === "filler" ? 1.02 : 1
                  }}
                />
              </motion.g>

              {!isExploded && (
                <>
                  <line x1="50" y1="37" x2="50" y2="15" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="52" y="12" fill="#C5A059" fontSize="6" opacity="0.8">Wrapper</text>
                  
                  <line x1="150" y1="58" x2="150" y2="95" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="140" y="102" fill="#C5A059" fontSize="6" opacity="0.8">Binder</text>
                  
                  <line x1="250" y1="75" x2="250" y2="105" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="245" y="112" fill="#C5A059" fontSize="6" opacity="0.8">Filler</text>
                </>
              )}
            </svg>

            <button
              onClick={() => setIsExploded(!isExploded)}
              aria-pressed={isExploded}
              data-testid="button-explode-view"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm hover:bg-white/10 transition-colors"
            >
              {isExploded ? "Assemble" : "Explode View"}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {hoveredLayer ? (
                <motion.div
                  key={hoveredLayer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: `${hoveredLayer.color}20` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full"
                      style={{ backgroundColor: hoveredLayer.color }}
                    />
                    <div>
                      <h3 className="text-2xl font-serif text-white">{hoveredLayer.name}</h3>
                      <p className="text-white/40 text-sm italic">{hoveredLayer.nameEs}</p>
                    </div>
                  </div>
                  <p className="text-white/70 mb-4">{hoveredLayer.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-sm">Flavor Contribution:</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: hoveredLayer.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${hoveredLayer.percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-white font-bebas">{hoveredLayer.percentage}%</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {cigarLayers.map((layer, i) => (
                    <motion.div
                      key={layer.id}
                      className="p-4 bg-[#111] border border-white/10 rounded-lg flex items-center gap-4 cursor-pointer hover:border-[#C5A059]/30 transition-colors"
                      onMouseEnter={() => setActiveLayer(layer.id)}
                      onMouseLeave={() => setActiveLayer(null)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{layer.name}</h4>
                        <p className="text-white/40 text-sm">{layer.nameEs}</p>
                      </div>
                      <span className="text-[#C5A059] font-bebas text-xl">{layer.percentage}%</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
