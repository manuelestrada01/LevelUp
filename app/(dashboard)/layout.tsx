import Sidebar from "@/layout/Sidebar";
import Header from "@/layout/Header";

// Mock data — will be replaced by real session/API data
const MOCK_STUDENT = {
  name: "Aurelius",
  level: 24,
  formativeClass: "erudito" as const,
  activeSubject: "rep1" as const,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#031706]">
      {/* Header — full width at top */}
      <Header
        activeSubject={MOCK_STUDENT.activeSubject}
        studentName={MOCK_STUDENT.name}
      />
      {/* Below header: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          studentName={MOCK_STUDENT.name}
          level={MOCK_STUDENT.level}
          formativeClass={MOCK_STUDENT.formativeClass}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
