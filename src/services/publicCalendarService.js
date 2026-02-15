import axios from 'axios';
import authService from './authService';

const API_URL = 'https://localhost:7137/api/PublicCalendar';

const publicCalendarService = {
  getUserCalendar: async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  getMovieNightDetails: async (movieNightId) => {
    const response = await axios.get(`${API_URL}/movie/${movieNightId}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  attendMovieNight: async (movieNightId) => {
    const response = await axios.post(`${API_URL}/movie/${movieNightId}/attend`, {}, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  unattendMovieNight: async (movieNightId) => {
    const response = await axios.delete(`${API_URL}/movie/${movieNightId}/attend`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  }
};

export default publicCalendarService;