export default function MisionesLoading() {
  return (
    <div className="w-full px-12 py-12 min-h-screen animate-pulse">
      <div className="mb-12">
        <div className="h-3 w-24 bg-[#1e3320] rounded mb-3" />
        <div className="h-12 w-80 bg-[#1e3320] rounded mb-3" />
        <div className="h-4 w-96 bg-[#1e3320] rounded" />
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3">
          <div className="h-6 w-48 bg-[#1e3320] rounded mb-3" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-[#1a2e1c]/80 rounded-lg border-l-2 border-[#8fbc8f]/20" />
          ))}
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="h-44 bg-[#1a2e1c]/60 rounded-lg" />
          <div className="h-36 bg-[#1a2e1c]/40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
