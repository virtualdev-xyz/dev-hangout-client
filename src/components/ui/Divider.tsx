import { ReactNode } from 'react';

interface DividerProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Divider = ({ children, variant = 'primary' }: DividerProps) => {
  const lineColor = variant === 'primary' ? '#4EC9B0' : '#FF00FF';
  const textColor = variant === 'primary' ? '#4EC9B0' : '#FF00FF';

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '100%',
          borderTop: `2px dashed ${lineColor}`
        }} />
      </div>
      {children && (
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <span style={{
            paddingLeft: '8px',
            paddingRight: '8px',
            backgroundColor: '#1E1E1E',
            color: textColor,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px'
          }}>
            {children}
          </span>
        </div>
      )}
    </div>
  );
}