import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-erp-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - redirect to login');
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: credentials => {
    // Determine endpoint based on user type
    const endpoint =
      credentials.userType === 'admin'
        ? '/auth/admin/login'
        : '/auth/employee/login';

    return api.post(endpoint, credentials).then(response => response.data);
  },
  logout: () => api.post('/auth/logout'),
};

export default api;
