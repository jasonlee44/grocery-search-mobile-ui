export type Product = {
    id: string;
    name: string;
    retailer: string;
    price: number;
    size: string;
    image: string;
    category: string;
    }
export type SearchFilters = {
    retailer?: string;
    category?: string;
    maxPrice?: number;
}
export type AppState = {
    query: string;
    results: Product[];
    status: 'idle' | 'loading' | 'success' | 'error';
    filters: SearchFilters;
    recentSearches: string[];
}
