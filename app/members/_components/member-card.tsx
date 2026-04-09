"use client";

import { useState, MouseEvent } from "react";
import { User } from "lucide-react";

interface MemberCardProps {
  name: string;
  nameKr: string;
  role: string;
  badges?: string[];
  photoUrl?: string;
  currentPosition?: string;
}

export function MemberCard({ 
  name, 
  nameKr, 
  role, 
  badges, 
  photoUrl,
  currentPosition
}: MemberCardProps) {
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0
  });

  const hasTooltipInfo = role || currentPosition;

  const handleMouseEnter = () => {
    if (hasTooltipInfo) {
      setTooltip(prev => ({ ...prev, visible: true }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (hasTooltipInfo) {
      setTooltip({
        visible: true,
        x: e.clientX + 15,
        y: e.clientY - 40
      });
    }
  };

  return (
    <>
      <div 
        className="group rounded-lg border border-border bg-card overflow-hidden transition-colors hover:bg-accent/50 relative cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Photo - Unified size for all members */}
        <div className="aspect-3/4 bg-[#1a1a2e] flex items-center justify-center relative">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-gray-600" />
          )}
        </div>
        
        <div className="p-3">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-gray-500">{nameKr}</p>
          <p className="text-xs text-gray-400 mt-0.5">{role}</p>
          {badges && badges.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {badges.map((b) => (
                <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-800/50">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mouse-following Tooltip */}
      {tooltip.visible && hasTooltipInfo && (
        <div 
          className="fixed z-[100] pointer-events-none"
          style={{ 
            left: tooltip.x, 
            top: tooltip.y,
          }}
        >
          <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            {role && (
              <div className="mb-1.5">
                <p className="text-gray-400 text-[10px] mb-0.5">직책</p>
                <p className="text-white text-xs">{role}</p>
              </div>
            )}
            {currentPosition && (
              <div>
                <p className="text-gray-400 text-[10px] mb-0.5">현재 직장/소속 (졸업 후)</p>
                <p className="text-white text-xs">{currentPosition}</p>
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1a2e] border-r border-b border-white/10 rotate-45"></div>
        </div>
      )}
    </>
  );
}
