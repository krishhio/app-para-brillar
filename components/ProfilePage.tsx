
import React, { useState, useEffect } from 'react';
import { UserProfile, MotivationalQuote, ThemeName, Achievement, ALL_ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, AchievementCategoryKey } from '../types';
import { themes, ThemeColors } from '../themes'; 
import ProfileSection from './ProfileSection'; 
import { User, Mail, Calendar, Save, Edit, ArrowLeft, Image as ImageIcon, Palette, Award, Star, BookOpen, Gift, TrendingUp, Zap, Repeat, Share2, Target, RefreshCcw, Sunrise, Speaker, Goal, PenTool, BookOpenCheck, Lock } from 'lucide-react';

interface ProfilePageProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateHome: () => void;
  favoriteMessages: MotivationalQuote[];
  removeFavoriteMessage: (messageId: string) => void;
  allAchievements: readonly Achievement[];
  unlockedAchievements: Record<string, { unlockedAt: number }>;
}

// Helper to get the correct Lucide icon component
const LUCIDE_ICONS_MAP: { [key: string]: React.FC<any> } = {
  Award, Star, BookOpen, Palette, Gift, TrendingUp, Zap, Repeat, Share2, Target, RefreshCcw, Sunrise, Speaker, Goal, PenTool, BookOpenCheck, User, Lock // Added Lock
};

const AchievementIconDisplay: React.FC<{ iconName: string; isUnlocked: boolean; isPremiumLocked?: boolean; size?: number }> = ({ iconName, isUnlocked, isPremiumLocked, size = 28 }) => {
  let ActualIconComponent = LUCIDE_ICONS_MAP[iconName] || User; // Default to User icon if specific not found
  let iconProps: any = { size, className: `mr-3 flex-shrink-0` };

  if (isUnlocked) {
    iconProps.className += ` text-[var(--brilla-primary)]`;
  } else {
    if (isPremiumLocked) {
      ActualIconComponent = Star;
      iconProps.className += ` text-yellow-400 opacity-75`; // Specific style for locked premium
    } else {
      ActualIconComponent = Lock;
      iconProps.className += ` text-[var(--brilla-text-secondary)] opacity-60`;
    }
  }
  return <ActualIconComponent {...iconProps} />;
};


