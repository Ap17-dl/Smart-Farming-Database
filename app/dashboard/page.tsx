import { getDashboardStats } from "@/lib/entities";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="mt-2 text-sm text-slate-600">
          This overview combines farm operations, productivity indicators, and sales outcomes in one place so you can make
          faster decisions. Use these totals and revenue trends to identify bottlenecks, improve yield, and track business growth.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Object.entries(stats.totals).map(([key, value]) => (
          <article key={key} className="card p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{key}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </article>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold">Total Revenue</h3>
        <p className="mt-2 text-3xl font-bold text-brand-700">INR {stats.totalRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
}
