import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Integration } from "@shared/schema";

interface SystemStatusProps {
  integrations: Integration[];
}

const statusColors = {
  online: "bg-success",
  offline: "bg-error",
  warning: "bg-warning",
  error: "bg-error",
};

const statusLabels = {
  online: "Online",
  offline: "Offline",
  warning: "Ritardo",
  error: "Errore",
};

export default function SystemStatus({ integrations }: SystemStatusProps) {
  const defaultSystems = [
    { name: "API Server", status: "online" },
    { name: "Database", status: "online" },
  ];

  const allSystems = [
    ...defaultSystems,
    ...integrations.map(integration => ({
      name: integration.name.charAt(0).toUpperCase() + integration.name.slice(1),
      status: integration.status || "offline"
    }))
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Stato Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allSystems.map((system) => (
          <div key={system.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${
                statusColors[system.status as keyof typeof statusColors] || statusColors.offline
              } rounded-full`}></div>
              <span className="text-sm text-gray-700">{system.name}</span>
            </div>
            <span className={`text-sm font-medium ${
              system.status === "online" ? "text-success" :
              system.status === "warning" ? "text-warning" :
              "text-error"
            }`}>
              {statusLabels[system.status as keyof typeof statusLabels] || system.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
