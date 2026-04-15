export default function CoursesLoading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-16 bg-[rgba(160,125,55,0.12)]" />
        <div className="h-7 w-32 bg-[rgba(160,125,55,0.1)]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-44 bg-[rgba(160,125,55,0.08)] border border-[rgba(160,125,55,0.12)]" />
        ))}
      </div>
    </div>
  );
}
