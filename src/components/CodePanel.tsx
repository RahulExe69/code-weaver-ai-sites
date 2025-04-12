
import React from 'react';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';

interface CodePanelProps {
  files: Record<string, string>;
  currentFile: string;
  onSelectFile: (filename: string) => void;
  onUpdateFile: (content: string) => void;
}

const CodePanel = ({ files, currentFile, onSelectFile, onUpdateFile }: CodePanelProps) => {
  const getLanguage = () => {
    if (currentFile.endsWith('.html')) return 'html';
    if (currentFile.endsWith('.css')) return 'css';
    if (currentFile.endsWith('.js')) return 'javascript';
    return 'text';
  };

  return (
    <div className="flex h-full">
      <FileTree 
        files={files} 
        currentFile={currentFile} 
        onSelectFile={onSelectFile} 
      />
      <CodeEditor 
        value={files[currentFile] || ''} 
        onChange={onUpdateFile}
        language={getLanguage()}
      />
    </div>
  );
};

export default CodePanel;
