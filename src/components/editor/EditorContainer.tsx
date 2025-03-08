import React, { useState, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { FileBrowser } from './FileBrowser';
import { FileNode } from '../../network/socket/types';
import { useSocket } from '../../hooks/useSocket';

interface EditorContainerProps {
  roomId: string;
}

export const EditorContainer: React.FC<EditorContainerProps> = ({ roomId }) => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const { emit } = useSocket();

  const handleFileSelect = useCallback((file: FileNode) => {
    setSelectedFile(file);
    if (file.type === 'file') {
      // Request file content
      emit('files:list', { path: file.id });
    }
  }, [emit]);

  const handleContentChange = useCallback((content: string) => {
    setEditorContent(content);
    if (selectedFile) {
      // Update file content
      emit('files:update', {
        id: selectedFile.id,
        content,
      });
    }
  }, [selectedFile, emit]);

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: '#1E1E1E',
    }}>
      <div style={{
        width: '250px',
        borderRight: '1px solid #333',
        overflow: 'hidden',
      }}>
        <FileBrowser
          onFileSelect={handleFileSelect}
          initialPath="/"
        />
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {selectedFile ? (
          <>
            <div style={{
              padding: '8px 16px',
              borderBottom: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#2A2A2A',
            }}>
              <span style={{
                fontFamily: '"Source Code Pro", monospace',
                fontSize: '14px',
                color: '#D4D4D4',
              }}>
                {selectedFile.name}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <CodeEditor
                initialValue={selectedFile.content || ''}
                language={selectedFile.extension}
                onContentChange={handleContentChange}
                roomId={`${roomId}:${selectedFile.id}`}
              />
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontFamily: '"Source Code Pro", monospace',
            fontSize: '14px',
          }}>
            Select a file to edit
          </div>
        )}
      </div>
    </div>
  );
}; 