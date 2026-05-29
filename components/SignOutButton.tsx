import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default function SignOutButton() {
  async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <form action={signOut}>
      <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium" type="submit">
        Sign Out
      </button>
    </form>
  );
}
