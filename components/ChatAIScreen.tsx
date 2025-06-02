
import React from 'react';
import { ChatMessage } from '../types';
import ChatAI from './ChatAI';
import { ArrowLeft } from 'lucide-react';

interface ChatAIScreenProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setLoadingMessage: (message: string) => void;
  setErrorMessage: (message: string | null) => void;
  onNavigateBack: () => void;
  remainingFreeMessages: number;
  onFreeMessageSent: () => void;
  isPremiumUser: boolean; // Added isPremiumUser
}

const ChatAIScreen: React.FC<ChatAIScreenProps> = ({
  chatMessages,
  setChatMessages,
  setLoadingMessage,
  setErrorMessage,
  onNavigateBack,
  remainingFreeMessages,
  onFreeMessageSent,
  isPremiumUser, // Destructure isPremiumUser
}) => {
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
            Habla con Brilla AI
          </h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>
      <main className="flex-grow container mx-auto p-0 sm:p-4 md:p-6 flex flex-col">
        <div className="flex-grow">
         <ChatAI
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            setLoadingMessage={setLoadingMessage}
            setErrorMessage={setErrorMessage}
            remainingFreeMessages={remainingFreeMessages}
            onFreeMessageSent={onFreeMessageSent}
            isPremiumUser={isPremiumUser} // Pass isPremiumUser
          />
        </div>
      </main>
       <footer className="py-4 text-center text-sm text-[var(--brilla-accent-light)] opacity-70 border-t border-[var(--brilla-border-color)]">
        <p>Las respuestas de IA pueden no ser siempre perfectas. Usa tu discernimiento.</p>
      </footer>
    </div>
  );
};

export default ChatAIScreen;
