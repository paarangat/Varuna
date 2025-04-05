import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ShipModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const shipRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#1B263B');

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 5, 15);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 25;

    // Create a basic ship model (simplified)
    createShipModel();

    // Create ocean
    createOcean();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Animate ocean if needed
      if (oceanRef.current) {
        oceanRef.current.rotation.y += 0.0005;
      }
      
      // Render scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = 
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose materials, geometries, etc.
      if (shipRef.current) {
        shipRef.current.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (obj.material instanceof THREE.Material) {
              obj.material.dispose();
            } else if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            }
          }
        });
      }
      
      if (oceanRef.current && oceanRef.current instanceof THREE.Mesh) {
        oceanRef.current.geometry.dispose();
        if (oceanRef.current.material instanceof THREE.Material) {
          oceanRef.current.material.dispose();
        }
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Ocean reference
  const oceanRef = useRef<THREE.Mesh | null>(null);

  // Create ocean function
  function createOcean() {
    if (!sceneRef.current) return;
    
    const oceanGeometry = new THREE.CircleGeometry(50, 64);
    const oceanMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x415A77,
      transparent: true,
      opacity: 0.8,
      flatShading: true,
    });
    
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -1;
    
    oceanRef.current = ocean;
    sceneRef.current.add(ocean);
  }

  // Create basic ship model
  function createShipModel() {
    if (!sceneRef.current) return;
    
    const ship = new THREE.Group();
    shipRef.current = ship;
    
    // Hull base
    const hullGeometry = new THREE.BoxGeometry(5, 1, 12);
    const hullMaterial = new THREE.MeshPhongMaterial({ color: 0x778DA9 });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.y = 0;
    ship.add(hull);
    
    // Hull top
    const topHullGeometry = new THREE.BoxGeometry(4, 1, 8);
    const topHull = new THREE.Mesh(topHullGeometry, hullMaterial);
    topHull.position.y = 1;
    ship.add(topHull);
    
    // Bridge
    const bridgeGeometry = new THREE.BoxGeometry(3, 2, 3);
    const bridgeMaterial = new THREE.MeshPhongMaterial({ color: 0x0D1B2A });
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    bridge.position.y = 2.5;
    bridge.position.z = 2;
    ship.add(bridge);
    
    // Bow (front)
    const bowGeometry = new THREE.ConeGeometry(2.5, 4, 4, 1);
    const bow = new THREE.Mesh(bowGeometry, hullMaterial);
    bow.rotation.x = Math.PI / 2;
    bow.position.z = -8;
    bow.position.y = 0;
    ship.add(bow);
    
    // Position the ship
    ship.position.y = 0;
    
    sceneRef.current.add(ship);
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[300px] rounded-lg"
      style={{ background: 'linear-gradient(to bottom, #1B263B 0%, #415A77 100%)' }}
    />
  );
}
