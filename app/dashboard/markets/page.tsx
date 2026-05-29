import EntityManager from "@/components/EntityManager";

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold">Market Visibility and Sales Growth</h2>
        <p className="mt-2 text-sm text-slate-600">
          Market data shows where produce is being sold and helps compare demand by city. Tracking this consistently improves
          pricing decisions, sales routing, and overall revenue performance.
        </p>
      </div>

      <EntityManager
        entity="markets"
        title="Market Directory"
        fields={[
          { key: "marketName", label: "Market Name" },
          { key: "city", label: "City" }
        ]}
      />
    </div>
  );
}
