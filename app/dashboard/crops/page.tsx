import EntityManager from "@/components/EntityManager";

export default function CropsPage() {
  return (
    <EntityManager
      entity="crops"
      title="Crop Management"
      fields={[
        { key: "name", label: "Crop Name" },
        { key: "season", label: "Season" },
        { key: "variety", label: "Variety" }
      ]}
    />
  );
}
