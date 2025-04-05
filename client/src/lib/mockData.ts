// Mock port data
export const ports = [
  {
    id: "port-1",
    name: "Shanghai",
    country: "China",
    lat: 31.2304,
    lng: 121.4737
  },
  {
    id: "port-2",
    name: "Singapore",
    country: "Singapore",
    lat: 1.2903,
    lng: 103.8515
  },
  {
    id: "port-3",
    name: "Rotterdam",
    country: "Netherlands",
    lat: 51.9225,
    lng: 4.47917
  },
  {
    id: "port-4",
    name: "Los Angeles",
    country: "USA",
    lat: 33.7360,
    lng: -118.2610
  },
  {
    id: "port-5",
    name: "Dubai",
    country: "UAE",
    lat: 25.2697,
    lng: 55.3094
  },
  {
    id: "port-6",
    name: "New York",
    country: "USA",
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: "port-7",
    name: "Busan",
    country: "South Korea",
    lat: 35.1796,
    lng: 129.0756
  },
  {
    id: "port-8",
    name: "Antwerp",
    country: "Belgium",
    lat: 51.2194,
    lng: 4.4025
  }
];

// Navigation map checkpoints sample data
export const checkpoints = [
  {
    id: "cp-1",
    name: "Departure",
    position: { x: 0.2, y: 0.3 },
    isCurrent: true,
    status: 'current',
    eta: '12:30 UTC'
  },
  {
    id: "cp-2",
    name: "Waypoint Alpha",
    position: { x: 0.35, y: 0.2 },
    status: 'pending',
    eta: '14:45 UTC'
  },
  {
    id: "cp-3",
    name: "Channel Marker",
    position: { x: 0.5, y: 0.35 },
    status: 'pending',
    eta: '17:15 UTC'
  },
  {
    id: "cp-4",
    name: "Shipping Lane",
    position: { x: 0.65, y: 0.5 },
    status: 'pending',
    eta: '19:30 UTC'
  },
  {
    id: "cp-5",
    name: "Port Approach",
    position: { x: 0.85, y: 0.6 },
    status: 'pending',
    eta: '22:00 UTC'
  },
  {
    id: "cp-6",
    name: "Alternative Route",
    position: { x: 0.4, y: 0.45 },
    status: 'pending',
    eta: '16:30 UTC'
  },
  {
    id: "cp-7",
    name: "Weather Station",
    position: { x: 0.6, y: 0.3 },
    status: 'pending',
    eta: '18:15 UTC'
  },
  {
    id: "cp-8",
    name: "Deep Water Route",
    position: { x: 0.75, y: 0.4 },
    status: 'pending',
    eta: '20:45 UTC'
  },
  {
    id: "cp-9",
    name: "Coastal Waypoint",
    position: { x: 0.3, y: 0.6 },
    status: 'pending',
    eta: '15:30 UTC'
  },
  {
    id: "cp-10",
    name: "Final Approach",
    position: { x: 0.78, y: 0.7 },
    status: 'pending',
    eta: '21:15 UTC'
  }
];

// Routes sample data
export const routes = [
  {
    id: "route-1",
    checkpoints: ["cp-1", "cp-2", "cp-3", "cp-4", "cp-5", "cp-10"],
    color: "#4CAF50",
    isActive: true
  },
  {
    id: "route-2",
    checkpoints: ["cp-1", "cp-9", "cp-6", "cp-7", "cp-8", "cp-10", "cp-5"],
    color: "#FFC107",
    isActive: false,
    isDashed: true
  },
  {
    id: "route-3",
    checkpoints: ["cp-1", "cp-6", "cp-3", "cp-7", "cp-8", "cp-5"],
    color: "#2196F3",
    isActive: false,
    isDashed: true
  }
];

// Active vessels
export const activeVessels = [
  {
    id: "vessel-1",
    name: "Atlantic Carrier",
    type: "Cargo",
    distance: "2.3nm",
    direction: "NE",
    status: "safe"
  },
  {
    id: "vessel-2",
    name: "Pacific Star",
    type: "Tanker",
    distance: "4.1nm",
    direction: "SW",
    status: "safe"
  },
  {
    id: "vessel-3",
    name: "Northern Light",
    type: "Fishing",
    distance: "1.7nm",
    direction: "W",
    status: "monitor"
  },
  {
    id: "vessel-4",
    name: "Mediterranean Queen",
    type: "Passenger",
    distance: "3.5nm",
    direction: "SE",
    status: "safe"
  },
  {
    id: "vessel-5",
    name: "Asian Falcon",
    type: "Container",
    distance: "0.8nm",
    direction: "NW",
    status: "warning"
  },
  {
    id: "vessel-6",
    name: "Arctic Explorer",
    type: "Research",
    distance: "5.2nm",
    direction: "N",
    status: "monitor"
  },
  {
    id: "vessel-7",
    name: "Black Pearl",
    type: "Yacht",
    distance: "1.1nm",
    direction: "E",
    status: "safe"
  },
  {
    id: "vessel-8",
    name: "Red Dragon",
    type: "Tanker",
    distance: "0.5nm",
    direction: "S",
    status: "danger"
  }
];

// Course correction data
export const courseData = {
  current: {
    heading: 45,
    maintainedFor: "3.5 hours"
  },
  recommended: {
    heading: 52,
    reason: "weather"
  },
  deviation: 7,
  eta: {
    destination: "Rotterdam",
    time: "18:45 UTC"
  }
};