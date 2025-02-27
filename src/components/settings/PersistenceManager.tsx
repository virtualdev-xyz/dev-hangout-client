import React, { useState } from 'react';
import { usePersistence } from '../../hooks/usePersistence';

/**
 * Component to manage persistence settings
 */
export const PersistenceManager: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { purgeState, flushState } = usePersistence();

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all saved game data? This action cannot be undone.')) {
      setIsResetting(true);
      await purgeState();
      window.location.reload();
    }
  };

  const handleSave = async () => {
    await flushState();
    alert('Game state saved successfully!');
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#0A0A1F',
      border: '2px solid #00FFFF',
      color: '#FFFFFF',
      fontFamily: '"Share Tech Mono", monospace',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h3 style={{ color: '#00FFFF', textAlign: 'center', marginTop: 0 }}>Game Data Settings</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <p>Game progress is automatically saved to your browser's local storage.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#00BBBB',
            color: '#000000',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            flex: 1
          }}
        >
          Save Now
        </button>
        
        <button
          onClick={handleReset}
          disabled={isResetting}
          style={{
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 16px',
            cursor: isResetting ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            flex: 1
          }}
        >
          {isResetting ? 'Resetting...' : 'Reset Data'}
        </button>
      </div>
    </div>
  );
};