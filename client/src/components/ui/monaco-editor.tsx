import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export default function MonacoEditor({
  value,
  onChange,
  language,
  height = '400px',
  theme = 'vs-dark',
  options = {},
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Configure Monaco Editor theme
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1a1a2e',
          'editor.foreground': '#f8f8f2',
          'editorLineNumber.foreground': '#6272a4',
          'editorCursor.foreground': '#f8f8f0',
          'editor.selectionBackground': '#44475a',
          'editor.lineHighlightBackground': '#44475a',
        },
      });

      // Create editor instance
      editorInstanceRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: theme === 'vs-dark' ? 'custom-dark' : theme,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Monaco, monospace',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        automaticLayout: true,
        ...options,
      });

      // Set up onChange listener
      const model = editorInstanceRef.current.getModel();
      if (model) {
        model.onDidChangeContent(() => {
          const newValue = editorInstanceRef.current?.getValue() || '';
          onChange(newValue);
        });
      }
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
      }
    };
  }, []);

  // Update value when prop changes
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.getValue() !== value) {
      editorInstanceRef.current.setValue(value);
    }
  }, [value]);

  // Update language when prop changes
  useEffect(() => {
    if (editorInstanceRef.current) {
      const model = editorInstanceRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return <div ref={editorRef} style={{ height }} className="rounded-lg overflow-hidden" />;
}
