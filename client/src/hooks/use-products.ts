import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Product } from "@shared/schema";

export function useProducts(filters?: { category?: string; featured?: boolean }) {
  const queryParams: Record<string, string> = {};
  
  if (filters?.category) {
    queryParams.category = filters.category;
  }
  if (filters?.featured !== undefined) {
    queryParams.featured = String(filters.featured);
  }

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${api.products.list.path}${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: [api.products.list.path, filters],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
  });
}
