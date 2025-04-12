
import React, { useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeEditor = ({ value, onChange, language }: CodeEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    updateLineNumbers();
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      // Insert tab at cursor position
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor after the inserted tab
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const updateLineNumbers = () => {
    if (!lineNumbersRef.current || !editorRef.current) return;
    
    const lineCount = (value.match(/\n/g) || []).length + 1;
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
    lineNumbersRef.current.innerText = lineNumbers;
  };

  // Sync scroll between line numbers and editor
  const handleScroll = () => {
    if (lineNumbersRef.current && editorRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  useEffect(() => {
    updateLineNumbers();
  }, [value]);

  // Get syntax highlighting class based on language
  const getLanguageClass = () => {
    switch (language) {
      case 'html': return 'language-html';
      case 'css': return 'language-css';
      case 'javascript': return 'language-javascript';
      default: return 'language-plaintext';
    }
  };

  return (
    <div className="flex-1 h-full relative flex flex-col bg-slate-900">
      <div className="border-b border-slate-700 p-2 flex items-center gap-2 text-slate-300 bg-slate-800">
        <FileText size={16} className="text-blue-400" />
        <span className="font-mono text-sm">{language.toUpperCase()} Editor</span>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative font-mono">
        {/* Line numbers */}
        <div 
          ref={lineNumbersRef}
          className="w-12 bg-slate-800 text-slate-500 text-right pr-2 py-3 overflow-hidden whitespace-pre-line text-sm"
        ></div>
        
        {/* Editor */}
        <div className="flex-1 relative overflow-hidden">
          <textarea
            ref={editorRef}
            className={`code-editor absolute inset-0 w-full h-full bg-slate-900 p-3 pl-4 text-slate-200 border-none resize-none focus:outline-none text-sm leading-relaxed ${getLanguageClass()}`}
            value={value}
            onChange={handleChange}
            onKeyDown={handleTab}
            onScroll={handleScroll}
            spellCheck="false"
          />
        </div>
      </div>
      
      <div className="border-t border-slate-700 p-2 flex justify-between text-xs text-slate-500">
        <div>
          {language.charAt(0).toUpperCase() + language.slice(1)} syntax
        </div>
        <div>
          {(value.match(/\n/g) || []).length + 1} lines
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
