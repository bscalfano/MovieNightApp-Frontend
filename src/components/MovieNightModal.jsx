import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import MovieSearch from './MovieSearch';

function MovieNightModal({ isOpen, onClose, onSave, onDelete, initialData = null }) {
  const [errors, setErrors] = useState({});
  const [showSearch, setShowSearch] = useState(true);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    movieTitle: '',
    scheduledDate: '',
    startTime: '19:00:00',
    notes: '',
    imageUrl: '',
    genre: ''
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          movieTitle: initialData.movieTitle || '',
          scheduledDate: initialData.scheduledDate 
            ? format(new Date(initialData.scheduledDate), 'yyyy-MM-dd')
            : '',
          startTime: initialData.startTime || '19:00:00',
          notes: initialData.notes || '',
          imageUrl: initialData.imageUrl || '',
          genre: initialData.genre || ''
        });
        setIsManualEntry(false);
      } else {
        setFormData({
          movieTitle: '',
          scheduledDate: '',
          startTime: '19:00:00',
          notes: '',
          imageUrl: '',
          genre: ''
        });
        setIsManualEntry(false);
      }
      setErrors({});
      setShowSearch(true);
      setHasBlurred(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, initialData]);

  const handleMovieSelect = (movieData) => {
    setFormData(prev => ({
      ...prev,
      movieTitle: movieData.title,
      imageUrl: movieData.posterUrl || '',
      notes: movieData.overview || prev.notes,
      genre: movieData.genre || ''
    }));
    setShowSearch(false);
    setIsManualEntry(false);
    setHasBlurred(false);
  };

  const handleMovieTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      movieTitle: value
    }));
    setShowSearch(true);
    if (errors.movieTitle) {
      setErrors(prev => ({ ...prev, movieTitle: '' }));
    }
  };

  const handleMovieTitleBlur = () => {
    if (formData.movieTitle.trim() && showSearch) {
      setIsManualEntry(true);
      setHasBlurred(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.movieTitle.trim()) {
      newErrors.movieTitle = 'Movie title is required';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Date is required';
    } else if (new Date(formData.scheduledDate) < new Date(today)) {
      newErrors.scheduledDate = 'Cannot schedule a movie in the past';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSaving(true);
    
    let timeWithSeconds = formData.startTime;
    if (timeWithSeconds.split(':').length === 2) {
      timeWithSeconds = `${timeWithSeconds}:00`;
    }
    
    const dataToSend = {
      movieTitle: formData.movieTitle,
      scheduledDate: formData.scheduledDate,
      startTime: timeWithSeconds,
      notes: formData.notes || null,
      imageUrl: formData.imageUrl || null,
      genre: formData.genre || null
    };
    
    try {
      await onSave(dataToSend);
      setSaving(false);
      onClose();
    } catch (error) {
      setSaving(false);
      toast.error('Failed to save movie night');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && initialData) {
      onDelete(initialData.id, initialData.movieTitle);
      onClose();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Edit Movie Night' : 'Add Movie Night'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Movie Title Search */}
            <div className="mb-4">
              <MovieSearch 
                onMovieSelect={handleMovieSelect}
                movieTitle={formData.movieTitle}
                onMovieTitleChange={handleMovieTitleChange}
                onBlur={handleMovieTitleBlur}
                showSearch={showSearch}
                hasError={!!errors.movieTitle}
              />
              {errors.movieTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.movieTitle}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Date *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                min={today}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.scheduledDate && (
                <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.startTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Genre
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Action, Comedy, Drama, etc."
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Any notes about the movie night..."
              />
            </div>

            {/* Only show Image URL field for manual entries */}
            {isManualEntry && (
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/movie-poster.jpg"
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
                )}
                {formData.imageUrl && (
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="mt-2 w-32 h-auto rounded shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            )}

            {/* Show poster preview for TMDB selections */}
            {!isManualEntry && formData.imageUrl && (
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Movie Poster
                </label>
                <img 
                  src={formData.imageUrl} 
                  alt="Movie Poster" 
                  className="w-48 h-auto rounded shadow-md"
                />
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              {initialData && onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
                  disabled={saving}
                >
                  Delete
                </button>
              )}
              <div className="flex-1"></div>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-semibold"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:bg-indigo-400"
                disabled={saving}
              >
                {saving ? 'Saving...' : (initialData ? 'Update' : 'Create')}
              </button>
            </div>
          </form>

          {/* Delete Confirmation Overlay */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Movie Night
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete "{formData.movieTitle}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieNightModal;