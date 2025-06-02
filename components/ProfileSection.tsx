
import React from 'react';
import { MotivationalQuote } from '../types';
import { Bookmark, Trash2, BarChart3, Star } from 'lucide-react'; // Removed Award

interface ProfileSectionProps {
  favoriteMessages: MotivationalQuote[];
  removeFavoriteMessage: (messageId: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ favoriteMessages, removeFavoriteMessage }) => {
  const PREMIUM_INFO_URL = 'https://candydiaz.com.mx/premium-info';

  return (
    <div className="bg-[var(--brilla-bg-overlay)] opacity-95 backdrop-blur-md shadow-xl rounded-xl p-6 space-y-6">
      <div>
        <div className="flex items-center text-[var(--brilla-accent)] mb-3">
          <Bookmark size={22} className="mr-2" />
          <h3 className="text-lg font-semibold">Mis Mensajes Guardados</h3>
        </div>
        {favoriteMessages.length > 0 ? (
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {favoriteMessages.map(msg => (
              <div key={msg.id} className="bg-[var(--brilla-bg-base)] p-3 rounded-lg shadow">
                <p className="text-[var(--brilla-text-primary)] text-sm quote-text italic">&ldquo;{msg.frase}&rdquo;</p>
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-xs text-[var(--brilla-accent-light)]">&mdash; {msg.autor}</p>
                  <button 
                    onClick={() => removeFavoriteMessage(msg.id)}
                    className="text-red-400/70 hover:text-red-400 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                    aria-label="Eliminar mensaje guardado"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--brilla-text-secondary)] text-sm italic">Aún no has guardado mensajes. ¡Empieza a coleccionar tu inspiración!</p>
        )}
      </div>

      <div>
        <div className="flex items-center text-teal-400 mb-2">
          <BarChart3 size={20} className="mr-2" />
          <h4 className="text-md font-semibold">Progreso de Retos (Próximamente)</h4>
        </div>
        <p className="text-[var(--brilla-text-secondary)] text-sm italic">Tus avances en los retos aparecerán aquí.</p>
      </div>
      
      {/* "Mis Logros (Próximamente)" section removed as it's now handled in ProfilePage.tsx directly */}

       <button
          onClick={() => window.open(PREMIUM_INFO_URL, '_blank', 'noopener noreferrer')}
          className="w-full mt-4 px-3 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center group"
          title="Descubre los beneficios de Brilla Premium"
        >
          <Star size={18} className="mr-2 transition-transform group-hover:scale-125 fill-white" /> Desbloquear Brilla Premium
        </button>
    </div>
  );
};

export default ProfileSection;
