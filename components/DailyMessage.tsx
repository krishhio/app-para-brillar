
import React, { useState, useEffect, useCallback } from 'react';
import { MotivationalQuote, FeelingOption, FEELING_TO_CATEGORIES_MAP } from '../types'; // Updated imports
import { USER_QUOTES } from '../services/userQuotes'; 
import { Heart, Share2, LoaderCircle, AlertTriangle, Copy, LockKeyhole } from 'lucide-react';

interface DailyMessageProps {
  selectedFeeling: FeelingOption | null; // Updated prop
  currentQuote: MotivationalQuote | null;
  setCurrentQuote: (quote: MotivationalQuote | null) => void;
  addFavorite: (quote: MotivationalQuote) => void;
  setLoadingMessage: (message: string) => void; 
  setErrorMessage: (message: string | null) => void; 
  isGlobalLoading: boolean; 
  loadingMessage?: string; 
  onMessageViewed: () => void; 
  onMessageShared: (quoteId: string) => void;
}

const APP_PREFIX = 'brilla_';
const DAILY_USER_QUOTE_KEY_PREFIX = `${APP_PREFIX}daily_user_quote_`;
const RECENTLY_SHOWN_QUOTES_KEY = `${APP_PREFIX}recent_user_quotes_history_v2`; // Versioned key for new logic
const MAX_RECENT_HISTORY = 15;


