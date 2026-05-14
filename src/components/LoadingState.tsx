function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
      <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-full animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full animate-pulse w-1/3" />
        <div className="h-3 bg-gray-200 rounded-full animate-pulse w-1/4" />
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

export default function LoadingState() {
  return (
    <div className="flex flex-col gap-3 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
