import { useMemo } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import RecentSearches from './components/RecentSearches';
import ProductCard from './components/ProductCard';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';

function GrocerySearch() {
  const { state, retrySearch } = useAppContext();

  const showFilters = true;

  const resultLabel = useMemo(() => {
    if (state.status !== 'success') return null;
    const count = state.results.length;
    return count === 0 ? null : `${count} result${count !== 1 ? 's' : ''}`;
  }, [state.status, state.results.length]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 pt-5 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            🛒 GrocerySearch
          </h1>
          {resultLabel && (
            <span className="text-xs text-gray-400 font-medium">{resultLabel}</span>
          )}
        </div>

        <SearchBar />

        {state.status === 'idle' && !state.query && (
          <RecentSearches />
        )}

        {showFilters && (
          <FilterBar />
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 py-4">
        {state.status === 'loading' && <LoadingState />}

        {state.status === 'error' && <ErrorState onRetry={retrySearch} />}

        {state.status === 'success' && state.results.length === 0 && (
          <EmptyState query={state.query} />
        )}

        {state.status === 'success' && state.results.length > 0 && (
          <div className="flex flex-col gap-3 px-4">
            {state.results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {state.status === 'idle' && !state.query && (
          <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
            <p className="text-4xl mb-4">🥦</p>
            <p className="text-gray-800 font-semibold">Find the best grocery deals</p>
            <p className="text-gray-400 text-sm mt-1">
              Search across Target, Whole Foods, Costco, and Trader Joe's
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <GrocerySearch />
    </AppProvider>
  );
}
