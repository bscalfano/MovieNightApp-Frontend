import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import publicCalendarService from '../services/publicCalendarService';
import authService from '../services/authService';
import CalendarView from '../components/CalendarView';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfilePicture from '../components/ProfilePicture';
import MovieNightViewModal from '../components/MovieNightViewModal';

function PublicCalendarPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState(null);
  const [viewModal, setViewModal] = useState({ isOpen: false, movieNight: null });
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
    const movie = calendarData.movieNights.find(m => m.id === id);
    if (movie) {
      if (calendarData.isOwnCalendar) {
        // If viewing own calendar, redirect to home page to edit
        navigate('/', { state: { editMovieId: id } });
      } else {
        // If viewing someone else's calendar, open view-only modal
        setViewModal({ isOpen: true, movieNight: movie });
      }
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

  const { user, movieNights, totalMovieNights, isOwnCalendar } = calendarData;

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
                <div>
                  <p className="text-sm text-gray-600">Total Movie Nights</p>
                  <p className="text-2xl font-bold text-indigo-600">{totalMovieNights}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">{movieNights.length}</p>
                </div>
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

        {/* Calendar */}
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
        ) : (
          <CalendarView 
            movieNights={movieNights} 
            onEdit={handleMovieClick}
            onDateClick={handleDateClick}
          />
        )}
      </div>

      {/* View-Only Modal */}
      <MovieNightViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, movieNight: null })}
        movieNight={viewModal.movieNight}
      />
    </div>
  );
}

export default PublicCalendarPage;