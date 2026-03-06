import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MapPin, Flame, Target, X } from "lucide-react";
import cigarAnatomyImage from "@assets/cigaranatomy_1769133710451.png";

type LayerType = "wrapper" | "binder" | "filler" | null;

const layerData = {
  wrapper: {
    name: "Wrapper",
    color: "#C5A059",
    colorLight: "#E0C285",
    origin: "Ecuador",
    region: "Habano Rosado",
    purpose: "The outermost leaf that defines the cigar's appearance and contributes up to 60% of the flavor profile.",
    characteristics: [
      "Silky, oily texture",
      "Consistent color",
      "Visible veins for character",
    ],
    flavors: ["Cedar", "Leather", "Sweet Spice"],
    strengthContribution: 35,
    description: "Hand-selected from the finest Ecuadorian farms, our wrapper leaves are aged for 18 months to develop their signature golden sheen.",
  },
  binder: {
    name: "Binder",
    color: "#2DD4BF",
    colorLight: "#5EEAD4",
    origin: "Nicaragua",
    region: "Jalapa Valley",
    purpose: "The structural foundation that holds the filler tobacco together and ensures an even burn.",
    characteristics: [
      "Strong tensile strength",
      "Neutral flavor profile",
      "Optimal combustion",
    ],
    flavors: ["Earth", "Cocoa", "Mild Pepper"],
    strengthContribution: 25,
    description: "Sourced from Nicaragua's volcanic soil, our binder leaves provide the perfect balance of structure and subtle flavor enhancement.",
  },
  filler: {
    name: "Filler",
    color: "#E8736F",
    colorLight: "#F59E8A",
    origin: "Dominican Republic",
    region: "Cibao Valley",
    purpose: "The heart of the cigar containing a proprietary blend of long-filler tobaccos that deliver complex flavors.",
    characteristics: [
      "Long-filler leaves",
      "Multi-origin blend",
      "Aged 3+ years",
    ],
    flavors: ["Dark Chocolate", "Coffee", "Dried Fruit", "Black Pepper"],
    strengthContribution: 40,
    description: "Our master blenders combine tobaccos from three regions, each contributing unique notes that evolve throughout your smoke.",
  },
};

