
import React, { useState, useEffect } from 'react';
import { GratitudeEntry, EmojiFeeling, EMOJI_LABELS } from '../types';
import { geminiService } from '../services/geminiService'; 
import { ArrowLeft, BarChart2, Smile, CheckCircle, Gift, Brain, TrendingUp, Info, Star, LoaderCircle, AlertTriangle } from 'lucide-react';

interface WeeklySummaryScreenProps {
  entries: GratitudeEntry[];
  onNavigateBack: () => void;
  isPremiumUser: boolean; 
}

const WeeklySummaryScreen: React.FC<WeeklySummaryScreenProps> = ({ entries, onNavigateBack, isPremiumUser }) => {
  const [aiWeeklyAnalysis, setAiWeeklyAnalysis] = useState<string | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const getWeekStartDate = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getUTCDay(); // Use getUTCDay for consistency
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const startDate = new Date(d.setUTCDate(diff));
    startDate.setUTCHours(0,0,0,0); // Set to start of the day in UTC
    return startDate;
  };

  const latestEntryDate = entries.length > 0 && entries[0].date 
    ? new Date(entries[0].date + 'T00:00:00Z') // Ensure UTC context
    : new Date(new Date().setUTCHours(0,0,0,0)); // Default to today UTC start if no entries

  const weekStartDate = getWeekStartDate(latestEntryDate);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);
  weekEndDate.setUTCHours(23,59,59,999); // End of the 7th day in UTC


  const formatDateRange = (start: Date, end: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', timeZone: 'UTC' };
    return `${start.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)}, ${start.getUTCFullYear()}`;
  };

  const dateToYyyyMmDd = (dateObj: Date): string => {
    return dateObj.toISOString().split('T')[0];
  };

  const entriesForThisWeek = entries.filter(entry => {
    if (!entry.date) return false;
    const entryDate = new Date(entry.date + 'T00:00:00Z'); // UTC context for comparison
    return entryDate >= weekStartDate && entryDate <= weekEndDate;
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  useEffect(() => {
    if (entriesForThisWeek.length > 0) {
      const fetchAnalysis = async () => {
        setIsAnalysisLoading(true);
        setAiWeeklyAnalysis(null);
        setAnalysisError(null); 
        try {
          const analysis = await geminiService.generateWeeklySummaryAnalysis(entriesForThisWeek, isPremiumUser);
          setAiWeeklyAnalysis(analysis);
        } catch (error) {
          console.error("Error fetching weekly analysis from service:", error);
          if (error instanceof Error) {
            setAnalysisError(error.message); 
          } else {
            setAnalysisError("Ocurrió un error desconocido al generar el análisis.");
          }
        } finally {
          setIsAnalysisLoading(false);
        }
      };
      fetchAnalysis();
    } else {
        setAiWeeklyAnalysis(null);
        setAnalysisError(null);   
        setIsAnalysisLoading(false);
    }
  }, [entriesForThisWeek, isPremiumUser]); 

  const dailyMoods: { date: string, mood?: EmojiFeeling }[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStartDate);
    day.setUTCDate(weekStartDate.getUTCDate() + i);
    const dayString = dateToYyyyMmDd(day);
    const entryForDay = entriesForThisWeek.find(e => e.date === dayString);
    dailyMoods.push({ date: dayString, mood: entryForDay?.moodEmoji });
  }

  const totalAchievements = entriesForThisWeek.reduce((sum, entry) => 
    sum + (entry.achievements?.filter(a => a.completed).length || 0), 0
  );

  const allGratitudes = entriesForThisWeek.flatMap(entry => entry.gratitudes?.filter(g => g) || []);

  const renderEmojiIcon = (emoji: EmojiFeeling | undefined, size: number = 24, className: string = "") => {
    if (!emoji) return <div style={{width: size, height: size, fontSize: `${size*0.6}px`, lineHeight: `${size}px` }} className={`flex items-center justify-center text-[var(--brilla-text-secondary)] opacity-50 border border-dashed border-[var(--brilla-border-color)] rounded-full ${className}`}>-</div>;
    return <span style={{ fontSize: `${size}px`, lineHeight: `${size}px` }} className={className}>{emoji}</span>;
  };
  
  const cardBaseClass = "bg-[var(--brilla-bg-surface)] p-4 sm:p-6 rounded-xl shadow-lg";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] text-[var(--brilla-text-primary)]">
      <header className="bg-[var(--brilla-bg-overlay)] backdrop-blur-md shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="flex items-center text-[var(--brilla-accent-light)] hover:text-[var(--brilla-accent)] transition-colors p-2 rounded-md hover:bg-[var(--brilla-button-secondary-bg)]"
            aria-label="Volver al Diario"
          >
            <ArrowLeft size={24} className="mr-2" />
            Volver al Diario
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--brilla-accent-light)] quote-text font-cinzel">
            Resumen Semanal
          </h1>
          <div className="w-32 sm:w-40"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className={`${cardBaseClass} text-center`}>
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] daily-frase-font">
            Tu Semana en Gratitud
          </h2>
          <p className="text-[var(--brilla-text-secondary)] text-sm">{formatDateRange(weekStartDate, weekEndDate)}</p>
        </div>

        {entriesForThisWeek.length === 0 && !isAnalysisLoading ? (
            <div className={`${cardBaseClass} text-center py-10`}>
                <Info size={40} className="mx-auto mb-3 text-[var(--brilla-accent-light)] opacity-60"/>
                <p className="text-lg text-[var(--brilla-text-secondary)]">No hay entradas registradas para esta semana.</p>
                <p className="text-sm text-[var(--brilla-text-secondary)] opacity-80 mt-1">Escribe en tu diario para ver tu resumen aquí.</p>
            </div>
        ) : (
        <>
            <div className={cardBaseClass}>
                <h3 className="text-lg font-semibold text-[var(--brilla-accent-light)] mb-3 flex items-center"><Smile className="mr-2 text-[var(--brilla-primary)]" size={22}/>Tendencia de Ánimo</h3>
                <div className="flex justify-around items-center p-3 bg-[var(--brilla-bg-base)] rounded-lg">
                    {dailyMoods.map(({ date, mood }, index) => (
                    <div key={date} className="flex flex-col items-center" title={`${new Date(date + 'T00:00:00Z').toLocaleDateString('es-ES', { weekday: 'short', timeZone: 'UTC' })}`}>
                        {renderEmojiIcon(mood, 28)}
                        <span className="text-xs mt-1 text-[var(--brilla-text-secondary)] opacity-70">
                         {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'][new Date(date + 'T00:00:00Z').getUTCDay() === 0 ? 6 : new Date(date + 'T00:00:00Z').getUTCDay() -1]}
                        </span>
                    </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className={cardBaseClass}>
                    <h3 className="text-lg font-semibold text-[var(--brilla-accent-light)] mb-3 flex items-center"><CheckCircle className="mr-2 text-green-400" size={22}/>Logros Completados</h3>
                    <p className="text-4xl font-bold text-[var(--brilla-primary)] text-center">{totalAchievements}</p>
                    <p className="text-sm text-[var(--brilla-text-secondary)] text-center mt-1">logros marcados como completados esta semana.</p>
                </div>
                <div className={cardBaseClass}>
                    <h3 className="text-lg font-semibold text-[var(--brilla-accent-light)] mb-3 flex items-center"><Gift className="mr-2 text-pink-400" size={22}/>Puntos de Gratitud</h3>
                    {allGratitudes.length > 0 ? (
                    <div className="max-h-32 overflow-y-auto space-y-1 text-sm pr-1">
                        {allGratitudes.map((grat, i) => <p key={i} className="truncate">- {grat}</p>)}
                    </div>
                    ) : <p className="text-sm text-[var(--brilla-text-secondary)] italic">No se registraron agradecimientos específicos.</p>}
                </div>
            </div>
            
            <div className={`${cardBaseClass} border-l-4 border-[var(--brilla-primary)]`}>
                 <h3 className="text-lg font-semibold text-[var(--brilla-accent-light)] mb-3 flex items-center"><Brain className="mr-2 text-sky-400" size={22}/>Análisis con Brilla AI</h3>
                {isAnalysisLoading && (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <LoaderCircle size={32} className="animate-spin text-[var(--brilla-primary)] mb-3" />
                        <p className="text-[var(--brilla-text-secondary)]">Brilla AI está analizando tu semana...</p>
                    </div>
                )}
                {analysisError && !isAnalysisLoading && (
                     <div className="flex flex-col items-center justify-center p-6 text-center text-red-400">
                        <AlertTriangle size={32} className="mb-3" />
                        <p className="font-semibold">Error al Cargar Análisis</p>
                        <p className="text-sm opacity-90">{analysisError}</p>
                    </div>
                )}
                {aiWeeklyAnalysis && !isAnalysisLoading && !analysisError && (
                    <div className="text-[var(--brilla-text-secondary)] text-sm whitespace-pre-wrap leading-relaxed">
                        {aiWeeklyAnalysis}
                    </div>
                )}
                 {/* Fallback if no loading, no error, no analysis, but there are entries (e.g. API returns empty string for analysis) */}
                 {!isAnalysisLoading && !aiWeeklyAnalysis && !analysisError && entriesForThisWeek.length > 0 && (
                     <p className="text-[var(--brilla-text-secondary)] text-sm italic">
                        El análisis de tu semana aparecerá aquí una vez procesado.
                    </p>
                )}
            </div>
             <div className={`${cardBaseClass} text-center`}>
                <TrendingUp size={28} className="mx-auto mb-2 text-[var(--brilla-accent)] opacity-80"/>
                <p className="text-[var(--brilla-text-primary)] font-medium">Sigue registrando tus días.</p>
                <p className="text-sm text-[var(--brilla-text-secondary)]">Cuanta más información tenga Brilla AI, más personalizadas y útiles serán tus reflexiones.</p>
            </div>
        </>
        )}
      </main>

      <footer className="py-4 text-center text-sm text-[var(--brilla-accent-light)] opacity-70 border-t border-[var(--brilla-border-color)]">
        <p>Tu resumen semanal es una herramienta para conocerte mejor.</p>
      </footer>
    </div>
  );
};

export default WeeklySummaryScreen;