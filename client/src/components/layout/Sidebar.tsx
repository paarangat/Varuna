import { useLocation, Link } from "wouter";
import { LayoutDashboard, Compass, Flame, Binoculars } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();

  // Map icon names to components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dashboard":
        return <LayoutDashboard className="h-5 w-5 mr-3" />;
      case "compass":
        return <Compass className="h-5 w-5 mr-3" />;
      case "fire":
        return <Flame className="h-5 w-5 mr-3" />;
      case "binoculars":
        return <Binoculars className="h-5 w-5 mr-3" />;
      default:
        return <LayoutDashboard className="h-5 w-5 mr-3" />;
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-0"
      } bg-[#0D1B2A] flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen && window.innerWidth < 1024 ? "absolute z-50 h-full" : ""
      }`}
    >
      <div className="flex-1 p-4">
        <div className="py-4">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={`flex items-center p-2 rounded ${
                    location === item.path
                      ? "bg-[#415A77] text-[#E0E1DD]"
                      : "hover:bg-[#1B263B] text-[#E0E1DD]"
                  }`}
                >
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="p-4 border-t border-[#1B263B]">
        <div className="text-sm text-[#E0E1DD]">Vessel Status</div>
        <div className="flex items-center mt-1">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-sm text-[#E0E1DD]">Online</span>
        </div>
      </div>
    </div>
  );
}
