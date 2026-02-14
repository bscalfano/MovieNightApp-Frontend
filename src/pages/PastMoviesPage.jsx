import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import movieNightService from '../services/movieNightService';
import MovieNightCard from '../components/MovieNightCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

function PastMoviesPage() {
  const [movieNights, setMovieNights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, movieId: null, movieTitle: '' });

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
      toast.error('Failed to load past movies');
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, title) => {
    setDeleteDialog({ isOpen: true, movieId: id, movieTitle: title });
  };

  const handleDeleteConfirm = async () => {
    try {
      await movieNightService.delete(deleteDialog.movieId);
      toast.success('Movie night deleted');
      setDeleteDialog({ isOpen: false, movieId: null, movieTitle: '' });
      loadPastMovies();
    } catch (err) {
      console.error('Error deleting movie night:', err);
      toast.error('Failed to delete movie night');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, movieId: null, movieTitle: '' });
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
              to="/add"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Schedule your first movie night!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movieNights.map((movie) => (
              <MovieNightCard
                key={movie.id}
                movieNight={movie}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Movie Night"
        message={`Are you sure you want to delete "${deleteDialog.movieTitle}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default PastMoviesPage;