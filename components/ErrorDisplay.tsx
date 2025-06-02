
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, title = "¡Oops! Algo salió mal." }) => {
  // Error colors are intentionally kept distinct and not themed with primary theme colors
  return (
    <div 
      className="bg-red-900/30 border border-red-700/50 text-red-200 px-6 py-5 rounded-xl shadow-2xl max-w-md mx-auto text-center my-8" 
      role="alert"
    >
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-3" />
        <strong className="font-bold block text-xl text-red-300">{title}</strong>
        <span className="block sm:inline mt-2 text-red-300/90">{message}</span>
      </div>
    </div>
  );
};

export default ErrorDisplay;
