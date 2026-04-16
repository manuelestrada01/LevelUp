export default function LaminasLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12 flex flex-col gap-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-2 w-24 bg-[rgba(160,125,55,0.1)]" />
        <div className="h-9 w-56 bg-[rgba(160,125,55,0.1)]" />
        <div className="h-px w-32 bg-[rgba(160,125,55,0.12)]" />
      </div>

      {/* Summary seals */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-[rgba(160,125,55,0.07)] border border-[rgba(160,125,55,0.1)]"
          />
        ))}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-3">
        <div className="h-px w-6 bg-[rgba(160,125,55,0.15)]" />
        <div className="h-2.5 w-16 bg-[rgba(160,125,55,0.1)]" />
        <div className="h-px flex-1 bg-[rgba(160,125,55,0.12)]" />
      </div>

      {/* Table */}
      <div className="border border-[rgba(160,125,55,0.15)] overflow-hidden">
        {/* Header row */}
        <div className="h-9 border-b border-[rgba(160,125,55,0.1)] bg-[rgba(160,125,55,0.04)]" />
        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`h-14 bg-[rgba(160,125,55,0.04)] ${i !== 5 ? "border-b border-[rgba(160,125,55,0.07)]" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
