
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
        "h-[calc(100vh-48px)] w-full transition-opacity duration-150",
        active ? "flex opacity-100" : "hidden opacity-0"
      )}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
};

export default Panel;
