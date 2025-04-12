
import React from 'react';
import { cn } from '@/lib/utils';
import { FileTextIcon, FolderIcon } from 'lucide-react';

interface FileTreeProps {
  files: Record<string, string>;
  currentFile: string;
  onSelectFile: (filename: string) => void;
}

const FileTree = ({ files, currentFile, onSelectFile }: FileTreeProps) => {
  // Helper function to determine file icon based on extension
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.html')) return '🌐';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js')) return '⚙️';
    return '📄';
  };

  return (
    <div className="w-64 bg-slate-900 overflow-y-auto border-r border-slate-700 flex flex-col">
      <div className="p-3 border-b border-slate-700 font-medium text-white flex items-center gap-2">
        <FolderIcon size={16} className="text-blue-400" />
        <span>Project Files</span>
      </div>
      <div className="p-2 flex-1">
        {Object.keys(files).map((filename) => (
          <div
            key={filename}
            onClick={() => onSelectFile(filename)}
            className={cn(
              "p-2 rounded-md cursor-pointer flex items-center gap-2 text-sm mb-1",
              "hover:bg-slate-800 transition-colors duration-150",
              currentFile === filename ? 
                "bg-blue-600/20 text-blue-400 border-l-2 border-blue-500" : 
                "text-slate-300"
            )}
          >
            <span className="text-lg flex-shrink-0">{getFileIcon(filename)}</span>
            <span className="truncate">{filename}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto p-3 border-t border-slate-700 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Project Files</span>
          <span>{Object.keys(files).length} files</span>
        </div>
      </div>
    </div>
  );
};

export default FileTree;
