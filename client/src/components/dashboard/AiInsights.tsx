import { useShipData } from "@/lib/ShipContext";

export default function AiInsights() {
  const { aiModels } = useShipData();

  return (
    <div className="bg-[#0D1B2A] rounded-lg shadow-lg">
      <div className="p-4 border-b border-[#415A77]">
        <h2 className="text-lg font-medium text-[#E0E1DD]">AI Insights</h2>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {aiModels.map((model, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-[#E0E1DD]">{model.name}</span>
              <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-500 rounded text-xs">
                {model.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
