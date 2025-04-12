
import React, { useEffect, useRef } from 'react';

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

const PreviewPanel = ({ html, css, js }: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updatePreview();
  }, [html, css, js]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const content = html
      .replace('</head>', `<style>${css}</style></head>`)
      .replace('</body>', `<script>${js}</script></body>`);

    iframeRef.current.srcdoc = content;
  };

  return (
    <iframe 
      ref={iframeRef}
      className="w-full h-full bg-white border-none"
      title="Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

export default PreviewPanel;
