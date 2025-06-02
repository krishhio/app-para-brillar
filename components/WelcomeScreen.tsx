
import React, { useState, useEffect } from 'react';
import { UserProfile, MotivationalQuote, FeelingOption, FEELING_OPTIONS } from '../types'; // Updated imports
import DailyMessage from './DailyMessage'; 
import { Sparkles, MessageCircle, Target, UserCircle, LogOut, Menu, X, Home, Podcast, ShoppingCart, BookOpen, LockKeyhole, Edit3 } from 'lucide-react'; // Added Edit3 for journal

interface WelcomeScreenProps {
  onComplete: (selectedFeeling: FeelingOption) => void; 
  feelingOptions: readonly FeelingOption[]; 
  currentFeeling: FeelingOption | null; 
  userProfile: UserProfile | null;
  dailyMessage: MotivationalQuote | null;
  setCurrentQuote: (quote: MotivationalQuote | null) => void;
  addFavorite: (quote: MotivationalQuote) => void;
  setLoadingMessage: (message: string) => void;
  setErrorMessage: (message: string | null) => void;
  isGlobalLoading: boolean;
  loadingMessage: string;
  navigateToChatAI: () => void;
  navigateToChallengeDetail: () => void;
  navigateToProfile: () => void;
  navigateToHomeDashboard: () => void; 
  navigateToGratitudeJournal: () => void; // New
  handleLogout: () => void;
  welcomeShownKey: string;
  onMessageViewed: () => void;
  onMessageShared: (quoteId: string) => void;
  onGratitudeJournalLinkClicked: () => void; // Stays for 'primer-paso' achievement
  selectedFeeling: FeelingOption | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = (props) => {
  const {
    onComplete, feelingOptions, currentFeeling, userProfile, 
    dailyMessage, setCurrentQuote, addFavorite,
    setLoadingMessage, setErrorMessage, isGlobalLoading, loadingMessage,
    navigateToChatAI, navigateToChallengeDetail, 
    navigateToProfile, navigateToGratitudeJournal, // New
    handleLogout, welcomeShownKey,
    onMessageViewed, onMessageShared, onGratitudeJournalLinkClicked,
    selectedFeeling 
  } = props;

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  const aiImageUrl = 'https://images.unsplash.com/photo-1527430253221-9f5186d6095c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  const challengeImageUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  const journalImageUrl = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

  useEffect(() => {
    const setupDone = localStorage.getItem(welcomeShownKey) === 'true' && currentFeeling !== null;
    setIsSetupComplete(setupDone);
  }, [welcomeShownKey, currentFeeling]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] flex flex-col items-center justify-center p-6 text-[var(--brilla-text-primary)] transition-opacity duration-500 ease-in-out animate-fadeIn">
        <header className="text-center mb-10">
          <Sparkles className="h-16 w-16 text-[var(--brilla-accent-light)] mx-auto mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight quote-text text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] font-cinzel">
            ¡Bienvenida a App para Brillar!
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-[var(--brilla-accent-light)] opacity-80 max-w-xl mx-auto">
            Este es tu espacio para reconectar contigo, ganar claridad y construir una marca que refleje lo que ya eres.
          </p>
        </header>
        <section className="w-full max-w-md text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brilla-accent-light)] mb-6">¿Cómo te sientes hoy?</h2>
          <div className="grid grid-cols-1 gap-3">
            {feelingOptions.map((feeling) => (
              <button
                key={feeling}
                onClick={() => onComplete(feeling)}
                className="bg-[var(--brilla-button-secondary-bg)] hover:bg-[var(--brilla-button-secondary-hover-bg)] backdrop-blur-sm text-[var(--brilla-button-secondary-text)] hover:text-white font-semibold py-3 px-5 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:ring-opacity-75 text-sm sm:text-base"
                aria-label={`Seleccionar estado: ${feeling}`}
              >
                {feeling}
              </button>
            ))}
          </div>
        </section>
        <footer className="mt-12 text-center text-sm text-[var(--brilla-accent-light)] opacity-70">
          <p>Tu selección nos ayudará a personalizar tu experiencia.</p>
        </footer>
      </div>
    );
  }

  const hubMenuItems = [
    { 
      label: "Inicio", 
      action: () => setIsMenuOpen(false), 
      icon: <Home size={18} className="mr-3 text-[var(--brilla-accent-light)]" /> 
    },
    { 
      label: "Podcast desde la estrategia", 
      action: () => { window.open('https://www.youtube.com/channel/UCNVDD2NxIWcqE4jDId4vKZA', '_blank', 'noopener noreferrer'); setIsMenuOpen(false); },
      icon: <Podcast size={18} className="mr-3 text-red-500" /> 
    },
    { 
      label: "Visita mi tienda", 
      action: () => { window.open('http://candydiaz.com.mx/tienda', '_blank', 'noopener noreferrer'); setIsMenuOpen(false); },
      icon: <ShoppingCart size={18} className="mr-3 text-green-500" /> 
    },
    { 
      label: "Cursos y talleres", 
      action: () => { window.open('http://candydiaz.com.mx/cursos', '_blank', 'noopener noreferrer'); setIsMenuOpen(false); },
      icon: <BookOpen size={18} className="mr-3 text-sky-500" /> 
    },
    { 
      label: "Cerrar Sesión", 
      action: handleLogout, 
      icon: <LogOut size={18} className="mr-3 text-slate-400" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] text-[var(--brilla-text-primary)]">
      <header className="sticky top-0 z-50 bg-[var(--brilla-bg-overlay)] backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
             <h1 className="text-2xl sm:text-3xl font-bold tracking-tight quote-text text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] font-cinzel">
              App para Brillar
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                title="Mi Perfil" 
                onClick={navigateToProfile} 
                className="p-1 rounded-full text-[var(--brilla-accent-light)] hover:text-white hover:bg-[var(--brilla-button-secondary-bg)] transition-colors flex items-center justify-center"
              >
                {userProfile?.photoUrl ? (
                  <img src={userProfile.photoUrl} alt="Perfil" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <UserCircle size={24} />
                )}
              </button>
               <div className="relative" ref={menuRef}>
                <button
                  title="Menú Principal"
                  onClick={toggleMenu}
                  className="p-2 rounded-full text-[var(--brilla-accent-light)] hover:text-white hover:bg-[var(--brilla-button-secondary-bg)] transition-colors"
                  aria-expanded={isMenuOpen}
                  aria-controls="hub-main-menu"
                >
                  {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                {isMenuOpen && (
                  <div 
                    id="hub-main-menu"
                    className="absolute right-0 mt-2 w-72 bg-[var(--brilla-bg-surface)] backdrop-blur-lg rounded-lg shadow-2xl py-2 border border-[var(--brilla-border-color)] z-50 origin-top-right animate-fadeInScaleUp"
                    role="menu"
                  >
                    {hubMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setIsMenuOpen(false); }}
                        className="w-full flex items-center text-left px-4 py-3 text-sm text-[var(--brilla-text-primary)] hover:bg-[var(--brilla-primary-hover)] hover:text-white transition-colors duration-150 ease-in-out"
                        role="menuitem"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <section className="text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--brilla-accent-light)] quote-text font-cinzel">
            Hola, {userProfile?.name || 'Alma Brillante'}!
          </h2>
          <p className="text-[var(--brilla-accent-light)] opacity-80 mt-1">Lista para tu dosis de inspiración?</p>
        </section>

        <section aria-labelledby="daily-message-hub-heading">
          <h3 id="daily-message-hub-heading" className="sr-only">Mensaje del Día</h3>
          <DailyMessage
            selectedFeeling={selectedFeeling} 
            currentQuote={dailyMessage}
            setCurrentQuote={setCurrentQuote}
            addFavorite={addFavorite}
            setLoadingMessage={setLoadingMessage}
            setErrorMessage={setErrorMessage}
            isGlobalLoading={isGlobalLoading}
            loadingMessage={loadingMessage}
            onMessageViewed={onMessageViewed}
            onMessageShared={onMessageShared}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={navigateToChatAI}
            className="text-[var(--brilla-selection-text)] font-bold py-6 px-6 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:ring-opacity-75 text-lg relative overflow-hidden text-left flex items-center group"
            style={{
              backgroundImage: `linear-gradient(to right, var(--brilla-primary) 0%, var(--brilla-primary) 60%, transparent 100%), url('${aiImageUrl}')`,
              backgroundSize: '100% 100%, auto 100%',
              backgroundPosition: 'left center, right center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <MessageCircle size={28} className="mr-3 flex-shrink-0" />
            <span className="flex-grow">Hablar con Brilla AI</span>
          </button>
          <button
            onClick={navigateToChallengeDetail}
            className="text-[var(--brilla-selection-text)] font-bold py-6 px-6 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:ring-opacity-75 text-lg relative overflow-hidden text-left flex items-center group"
            style={{
              backgroundImage: `linear-gradient(to right, var(--brilla-primary) 0%, var(--brilla-primary) 60%, transparent 100%), url('${challengeImageUrl}')`,
              backgroundSize: '100% 100%, auto 100%',
              backgroundPosition: 'left center, right center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Target size={28} className="mr-3 flex-shrink-0" />
            <span className="flex-grow">Ver Reto Semanal</span>
          </button>
        </section>
        
        <section className="text-center">
           <button
            onClick={() => {
              navigateToGratitudeJournal(); // Navigate to new screen
              onGratitudeJournalLinkClicked(); // Keep for 'primer-paso' achievement
            }}
            className="text-[var(--brilla-selection-text)] font-bold py-6 px-6 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:ring-opacity-75 text-lg w-full md:max-w-md mx-auto relative overflow-hidden text-left flex items-center group"
            title="Accede a tu Diario de Gratitud" // Updated title
            style={{
              backgroundImage: `linear-gradient(to right, var(--brilla-primary) 0%, var(--brilla-primary) 60%, transparent 100%), url('${journalImageUrl}')`,
              backgroundSize: '100% 100%, auto 100%',
              backgroundPosition: 'left center, right center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Edit3 size={28} className="mr-3 flex-shrink-0 transition-transform group-hover:rotate-[-5deg] group-hover:scale-110" /> 
            <span className="flex-grow">Diario de Gratitud</span>
          </button>
        </section>

      </main>
       <footer className="py-8 mt-4 text-center text-sm text-[var(--brilla-accent-light)] opacity-70 border-t border-[var(--brilla-border-color)]">
        <p>&copy; {new Date().getFullYear()} App para Brillar. Tu espacio de crecimiento.</p>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
