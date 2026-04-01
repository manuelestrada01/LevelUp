export default function CoursesLoading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 rounded bg-[#1a2e1c]" />
        <div className="h-9 w-48 rounded-lg bg-[#1a2e1c]" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-[#1a2e1c]" />
      ))}
    </div>
  );
}
