import { Progress } from "@/components/ui/progress";
import { useShipData } from "@/lib/ShipContext";

export default function FuelEfficiency() {
  const { fuelEfficiency } = useShipData();

  return (
    <div className="bg-[#0D1B2A] rounded-lg shadow-lg">
      <div className="p-4 border-b border-[#415A77]">
        <h2 className="text-lg font-medium text-[#E0E1DD]">Fuel Efficiency</h2>
      </div>
      <div className="p-4 flex flex-col items-center justify-center h-[calc(100%-64px)]">
        <div className="text-4xl font-bold text-[#E0E1DD] mb-2">
          {fuelEfficiency.hoursRemaining}
        </div>
        <div className="text-[#778DA9]">Hours Remaining</div>
        <Progress 
          className="w-full bg-[#1B263B] h-2.5 mt-4" 
          indicatorClassName="bg-yellow-500"
          value={fuelEfficiency.percentRemaining} 
        />
        <div className="text-xs text-[#778DA9] mt-2">
          {fuelEfficiency.percentRemaining}% Fuel Remaining
        </div>
      </div>
    </div>
  );
}
