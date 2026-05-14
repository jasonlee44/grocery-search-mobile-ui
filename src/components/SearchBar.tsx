import { useAppContext } from '../context/AppContext';

export default function SearchBar() {
  const { state, setQuery } = useAppContext();

  return (
    <div className="relative flex items-center">
      <svg
        className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
      </svg>

      <input
        type="search"
        value={state.query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search groceries, brands, stores…"
        className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-colors"
      />

      {state.query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-3 w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-gray-500 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
