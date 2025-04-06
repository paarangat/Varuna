import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Ship, 
  AlertTriangle, 
  Radio, 
  Eye, 
  Upload, 
  Radar, 
  SatelliteDish, 
  Phone, 
  Bell, 
  AlertCircle
} from "lucide-react";

// Example detection interface that will be replaced with real ML logic later
interface DetectedObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export default function ThreatDetection() {
  // State for detected ships
  const [detectedShips, setDetectedShips] = useState<DetectedObject[]>([]);
  
  // State for upload preview
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // State for radar blips (ship positions)
  const [radarBlips, setRadarBlips] = useState<{x: number, y: number}[]>([]);
  
  // State for nearby vessels
  const [nearbyVessels, setNearbyVessels] = useState<string[]>([]);
  
  // State for communication status visibility
  const [showCommunicationStatus, setShowCommunicationStatus] = useState(false);
  
  // Reference for the canvas where we'll draw bounding boxes
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        
        // Simulate detection of ships (this would be replaced with real ML model)
        const simulatedDetections: DetectedObject[] = [
          { id: 1, x: 50, y: 50, width: 100, height: 70, label: "Cargo Ship" },
          { id: 2, x: 200, y: 150, width: 80, height: 60, label: "Tanker" },
          { id: 3, x: 300, y: 80, width: 70, height: 50, label: "Fishing Boat" }
        ];
        
        setDetectedShips(simulatedDetections);
        
        // Update radar blips based on detections
        const newBlips = simulatedDetections.map(ship => ({
          x: Math.random() * 200, // Random position for demo
          y: Math.random() * 200  // Random position for demo
        }));
        setRadarBlips(newBlips);
        
        // Update nearby vessels list
        setNearbyVessels(simulatedDetections.map(ship => ship.label));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to draw bounding boxes on canvas (placeholder for ML detection visualization)
  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx && uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw bounding boxes
        detectedShips.forEach(ship => {
          ctx.strokeStyle = '#00ff00'; // Green boxes
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]); // Dotted line
          ctx.strokeRect(ship.x, ship.y, ship.width, ship.height);
          
          // Label
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(ship.x, ship.y - 20, ship.label.length * 8, 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px Arial';
          ctx.fillText(ship.label, ship.x + 5, ship.y - 5);
        });
      };
    }
  };
  
  // Effect to draw bounding boxes when detections or image changes
  useEffect(() => {
    if (detectedShips.length > 0 && uploadedImage) {
      drawBoundingBoxes();
    }
  }, [detectedShips, uploadedImage]);
  
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
            <div className="text-2xl font-bold text-green-500 mt-1">{nearbyVessels.length}</div>
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
        {/* Object Detection Section */}
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" /> Object Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <div className="font-medium mb-1">DETECTED SHIPS = {detectedShips.length}</div>
            </div>
            
            <div className="bg-[#1B263B] rounded-lg p-4 h-64 flex flex-col items-center justify-center relative overflow-hidden">
              {!uploadedImage ? (
                <div className="text-center">
                  <Upload className="h-10 w-10 text-[#778DA9] mx-auto mb-2" />
                  <div className="text-sm text-[#778DA9] mb-4">
                    Upload an image to detect ships
                  </div>
                  <label className="bg-[#415A77] hover:bg-[#506B8C] transition-colors text-white px-4 py-2 rounded cursor-pointer">
                    Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
              ) : (
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain"
                ></canvas>
              )}
            </div>
            
            <div className="mt-4 text-xs text-[#778DA9]">
              * Ships will be detected automatically when an image is uploaded. 
              Dotted bounding boxes will appear around detected vessels.
            </div>
          </CardContent>
        </Card>
        
        {/* Radar Image Section */}
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Radar className="mr-2 h-5 w-5" /> Radar Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1B263B] rounded-lg p-4 h-64 relative">
              {/* Radar Visualization */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-2 border-[#415A77] relative">
                  {/* Radar Lines */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#415A77]/50"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-[#415A77]/50"></div>
                  
                  {/* Center point */}
                  <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  
                  {/* Radar Blips (ship positions) */}
                  {radarBlips.map((blip, index) => (
                    <div 
                      key={index}
                      className="absolute w-2 h-2 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${blip.x}px`, top: `${blip.y}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Detection Range</div>
                <div className="font-semibold">10 nautical miles</div>
              </div>
              <div className="bg-[#1B263B] p-3 rounded">
                <div className="text-sm text-[#778DA9]">Operational Status</div>
                <div className="font-semibold text-green-500">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Nearby Vessels Section */}
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ship className="mr-2 h-5 w-5" /> Nearby Vessels
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nearbyVessels.length > 0 ? (
              <div className="space-y-2">
                {nearbyVessels.map((vessel, index) => (
                  <div key={index} className="bg-[#1B263B] p-3 rounded flex justify-between items-center">
                    <div className="flex items-center">
                      <Ship className="h-4 w-4 mr-2 text-[#778DA9]" />
                      <span>{vessel}</span>
                    </div>
                    <div className="text-xs text-[#778DA9]">
                      {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)}nm
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1B263B] p-4 rounded text-center">
                <div className="text-[#778DA9] mb-2">No vessels detected nearby</div>
                <div className="text-xs text-[#778DA9]">
                  Vessels will appear here when detected in the uploaded image
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Sonar Image + SOS Section */}
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Radio className="mr-2 h-5 w-5" /> Sonar Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1B263B] rounded-lg p-4 h-48 mb-4 flex items-center justify-center">
              {/* Sonar Image Upload Area */}
              <div className="text-center">
                <Radio className="h-10 w-10 text-[#778DA9] mx-auto mb-2" />
                <div className="text-sm text-[#778DA9] mb-2">
                  Upload a sonar image
                </div>
                <label className="bg-[#415A77] hover:bg-[#506B8C] transition-colors text-white px-3 py-1 text-sm rounded cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button 
                variant="destructive" 
                className="w-full h-10 bg-red-700 hover:bg-red-800"
              >
                <AlertCircle className="mr-2 h-4 w-4" /> SOS
              </Button>
              
              <Button 
                variant="default" 
                className="w-full h-10 bg-[#415A77] hover:bg-[#506B8C]"
                onClick={() => setShowCommunicationStatus(!showCommunicationStatus)}
              >
                <Bell className="mr-2 h-4 w-4" /> Request Assistance
              </Button>
            </div>
            
            {/* Communication Status - hidden by default */}
            {showCommunicationStatus && (
              <div className="bg-[#1B263B] p-4 rounded-lg animate-fadeIn">
                <div className="text-base font-medium mb-3">Communication Status</div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <SatelliteDish className="h-4 w-4 mr-2 text-green-500" />
                      <span>Satellite Link</span>
                    </div>
                    <div className="text-green-500 text-sm">Online</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-500" />
                      <span>Naval Support</span>
                    </div>
                    <div className="text-green-500 text-sm">Available</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-[#778DA9] text-sm">Last Check-in</div>
                    <div className="text-[#778DA9] text-sm">3 min ago</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