const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateHome,
  favoriteMessages,
  removeFavoriteMessage,
  allAchievements,
  unlockedAchievements
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [tempPhotoUrl, setTempPhotoUrl] = useState(userProfile.photoUrl || '');

  useEffect(() => {
    setFormData(userProfile); 
    setTempPhotoUrl(userProfile.photoUrl || '');
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'photoUrl') {
      setTempPhotoUrl(value);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, birthDate: e.target.value }));
  };

  const handleThemeChange = (themeName: ThemeName) => {
    setFormData(prev => ({ ...prev, theme: themeName }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({...formData, photoUrl: tempPhotoUrl});
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setFormData(userProfile); // Reset form if canceling edit
      setTempPhotoUrl(userProfile.photoUrl || '');
    }
    setIsEditing(!isEditing);
  };
  
  const inputClass = "w-full bg-[var(--brilla-bg-surface)] border-[var(--brilla-border-color)] text-[var(--brilla-text-primary)] placeholder-[var(--brilla-text-secondary)] rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:border-[var(--brilla-ring-color)] outline-none transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-[var(--brilla-accent-light)] mb-1.5";

  const groupedAchievements = allAchievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category]!.push(achievement);
    return acc;
  }, {} as Record<AchievementCategoryKey, Achievement[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] text-[var(--brilla-text-primary)] p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center text-[var(--brilla-accent-light)] hover:text-[var(--brilla-accent)] transition-colors p-2 rounded-md hover:bg-[var(--brilla-button-secondary-bg)]"
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={24} className="mr-2" />
          <span className="hidden sm:inline">Volver al Inicio</span>
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight quote-text text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] font-cinzel">
          Mi Perfil
        </h1>
        <button
          onClick={toggleEditMode}
          className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
            isEditing 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)]'
          }`}
        >
          {isEditing ? <><Save size={18} className="mr-0 sm:mr-2" /><span className="hidden sm:inline">Guardar</span></> : <><Edit size={18} className="mr-0 sm:mr-2" /><span className="hidden sm:inline">Editar</span></>}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[var(--brilla-bg-overlay)] backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {tempPhotoUrl ? (
              <img src={tempPhotoUrl} alt="Foto de perfil" className="h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover shadow-lg border-4 border-[var(--brilla-primary)] opacity-80" />
            ) : (
              <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[var(--brilla-bg-surface)] flex items-center justify-center border-4 border-[var(--brilla-primary)] opacity-80">
                <User size={64} className="text-[var(--brilla-accent-light)]" />
              </div>
            )}
             {isEditing && (
              <div className="w-full max-w-md">
                <label htmlFor="photoUrl" className={labelClass}>URL de Foto de Perfil</label>
                <div className="flex space-x-2">
                    <input
                    type="url"
                    id="photoUrl"
                    name="photoUrl"
                    value={formData.photoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.png"
                    className={inputClass}
                    disabled={!isEditing}
                    />
                    <button 
                        type="button" 
                        onClick={() => setTempPhotoUrl(formData.photoUrl || '')}
                        className="p-2.5 bg-[var(--brilla-bg-surface)] hover:bg-[var(--brilla-primary-hover)] text-white rounded-lg disabled:opacity-50"
                        title="Actualizar vista previa"
                        disabled={!isEditing}
                    >
                        <ImageIcon size={20}/>
                    </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>Nombre</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brilla-accent-light)]" />
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Tu nombre" disabled={!isEditing} required />
            </div>
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Correo Electrónico</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brilla-accent-light)]" />
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="tu@correo.com" disabled={!isEditing} required />
            </div>
          </div>
          <div>
            <label htmlFor="birthDate" className={labelClass}>Fecha de Nacimiento</label>
             <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brilla-accent-light)]" />
              <input 
                type="date" 
                id="birthDate" 
                name="birthDate" 
                value={formData.birthDate} 
                onChange={handleDateChange} 
                className={`${inputClass} pl-10 date-input`}
                disabled={!isEditing} 
              />
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-[var(--brilla-border-color)]">
              <label className={`${labelClass} mb-2 flex items-center`}><Palette size={18} className="mr-2 text-[var(--brilla-accent-light)]" /> Seleccionar Tema</label>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(themes).map((themeOption: ThemeColors) => (
                  <button
                    type="button"
                    key={themeOption.name}
                    onClick={() => handleThemeChange(themeOption.name as ThemeName)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                      ${formData.theme === themeOption.name ? 'border-[var(--brilla-primary)] scale-105 shadow-lg' : 'border-transparent hover:border-[var(--brilla-accent-light)] opacity-80 hover:opacity-100'}
                    `}
                    style={{ backgroundColor: themeOption.bgGradientVia, color: themeOption.selectionText }}
                    title={themeOption.displayName}
                  >
                    <div className="flex items-center justify-center mb-1.5">
                       <span className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: themeOption.primary}}></span>
                       <span className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: themeOption.accent}}></span>
                       <span className="w-4 h-4 rounded-full" style={{backgroundColor: themeOption.accentLight}}></span>
                    </div>
                    {themeOption.displayName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isEditing && (
            <button 
              type="submit" 
              className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-6"
            >
              <Save size={20} className="mr-2" /> Guardar Cambios
            </button>
          )}
        </form>

        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="flex-shrink-0">
            <ProfileSection
              favoriteMessages={favoriteMessages}
              removeFavoriteMessage={removeFavoriteMessage}
            />
          </div>
          
          <div className="flex-shrink-0 bg-[var(--brilla-bg-overlay)] backdrop-blur-md shadow-2xl rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[var(--brilla-text-gradient-from)] mb-4 flex items-center">
              <Award size={24} className="mr-2" /> Logros que Brillan
            </h3>
            {Object.keys(groupedAchievements).length > 0 ? (
               Object.entries(groupedAchievements).map(([categoryKey, achievementsInCategory]) => (
                <div key={categoryKey} className="mb-6">
                  <h4 className="text-lg font-semibold text-[var(--brilla-accent-light)] mb-3">{ACHIEVEMENT_CATEGORIES[categoryKey as AchievementCategoryKey]}</h4>
                  <div className="space-y-3">
                    {achievementsInCategory.map(ach => {
                      const isUnlocked = !!unlockedAchievements[ach.id];
                      const unlockedDate = isUnlocked ? new Date(unlockedAchievements[ach.id]!.unlockedAt).toLocaleDateString() : null;
                      return (
                        <div 
                          key={ach.id} 
                          className={`p-3 rounded-lg transition-all duration-300 border ${
                            isUnlocked 
                              ? 'bg-[var(--brilla-primary)]/20 border-[var(--brilla-primary)]/50' 
                              : 'bg-[var(--brilla-bg-base)] opacity-70 border-transparent hover:border-[var(--brilla-accent-light)]/20'
                          }`}
                          title={isUnlocked ? `Desbloqueado el ${unlockedDate}` : ach.triggerConditionText}
                        >
                          <div className="flex items-center">
                            <AchievementIconDisplay 
                              iconName={ach.iconName} 
                              isUnlocked={isUnlocked} 
                              isPremiumLocked={ach.isPremiumFeature && !isUnlocked} 
                            />
                            <div>
                              <h5 className={`font-semibold ${isUnlocked ? 'text-[var(--brilla-text-primary)]' : 'text-[var(--brilla-text-secondary)] opacity-75'}`}>
                                {ach.name} 
                                {ach.isPremiumFeature && !isUnlocked && <Star size={12} className="inline mb-1 ml-1 text-yellow-400 opacity-70" />}
                              </h5>
                              <p className={`text-xs ${isUnlocked ? 'text-[var(--brilla-accent-light)] opacity-90' : 'text-[var(--brilla-text-secondary)] opacity-75'}`}>
                                {ach.description}
                              </p>
                               {isUnlocked && unlockedDate && (
                                <p className="text-xs text-[var(--brilla-primary)] opacity-80 mt-0.5">Desbloqueado: {unlockedDate}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[var(--brilla-text-secondary)] py-4">No hay logros definidos o no se pudieron cargar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
        