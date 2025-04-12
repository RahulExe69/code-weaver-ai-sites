
import React from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  active: boolean;
  id: string;
  children: React.ReactNode;
}

const Panel = ({ active, id, children }: PanelProps) => {
  return (
    <div 
      id={`${id}-panel`}
      className={cn(
        "h-[calc(100vh-48px)] w-full transition-all duration-300 transform",
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
      )}
      aria-hidden={!active}
      role="tabpanel"
    >
      {children}
    </div>
  );
};

export default Panel;
