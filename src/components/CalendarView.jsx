import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

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

  const handleDayClick = (day, moviesOnDay) => {
    // If there are no movies on this day, open add modal with this date
    if (moviesOnDay.length === 0 && onDateClick) {
      onDateClick(day);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={previousMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Next →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
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
          const hasMovies = moviesOnDay.length > 0;

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day, moviesOnDay)}
              className={`min-h-24 border rounded-lg p-2 transition ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${isToday ? 'ring-2 ring-indigo-500' : ''} ${
                !hasMovies ? 'hover:border-indigo-500 hover:border-2 cursor-pointer' : ''
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {format(day, 'd')}
              </div>
              {moviesOnDay.map(movie => (
                <button
                  key={movie.id}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent day click when clicking movie
                    onEdit(movie.id);
                  }}
                  className="w-full bg-indigo-100 text-indigo-800 text-xs p-1 rounded mb-1 hover:bg-indigo-200 transition cursor-pointer text-left"
                  title={`Click to edit: ${movie.movieTitle}`}
                >
                  <div className="font-semibold truncate">{movie.movieTitle}</div>
                  <div className="text-xs">{movie.startTime}</div>
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