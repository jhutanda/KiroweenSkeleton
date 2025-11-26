import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2,
  Quote,
  Code,
  Link,
  Image,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleSelect = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  const insertFormatting = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = value.substring(0, start) + text + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertFormatting('**', '**'), title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: () => insertFormatting('*', '*'), title: 'Italic (Ctrl+I)' },
    { icon: Underline, action: () => insertFormatting('<u>', '</u>'), title: 'Underline' },
    { icon: Heading1, action: () => insertAtCursor('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertAtCursor('## '), title: 'Heading 2' },
    { icon: List, action: () => insertAtCursor('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertAtCursor('1. '), title: 'Numbered List' },
    { icon: Quote, action: () => insertAtCursor('> '), title: 'Quote' },
    { icon: Code, action: () => insertFormatting('`', '`'), title: 'Inline Code' },
    { icon: Link, action: () => insertFormatting('[', '](url)'), title: 'Link' },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-600">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title={button.title}
          >
            <button.icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        ))}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        placeholder={placeholder || 'Start writing your note...'}
        className="w-full h-[400px] p-4 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
      />

      {/* Helper Text */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Markdown supported:</span> **bold**, *italic*, # heading, - list,{'>'} quote, `code`, [link](url)
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;