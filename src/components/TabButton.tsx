
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
        "px-5 py-3 cursor-pointer border-r border-darkborder",
        "transition-colors duration-200 hover:bg-navy/80",
        active ? "bg-navy" : "bg-darktab"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default TabButton;
