import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Navigation, CloudRain, Anchor, Clock } from 'lucide-react';

interface Checkpoint {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  isCurrent?: boolean;
  eta?: string;   // Estimated Time of Arrival
  status?: 'pending' | 'current' | 'completed';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: React.ReactNode;
    x: number;
    y: number;
  }>({
    visible: false,
    content: null,
    x: 0,
    y: 0
  });

  // Get color based on checkpoint status
  const getCheckpointColor = (checkpoint: Checkpoint) => {
    if (checkpoint.isCurrent) return '#4CAF50';
    
    if (checkpoint.status === 'completed') return '#4CAF50';
    if (checkpoint.status === 'current') return '#4CAF50';
    
    // Default or pending
    return '#FFC107';
  };

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

      // Draw background grid
      drawGrid(ctx, canvas);
      
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
      checkpoints.forEach((checkpoint, index) => {
        // Position is normalized (0-1), so multiply by canvas dimensions
        const x = checkpoint.position.x * canvas.width;
        const y = checkpoint.position.y * canvas.height;
        
        // Draw checkpoint circle
        ctx.beginPath();
        ctx.arc(x, y, checkpoint.isCurrent ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = getCheckpointColor(checkpoint);
        ctx.fill();
        
        // Draw outer glow for current checkpoint
        if (checkpoint.isCurrent) {
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';
          ctx.fill();
        }
        
        // Draw checkpoint label
        if (checkpoint.name) {
          ctx.font = '12px Arial';
          ctx.fillStyle = '#E0E1DD';
          ctx.textAlign = 'center';
          ctx.fillText(checkpoint.name, x, y - 12);
        }
        
        // Draw checkpoint number
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(27, 38, 59, 0.8)';
        ctx.fill();
        ctx.font = '10px Arial';
        ctx.fillStyle = '#E0E1DD';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((index + 1).toString(), x, y);
      });
    }
    
    // Draw a subtle grid background
    function drawGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      const gridSize = 30;
      const gridColor = 'rgba(65, 90, 119, 0.1)';
      
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      
      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      
      ctx.stroke();
    }

    // Draw initial map
    drawMap();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [checkpoints, routes]);
  
  // Handle mouse interactions for tooltips
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if mouse is over a checkpoint
      const hoveredCheckpoint = checkpoints.find(checkpoint => {
        const checkpointX = checkpoint.position.x * canvas.width;
        const checkpointY = checkpoint.position.y * canvas.height;
        const distance = Math.sqrt(
          Math.pow(x - checkpointX, 2) + 
          Math.pow(y - checkpointY, 2)
        );
        
        return distance <= 12; // Hover radius slightly larger than checkpoint
      });
      
      if (hoveredCheckpoint) {
        setTooltip({
          visible: true,
          content: (
            <div>
              <div className="font-bold">{hoveredCheckpoint.name}</div>
              {hoveredCheckpoint.eta && (
                <div className="flex items-center text-xs mt-1">
                  <Clock className="h-3 w-3 mr-1" /> ETA: {hoveredCheckpoint.eta}
                </div>
              )}
              <div className="text-xs">
                {hoveredCheckpoint.isCurrent ? 'Current Position' : 'Checkpoint'}
              </div>
            </div>
          ),
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      } else {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };
    
    const handleMouseLeave = () => {
      setTooltip(prev => ({ ...prev, visible: false }));
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [checkpoints]);

  return (
    <Card className="app-card h-full">
      <CardHeader className="app-card-header">
        <CardTitle className="app-card-title">
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
              <Anchor className="w-4 h-4 mr-1" /> Routes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="m-0" forceMount>
            <div 
              ref={containerRef}
              className="relative w-full bg-[#1B263B] rounded-md overflow-hidden border border-[#415A77]/20" 
              style={{ height: '320px', display: value === 'map' ? 'block' : 'none' }}
            >
              <canvas 
                ref={canvasRef} 
                className="w-full h-full" 
              />
              
              {/* Checkpoint tooltip */}
              {tooltip.visible && (
                <div 
                  className="checkpoint-tooltip"
                  style={{ 
                    left: tooltip.x,
                    top: tooltip.y,
                    opacity: 1
                  }}
                >
                  {tooltip.content}
                </div>
              )}
              
              {/* Map legend */}
              <div className="absolute bottom-2 right-2 bg-[#0D1B2A] p-2 rounded-md text-xs border border-[#415A77]/30">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2"></div>
                  <span>Current Position</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FFC107] mr-2"></div>
                  <span>Planned Checkpoint</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weather" className="m-0">
            <div className="w-full bg-[#1B263B] rounded-md flex items-center justify-center border border-[#415A77]/20" style={{ height: '320px' }}>
              <div className="text-center text-[#778DA9]">
                <CloudRain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Weather data will be displayed here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="routes" className="m-0">
            <div className="w-full bg-[#1B263B] rounded-md flex items-center justify-center border border-[#415A77]/20" style={{ height: '320px' }}>
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