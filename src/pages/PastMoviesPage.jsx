import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import movieNightService from '../services/movieNightService';
import MovieNightCard from '../components/MovieNightCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieNightModal from '../components/MovieNightModal';

function PastMoviesPage() {
  const [movieNights, setMovieNights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, movieNight: null });
  const navigate = useNavigate();

  useEffect(() => {
    loadPastMovies();
  }, []);

  const loadPastMovies = async () => {
  try {
    const data = await movieNightService.getPast();
    setMovieNights(data);
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
      const movieNight = await movieNightService.getById(id);
      setEditModal({ isOpen: true, movieNight });
    } catch (error) {
      toast.error('Failed to load movie night');
    }
  };

  const handleEditSave = async (formData) => {
    try {
      await movieNightService.update(editModal.movieNight.id, formData);
      toast.success('Movie night updated successfully! ✨');
      setEditModal({ isOpen: false, movieNight: null });
      loadPastMovies();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id, title) => {
    try {
      await movieNightService.delete(id);
      toast.success('Movie night deleted');
      setEditModal({ isOpen: false, movieNight: null });
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
              ← Back to Calendar
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Past Movie Nights</h1>
            <p className="text-gray-600 mt-2">Your movie watching history</p>
          </div>
        </div>

        {/* Content */}
        {movieNights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No past movie nights yet.</p>
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Go back to calendar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movieNights.map((movie) => (
              <MovieNightCard
                key={movie.id}
                movieNight={movie}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Movie Night Modal */}
      <MovieNightModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, movieNight: null })}
        onSave={handleEditSave}
        onDelete={handleDelete}
        initialData={editModal.movieNight}
      />
    </div>
  );
}

export default PastMoviesPage;