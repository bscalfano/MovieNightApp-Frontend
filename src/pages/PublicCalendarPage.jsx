import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import publicCalendarService from '../services/publicCalendarService';
import authService from '../services/authService';
import CalendarView from '../components/CalendarView';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfilePicture from '../components/ProfilePicture';
import MovieNightViewModal from '../components/MovieNightViewModal';
import { format } from 'date-fns';
import { format12Hour } from '../utils/timeFormat';

function PublicCalendarPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState(null);
  const [viewModal, setViewModal] = useState({ isOpen: false, movieNightId: null });
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadCalendar();
  }, [userId]);

  const loadCalendar = async () => {
    try {
      const data = await publicCalendarService.getUserCalendar(userId);
      setCalendarData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading calendar:', error);
      if (error.response?.status === 403) {
        toast.error('You must be friends to view this calendar');
      } else if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Failed to load calendar');
      }
      setLoading(false);
      navigate('/friends');
    }
  };

  const handleMovieClick = (id) => {
    if (calendarData.isOwnCalendar) {
      // If viewing own calendar, redirect to home page to edit
      navigate('/', { state: { editMovieId: id } });
    } else {
      // If viewing someone else's calendar, open view-only modal
      setViewModal({ isOpen: true, movieNightId: id });
    }
  };

  const handleDateClick = (date) => {
    // Only allow adding if viewing own calendar
    if (calendarData.isOwnCalendar) {
      navigate('/', { state: { addMovieDate: date } });
    } else {
      toast.info('You can only add movie nights to your own calendar');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading calendar..." />;
  }

  if (!calendarData) {
    return null;
  }

  const { user, movieNights, totalMovieNights, friendsCount, isOwnCalendar } = calendarData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
          >
            ← Back
          </button>

          <div className="flex items-center gap-6 bg-white rounded-lg shadow-md p-6">
            <ProfilePicture
              src={user.profilePictureUrl}
              alt={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
              size="lg"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {isOwnCalendar ? 'Your Calendar' : `${user.firstName || user.email}'s Calendar`}
              </h1>
              <p className="text-gray-600 mt-2">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </p>
              <div className="flex gap-6 mt-4">
                <button
                  onClick={() => setView('list')}
                  className="text-center hover:bg-gray-50 rounded-lg p-2 transition"
                >
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">{movieNights.length}</p>
                </button>
                <button
                  onClick={() => navigate(`/user/${userId}/friends`)}
                  className="text-center hover:bg-gray-50 rounded-lg p-2 transition"
                >
                  <p className="text-sm text-gray-600">Friends</p>
                  <p className="text-2xl font-bold text-blue-600">{friendsCount || 0}</p>
                </button>
              </div>
            </div>
            {isOwnCalendar && (
              <Link
                to="/"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition whitespace-nowrap"
              >
                Go to My Calendar
              </Link>
            )}
          </div>
        </div>

        {/* View Toggle */}
        {movieNights.length > 0 && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg ${
                view === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg ${
                view === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              List View
            </button>
          </div>
        )}

        {/* Content */}
        {movieNights.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600 mb-4">
              {isOwnCalendar ? 'You have' : `${user.firstName || user.email} has`} no upcoming movie nights scheduled.
            </p>
            {isOwnCalendar && (
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Schedule a movie night!
              </Link>
            )}
          </div>
        ) : view === 'calendar' ? (
          <CalendarView 
            movieNights={movieNights} 
            onEdit={handleMovieClick}
            onDateClick={handleDateClick}
          />
        ) : (
          <div className="space-y-4">
            {movieNights.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer flex gap-6"
              >
                {movie.imageUrl && (
                  <img
                    src={movie.imageUrl}
                    alt={movie.movieTitle}
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{movie.movieTitle}</h3>
                  {movie.genre && (
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-2">
                      {movie.genre}
                    </span>
                  )}
                  <p className="text-gray-600 mb-1">
                    📅 {format(new Date(movie.scheduledDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-gray-600 mb-3">
                    🕐 {format12Hour(movie.startTime)}
                  </p>
                  {movie.notes && (
                    <p className="text-gray-700 text-sm italic">"{movie.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View-Only Modal */}
      <MovieNightViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, movieNightId: null })}
        movieNightId={viewModal.movieNightId}
        isOwner={calendarData?.isOwnCalendar}
      />
    </div>
  );
}

export default PublicCalendarPage;