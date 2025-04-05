import ShipVisualization from "@/components/dashboard/ShipVisualization";
import ShipHealth from "@/components/dashboard/ShipHealth";
import AiInsights from "@/components/dashboard/AiInsights";
import FuelEfficiency from "@/components/dashboard/FuelEfficiency";
import AisRadar from "@/components/dashboard/AisRadar";
import WeatherCard from "@/components/dashboard/WeatherCard";
import AlertsCard from "@/components/dashboard/AlertsCard";

export default function Overview() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-[#E0E1DD] mb-6">Overview</h1>
      
      {/* Ship Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <ShipVisualization />
        <ShipHealth />
      </div>
      
      {/* Status and Radar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* AI Insights and Fuel Efficiency (60%) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AiInsights />
          <FuelEfficiency />
        </div>
        
        {/* AIS Radar (40%) */}
        <AisRadar />
      </div>
      
      {/* Weather & Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <WeatherCard />
        <AlertsCard />
      </div>
    </>
  );
}
