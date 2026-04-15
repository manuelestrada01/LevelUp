export default function CourseDetailLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-3 w-20 bg-[rgba(160,125,55,0.1)]" />
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-72 bg-[rgba(160,125,55,0.1)]" />
          <div className="h-4 w-48 bg-[rgba(160,125,55,0.08)]" />
        </div>
        <div className="h-9 w-36 bg-[rgba(160,125,55,0.08)] border border-[rgba(160,125,55,0.12)]" />
      </div>
      {/* Tab nav */}
      <div className="flex gap-1 border-b border-[rgba(160,125,55,0.18)] pb-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-28 bg-[rgba(160,125,55,0.07)]" />
        ))}
      </div>
      {/* Table */}
      <div className="border border-[rgba(160,125,55,0.15)] overflow-hidden">
        <div className="h-10 bg-[rgba(160,125,55,0.08)]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 border-t border-[rgba(160,125,55,0.08)]" />
        ))}
      </div>
    </div>
  );
}
