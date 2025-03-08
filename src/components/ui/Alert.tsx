interface AlertProps {
  children: React.ReactNode;
  variant?: 'error' | 'success' | 'warning';
}

export function Alert({ children, variant = 'error' }: AlertProps) {
  const variantStyles = {
    error: 'bg-digitalRed/20 text-digitalRed border-digitalRed',
    success: 'bg-powerUpGreen/20 text-powerUpGreen border-powerUpGreen',
    warning: 'bg-bitYellow/20 text-bitYellow border-bitYellow'
  };

  return (
    <div className={`px-4 py-2 border-2 border-pixelDashed font-subheading text-sm ${variantStyles[variant]}`}>
      {children}
    </div>
  );
} 