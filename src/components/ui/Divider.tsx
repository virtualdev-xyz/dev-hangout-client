import { ReactNode } from 'react';

interface DividerProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Divider = ({ children, variant = 'primary' }: DividerProps) => {
  const lineColor = variant === 'primary' ? 'border-crtBlue' : 'border-magenta';
  const textColor = variant === 'primary' ? 'text-crtBlue' : 'text-magenta';

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full border-t-2 ${lineColor} border-pixelDashed`} />
      </div>
      {children && (
        <div className="relative flex justify-center">
          <span className={`px-2 bg-spaceBlack ${textColor} font-subheading text-sm`}>
            {children}
          </span>
        </div>
      )}
    </div>
  );
} 