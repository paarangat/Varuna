import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCw, Maximize, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

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

export default function Globe({ sourcePort, destinationPort, onRouteCreated }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const routeRef = useRef<THREE.Line | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rotationRef = useRef(0);

  // Convert latitude and longitude to 3D position
  const latLongToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  };

  // Initialize the globe
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0D1B2A');

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 12);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Create Earth globe
    const radius = 5;
    const segments = 50;
    const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/land_ocean_ice_cloud_2048.jpg'),
      bumpMap: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/earth_bumpmap.jpg'),
      bumpScale: 0.05,
      specular: new THREE.Color('grey'),
      shininess: 5
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;

    // Add a subtle glow
    const customMaterial = new THREE.ShaderMaterial({
      uniforms: { 
        glowColor: { value: new THREE.Color(0x415A77) },
        p: { value: 2.5 }, // atmosphere thickness
        glowPower: { value: 1.5 } // glow intensity
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float p;
        uniform float glowPower;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), p);
          gl_FragColor = vec4(glowColor, intensity * glowPower);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.15, segments, segments),
      customMaterial
    );
    scene.add(atmosphere);

    // Create group for markers
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Basic rotation for the globe
    if (globeRef.current) {
      globeRef.current.rotation.y = 0;
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (globeRef.current) {
        rotationRef.current += 0.005;
        globeRef.current.rotation.y = rotationRef.current;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resizing
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Dispose geometries and materials
      if (globeRef.current) {
        globeRef.current.geometry.dispose();
        if (globeRef.current.material instanceof THREE.Material) {
          globeRef.current.material.dispose();
        }
      }
    };
  }, []);

  // Update markers and route when ports change
  useEffect(() => {
    if (!markersGroupRef.current || !globeRef.current || !sceneRef.current) return;

    // Clear previous markers
    while (markersGroupRef.current.children.length > 0) {
      const child = markersGroupRef.current.children[0];
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
      markersGroupRef.current.remove(child);
    }

    // Clear previous route
    if (routeRef.current && sceneRef.current) {
      sceneRef.current.remove(routeRef.current);
      routeRef.current.geometry.dispose();
      if (routeRef.current.material instanceof THREE.Material) {
        routeRef.current.material.dispose();
      }
      routeRef.current = null;
    }

    const radius = 5; // Match the globe radius
    const markerRadius = 0.1;

    // Add source port marker if available
    if (sourcePort) {
      const position = latLongToVector3(sourcePort.lat, sourcePort.lng, radius + 0.05);
      const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      markersGroupRef.current.add(marker);

      // Add text label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 256;
        canvas.height = 128;
        context.fillStyle = 'rgba(13, 27, 42, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(sourcePort.name, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        
        const labelMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true
        });
        
        const label = new THREE.Sprite(labelMaterial);
        label.position.copy(position);
        label.position.multiplyScalar(1.1);
        label.scale.set(2, 1, 1);
        markersGroupRef.current.add(label);
      }
    }

    // Add destination port marker if available
    if (destinationPort) {
      const position = latLongToVector3(destinationPort.lat, destinationPort.lng, radius + 0.05);
      const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      markersGroupRef.current.add(marker);

      // Add text label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 256;
        canvas.height = 128;
        context.fillStyle = 'rgba(13, 27, 42, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(destinationPort.name, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        
        const labelMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true
        });
        
        const label = new THREE.Sprite(labelMaterial);
        label.position.copy(position);
        label.position.multiplyScalar(1.1);
        label.scale.set(2, 1, 1);
        markersGroupRef.current.add(label);
      }
    }

    // Draw route if both ports are available
    if (sourcePort && destinationPort && sceneRef.current) {
      const sourcePosition = latLongToVector3(sourcePort.lat, sourcePort.lng, radius + 0.05);
      const destPosition = latLongToVector3(destinationPort.lat, destinationPort.lng, radius + 0.05);
      
      // Create a curved path between the two points
      const routeCurve = new THREE.QuadraticBezierCurve3(
        sourcePosition,
        new THREE.Vector3(
          (sourcePosition.x + destPosition.x) * 0.5,
          (sourcePosition.y + destPosition.y) * 0.5,
          (sourcePosition.z + destPosition.z) * 0.5 + radius * 0.5
        ),
        destPosition
      );
      
      const points = routeCurve.getPoints(50);
      const routeGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const routeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xFFDD00,
        linewidth: 3
      });
      
      const route = new THREE.Line(routeGeometry, routeMaterial);
      sceneRef.current.add(route);
      routeRef.current = route;

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

      if (onRouteCreated) {
        onRouteCreated({
          distance,
          duration: `${days} days, ${remainingHours} hours`
        });
      }

      // Set camera to view the route
      if (cameraRef.current) {
        // Look at the center of the scene
        cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
      }
    }
  }, [sourcePort, destinationPort, onRouteCreated]);

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 12);
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
      rotationRef.current = 0;
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
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
        <div 
          ref={containerRef} 
          className="globe-container w-full h-[500px]"
        />
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