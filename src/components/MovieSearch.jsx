import { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService';

function MovieSearch({ onMovieSelect, movieTitle, onMovieTitleChange, onBlur, showSearch, hasError }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (movieTitle.length >= 2 && showSearch) {
      searchMovies();
    } else {
      setSearchResults([]);
    }
  }, [movieTitle, showSearch]);

  const searchMovies = async () => {
    setSearching(true);
    try {
      const results = await tmdbService.searchMovies(movieTitle);
      setSearchResults(results);
      setSearching(false);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearching(false);
    }
  };

  const handleSelectMovie = (movie) => {
    onMovieSelect({
      title: movie.title,
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
      overview: movie.overview,
      genre: movie.genre_names && movie.genre_names.length > 0 ? movie.genre_names[0] : ''
    });
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <label className="block text-gray-300 font-semibold mb-2">
        Movie Title *
      </label>
      <input
        type="text"
        value={movieTitle}
        onChange={(e) => onMovieTitleChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full px-3 py-2 bg-[#2d3142] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] text-white placeholder-gray-500 ${
          hasError ? 'border-red-500' : 'border-gray-600'
        }`}
        placeholder="Search for a movie..."
      />
      
      {searching && (
        <p className="text-sm text-gray-400 mt-1">Searching TMDB...</p>
      )}

      {searchResults.length > 0 && showSearch && (
        <div className="absolute z-10 w-full mt-1 bg-[#252836] border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {searchResults.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => handleSelectMovie(movie)}
              className="w-full text-left p-3 hover:bg-[#2d3142] transition flex gap-3 border-b border-gray-700 last:border-b-0"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-12 h-18 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-18 bg-[#2d3142] rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-white">{movie.title}</p>
                <p className="text-sm text-gray-400">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  {movie.genre_names && movie.genre_names.length > 0 && (
                    <span> • {movie.genre_names.slice(0, 2).join(', ')}</span>
                  )}
                </p>
                {movie.overview && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{movie.overview}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSearch;