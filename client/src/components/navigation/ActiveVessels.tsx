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
    <div className="space-y-1 overflow-y-auto max-h-[250px] pr-1">
      {vessels.map((vessel) => (
        <div 
          key={vessel.id}
          className="flex items-start justify-between p-2 rounded-md bg-[#1B263B] border border-[#415A77] mb-2"
        >
          <div className="flex-1">
            <div className="flex items-center gap-1">
              {getStatusIcon(vessel.status)}
              <span className="font-medium text-sm">{vessel.name}</span>
            </div>
            <div className="text-xs text-[#778DA9] mt-1">
              <div>{vessel.type}</div>
              <div className="flex justify-between mt-1">
                <span>{vessel.distance}</span>
                <span>{vessel.direction}</span>
              </div>
            </div>
          </div>
          <div className="ml-2">
            {getStatusBadge(vessel.status)}
          </div>
        </div>
      ))}
    </div>
  );
}