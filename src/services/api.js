import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://6jnqmj85-8080.inc1.devtunnels.ms'; // Replace with your actual gateway URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for API calls
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
      // Handle unauthorized access - token expired or invalid
      console.log('Unauthorized access - redirect to login');
      // You might want to dispatch a logout action here
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: credentials =>
    api
      .post('/auth/login', credentials)
      .then(response => response.data)
      .catch(error => {
        console.error('Login API error:', error);
        throw error;
      }),

  logout: () => api.post('/auth/logout'),

  refreshToken: refreshToken =>
    api.post('/auth/refresh', { refreshToken }).then(response => response.data),
};

export const employeeAPI = {
  getProfile: () => api.get('/employee/me').then(response => response.data),

  updateProfile: profileData =>
    api.put('/employee/me', profileData).then(response => response.data),

  uploadProfilePicture: formData =>
    api
      .post('/employee/me/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response.data),
};

// leaves api
export const leavesAPI = {
  getMyQuota: () => api.get('/employee/leave-quota/me').then(res => res.data),
};

//  appreciation api
export const appreciationsAPI = {
  getAllappreciation: () =>
    api.get('/employee/appreciations').then(res => res.data),
};

export const hrAPI = {
  getMyLeaves: () =>
    api.get('/employee/api/leaves/my-leaves').then(res => res.data),
  // };

  // export const hrAPI = {
  //   getMyLeaves: () => api.get('/employee/api/leaves/my-leaves').then(r => r.data),

  // NEW: POST /employee/api/leaves/apply  (multipart/form-data)
  applyLeave: formData =>
    api.post('/employee/api/leaves/apply', formData).then(r => r.data),

  getAppreciations: () => api.get('/employee/appreciations').then(r => r.data),
};

export const attendanceAPI = {
  getMyAttendance: () => api.get('/employee/attendance/me').then(r => r.data),
};

export default api;
