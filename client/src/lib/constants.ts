// Color scheme
export const COLORS = {
  navyDark: "#0D1B2A",
  navyMedium: "#1B263B",
  navyBlue: "#415A77",
  lakeBlue: "#778DA9",
  platinum: "#E0E1DD",
};

// AI Models
export const AI_MODELS = [
  { name: "Navigation Control", status: "Active" },
  { name: "Fire Alert", status: "Active" },
  { name: "Threat Detection", status: "Active" },
  { name: "Weather Detection", status: "Active" },
];

// Navigation Items
export const NAV_ITEMS = [
  { name: "Overview", path: "/", icon: "dashboard" },
  { name: "Navigation Control", path: "/navigation", icon: "compass" },
  { name: "Fire Alert", path: "/fire-alert", icon: "fire" },
  { name: "Threat Detection", path: "/threat-detection", icon: "binoculars" },
];

// Mock ship health data (this would come from backend in real app)
export const SHIP_HEALTH = {
  engine: 85,
  fuel: 62,
  hullWeathering: 91,
  overall: 79,
  lastUpdated: "Today, 14:32 UTC",
};

// Alerts
export const RECENT_ALERTS = [
  {
    id: 1,
    type: "danger",
    title: "Fire Risk Alert",
    location: "Engine room section A",
    time: "30 mins ago",
    icon: "exclamation-circle",
  },
  {
    id: 2, 
    type: "warning",
    title: "Possible Collision Risk",
    location: "Vessel detected 2.3 nautical miles",
    time: "2 hours ago",
    icon: "exclamation-triangle",
  },
];

// Weather information
export const WEATHER_INFO = {
  location: "North Atlantic",
  temperature: 14,
  wind: "18 knots NE",
  waves: "2.5m",
  icon: "cloud",
};

// Fuel efficiency
export const FUEL_EFFICIENCY = {
  hoursRemaining: 172,
  percentRemaining: 62,
};
