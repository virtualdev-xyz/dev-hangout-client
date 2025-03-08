import React, { useState } from 'react';
import { EditorContainer } from '../components/editor/EditorContainer';
import { Whiteboard } from '../components/editor/Whiteboard';

interface DevWorkspaceProps {
  roomId: string;
  userId: string;
}

type WorkspaceTab = 'code' | 'whiteboard';

export const DevWorkspace: React.FC<DevWorkspaceProps> = ({ roomId, userId }) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('code');

  const renderTab = () => {
    switch (activeTab) {
      case 'code':
        return <EditorContainer roomId={`${roomId}:editor`} />;
      case 'whiteboard':
        return <Whiteboard roomId={`${roomId}:whiteboard`} userId={userId} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100vh',
      backgroundColor: '#1E1E1E',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: '#2A2A2A',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <h1 style={{
          margin: 0,
          color: '#D4D4D4',
          fontSize: '18px',
          fontFamily: '"Source Code Pro", monospace',
        }}>
          DevHangout Workspace
        </h1>
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          <button
            onClick={() => setActiveTab('code')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'code' ? '#4EC9B0' : '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: '"Source Code Pro", monospace',
              fontSize: '14px',
              transition: 'background-color 0.2s',
            }}
          >
            🖥️ Code Editor
          </button>
          <button
            onClick={() => setActiveTab('whiteboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'whiteboard' ? '#4EC9B0' : '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: '"Source Code Pro", monospace',
              fontSize: '14px',
              transition: 'background-color 0.2s',
            }}
          >
            🎨 Whiteboard
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {renderTab()}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '4px 16px',
        backgroundColor: '#2A2A2A',
        borderTop: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#666',
        fontSize: '12px',
        fontFamily: '"Source Code Pro", monospace',
      }}>
        <div>
          Room: {roomId}
        </div>
        <div>
          User: {userId}
        </div>
      </div>
    </div>
  );
}; 