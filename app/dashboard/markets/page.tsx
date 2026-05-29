import EntityManager from "@/components/EntityManager";

export default function MarketsPage() {
  return (
    <EntityManager
      entity="markets"
      title="Market Directory"
      fields={[
        { key: "marketName", label: "Market Name" },
        { key: "city", label: "City" }
      ]}
    />
  );
}
