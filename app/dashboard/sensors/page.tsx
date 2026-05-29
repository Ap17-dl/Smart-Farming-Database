import EntityManager from "@/components/EntityManager";

export default function SensorsPage() {
  return (
    <div className="space-y-6">
      <EntityManager
        entity="sensors"
        title="Sensor Registry"
        fields={[
          { key: "name", label: "Sensor Name" },
          { key: "sensorType", label: "Sensor Type" },
          { key: "unit", label: "Unit" },
          { key: "location", label: "Location" }
        ]}
      />
      <EntityManager
        entity="sensor_data"
        title="Sensor Data"
        fields={[
          { key: "sensorId", label: "Sensor ID" },
          { key: "reading", label: "Reading", type: "number" },
          { key: "recordedAt", label: "Recorded At", type: "date" }
        ]}
      />
    </div>
  );
}
