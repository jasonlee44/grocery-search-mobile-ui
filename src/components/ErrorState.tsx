type Props = {
  onRetry: () => void;
};

export default function ErrorState({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-gray-800 font-semibold text-base">Something went wrong</p>
      <p className="text-gray-400 text-sm mt-1 mb-5">
        We couldn't load the results. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-full hover:bg-emerald-600 active:scale-95 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
