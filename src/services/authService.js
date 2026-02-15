import axios from 'axios';

const API_URL = 'https://localhost:7137/api/Auth'; // Update port if different

const authService = {
  register: async (email, password, firstName, lastName) => {
    try {
      console.log('Attempting registration to:', `${API_URL}/register`);
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        firstName,
        lastName
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      console.log('Attempting login to:', `${API_URL}/login`);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getAuthHeader: () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  }
};

export default authService;