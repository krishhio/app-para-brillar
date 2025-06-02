
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  currentDisplayMonth: Date;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  onMonthChange: (newMonthDate: Date) => void;
  entryDates: string[]; // New prop for dates with entries
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDisplayMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  entryDates, // Destructure new prop
}) => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const year = currentDisplayMonth.getFullYear();
  const month = currentDisplayMonth.getMonth(); // 0-11

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Adjust startingDayOfWeek: 0 (Sun) for US, 1 (Mon) for ISO 8601.
  // Assuming Sunday is 0 as per typical getDay()
  let startingDayOfWeek = firstDayOfMonth.getDay(); 
  // If your week visually starts on Monday, and getDay() is 0 for Sunday:
  // startingDayOfWeek = (firstDayOfMonth.getDay() === 0) ? 6 : firstDayOfMonth.getDay() - 1;


  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-1 sm:p-1.5 text-center"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === todayString;
    const hasEntry = entryDates.includes(dateStr);

    let dayButtonClasses = `p-1 sm:p-1.5 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-xs sm:text-sm transition-colors duration-150 ease-in-out relative `;

    if (isSelected) {
      dayButtonClasses += 'bg-[var(--brilla-primary)] text-[var(--brilla-selection-text)] font-semibold scale-110 ';
    } else if (isToday) {
      dayButtonClasses += 'ring-1 ring-[var(--brilla-accent)] text-[var(--brilla-accent)] ';
    } else {
      dayButtonClasses += 'text-[var(--brilla-text-primary)] opacity-90 hover:bg-[var(--brilla-button-secondary-bg)] ';
    }
    
    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(dateStr)}
        className={dayButtonClasses}
        aria-label={`Seleccionar día ${day}, ${isSelected ? 'seleccionado' : ''} ${hasEntry ? 'con entrada' : ''}`}
      >
        {day}
        {hasEntry && !isSelected && (
          <span 
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--brilla-primary)] rounded-full opacity-75"
            aria-hidden="true"
            title="Este día tiene una entrada"
          ></span>
        )}
      </button>
    );
  }

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weekDayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']; // Assuming Sunday start for display

  return (
    <div className="bg-[var(--brilla-bg-surface)] border border-[var(--brilla-border-color)] rounded-lg shadow-2xl p-3 sm:p-4 w-full max-w-xs sm:max-w-sm mx-auto animate-fadeInScaleUp">
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <button onClick={handlePrevMonth} className="p-1.5 rounded-md hover:bg-[var(--brilla-button-secondary-bg)] text-[var(--brilla-accent-light)]" aria-label="Mes anterior">
          <ChevronLeft size={20} />
        </button>
        <div className="font-semibold text-sm sm:text-base text-[var(--brilla-accent-light)]">
          {monthNames[month]} {year}
        </div>
        <button onClick={handleNextMonth} className="p-1.5 rounded-md hover:bg-[var(--brilla-button-secondary-bg)] text-[var(--brilla-accent-light)]" aria-label="Mes siguiente">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs text-[var(--brilla-text-secondary)] mb-1 sm:mb-2">
        {weekDayNames.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days}
      </div>
    </div>
  );
};

export default CalendarView;
