
import React from 'react';
import { cn } from '@/lib/utils';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => {
  return (
    <div 
      className={cn(
        "px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-1",
        "hover:bg-slate-800/80 relative",
        active ? 
          "text-white font-medium" : 
          "text-slate-400 hover:text-slate-200"
      )}
      onClick={onClick}
      role="tab"
      aria-selected={active}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500" />
      )}
    </div>
  );
};

export default TabButton;
