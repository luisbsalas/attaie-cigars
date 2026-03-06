import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = query.trim()
    ? products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.strength?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        aria-label="Search products"
        data-testid="button-search-open"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[101]"
            >
              <div className="bg-[#0A0A0A] border border-[#C5A059]/30 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-4 p-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-[#C5A059]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search cigars by name, strength, or description..."
                    className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-lg"
                    data-testid="input-search"
                  />
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    data-testid="button-search-close"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>

                {query.trim() && (
                  <div className="max-h-96 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <div className="p-2">
                        {filteredProducts.map((product) => (
                          <a
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="flex items-center gap-4 p-3 rounded-lg hover-elevate transition-colors group"
                            onClick={handleClose}
                            data-testid={`link-search-result-${product.id}`}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#C5A059]/20 to-transparent" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium group-hover:text-[#C5A059] transition-colors truncate">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-white/40">
                                {product.strength && (
                                  <span className="px-2 py-0.5 rounded bg-white/10">
                                    {product.strength}
                                  </span>
                                )}
                                <span>${product.price}</span>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-white/40 text-sm">No cigars found matching "{query}"</p>
                        <a
                          href="/catalog"
                          className="inline-block mt-4 text-[#C5A059] text-sm hover:underline"
                          onClick={handleClose}
                        >
                          Browse all cigars
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {!query.trim() && (
                  <div className="p-6 text-center">
                    <p className="text-white/40 text-sm mb-4">Start typing to search our collection</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Mild", "Medium", "Full"].map((strength) => (
                        <button
                          key={strength}
                          onClick={() => setQuery(strength)}
                          className="px-3 py-1.5 text-xs text-white/60 border border-white/20 rounded-full hover:border-[#C5A059]/50 hover:text-[#C5A059] transition-colors"
                          data-testid={`button-search-suggestion-${strength.toLowerCase()}`}
                        >
                          {strength} Strength
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
