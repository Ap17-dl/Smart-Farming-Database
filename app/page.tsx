import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <section className="card p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Smart Farming</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">Farm operations, sales, and sensors in one dashboard</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Manage farmers, crops, land records, planting cycles, market sales, and IoT sensor data with Supabase PostgreSQL.
        </p>
        <div className="mt-8 flex gap-3">
          {user ? (
            <Link href="/dashboard" className="btn">
              Open Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn">
              Sign In
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
