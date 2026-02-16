import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import movieNightService from '../services/movieNightService';
import authService from '../services/authService';
import MovieNightCard from '../components/MovieNightCard';
import CalendarView from '../components/CalendarView';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieNightModal from '../components/MovieNightModal';
import ProfileDropdown from '../components/ProfileDropdown';

function HomePage() {
  const navigate = useNavigate();
  const [movieNights, setMovieNights] = useState([]);
  const [filteredMovieNights, setFilteredMovieNights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, movieNight: null, attendees: [] });
  const [selectedDate, setSelectedDate] = useState(null);

  const user = authService.getCurrentUser();

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
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        authService.logout();
        navigate('/login');
      } else {
        toast.error('Failed to load movie nights');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleAddClick = () => {
    setAddModal(true);
  };

  const handleDateClick = (date) => {
    setAddModal(true);
    setSelectedDate(date);
  };

  const handleAddSave = async (formData) => {
    try {
      await movieNightService.create(formData);
      toast.success('Movie night created successfully! 🎬');
      loadMovieNights();
    } catch (error) {
      throw error;
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
      loadMovieNights();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id, title) => {
    try {
      await movieNightService.delete(id);
      toast.success('Movie night deleted');
      setEditModal({ isOpen: false, movieNight: null, attendees: [] });
      loadMovieNights();
    } catch (err) {
      console.error('Error deleting movie night:', err);
      toast.error('Failed to delete movie night');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie nights..." />;
  }

  return (
    <div className="min-h-screen bg-[#1a1d29]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Title and Welcome */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white">Movie Night</h1>
              {user && (
                <p className="text-gray-400 mt-1">
                  Welcome back, {user.firstName || user.email}!
                </p>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 items-center">
              <Link
                to="/friends"
                state={{ from: '/calendar' }}
                className="bg-[#252836] text-gray-300 px-6 py-3 rounded-lg hover:bg-[#2d3142] transition whitespace-nowrap border border-gray-700"
              >
                Find Friends
              </Link>
              <Link
                to="/past"
                className="bg-[#252836] text-gray-300 px-6 py-3 rounded-lg hover:bg-[#2d3142] transition whitespace-nowrap border border-gray-700"
              >
                View Past Movies
              </Link>
              <button
                onClick={handleAddClick}
                className="bg-[#40BCF4] text-white px-6 py-3 rounded-lg hover:bg-[#35a5d9] transition whitespace-nowrap shadow-lg"
              >
                + Add Movie Night
              </button>
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 bg-[#252836] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg transition ${
                view === 'calendar'
                  ? 'bg-[#40BCF4] text-white'
                  : 'bg-[#252836] text-gray-300 border border-gray-700 hover:bg-[#2d3142]'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition ${
                view === 'list'
                  ? 'bg-[#40BCF4] text-white'
                  : 'bg-[#252836] text-gray-300 border border-gray-700 hover:bg-[#2d3142]'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredMovieNights.length === 0 && searchTerm ? (
          <div className="text-center py-12 bg-[#252836] rounded-lg border border-gray-700">
            <p className="text-xl text-gray-400 mb-4">No movies found matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#40BCF4] hover:text-[#35a5d9] font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : filteredMovieNights.length === 0 ? (
          <div className="text-center py-12 bg-[#252836] rounded-lg border border-gray-700">
            <p className="text-xl text-gray-400 mb-4">No upcoming movie nights scheduled.</p>
            <button
              onClick={handleAddClick}
              className="text-[#40BCF4] hover:text-[#35a5d9] font-semibold"
            >
              Schedule your first movie night!
            </button>
          </div>
        ) : view === 'calendar' ? (
          <CalendarView 
            movieNights={filteredMovieNights} 
            onEdit={handleEditClick}
            onDateClick={handleDateClick}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovieNights.map((movie) => (
              <MovieNightCard
                key={movie.id}
                movieNight={movie}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Movie Night Modal */}
      <MovieNightModal
        isOpen={addModal}
        onClose={() => {
          setAddModal(false);
          setSelectedDate(null);
        }}
        onSave={handleAddSave}
        initialDate={selectedDate}
      />

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

export default HomePage;