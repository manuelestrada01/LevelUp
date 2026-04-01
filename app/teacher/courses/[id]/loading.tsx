export default function CourseDetailLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="h-4 w-20 rounded bg-[#1a2e1c]" />
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-72 rounded bg-[#1a2e1c]" />
          <div className="h-4 w-48 rounded bg-[#1a2e1c]" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-[#1a2e1c]" />
      </div>
      {/* Tab nav */}
      <div className="flex gap-4 border-b border-[#1e3320] pb-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-t bg-[#1a2e1c]" />
        ))}
      </div>
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#1e3320]">
        <div className="h-10 bg-[#1a2e1c]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 border-t border-[#1e3320] bg-[#0d1a0f]" />
        ))}
      </div>
    </div>
  );
}
