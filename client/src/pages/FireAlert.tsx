import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Thermometer, Wind, Droplets } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function FireAlert() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-[#E0E1DD] mb-6">Fire Alert</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="mr-2 h-5 w-5" /> Engine Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-green-500">Normal</div>
              <div className="text-[#778DA9] mt-1">32°C</div>
              <Progress
                className="w-full bg-[#1B263B] h-2.5 mt-4"
                indicatorClassName="bg-green-500"
                value={32}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="mr-2 h-5 w-5" /> Cargo Hold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-green-500">Normal</div>
              <div className="text-[#778DA9] mt-1">24°C</div>
              <Progress
                className="w-full bg-[#1B263B] h-2.5 mt-4"
                indicatorClassName="bg-green-500"
                value={24}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wind className="mr-2 h-5 w-5" /> Bridge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-green-500">Normal</div>
              <div className="text-[#778DA9] mt-1">21°C</div>
              <Progress
                className="w-full bg-[#1B263B] h-2.5 mt-4"
                indicatorClassName="bg-green-500"
                value={21}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77] mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5" /> Recent Fire Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start p-3 rounded bg-red-900 bg-opacity-20">
              <div className="mr-3 text-red-500">
                <Flame className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-[#E0E1DD]">Engine Room Section A</div>
                  <div className="text-xs text-[#778DA9]">30 mins ago</div>
                </div>
                <div className="text-xs text-[#778DA9] mt-1">
                  Temperature spike detected. Manual inspection conducted.
                  No fire source found. Attributed to sensor calibration issue.
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-3 rounded bg-yellow-900 bg-opacity-20">
              <div className="mr-3 text-yellow-500">
                <Flame className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-[#E0E1DD]">Galley</div>
                  <div className="text-xs text-[#778DA9]">2 days ago</div>
                </div>
                <div className="text-xs text-[#778DA9] mt-1">
                  Smoke detected. Minor cooking incident resolved by crew.
                  No damage reported.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle>Fire Suppression Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#1B263B] p-3 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Water Pump System</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#1B263B] p-3 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>CO2 Suppression</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#1B263B] p-3 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Fire Doors</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#1B263B] p-3 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Alarm Systems</span>
                </div>
                <span className="text-green-500">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle>Fire Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-center">
              <div className="text-3xl font-bold text-green-500">Low Risk</div>
              <div className="text-sm text-[#778DA9] mt-1">Current overall fire risk assessment</div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#E0E1DD]">Engine Room</span>
                  <span className="text-sm text-[#E0E1DD]">12%</span>
                </div>
                <Progress 
                  className="w-full bg-[#1B263B] h-2.5" 
                  indicatorClassName="bg-green-500"
                  value={12} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#E0E1DD]">Cargo Hold</span>
                  <span className="text-sm text-[#E0E1DD]">8%</span>
                </div>
                <Progress 
                  className="w-full bg-[#1B263B] h-2.5" 
                  indicatorClassName="bg-green-500"
                  value={8} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#E0E1DD]">Galley</span>
                  <span className="text-sm text-[#E0E1DD]">15%</span>
                </div>
                <Progress 
                  className="w-full bg-[#1B263B] h-2.5" 
                  indicatorClassName="bg-green-500"
                  value={15} 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#E0E1DD]">Electronics Bay</span>
                  <span className="text-sm text-[#E0E1DD]">10%</span>
                </div>
                <Progress 
                  className="w-full bg-[#1B263B] h-2.5" 
                  indicatorClassName="bg-green-500"
                  value={10} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
