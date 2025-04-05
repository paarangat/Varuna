import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCw, Maximize, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const routeRef = useRef<THREE.Line | null>(null);
  const [hoveredPort, setHoveredPort] = useState<Port | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const portMarkersRef = useRef<Map<string, THREE.Object3D>>(new Map());

  // Convert latitude and longitude to 3D position on a sphere
  const latLongToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  };

  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create the scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0D1B2A');

    // Create the camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 12);

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create the Earth globe - using NASA texture
    const radius = 5;
    const segments = 64;
    const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/land_ocean_ice_cloud_2048.jpg'),
      bumpMap: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/earth_bumpmap.jpg'),
      bumpScale: 0.05,
      specularMap: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/earth_specular_2048.jpg'),
      specular: new THREE.Color('grey'),
      shininess: 15
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;

    // Create a subtle atmosphere glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.15, segments, segments);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x6a93cb) },
        viewVector: { value: new THREE.Vector3(0, 0, 1) },
        c: { value: 0.5 },
        p: { value: 3.0 }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(abs(0.5 - dot(vNormal, vNormel)), 5.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * c * intensity;
          gl_FragColor = vec4(glow, intensity);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Create a group for markers
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // Add orbit controls - this allows users to interact with the globe
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 7;
    controls.maxDistance = 20;
    controls.autoRotate = false;

    // Handle mouse movements for interactivity
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();

        // Update the camera's viewVector for the glow effect
        if (atmosphereMaterial.uniforms.viewVector) {
          const cameraPosition = new THREE.Vector3();
          camera.getWorldPosition(cameraPosition);
          atmosphereMaterial.uniforms.viewVector.value = cameraPosition;
        }
      }

      // Check for port marker hover
      if (markersGroupRef.current && markersGroupRef.current.children.length > 0) {
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(markersGroupRef.current.children, true);
        
        if (intersects.length > 0) {
          const object = intersects[0].object;
          if (object.userData && object.userData.port) {
            setHoveredPort(object.userData.port);
          }
        } else {
          setHoveredPort(null);
        }
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

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Clean up all THREE.js objects
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
      markersGroupRef.current.remove(child);
      
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    }
    
    // Clear port markers reference
    portMarkersRef.current.clear();

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
    const markerRadius = 0.08;

    // Add source port marker if available
    if (sourcePort) {
      const position = latLongToVector3(sourcePort.lat, sourcePort.lng, radius + 0.05);
      
      // Create the marker (glowing pin)
      const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff5555,
        transparent: true,
        opacity: 0.8
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.userData = { port: sourcePort };
      
      // Add a small emission/glow to make it more visible
      const glowGeometry = new THREE.SphereGeometry(markerRadius * 1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.3
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      marker.add(glow);
      
      markersGroupRef.current.add(marker);
      portMarkersRef.current.set(sourcePort.id, marker);
      
      // Add subtle directional pin/arrow
      const pinHeight = markerRadius * 5;
      const pinGeometry = new THREE.ConeGeometry(markerRadius * 0.8, pinHeight, 8);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      
      // Calculate orientation to point away from globe center
      const normalVector = position.clone().normalize();
      pin.position.copy(position.clone().add(normalVector.multiplyScalar(markerRadius)));
      
      // Rotate to point outward
      pin.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normalVector
      );
      
      markersGroupRef.current.add(pin);
    }

    // Add destination port marker if available
    if (destinationPort) {
      const position = latLongToVector3(destinationPort.lat, destinationPort.lng, radius + 0.05);
      
      // Create the marker
      const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x55ff55,
        transparent: true,
        opacity: 0.8
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.userData = { port: destinationPort };
      
      // Add a small emission/glow to make it more visible
      const glowGeometry = new THREE.SphereGeometry(markerRadius * 1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      marker.add(glow);
      
      markersGroupRef.current.add(marker);
      portMarkersRef.current.set(destinationPort.id, marker);
      
      // Add subtle directional pin/arrow
      const pinHeight = markerRadius * 5;
      const pinGeometry = new THREE.ConeGeometry(markerRadius * 0.8, pinHeight, 8);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      
      // Calculate orientation to point away from globe center
      const normalVector = position.clone().normalize();
      pin.position.copy(position.clone().add(normalVector.multiplyScalar(markerRadius)));
      
      // Rotate to point outward
      pin.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        normalVector
      );
      
      markersGroupRef.current.add(pin);
    }

    // Draw route if both ports are available
    if (sourcePort && destinationPort && sceneRef.current) {
      const sourcePosition = latLongToVector3(sourcePort.lat, sourcePort.lng, radius + 0.05);
      const destPosition = latLongToVector3(destinationPort.lat, destinationPort.lng, radius + 0.05);
      
      // Create a curved path between the two points
      // Calculate an "up" vector to create a nice curve
      const midPoint = new THREE.Vector3().addVectors(sourcePosition, destPosition).divideScalar(2);
      const midPointNormalized = midPoint.clone().normalize();
      
      // Adjust the curve's height based on the distance between points
      const pointDistance = sourcePosition.distanceTo(destPosition);
      const curveHeight = Math.min(radius * 0.5, pointDistance * 0.4);
      
      // Create control point for the curve
      const controlPoint = midPointNormalized.multiplyScalar(radius + curveHeight);
      
      // Create a quadratic bezier curve
      const curve = new THREE.QuadraticBezierCurve3(
        sourcePosition,
        controlPoint,
        destPosition
      );
      
      // Sample points along the curve
      const points = curve.getPoints(50);
      
      // Create the line geometry and material
      const routeGeometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Use animated dash line for better visibility
      const routeMaterial = new THREE.LineDashedMaterial({
        color: 0xffdd00,
        linewidth: 2,
        scale: 1,
        dashSize: 0.5,
        gapSize: 0.2,
      });
      
      const route = new THREE.Line(routeGeometry, routeMaterial);
      route.computeLineDistances(); // Required for dashed lines
      
      sceneRef.current.add(route);
      routeRef.current = route;

      // Calculate approximate distance and travel time
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

      // Focus the camera on the route area
      if (controlsRef.current && cameraRef.current) {
        // Rotate the controls to look at the middle of the route
        controlsRef.current.target.copy(midPoint.normalize().multiplyScalar(radius));
        controlsRef.current.update();
      }
    }
  }, [sourcePort, destinationPort, onRouteCreated]);

  // Handle reset button
  const handleReset = () => {
    if (controlsRef.current && cameraRef.current) {
      // Reset the controls
      controlsRef.current.reset();
      
      // Reset camera position
      cameraRef.current.position.set(0, 0, 12);
      cameraRef.current.lookAt(0, 0, 0);
      
      // Update controls
      controlsRef.current.update();
      
      // Stop auto-rotation if it was enabled
      controlsRef.current.autoRotate = false;
    }
  };

  // Toggle fullscreen mode
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

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
    }
  };

  // Monitor fullscreen state
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
        
        {/* Control buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD] hover:bg-[#415A77]"
            onClick={handleReset}
            title="Reset View"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD] hover:bg-[#415A77]"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD] hover:bg-[#415A77]"
            onClick={toggleAutoRotate}
            title="Toggle Auto-Rotation"
          >
            <Boxes className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Route information */}
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
        
        {/* Hover information tooltip */}
        {hoveredPort && (
          <div 
            className="absolute px-3 py-2 bg-[#1B263B] border border-[#415A77] rounded-md shadow-lg text-[#E0E1DD] text-sm z-10"
            style={{
              left: mouseRef.current.x * window.innerWidth / 2 + window.innerWidth / 2 + 15,
              top: -mouseRef.current.y * window.innerHeight / 2 + window.innerHeight / 2 - 15
            }}
          >
            <div className="font-medium">{hoveredPort.name}</div>
            <div className="text-xs text-[#778DA9]">{hoveredPort.country}</div>
            <div className="text-xs mt-1">
              <span className="text-[#778DA9]">Coordinates: </span>
              {hoveredPort.lat.toFixed(2)}°, {hoveredPort.lng.toFixed(2)}°
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}