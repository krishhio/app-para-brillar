
import React from 'react';
import { LoaderCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Cargando...", size = 12 }) => {
  return (
    <div className="flex flex-col justify-center items-center p-10 min-h-screen bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] text-[var(--brilla-text-primary)]">
      <LoaderCircle className={`animate-spin h-${size} w-${size} text-[var(--brilla-accent-light)]`} />
      <p className="mt-4 text-xl text-[var(--brilla-accent-light)] opacity-80">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
