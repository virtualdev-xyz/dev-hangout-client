import React from 'react';

/**
 * Loading screen component displayed while the persisted state is being rehydrated
 */
export const LoadingScreen: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0A0A1F',
      color: '#00FFFF',
      fontFamily: '"Press Start 2P", monospace',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>DevHangout</h1>
        <div style={{ fontSize: '16px', marginBottom: '32px' }}>Loading World...</div>
        <div style={{ 
          width: '240px', 
          height: '16px', 
          backgroundColor: '#001100',
          border: '2px solid #00FF00',
          padding: '2px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              backgroundColor: '#00FF00',
              animation: 'progress 2s ease-in-out infinite alternate',
            }}
          />
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            70% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};