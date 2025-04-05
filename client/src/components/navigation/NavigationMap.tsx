import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Navigation, CloudRain } from 'lucide-react';

interface Checkpoint {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  isCurrent?: boolean;
}

interface Route {
  id: string;
  checkpoints: string[];
  color: string;
  isActive: boolean;
  isDashed?: boolean;
}

interface NavigationMapProps {
  checkpoints: Checkpoint[];
  routes: Route[];
}

export default function NavigationMap({ checkpoints, routes }: NavigationMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the map with checkpoints and routes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions matching the container size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawMap();
    };

    // Initial resize
    resizeCanvas();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);

    function drawMap() {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw routes first (so they appear behind checkpoints)
      routes.forEach(route => {
        const routeCheckpoints = route.checkpoints
          .map(id => checkpoints.find(cp => cp.id === id))
          .filter(cp => cp !== undefined) as Checkpoint[];

        if (routeCheckpoints.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 2;
        
        if (route.isDashed) {
          ctx.setLineDash([5, 5]);
        } else {
          ctx.setLineDash([]);
        }

        // Draw path between checkpoints
        ctx.moveTo(
          routeCheckpoints[0].position.x * canvas.width, 
          routeCheckpoints[0].position.y * canvas.height
        );

        for (let i = 1; i < routeCheckpoints.length; i++) {
          ctx.lineTo(
            routeCheckpoints[i].position.x * canvas.width, 
            routeCheckpoints[i].position.y * canvas.height
          );
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw checkpoints
      checkpoints.forEach(checkpoint => {
        // Position is normalized (0-1), so multiply by canvas dimensions
        const x = checkpoint.position.x * canvas.width;
        const y = checkpoint.position.y * canvas.height;
        
        // Draw checkpoint point
        ctx.beginPath();
        ctx.arc(x, y, checkpoint.isCurrent ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = checkpoint.isCurrent ? '#4CAF50' : '#FFC107';
        ctx.fill();
        
        // Draw checkpoint label
        if (checkpoint.name) {
          ctx.font = '12px Arial';
          ctx.fillStyle = '#E0E1DD';
          ctx.textAlign = 'center';
          ctx.fillText(checkpoint.name, x, y - 12);
        }
      });
    }

    // Draw initial map
    drawMap();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [checkpoints, routes]);

  return (
    <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77] h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Map className="w-5 h-5 mr-2" /> Navigation Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="bg-[#1B263B] mb-2">
            <TabsTrigger value="map" className="data-[state=active]:bg-[#415A77]">
              <Navigation className="w-4 h-4 mr-1" /> AIS Data
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-[#415A77]">
              <CloudRain className="w-4 h-4 mr-1" /> Weather
            </TabsTrigger>
            <TabsTrigger value="routes" className="data-[state=active]:bg-[#415A77]">
              <Map className="w-4 h-4 mr-1" /> Routes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="m-0">
            <div className="relative w-full bg-[#1B263B] rounded-md overflow-hidden" style={{ height: '300px' }}>
              <canvas 
                ref={canvasRef} 
                className="w-full h-full" 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="weather" className="m-0">
            <div className="w-full bg-[#1B263B] rounded-md flex items-center justify-center" style={{ height: '300px' }}>
              <div className="text-center text-[#778DA9]">
                <CloudRain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Weather data will be displayed here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="routes" className="m-0">
            <div className="w-full bg-[#1B263B] rounded-md flex items-center justify-center" style={{ height: '300px' }}>
              <div className="text-center text-[#778DA9]">
                <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Alternative routes will be displayed here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}