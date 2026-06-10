"use client";

import React from "react";

interface VehicleTypeIconProps {
  name: string;
  className?: string;
}

export function VehicleTypeIcon({ name, className = "" }: VehicleTypeIconProps) {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Full Body Trailer
  if (cleanName === "full body trailer") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={4} y={20} width={46} height={1.5} fill="#334155" rx={0.5} />
          <path d="M42 9 h 8 l 6 6 v 7 h -14 z" fill="#f8fafc" />
          <path d="M47 11 h 3.5 L 53.5 15 H 47 Z" fill="#1e293b" />
          <rect x={53} y={18} width={3} height={3} rx={0.5} fill="#334155" />
          <circle cx={54.5} cy={16.5} r={0.8} fill="#fbbf24" />
          <rect x={4} y={4} width={34} height={15} rx={1} fill="#ec4899" />
          <g>
            <circle cx={8} cy={23} r={3.2} fill="#111" />
            <circle cx={8} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={14} cy={23} r={3.2} fill="#111" />
            <circle cx={14} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={20} cy={23} r={3.2} fill="#111" />
            <circle cx={20} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={48} cy={23} r={3.2} fill="#111" />
            <circle cx={48} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 2. Half Body Trailer
  if (cleanName === "half body trailer") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={4} y={20} width={46} height={1.5} fill="#334155" rx={0.5} />
          <path d="M42 9 h 8 l 6 6 v 7 h -14 z" fill="#f8fafc" />
          <path d="M47 11 h 3.5 L 53.5 15 H 47 Z" fill="#1e293b" />
          <rect x={53} y={18} width={3} height={3} rx={0.5} fill="#334155" />
          <circle cx={54.5} cy={16.5} r={0.8} fill="#fbbf24" />
          <rect x={4} y={11.5} width={34} height={7.5} rx={0.5} fill="#f1f5f9" />
          <rect x={4} y={4} width={34} height={7.5} rx={0.5} fill="#ec4899" />
          <g>
            <circle cx={8} cy={23} r={3.2} fill="#111" />
            <circle cx={8} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={14} cy={23} r={3.2} fill="#111" />
            <circle cx={14} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={20} cy={23} r={3.2} fill="#111" />
            <circle cx={20} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={48} cy={23} r={3.2} fill="#111" />
            <circle cx={48} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. Container Body Truck
  if (cleanName === "container body truck") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={6} y={20} width={45} height={1.8} fill="#333" rx={0.5} />
          <path d="M40 9 h 10 l 6 6 v 7 h -16 z" fill="#f8fafc" />
          <path d="M45 11 h 4.5 L 52.5 15 H 45 Z" fill="#1e293b" />
          <rect x={51} y={18} width={3} height={3} rx={0.5} fill="#334155" />
          <circle cx={52.5} cy={16.5} r={0.8} fill="#fbbf24" />
          <rect x={4} y={4} width={36} height={15} rx={1} fill="#ec4899" />
          <g>
            <circle cx={12} cy={23} r={3.2} fill="#111" />
            <circle cx={12} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={20} cy={23} r={3.2} fill="#111" />
            <circle cx={20} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={46} cy={23} r={3.2} fill="#111" />
            <circle cx={46} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 4. Flat Body Truck - Open
  if (cleanName === "flat body truck open") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={6} y={20} width={45} height={1.8} fill="#333" rx={0.5} />
          <path d="M40 9 h 10 l 6 6 v 7 h -16 z" fill="#f8fafc" />
          <path d="M45 11 h 4.5 L 52.5 15 H 45 Z" fill="#1e293b" />
          <rect x={51} y={18} width={3} height={3} rx={0.5} fill="#334155" />
          <circle cx={52.5} cy={16.5} r={0.8} fill="#fbbf24" />
          <rect x={4} y={16} width={36} height={3.5} fill="#f1f5f9" rx={0.5} />
          <rect x={38} y={10} width={2} height={6} fill="#f1f5f9" />
          <g>
            <circle cx={12} cy={23} r={3.2} fill="#111" />
            <circle cx={12} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={20} cy={23} r={3.2} fill="#111" />
            <circle cx={20} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={46} cy={23} r={3.2} fill="#111" />
            <circle cx={46} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 5. Full Body Truck - Open <> Close
  if (cleanName === "full body truck open close") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={6} y={20} width={45} height={1.8} fill="#333" rx={0.5} />
          <path d="M40 9 h 10 l 6 6 v 7 h -16 z" fill="#f8fafc" />
          <path d="M45 11 h 4.5 L 52.5 15 H 45 Z" fill="#1e293b" />
          <rect x={51} y={18} width={3} height={3} rx={0.5} fill="#334155" />
          <circle cx={52.5} cy={16.5} r={0.8} fill="#fbbf24" />
          <rect x={4} y={4} width={36} height={15} rx={1} fill="#ec4899" />
          <line x1={4} y1={11.5} x2={40} y2={11.5} stroke="#ffffff" strokeWidth={1} strokeDasharray="3,2" />
          <line x1={4} y1={4.5} x2={40} y2={4.5} stroke="#ffffff" strokeWidth={0.5} strokeDasharray="2,2" />
          <line x1={4} y1={18.5} x2={40} y2={18.5} stroke="#ffffff" strokeWidth={0.5} strokeDasharray="2,2" />
          <g>
            <circle cx={12} cy={23} r={3.2} fill="#111" />
            <circle cx={12} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={20} cy={23} r={3.2} fill="#111" />
            <circle cx={20} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={46} cy={23} r={3.2} fill="#111" />
            <circle cx={46} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 6. Half Body Truck - Open
  if (cleanName === "half body truck open") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={6} y={20} width={45} height={1.8} fill="#333" rx={0.5} />
          <path d="M40 9 h 10 l 6 6 v 7 h -16 z" fill="#f8fafc" />
          <path d="M45 11 h 4.5 L 52.5 15 H 45 Z" fill="#1e293b" />
          <rect x={51} y={18} width={3} height={3} rx={0.5} fill="#334155" />
          <circle cx={52.5} cy={16.5} r={0.8} fill="#fbbf24" />
          <rect x={4} y={11.5} width={36} height={7.5} rx={0.5} fill="#f1f5f9" />
          <rect x={4} y={4} width={36} height={7.5} rx={0.5} fill="#ec4899" />
          <g>
            <circle cx={12} cy={23} r={3.2} fill="#111" />
            <circle cx={12} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={20} cy={23} r={3.2} fill="#111" />
            <circle cx={20} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={46} cy={23} r={3.2} fill="#111" />
            <circle cx={46} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 7. Small Truck - Eicher Type
  if (cleanName === "small truck eicher type") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={6} y={20} width={45} height={1.8} fill="#333" rx={0.5} />
          <path d="M42 10 h 8 l 6 6 v 5 h -14 z" fill="#f8fafc" />
          <path d="M46 12 h 3.5 L 52.5 16 H 46 Z" fill="#1e293b" />
          <circle cx={53.5} cy={17.5} r={0.7} fill="#fbbf24" />
          <rect x={4} y={13} width={38} height={7} rx={0.5} fill="#ec4899" />
          <line x1={4} y1={5} x2={42} y2={5} stroke="#f1f5f9" strokeWidth={1} />
          {[4, 11, 18, 25, 32, 38, 42].map((xVal) => (
            <line key={xVal} x1={xVal} y1={5} x2={xVal} y2={13} stroke="#f1f5f9" strokeWidth={0.8} />
          ))}
          <g>
            <circle cx={14} cy={23} r={3.2} fill="#111" />
            <circle cx={14} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={48} cy={23} r={3.2} fill="#111" />
            <circle cx={48} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 8. Pickup Truck - Bolero Type
  if (cleanName === "pickup truck bolero type") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={6} y={20} width={42} height={1.5} fill="#333" rx={0.5} />
          <path d="M 32 21 V 11 H 38 L 41 15 H 47 V 21 Z" fill="#f8fafc" />
          <path d="M 34 13 H 37 L 39 15 H 34 Z" fill="#1e293b" />
          <circle cx={45.5} cy={17.5} r={0.7} fill="#fbbf24" />
          <rect x={4} y={13} width={28} height={7} rx={0.5} fill="#ec4899" />
          <rect x={30} y={10} width={2} height={3} fill="#f1f5f9" />
          <g>
            <circle cx={12} cy={23} r={3} fill="#111" />
            <circle cx={12} cy={23} r={1.2} fill="#999" />
          </g>
          <g>
            <circle cx={42} cy={23} r={3} fill="#111" />
            <circle cx={42} cy={23} r={1.2} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 9. Mini Truck - Tempo
  if (cleanName === "mini truck tempo") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={10} y={20} width={34} height={1.5} fill="#333" rx={0.5} />
          <path d="M 30 21 V 11 H 36 L 40 15 V 21 Z" fill="#f8fafc" />
          <path d="M 32 13 H 35 L 37.5 15 H 32 Z" fill="#1e293b" />
          <circle cx={38.5} cy={17.5} r={0.6} fill="#fbbf24" />
          <rect x={6} y={8} width={24} height={12} rx={0.5} fill="#ec4899" />
          <g>
            <circle cx={14} cy={23} r={3} fill="#111" />
            <circle cx={14} cy={23} r={1.2} fill="#999" />
          </g>
          <g>
            <circle cx={35} cy={23} r={3} fill="#111" />
            <circle cx={35} cy={23} r={1.2} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  // 10. Any Truck Type
  if (cleanName === "any truck type") {
    return (
      <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
        <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x={6} y={20} width={45} height={1.8} fill="#333" rx={0.5} />
          <path d="M40 9 h 10 l 6 6 v 7 h -16 z" fill="#f8fafc" />
          <path d="M45 11 h 4.5 L 52.5 15 H 45 Z" fill="#1e293b" />
          <rect x={51} y={18} width={3} height={3} rx={0.5} fill="#334155" />
          <circle cx={52.5} cy={16.5} r={0.8} fill="#fbbf24" />
          <rect x={4} y={4} width={36} height={15} rx={1} fill="#ec4899" />
          <rect x={6} y={8} width={32} height={7} rx={1} fill="#ffffff" />
          <text x={22} y={13.5} textAnchor="middle" fill="#ec4899" fontSize={4} fontWeight="900" fontFamily="sans-serif">ANY SIZE</text>
          <g>
            <circle cx={12} cy={23} r={3.2} fill="#111" />
            <circle cx={12} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={20} cy={23} r={3.2} fill="#111" />
            <circle cx={20} cy={23} r={1.5} fill="#999" />
          </g>
          <g>
            <circle cx={46} cy={23} r={3.2} fill="#111" />
            <circle cx={46} cy={23} r={1.5} fill="#999" />
          </g>
        </svg>
      </div>
    );
  }

  const lowerName = name.toLowerCase();

  // Parse lines of text to overlay on the container
  let line1 = "";
  let line2 = "";

  if (lowerName.includes("close body")) {
    line2 = "Close Body";
  } else if (lowerName.includes("open body")) {
    line2 = "Open Body";
  } else if (lowerName.includes("flat bed") || lowerName.includes("flatbed")) {
    line2 = "Flat Bed";
  } else if (lowerName.includes("open trailer")) {
    line2 = "Open Trailer";
  } else {
    line2 = "";
  }

  // Extract specs (e.g. "22 Feet", "14 Tyre", etc.)
  if (lowerName.includes("feet") || lowerName.includes("ft")) {
    const match = name.match(/(\d+\s*(?:Feet|Ft))/i);
    line1 = match ? match[0] : "";
    
    // Add MXL/SXL if present
    if (lowerName.includes("(mxl)")) line1 += " (MXL)";
    if (lowerName.includes("(sxl)")) line1 += " (SXL)";
  } else if (lowerName.includes("tyre")) {
    const match = name.match(/(\d+\s*Tyre)/i);
    line1 = match ? match[0] : "";
  } else if (lowerName.includes("tata ace")) {
    line1 = "Tata Ace";
    if (!line2) line2 = "Open Body";
  } else if (lowerName.includes("bolero")) {
    const match = name.match(/(\d+\s*Feet)/i);
    line1 = `Bolero ${match ? match[0] : ""}`;
  } else if (lowerName.includes("tempo") || lowerName.includes("3 wheeler")) {
    line1 = "3 Wheeler";
    line2 = "Tempo";
  } else if (lowerName.includes("concrete")) {
    line1 = "Concrete";
    line2 = "Mixture";
  } else if (lowerName.includes("bulker")) {
    line1 = "Bulker";
    line2 = "Truck";
  } else if (lowerName.includes("carrier")) {
    line1 = "Vehicle";
    line2 = "Carrier";
  } else if (lowerName.includes("tipper")) {
    line1 = "Tipper";
    line2 = "Truck";
  } else if (lowerName.includes("tanker")) {
    line1 = "Tanker";
    line2 = "";
  } else {
    // Fallback: first word
    line1 = name.split(" ")[0] || "Truck";
  }

  // Determine type of vehicle illustration to render
  let type: "closed" | "open" | "trailer" | "tanker" | "mixer" | "bulker" | "carrier" | "tipper" | "tempo" | "small" = "closed";

  if (lowerName.includes("tanker")) {
    type = "tanker";
  } else if (lowerName.includes("flat") || lowerName.includes("trailer")) {
    type = "trailer";
  } else if (lowerName.includes("concrete") || lowerName.includes("mixer") || lowerName.includes("mixture")) {
    type = "mixer";
  } else if (lowerName.includes("bulker")) {
    type = "bulker";
  } else if (lowerName.includes("carrier")) {
    type = "carrier";
  } else if (lowerName.includes("tipper")) {
    type = "tipper";
  } else if (lowerName.includes("3 wheeler") || lowerName.includes("tempo")) {
    type = "tempo";
  } else if (lowerName.includes("tata ace") || lowerName.includes("carry")) {
    type = "small";
  } else if (lowerName.includes("open body")) {
    type = "open";
  }

  // Dynamic wheels based on "Tyre" or size
  const renderWheels = (count: number, startX = 10, spacing = 8) => {
    const wheels = [];
    for (let i = 0; i < count; i++) {
      wheels.push(
        <g key={i}>
          {/* Outer tyre */}
          <circle cx={startX + i * spacing} cy={23} r={3.2} fill="#111" />
          {/* Inner rim */}
          <circle cx={startX + i * spacing} cy={23} r={1.5} fill="#999" />
          {/* Center dot */}
          <circle cx={startX + i * spacing} cy={23} r={0.6} fill="#444" />
        </g>
      );
    }
    return wheels;
  };

  // Determine rear wheels count
  let rearWheelsCount = 2;
  if (lowerName.includes("22 tyre") || lowerName.includes("20 tyre") || lowerName.includes("18 tyre")) {
    rearWheelsCount = 3;
  } else if (lowerName.includes("12 tyre") || lowerName.includes("14 tyre") || lowerName.includes("16 tyre")) {
    rearWheelsCount = 2;
  } else if (type === "small" || type === "tempo") {
    rearWheelsCount = 1;
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ minWidth: "75px" }}>
      <svg viewBox="0 0 72 30" className="w-[72px] h-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Chassis / Under-guard */}
        <rect x={type === "tempo" ? 12 : 6} y={20} width={type === "tempo" ? 34 : 45} height={1.8} fill="#333" rx={0.5} />

        {/* Dynamic Graphic Body */}
        {type === "closed" && (
          <>
            {/* Cargo Box Container (Pink/Rose) */}
            <rect x={4} y={3} width={38} height={16} rx={1} fill="#ec4899" />
            <rect x={4.5} y={3.5} width={37} height={15} rx={0.5} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
            
            {/* Split Lines for text styling */}
            <text x={23} y={9} textAnchor="middle" fill="#fff" fontSize={4.2} fontWeight="800" fontFamily="sans-serif" letterSpacing={0.1}>
              {line1.toUpperCase()}
            </text>
            <text x={23} y={15} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize={3.8} fontWeight="700" fontFamily="sans-serif">
              {line2.toUpperCase()}
            </text>
          </>
        )}

        {type === "open" && (
          <>
            {/* Cargo Box Container Open Rack */}
            {/* Bottom solid pink board */}
            <rect x={4} y={11} width={38} height={8} rx={0.5} fill="#ec4899" />
            
            {/* Top open grid bars */}
            <line x1={4} y1={3} x2={42} y2={3} stroke="#ec4899" strokeWidth={1} />
            {[8, 14, 20, 26, 32, 38].map((xVal) => (
              <line key={xVal} x1={xVal} y1={3} x2={xVal} y2={11} stroke="#ec4899" strokeWidth={0.8} />
            ))}

            <text x={23} y={17} textAnchor="middle" fill="#fff" fontSize={4} fontWeight="800" fontFamily="sans-serif">
              {line1.toUpperCase()}
            </text>
          </>
        )}

        {type === "trailer" && (
          <>
            {/* Flatbed Trailer bed */}
            <rect x={4} y={15} width={42} height={4} rx={0.5} fill="#3b82f6" />
            {/* Rear vertical cargo stops */}
            <rect x={4} y={8} width={1} height={7} fill="#3b82f6" />
            <rect x={18} y={11} width={1} height={4} fill="#3b82f6" />
            <rect x={32} y={11} width={1} height={4} fill="#3b82f6" />

            <text x={25} y={13} textAnchor="middle" fill="#3b82f6" fontSize={4.5} fontWeight="800" fontFamily="sans-serif">
              FLAT BED
            </text>
          </>
        )}

        {type === "tanker" && (
          <>
            {/* Tanker Cylinder (Pill shape) */}
            <rect x={4} y={4} width={38} height={14} rx={7} fill="#f43f5e" />
            {/* Metal bands around tank */}
            <line x1={12} y1={4} x2={12} y2={18} stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />
            <line x1={24} y1={4} x2={24} y2={18} stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />
            <line x1={34} y1={4} x2={34} y2={18} stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />

            <text x={23} y={12} textAnchor="middle" fill="#fff" fontSize={4.5} fontWeight="800" fontFamily="sans-serif" letterSpacing={0.2}>
              {line1.toUpperCase() || "TANKER"}
            </text>
          </>
        )}

        {type === "mixer" && (
          <>
            {/* Concrete Mixer Slanted Drum */}
            <path d="M 6 15 L 12 5 L 34 8 L 38 15 L 34 18 L 12 18 Z" fill="#ec4899" />
            <line x1={12} y1={5} x2={34} y2={18} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
            
            <text x={22} y={13} textAnchor="middle" fill="#fff" fontSize={4.2} fontWeight="800" fontFamily="sans-serif">
              MIXER
            </text>
          </>
        )}

        {type === "bulker" && (
          <>
            {/* Dry bulk silos */}
            <path d="M4 11 C4 6, 12 6, 14 11 L22 11 C22 6, 30 6, 32 11 L42 11 L42 19 L4 19 Z" fill="#db2777" />
            
            <text x={20} y={16} textAnchor="middle" fill="#fff" fontSize={4.2} fontWeight="800" fontFamily="sans-serif">
              BULK
            </text>
          </>
        )}

        {type === "carrier" && (
          <>
            {/* Double deck car carrier */}
            {/* Top Deck */}
            <line x1={4} y1={6} x2={43} y2={6} stroke="#e11d48" strokeWidth={1.2} />
            {/* Bottom Deck */}
            <line x1={4} y1={13} x2={43} y2={13} stroke="#e11d48" strokeWidth={1.2} />
            {/* Vertical Support columns */}
            <line x1={6} y1={6} x2={6} y2={20} stroke="#888" strokeWidth={0.8} />
            <line x1={20} y1={6} x2={20} y2={20} stroke="#888" strokeWidth={0.8} />
            <line x1={34} y1={6} x2={34} y2={20} stroke="#888" strokeWidth={0.8} />
            <line x1={42} y1={6} x2={42} y2={20} stroke="#888" strokeWidth={0.8} />
          </>
        )}

        {type === "tipper" && (
          <>
            {/* Tipper dumper body */}
            <path d="M 4 5 L 38 5 L 42 14 L 42 19 L 4 19 Z" fill="#ec4899" />
            <line x1={4} y1={5} x2={42} y2={19} stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />

            <text x={21} y={12} textAnchor="middle" fill="#fff" fontSize={4.5} fontWeight="800" fontFamily="sans-serif">
              TIPPER
            </text>
          </>
        )}

        {type === "tempo" && (
          <>
            {/* 3 Wheeler tempo */}
            {/* Cab */}
            <path d="M 32 10 L 40 10 L 44 15 L 44 21 L 30 21 Z" fill="#ccc" />
            <rect x={35} y={12} width={5} height={5} fill="#222" />
            {/* Cargo rear body */}
            <rect x={14} y={9} width={17} height={11} rx={0.5} fill="#ec4899" />

            <text x={22.5} y={16} textAnchor="middle" fill="#fff" fontSize={3.8} fontWeight="800" fontFamily="sans-serif">
              TEMPO
            </text>
          </>
        )}

        {type === "small" && (
          <>
            {/* Tata Ace / Pickup truck */}
            {/* Cab */}
            <path d="M 32 10 L 38 10 L 42 15 L 42 21 L 30 21 Z" fill="#f3f4f6" />
            <rect x={35} y={12} width={4} height={5} fill="#222" />
            {/* Small open body rear */}
            <rect x={6} y={13} width={24} height={7} rx={0.5} fill="#ec4899" />
            <line x1={6} y1={9} x2={30} y2={9} stroke="#ec4899" strokeWidth={0.8} />
            <line x1={12} y1={9} x2={12} y2={13} stroke="#ec4899" strokeWidth={0.5} />
            <line x1={20} y1={9} x2={20} y2={13} stroke="#ec4899" strokeWidth={0.5} />

            <text x={18} y={18} textAnchor="middle" fill="#fff" fontSize={3.5} fontWeight="800" fontFamily="sans-serif">
              ACE
            </text>
          </>
        )}

        {/* Standard Front Cabin (used for standard trucks: closed, open, trailer, tanker, mixer, bulker, carrier, tipper) */}
        {(type !== "tempo" && type !== "small") && (
          <>
            {/* White Cabin */}
            <path d="M42 9 h 8 l 6 6 v 7 h -14 z" fill="#f8fafc" />
            
            {/* Windshield window (black) */}
            <path d="M47 11 h 3.5 L 53.5 15 H 47 Z" fill="#1e293b" />
            
            {/* Front Grill / Bumper */}
            <rect x={53} y={18} width={3} height={3} rx={0.5} fill="#334155" />
            
            {/* Headlight (Yellow dot) */}
            <circle cx={54.5} cy={16.5} r={0.8} fill="#fbbf24" />
          </>
        )}

        {/* Dynamic Wheels Rendering */}
        {/* Rear Wheels */}
        {type === "tempo" ? (
          <>
            {/* 3 Wheeler wheels: 1 rear, 1 front */}
            <g>
              <circle cx={19} cy={23} r={3.2} fill="#111" />
              <circle cx={19} cy={23} r={1.5} fill="#999" />
            </g>
            <g>
              <circle cx={40} cy={23} r={3.2} fill="#111" />
              <circle cx={40} cy={23} r={1.5} fill="#999" />
            </g>
          </>
        ) : type === "small" ? (
          <>
            <g>
              <circle cx={12} cy={23} r={3} fill="#111" />
              <circle cx={12} cy={23} r={1.2} fill="#999" />
            </g>
            <g>
              <circle cx={36} cy={23} r={3} fill="#111" />
              <circle cx={36} cy={23} r={1.2} fill="#999" />
            </g>
          </>
        ) : (
          <>
            {/* Standard Front Wheel */}
            <g>
              <circle cx={48} cy={23} r={3.2} fill="#111" />
              <circle cx={48} cy={23} r={1.5} fill="#999" />
              <circle cx={48} cy={23} r={0.6} fill="#444" />
            </g>
            {/* Rear Wheels */}
            {renderWheels(rearWheelsCount, 12, rearWheelsCount === 3 ? 7.5 : 8.5)}
          </>
        )}
      </svg>
    </div>
  );
}
