
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GratitudeEntry, EmojiFeeling, EMOJI_OPTIONS, EMOJI_LABELS } from '../types';
import { ArrowLeft, Save, Feather, CalendarDays, CheckSquare, Smile, Frown, Meh, Star, ChevronsRight, Edit3, Trash2, Info, ChevronLeft, ChevronRight, XCircle, BarChartHorizontalBig } from 'lucide-react';
import CalendarView from './CalendarView'; // Import the new CalendarView component

interface GratitudeJournalScreenProps {
  entries: GratitudeEntry[];
  onAddEntry: (entryData: Omit<GratitudeEntry, 'id' | 'timestamp'> & { date: string }) => void; // Ensure date is part of the data for onAddEntry
  onNavigateBack: () => void;
  onNavigateToWeeklySummary: () => void;
  // onRemoveEntry?: (id: string) => void; // Optional: for future delete functionality
}

const INITIAL_ACHIEVEMENT_COUNT = 3;
const INITIAL_GRATITUDE_COUNT = 3;

const GratitudeJournalScreen: React.FC<GratitudeJournalScreenProps> = ({
  entries,
  onAddEntry,
  onNavigateBack,
  onNavigateToWeeklySummary,
  // onRemoveEntry
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date()); // For month navigation in calendar
  const entriesEndRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);


  // Form state
  const [currentMood, setCurrentMood] = useState<EmojiFeeling | null>(null);
  const [currentAchievements, setCurrentAchievements] = useState(
    Array(INITIAL_ACHIEVEMENT_COUNT).fill({ text: '', completed: false })
  );
  const [currentGratitudes, setCurrentGratitudes] = useState(
    Array(INITIAL_GRATITUDE_COUNT).fill('')
  );
  const [currentBestMoment, setCurrentBestMoment] = useState('');
  const [currentLearnedToday, setCurrentLearnedToday] = useState('');
  const [currentDespite, setCurrentDespite] = useState('');
  const [currentFlowedBecause, setCurrentFlowedBecause] = useState('');
  const [currentDailyThoughts, setCurrentDailyThoughts] = useState('');
  const [entryDateForForm, setEntryDateForForm] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // When form opens, set its date to selectedDate if available, else today.
    if (showForm) {
      setEntryDateForForm(selectedDate || new Date().toISOString().split('T')[0]);
    }
  }, [showForm, selectedDate]);
  

  const resetForm = () => {
    setCurrentMood(null);
    setCurrentAchievements(Array(INITIAL_ACHIEVEMENT_COUNT).fill({ text: '', completed: false }));
    setCurrentGratitudes(Array(INITIAL_GRATITUDE_COUNT).fill(''));
    setCurrentBestMoment('');
    setCurrentLearnedToday('');
    setCurrentDespite('');
    setCurrentFlowedBecause('');
    setCurrentDailyThoughts('');
    // Do not reset entryDateForForm here, it should persist or be set based on context
  };

  const handleSaveEntry = () => {
    if (!currentMood && currentAchievements.every(a => !a.text.trim()) && currentGratitudes.every(g => !g.trim()) && !currentBestMoment.trim() && !currentLearnedToday.trim() && !currentDailyThoughts.trim()) {
        // Basic validation: if everything is empty, maybe don't save or show a message.
        // For now, we allow saving empty entries if the user wishes.
    }

    const entryDataToSave = {
      date: entryDateForForm, // Include the date for the entry
      moodEmoji: currentMood || undefined, 
      achievements: currentAchievements.map(a => ({ text: a.text.trim(), completed: a.completed })),
      gratitudes: currentGratitudes.map(g => g.trim()),
      bestMoment: currentBestMoment.trim(),
      learnedToday: currentLearnedToday.trim(),
      negativeToPositive: {
        despite: currentDespite.trim(),
        flowedBecause: currentFlowedBecause.trim(),
      },
      dailyThoughts: currentDailyThoughts.trim(),
    };
    onAddEntry(entryDataToSave);
    resetForm();
    setShowForm(false);
  };
  
  const handleAchievementChange = (index: number, field: 'text' | 'completed', value: string | boolean) => {
    setCurrentAchievements(prev =>
      prev.map((ach, i) =>
        i === index ? { ...ach, [field]: value } : ach
      )
    );
  };

  const handleGratitudeChange = (index: number, value: string) => {
    setCurrentGratitudes(prev =>
      prev.map((grat, i) => (i === index ? value : grat))
    );
  };

  useEffect(() => {
    if (showForm || entries.length > 0 || selectedDate) { // Added selectedDate to dependencies
        entriesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries, showForm, selectedDate]); // Added selectedDate

  const dateToYyyyMmDd = (dateObj: Date): string => {
    return dateObj.toISOString().split('T')[0];
  };
  
  const handleDateSelectFromCalendar = (date: string) => {
    setSelectedDate(date);
    setShowCalendar(false);
    if (showForm) { // If form is open, also update its date
        setEntryDateForForm(date);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = selectedDate ? new Date(selectedDate + 'T00:00:00Z') : new Date(); // Use UTC to avoid timezone shifts with date part
    if (direction === 'prev') {
      currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    } else {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    const newSelectedDate = dateToYyyyMmDd(currentDate);
    setSelectedDate(newSelectedDate);
    if (showForm) { // If form is open, also update its date
        setEntryDateForForm(newSelectedDate);
    }
  };
  
  const clearDateSelection = () => {
    setSelectedDate(null);
     if (showForm) { // If form is open, reset its date to today when clearing selection
        setEntryDateForForm(new Date().toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);


  const formatDateForDisplay = (isoDate: string | null) => {
    if (!isoDate) return "Todas las Entradas";
    const date = new Date(isoDate + 'T00:00:00Z'); // Use UTC
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'UTC'
    });
  };
  
  const formatDateForEntry = (isoDate: string) => {
    const date = new Date(isoDate + 'T00:00:00Z'); 
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' 
    });
  };

  const filteredEntries = selectedDate 
    ? entries.filter(entry => entry.date === selectedDate)
    : entries;

  const sortedEntries = [...filteredEntries].sort((a, b) => b.timestamp - a.timestamp);
  
  const renderEmojiIcon = (emoji: EmojiFeeling | undefined, size: number = 16, className: string = "") => {
    if (!emoji) return null;
    return <span style={{ fontSize: `${size}px`, lineHeight: `${size}px` }} className={className}>{emoji}</span>;
  };

  const entryDates = useMemo(() => {
    const datesWithEntries = new Set<string>();
    entries.forEach(entry => {
      if (entry.date) {
        datesWithEntries.add(entry.date);
      }
    });
    return Array.from(datesWithEntries);
  }, [entries]);
  
  const inputBaseClass = "w-full bg-[var(--brilla-bg-base)] border border-[var(--brilla-border-color)] text-[var(--brilla-text-primary)] placeholder-[var(--brilla-text-secondary)] rounded-lg p-2.5 focus:ring-2 focus:ring-[var(--brilla-ring-color)] focus:border-[var(--brilla-ring-color)] outline-none transition-colors text-sm";
  const textareaBaseClass = `${inputBaseClass} min-h-[60px]`;
  const labelClass = "block text-sm font-semibold text-[var(--brilla-accent-light)] mb-1.5";
  const headerButtonClass = "flex items-center text-[var(--brilla-accent-light)] hover:text-[var(--brilla-accent)] transition-colors p-1.5 sm:p-2 rounded-md hover:bg-[var(--brilla-button-secondary-bg)]";


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] text-[var(--brilla-text-primary)]">
      <header className="bg-[var(--brilla-bg-overlay)] backdrop-blur-md shadow-md p-3 sm:p-4 sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={onNavigateBack} className={headerButtonClass} aria-label="Volver">
            <ArrowLeft size={22} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline text-sm">Volver</span>
          </button>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button onClick={() => navigateDate('prev')} className={headerButtonClass} aria-label="Día anterior" title="Día anterior">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setShowCalendar(!showCalendar)} className={`${headerButtonClass} relative`} aria-label="Seleccionar fecha" title="Seleccionar fecha">
              <CalendarDays size={20} />
            </button>
            <button onClick={() => navigateDate('next')} className={headerButtonClass} aria-label="Día siguiente" title="Día siguiente">
              <ChevronRight size={20} />
            </button>
             {selectedDate && (
              <button onClick={clearDateSelection} className={`${headerButtonClass} text-red-400/80 hover:text-red-500`} aria-label="Ver todas las entradas" title="Ver todas las entradas">
                <XCircle size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
             <button onClick={onNavigateToWeeklySummary} className={headerButtonClass} aria-label="Resumen Semanal" title="Resumen Semanal">
                <BarChartHorizontalBig size={20} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline text-sm">Resumen</span>
            </button>
            <button
                onClick={() => {
                    if (showForm) {
                      resetForm();
                    } else {
                      // Set date for new entry when opening form
                      setEntryDateForForm(selectedDate || new Date().toISOString().split('T')[0]);
                    }
                    setShowForm(!showForm);
                }}
                className={`flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm
                ${showForm 
                    ? 'bg-red-600/80 hover:bg-red-700/80 text-white' 
                    : 'bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)]'
                }`}
                aria-label={showForm ? "Cancelar nueva entrada" : "Escribir nueva entrada"}
            >
                {showForm ? 'Cancelar' : <><Edit3 size={16} className="mr-0 sm:mr-1.5" /> <span className="hidden sm:inline">Escribir</span></>}
            </button>
          </div>
        </div>
        {showCalendar && (
            <div ref={calendarRef} className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 mt-2">
                <CalendarView
                    currentDisplayMonth={calendarViewDate}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelectFromCalendar}
                    onMonthChange={setCalendarViewDate}
                    entryDates={entryDates} // Pass entryDates here
                />
            </div>
        )}
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <h2 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] mb-4 daily-frase-font">
            {formatDateForDisplay(selectedDate)}
        </h2>

        {showForm && (
          <div className="mb-6 bg-[var(--brilla-bg-surface)] p-4 sm:p-6 rounded-xl shadow-xl animate-fadeInScaleUp space-y-5">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--brilla-text-gradient-from)] to-[var(--brilla-text-gradient-to)] daily-frase-font">
                    Nueva Entrada para el Día
                </h3>
                <input 
                    type="date" 
                    value={entryDateForForm}
                    onChange={(e) => setEntryDateForForm(e.target.value)}
                    className={`${inputBaseClass} w-auto date-input`}
                    aria-label="Fecha de la entrada"
                />
            </div>
            
            <div>
              <label className={`${labelClass} flex items-center`}><Smile size={16} className="mr-2 text-[var(--brilla-accent-light)] opacity-80"/> En general hoy me sentí:</label>
              <div className="flex justify-around items-center p-2 bg-[var(--brilla-bg-base)] rounded-lg">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setCurrentMood(emoji)}
                    className={`p-1 rounded-full transition-all duration-200 transform hover:scale-125 ${currentMood === emoji ? 'bg-[var(--brilla-primary)] scale-110 ring-2 ring-offset-2 ring-offset-[var(--brilla-bg-base)] ring-[var(--brilla-primary)]' : 'opacity-70 hover:opacity-100'}`}
                    title={EMOJI_LABELS[emoji]}
                    aria-label={`Seleccionar humor: ${EMOJI_LABELS[emoji]}`}
                  >
                    {renderEmojiIcon(emoji, 28)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`${labelClass} flex items-center`}><CheckSquare size={16} className="mr-2 text-[var(--brilla-accent-light)] opacity-80"/> 3 Cosas que logré hoy:</label>
              {currentAchievements.map((ach, index) => (
                <div key={`ach-${index}`} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={ach.completed}
                    onChange={(e) => handleAchievementChange(index, 'completed', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-[var(--brilla-primary)] bg-[var(--brilla-bg-base)] border-[var(--brilla-border-color)] rounded focus:ring-1 focus:ring-[var(--brilla-primary)] cursor-pointer"
                    aria-label={`Logro ${index + 1} completado`}
                  />
                  <input
                    type="text"
                    value={ach.text}
                    onChange={(e) => handleAchievementChange(index, 'text', e.target.value)}
                    placeholder={`Logro #${index + 1}`}
                    className={inputBaseClass}
                    aria-label={`Texto del logro ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className={`${labelClass} flex items-center`}><Feather size={16} className="mr-2 text-[var(--brilla-accent-light)] opacity-80"/> 3 Cosas que agradezco hoy:</label>
              {currentGratitudes.map((grat, index) => (
                <input
                  key={`grat-${index}`}
                  type="text"
                  value={grat}
                  onChange={(e) => handleGratitudeChange(index, e.target.value)}
                  placeholder={`Agradecimiento #${index + 1}`}
                  className={`${inputBaseClass} mb-2`}
                  aria-label={`Texto del agradecimiento ${index + 1}`}
                />
              ))}
            </div>
            
            <div>
              <label htmlFor="bestMoment" className={`${labelClass} flex items-center`}><Star size={16} className="mr-2 text-[var(--brilla-accent-light)] opacity-80"/>La mejor parte de mi día fue:</label>
              <textarea id="bestMoment" value={currentBestMoment} onChange={(e) => setCurrentBestMoment(e.target.value)} placeholder="Describe ese momento especial..." className={textareaBaseClass} />
            </div>

            <div>
              <label htmlFor="learnedToday" className={`${labelClass} flex items-center`}><Info size={16} className="mr-2 text-[var(--brilla-accent-light)] opacity-80"/>Hoy aprendí:</label>
              <textarea id="learnedToday" value={currentLearnedToday} onChange={(e) => setCurrentLearnedToday(e.target.value)} placeholder="Algo nuevo que descubriste o una lección..." className={textareaBaseClass} />
            </div>

            <div>
              <label className={`${labelClass} flex items-center`}><ChevronsRight size={16} className="mr-2 text-[var(--brilla-accent-light)] opacity-80"/>Convirtiendo negativos en positivos:</label>
              <div className="space-y-2">
                <textarea value={currentDespite} onChange={(e) => setCurrentDespite(e.target.value)} placeholder="A pesar de..." className={textareaBaseClass} />
                <textarea value={currentFlowedBecause} onChange={(e) => setCurrentFlowedBecause(e.target.value)} placeholder="...todo fluyó porque..." className={textareaBaseClass} />
              </div>
            </div>
            
            <div>
              <label htmlFor="dailyThoughts" className={`${labelClass} flex items-center`}><Edit3 size={16} className="mr-2 text-[var(--brilla-accent-light)] opacity-80"/>Mis pensamientos del día:</label>
              <textarea id="dailyThoughts" value={currentDailyThoughts} onChange={(e) => setCurrentDailyThoughts(e.target.value)} placeholder="Escribe libremente tus reflexiones..." rows={6} className={textareaBaseClass} />
            </div>

            <button
              onClick={handleSaveEntry}
              className="mt-4 w-full sm:w-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors text-base"
            >
              <Save size={20} className="mr-2" /> Guardar Entrada
            </button>
          </div>
        )}

        <div className={`flex-grow space-y-4 overflow-y-auto ${showForm ? 'max-h-[calc(100vh-550px)] sm:max-h-[calc(100vh-600px)]' : 'max-h-[calc(100vh-250px)]'} pr-2 custom-scrollbar`}>
          {sortedEntries.length === 0 && !showForm && (
            <div className="text-center py-10 text-[var(--brilla-accent-light)] opacity-70">
              <Feather size={48} className="mx-auto mb-4" />
              <p className="text-xl font-semibold">{selectedDate ? "No hay entradas para este día." : "Tu diario está esperando."}</p>
              <p className="mt-1">{selectedDate ? "Prueba seleccionando otra fecha o escribe una nueva entrada." : "Añade tu primera entrada de gratitud para empezar a ver la magia."}</p>
               <button
                onClick={() => {
                    setEntryDateForForm(selectedDate || new Date().toISOString().split('T')[0]);
                    setShowForm(true);
                }}
                className="mt-6 bg-[var(--brilla-primary)] hover:bg-[var(--brilla-primary-hover)] text-[var(--brilla-selection-text)] font-semibold py-2.5 px-5 rounded-lg transition-colors text-md inline-flex items-center group shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Edit3 size={18} className="mr-2" /> {selectedDate ? "Escribir para este día" : "Escribir mi primera entrada"}
              </button>
            </div>
          )}
          {sortedEntries.map((entry) => (
            <div key={entry.id} className="bg-[var(--brilla-bg-surface)] p-4 rounded-xl shadow-lg animate-fadeIn">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-[var(--brilla-border-color)]">
                <div className="flex items-center text-[var(--brilla-accent-light)] text-sm">
                  <CalendarDays size={16} className="mr-2 opacity-80" />
                  {formatDateForEntry(entry.date)}
                </div>
                {entry.moodEmoji && renderEmojiIcon(entry.moodEmoji, 20, "opacity-90")}
              </div>
              
              {entry.moodEmoji || entry.achievements?.some(a=>a.text) || entry.gratitudes?.some(g=>g) || entry.bestMoment || entry.learnedToday || entry.dailyThoughts ? ( 
                <div className="space-y-3 text-sm">
                  {entry.achievements && entry.achievements.some(a => a.text) && (
                    <div>
                      <strong className="text-[var(--brilla-accent-light)]">Logros:</strong>
                      <ul className="list-disc list-inside pl-2">
                        {entry.achievements.filter(a => a.text).map((ach, i) => (
                          <li key={i} className={ach.completed ? 'line-through text-green-400/70' : ''}>
                            {ach.text} {ach.completed ? <span className="text-xs opacity-80">(Completado)</span> : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.gratitudes && entry.gratitudes.some(g => g) && (
                    <div>
                      <strong className="text-[var(--brilla-accent-light)]">Agradecimientos:</strong>
                      <ul className="list-disc list-inside pl-2">
                        {entry.gratitudes.filter(g => g).map((grat, i) => <li key={i}>{grat}</li>)}
                      </ul>
                    </div>
                  )}
                  {entry.bestMoment && <p><strong className="text-[var(--brilla-accent-light)]">Mejor momento:</strong> {entry.bestMoment}</p>}
                  {entry.learnedToday && <p><strong className="text-[var(--brilla-accent-light)]">Aprendí:</strong> {entry.learnedToday}</p>}
                  {entry.negativeToPositive && (entry.negativeToPositive.despite || entry.negativeToPositive.flowedBecause) && (
                     <p><strong className="text-[var(--brilla-accent-light)]">A pesar de</strong> {entry.negativeToPositive.despite || "..."} <strong className="text-[var(--brilla-accent-light)]">fluyó por</strong> {entry.negativeToPositive.flowedBecause || "..."}</p>
                  )}
                  {entry.dailyThoughts && <p className="mt-2 pt-2 border-t border-[var(--brilla-border-color)]/50 whitespace-pre-wrap"><strong className="text-[var(--brilla-accent-light)]">Pensamientos:</strong> {entry.dailyThoughts}</p>}
                </div>
              ) : ( // Fallback for old text-only entries
                <p className="text-[var(--brilla-text-primary)] whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                  {entry.text}
                </p>
              )}
            </div>
          ))}
          <div ref={entriesEndRef} />
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-[var(--brilla-accent-light)] opacity-70 border-t border-[var(--brilla-border-color)]">
        <p>Cultivar la gratitud ilumina tu camino.</p>
      </footer>
    </div>
  );
};

export default GratitudeJournalScreen;
