import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
  const user = await currentUser();

  if (user) {
    redirect("/workspace/assessment"); // already signed in → workspace
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn path="/sign-in" />
    </div>
  );
}
