import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import MovieSearch from './MovieSearch';
import ProfilePicture from './ProfilePicture';

function MovieNightModal({ isOpen, onClose, onSave, onDelete, initialData = null, initialDate = null, attendees = [] }) {
  const [errors, setErrors] = useState({});
  const [showSearch, setShowSearch] = useState(true);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tmdbSelectedTitle, setTmdbSelectedTitle] = useState(null);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    movieTitle: '',
    scheduledDate: '',
    startTime: '19:00:00',
    notes: '',
    imageUrl: '',
    genre: ''
  });

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
        setShowSearch(false);
        setTmdbSelectedTitle(initialData.movieTitle || null);
      } else {
        setFormData({
          movieTitle: '',
          scheduledDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
          startTime: '19:00:00',
          notes: '',
          imageUrl: '',
          genre: ''
        });
        setIsManualEntry(false);
        setShowSearch(true);
        setTmdbSelectedTitle(null);
      }
      setErrors({});
      setHasBlurred(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, initialData, initialDate]);

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
    setTmdbSelectedTitle(movieData.title);
  };

  const handleMovieTitleChange = (value) => {
    if (tmdbSelectedTitle && value !== tmdbSelectedTitle) {
      setFormData(prev => ({
        ...prev,
        movieTitle: value,
        notes: '',
        imageUrl: '',
        genre: ''
      }));
      setTmdbSelectedTitle(null);
      setIsManualEntry(true);
    } else {
      setFormData(prev => ({
        ...prev,
        movieTitle: value
      }));
    }
    
    setShowSearch(true);
    if (errors.movieTitle) {
      setErrors(prev => ({ ...prev, movieTitle: '' }));
    }
  };

  const handleMovieTitleBlur = () => {
    if (formData.movieTitle.trim() && showSearch && !tmdbSelectedTitle) {
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
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#252836] rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
          {/* Header */}
          <div className="bg-[#2d3142] border-b border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {initialData ? 'Edit Movie Night' : 'Add Movie Night'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content - Two Column Layout */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex">
              {/* Left Column - Form Fields */}
              <div className="flex-1 p-6 border-r border-gray-700">
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
                    <p className="text-red-400 text-sm mt-1">{errors.movieTitle}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 font-semibold mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    min={today}
                    className={`w-full px-3 py-2 bg-[#2d3142] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] text-white ${
                      errors.scheduledDate ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.scheduledDate}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 font-semibold mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-[#2d3142] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] text-white ${
                      errors.startTime ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.startTime && (
                    <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 font-semibold mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                    placeholder="Action, Comedy, Drama, etc."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 font-semibold mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                    placeholder="Any notes about the movie night..."
                  />
                </div>

                {/* Attendees - Only show when editing */}
                {initialData && attendees && attendees.length > 0 && (
                  <div className="mb-4 pt-4 border-t border-gray-700">
                    <label className="block text-gray-300 font-semibold mb-3">
                      Attendees ({attendees.length})
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {attendees.map(attendee => (
                        <div key={attendee.userId} className="flex items-center gap-3 p-2 bg-[#2d3142] rounded-lg">
                          <ProfilePicture
                            src={attendee.profilePictureUrl}
                            alt={attendee.firstName && attendee.lastName 
                              ? `${attendee.firstName} ${attendee.lastName}` 
                              : attendee.email}
                            size="sm"
                          />
                          <div>
                            <p className="font-semibold text-white text-sm">
                              {attendee.firstName && attendee.lastName
                                ? `${attendee.firstName} ${attendee.lastName}`
                                : attendee.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Only show Image URL field for manual entries */}
                {isManualEntry && (
                  <div className="mb-4">
                    <label className="block text-gray-300 font-semibold mb-2">
                      Poster Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-[#2d3142] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] text-white placeholder-gray-500 ${
                        errors.imageUrl ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="https://example.com/movie-poster.jpg"
                    />
                    {errors.imageUrl && (
                      <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Poster Area */}
              <div className="w-80 p-6 bg-[#1a1d29] flex flex-col">
                <label className="block text-gray-300 font-semibold mb-3">
                  Movie Poster
                </label>
                <div className="flex-1 flex items-start justify-center">
                  {formData.imageUrl ? (
                    <img 
                      src={formData.imageUrl} 
                      alt="Movie Poster" 
                      className="max-w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[#2d3142] rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-600">
                      <div className="text-center p-4">
                        <svg 
                          className="mx-auto h-12 w-12 text-gray-600 mb-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                        <p className="text-sm">No poster</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer Buttons */}
          <div className="bg-[#2d3142] border-t border-gray-700 px-6 py-4 flex gap-3">
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
              className="bg-[#363b4d] text-gray-300 py-2 px-4 rounded-lg hover:bg-[#3d4252] transition font-semibold"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-[#40BCF4] text-white py-2 px-4 rounded-lg hover:bg-[#35a5d9] transition font-semibold disabled:bg-[#35a5d9] disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>

          {/* Delete Confirmation Overlay */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="bg-[#252836] rounded-lg p-6 max-w-sm mx-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Delete Movie Night
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Are you sure you want to delete "{formData.movieTitle}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="flex-1 bg-[#363b4d] text-gray-300 py-2 px-4 rounded-lg hover:bg-[#3d4252] transition font-semibold"
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