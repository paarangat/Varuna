import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCw, Maximize, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types for ports and routes
interface Port {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

interface RouteData {
  distance: number;
  duration: string;
}

interface GlobeProps {
  sourcePort: Port | null;
  destinationPort: Port | null;
  onRouteCreated?: (routeData: RouteData) => void;
}

export default function SimplifiedGlobe({ sourcePort, destinationPort, onRouteCreated }: GlobeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);

  // Initialize the globe
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate center and radius
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Load and draw Earth texture
      const earthImage = new Image();
      earthImage.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Earthmap1000x500compac.jpg/1024px-Earthmap1000x500compac.jpg';
      
      // Create pattern for earth texture
      const pattern = ctx.createPattern(earthImage, 'repeat');
      if (pattern) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Draw the textured globe
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = pattern;
        ctx.fill();
        
        // Draw grid lines
        drawGrid(ctx, radius);
        
        // Draw major cities
        const cities = [
          { name: 'New York', lat: 40.7128, lng: -74.0060 },
          { name: 'London', lat: 51.5074, lng: -0.1278 },
          { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
          { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
          { name: 'Dubai', lat: 25.2048, lng: 55.2708 }
        ];
        
        cities.forEach(city => {
          const phi = (90 - city.lat) * (Math.PI / 180);
          const theta = (city.lng + 180) * (Math.PI / 180);
          
          const x = -radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFDD00';
          ctx.fill();
          
          ctx.font = '10px Arial';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'left';
          ctx.fillText(city.name, x + 5, y + 5);
        });
        
        ctx.restore();
      }
      
      // End transformation for the rotating globe
      ctx.restore();
      
      // Draw markers for ports if available
      if (sourcePort) {
        drawPortMarker(ctx, centerX, centerY, radius, sourcePort, 'red');
      }
      
      if (destinationPort) {
        drawPortMarker(ctx, centerX, centerY, radius, destinationPort, 'green');
      }
      
      // Draw route between ports if both are selected
      if (sourcePort && destinationPort) {
        drawRoute(ctx, centerX, centerY, radius, sourcePort, destinationPort);
        
        // Calculate and send route data if not already done
        if (onRouteCreated) {
          calculateRouteData(sourcePort, destinationPort, onRouteCreated);
        }
      }
      
      // Increment rotation for animation
      setRotation(prev => (prev + 0.005) % (Math.PI * 2));
      
      // Continue animation
      requestIdRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestIdRef.current = requestAnimationFrame(animate);
    
    // Cleanup on unmount
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [sourcePort, destinationPort, rotation, onRouteCreated]);

  

  const drawGrid = (ctx: CanvasRenderingContext2D, radius: number) => {
    // Draw latitude lines
    for (let i = -80; i <= 80; i += 20) {
      const y = radius * Math.sin((i * Math.PI) / 180);
      const r = radius * Math.cos((i * Math.PI) / 180);
      
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
    }
    
    // Draw longitude lines
    for (let i = 0; i < 360; i += 20) {
      const angle = (i * Math.PI) / 180;
      
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.bezierCurveTo(
        radius * Math.sin(angle), -radius * 0.5,
        radius * Math.sin(angle), radius * 0.5,
        0, radius
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
    }
  };

  const drawPortMarker = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    radius: number, 
    port: Port, 
    color: string
  ) => {
    // Convert lat/long to canvas position
    const lat = port.lat * (Math.PI / 180);
    const lng = port.lng * (Math.PI / 180) + rotation;
    
    const x = centerX + radius * Math.cos(lat) * Math.sin(lng);
    const y = centerY - radius * Math.sin(lat);
    
    // Draw marker
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw label
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(port.name, x, y - 10);
  };

  const drawRoute = (
    ctx: CanvasRenderingContext2D, 
    centerX: number, 
    centerY: number, 
    radius: number, 
    sourcePort: Port, 
    destinationPort: Port
  ) => {
    // Convert lat/long to canvas position
    const sourceLat = sourcePort.lat * (Math.PI / 180);
    const sourceLng = sourcePort.lng * (Math.PI / 180) + rotation;
    const destLat = destinationPort.lat * (Math.PI / 180);
    const destLng = destinationPort.lng * (Math.PI / 180) + rotation;
    
    const x1 = centerX + radius * Math.cos(sourceLat) * Math.sin(sourceLng);
    const y1 = centerY - radius * Math.sin(sourceLat);
    const x2 = centerX + radius * Math.cos(destLat) * Math.sin(destLng);
    const y2 = centerY - radius * Math.sin(destLat);
    
    // Draw route line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    
    // Draw curved line
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const cpX = midX + (midY - centerY) * 0.5;
    const cpY = midY - (midX - centerX) * 0.5;
    
    ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    
    ctx.strokeStyle = '#FFDD00';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw animated dots on the route
    const time = performance.now() / 1000;
    const t = (Math.sin(time * 2) + 1) / 2;
    
    const dotX = x1 + (x2 - x1) * t;
    const dotY = y1 + (y2 - y1) * t;
    
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  };

  const calculateRouteData = (
    sourcePort: Port, 
    destinationPort: Port, 
    callback: (data: RouteData) => void
  ) => {
    // Calculate approximate distance in nautical miles using Haversine formula
    const R = 6371; // Earth's radius in km
    const toRad = (value: number) => value * Math.PI / 180;
    const dLat = toRad(destinationPort.lat - sourcePort.lat);
    const dLon = toRad(destinationPort.lng - sourcePort.lng);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(sourcePort.lat)) * Math.cos(toRad(destinationPort.lat)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = Math.round(R * c * 0.539957); // Convert km to nautical miles

    // Calculate approximate duration (assuming average speed of 15 knots)
    const hours = Math.floor(distance / 15);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    callback({
      distance,
      duration: `${days} days, ${remainingHours} hours`
    });
  };

  const handleReset = () => {
    setRotation(0);
  };

  const toggleFullscreen = () => {
    const container = canvasRef.current?.parentElement;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
      <CardContent className="p-0 relative">
        <div className="globe-container w-full h-[500px]">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD] hover:bg-[#415A77]"
            onClick={handleReset}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD] hover:bg-[#415A77]"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD] hover:bg-[#415A77]"
          >
            <Boxes className="h-4 w-4" />
          </Button>
        </div>
        {sourcePort && destinationPort && (
          <div className="absolute left-4 top-4 bg-[#1B263B] p-3 rounded-md border border-[#415A77] shadow-lg">
            <div className="text-[#E0E1DD] text-sm font-medium mb-1">Route Details</div>
            <div className="text-[#778DA9] text-xs flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              {sourcePort.name}, {sourcePort.country}
            </div>
            <div className="text-[#778DA9] text-xs flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {destinationPort.name}, {destinationPort.country}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}