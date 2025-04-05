import ShipModel from "@/lib/3d/ShipModel";
import { useState } from 'react';

export default function ShipVisualization() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`${isFullscreen 
        ? 'fixed inset-0 z-50 bg-[#0D1B2A]' 
        : 'lg:col-span-3 bg-[#0D1B2A] rounded-lg shadow-lg overflow-hidden'}`}
    >
      <div className="p-4 border-b border-[#415A77] flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#E0E1DD]">Vessel Visualization</h2>
        <button 
          onClick={toggleFullscreen}
          className="text-[#E0E1DD] hover:text-white focus:outline-none"
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a2 2 0 012-2h2a1 1 0 000-2H7a4 4 0 00-4 4v2a1 1 0 002 0zm10 0V7a4 4 0 00-4-4h-2a1 1 0 000 2h2a2 2 0 012 2v2a1 1 0 102 0zM5 11v2a2 2 0 002 2h2a1 1 0 010 2H7a4 4 0 01-4-4v-2a1 1 0 012 0zm10 0v2a4 4 0 01-4 4h-2a1 1 0 010-2h2a2 2 0 002-2v-2a1 1 0 012 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      <div className={`${isFullscreen ? 'h-[calc(100vh-64px)]' : 'p-4 h-[400px]'}`}>
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <ShipModel />
          <div className="absolute top-2 left-2 text-[#E0E1DD] bg-[#0D1B2A] bg-opacity-50 p-2 rounded">
            <h3 className="font-bold text-sm">Iowa-class Battleship</h3>
            <p className="text-xs">Length: 270m • Beam: 33m • Displacement: 45,000 tons</p>
          </div>
          <div className="text-xs text-center absolute bottom-2 left-0 right-0 text-[#E0E1DD] bg-[#0D1B2A] bg-opacity-50 p-2">
            Click and drag to rotate • Scroll to zoom • Double-click to focus
          </div>
        </div>
      </div>
    </div>
  );
}
