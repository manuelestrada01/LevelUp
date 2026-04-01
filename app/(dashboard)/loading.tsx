export default function DashboardLoading() {
  return (
    <div className="w-full px-8 pt-8 pb-6 flex flex-col gap-6 animate-pulse">
      {/* HeroSection skeleton */}
      <div className="h-40 rounded-2xl bg-[#1a2e1c]" />

      {/* XP + Strikes row */}
      <div className="grid grid-cols-[3fr_1fr] gap-4">
        <div className="h-32 rounded-xl bg-[#1a2e1c]" />
        <div className="h-32 rounded-xl bg-[#1a2e1c]" />
      </div>

      {/* Activity + Talents row */}
      <div className="grid grid-cols-[2fr_3fr] gap-4">
        <div className="h-56 rounded-xl bg-[#1a2e1c]" />
        <div className="h-56 rounded-xl bg-[#1a2e1c]" />
      </div>

      {/* Classes section */}
      <div className="flex flex-col gap-3">
        <div className="h-6 w-48 rounded bg-[#1a2e1c]" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-[#1a2e1c]" />
          ))}
        </div>
      </div>
    </div>
  );
}
