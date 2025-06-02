
import React from 'react';
import ChallengeSection from './ChallengeSection'; 
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

interface ChallengeScreenProps {
  onNavigateBack: () => void;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ onNavigateBack }) => {
  const PREMIUM_INFO_URL = 'https://candydiaz.com.mx/premium-info';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] text-[var(--brilla-text-primary)]">
      <header className="bg-[var(--brilla-bg-overlay)] backdrop-blur-md shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="flex items-center text-[var(--brilla-accent-light)] hover:text-[var(--brilla-accent)] transition-colors p-2 rounded-md hover:bg-[var(--brilla-button-secondary-bg)]"
            aria-label="Volver"
          >
            <ArrowLeft size={24} className="mr-2" />
            Volver
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--brilla-accent-light)] quote-text font-cinzel">
            Reto Semanal
          </h1>
           <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <ChallengeSection />
          <div className="mt-8 p-6 bg-gradient-to-r from-[var(--brilla-primary)]/10 via-transparent to-[var(--brilla-primary)]/10 border border-[var(--brilla-primary)]/30 rounded-xl text-center shadow-lg">
            <Sparkles size={32} className="mx-auto mb-3 text-[var(--brilla-primary)]" />
            <h3 className="text-xl font-semibold text-[var(--brilla-accent-light)]">Desbloquea Retos Premium</h3>
            <p className="text-sm text-[var(--brilla-text-secondary)] mt-2 mb-4 max-w-md mx-auto">
              Accede a retos exclusivos, seguimiento de progreso detallado y recompensas especiales con Brilla Premium.
            </p>
            <button
              onClick={() => window.open(PREMIUM_INFO_URL, '_blank', 'noopener noreferrer')}
              className="bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] font-semibold py-2.5 px-6 rounded-lg transition-colors text-md inline-flex items-center group shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Ver Beneficios Premium <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-[var(--brilla-accent-light)] opacity-70 border-t border-[var(--brilla-border-color)]">
        <p>Completar los retos es un paso más en tu camino para brillar.</p>
      </footer>
    </div>
  );
};

export default ChallengeScreen;
