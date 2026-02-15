import axios from 'axios';
import authService from './authService';

const API_URL = 'https://localhost:7137/api/Profile';

const profileService = {
  getProfile: async () => {
    const response = await axios.get(API_URL, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  updateProfile: async (email, firstName, lastName) => {
    const response = await axios.put(API_URL, {
      email,
      firstName,
      lastName
    }, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await axios.post(`${API_URL}/change-password`, {
      currentPassword,
      newPassword
    }, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  },

  deleteAccount: async () => {
    await axios.delete(API_URL, {
      headers: authService.getAuthHeader()
    });
  }
};

export default profileService;