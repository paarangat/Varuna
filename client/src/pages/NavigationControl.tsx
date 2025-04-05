import { useState } from 'react';
import { Anchor, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimplifiedGlobe from '@/components/navigation/SimplifiedGlobe';
import NavigationMap from '@/components/navigation/NavigationMap';
import ActiveVessels from '@/components/navigation/ActiveVessels';
import CourseCorrection from '@/components/navigation/CourseCorrection';
import PortSelector from '@/components/navigation/PortSelector';

// Import mock data
import { ports, checkpoints, routes, activeVessels, courseData } from '@/lib/mockData';

// Define vessel type to match ActiveVessels component
interface Vessel {
  id: string;
  name: string;
  type: string;
  distance: string;
  direction: string;
  status: 'safe' | 'monitor' | 'warning' | 'danger';
}

// Cast activeVessels to the correct type
const typedActiveVessels = activeVessels as unknown as Vessel[];

export default function NavigationControl() {
  // Use state with proper typing
  const [sourcePort, setSourcePort] = useState<typeof ports[0] | null>(ports[0]);
  const [destinationPort, setDestinationPort] = useState<typeof ports[0] | null>(ports[3]);
  const [routeDetails, setRouteDetails] = useState<{ distance: number; duration: string } | null>(null);

  const handleRouteCreated = (routeData: { distance: number; duration: string }) => {
    setRouteDetails(routeData);
  };

  const handleApplyCorrection = () => {
    alert('Course correction applied. New heading set to: ' + courseData.recommended.heading + '°');
  };

  const handleIgnoreRecommendation = () => {
    alert('Recommendation ignored. Maintaining current heading of: ' + courseData.current.heading + '°');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E0E1DD] flex items-center gap-2">
          <Anchor className="h-6 w-6" /> Navigation Control
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <SimplifiedGlobe 
            sourcePort={sourcePort} 
            destinationPort={destinationPort}
            onRouteCreated={handleRouteCreated}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77] md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Port Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <PortSelector
                  ports={ports}
                  sourcePort={sourcePort}
                  destinationPort={destinationPort}
                  onSourcePortChange={setSourcePort}
                  onDestinationPortChange={setDestinationPort}
                />

                {routeDetails && (
                  <div className="mt-4 p-3 bg-[#1B263B] rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Distance</div>
                        <div className="text-xl font-bold">{routeDetails.distance} <span className="text-sm text-[#778DA9]">nautical miles</span></div>
                      </div>
                      <ArrowRight className="h-6 w-6 text-[#778DA9] mx-2" />
                      <div>
                        <div className="text-sm font-medium">Estimated Time</div>
                        <div className="text-xl font-bold">{routeDetails.duration}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
              <Tabs defaultValue="table" className="w-full">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Vessels</CardTitle>
                    <TabsList className="bg-[#1B263B]">
                      <TabsTrigger value="table" className="data-[state=active]:bg-[#415A77]">
                        List
                      </TabsTrigger>
                      <TabsTrigger value="status" className="data-[state=active]:bg-[#415A77]">
                        Status
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <TabsContent value="table" className="m-0">
                    <ActiveVessels vessels={typedActiveVessels} />
                  </TabsContent>
                  <TabsContent value="status" className="m-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Vessels in Range</span>
                        <span className="font-bold">{typedActiveVessels.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Warning Status</span>
                        <span className="font-bold text-amber-500">
                          {typedActiveVessels.filter(v => v.status === 'warning').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Danger Status</span>
                        <span className="font-bold text-red-500">
                          {typedActiveVessels.filter(v => v.status === 'danger').length}
                        </span>
                      </div>
                      <Button
                        variant="default"
                        className="w-full mt-2 bg-[#415A77] hover:bg-[#1B263B] text-[#E0E1DD]"
                      >
                        Broadcast Notice
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <CourseCorrection 
            courseData={courseData}
            onApplyCorrection={handleApplyCorrection}
            onIgnoreRecommendation={handleIgnoreRecommendation}
          />
          
          <NavigationMap
            checkpoints={checkpoints}
            routes={routes}
          />
        </div>
      </div>
    </div>
  );
}