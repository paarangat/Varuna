import { Link } from "wouter";
import { Menu, Plus, User } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <nav className="bg-[#0D1B2A] p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="text-[#E0E1DD] font-bold text-2xl mr-6">
          <span className="text-[#778DA9]">V</span>aruna
        </div>
        
        {/* Sidebar Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="text-[#E0E1DD] hover:text-[#778DA9] focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Nav Links - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="#" className="text-[#E0E1DD] hover:text-[#778DA9] transition">
          Analytics
        </Link>
        <Link href="#" className="text-[#E0E1DD] hover:text-[#778DA9] transition">
          About
        </Link>
        <Link href="#" className="text-[#E0E1DD] hover:text-[#778DA9] transition">
          Settings
        </Link>
      </div>
      
      {/* Profile and New Route */}
      <div className="flex items-center space-x-4">
        <button className="bg-[#415A77] hover:bg-[#778DA9] text-[#E0E1DD] px-4 py-2 rounded transition flex items-center">
          <Plus className="h-4 w-4 mr-1" /> New Route
        </button>
        <div className="w-10 h-10 rounded-full bg-[#415A77] flex items-center justify-center text-[#E0E1DD] cursor-pointer">
          <User className="h-5 w-5" />
        </div>
      </div>
    </nav>
  );
}
