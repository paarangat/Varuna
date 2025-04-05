import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';

export default function ShipModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const shipRef = useRef<THREE.Group | null>(null);
  const waterRef = useRef<Water | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#1B263B');
    scene.fog = new THREE.FogExp2(0x1B263B, 0.01);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(30, 100, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    const d = 50;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      2000
    );
    cameraRef.current = camera;
    camera.position.set(15, 8, 25);
    camera.lookAt(0, 0, 0);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.target.set(0, 0, 0);

    // Create sky
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const sunPosition = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(80);
    const theta = THREE.MathUtils.degToRad(30);
    sunPosition.setFromSphericalCoords(1, phi, theta);
    skyUniforms['sunPosition'].value.copy(sunPosition);

    // Create realistic water
    createWater();

    // Create detailed battleship model
    createDetailedBattleship();
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const deltaTime = clockRef.current.getDelta();
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Animate water
      if (waterRef.current) {
        waterRef.current.material.uniforms['time'].value += 1.0 / 60.0;
      }
      
      // Animate ship bobbing and rolling with waves
      if (shipRef.current) {
        // Subtle bobbing up and down
        shipRef.current.position.y = Math.sin(clockRef.current.elapsedTime * 0.5) * 0.1;
        
        // Subtle rolling
        shipRef.current.rotation.z = Math.sin(clockRef.current.elapsedTime * 0.3) * 0.02;
        shipRef.current.rotation.x = Math.sin(clockRef.current.elapsedTime * 0.4) * 0.01;
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
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material instanceof THREE.Material) {
              obj.material.dispose();
            } else if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            }
          }
        });
      }
      
      if (waterRef.current) {
        waterRef.current.geometry.dispose();
        // Water material is complex, but we'll try to dispose what we can
        if (waterRef.current.material) {
          if (waterRef.current.material.map) waterRef.current.material.map.dispose();
          waterRef.current.material.dispose();
        }
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Create realistic water surface
  function createWater() {
    if (!sceneRef.current) return;
    
    // Water geometry
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    // Create realistic water with reflections and refractions
    const water = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
          function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          }
        ),
        sunDirection: new THREE.Vector3(0.2, 1.0, 0.1),
        sunColor: 0xffffff,
        waterColor: 0x064273,
        distortionScale: 3.7,
        fog: sceneRef.current.fog !== undefined
      }
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.5; // Slightly below the ship

    waterRef.current = water;
    sceneRef.current.add(water);
  }

  // Create detailed battleship based on reference images
  function createDetailedBattleship() {
    if (!sceneRef.current) return;
    
    const ship = new THREE.Group();
    shipRef.current = ship;
    
    // Materials
    const hullGrayMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xC8C8C8, 
      roughness: 0.7, 
      metalness: 0.2 
    });
    
    const hullRedMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xA52A2A, 
      roughness: 0.7, 
      metalness: 0.2 
    });
    
    const deckMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xB59E54, 
      roughness: 0.8, 
      metalness: 0.1 
    });
    
    const metalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x777777, 
      roughness: 0.3, 
      metalness: 0.8 
    });
    
    const darkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222, 
      roughness: 0.5, 
      metalness: 0.5 
    });

    // 1. Main Hull
    const hullGeometry = new THREE.BoxGeometry(6, 3, 30);
    // Taper the hull by adjusting vertices
    const hullPositions = hullGeometry.getAttribute('position');
    for (let i = 0; i < hullPositions.count; i++) {
      const x = hullPositions.getX(i);
      const y = hullPositions.getY(i);
      const z = hullPositions.getZ(i);
      
      // Taper the front (bow)
      if (z < -10) {
        const taperFactor = Math.max(0.3, 1 - Math.abs((z + 10) / 5) * 0.7);
        hullPositions.setX(i, x * taperFactor);
      }
      
      // Curve the bottom
      if (y < 0) {
        const curve = 0.8 + 0.2 * Math.cos((z / 15) * Math.PI);
        hullPositions.setY(i, y * curve);
      }
    }
    hullGeometry.computeVertexNormals();
    
    // Create hull with two materials
    const hullUpper = new THREE.Mesh(hullGeometry, hullGrayMaterial);
    ship.add(hullUpper);
    
    // Lower hull (red part)
    const lowerHullGeometry = new THREE.BoxGeometry(6, 1, 30);
    const lowerHull = new THREE.Mesh(lowerHullGeometry, hullRedMaterial);
    lowerHull.position.y = -2;
    ship.add(lowerHull);
    
    // 2. Main Deck
    const deckGeometry = new THREE.BoxGeometry(5.5, 0.2, 28);
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.position.y = 1.5;
    ship.add(deck);
    
    // 3. Superstructure
    const superstructureGroup = new THREE.Group();
    ship.add(superstructureGroup);
    superstructureGroup.position.y = 1.6;
    
    // Main tower base
    const towerBaseGeometry = new THREE.BoxGeometry(4, 1.5, 8);
    const towerBase = new THREE.Mesh(towerBaseGeometry, hullGrayMaterial);
    towerBase.position.z = 2;
    superstructureGroup.add(towerBase);
    
    // Middle tower
    const middleTowerGeometry = new THREE.BoxGeometry(3, 2, 5);
    const middleTower = new THREE.Mesh(middleTowerGeometry, hullGrayMaterial);
    middleTower.position.y = 1.75;
    middleTower.position.z = 3;
    superstructureGroup.add(middleTower);
    
    // Command bridge
    const bridgeGeometry = new THREE.BoxGeometry(2.5, 1.5, 3);
    const bridge = new THREE.Mesh(bridgeGeometry, hullGrayMaterial);
    bridge.position.y = 3.5;
    bridge.position.z = 4;
    superstructureGroup.add(bridge);
    
    // Bridge windows
    const windowGeometry = new THREE.BoxGeometry(2.6, 0.3, 3.1);
    const windowMesh = new THREE.Mesh(windowGeometry, darkMaterial);
    windowMesh.position.y = 3.5;
    windowMesh.position.z = 4;
    superstructureGroup.add(windowMesh);
    
    // Radar tower
    const radarTowerGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 8);
    const radarTower = new THREE.Mesh(radarTowerGeometry, hullGrayMaterial);
    radarTower.position.y = 5.25;
    radarTower.position.z = 4;
    superstructureGroup.add(radarTower);
    
    // Radar dish
    const radarDishGeometry = new THREE.CircleGeometry(1, 16);
    const radarDish = new THREE.Mesh(radarDishGeometry, metalMaterial);
    radarDish.rotation.y = Math.PI / 2;
    radarDish.position.y = 6.25;
    radarDish.position.z = 4;
    superstructureGroup.add(radarDish);
    
    // 4. Main guns (three turrets)
    const gunGroup = new THREE.Group();
    ship.add(gunGroup);
    
    function createGunTurret(x: number, y: number, z: number, rotation: number = 0) {
      const turretGroup = new THREE.Group();
      
      // Turret base
      const turretBaseGeometry = new THREE.CylinderGeometry(1.5, 1.8, 1, 8);
      const turretBase = new THREE.Mesh(turretBaseGeometry, hullGrayMaterial);
      turretGroup.add(turretBase);
      
      // Turret housing
      const turretHousingGeometry = new THREE.BoxGeometry(3, 1, 3);
      const turretHousing = new THREE.Mesh(turretHousingGeometry, hullGrayMaterial);
      turretHousing.position.y = 0.5;
      turretGroup.add(turretHousing);
      
      // Create gun barrels
      const barrelGroup = new THREE.Group();
      turretGroup.add(barrelGroup);
      
      // Create 3 barrels side by side
      for (let i = -1; i <= 1; i++) {
        const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 6, 8);
        const barrel = new THREE.Mesh(barrelGeometry, darkMaterial);
        barrel.position.x = i * 0.7;
        barrel.position.y = 0.5;
        barrel.position.z = 3;
        barrel.rotation.x = Math.PI / 2;
        barrelGroup.add(barrel);
      }
      
      turretGroup.position.set(x, y, z);
      turretGroup.rotation.y = rotation;
      
      return turretGroup;
    }
    
    // Front turret
    const frontTurret = createGunTurret(0, 2, -8);
    gunGroup.add(frontTurret);
    
    // Middle turret
    const middleTurret = createGunTurret(0, 2, -2);
    gunGroup.add(middleTurret);
    
    // Rear turret
    const rearTurret = createGunTurret(0, 2, 8);
    gunGroup.add(rearTurret);
    
    // 5. Secondary Weapons
    const secondaryWeaponsGroup = new THREE.Group();
    ship.add(secondaryWeaponsGroup);
    
    // Secondary gun template
    function createSecondaryGun(x: number, y: number, z: number, rotation: number = 0) {
      const gunGroup = new THREE.Group();
      
      // Gun base
      const baseGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.5, 8);
      const base = new THREE.Mesh(baseGeometry, hullGrayMaterial);
      gunGroup.add(base);
      
      // Gun turret
      const turretGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.8);
      const turret = new THREE.Mesh(turretGeometry, hullGrayMaterial);
      turret.position.y = 0.3;
      gunGroup.add(turret);
      
      // Gun barrel
      const barrelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
      const barrel = new THREE.Mesh(barrelGeometry, darkMaterial);
      barrel.position.z = 0.8;
      barrel.rotation.x = Math.PI / 2;
      barrel.position.y = 0.3;
      gunGroup.add(barrel);
      
      gunGroup.position.set(x, y, z);
      gunGroup.rotation.y = rotation;
      
      return gunGroup;
    }
    
    // Add secondary weapons along both sides
    for (let i = -6; i <= 6; i += 3) {
      if (i === 0) continue; // Skip the center
      
      const port = createSecondaryGun(2.5, 2, i, Math.PI / 2);
      secondaryWeaponsGroup.add(port);
      
      const starboard = createSecondaryGun(-2.5, 2, i, -Math.PI / 2);
      secondaryWeaponsGroup.add(starboard);
    }
    
    // 6. Details - smokestacks, railings, etc.
    const detailsGroup = new THREE.Group();
    ship.add(detailsGroup);
    
    // Smokestacks
    function createSmokestack(x: number, y: number, z: number, height: number = 4, radius: number = 0.6) {
      const group = new THREE.Group();
      
      // Main stack
      const stackGeometry = new THREE.CylinderGeometry(radius, radius * 1.2, height, 8);
      const stack = new THREE.Mesh(stackGeometry, hullGrayMaterial);
      stack.position.y = height / 2;
      group.add(stack);
      
      // Top ring
      const ringGeometry = new THREE.TorusGeometry(radius * 1.1, 0.1, 8, 16);
      const ring = new THREE.Mesh(ringGeometry, darkMaterial);
      ring.position.y = height - 0.1;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
      
      group.position.set(x, y, z);
      return group;
    }
    
    // Two smokestacks
    const smokestack1 = createSmokestack(0, 2, -3.5, 5, 0.8);
    detailsGroup.add(smokestack1);
    
    const smokestack2 = createSmokestack(0, 2, -6, 4.5, 0.7);
    detailsGroup.add(smokestack2);
    
    // Add masts
    function createMast(x: number, y: number, z: number, height: number = 6) {
      const group = new THREE.Group();
      
      // Main mast pole
      const mastGeometry = new THREE.CylinderGeometry(0.15, 0.2, height, 8);
      const mast = new THREE.Mesh(mastGeometry, metalMaterial);
      mast.position.y = height / 2;
      group.add(mast);
      
      // Horizontal crossbar
      const crossGeometry = new THREE.CylinderGeometry(0.08, 0.08, 3, 8);
      const cross = new THREE.Mesh(crossGeometry, metalMaterial);
      cross.position.y = height * 0.7;
      cross.rotation.z = Math.PI / 2;
      group.add(cross);
      
      // Small platform
      const platformGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 8);
      const platform = new THREE.Mesh(platformGeometry, metalMaterial);
      platform.position.y = height * 0.8;
      group.add(platform);
      
      group.position.set(x, y, z);
      return group;
    }
    
    // Front mast
    const frontMast = createMast(0, 3.5, 0, 8);
    detailsGroup.add(frontMast);
    
    // Rear mast
    const rearMast = createMast(0, 2, 10, 7);
    detailsGroup.add(rearMast);
    
    // Railings
    function createRailings(length: number, width: number, height: number = 0.3) {
      const group = new THREE.Group();
      
      // Corner posts
      const postGeometry = new THREE.CylinderGeometry(0.03, 0.03, height, 4);
      
      // Create posts along the perimeter
      const postSpacing = 0.8;
      
      // Create two sides lengthwise
      for (let z = -length/2; z <= length/2; z += postSpacing) {
        // Port side post
        const portPost = new THREE.Mesh(postGeometry, metalMaterial);
        portPost.position.set(width/2, height/2, z);
        group.add(portPost);
        
        // Starboard side post
        const starboardPost = new THREE.Mesh(postGeometry, metalMaterial);
        starboardPost.position.set(-width/2, height/2, z);
        group.add(starboardPost);
      }
      
      // Create width-wise railings
      for (let x = -width/2; x <= width/2; x += postSpacing) {
        // Front posts
        const frontPost = new THREE.Mesh(postGeometry, metalMaterial);
        frontPost.position.set(x, height/2, -length/2);
        group.add(frontPost);
        
        // Rear posts
        const rearPost = new THREE.Mesh(postGeometry, metalMaterial);
        rearPost.position.set(x, height/2, length/2);
        group.add(rearPost);
      }
      
      // Horizontal rails between posts
      const railGeometry = new THREE.BoxGeometry(width, 0.02, 0.02);
      const railGeometryLength = new THREE.BoxGeometry(0.02, 0.02, length);
      
      // Top rail
      const topRailZ = new THREE.Mesh(railGeometryLength, metalMaterial);
      topRailZ.position.set(width/2, height, 0);
      group.add(topRailZ);
      
      const topRailZb = new THREE.Mesh(railGeometryLength, metalMaterial);
      topRailZb.position.set(-width/2, height, 0);
      group.add(topRailZb);
      
      // Front and back rails
      const topRailX1 = new THREE.Mesh(railGeometry, metalMaterial);
      topRailX1.position.set(0, height, -length/2);
      group.add(topRailX1);
      
      const topRailX2 = new THREE.Mesh(railGeometry, metalMaterial);
      topRailX2.position.set(0, height, length/2);
      group.add(topRailX2);
      
      return group;
    }
    
    // Deck railings
    const deckRailings = createRailings(26, 5, 0.4);
    deckRailings.position.y = 1.7;
    detailsGroup.add(deckRailings);
    
    // Anchor chains and windlass on bow
    function createAnchorChain(side: number) {
      const group = new THREE.Group();
      
      // Anchor windlass
      const windlassGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8);
      const windlass = new THREE.Mesh(windlassGeometry, metalMaterial);
      windlass.rotation.z = Math.PI / 2;
      windlass.position.x = side * 2;
      windlass.position.y = 1.8;
      windlass.position.z = -13;
      group.add(windlass);
      
      // Chain
      const chainLength = 1.5;
      const chainGeometry = new THREE.BoxGeometry(0.1, 0.1, chainLength);
      const chain = new THREE.Mesh(chainGeometry, darkMaterial);
      chain.position.x = side * 2;
      chain.position.y = 1;
      chain.position.z = -13.5 - chainLength/2;
      group.add(chain);
      
      return group;
    }
    
    const portAnchorChain = createAnchorChain(1);
    detailsGroup.add(portAnchorChain);
    
    const starboardAnchorChain = createAnchorChain(-1);
    detailsGroup.add(starboardAnchorChain);
    
    // Propellers
    const propellerGroup = new THREE.Group();
    ship.add(propellerGroup);
    
    function createPropeller(x: number) {
      const propGroup = new THREE.Group();
      
      // Propeller shaft
      const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
      const shaft = new THREE.Mesh(shaftGeometry, metalMaterial);
      shaft.rotation.x = Math.PI / 2;
      shaft.position.z = 0.5;
      propGroup.add(shaft);
      
      // Propeller blades
      for (let i = 0; i < 4; i++) {
        const bladeGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.2);
        const blade = new THREE.Mesh(bladeGeometry, metalMaterial);
        blade.position.z = 1;
        blade.rotation.z = (i * Math.PI / 2);
        propGroup.add(blade);
      }
      
      propGroup.position.x = x;
      propGroup.position.y = -1.5;
      propGroup.position.z = 14.5;
      
      return propGroup;
    }
    
    const propeller1 = createPropeller(1);
    propellerGroup.add(propeller1);
    
    const propeller2 = createPropeller(-1);
    propellerGroup.add(propeller2);
    
    // Position the ship to appear to be floating on the water
    ship.position.y = 0.1;
    
    // Scale the entire ship to an appropriate size
    ship.scale.set(0.4, 0.4, 0.4);
    
    // Add to scene
    sceneRef.current.add(ship);
    
    // Indicate loading is complete
    setIsLoading(false);
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden">
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-lg"
        style={{ background: 'linear-gradient(to bottom, #1B263B 0%, #415A77 100%)' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0D1B2A] bg-opacity-70">
          <div className="text-[#E0E1DD]">Loading detailed ship model...</div>
        </div>
      )}
    </div>
  );
}
