import ShipModel from "@/lib/3d/ShipModel";

export default function ShipVisualization() {
  return (
    <div className="lg:col-span-3 bg-[#0D1B2A] rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-[#415A77]">
        <h2 className="text-lg font-medium text-[#E0E1DD]">Vessel Visualization</h2>
      </div>
      <div className="p-4 h-[300px]">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <ShipModel />
          <div className="text-xs text-center absolute bottom-2 left-0 right-0 text-[#E0E1DD] opacity-70">
            Click and drag to rotate • Scroll to zoom
          </div>
        </div>
      </div>
    </div>
  );
}
