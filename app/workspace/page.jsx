// app/workspace/assessment/page.tsx
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import AssessmentIntro from "./assessment/AssessmentIntro"
import BrainResults from "./assessment/results/page";

export default async function AssessmentPage() {
  const { userId } = auth();

  if (!userId) {
    return <div className="p-6">Please sign in to access assessments.</div>;
  }

  const supabase = createClient();

  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // ✅ No assessment → show landing page
  if (!assessment) {
    return <AssessmentIntro />;
  }

  // ✅ If assessment exists → show results
  return (
    <BrainResults
      left={assessment.left_score}
      right={assessment.right_score}
    />
  );
}
