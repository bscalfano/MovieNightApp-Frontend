import axios from 'axios';
import authService from './authService';

const API_URL = 'https://localhost:7137/api/PublicCalendar';

const publicCalendarService = {
  getUserCalendar: async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  }
};

export default publicCalendarService;