import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useSocket } from '../../hooks/useSocket';
import { EditorChange } from '../../network/socket/types';

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  theme?: 'retro-dark' | 'retro-light';
  readOnly?: boolean;
  onContentChange?: (content: string) => void;
  roomId: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = '',
  language = 'typescript',
  theme = 'retro-dark',
  readOnly = false,
  onContentChange,
  roomId,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { emit, on, off } = useSocket();

  // Define retro theme
  const defineTheme = () => {
    monaco.editor.defineTheme('retro-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2A2A2A',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
      },
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      defineTheme();

      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: initialValue,
        language,
        theme: 'retro-dark',
        fontSize: 14,
        fontFamily: '"Source Code Pro", monospace',
        minimap: { enabled: false },
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly,
        automaticLayout: true,
        cursorStyle: 'block',
        cursorBlinking: 'solid',
        renderLineHighlight: 'all',
        contextmenu: true,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: true,
          horizontalHasArrows: true,
          vertical: 'visible',
          horizontal: 'visible',
        },
      });

      setIsEditorReady(true);

      // Join editor room
      emit('editor:join', roomId);

      // Handle collaborative editing
      monacoEditorRef.current.onDidChangeModelContent((event: monaco.editor.IModelContentChangedEvent) => {
        if (event.changes.length > 0) {
          const change: EditorChange = {
            roomId,
            changes: event.changes,
            version: monacoEditorRef.current?.getModel()?.getVersionId() || 0,
            timestamp: Date.now(),
          };
          emit('editor:change', change);
          onContentChange?.(monacoEditorRef.current?.getValue() || '');
        }
      });

      // Handle cursor position changes
      monacoEditorRef.current.onDidChangeCursorPosition((event: monaco.editor.ICursorPositionChangedEvent) => {
        emit('editor:cursor', {
          roomId,
          position: {
            x: event.position.column,
            y: event.position.lineNumber,
          },
        });
      });

      return () => {
        emit('editor:leave', roomId);
        monacoEditorRef.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const handleEditorChange = (change: EditorChange) => {
      if (change.roomId === roomId && monacoEditorRef.current) {
        const model = monacoEditorRef.current.getModel();
        if (model) {
          // Apply remote changes
          model.pushEditOperations(
            [],
            change.changes.map((c) => ({
              range: new monaco.Range(
                c.range.startLineNumber,
                c.range.startColumn,
                c.range.endLineNumber,
                c.range.endColumn
              ),
              text: c.text,
            })),
            () => null
          );
        }
      }
    };

    // Subscribe to collaborative editing events
    on('editor:change', handleEditorChange);

    return () => {
      off('editor:change', handleEditorChange);
    };
  }, [roomId, on, off]);

  // Handle content updates
  useEffect(() => {
    if (isEditorReady && monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model && model.getValue() !== initialValue) {
        model.setValue(initialValue);
      }
    }
  }, [isEditorReady, initialValue]);

  return (
    <div 
      ref={editorRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        border: '1px solid #333',
        borderRadius: '4px',
        overflow: 'hidden',
      }} 
    />
  );
}; 