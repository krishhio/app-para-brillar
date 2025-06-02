
import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { Award, CheckCircle, Sparkles } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const getAchievementIcon = (iconName: string, props?: any) => {
  const icons: { [key: string]: React.FC<any> } = {
    Award, Sparkles, CheckCircle // Add more as needed from types.ts
  };
  const IconComponent = icons[iconName] || Award; // Default to Award
  return <IconComponent {...props} />;
};

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string }>>([]);

  useEffect(() => {
    setIsVisible(true);
    // Trigger confetti
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * -50 - 50, // start above screen
      rotation: Math.random() * 360,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }));
    setConfettiPieces(pieces);

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade-out animation before calling onClose
      setTimeout(onClose, 500); 
    }, 4500); // Notification visible for 4.5s, then fades

    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="alertdialog"
      aria-labelledby="achievement-title"
      aria-describedby="achievement-message"
    >
      <div 
        className={`bg-gradient-to-br from-[var(--brilla-bg-surface)] via-[var(--brilla-bg-base)] to-[var(--brilla-bg-surface)] p-6 rounded-xl shadow-2xl w-full max-w-sm text-center border-2 border-[var(--brilla-primary)] relative overflow-hidden transform transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Confetti Container */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {confettiPieces.map(p => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `rotate(${p.rotation}deg)`,
                backgroundColor: p.color,
                animationDelay: `${Math.random() * 0.5}s` // Stagger start
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10"> {/* Content above confetti */}
          {getAchievementIcon(achievement.iconName, { size: 56, className: "mx-auto mb-4 text-[var(--brilla-primary)]" })}
          
          <h2 id="achievement-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] quote-text">
            ¡Logro Desbloqueado!
          </h2>
          <p className="text-lg font-semibold text-[var(--brilla-accent-light)] mt-2">{achievement.name}</p>
          <p id="achievement-message" className="text-sm text-[var(--brilla-text-secondary)] mt-2 mb-4">
            {achievement.unlockMessage}
          </p>
          <button
            onClick={onClose}
            className="mt-2 bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Genial
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