export function CigarAnatomy() {
  const [activeLayer, setActiveLayer] = useState<LayerType>(null);
  const [hoveredLayer, setHoveredLayer] = useState<LayerType>(null);

  const handleLayerClick = (layer: LayerType) => {
    setActiveLayer(activeLayer === layer ? null : layer);
  };

  return (
    <section className="snap-section py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] via-[#0D0806] to-[#0A0A0A] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.05)_0%,transparent_60%)]" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#2DD4BF] text-xs tracking-[0.4em] uppercase mb-4 block">
            Explore the Layers
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Cigar <span className="bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent italic">Anatomy</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Click on each layer to discover the craftsmanship behind every Attaie cigar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Interactive Unraveled Cigar */}
          <motion.div
            className="relative flex justify-center items-center min-h-[500px] md:min-h-[600px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Smoke particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/10"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    bottom: "10%",
                  }}
                  animate={{
                    y: [0, -300, -500],
                    x: [0, (Math.random() - 0.5) * 100],
                    opacity: [0, 0.3, 0],
                    scale: [0.5, 1.5, 2],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Cigar Anatomy Image */}
            <div className="relative w-full max-w-lg">
              {/* Cigar anatomy image with background blended out */}
              <div className="relative">
                <img 
                  src={cigarAnatomyImage} 
                  alt="Cigar Anatomy showing Wrapper, Binder, and Filler layers"
                  className="w-full h-auto max-h-[300px] object-contain mx-auto"
                  style={{
                    mixBlendMode: "multiply",
                    filter: "contrast(1.1) saturate(1.2)",
                  }}
                />
              </div>
              
              {/* Interactive circle buttons positioned over each section */}
              <div className="absolute inset-0 pointer-events-none flex items-center">
                {/* Wrapper circle - over left/head section */}
                <button
                  onClick={() => handleLayerClick("wrapper")}
                  onMouseEnter={() => setHoveredLayer("wrapper")}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`absolute pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    activeLayer === "wrapper" || hoveredLayer === "wrapper"
                      ? "border-[#C5A059] bg-[#C5A059]/30 scale-110"
                      : "border-[#C5A059]/60 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 hover:scale-105"
                  }`}
                  style={{
                    top: "50%",
                    left: "18%",
                    transform: "translate(-50%, -50%)",
                  }}
                  data-testid="layer-wrapper"
                  aria-label="Explore Wrapper layer"
                >
                  <span className="text-[10px] md:text-xs font-medium text-[#C5A059] uppercase">W</span>
                </button>
                
                {/* Binder circle - over middle section */}
                <button
                  onClick={() => handleLayerClick("binder")}
                  onMouseEnter={() => setHoveredLayer("binder")}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`absolute pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    activeLayer === "binder" || hoveredLayer === "binder"
                      ? "border-[#2DD4BF] bg-[#2DD4BF]/30 scale-110"
                      : "border-[#2DD4BF]/60 bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 hover:scale-105"
                  }`}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  data-testid="layer-binder"
                  aria-label="Explore Binder layer"
                >
                  <span className="text-[10px] md:text-xs font-medium text-[#2DD4BF] uppercase">B</span>
                </button>
                
                {/* Filler circle - over right/foot section */}
                <button
                  onClick={() => handleLayerClick("filler")}
                  onMouseEnter={() => setHoveredLayer("filler")}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`absolute pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    activeLayer === "filler" || hoveredLayer === "filler"
                      ? "border-[#E8736F] bg-[#E8736F]/30 scale-110"
                      : "border-[#E8736F]/60 bg-[#E8736F]/10 hover:bg-[#E8736F]/20 hover:scale-105"
                  }`}
                  style={{
                    top: "50%",
                    left: "82%",
                    transform: "translate(-50%, -50%)",
                  }}
                  data-testid="layer-filler"
                  aria-label="Explore Filler layer"
                >
                  <span className="text-[10px] md:text-xs font-medium text-[#E8736F] uppercase">F</span>
                </button>
              </div>
              
              {/* Layer indicator pills */}
              <div className="flex justify-center gap-4 mt-6">
                {(["wrapper", "binder", "filler"] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => handleLayerClick(layer)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      activeLayer === layer 
                        ? "bg-white/10 border border-white/20" 
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                    data-testid={`button-layer-${layer}`}
                  >
                    <div 
                      className={`w-2 h-2 rounded-full transition-transform ${
                        activeLayer === layer ? "scale-125" : ""
                      }`}
                      style={{ backgroundColor: layerData[layer].color }}
                    />
                    <span className="text-xs uppercase tracking-wider text-white/70">
                      {layer}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Instruction text */}
              <motion.p
                className="text-white/30 text-sm mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeLayer ? 0 : 1 }}
              >
                Click a layer to explore details
              </motion.p>
            </div>
          </motion.div>

          {/* Detail Panel */}
          <div className="relative min-h-[500px] flex items-center">
            <AnimatePresence mode="wait">
              {activeLayer ? (
                <motion.div
                  key={activeLayer}
                  className="w-full"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div 
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 relative overflow-hidden"
                    style={{
                      borderColor: `${layerData[activeLayer].color}30`,
                    }}
                  >
                    {/* Glow effect - pointer-events-none to prevent click interception */}
                    <div 
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: layerData[activeLayer].color }}
                    />

                    {/* Close button */}
                    <button
                      onClick={() => setActiveLayer(null)}
                      className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-10"
                      data-testid="button-close-detail"
                      aria-label="Close detail panel"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: layerData[activeLayer].color }}
                      />
                      <h3 
                        className="text-3xl font-serif"
                        style={{ color: layerData[activeLayer].color }}
                      >
                        {layerData[activeLayer].name}
                      </h3>
                    </div>

                    {/* Origin */}
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <div>
                        <span className="text-white/60 text-sm">Origin: </span>
                        <span className="text-white font-medium">{layerData[activeLayer].origin}</span>
                        <span className="text-white/40 text-sm ml-2">({layerData[activeLayer].region})</span>
                      </div>
                    </div>

                    {/* Purpose */}
                    <div className="flex items-start gap-3 mb-6">
                      <Target className="w-4 h-4 text-white/40 mt-1 flex-shrink-0" />
                      <p className="text-white/70 leading-relaxed">
                        {layerData[activeLayer].purpose}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-white/50 text-sm mb-8 italic">
                      {layerData[activeLayer].description}
                    </p>

                    {/* Flavor Tags */}
                    <div className="mb-8">
                      <h4 className="text-xs uppercase tracking-wider text-white/40 mb-3">Flavor Notes</h4>
                      <div className="flex flex-wrap gap-2">
                        {layerData[activeLayer].flavors.map((flavor) => (
                          <span
                            key={flavor}
                            className="px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${layerData[activeLayer].color}20`,
                              color: layerData[activeLayer].color,
                              border: `1px solid ${layerData[activeLayer].color}40`,
                            }}
                          >
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Characteristics */}
                    <div className="mb-8">
                      <h4 className="text-xs uppercase tracking-wider text-white/40 mb-3">Characteristics</h4>
                      <ul className="space-y-2">
                        {layerData[activeLayer].characteristics.map((char) => (
                          <li key={char} className="flex items-center gap-2 text-white/60 text-sm">
                            <div 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: layerData[activeLayer].color }}
                            />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strength Meter */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-white/40" />
                          <h4 className="text-xs uppercase tracking-wider text-white/40">Strength Contribution</h4>
                        </div>
                        <span 
                          className="text-sm font-bold"
                          style={{ color: layerData[activeLayer].color }}
                        >
                          {layerData[activeLayer].strengthContribution}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: layerData[activeLayer].color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${layerData[activeLayer].strengthContribution}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center py-12">
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                      Discover Each Layer
                    </h3>
                    <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                      Every Attaie cigar is crafted from three essential layers. Each contributes unique flavors, textures, and characteristics to create our signature smoking experience.
                    </p>
                    
                    {/* Quick overview cards */}
                    <div className="grid grid-cols-3 gap-4 mt-10">
                      {(["wrapper", "binder", "filler"] as const).map((layer) => (
                        <button
                          key={layer}
                          onClick={() => handleLayerClick(layer)}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                          data-testid={`button-quick-${layer}`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full mx-auto mb-3 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: layerData[layer].color }}
                          />
                          <span className="text-white/60 text-xs uppercase tracking-wider group-hover:text-white transition-colors">
                            {layer}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
