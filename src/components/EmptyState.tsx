type Props = {
  query: string;
};

export default function EmptyState({ query }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
      </div>
      <p className="text-gray-800 font-semibold text-base">No results found</p>
      <p className="text-gray-400 text-sm mt-1">
        We couldn't find anything for{' '}
        <span className="font-medium text-gray-600">"{query}"</span>.
        Try a different search or adjust your filters.
      </p>
    </div>
  );
}
