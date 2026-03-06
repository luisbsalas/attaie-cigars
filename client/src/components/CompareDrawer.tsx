import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./CompareContext";
import { Link } from "wouter";

export function CompareDrawer() {
  const { compareProducts, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();

  if (compareProducts.length === 0) return null;

  return (
    <>
      {/* Floating Compare Bar */}
      <AnimatePresence>
        {!isCompareOpen && compareProducts.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0A0A0A] border border-[#C5A059]/40 rounded-full px-4 py-2 flex items-center gap-4 shadow-xl shadow-black/50"
            data-testid="bar-compare"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C5A059]" />
              <span className="text-white text-sm">{compareProducts.length} products</span>
            </div>
            <div className="flex -space-x-2">
              {compareProducts.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] overflow-hidden bg-white/10"
                >
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
              {compareProducts.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-[#C5A059] flex items-center justify-center text-black text-xs font-bold">
                  +{compareProducts.length - 3}
                </div>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              className="bg-[#C5A059] text-black text-xs uppercase tracking-wider hover:bg-[#C5A059]/90"
              data-testid="button-view-compare"
            >
              Compare
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Compare Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
              onClick={() => setIsCompareOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 top-20 md:inset-x-8 md:bottom-8 z-[101] bg-[#0A0A0A] border border-[#C5A059]/30 rounded-2xl overflow-hidden flex flex-col"
              data-testid="modal-compare"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-[#C5A059]" />
                  <h2 className="text-xl font-serif text-white">Compare Cigars</h2>
                  <span className="text-white/40 text-sm">({compareProducts.length}/4)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCompare}
                    className="text-white/50 hover:text-white text-xs"
                    data-testid="button-clear-compare"
                  >
                    Clear All
                  </Button>
                  <button
                    onClick={() => setIsCompareOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    data-testid="button-close-compare"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>

              {/* Compare Grid */}
              <div className="flex-1 overflow-auto p-6">
                <div className={`grid gap-6 ${compareProducts.length === 2 ? 'grid-cols-2' : compareProducts.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="space-y-4">
                      {/* Product Image */}
                      <div className="relative aspect-[4/5] bg-white/5 rounded-lg overflow-hidden group">
                        <Link href={`/product/${product.id}`} onClick={() => setIsCompareOpen(false)}>
                          <img
                            src={product.imageUrl || ""}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                            data-testid={`img-compare-${product.id}`}
                          />
                        </Link>
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-red-500/80 transition-colors"
                          data-testid={`button-remove-compare-${product.id}`}
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div>
                        <h3 className="text-white font-serif text-lg mb-1">{product.name}</h3>
                        <p className="text-[#C5A059] font-medium">${Number(product.price).toFixed(2)}</p>
                      </div>

                      {/* Attributes */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-white/40">Strength</span>
                          <span className="text-white">{product.strength || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-white/40">Origin</span>
                          <span className="text-white">{product.origin || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-white/40">Format</span>
                          <span className="text-white">{product.format || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Category</span>
                          <span className="text-white">{product.category || "-"}</span>
                        </div>
                      </div>

                      {/* View Button */}
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-white/20 text-white"
                      >
                        <Link href={`/product/${product.id}`} onClick={() => setIsCompareOpen(false)} data-testid={`link-compare-details-${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}

                  {/* Empty Slots */}
                  {Array.from({ length: 4 - compareProducts.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-[4/5] border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-white/30"
                    >
                      <Scale className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm">Add product</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
