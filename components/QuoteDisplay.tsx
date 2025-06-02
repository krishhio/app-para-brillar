// This component is no longer directly used in the new "Brilla" app structure.
// Its functionality has been integrated into `DailyMessage.tsx` and other components.
// Keeping the file for reference or potential future re-purposing if needed,
// but it can be safely deleted if it's confirmed unneeded by the build system.

import React from 'react';

interface QuoteDisplayProps {
  frase: string;
  autor: string;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ frase, autor }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-xl p-8 md:p-12 transform transition-all duration-500 hover:scale-105">
      <blockquote className="text-center">
        <p className="text-2xl md:text-4xl font-semibold text-gray-100 leading-relaxed quote-text">
          &ldquo;{frase}&rdquo;
        </p>
        <footer className="mt-6 md:mt-8 text-md md:text-lg text-purple-300 italic">
          &mdash; {autor}
        </footer>
      </blockquote>
    </div>
  );
};

export default QuoteDisplay;
