export default function TeacherLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-24 bg-[rgba(160,125,55,0.12)]" />
        <div className="h-7 w-48 bg-[rgba(160,125,55,0.1)]" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-[rgba(160,125,55,0.08)] border border-[rgba(160,125,55,0.12)]" />
        ))}
      </div>
      <div className="h-64 bg-[rgba(160,125,55,0.06)] border border-[rgba(160,125,55,0.1)]" />
    </div>
  );
}
