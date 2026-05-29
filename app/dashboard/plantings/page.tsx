import EntityManager from "@/components/EntityManager";

export default function PlantingsPage() {
  return (
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
  );
}
