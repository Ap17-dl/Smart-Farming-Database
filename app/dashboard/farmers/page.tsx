import EntityManager from "@/components/EntityManager";

export default function FarmersPage() {
  return (
    <EntityManager
      entity="farmers"
      title="Farmer Management"
      enableSearch
      fields={[
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "location", label: "Location" }
      ]}
    />
  );
}
