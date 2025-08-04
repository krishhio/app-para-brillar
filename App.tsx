import React, { useState, useEffect, useCallback } from 'react';
import { MotivationalQuote, ChatMessage, UserProfile, View, ThemeName, Achievement, ALL_ACHIEVEMENTS, FeelingOption, FEELING_OPTIONS, GratitudeEntry } from './types';
import { themes, getTheme, DEFAULT_THEME_NAME } from './themes'; 
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import ProfilePage from './components/ProfilePage';
import ChatAIScreen from './components/ChatAIScreen'; 
import ChallengeScreen from './components/ChallengeScreen'; 
import GratitudeJournalScreen from './components/GratitudeJournalScreen'; 
import WeeklySummaryScreen from './components/WeeklySummaryScreen';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import AchievementNotification from './components/AchievementNotification';
import LoginScreen from './components/LoginScreen';
import { getUserProfile } from './services/userService';

const APP_PREFIX = 'brilla_';
const WELCOME_SHOWN_KEY = `${APP_PREFIX}welcome_shown_v1`;
const SELECTED_FEELING_KEY = `${APP_PREFIX}selected_feeling_v1`;
const FAVORITE_MESSAGES_KEY = `${APP_PREFIX}favorite_messages`;
const USER_PROFILE_KEY = `${APP_PREFIX}user_profile_v2`; 
const DAILY_MESSAGE_KEY_PREFIX = `${APP_PREFIX}daily_message_`;
const GRATITUDE_ENTRIES_KEY = `${APP_PREFIX}gratitude_entries_v2`; 

const CHAT_MESSAGE_LIMIT_FREE = 3;
const USER_CHAT_COUNT_KEY = `${APP_PREFIX}user_chat_count`;
const USER_CHAT_RESET_MONTH_KEY = `${APP_PREFIX}user_chat_reset_month`;

