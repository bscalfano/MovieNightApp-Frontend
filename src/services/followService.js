import axios from 'axios';
import authService from './authService';

const API_URL = 'https://localhost:7137/api/Follow';

const followService = {
  getFollowStats: async () => {
    const response = await axios.get(`${API_URL}/stats`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query },
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  getFollowers: async () => {
    const response = await axios.get(`${API_URL}/followers`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  getFollowing: async () => {
    const response = await axios.get(`${API_URL}/following`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  followUser: async (userId) => {
    await axios.post(`${API_URL}/${userId}`, {}, {
      headers: authService.getAuthHeader()
    });
  },

  unfollowUser: async (userId) => {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: authService.getAuthHeader()
    });
  }
};

export default followService;