import { useAppContext } from '../context/AppContext';
import { mockProducts } from '../data/mockProducts';
import { useMemo } from 'react';
import ScrollFade from './ScrollFade';

const retailers = [...new Set(mockProducts.map(p => p.retailer))];
const categories = [...new Set(mockProducts.map(p => p.category))];

type FilterGroup = {
  label: string;
  key: 'retailer' | 'category';
  options: string[];
};

const filterGroups: FilterGroup[] = [
  { label: 'Store', key: 'retailer', options: retailers },
  { label: 'Category', key: 'category', options: categories },
];

export default function FilterBar() {
  const { state, setFilter } = useAppContext();

  const activeCount = useMemo(
    () => Object.values(state.filters).filter(Boolean).length,
    [state.filters]
  );

  const handleChipClick = (key: 'retailer' | 'category', value: string) => {
    const current = state.filters[key];
    setFilter({ [key]: current === value ? undefined : value });
  };

  return (
    <div className="flex flex-col gap-2">
      {activeCount > 0 && (
        <div className="flex justify-end px-1">
          <button
            onClick={() => setFilter({ retailer: undefined, category: undefined })}
            className="text-xs text-emerald-600 font-medium hover:underline"
          >
            Clear filters ({activeCount})
          </button>
        </div>
      )}

      {filterGroups.map(group => (
        <div key={group.key}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 px-1">
            {group.label}
          </p>
          <ScrollFade>
            {group.options.map(option => {
              const active = state.filters[group.key] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleChipClick(group.key, option)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </ScrollFade>
        </div>
      ))}
    </div>
  );
}
