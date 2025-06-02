
import React, { useState, useRef, useEffect } from 'react';
import { MotivationalQuote, ChatMessage, FeelingOption } from '../types'; // Updated import
import { Sun, MessageCircle, Target, UserCircle, Settings, LogOut, Menu, Bell, X, Home, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  selectedFeeling: FeelingOption | null; // Updated prop
  dailyMessage: MotivationalQuote | null; 
  setDailyMessage: (message: MotivationalQuote | null) => void;
  addFavoriteMessage: (message: MotivationalQuote) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setLoadingMessage: (message: string) => void;
  setErrorMessage: (message: string | null) => void;
  loadingMessage: string;
  isGlobalLoading: boolean;
  navigateToProfile: () => void;
  userPhotoUrl?: string;
  handleLogout: () => void;
  navigateToChatAI: () => void; 
  navigateToChallengeDetail: () => void; 
  navigateToWelcome: () => void; 
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  const {
    navigateToProfile,
    userPhotoUrl,
    handleLogout,
    navigateToChatAI,
    navigateToChallengeDetail,
    navigateToWelcome,
  } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const menuItems = [
    { label: "Ir al Inicio (Hub)", action: () => { navigateToWelcome(); setIsMenuOpen(false); }, icon: <Sparkles size={18} className="mr-3 text-yellow-400" /> },
    { label: "Habla con Brilla AI", action: () => { navigateToChatAI(); setIsMenuOpen(false); }, icon: <MessageCircle size={18} className="mr-3 text-sky-400" /> },
    { label: "Reto Activo", action: () => { navigateToChallengeDetail(); setIsMenuOpen(false); }, icon: <Target size={18} className="mr-3 text-green-400" /> },
    { label: "Mi Perfil", action: () => { navigateToProfile(); setIsMenuOpen(false); }, icon: <UserCircle size={18} className="mr-3 text-[var(--brilla-accent)]" /> },
    { label: "Configuración", action: () => { console.log("Settings clicked"); setIsMenuOpen(false); }, icon: <Settings size={18} className="mr-3 text-[var(--brilla-accent-light)]" />, disabled: true },
    { label: "Cerrar Sesión", action: () => {handleLogout(); setIsMenuOpen(false);}, icon: <LogOut size={18} className="mr-3 text-red-400" /> }, 
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] text-[var(--brilla-text-primary)]">
      <header className="sticky top-0 z-50 bg-[var(--brilla-bg-overlay)] backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight quote-text text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] font-cinzel">
              App para Brillar (Dashboard)
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                title="Mi Perfil" 
                onClick={navigateToProfile} 
                className="p-1 rounded-full text-[var(--brilla-accent-light)] hover:text-white hover:bg-[var(--brilla-button-secondary-bg)] transition-colors flex items-center justify-center"
              >
                {userPhotoUrl ? (
                  <img src={userPhotoUrl} alt="Perfil" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <UserCircle size={24} />
                )}
              </button>
              <button title="Notificaciones (Próximamente)" className="p-2 rounded-full text-[var(--brilla-accent-light)] hover:text-white hover:bg-[var(--brilla-button-secondary-bg)] transition-colors">
                <Bell size={20} />
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  title="Menú Principal"
                  onClick={toggleMenu}
                  className="p-2 rounded-full text-[var(--brilla-accent-light)] hover:text-white hover:bg-[var(--brilla-button-secondary-bg)] transition-colors"
                  aria-expanded={isMenuOpen}
                  aria-controls="main-menu-dashboard"
                >
                  {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                {isMenuOpen && (
                  <div 
                    id="main-menu-dashboard"
                    className="absolute right-0 mt-2 w-64 bg-[var(--brilla-bg-surface)] backdrop-blur-lg rounded-lg shadow-2xl py-2 border border-[var(--brilla-border-color)] z-50 origin-top-right animate-fadeInScaleUp"
                    role="menu"
                  >
                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        disabled={item.disabled}
                        className={`w-full flex items-center text-left px-4 py-2.5 text-sm ${
                          item.disabled 
                            ? 'text-slate-500 cursor-not-allowed' 
                            : 'text-[var(--brilla-text-primary)] hover:bg-[var(--brilla-primary-hover)] hover:text-white'
                        } transition-colors duration-150 ease-in-out`}
                        role="menuitem"
                      >
                        {item.icon}
                        {item.label}
                        {item.disabled && <span className="text-xs ml-auto opacity-70">(Próximamente)</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-10">
          <h2 className="text-3xl font-semibold text-[var(--brilla-accent-light)] mb-4 font-cinzel">Antiguo Dashboard</h2>
          <p className="text-[var(--brilla-text-secondary)] mb-6">
            Esta es la vista de dashboard anterior. La pantalla principal ahora es el "Inicio (Hub)" accesible desde el menú.
            Desde aquí puedes navegar a las diferentes secciones usando el menú superior.
          </p>
          <button 
            onClick={navigateToWelcome}
            className="bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
          >
            <Sparkles size={20} className="inline mr-2 mb-0.5" /> Ir al Inicio (Hub)
          </button>
        </div>
      </main>

      <footer className="py-8 mt-10 text-center text-sm text-[var(--brilla-accent-light)] opacity-70 border-t border-[var(--brilla-border-color)]">
        <p>&copy; {new Date().getFullYear()} App para Brillar. Todos los derechos reservados.</p>
        <p className="mt-1">Potenciado por IA Gemini.</p>
      </footer>
    </div>
  );
};

export default HomeScreen;
