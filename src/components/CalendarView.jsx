import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, isBefore, startOfDay } from 'date-fns';
import { format12Hour } from '../utils/timeFormat';

function CalendarView({ movieNights, onEdit, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getMoviesForDay = (day) => {
    return movieNights.filter(movie => 
      isSameDay(new Date(movie.scheduledDate), day)
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day, e) => {
    // Only trigger if clicking on the day cell itself, not on movie buttons
    if (e.target.closest('.movie-card-button')) {
      return;
    }

    // Don't allow clicking on past dates
    const today = startOfDay(new Date());
    if (isBefore(startOfDay(day), today)) {
      return;
    }

    if (onDateClick) {
      onDateClick(day);
    }
  };

  return (
    <div className="bg-[#252836] rounded-lg shadow-lg p-6 border border-gray-700">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={previousMonth}
          className="px-4 py-2 bg-[#2d3142] text-gray-300 rounded hover:bg-[#363b4d] transition border border-gray-700"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-bold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-[#2d3142] text-gray-300 rounded hover:bg-[#363b4d] transition border border-gray-700"
        >
          Next →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const moviesOnDay = getMoviesForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, new Date());
          const isPast = isBefore(startOfDay(day), startOfDay(new Date()));

          return (
            <div
              key={day.toISOString()}
              onClick={(e) => handleDayClick(day, e)}
              className={`min-h-24 border-2 rounded-lg p-2 transition ${
                !isCurrentMonth 
                  ? 'bg-[#1a1d29] text-gray-600 border-gray-800' 
                  : 'bg-[#2d3142] border-gray-700'
              } ${isToday ? 'ring-2 ring-[#40BCF4]' : ''} ${
                isPast ? 'opacity-60' : 'cursor-pointer hover:border-[#40BCF4]'
              }`}
            >
              <div className="font-semibold text-sm mb-1 text-gray-300">
                {format(day, 'd')}
              </div>
              {moviesOnDay.map(movie => (
                <button
                  key={movie.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(movie.id);
                  }}
                  className="movie-card-button w-full bg-[#40BCF4] text-white text-xs p-1 rounded mb-1 hover:bg-[#35a5d9] transition text-left"
                  title={`Click to edit: ${movie.movieTitle}`}
                >
                  <div className="font-semibold truncate">{movie.movieTitle}</div>
                  <div className="text-xs opacity-90">{format12Hour(movie.startTime)}</div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;