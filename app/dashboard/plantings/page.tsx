import EntityManager from "@/components/EntityManager";

export default function PlantingsPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold">Planting Plan and Yield Discipline</h2>
        <p className="mt-2 text-sm text-slate-600">
          Planting data connects farmers, lands, and crops so you can plan cycles accurately, avoid missed windows, and improve
          expected yield. Better planting discipline leads to steadier supply, which directly improves sales predictability.
        </p>
      </div>

      <EntityManager
        entity="plantings"
        title="Planting Schedule"
        fields={[
          { key: "farmerId", label: "Farmer ID" },
          { key: "landId", label: "Land ID" },
          { key: "cropId", label: "Crop ID" },
          { key: "plantedOn", label: "Planted On", type: "date" },
          { key: "expectedHarvestOn", label: "Expected Harvest", type: "date" }
        ]}
      />
    </div>
  );
}
