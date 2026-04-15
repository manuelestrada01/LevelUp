export default function DashboardLoading() {
  return (
    <div className="w-full px-4 pt-4 pb-6 md:px-8 md:pt-8 flex flex-col gap-4 md:gap-6 animate-pulse">
      <div className="h-40 bg-[rgba(160,125,55,0.07)] border border-[rgba(160,125,55,0.12)]" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_1fr]">
        <div className="h-32 bg-[rgba(160,125,55,0.06)] border border-[rgba(160,125,55,0.1)]" />
        <div className="h-32 bg-[rgba(160,125,55,0.06)] border border-[rgba(160,125,55,0.1)]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-56 bg-[rgba(160,125,55,0.06)] border border-[rgba(160,125,55,0.1)]" />
        ))}
      </div>
    </div>
  );
}
