import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AppState, SearchFilters, Product } from '../types';
import { searchProducts } from '../data/mockSearch';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { track } from '../utils/analytics';

type Action =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTER'; payload: SearchFilters }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR' }
  | { type: 'RESET' }
  | { type: 'ADD_RECENT_SEARCH'; payload: string }
  | { type: 'CLEAR_RECENT_SEARCHES' };

const initialState: AppState = {
  query: '',
  results: [],
  status: 'idle',
  filters: {},
  recentSearches: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'FETCH_START':
      return { ...state, status: 'loading', results: [] };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'success', results: action.payload };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', results: [] };
    case 'RESET':
      return { ...state, status: 'idle', results: [] };
    case 'ADD_RECENT_SEARCH': {
      const updated = [
        action.payload,
        ...state.recentSearches.filter(s => s !== action.payload),
      ].slice(0, 8);
      return { ...state, recentSearches: updated };
    }
    case 'CLEAR_RECENT_SEARCHES':
      return { ...state, recentSearches: [] };
    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  setQuery: (query: string) => void;
  setFilter: (filters: SearchFilters) => void;
  clearRecentSearches: () => void;
  selectRecentSearch: (query: string) => void;
  retrySearch: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [storedSearches, setStoredSearches] = useLocalStorage<string[]>('recentSearches', []);

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    recentSearches: storedSearches,
  });

  const debouncedQuery = useDebounce(state.query, 300);

  const hasActiveFilters = Object.values(state.filters).some(Boolean);

  // Run search whenever debounced query or filters change
  useEffect(() => {
    if (!debouncedQuery.trim() && !hasActiveFilters) {
      dispatch({ type: 'RESET' });
      return;
    }

    let cancelled = false;

    dispatch({ type: 'FETCH_START' });

    searchProducts(debouncedQuery, state.filters)
      .then(results => {
        if (cancelled) return;
        dispatch({ type: 'FETCH_SUCCESS', payload: results });
        if (debouncedQuery.trim()) {
          dispatch({ type: 'ADD_RECENT_SEARCH', payload: debouncedQuery.trim() });
          track('search_submitted', { query: debouncedQuery, resultCount: results.length });
        }
      })
      .catch(() => {
        if (cancelled) return;
        dispatch({ type: 'FETCH_ERROR' });
      });

    return () => { cancelled = true; };
  }, [debouncedQuery, state.filters, hasActiveFilters]);

  // Keep localStorage in sync with recentSearches
  useEffect(() => {
    setStoredSearches(state.recentSearches);
  }, [state.recentSearches]);

  const setQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, []);

  const setFilter = useCallback((filters: SearchFilters) => {
    dispatch({ type: 'SET_FILTER', payload: filters });
    const [filterType, filterValue] = Object.entries(filters)[0] ?? [];
    if (filterType && filterValue != null) {
      track('filter_applied', { filterType, filterValue: String(filterValue) });
    }
  }, []);

  const clearRecentSearches = useCallback(() => {
    dispatch({ type: 'CLEAR_RECENT_SEARCHES' });
  }, []);

  const selectRecentSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, []);

  const retrySearch = useCallback(() => {
    dispatch({ type: 'FETCH_START' });
    searchProducts(debouncedQuery, state.filters)
      .then(results => {
        dispatch({ type: 'FETCH_SUCCESS', payload: results });
      })
      .catch(() => {
        dispatch({ type: 'FETCH_ERROR' });
      });
  }, [debouncedQuery, state.filters]);

  return (
    <AppContext.Provider value={{ state, setQuery, setFilter, clearRecentSearches, selectRecentSearch, retrySearch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
