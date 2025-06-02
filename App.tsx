
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
      
      if (!welcomeShown && !storedUserProfileData) { 
         setView('welcome');
      } else {
         setView('welcome'); 
      }

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
        unlockAchievement('cambio-consciente');
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
        </>
      );
    case 'challengeDetail':
        return (
          <>
          {achievementPopup}
          <ChallengeScreen onNavigateBack={() => setView('welcome')} />
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
            </>
        );
    default:
      return <LoadingSpinner message="Redirigiendo..." />;
  }
};

export default App;
