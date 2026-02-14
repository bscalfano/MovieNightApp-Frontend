import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const tmdbService = {
  // Search for movies
  searchMovies: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          language: 'en-US',
          page: 1
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          language: 'en-US'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting movie details:', error);
      throw error;
    }
  },

  // Get full poster URL
  getPosterUrl: (posterPath) => {
    if (!posterPath) return null;
    return `${IMAGE_BASE_URL}${posterPath}`;
  }
};

export default tmdbService;