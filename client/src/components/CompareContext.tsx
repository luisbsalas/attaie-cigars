import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@shared/schema";

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (product: Product) => {
    if (compareProducts.length >= 4) return;
    if (!compareProducts.find((p) => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
    }
  };

  const removeFromCompare = (productId: number) => {
    setCompareProducts(compareProducts.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
    setIsCompareOpen(false);
  };

  const isInCompare = (productId: number) => {
    return compareProducts.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        setIsCompareOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
