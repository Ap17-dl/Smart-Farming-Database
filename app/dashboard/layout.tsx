import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

const links = [
  ["Overview", "/dashboard"],
  ["Farmers", "/dashboard/farmers"],
  ["Crops", "/dashboard/crops"],
  ["Sales", "/dashboard/sales"],
  ["Sensors", "/dashboard/sensors"],
  ["Lands", "/dashboard/lands"],
  ["Plantings", "/dashboard/plantings"],
  ["Markets", "/dashboard/markets"]
];

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-6 md:px-8">
      <aside className="card h-fit w-64 p-4">
        <h1 className="text-lg font-bold">Smart Farming</h1>
        <p className="mt-1 text-xs text-slate-500">{user.email}</p>
        <nav className="mt-4 space-y-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </aside>

      <section className="min-w-0 flex-1">{children}</section>
    </main>
  );
}
