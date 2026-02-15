import axios from 'axios';
import authService from './authService';

const API_URL = 'https://localhost:7137/api/Friends';

const friendsService = {
  getFriendStats: async () => {
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

  getFriends: async () => {
    const response = await axios.get(API_URL, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await axios.get(`${API_URL}/requests`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  sendFriendRequest: async (userId) => {
    await axios.post(`${API_URL}/request/${userId}`, {}, {
      headers: authService.getAuthHeader()
    });
  },

  acceptFriendRequest: async (requestId) => {
    await axios.post(`${API_URL}/accept/${requestId}`, {}, {
      headers: authService.getAuthHeader()
    });
  },

  rejectFriendRequest: async (requestId) => {
    await axios.post(`${API_URL}/reject/${requestId}`, {}, {
      headers: authService.getAuthHeader()
    });
  },

  removeFriend: async (userId) => {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: authService.getAuthHeader()
    });
  },

  cancelFriendRequest: async (userId) => {
    await axios.delete(`${API_URL}/request/${userId}`, {
      headers: authService.getAuthHeader()
    });
  }
};

export default friendsService;