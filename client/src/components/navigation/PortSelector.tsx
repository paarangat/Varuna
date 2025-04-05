import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Anchor, Ship } from "lucide-react";

interface Port {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

interface PortSelectorProps {
  ports: Port[];
  sourcePort: Port | null;
  destinationPort: Port | null;
  onSourcePortChange: (port: Port | null) => void;
  onDestinationPortChange: (port: Port | null) => void;
}

export default function PortSelector({
  ports,
  sourcePort,
  destinationPort,
  onSourcePortChange,
  onDestinationPortChange
}: PortSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="source-port" className="text-[#E0E1DD] flex items-center gap-1">
          <Ship className="h-4 w-4" /> Current Port
        </Label>
        <Select 
          value={sourcePort?.id}
          onValueChange={(value) => {
            const selectedPort = ports.find(port => port.id === value) || null;
            onSourcePortChange(selectedPort);
          }}
        >
          <SelectTrigger id="source-port" className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD]">
            <SelectValue placeholder="Select starting port" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD]">
            {ports.map(port => (
              <SelectItem key={port.id} value={port.id} className="hover:bg-[#415A77] focus:bg-[#415A77]">
                {port.name}, {port.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination-port" className="text-[#E0E1DD] flex items-center gap-1">
          <Anchor className="h-4 w-4" /> Destination Port
        </Label>
        <Select
          value={destinationPort?.id}
          onValueChange={(value) => {
            const selectedPort = ports.find(port => port.id === value) || null;
            onDestinationPortChange(selectedPort);
          }}
        >
          <SelectTrigger id="destination-port" className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD]">
            <SelectValue placeholder="Select destination port" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B263B] border-[#415A77] text-[#E0E1DD]">
            {ports.map(port => (
              <SelectItem key={port.id} value={port.id} className="hover:bg-[#415A77] focus:bg-[#415A77]">
                {port.name}, {port.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}