import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import movieNightService from '../services/movieNightService';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieNightModal from '../components/MovieNightModal';
import { format12Hour } from '../utils/timeFormat';

function PastMoviesPage() {
  const navigate = useNavigate();
  const [pastMovies, setPastMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, movieNight: null, attendees: [] });

  const user = authService.getCurrentUser();

  useEffect(() => {
    loadPastMovies();
  }, []);

  const loadPastMovies = async () => {
    try {
      const data = await movieNightService.getPast();
      setPastMovies(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading past movies:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        authService.logout();
        navigate('/login');
      } else {
        toast.error('Failed to load past movies');
      }
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const response = await movieNightService.getById(id);
      setEditModal({ 
        isOpen: true, 
        movieNight: response.movieNight || response,
        attendees: response.attendees || [] 
      });
    } catch (error) {
      toast.error('Failed to load movie night');
    }
  };

  const handleEditSave = async (formData) => {
    try {
      await movieNightService.update(editModal.movieNight.id, formData);
      toast.success('Movie night updated successfully! ✨');
      setEditModal({ isOpen: false, movieNight: null, attendees: [] });
      loadPastMovies();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id, title) => {
    try {
      await movieNightService.delete(id);
      toast.success('Movie night deleted');
      setEditModal({ isOpen: false, movieNight: null, attendees: [] });
      loadPastMovies();
    } catch (err) {
      console.error('Error deleting movie night:', err);
      toast.error('Failed to delete movie night');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading past movies..." />;
  }

  return (
    <div className="min-h-screen bg-[#1a1d29]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/calendar" className="text-[#40BCF4] hover:text-[#35a5d9] mb-2 inline-block">
            ← Back to Calendar
          </Link>
          <h1 className="text-4xl font-bold text-white">Past Movie Nights</h1>
          {user && (
            <p className="text-gray-400 mt-1">
              {user.firstName || user.email}'s viewing history
            </p>
          )}
        </div>

        {/* Past Movies List */}
        {pastMovies.length === 0 ? (
          <div className="text-center py-12 bg-[#252836] rounded-lg border border-gray-700">
            <p className="text-xl text-gray-400 mb-4">No past movie nights yet.</p>
            <p className="text-gray-500">Movie nights you've had will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleEditClick(movie.id)}
                className="bg-[#252836] rounded-lg border border-gray-700 p-6 hover:border-[#40BCF4] transition cursor-pointer flex gap-6"
              >
                {movie.imageUrl && (
                  <img
                    src={movie.imageUrl}
                    alt={movie.movieTitle}
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{movie.movieTitle}</h3>
                  {movie.genre && (
                    <span className="inline-block bg-[#40BCF4] text-white text-xs px-2 py-1 rounded mb-2">
                      {movie.genre}
                    </span>
                  )}
                  <p className="text-gray-400 mb-1">
                    📅 {format(new Date(movie.scheduledDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-gray-400 mb-3">
                    🕐 {format12Hour(movie.startTime)}
                  </p>
                  {movie.notes && (
                    <p className="text-gray-300 text-sm italic line-clamp-3">"{movie.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Movie Night Modal */}
      <MovieNightModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, movieNight: null, attendees: [] })}
        onSave={handleEditSave}
        onDelete={handleDelete}
        initialData={editModal.movieNight}
        attendees={editModal.attendees}
      />
    </div>
  );
}

export default PastMoviesPage;