const PREMIUM_ACHIEVEMENT_ID = 'brilla-libro';
const TOKEN_KEY = `${APP_PREFIX}access_token`;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const applyThemeToDocument = (themeName?: ThemeName) => {
  const theme = getTheme(themeName);
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    if (typeof value === 'string') { 
        const cssVarName = `--brilla-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
        root.style.setProperty(cssVarName, value);
    }
  });
};

const defaultAchievementTrackingState = {
  dailyMessageViewDates: [],
  sharedQuoteIds: [],
  themeChangesCount: 0,
  gratitudeJournalFirstClicked: false,
  gratitudeJournalFirstEntryMade: false,
  gratitudeEntriesCount: 0,
  challengesVisited: false,
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('loading');
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingOption | null>(null);
  const [dailyMessage, setDailyMessage] = useState<MotivationalQuote | null>(null);
  const [favoriteMessages, setFavoriteMessages] = useState<MotivationalQuote[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]); 
  
  const [loadingMessage, setLoadingMessage] = useState<string>('Inicializando App para Brillar...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null); // Ya no usar localStorage
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [userChatMessagesUsedThisMonth, setUserChatMessagesUsedThisMonth] = useState<number>(0);
  const [userChatResetMonth, setUserChatResetMonth] = useState<string>('');

  const [showAchievementNotification, setShowAchievementNotification] = useState<boolean>(false);
  const [currentAchievementNotification, setCurrentAchievementNotification] = useState<Achievement | null>(null);
  
  const initializeUserProfile = useCallback((profileData?: Partial<UserProfile> | null): UserProfile => {
    const baseProfile: UserProfile = {
        name: profileData?.name || '',
        email: profileData?.email || '',
        birthDate: profileData?.birthDate || '',
        photoUrl: profileData?.photoUrl,
        theme: profileData?.theme || DEFAULT_THEME_NAME,
        selectedFeeling: profileData?.selectedFeeling || null, 
        unlockedAchievements: profileData?.unlockedAchievements || {},
        achievementTracking: {
            ...defaultAchievementTrackingState, // Start with all defaults
            ...(profileData?.achievementTracking || {}), // Override with stored values if they exist
        },
    };
    return baseProfile;
  }, []);


  useEffect(() => {
    if (!process.env.API_KEY) {
      setErrorMessage("La API KEY de Gemini no está configurada. Por favor, revisa las variables de entorno.");
      setApiKeyError(true);
      setView('error');
    } else {
      applyThemeToDocument(DEFAULT_THEME_NAME);
    }
  }, []);
  
  useEffect(() => {
    if (apiKeyError) return;

    const storedCountStr = localStorage.getItem(USER_CHAT_COUNT_KEY);
    const storedResetMonth = localStorage.getItem(USER_CHAT_RESET_MONTH_KEY);
    const currentMonth = new Date().toISOString().slice(0, 7); 

    if (storedResetMonth === currentMonth) {
      setUserChatMessagesUsedThisMonth(storedCountStr ? parseInt(storedCountStr, 10) : 0);
      setUserChatResetMonth(currentMonth);
    } else {
      setUserChatMessagesUsedThisMonth(0);
      setUserChatResetMonth(currentMonth);
      localStorage.setItem(USER_CHAT_COUNT_KEY, '0');
      localStorage.setItem(USER_CHAT_RESET_MONTH_KEY, currentMonth);
    }
  }, [apiKeyError]);

  useEffect(() => {
    if (apiKeyError) return;
    setLoadingMessage('Cargando tus datos...');
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      setToken(token);

      if (!token) {
        setView('login');
        return;
      }

      const welcomeShown = localStorage.getItem(WELCOME_SHOWN_KEY) === 'true';
      const storedFeeling = localStorage.getItem(SELECTED_FEELING_KEY) as FeelingOption | null;
      const storedFavorites = JSON.parse(localStorage.getItem(FAVORITE_MESSAGES_KEY) || '[]') as MotivationalQuote[];
      const storedUserProfileData = JSON.parse(localStorage.getItem(USER_PROFILE_KEY) || 'null') as UserProfile | null;
      const storedGratitudeEntries = JSON.parse(localStorage.getItem(GRATITUDE_ENTRIES_KEY) || '[]') as GratitudeEntry[]; 

      if (storedFeeling) setSelectedFeeling(storedFeeling);
      setFavoriteMessages(storedFavorites);
      setGratitudeEntries(storedGratitudeEntries); 
      
      const initializedProfile = initializeUserProfile(storedUserProfileData);
      if (storedFeeling) {
        initializedProfile.selectedFeeling = storedFeeling;
      } else if (initializedProfile.selectedFeeling) {
        setSelectedFeeling(initializedProfile.selectedFeeling);
      }

      setUserProfile(initializedProfile);
      applyThemeToDocument(initializedProfile.theme);
      
      setView('welcome');

    } catch (e) {
      console.error("Error loading from localStorage:", e);
      setErrorMessage("Hubo un problema al cargar tus datos guardados. Se iniciará con valores predeterminados.");
      const defaultProfile = initializeUserProfile(null);
      setUserProfile(defaultProfile);
      applyThemeToDocument(defaultProfile.theme);
      setView('welcome');
    }
  }, [apiKeyError, initializeUserProfile]);

  useEffect(() => {
    if (userProfile?.theme) {
      applyThemeToDocument(userProfile.theme);
    } else {
      applyThemeToDocument(DEFAULT_THEME_NAME);
    }
  }, [userProfile?.theme]);

  const unlockAchievement = useCallback((achievementId: string) => {
    setUserProfile(currentProfile => {
      if (!currentProfile || currentProfile.unlockedAchievements?.[achievementId]) {
        return currentProfile; 
      }

      const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement) return currentProfile;

      const updatedProfile: UserProfile = {
        ...currentProfile,
        unlockedAchievements: {
          ...(currentProfile.unlockedAchievements || {}), // Ensure robustness
          [achievementId]: { unlockedAt: Date.now() },
        },
      };
      
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));

      setCurrentAchievementNotification(achievement);
      setShowAchievementNotification(true);
      setTimeout(() => {
        setShowAchievementNotification(false);
        setCurrentAchievementNotification(null);
      }, 5000);
      return updatedProfile;
    });
  }, []);
  
  // --- Achievement Unlocking useEffects ---
  useEffect(() => { 
    if (userProfile?.achievementTracking && userProfile.unlockedAchievements) { 
      const count = userProfile.achievementTracking.themeChangesCount || 0;
      if (count >= 1 && !userProfile.unlockedAchievements['color-con-intencion']) {
        unlockAchievement('color-con-intencion');
      }
      if (count >= 5 && !userProfile.unlockedAchievements['cambio-consciente']) {
        unlockAchievement('cambio-con-sciente');
      }
    }
  }, [userProfile?.achievementTracking?.themeChangesCount, userProfile?.unlockedAchievements, unlockAchievement]);

  useEffect(() => { 
    if (userProfile?.achievementTracking?.gratitudeJournalFirstClicked && !userProfile.unlockedAchievements?.['primer-paso']) {
      unlockAchievement('primer-paso');
    }
  }, [userProfile?.achievementTracking?.gratitudeJournalFirstClicked, userProfile?.unlockedAchievements, unlockAchievement]);

  useEffect(() => { 
    if (userProfile?.achievementTracking?.gratitudeEntriesCount && 
        userProfile.achievementTracking.gratitudeEntriesCount >= 7 && 
        !userProfile.unlockedAchievements?.['brilla-por-dentro']) {
      unlockAchievement('brilla-por-dentro');
    }
  }, [userProfile?.achievementTracking?.gratitudeEntriesCount, userProfile?.unlockedAchievements, unlockAchievement]);

  useEffect(() => { 
    if (userProfile?.achievementTracking?.dailyMessageViewDates &&
        userProfile.achievementTracking.dailyMessageViewDates.length >= 30 &&
        !userProfile.unlockedAchievements?.['ritual-cumplido']) {
      unlockAchievement('ritual-cumplido');
    }
  }, [userProfile?.achievementTracking?.dailyMessageViewDates, userProfile?.unlockedAchievements, unlockAchievement]);

  useEffect(() => { 
    if (userProfile?.achievementTracking?.sharedQuoteIds &&
        userProfile.achievementTracking.sharedQuoteIds.length >= 1 &&
        !userProfile.unlockedAchievements?.['eco-de-luz']) {
      unlockAchievement('eco-de-luz');
    }
  }, [userProfile?.achievementTracking?.sharedQuoteIds, userProfile?.unlockedAchievements, unlockAchievement]);
  
  useEffect(() => { 
    if (userProfile?.achievementTracking?.sharedQuoteIds &&
        userProfile.achievementTracking.sharedQuoteIds.length >= 10 &&
        !userProfile.unlockedAchievements?.['multiplicadora-de-brillo']) {
      unlockAchievement('multiplicadora-de-brillo');
    }
  }, [userProfile?.achievementTracking?.sharedQuoteIds, userProfile?.unlockedAchievements, unlockAchievement]);

  useEffect(() => { 
    if (userProfile?.achievementTracking?.challengesVisited &&
        !userProfile.unlockedAchievements?.['tu-primer-reto']) {
      unlockAchievement('tu-primer-reto');
    }
  }, [userProfile?.achievementTracking?.challengesVisited, userProfile?.unlockedAchievements, unlockAchievement]);


  const handleWelcomeComplete = useCallback((feeling: FeelingOption) => {
    setSelectedFeeling(feeling);
    localStorage.setItem(SELECTED_FEELING_KEY, feeling);
    localStorage.setItem(WELCOME_SHOWN_KEY, 'true');

    setUserProfile(currentProfile => {
        let profileToUpdate = currentProfile ? { ...currentProfile, selectedFeeling: feeling } : initializeUserProfile({selectedFeeling: feeling});
        if (!profileToUpdate.theme) {
            profileToUpdate = { ...profileToUpdate, theme: DEFAULT_THEME_NAME };
        }
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileToUpdate));
        applyThemeToDocument(profileToUpdate.theme);
        return profileToUpdate;
    });
    
    setView('welcome'); 
  }, [initializeUserProfile]);

  const addFavoriteMessage = useCallback((message: MotivationalQuote) => {
    setFavoriteMessages(prev => {
      if (prev.find(fav => fav.id === message.id)) return prev;
      const updatedFavorites = [...prev, message];
      localStorage.setItem(FAVORITE_MESSAGES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const removeFavoriteMessage = useCallback((messageId: string) => {
    setFavoriteMessages(prev => {
      const updatedFavorites = prev.filter(msg => msg.id !== messageId);
      localStorage.setItem(FAVORITE_MESSAGES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);
  
  const handleSetDailyMessage = useCallback((message: MotivationalQuote | null) => {
    setDailyMessage(message);
  }, []);


  const handleProfileUpdate = useCallback((updatedProfileFromForm: UserProfile) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) {
        const newProf = initializeUserProfile(updatedProfileFromForm);
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProf));
        if (newProf.theme) applyThemeToDocument(newProf.theme);
        return newProf;
      }

      const baseTracking = { ...defaultAchievementTrackingState, ...(prevProfile.achievementTracking || {}) };
      let newAchievementTracking = { ...baseTracking };

      if (updatedProfileFromForm.theme && prevProfile.theme !== updatedProfileFromForm.theme) {
        newAchievementTracking.themeChangesCount = (baseTracking.themeChangesCount || 0) + 1;
      }
      
      const finalUpdatedProfile: UserProfile = {
        ...prevProfile, 
        ...updatedProfileFromForm, 
        achievementTracking: newAchievementTracking, 
      };
      
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(finalUpdatedProfile));
      if (finalUpdatedProfile.theme) {
        applyThemeToDocument(finalUpdatedProfile.theme);
      }

      if (finalUpdatedProfile.unlockedAchievements?.[PREMIUM_ACHIEVEMENT_ID] && !prevProfile.unlockedAchievements?.[PREMIUM_ACHIEVEMENT_ID]) {
        const premiumAchievement = ALL_ACHIEVEMENTS.find(a => a.id === PREMIUM_ACHIEVEMENT_ID);
        if (premiumAchievement) {
          setCurrentAchievementNotification(premiumAchievement);
          setShowAchievementNotification(true);
          setTimeout(() => {
            setShowAchievementNotification(false);
            setCurrentAchievementNotification(null);
          }, 5000);
        }
      }
      return finalUpdatedProfile;
    });
  }, [initializeUserProfile]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(WELCOME_SHOWN_KEY);
    localStorage.removeItem(SELECTED_FEELING_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    localStorage.removeItem(FAVORITE_MESSAGES_KEY);
    localStorage.removeItem(USER_CHAT_COUNT_KEY);
    localStorage.removeItem(USER_CHAT_RESET_MONTH_KEY);
    localStorage.removeItem(GRATITUDE_ENTRIES_KEY); 
        
    setUserProfile(initializeUserProfile(null));
    setSelectedFeeling(null);
    setFavoriteMessages([]);
    setChatMessages([]);
    setGratitudeEntries([]); 
    setUserChatMessagesUsedThisMonth(0);
    const currentMonth = new Date().toISOString().slice(0, 7);
    setUserChatResetMonth(currentMonth);
    applyThemeToDocument(DEFAULT_THEME_NAME);
    setView('welcome'); 
    setLoadingMessage('Cerrando sesión...');
    setTimeout(() => setLoadingMessage(''), 1000);
  }, [initializeUserProfile]);

  const handleFreeMessageSent = useCallback(() => {
    const newCount = userChatMessagesUsedThisMonth + 1;
    setUserChatMessagesUsedThisMonth(newCount);
    localStorage.setItem(USER_CHAT_COUNT_KEY, newCount.toString());
  }, [userChatMessagesUsedThisMonth]);

  const isUserPremium = !!userProfile?.unlockedAchievements?.[PREMIUM_ACHIEVEMENT_ID];
  const remainingFreeMessages = isUserPremium ? Infinity : CHAT_MESSAGE_LIMIT_FREE - userChatMessagesUsedThisMonth;

  const handleMessageViewed = useCallback(() => {
    setUserProfile(currentProfile => {
      if (!currentProfile) return currentProfile;
      const today = new Date().toISOString().split('T')[0];
      const baseTracking = { ...defaultAchievementTrackingState, ...(currentProfile.achievementTracking || {}) };
      const updatedTracking = {
        ...baseTracking,
        dailyMessageViewDates: Array.from(new Set([...(baseTracking.dailyMessageViewDates || []), today]))
      };
      const updatedProfile = { ...currentProfile, achievementTracking: updatedTracking };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);

  const handleMessageShared = useCallback((quoteId: string) => {
     setUserProfile(currentProfile => {
      if (!currentProfile) return currentProfile;
      const baseTracking = { ...defaultAchievementTrackingState, ...(currentProfile.achievementTracking || {}) };
      const updatedTracking = {
        ...baseTracking,
        sharedQuoteIds: Array.from(new Set([...(baseTracking.sharedQuoteIds || []), quoteId]))
      };
      const updatedProfile = { ...currentProfile, achievementTracking: updatedTracking };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);

  const handleGratitudeJournalLinkClicked = useCallback(() => {
    setUserProfile(currentProfile => {
      if (!currentProfile || currentProfile.achievementTracking?.gratitudeJournalFirstClicked) return currentProfile;
      const baseTracking = { ...defaultAchievementTrackingState, ...(currentProfile.achievementTracking || {}) };
      const updatedTracking = {
        ...baseTracking,
        gratitudeJournalFirstClicked: true
      };
      const updatedProfile = { ...currentProfile, achievementTracking: updatedTracking };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);

  const handleChallengeVisited = useCallback(() => {
    setUserProfile(currentProfile => {
      if (!currentProfile || currentProfile.achievementTracking?.challengesVisited) return currentProfile;
      const baseTracking = { ...defaultAchievementTrackingState, ...(currentProfile.achievementTracking || {}) };
      const updatedTracking = {
        ...baseTracking,
        challengesVisited: true,
      };
      const updatedProfile = { ...currentProfile, achievementTracking: updatedTracking };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);
  
  const addGratitudeEntry = useCallback((entryData: Omit<GratitudeEntry, 'id' | 'timestamp'> & { date: string }) => {
    const newEntry: GratitudeEntry = {
      id: `ge-${Date.now()}`,
      timestamp: Date.now(),
      date: entryData.date, 
      moodEmoji: entryData.moodEmoji,
      achievements: entryData.achievements,
      gratitudes: entryData.gratitudes,
      bestMoment: entryData.bestMoment,
      learnedToday: entryData.learnedToday,
      negativeToPositive: entryData.negativeToPositive,
      dailyThoughts: entryData.dailyThoughts,
    };
    setGratitudeEntries(prev => {
      const updatedEntries = [newEntry, ...prev];
      localStorage.setItem(GRATITUDE_ENTRIES_KEY, JSON.stringify(updatedEntries));
      return updatedEntries;
    });

    setUserProfile(currentProfile => {
      if (!currentProfile) return currentProfile;
      const baseTracking = { ...defaultAchievementTrackingState, ...(currentProfile.achievementTracking || {}) };
      const updatedTracking = {
        ...baseTracking,
        gratitudeEntriesCount: (baseTracking.gratitudeEntriesCount || 0) + 1,
        gratitudeJournalFirstEntryMade: true, 
      };
      
      const updatedProfile = { ...currentProfile, achievementTracking: updatedTracking };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);


  // Función para login real
  const handleLogin = (email: string, password: string, remember?: boolean) => {
    setLoginLoading(true);
    setLoginError(null);
    // Asegura que no se envíen espacios accidentales
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo_electronico: cleanEmail, password: cleanPassword })
    })
      .then(async res => {
        console.log('Respuesta login:', res);
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error login:', errorText);
          throw new Error('Credenciales incorrectas');
        }
        const data = await res.json();
        console.log('Login exitoso, data:', data);
        setToken(data.data.token);
        setLoginLoading(false);
      })
      .catch(err => {
        setLoginError(err.message || 'Error de autenticación');
        setLoginLoading(false);
      });
  };


  // Panel de depuración para mostrar el token (solo en desarrollo)
  const DebugTokenPanel = () => (
    process.env.NODE_ENV === 'development' && token ? (
      <div style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: 8,
        fontSize: 12,
        zIndex: 9999,
        maxWidth: 400,
        wordBreak: 'break-all',
      }}>
        <strong>Token JWT:</strong>
        <div style={{ fontSize: 10, marginTop: 4 }}>{token}</div>
        <div style={{ marginTop: 8 }}><strong>Vista actual:</strong> {view}</div>
      </div>
    ) : null
  );


  // useEffect para cargar perfil y avanzar tras login exitoso
  useEffect(() => {
    if (!token) return;
    setLoadingMessage('Cargando perfil de usuario...');
    getUserProfile(token)
      .then(profile => {
        setUserProfile({
          name: profile.nombre,
          email: profile.correo_electronico,
          birthDate: profile.fecha_nacimiento || '',
          photoUrl: profile.fotografia,
          theme: profile.id_color_tema || DEFAULT_THEME_NAME,
          selectedFeeling: null,
          unlockedAchievements: {},
          achievementTracking: { ...defaultAchievementTrackingState },
        });
        applyThemeToDocument(profile.id_color_tema || DEFAULT_THEME_NAME);
        setView('welcome');
        setLoadingMessage('');
      })
      .catch(err => {
        setLoginError('No se pudo cargar el perfil.');
        setToken(null);
        setLoadingMessage('');
      });
  }, [token]);

  if (view === 'loading' && !apiKeyError) return <LoadingSpinner message={loadingMessage} />;
  if (view === 'error' || apiKeyError) return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] flex flex-col items-center justify-center p-6">
      <ErrorDisplay message={errorMessage || "Ha ocurrido un error desconocido."} />
    </div>
  );

  const achievementPopup = showAchievementNotification && currentAchievementNotification && (
    <AchievementNotification 
      achievement={currentAchievementNotification} 
      onClose={() => {
        setShowAchievementNotification(false);
        setCurrentAchievementNotification(null);
      }} 
    />
  );


  switch (view) {
    case 'welcome':
      return (
        <>
        {achievementPopup}
        <WelcomeScreen
          onComplete={handleWelcomeComplete}
          feelingOptions={FEELING_OPTIONS}
          currentFeeling={selectedFeeling}
          userProfile={userProfile}
          dailyMessage={dailyMessage}
          setCurrentQuote={setDailyMessage}
          addFavorite={addFavoriteMessage}
          setLoadingMessage={setLoadingMessage}
          setErrorMessage={setErrorMessage}
          isGlobalLoading={false} 
          loadingMessage={loadingMessage}
          navigateToChatAI={() => setView('chatAI')}
          navigateToChallengeDetail={() => { setView('challengeDetail'); handleChallengeVisited(); }}
          navigateToProfile={() => setView('profile')}
          navigateToHomeDashboard={() => setView('home')}
          navigateToGratitudeJournal={() => setView('gratitudeJournal')} 
          handleLogout={handleLogout}
          welcomeShownKey={WELCOME_SHOWN_KEY}
          onMessageViewed={handleMessageViewed}
          onMessageShared={handleMessageShared}
          onGratitudeJournalLinkClicked={handleGratitudeJournalLinkClicked} 
          selectedFeeling={selectedFeeling}
        />
        <DebugTokenPanel />
        </>
      );
    case 'home':
      return (
        <>
        {achievementPopup}
        <HomeScreen
          selectedFeeling={selectedFeeling}
          dailyMessage={dailyMessage}
          setDailyMessage={setDailyMessage}
          addFavoriteMessage={addFavoriteMessage}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          setLoadingMessage={setLoadingMessage}
          setErrorMessage={setErrorMessage}
          loadingMessage={loadingMessage}
          isGlobalLoading={false}
          navigateToProfile={() => setView('profile')}
          userPhotoUrl={userProfile?.photoUrl}
          handleLogout={handleLogout}
          navigateToChatAI={() => setView('chatAI')}
          navigateToChallengeDetail={() => { setView('challengeDetail'); handleChallengeVisited(); }}
          navigateToWelcome={() => setView('welcome')}
        />
        <DebugTokenPanel />
        </>
      );
    case 'profile':
      return (
        <>
        {achievementPopup}
        <ProfilePage
          userProfile={userProfile || initializeUserProfile(null)}
          onUpdateProfile={handleProfileUpdate}
          onNavigateHome={() => setView('welcome')}
          favoriteMessages={favoriteMessages}
          removeFavoriteMessage={removeFavoriteMessage}
          allAchievements={ALL_ACHIEVEMENTS}
          unlockedAchievements={userProfile?.unlockedAchievements || {}}
        />
        <DebugTokenPanel />
        </>
      );
    case 'chatAI':
      return (
        <>
        {achievementPopup}
        <ChatAIScreen
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          setLoadingMessage={setLoadingMessage}
          setErrorMessage={setErrorMessage}
          onNavigateBack={() => setView('welcome')}
          remainingFreeMessages={remainingFreeMessages}
          onFreeMessageSent={handleFreeMessageSent}
          isPremiumUser={isUserPremium}
        />
        <DebugTokenPanel />
        </>
      );
    case 'challengeDetail':
        return (
          <>
          {achievementPopup}
          <ChallengeScreen onNavigateBack={() => setView('welcome')} />
          <DebugTokenPanel />
          </>
        );
    case 'gratitudeJournal': 
        return (
          <>
          {achievementPopup}
          <GratitudeJournalScreen
            entries={gratitudeEntries}
            onAddEntry={addGratitudeEntry}
            onNavigateBack={() => setView('welcome')}
            onNavigateToWeeklySummary={() => setView('weeklySummary')}
          />
          <DebugTokenPanel />
          </>
        );
    case 'weeklySummary':
        return (
            <>
            {achievementPopup}
            <WeeklySummaryScreen
                entries={gratitudeEntries}
                onNavigateBack={() => setView('gratitudeJournal')}
                isPremiumUser={isUserPremium} 
            />
            <DebugTokenPanel />
            </>
        );
    case 'login':
      return (
        <>
        <LoginScreen onLogin={handleLogin} loading={loginLoading} error={loginError} />
        <DebugTokenPanel />
        </>
      );
    default:
      return <LoadingSpinner message="Redirigiendo..." />;
  }
};

export default App;
