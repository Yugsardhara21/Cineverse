export default function CineverseLogo({ className = "h-9 md:h-10" }) {
  return (
    <div className={`flex items-center justify-center ${className} select-none group cursor-pointer`}>
      <svg 
        viewBox="0 0 500 120" 
        className="h-full w-auto drop-shadow-[0_2px_6px_rgba(0,255,255,0.25)] transition-transform duration-300 group-hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />   {/* Cyan 500 */}
            <stop offset="100%" stopColor="#22D3EE" /> {/* Cyan 400 */}
          </linearGradient>

          <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />   {/* Bright Cyan */}
            <stop offset="50%" stopColor="#0284C7" />  {/* Vivid Blue */}
            <stop offset="100%" stopColor="#0F172A" /> {/* Near Black */}
          </linearGradient>

          <mask id="filmMaskSVG">
            <rect width="100" height="100" fill="white" />
            <line 
              x1="35" y1="90" 
              x2="85" y2="15" 
              stroke="black" 
              strokeWidth="10" 
              strokeDasharray="7 9" 
            />
          </mask>
        </defs>

        {/* 'cine' */}
        <text 
          x="217" y="80" 
          className="font-sans font-black tracking-tighter"
          fontSize="72" 
          fill="url(#cineGrad)" 
          textAnchor="end"
        >
          cine
        </text>

        {/* V Film Strip Icon */}
        <svg x="220" y="26" width="60" height="60" viewBox="0 0 100 100">
          <g mask="url(#filmMaskSVG)">
            <polygon points="10,25 55,25 45,85" fill="#FFFFFF" />
            <line 
              x1="35" y1="90" 
              x2="85" y2="15" 
              stroke="url(#vGrad)" 
              strokeWidth="24" 
              strokeLinecap="butt" 
            />
          </g>
        </svg>

        {/* 'erse' */}
        <text 
          x="283" y="80" 
          className="font-sans font-black tracking-tighter"
          fontSize="72" 
          fill="#FFFFFF" 
          textAnchor="start"
        >
          erse
        </text>

        {/* Tagline */}
        <text 
          x="250" y="112" 
          className="font-sans font-bold uppercase tracking-[0.25em]"
          fontSize="16" 
          fill="#9CA3AF" 
          textAnchor="middle"
        >
          CRAFTING CINEMATIC EXCELLENCE
        </text>
      </svg>
    </div>
  );
}
