import { AlertCircle, AlertTriangle } from "lucide-react";
import { useShipData } from "@/lib/ShipContext";

export default function AlertsCard() {
  const { alerts } = useShipData();

  // Get icon based on type
  const getAlertIcon = (type: string, icon: string) => {
    if (type === "danger") {
      return <AlertCircle className="text-red-500" />;
    }
    if (type === "warning") {
      return <AlertTriangle className="text-yellow-500" />;
    }
    return <AlertCircle className="text-red-500" />;
  };

  // Get background based on type
  const getAlertBackground = (type: string) => {
    if (type === "danger") {
      return "bg-red-900 bg-opacity-20";
    }
    if (type === "warning") {
      return "bg-yellow-900 bg-opacity-20";
    }
    return "bg-red-900 bg-opacity-20";
  };

  return (
    <div className="bg-[#0D1B2A] rounded-lg shadow-lg p-4 md:col-span-2">
      <h3 className="text-lg font-medium text-[#E0E1DD] mb-4">Recent Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`flex items-start p-2 rounded ${getAlertBackground(alert.type)}`}
          >
            <div className="mr-3">
              {getAlertIcon(alert.type, alert.icon)}
            </div>
            <div>
              <div className="text-sm font-medium text-[#E0E1DD]">{alert.title}</div>
              <div className="text-xs text-[#778DA9]">{alert.location} - {alert.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
