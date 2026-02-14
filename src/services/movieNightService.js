import axios from 'axios';

const API_URL = 'https://localhost:7137/api/MovieNights'; // Update port if different

// You can find your exact port by looking at the URL when you run your .NET app

const movieNightService = {
  // Get all movie nights
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get upcoming movie nights
  getUpcoming: async () => {
    const response = await axios.get(`${API_URL}/upcoming`);
    return response.data;
  },

  // Get past movie nights
  getPast: async () => {
    const response = await axios.get(`${API_URL}/past`);
    return response.data;
  },

  // Get single movie night
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create new movie night
  create: async (movieNight) => {
    const response = await axios.post(API_URL, movieNight);
    return response.data;
  },

  // Update movie night
  update: async (id, movieNight) => {
    const response = await axios.put(`${API_URL}/${id}`, movieNight);
    return response.data;
  },

  // Delete movie night
  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default movieNightService;