
import React from 'react';
import { CheckSquare, Edit3 } from 'lucide-react';

const ChallengeSection: React.FC = () => {
  // Specific icon color for this section (green), can be themed if needed by passing props or more specific CSS vars
  const sectionAccentColor = "text-green-400"; // Or use var(--brilla-accent-positive) or similar if defined

  return (
    <div className="bg-[var(--brilla-bg-surface)] opacity-95 backdrop-blur-md shadow-xl rounded-xl p-6">
      <div className={`flex items-center ${sectionAccentColor} mb-3`}>
        <CheckSquare size={24} className="mr-2" />
        <h3 className="text-lg font-semibold">Tu Reto Semanal</h3>
      </div>
      <div className="space-y-3">
        <p className="text-[var(--brilla-accent-light)] text-sm sm:text-base">
          <strong>Día 1: Conecta con tus Valores</strong>
        </p>
        <p className="text-[var(--brilla-text-secondary)] text-xs sm:text-sm">
          Una breve explicación del ejercicio y su importancia para tu crecimiento personal y profesional.
          Identifica 3 valores fundamentales que guían tus decisiones.
        </p>
        <div className="mt-3 p-3 bg-[var(--brilla-bg-base)] rounded-md ">
           <div className="flex items-center text-[var(--brilla-accent-light)] mb-2">
            <Edit3 size={18} className="mr-2"/>
            <label htmlFor="challenge-notes" className="text-sm font-medium">Mis Notas (Próximamente):</label>
           </div>
          <textarea
            id="challenge-notes"
            rows={3}
            placeholder="Escribe tus reflexiones aquí... (funcionalidad completa próximamente)"
            className="w-full bg-[var(--brilla-bg-surface)] border-[var(--brilla-border-color)] text-[var(--brilla-text-secondary)] placeholder-slate-500 rounded-md p-2 text-sm focus:ring-1 focus:ring-[var(--brilla-ring-color)] focus:border-[var(--brilla-ring-color)] outline-none transition-colors"
            disabled 
          />
        </div>
        <p className={`text-xs ${sectionAccentColor} opacity-70 text-center mt-2`}>
          Más ejercicios y retos interactivos estarán disponibles pronto.
        </p>
      </div>
    </div>
  );
};

export default ChallengeSection;
