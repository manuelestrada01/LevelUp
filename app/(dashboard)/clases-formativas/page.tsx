import { auth } from "@/auth";
import { getProfile } from "@/lib/supabase/profiles";
import { getFormativeClasses } from "@/lib/supabase/classes";
import ClasesFormativasView from "@/clases-formativas/components/ClasesFormativasView";

export default async function ClasesFormativasPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const [profile, publishedClasses] = await Promise.all([
    email ? getProfile(email) : null,
    getFormativeClasses(true),
  ]);

  const activeClassSlug = profile?.formative_class ?? "erudito";

  return (
    <div className="px-6 py-8">
      <ClasesFormativasView
        activeClassSlug={activeClassSlug}
        classes={publishedClasses}
      />
    </div>
  );
}
