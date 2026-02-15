import { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService';

function MovieSearch({ onMovieSelect, movieTitle, onMovieTitleChange, onBlur, showSearch, hasError }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!showSearch) {
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      if (movieTitle.length >= 2) {
        searchMovies();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [movieTitle, showSearch]);

  const searchMovies = async () => {
    setSearching(true);
    try {
      const results = await tmdbService.searchMovies(movieTitle);
      setSearchResults(results.slice(0, 5));
      setShowResults(true);
      setSearching(false);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearching(false);
    }
  };

  const handleSelectMovie = async (movie) => {
    try {
      const details = await tmdbService.getMovieDetails(movie.id);
      
      const genre = details.genres && details.genres.length > 0 
        ? details.genres[0].name 
        : null;
      
      onMovieSelect({
        title: details.title,
        posterUrl: tmdbService.getPosterUrl(details.poster_path),
        overview: details.overview,
        releaseYear: details.release_date ? new Date(details.release_date).getFullYear() : null,
        genre: genre
      });
      
      setShowResults(false);
      setSearchResults([]);
    } catch (error) {
      console.error('Error selecting movie:', error);
    }
  };

  const handleInputFocus = () => {
    if (movieTitle.length >= 2 && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = (e) => {
    // Delay to allow click events on results to fire first
    setTimeout(() => {
      setShowResults(false); // Hide the dropdown
      if (onBlur) {
        onBlur();
      }
    }, 200);
  };

  return (
    <div className="relative">
      <label className="block text-gray-700 font-semibold mb-2">
        Movie Title *
      </label>
      <div className="relative">
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => onMovieTitleChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          placeholder="Search for a movie or type manually..."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            hasError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        
        {searching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2 bg-gray-50 border-b text-xs text-gray-600 font-semibold">
            Select from TMDB or continue typing manually
          </div>
          {searchResults.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing
              onClick={() => handleSelectMovie(movie)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 border-b last:border-b-0"
            >
              {movie.poster_path ? (
                <img
                  src={tmdbService.getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded shadow-sm"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{movie.title}</div>
                <div className="text-sm text-gray-600">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSearch;