import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Flame, 
  Thermometer, 
  Video, 
  AlertCircle, 
  CheckCircle2
} from "lucide-react";
import { useEffect, useState } from "react";

// Import video assets for the demo
import lowFireVideoSrc from "@assets/Low.mp4";
import couldBeFireVideoSrc from "@assets/Could Be.mp4";
import fireDetectedVideoSrc from "@assets/Fire.mp4";

// Status indicator component for cameras and feeds
type StatusType = "active" | "inactive" | "safe" | "warning" | "danger";

interface StatusIndicatorProps {
  status: StatusType;
  size?: "sm" | "md" | "lg";
}

// Simple status indicator component for reuse
const StatusIndicator = ({ status, size = "md" }: StatusIndicatorProps) => {
  // Map status to color
  const statusColors: Record<StatusType, string> = {
    active: "bg-green-500",
    inactive: "bg-red-500",
    safe: "bg-blue-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };
  
  // Map size to dimensions
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full ${statusColors[status]}`}></div>
  );
};

// Video Feed component
interface VideoFeedProps {
  title: string;
  status: "safe" | "warning" | "danger";
  source: string;
}

const VideoFeed = ({ title, status, source }: VideoFeedProps) => {
  // Map status to text
  const statusText = {
    safe: "Safe",
    warning: "Could be Fire",
    danger: "Fire Detected"
  };
  
  // Map status to text color
  const statusTextColor = {
    safe: "text-blue-500",
    warning: "text-yellow-500",
    danger: "text-red-500"
  };
  
  return (
    <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center">
            <Video className="mr-2 h-5 w-5" /> 
            {title}
          </div>
          <div className="flex items-center">
            <StatusIndicator status={status} />
            <span className={`ml-2 text-sm ${statusTextColor[status]}`}>
              {statusText[status]}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded overflow-hidden bg-black h-48 md:h-60 relative">
          {/* Video element */}
          <video 
            src={source} 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            loop
          />
          
          {/* Overlay for video status */}
          <div className={`absolute inset-0 flex items-center justify-center ${
            status === "danger" ? "bg-red-900/20" : 
            status === "warning" ? "bg-yellow-900/20" : 
            "bg-blue-900/20"
          }`}>
            {status === "danger" && (
              <div className="animate-pulse">
                <Flame className="h-12 w-12 text-red-500" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Alert notification component
interface AlertNotificationProps {
  message: string;
  timestamp: string;
  level: "info" | "warning" | "danger";
}

const AlertNotification = ({ message, timestamp, level }: AlertNotificationProps) => {
  // Map level to background and text color
  const levelStyles = {
    info: "bg-blue-900/20 border-l-4 border-blue-500",
    warning: "bg-yellow-900/20 border-l-4 border-yellow-500",
    danger: "bg-red-900/20 border-l-4 border-red-500"
  };
  
  const levelIconColor = {
    info: "text-blue-500",
    warning: "text-yellow-500",
    danger: "text-red-500"
  };
  
  return (
    <div className={`p-4 rounded ${levelStyles[level]}`}>
      <div className="flex items-start">
        <div className={`mr-3 ${levelIconColor[level]}`}>
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="text-base font-medium text-[#E0E1DD]">Alert Notification</div>
            <div className="text-xs text-[#778DA9]">{timestamp}</div>
          </div>
          <div className="text-sm text-[#E0E1DD] mt-1">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Fire Alert component
export default function FireAlert() {
  // State for thermal camera statuses
  const [thermalCameras, setThermalCameras] = useState([
    { location: "Engine Room", status: "active" as StatusType },
    { location: "Bridge", status: "active" as StatusType },
    { location: "Cargo Bay", status: "active" as StatusType }
  ]);
  
  // State for fire suppression statuses
  const [suppressionSystems, setSuppressionSystems] = useState([
    { name: "Water Pump System", status: "Operational" },
    { name: "CO2 Suppression", status: "Operational" },
    { name: "Fire Doors", status: "Operational" },
    { name: "Alarm Systems", status: "Operational" }
  ]);
  
  // Alert notification
  const alertNotification = {
    message: "Thermal anomaly detected in Engine Room. Monitoring system activated. No immediate danger detected.",
    timestamp: "Just now",
    level: "warning" as const
  };
  
  return (
    <>
      <h1 className="text-2xl font-semibold text-[#E0E1DD] mb-6">Fire Alert System</h1>
      
      {/* Top Section with three cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Thermal Camera Locations */}
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="mr-2 h-5 w-5" /> Thermal Camera Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {thermalCameras.map((camera, index) => (
                <div key={index} className="flex justify-between items-center bg-[#1B263B] p-3 rounded">
                  <div className="flex items-center">
                    <StatusIndicator status={camera.status} />
                    <span className="ml-2">{camera.location}</span>
                  </div>
                  <span className={camera.status === "active" ? "text-green-500" : "text-red-500"}>
                    {camera.status === "active" ? "Active" : "Non-Active"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Alert Notification Card */}
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" /> Alert Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertNotification 
              message={alertNotification.message}
              timestamp={alertNotification.timestamp}
              level={alertNotification.level}
            />
          </CardContent>
        </Card>
        
        {/* Fire Suppression Status */}
        <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" /> Fire Suppression Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suppressionSystems.map((system, index) => (
                <div key={index} className="flex justify-between items-center bg-[#1B263B] p-3 rounded">
                  <div className="flex items-center">
                    <StatusIndicator status="active" />
                    <span className="ml-2">{system.name}</span>
                  </div>
                  <span className="text-green-500">{system.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Live Feed Section */}
      <h2 className="text-xl font-semibold text-[#E0E1DD] mb-4">Live Thermal Feeds</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <VideoFeed 
          title="Engine Room" 
          status="warning" 
          source={couldBeFireVideoSrc}
        />
        <VideoFeed 
          title="Bridge" 
          status="danger" 
          source={fireDetectedVideoSrc}
        />
        <VideoFeed 
          title="Cargo Bay" 
          status="safe" 
          source={lowFireVideoSrc}
        />
      </div>
      
      {/* Legend for status indicators */}
      <Card className="bg-[#0D1B2A] text-[#E0E1DD] border-[#415A77] mt-6">
        <CardHeader>
          <CardTitle className="text-base">Status Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <StatusIndicator status="active" />
              <span className="ml-2 text-sm">Active</span>
            </div>
            <div className="flex items-center">
              <StatusIndicator status="inactive" />
              <span className="ml-2 text-sm">Inactive</span>
            </div>
            <div className="flex items-center">
              <StatusIndicator status="safe" />
              <span className="ml-2 text-sm">Safe</span>
            </div>
            <div className="flex items-center">
              <StatusIndicator status="warning" />
              <span className="ml-2 text-sm">Could be Fire</span>
            </div>
            <div className="flex items-center">
              <StatusIndicator status="danger" />
              <span className="ml-2 text-sm">Fire Detected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
