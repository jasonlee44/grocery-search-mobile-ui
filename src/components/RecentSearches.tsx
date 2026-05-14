import { useAppContext } from '../context/AppContext';
import ScrollFade from './ScrollFade';

export default function RecentSearches() {
  const { state, selectRecentSearch, clearRecentSearches } = useAppContext();

  if (state.recentSearches.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Recent
        </p>
        <button
          onClick={clearRecentSearches}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <ScrollFade>
        {state.recentSearches.map(search => (
          <button
            key={search}
            onClick={() => selectRecentSearch(search)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 font-medium transition-colors"
          >
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {search}
          </button>
        ))}
      </ScrollFade>
    </div>
  );
}
