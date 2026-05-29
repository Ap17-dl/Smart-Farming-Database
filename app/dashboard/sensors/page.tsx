import EntityManager from "@/components/EntityManager";

export default function SensorsPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold">Sensors and Field Signals</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sensor records help you monitor field conditions in near real time, catch stress early, and improve crop productivity.
          Consistent readings also support better harvest timing and stronger sales outcomes by reducing quality loss.
        </p>
      </div>

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
