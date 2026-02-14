import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import movieNightService from '../services/movieNightService';
import MovieNightCard from '../components/MovieNightCard';
import CalendarView from '../components/CalendarView';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

function HomePage() {
  const [movieNights, setMovieNights] = useState([]);
  const [filteredMovieNights, setFilteredMovieNights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, movieId: null, movieTitle: '' });

  useEffect(() => {
    loadMovieNights();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovieNights(movieNights);
    } else {
      const filtered = movieNights.filter(movie =>
        movie.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.notes && movie.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMovieNights(filtered);
    }
  }, [searchTerm, movieNights]);

  const loadMovieNights = async () => {
    try {
      const data = await movieNightService.getUpcoming();
      setMovieNights(data);
      setFilteredMovieNights(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading movie nights:', err);
      toast.error('Failed to load movie nights');
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
      loadMovieNights();
    } catch (err) {
      console.error('Error deleting movie night:', err);
      toast.error('Failed to delete movie night');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, movieId: null, movieTitle: '' });
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie nights..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Movie Night Calendar</h1>
          <div className="flex gap-3">
            <Link
              to="/past"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              View Past Movies
            </Link>
            <Link
              to="/add"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              + Add Movie Night
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* View Toggle */}
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

        {/* Content */}
        {filteredMovieNights.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No movies found matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : filteredMovieNights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No upcoming movie nights scheduled.</p>
            <Link
              to="/add"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Schedule your first movie night!
            </Link>
          </div>
        ) : view === 'calendar' ? (
          <CalendarView movieNights={filteredMovieNights} onDelete={handleDeleteClick} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovieNights.map((movie) => (
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

export default HomePage;