import { Progress } from "@/components/ui/progress";
import { useShipData } from "@/lib/ShipContext";

export default function ShipHealth() {
  const { health } = useShipData();

  // Determine status color based on percentage
  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="lg:col-span-2 bg-[#0D1B2A] rounded-lg shadow-lg">
      <div className="p-4 border-b border-[#415A77]">
        <h2 className="text-lg font-medium text-[#E0E1DD]">Ship Health</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Engine Health */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-[#E0E1DD]">Engine</span>
            <span className="text-sm text-[#E0E1DD]">{health.engine}%</span>
          </div>
          <Progress 
            className="w-full bg-[#1B263B] h-2.5" 
            indicatorClassName={getStatusColor(health.engine)}
            value={health.engine} 
          />
        </div>
        
        {/* Fuel Status */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-[#E0E1DD]">Fuel</span>
            <span className="text-sm text-[#E0E1DD]">{health.fuel}%</span>
          </div>
          <Progress 
            className="w-full bg-[#1B263B] h-2.5" 
            indicatorClassName={getStatusColor(health.fuel)}
            value={health.fuel} 
          />
        </div>
        
        {/* Hull Weathering */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-[#E0E1DD]">Hull Weathering</span>
            <span className="text-sm text-[#E0E1DD]">{health.hullWeathering}%</span>
          </div>
          <Progress 
            className="w-full bg-[#1B263B] h-2.5" 
            indicatorClassName={getStatusColor(health.hullWeathering)}
            value={health.hullWeathering} 
          />
        </div>
        
        <div className="pt-4 border-t border-[#415A77] mt-6">
          <div className="flex justify-between items-center">
            <span className="text-[#E0E1DD] font-medium">Overall Health</span>
            <span className={`text-2xl font-bold ${getStatusColor(health.overall).replace('bg-', 'text-')}`}>
              {health.overall}%
            </span>
          </div>
          <div className="text-xs text-[#778DA9] mt-1">{health.lastUpdated}</div>
        </div>
      </div>
    </div>
  );
}
