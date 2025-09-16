import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Default backend URL
  withCredentials: true, // Important for cookies
});

// Authentication service
export const authService = {
  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (userData: any) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Refresh access token
  refreshAccessToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Token refresh failed' };
    }
  }
};

// Create a logout hook for easy usage in components
export const useLogout = () => {
  const logout = async () => {
    try {
      await authService.logout();
      // Redirect to login page or home page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      window.location.href = '/login';
    }
  };

  return { logout };
};

export default api;
