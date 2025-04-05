import { Badge } from "@/components/ui/badge";
import { Anchor, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";

interface Vessel {
  id: string;
  name: string;
  type: string;
  distance: string;
  direction: string;
  status: 'safe' | 'monitor' | 'warning' | 'danger';
}

interface ActiveVesselsProps {
  vessels: Vessel[];
}

export default function ActiveVessels({ vessels }: ActiveVesselsProps) {
  // Get status icon based on vessel status
  const getStatusIcon = (status: Vessel['status']) => {
    switch (status) {
      case 'safe':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'monitor':
        return <Anchor className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'danger':
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
    }
  };

  // Get badge variant based on vessel status
  const getStatusBadge = (status: Vessel['status']) => {
    switch (status) {
      case 'safe':
        return <Badge variant="outline" className="bg-green-950/20 text-green-500 border-green-500">Safe</Badge>;
      case 'monitor':
        return <Badge variant="outline" className="bg-blue-950/20 text-blue-500 border-blue-500">Monitor</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-950/20 text-amber-500 border-amber-500">Warning</Badge>;
      case 'danger':
        return <Badge variant="outline" className="bg-red-950/20 text-red-500 border-red-500">Danger</Badge>;
    }
  };

  return (
    <div className="overflow-y-auto max-h-[250px] pr-1 vessel-list">
      <div className="grid grid-cols-1 gap-2">
        {vessels.map((vessel) => (
          <div 
            key={vessel.id}
            className="flex items-center justify-between p-3 rounded-md bg-[#1B263B] border border-[#415A77] hover:bg-[#263B53] transition-colors"
          >
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                {getStatusIcon(vessel.status)}
                <span className="font-medium text-sm">{vessel.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#778DA9]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider opacity-70">Type</span>
                  <span>{vessel.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider opacity-70">Distance</span>
                  <span>{vessel.distance}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider opacity-70">Direction</span>
                  <span>{vessel.direction}</span>
                </div>
                <div className="flex items-center justify-end">
                  {getStatusBadge(vessel.status)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}