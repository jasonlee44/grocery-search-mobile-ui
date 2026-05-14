import {mockProducts} from "../data/mockProducts";
import type {Product, SearchFilters} from "../types/index";

export async function searchProducts(
    query: string,
    filters: SearchFilters
  ): Promise<Product[]> {
    // fake delay 600–900ms
    await new Promise(res => setTimeout(res, 600 + Math.random() * 300));
  
    // ~10% error rate
    if (Math.random() < 0.1) throw new Error('Failed to fetch products');
  
  const q = query.toLowerCase().trim();

  const sharesStem = (field: string, term: string) => {
    if (field.includes(term)) return true;
    if (term.length < 5) return false;
    const stem = term.slice(0, -1);
    return field.split(/\s+/).some(word => word.startsWith(stem));
  };

  return mockProducts.filter(p => {
    const matchesQuery = !q ||
      sharesStem(p.name.toLowerCase(), q) ||
      sharesStem(p.category.toLowerCase(), q) ||
      sharesStem(p.retailer.toLowerCase(), q);
      const matchesRetailer = !filters.retailer || p.retailer === filters.retailer;
      const matchesCategory = !filters.category || p.category === filters.category;
      const matchesPrice = !filters.maxPrice || p.price <= filters.maxPrice;
      return matchesQuery && matchesRetailer && matchesCategory && matchesPrice;
    });
  }