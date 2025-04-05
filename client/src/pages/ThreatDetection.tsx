import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Ship, AlertTriangle, Radio, Eye } from "lucide-react";

export default function ThreatDetection() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-[#E0E1DD] mb-6">Threat Detection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Shield className="h-10 w-10 text-green-500 mb-2" />
            <div className="text-xl font-semibold">Threat Level</div>
            <div className="text-2xl font-bold text-green-500 mt-1">Low</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Ship className="h-10 w-10 text-green-500 mb-2" />
            <div className="text-xl font-semibold">Proximity Alerts</div>
            <div className="text-2xl font-bold text-green-500 mt-1">0</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-green-500 mb-2" />
            <div className="text-xl font-semibold">Active Warnings</div>
            <div className="text-2xl font-bold text-green-500 mt-1">0</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Radio className="h-10 w-10 text-green-500 mb-2" />
            <div className="text-xl font-semibold">Radio Signals</div>
            <div className="text-2xl font-bold text-green-500 mt-1">Normal</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" /> Object Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1B263B] rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-500 mb-2">No Threats Detected</div>
                <div className="text-sm text-[#778DA9]">
                  AI-powered object detection is actively scanning <br />
                  for potential threats in surrounding waters
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Detection Range</div>
                <div className="font-semibold">10 nautical miles</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Last Scan</div>
                <div className="font-semibold">2 minutes ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle>Recent Detection Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start p-3 rounded bg-yellow-900 bg-opacity-20">
                <div className="mr-3 text-yellow-500">
                  <Ship className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-[#E0E1DD]">Fishing Vessel</div>
                    <div className="text-xs text-[#778DA9]">2 hours ago</div>
                  </div>
                  <div className="text-xs text-[#778DA9] mt-1">
                    Small fishing vessel detected 2.3nm away. Maintained safe distance.
                    No action required.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start p-3 rounded bg-[#1B263B]">
                <div className="mr-3 text-blue-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-[#E0E1DD]">Large Debris</div>
                    <div className="text-xs text-[#778DA9]">Yesterday</div>
                  </div>
                  <div className="text-xs text-[#778DA9] mt-1">
                    Floating debris detected on route. Course adjustment made
                    to avoid collision. Reported to maritime authorities.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start p-3 rounded bg-[#1B263B]">
                <div className="mr-3 text-blue-400">
                  <Ship className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-[#E0E1DD]">Cargo Vessel</div>
                    <div className="text-xs text-[#778DA9]">3 days ago</div>
                  </div>
                  <div className="text-xs text-[#778DA9] mt-1">
                    Large cargo vessel on crossing path. AIS communication established.
                    Vessels coordinated safe passage.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1B263B] p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="font-semibold">Perimeter Security</span>
              </div>
              <div className="text-sm text-[#778DA9]">
                All access points secured. No unauthorized entry attempts detected.
                Surveillance systems operational.
              </div>
            </div>
            
            <div className="bg-[#1B263B] p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="font-semibold">Communication Security</span>
              </div>
              <div className="text-sm text-[#778DA9]">
                All communications channels encrypted and secure.
                No suspicious transmission activity detected.
              </div>
            </div>
            
            <div className="bg-[#1B263B] p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="font-semibold">Cyber Security</span>
              </div>
              <div className="text-sm text-[#778DA9]">
                Firewall active. No intrusion attempts detected.
                All systems operating with latest security patches.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
