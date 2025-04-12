
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
        "h-[calc(100vh-48px)] w-full",
        active ? "flex" : "hidden"
      )}
    >
      {children}
    </div>
  );
};

export default Panel;
