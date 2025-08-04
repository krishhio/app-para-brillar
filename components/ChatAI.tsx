import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { Send, CornerDownLeft, MessageSquarePlus, User, Sparkles, ArrowRight } from 'lucide-react';

interface ChatAIProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setLoadingMessage: (message: string) => void;
  setErrorMessage: (message: string | null) => void;
  remainingFreeMessages: number;
  onFreeMessageSent: () => void;
  isPremiumUser: boolean; // Added isPremiumUser
}

const suggestedPrompts = [
  "No me siento suficiente...",
  "¿Cómo descubro mi propósito?",
  "Quiero mejorar mi presencia profesional",
  "Necesito un consejo para hoy",
];

const MESSAGE_SEPARATOR = "---MSG_BREAK---";

const ChatAI: React.FC<ChatAIProps> = ({ 
  chatMessages, 
  setChatMessages, 
  setLoadingMessage, 
  setErrorMessage,
  remainingFreeMessages,
  onFreeMessageSent,
  isPremiumUser, // Destructure isPremiumUser
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const PREMIUM_INFO_URL = 'https://candydiaz.com.mx/premium-info';

  const isLocked = remainingFreeMessages <= 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (typeof messageText === 'string' ? messageText : input).trim();
    
    if (isLocked || !textToSend) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };
    
    const wellTypedHistory = chatMessages.filter(
      (msg): msg is ChatMessage =>
        typeof msg === 'object' &&
        msg !== null &&
        typeof msg.id === 'string' &&
        (msg.sender === 'user' || msg.sender === 'ai') && 
        typeof msg.text === 'string' &&
        typeof msg.timestamp === 'number'
    );
    const currentHistoryForAPI: ChatMessage[] = [...wellTypedHistory, newUserMessage];
    
    setChatMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');
    
    if (remainingFreeMessages > 0 && remainingFreeMessages !== Infinity) { 
        onFreeMessageSent();
    }
    
    setIsTyping(true);
    setLoadingMessage('Brilla AI está pensando...');

    try {
      const aiResponseText = await geminiService.getAIChatResponse(textToSend, currentHistoryForAPI, isPremiumUser); // Pass isPremiumUser
      
      const responseParts = aiResponseText.split(MESSAGE_SEPARATOR);
      const newAiMessages: ChatMessage[] = responseParts.map((part, index): ChatMessage => ({
        id: `ai-${Date.now()}-${index}`,
        sender: 'ai',
        text: part.trim(),
        timestamp: Date.now() + index, 
      })).filter(part => part.text.length > 0); 

      if (newAiMessages.length > 0) {
        setChatMessages(prev => [...prev, ...newAiMessages]);
      } else if (aiResponseText.trim().length > 0) { 
         const singleAiMessage: ChatMessage = {
           id: `ai-${Date.now()}`,
           sender: 'ai',
           text: aiResponseText.trim(),
           timestamp: Date.now(),
         };
         setChatMessages(prev => [...prev, singleAiMessage]);
      }

    } catch (err) {
      console.error("Error in AI Chat:", err);
      const errorText = err instanceof Error ? err.message : "Hubo un problema con el chat.";
      setErrorMessage(errorText); 
      const errorAiMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: `Lo siento, no pude procesar tu mensaje en este momento. (${errorText.substring(0,50)}...)`,
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsTyping(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="bg-[var(--brilla-bg-surface)] opacity-95 backdrop-blur-md shadow-xl rounded-xl flex flex-col h-[60vh] sm:h-[65vh] md:h-[70vh]">
      <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto">
        {chatMessages.length === 0 && !isTyping && !isLocked && (
          <div className="text-center py-8 text-[var(--brilla-accent-light)]">
            <MessageSquarePlus size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-semibold text-lg mb-1">¿En qué te puedo ayudar hoy?</p>
            <p className="text-sm opacity-80 mb-4">Escribe tu pregunta o elige una sugerencia.</p>
             <div className="flex flex-wrap justify-center gap-2 px-2">
              {suggestedPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="bg-[var(--brilla-primary)]/50 hover:bg-[var(--brilla-primary)]/70 text-[var(--brilla-selection-text)] text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-colors"
                  disabled={isLocked}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] sm:max-w-[65%] p-3 sm:p-3.5 rounded-xl shadow ${
              msg.sender === 'user' 
                ? 'bg-[var(--brilla-primary)] text-[var(--brilla-selection-text)] rounded-br-none' 
                : 'bg-[var(--brilla-bg-base)] text-[var(--brilla-text-primary)] rounded-bl-none'
            }`}
            >
              <div className="flex items-start space-x-2">
                {msg.sender === 'ai' && <Sparkles size={18} className="text-[var(--brilla-accent-light)] flex-shrink-0 mt-0.5" />}
                 {msg.sender === 'user' && <User size={18} className="text-white opacity-80 flex-shrink-0 mt-0.5" />}
                <p className="text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] sm:max-w-[65%] p-3 sm:p-3.5 rounded-xl shadow bg-[var(--brilla-bg-base)] text-[var(--brilla-text-primary)] rounded-bl-none">
              <div className="flex items-center space-x-2">
                {/* <LoaderCircle size={18} className="animate-spin text-[var(--brilla-accent-light)] flex-shrink-0" /> */}
                <span className="inline-block w-4 h-4 rounded-full border-2 border-[var(--brilla-accent-light)] border-t-transparent animate-spin"></span>
                <p className="text-sm sm:text-base italic">Brilla AI está escribiendo...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-[var(--brilla-border-color)]">
        {isLocked ? (
          <div className="text-center p-4 bg-gradient-to-r from-[var(--brilla-primary)]/10 via-transparent to-[var(--brilla-primary)]/10 border border-[var(--brilla-primary)]/30 rounded-lg">
            {/* <LockKeyhole size={32} className="mx-auto mb-2 text-[var(--brilla-primary)]" /> */}
            <span className="inline-block w-8 h-8 rounded-full border-4 border-[var(--brilla-primary)] border-t-transparent animate-spin mx-auto mb-2"></span>
            <h4 className="text-md font-semibold text-[var(--brilla-accent-light)]">Límite de mensajes alcanzado</h4>
            <p className="text-xs text-[var(--brilla-text-secondary)] mt-1 mb-3">
              {isPremiumUser ? "Error inesperado con el límite de mensajes." : "Has utilizado tus 3 mensajes gratuitos de este mes."}
            </p>
            {!isPremiumUser && (
              <button
                onClick={() => window.open(PREMIUM_INFO_URL, '_blank', 'noopener noreferrer')}
                className="bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] font-semibold py-2 px-4 rounded-lg transition-colors text-sm inline-flex items-center group shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Desbloquear Chat Ilimitado <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2 sm:space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje a Brilla AI..."
              disabled={isTyping || isLocked}
              className="flex-grow bg-[var(--brilla-bg-base)] border-[var(--brilla-border-color)] text-[var(--brilla-text-primary)] placeholder-[var(--brilla-text-secondary)] rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:border-[var(--brilla-ring-color)] outline-none transition-colors text-sm sm:text-base"
              aria-label="Mensaje para Brilla AI"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || isLocked}
              className="p-2.5 sm:p-3 bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--brilla-bg-base)]"
              aria-label="Enviar mensaje"
            >
              {isTyping ? <CornerDownLeft size={20} className="animate-pulse" /> : <Send size={20} />}
            </button>
          </form>
        )}
         {!isLocked && !isPremiumUser && (
          <p className="text-xs text-center text-[var(--brilla-text-secondary)] mt-2">
            Te quedan {remainingFreeMessages < 0 ? 0 : remainingFreeMessages} mensajes gratuitos este mes.
          </p>
        )}
         {isPremiumUser && (
            <p className="text-xs text-center text-green-400/80 mt-2">
                Acceso Premium: Chat con IA ilimitado.
            </p>
         )}
      </div>
    </div>
  );
};

export default ChatAI;
