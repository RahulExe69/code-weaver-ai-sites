
import React from 'react';
import { cn } from '@/lib/utils';
import { FileTextIcon, FolderIcon } from 'lucide-react';

interface FileTreeProps {
  files: Record<string, string>;
  currentFile: string;
  onSelectFile: (filename: string) => void;
}

const FileTree = ({ files, currentFile, onSelectFile }: FileTreeProps) => {
  return (
    <div className="w-64 bg-darkpanel overflow-y-auto border-r border-darkborder">
      <div className="p-3 border-b border-darkborder font-semibold">
        Files
      </div>
      <div className="p-1">
        {Object.keys(files).map((filename) => (
          <div
            key={filename}
            onClick={() => onSelectFile(filename)}
            className={cn(
              "p-2 rounded cursor-pointer flex items-center gap-2",
              "hover:bg-darktab transition-colors duration-150",
              currentFile === filename ? "bg-navy/50" : ""
            )}
          >
            <FileTextIcon size={16} />
            <span>{filename}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileTree;
