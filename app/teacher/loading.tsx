export default function TeacherLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[#1a2e1c]" />
        ))}
      </div>
      {/* Content */}
      <div className="h-64 rounded-xl bg-[#1a2e1c]" />
    </div>
  );
}
