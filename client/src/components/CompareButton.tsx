import { Scale, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@shared/schema";
import { useCompare } from "./CompareContext";

interface CompareButtonProps {
  product: Product;
  className?: string;
}

export function CompareButton({ product, className = "" }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareProducts } = useCompare();
  const inCompare = isInCompare(product.id);
  const isFull = compareProducts.length >= 4 && !inCompare;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeFromCompare(product.id);
    } else if (!isFull) {
      addToCompare(product);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isFull}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
        inCompare
          ? "bg-[#2DD4BF] text-black"
          : isFull
          ? "bg-white/5 text-white/30 cursor-not-allowed"
          : "bg-white/10 text-white/70 hover:bg-[#C5A059]/20 hover:text-[#C5A059]"
      } ${className}`}
      whileHover={!isFull ? { scale: 1.05 } : undefined}
      whileTap={!isFull ? { scale: 0.95 } : undefined}
      data-testid={`button-compare-${product.id}`}
    >
      {inCompare ? (
        <>
          <Check className="w-3 h-3" />
          <span>Added</span>
        </>
      ) : (
        <>
          <Scale className="w-3 h-3" />
          <span>Compare</span>
        </>
      )}
    </motion.button>
  );
}
