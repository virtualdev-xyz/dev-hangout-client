import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
  icon?: string;
  extension?: string;
}

interface FileBrowserProps {
  onFileSelect: (file: FileNode) => void;
  onDirectorySelect?: (directory: FileNode) => void;
  initialPath?: string;
}

const FILE_ICONS: Record<string, string> = {
  ts: '📄',
  tsx: '⚛️',
  js: '📜',
  jsx: '⚛️',
  json: '📋',
  md: '📝',
  css: '🎨',
  scss: '🎨',
  html: '🌐',
  svg: '🖼️',
  png: '🖼️',
  jpg: '🖼️',
  gif: '🖼️',
  default: '📄',
  directory: '📁',
  directoryOpen: '📂',
};

export const FileBrowser: React.FC<FileBrowserProps> = ({
  onFileSelect,
  onDirectorySelect,
  initialPath = '/',
}) => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const { emit, on, off } = useSocket();

  useEffect(() => {
    // Request initial file list
    emit('files:list', { path: initialPath });

    const handleFileList = (fileList: FileNode[]) => {
      setFiles(fileList);
    };

    const handleFileUpdate = (file: FileNode) => {
      setFiles(prevFiles => updateFileInTree(prevFiles, file));
    };

    // Subscribe to file system events
    on('files:list', handleFileList);
    on('files:updated', handleFileUpdate);
    on('files:created', handleFileUpdate);
    on('files:deleted', (fileId: string) => {
      setFiles(prevFiles => removeFileFromTree(prevFiles, fileId));
    });

    return () => {
      off('files:list', handleFileList);
      off('files:updated', handleFileUpdate);
      off('files:created', handleFileUpdate);
      off('files:deleted', () => {});
    };
  }, [initialPath]);

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'directory') {
      return expandedDirs.has(file.id) ? FILE_ICONS.directoryOpen : FILE_ICONS.directory;
    }
    const extension = file.extension || file.name.split('.').pop() || '';
    return FILE_ICONS[extension] || FILE_ICONS.default;
  };

  const toggleDirectory = (file: FileNode) => {
    if (file.type === 'directory') {
      const newExpandedDirs = new Set(expandedDirs);
      if (expandedDirs.has(file.id)) {
        newExpandedDirs.delete(file.id);
      } else {
        newExpandedDirs.add(file.id);
        // Request directory contents if not loaded
        if (!file.children) {
          emit('files:list', { path: file.id });
        }
      }
      setExpandedDirs(newExpandedDirs);
      onDirectorySelect?.(file);
    }
  };

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'directory') {
      toggleDirectory(file);
    } else {
      setSelectedFile(file.id);
      onFileSelect(file);
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div
          className={`file-item ${selectedFile === node.id ? 'selected' : ''}`}
          style={{
            paddingLeft: `${level * 20}px`,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: selectedFile === node.id ? '#2A2A2A' : 'transparent',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
          onClick={() => handleFileClick(node)}
        >
          <span style={{ marginRight: '8px', fontSize: '16px' }}>{getFileIcon(node)}</span>
          <span style={{ 
            fontFamily: '"Source Code Pro", monospace',
            fontSize: '14px',
            color: node.type === 'directory' ? '#4EC9B0' : '#D4D4D4',
          }}>
            {node.name}
          </span>
        </div>
        {node.type === 'directory' && expandedDirs.has(node.id) && node.children && (
          <div className="file-children">
            {renderFileTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1E1E1E',
        color: '#D4D4D4',
        overflow: 'auto',
        padding: '8px',
      }}
    >
      {renderFileTree(files)}
    </div>
  );
};

// Helper functions for updating file tree
const updateFileInTree = (files: FileNode[], updatedFile: FileNode): FileNode[] => {
  return files.map(file => {
    if (file.id === updatedFile.id) {
      return { ...file, ...updatedFile };
    }
    if (file.children) {
      return {
        ...file,
        children: updateFileInTree(file.children, updatedFile),
      };
    }
    return file;
  });
};

const removeFileFromTree = (files: FileNode[], fileId: string): FileNode[] => {
  return files.filter(file => {
    if (file.id === fileId) {
      return false;
    }
    if (file.children) {
      file.children = removeFileFromTree(file.children, fileId);
    }
    return true;
  });
}; 