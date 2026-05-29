import EntityManager from "@/components/EntityManager";

export default function SalesPage() {
  return (
    <EntityManager
      entity="sales"
      title="Sales Management"
      fields={[
        { key: "farmerId", label: "Farmer ID" },
        { key: "cropId", label: "Crop ID" },
        { key: "marketId", label: "Market ID" },
        { key: "quantity", label: "Quantity", type: "number" },
        { key: "price", label: "Price", type: "number" },
        { key: "saleDate", label: "Sale Date", type: "date" }
      ]}
    />
  );
}
