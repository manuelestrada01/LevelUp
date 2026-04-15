export default function MisionesLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="h-2 w-20 bg-[rgba(160,125,55,0.1)]" />
        <div className="h-9 w-64 bg-[rgba(160,125,55,0.1)]" />
        <div className="h-px w-24 bg-[rgba(160,125,55,0.12)]" />
      </div>
      <div className="h-20 bg-[rgba(160,125,55,0.07)] border border-[rgba(160,125,55,0.1)]" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-[rgba(160,125,55,0.07)] border border-[rgba(160,125,55,0.1)]" />
        ))}
      </div>
      <div className="h-48 bg-[rgba(160,125,55,0.06)] border border-[rgba(160,125,55,0.1)]" />
    </div>
  );
}
