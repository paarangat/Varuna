import { useEffect, useRef } from 'react';

export default function AisRadar() {
  const radarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!radarContainerRef.current) return;

    // Clear any existing dots
    const existingDots = radarContainerRef.current.querySelectorAll('.radar-dot');
    existingDots.forEach(dot => dot.remove());

    // Create random dots
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      dot.classList.add('radar-dot');
      
      // Random position
      const radius = Math.random() * 45 + 5; // 5% to 50% from center
      const angle = Math.random() * Math.PI * 2; // 0 to 2π
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      
      dot.style.left = `${x}%`;
      dot.style.top = `${y}%`;
      
      radarContainerRef.current.appendChild(dot);
    }
  }, []);

  return (
    <div className="lg:col-span-2 bg-[#0D1B2A] rounded-lg shadow-lg">
      <div className="p-4 border-b border-[#415A77]">
        <h2 className="text-lg font-medium text-[#E0E1DD]">AIS Radar</h2>
      </div>
      <div className="p-4 flex items-center justify-center h-[calc(100%-64px)]">
        <div 
          ref={radarContainerRef}
          className="radar-container relative w-full h-[200px] rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle, rgba(13,27,42,0.4) 0%, rgba(65,90,119,0.6) 50%, rgba(119,141,169,0.8) 100%)'
          }}
        >
          <div 
            className="radar-line absolute w-[50%] h-[1px]"
            style={{
              background: 'linear-gradient(90deg, rgba(224,225,221,0.8) 0%, rgba(224,225,221,0.1) 100%)',
              transformOrigin: 'left',
              left: '50%',
              top: '50%',
              animation: 'rotate 4s infinite linear'
            }}
          ></div>
        </div>
      </div>
      <style jsx="true">{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .radar-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #E0E1DD;
        }
      `}</style>
    </div>
  );
}
