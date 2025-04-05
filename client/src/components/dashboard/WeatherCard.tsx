import { Cloud } from "lucide-react";
import { useShipData } from "@/lib/ShipContext";

export default function WeatherCard() {
  const { weather } = useShipData();

  return (
    <div className="bg-[#0D1B2A] rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#E0E1DD]">Weather</h3>
        <span className="text-xs text-[#778DA9]">{weather.location}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Cloud className="h-10 w-10 text-[#778DA9]" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#E0E1DD]">{weather.temperature}°C</div>
          <div className="text-sm text-[#778DA9]">Wind: {weather.wind}</div>
          <div className="text-sm text-[#778DA9]">Waves: {weather.waves}</div>
        </div>
      </div>
    </div>
  );
}
