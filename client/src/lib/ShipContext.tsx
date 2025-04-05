import { createContext, useContext, useState, ReactNode } from 'react';
import { SHIP_HEALTH, FUEL_EFFICIENCY, AI_MODELS, RECENT_ALERTS, WEATHER_INFO } from './constants';

interface ShipContextType {
  health: {
    engine: number;
    fuel: number;
    hullWeathering: number;
    overall: number;
    lastUpdated: string;
  };
  fuelEfficiency: {
    hoursRemaining: number;
    percentRemaining: number;
  };
  aiModels: {
    name: string;
    status: string;
  }[];
  alerts: {
    id: number;
    type: string;
    title: string;
    location: string;
    time: string;
    icon: string;
  }[];
  weather: {
    location: string;
    temperature: number;
    wind: string;
    waves: string;
    icon: string;
  };
}

const ShipContext = createContext<ShipContextType | undefined>(undefined);

export function ShipProvider({ children }: { children: ReactNode }) {
  const [shipData] = useState<ShipContextType>({
    health: SHIP_HEALTH,
    fuelEfficiency: FUEL_EFFICIENCY,
    aiModels: AI_MODELS,
    alerts: RECENT_ALERTS,
    weather: WEATHER_INFO,
  });

  return (
    <ShipContext.Provider value={shipData}>
      {children}
    </ShipContext.Provider>
  );
}

export function useShipData() {
  const context = useContext(ShipContext);
  if (context === undefined) {
    throw new Error('useShipData must be used within a ShipProvider');
  }
  return context;
}
