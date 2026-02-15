import axios from 'axios';
import authService from './authService';

const API_URL = 'https://localhost:7137/api/MovieNights'; // Update port if different

const movieNightService = {
  getAll: async () => {
    const response = await axios.get(API_URL, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  getUpcoming: async () => {
    const response = await axios.get(`${API_URL}/upcoming`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  getPast: async () => {
    const response = await axios.get(`${API_URL}/past`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  create: async (movieNight) => {
    const response = await axios.post(API_URL, movieNight, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  update: async (id, movieNight) => {
    const response = await axios.put(`${API_URL}/${id}`, movieNight, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: authService.getAuthHeader()
    });
  }
};

export default movieNightService;