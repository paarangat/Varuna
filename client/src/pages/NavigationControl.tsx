import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, MapPin, Anchor, Ship } from "lucide-react";

export default function NavigationControl() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-[#E0E1DD] mb-6">Navigation Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Compass className="mr-2 h-5 w-5" /> Course Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold mb-2">325°</div>
              <div className="text-[#778DA9]">Current Heading</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Recommended</div>
                <div className="font-semibold">328°</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Efficiency</div>
                <div className="font-semibold">+3%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" /> Current Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Latitude</div>
                <div className="font-semibold">51° 30′ 26″ N</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Longitude</div>
                <div className="font-semibold">0° 7′ 39″ W</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Speed</div>
                <div className="font-semibold">12.8 knots</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">ETA</div>
                <div className="font-semibold">06:30 UTC</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Anchor className="mr-2 h-5 w-5" /> Depth Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Current Depth</div>
                <div className="font-semibold">125m</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Minimum Safe</div>
                <div className="font-semibold">15m</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Seabed</div>
                <div className="font-semibold">Sandy</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Tides</div>
                <div className="font-semibold">+0.8m</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ship className="mr-2 h-5 w-5" /> Nearby Vessels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between bg-[#1B263B] p-3 rounded">
              <div>
                <div className="font-semibold">Atlantic Carrier</div>
                <div className="text-sm text-[#778DA9]">Cargo, 2.3nm NE</div>
              </div>
              <div className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-500 rounded text-xs">
                Safe
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#1B263B] p-3 rounded">
              <div>
                <div className="font-semibold">Pacific Star</div>
                <div className="text-sm text-[#778DA9]">Tanker, 4.1nm SW</div>
              </div>
              <div className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-500 rounded text-xs">
                Safe
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#1B263B] p-3 rounded">
              <div>
                <div className="font-semibold">Northern Light</div>
                <div className="text-sm text-[#778DA9]">Fishing, 1.7nm W</div>
              </div>
              <div className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-500 rounded text-xs">
                Monitor
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