const DailyMessage: React.FC<DailyMessageProps> = ({
  selectedFeeling, // Use new prop
  currentQuote,
  setCurrentQuote,
  addFavorite,
  setLoadingMessage,
  setErrorMessage,
  isGlobalLoading,
  onMessageViewed,
  onMessageShared,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const PREMIUM_INFO_URL = 'https://candydiaz.com.mx/premium-info';

  const fetchMessage = useCallback(async () => {
    if (isGlobalLoading || USER_QUOTES.length === 0) {
        if(USER_QUOTES.length === 0) setError("No hay frases disponibles.");
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyQuoteStorageKey = `${DAILY_USER_QUOTE_KEY_PREFIX}${selectedFeeling || 'all'}_${todayStr}`; // Key includes feeling

    try {
      const storedDailyQuoteId = localStorage.getItem(dailyQuoteStorageKey);
      if (storedDailyQuoteId) {
        const foundQuote = USER_QUOTES.find(q => q.id === storedDailyQuoteId);
        if (foundQuote) {
          setCurrentQuote(foundQuote);
          onMessageViewed();
          setIsLoading(false);
          return;
        }
      }

      let targetCategories: string[] | 'all' = 'all';
      if (selectedFeeling && FEELING_TO_CATEGORIES_MAP[selectedFeeling]) {
        targetCategories = FEELING_TO_CATEGORIES_MAP[selectedFeeling];
      }
      
      let quotesPool = USER_QUOTES;
      if (targetCategories !== 'all') {
        quotesPool = USER_QUOTES.filter(q => q.categoria && targetCategories.includes(q.categoria));
      }

      if (quotesPool.length === 0 && targetCategories !== 'all') {
         // Fallback to all categories if the specific feeling yields no quotes
         quotesPool = USER_QUOTES;
      }
      if (quotesPool.length === 0) {
        setError("No hay frases disponibles para tu selección.");
        setCurrentQuote(null);
        setIsLoading(false);
        return;
      }
      
      const recentHistoryJson = localStorage.getItem(RECENTLY_SHOWN_QUOTES_KEY);
      const recentHistory: string[] = recentHistoryJson ? JSON.parse(recentHistoryJson) : [];

      let availableQuotes = quotesPool.filter(q => !recentHistory.includes(q.id));

      if (availableQuotes.length === 0) {
        // All relevant quotes shown recently, use the pool without recent history filter
        availableQuotes = [...quotesPool]; 
      }
      
      if (availableQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableQuotes.length);
        const newQuote = availableQuotes[randomIndex]!;
        
        setCurrentQuote(newQuote);
        localStorage.setItem(dailyQuoteStorageKey, newQuote.id);
        
        const updatedHistory = [newQuote.id, ...recentHistory].slice(0, MAX_RECENT_HISTORY);
        localStorage.setItem(RECENTLY_SHOWN_QUOTES_KEY, JSON.stringify(updatedHistory));
        
        onMessageViewed();
      } else {
         setError("No se encontraron frases nuevas para mostrar.");
         setCurrentQuote(null); 
      }

    } catch (err) {
      console.error("Error selecting user quote:", err);
      setError("No se pudo cargar el mensaje del día.");
      setCurrentQuote(null);
    } finally {
      setIsLoading(false);
    }
  }, [isGlobalLoading, setCurrentQuote, onMessageViewed, selectedFeeling]);

  useEffect(() => {
    // Add logic to check if the currentQuote (from props) is in the favorites list
    // This would require passing favoriteMessages to DailyMessage or managing isFavorited state more globally
    if (currentQuote) {
        // Example: setIsFavorited(favoriteMessages.some(fav => fav.id === currentQuote.id));
        // For now, this is a placeholder. Favorites check should be against App's favoriteMessages state.
    } else {
        setIsFavorited(false);
    }
  }, [currentQuote]);


  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);
  
  const handleFavorite = () => {
    if (currentQuote) {
      addFavorite(currentQuote);
      setIsFavorited(true); 
      // Note: isFavorited state here is local. For persistence across views,
      // favorite status should be derived from a global favorites list.
    }
  };

  const handleShare = () => {
    if (currentQuote) {
      navigator.clipboard.writeText(`"${currentQuote.frase}" - ${currentQuote.autor} (Vía App para Brillar)`)
        .then(() => {
          setCopied(true);
          onMessageShared(currentQuote.id); 
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--brilla-bg-surface)] opacity-80 backdrop-blur-sm shadow-xl rounded-xl p-8 md:p-10 h-64 flex flex-col items-center justify-center text-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-[var(--brilla-accent-light)] mb-3" />
        <p className="text-lg text-[var(--brilla-accent-light)]">Buscando tu inspiración...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700/50 text-red-200 px-6 py-5 rounded-xl shadow-md text-center h-64 flex flex-col items-center justify-center">
        <AlertTriangle className="h-10 w-10 text-red-400 mb-3" />
        <p className="font-semibold text-lg">Error al cargar mensaje</p>
        <p className="text-sm mt-1">{error}</p>
         <button
          onClick={fetchMessage}
          className="mt-4 bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!currentQuote) {
    return (
      <div className="bg-[var(--brilla-bg-surface)] opacity-80 backdrop-blur-sm shadow-xl rounded-xl p-8 md:p-10 h-64 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-[var(--brilla-accent-light)]">No hay mensaje disponible en este momento.</p>
         <button
          onClick={fetchMessage}
          className="mt-4 bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
        >
          Buscar Mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[var(--brilla-daily-message-bg-from)] via-[var(--brilla-daily-message-bg-via)] to-[var(--brilla-daily-message-bg-to)] backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8 md:p-10 transform transition-all duration-500 hover:shadow-[var(--brilla-primary)]/30 min-h-[16rem] flex flex-col justify-between">
      <blockquote className="text-center flex-grow">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--brilla-text-primary)] leading-relaxed daily-frase-font">
          &ldquo;{currentQuote.frase}&rdquo;
        </p>
        <footer className="mt-4 sm:mt-6 text-sm sm:text-md md:text-lg text-[var(--brilla-accent-light)] italic">
          &mdash; {currentQuote.autor}
          {currentQuote.categoria && <span className="block text-xs opacity-70 mt-1">{currentQuote.categoria}</span>}
        </footer>
      </blockquote>
      <div className="mt-6 sm:mt-8 flex justify-center items-center space-x-3 sm:space-x-4">
        <button
          onClick={handleFavorite}
          disabled={isFavorited} 
          className={`p-2 sm:p-3 rounded-full transition-all duration-200 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--brilla-bg-surface)]
            ${isFavorited 
              ? 'bg-[#EC4899] text-white cursor-not-allowed focus:ring-[#EC4899]'
              : 'bg-[var(--brilla-button-secondary-bg)] hover:bg-[var(--brilla-button-secondary-hover-bg)] text-[var(--brilla-accent)] hover:text-[var(--brilla-accent)] opacity-90 hover:opacity-100 focus:ring-[var(--brilla-accent)]'
            }`}
          aria-label={isFavorited ? "Guardado en favoritos" : "Guardar en favoritos"}
          title={isFavorited ? "Guardado" : "Guardar"}
        >
          <Heart size={18} className={isFavorited ? 'fill-current' : ''} />
        </button>
        <button
          onClick={handleShare}
          className="p-2 sm:p-3 rounded-full bg-[var(--brilla-button-secondary-bg)] hover:bg-[var(--brilla-button-secondary-hover-bg)] text-sky-400 hover:text-sky-300 transition-all duration-200 ease-in-out group focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 focus:ring-offset-2 focus:ring-offset-[var(--brilla-bg-surface)]"
          aria-label="Copiar mensaje"
          title={copied ? "Copiado!" : "Copiar"}
        >
          {copied ? <Copy size={18} className="text-green-400" /> : <Share2 size={18} />}
        </button>
        <button
          onClick={() => window.open(PREMIUM_INFO_URL, '_blank', 'noopener noreferrer')}
          className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center group"
          title="Desbloquea más cartas y contenido exclusivo con Premium"
        >
          <LockKeyhole size={16} className="mr-1.5 transition-transform group-hover:rotate-[-10deg] group-hover:scale-110" /> Ver más (Premium)
        </button>
      </div>
    </div>
  );
};

export default DailyMessage;
