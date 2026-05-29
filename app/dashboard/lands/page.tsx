import EntityManager from "@/components/EntityManager";

export default function LandsPage() {
  return (
    <EntityManager
      entity="lands"
      title="Land Records"
      fields={[
        { key: "farmerId", label: "Farmer ID" },
        { key: "landName", label: "Land Name" },
        { key: "acreage", label: "Acreage", type: "number" },
        { key: "soilType", label: "Soil Type" }
      ]}
    />
  );
}
