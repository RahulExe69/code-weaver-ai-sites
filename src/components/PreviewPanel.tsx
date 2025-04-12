
import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Smartphone, Tablet, Monitor, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

const PreviewPanel = ({ html, css, js }: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updatePreview();
  }, [html, css, js]);

  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    setIsLoading(true);
    
    const content = html
      .replace('</head>', `<style>${css}</style></head>`)
      .replace('</body>', `<script>${js}</script></body>`);

    iframeRef.current.srcdoc = content;
    
    // Wait for iframe to load
    iframeRef.current.onload = () => {
      setIsLoading(false);
    };
  };

  const handleRefresh = () => {
    updatePreview();
  };

  // Get viewport class based on selected size
  const getViewportClass = () => {
    switch (viewportSize) {
      case 'mobile': return 'w-[375px] h-full mx-auto border-x border-slate-700 shadow-lg';
      case 'tablet': return 'w-[768px] h-full mx-auto border-x border-slate-700 shadow-lg';
      case 'desktop': return 'w-full h-full';
      default: return 'w-full h-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="border-b border-slate-700 p-2 flex items-center justify-between bg-slate-800">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-8 w-8 ${viewportSize === 'mobile' ? 'bg-slate-700' : ''}`}
            onClick={() => setViewportSize('mobile')}
            title="Mobile view"
          >
            <Smartphone size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-8 w-8 ${viewportSize === 'tablet' ? 'bg-slate-700' : ''}`}
            onClick={() => setViewportSize('tablet')}
            title="Tablet view"
          >
            <Tablet size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-8 w-8 ${viewportSize === 'desktop' ? 'bg-slate-700' : ''}`}
            onClick={() => setViewportSize('desktop')}
            title="Desktop view"
          >
            <Monitor size={16} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className={`p-1 h-8 w-8 ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh preview"
          >
            <RefreshCw size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-8 w-8"
            title="Open in new tab"
            onClick={() => {
              const content = html
                .replace('</head>', `<style>${css}</style></head>`)
                .replace('</body>', `<script>${js}</script></body>`);
              const blob = new Blob([content], { type: 'text/html' });
              window.open(URL.createObjectURL(blob), '_blank');
            }}
          >
            <ExternalLink size={16} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 bg-white overflow-auto p-0 flex">
        <div className={getViewportClass()}>
          <iframe 
            ref={iframeRef}
            className="w-full h-full bg-white border-none"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-800 p-3 rounded-lg shadow-lg text-blue-400 flex items-center gap-2">
            <RefreshCw size={16} className="animate-spin" />
            <span>Loading preview...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
