import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function FireAlert() {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  const videoSections = [
    {
      id: "engine",
      title: "Engine Room",
      video: "/attached_assets/Fire.mp4",
      image: "/attached_assets/Engine.jpg",
    },
    {
      id: "bridge",
      title: "Bridge",
      video: "/attached_assets/Low.mp4",
      image: "/attached_assets/Bridge.jpg",
    },
    {
      id: "cargo",
      title: "Cargo Bay",
      video: "/attached_assets/Could Be.mp4",
      image: "/attached_assets/Cargo.jpg",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#E0E1DD]">Fire Alert</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videoSections.map((section) => (
          <Card
            key={section.id}
            className="bg-[#0D1B2A] border-[#415A77] overflow-hidden relative"
            onMouseEnter={() => setHoveredVideo(section.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div className="relative aspect-video">
              {hoveredVideo === section.id ? (
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={section.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-lg font-medium text-white">{section.title}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}