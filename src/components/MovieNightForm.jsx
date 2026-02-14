import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import MovieSearch from './MovieSearch';

function MovieNightForm({ onSubmit, initialData = null }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showSearch, setShowSearch] = useState(true);
  const [isManualEntry, setIsManualEntry] = useState(false); // Track if manually entered
  const [hasBlurred, setHasBlurred] = useState(false);

  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    movieTitle: initialData?.movieTitle || '',
    scheduledDate: initialData?.scheduledDate 
      ? format(new Date(initialData.scheduledDate), 'yyyy-MM-dd')
      : '',
    startTime: initialData?.startTime || '19:00:00',
    notes: initialData?.notes || '',
    imageUrl: initialData?.imageUrl || '',
    genre: initialData?.genre || ''
  });

  const handleMovieSelect = (movieData) => {
  setFormData(prev => ({
    ...prev,
    movieTitle: movieData.title,
    imageUrl: movieData.posterUrl || '',
    notes: movieData.overview || prev.notes,
    genre: movieData.genre || ''
  }));
  setShowSearch(false);
  setIsManualEntry(false); // Mark as TMDB selection
  setHasBlurred(false); // Reset blur state
};

const handleMovieTitleChange = (value) => {
  setFormData(prev => ({
    ...prev,
    movieTitle: value
  }));
  setShowSearch(true);
  // Don't set isManualEntry here anymore
  if (errors.movieTitle) {
    setErrors(prev => ({ ...prev, movieTitle: '' }));
  }
};

const handleMovieTitleBlur = () => {
  // Only mark as manual entry if they typed something and didn't select from TMDB
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Ensure time has seconds (HH:MM:SS format)
    let timeWithSeconds = formData.startTime;
    if (timeWithSeconds.split(':').length === 2) {
      // If format is HH:MM, add :00
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
    
    console.log('Data being sent:', dataToSend);
    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      {/* Combined Movie Title Search */}
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

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          {initialData ? 'Update' : 'Create'} Movie Night
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default MovieNightForm;