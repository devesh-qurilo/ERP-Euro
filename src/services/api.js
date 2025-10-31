import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://chat.swiftandgo.in'; // Replace with your actual gateway URL
// const API_BASE_URL = 'https://6jnqmj85-80.inc1.devtunnels.ms';

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
  updateMe: formData => api.put('/employee/me', formData).then(r => r.data),

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
  getHolidays: () => api.get('/employee/api/holidays').then(r => r.data),
};

export const attendanceAPI = {
  getMyAttendance: () => api.get('/employee/attendance/me').then(r => r.data),
};

export const settingsAPI = {
  getEmergencyContacts: employeeId =>
    api.get(`/employee/${employeeId}/emergency-contacts`).then(r => r.data),

  createEmergencyContact: (employeeId, payload) =>
    api
      .post(`/employee/${employeeId}/emergency-contacts`, payload)
      .then(r => r.data),
};

export const notificationsAPI = {
  getMyNotifications: () =>
    api.get('/employee/notifications/me').then(r => r.data),

  markAsRead: id =>
    api.post(`/employee/notifications/${id}/mark-read`).then(r => r.data),
};

export const leadsAPI = {
  getMyLeads: () => api.get('/leads/my-leads').then(r => r.data),

  createLead: payload => api.post('/leads', payload).then(r => r.data),
};

// src/services/api.js
export const projectsAPI = {
  getProjects: (page = 0, size = 50, params = {}) =>
    api
      .get('/projects', { params: { page, size, ...params } })
      .then(r => r.data),

  // 🔹 single project metrics (hours, etc.)
  getProjectMetrics: projectId =>
    api.get(`/projects/${projectId}/metrics`).then(r => r.data),

  // ✅ persist pin state
  pinProject: id => api.post(`/projects/${id}/pin`).then(r => r.data),
  unpinProject: id => api.delete(`/projects/${id}/pin`).then(r => r.data),
  getProjectTasks: projectId =>
    api.get(`/projects/${projectId}/tasks`).then(r => r.data),

  getProjectNotes: projectId =>
    api.get(`/projects/${projectId}/notes`).then(r => r.data),

  getProjectActivity: projectId =>
    api.get(`/projects/${projectId}/activity`).then(r => r.data),
};

// Task Files
export const taskFilesAPI = {
  list: taskId => api.get(`/files/tasks/${taskId}`).then(r => r.data),
  upload: (taskId, file) => {
    const form = new FormData();
    // file must be { uri, name, type }
    form.append('file', file);
    return api
      .post(`/files/tasks/${taskId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },
};

// Subtasks
export const subtasksAPI = {
  list: taskId => api.get(`/tasks/${taskId}/subtasks`).then(r => r.data),
  create: (taskId, payload) =>
    api.post(`/tasks/${taskId}/subtasks`, payload).then(r => r.data),
};

// Timesheets (filter in params)
export const timesheetsAPI = {
  list: (params = {}) => api.get('/timesheets', { params }).then(r => r.data),
};

// Notes
export const notesAPI = {
  list: taskId => api.get(`/tasks/${taskId}/notes`).then(r => r.data),
  create: (taskId, payload) =>
    api.post(`/tasks/${taskId}/notes`, payload).then(r => r.data),
};

export const projectFilesAPI = {
  list: projectId => api.get(`/files/projects/${projectId}`).then(r => r.data),

  upload: (projectId, file /* { uri, name, type } */) => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post(`/files/projects/${projectId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },
};

export const myTasksAPI = {
  list: () => api.get('/me/tasks').then(r => r.data),
};

export const taskPinAPI = {
  pin: taskId => api.post(`/projects/tasks/${taskId}/pin`).then(r => r.data),
  unpin: taskId =>
    api.delete(`/projects/tasks/${taskId}/pin`).then(r => r.data),
};

export const statusesAPI = {
  list: () => api.get('/status').then(r => r.data),
};
// --- create task (multipart) ---
export const tasksAPI = {
  create: (form /* FormData */) =>
    api
      .post('/projects/tasks', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data),
};

// --- task categories ---
export const taskCategoriesAPI = {
  list: () => api.get('/task/task-categories').then(r => r.data),
};

// --- all projects for dropdown ---
export const allProjectsAPI = {
  list: () => api.get('/projects/AllProject').then(r => r.data),
};

// --- employees (paged) ---
export const employeesAPI = {
  listAll: (page = 0, size = 50) =>
    api
      .get(`/employee/all`, { params: { page, size } })
      .then(r => r.data?.content ?? []),
};

// --- labels & milestones depend on project ---
export const projectLabelsAPI = {
  list: projectId => api.get(`/projects/${projectId}/labels`).then(r => r.data),
};
export const projectMilestonesAPI = {
  list: projectId =>
    api.get(`/api/projects/${projectId}/milestones`).then(r => r.data),
};

// --- MY TIMESHEETS (list) ---
export const myTimesheetsAPI = {
  list: (params = {}) =>
    api.get('/timesheets/me', { params }).then(r => r.data),
  create: payload => api.post('/timesheets', payload).then(r => r.data),
};

// --- WEEKLY TIMESHEETS ---
export const weeklyTimesheetsAPI = {
  create: payload => api.post('/weekly-timesheets', payload).then(r => r.data),
  getMine: weekStartDate =>
    api
      .get('/weekly-timesheets/me', { params: { weekStartDate } })
      .then(r => r.data),
};
// export const chatAPI = {
//   listRooms: () => api.get('/api/chat/rooms').then(r => r.data),
//   history: peerId =>
//     api
//       .get(`/api/chat/history/${encodeURIComponent(peerId)}`)
//       .then(r => r.data),

//   send: async ({ receiverId, content, messageType = 'TEXT' }) => {
//     const fd = new FormData();
//     fd.append('receiverId', String(receiverId));
//     fd.append('content', String(content));
//     fd.append('messageType', String(messageType));

//     // DO NOT set Content-Type; let RN/axios add the boundary
//     try {
//       const res = await api.post('/api/chat/send', fd);
//       return res.data;
//     } catch (err) {
//       // If this is a tunnel/HTTPS boundary issue, try a JSON fallback (only if backend accepts JSON)
//       console.log(
//         '[CHAT] multipart failed, trying JSON fallback…',
//         err?.message,
//       );
//       try {
//         const res2 = await api.post('/api/chat/send', {
//           receiverId,
//           content,
//           messageType,
//         });
//         return res2.data;
//       } catch (err2) {
//         // rethrow with details so saga logs it
//         throw err2;
//       }
//     }
//   },
// };

export const chatAPI = {
  listRooms: () => api.get('/api/chat/rooms').then(r => r.data),
  history: peerId =>
    api
      .get(`/api/chat/history/${encodeURIComponent(peerId)}`)
      .then(r => r.data),

  send: async ({ receiverId, content, messageType = 'TEXT' }) => {
    // 1) Build FormData (server expects multipart)
    const fd = new FormData();
    fd.append('receiverId', String(receiverId));
    fd.append('content', String(content));
    fd.append('messageType', String(messageType));

    // 2) First try axios (Authorization will be added by your interceptor)
    try {
      console.log('[CHAT] axios POST =>', '/api/chat/send', {
        receiverId,
        content,
        messageType,
      });
      const res = await api.post('/api/chat/send', fd); // do NOT set Content-Type manually
      return res.data;
    } catch (err) {
      console.log('[CHAT] axios multipart failed:', err?.message);
    }

    // 3) Fallback to fetch with Authorization (this was missing, causing 401)
    try {
      const base = api.defaults?.baseURL?.replace(/\/+$/, '') || '';
      const url = `${base}/api/chat/send`;
      const token = await AsyncStorage.getItem('authToken');

      console.log('[CHAT] fetch POST =>', url);
      const resp = await fetch(url, {
        method: 'POST',
        headers: token
          ? { Authorization: `Bearer ${token}` } // NO Content-Type for FormData
          : undefined,
        body: fd,
      });

      const text = await resp.text();
      console.log('[CHAT] fetch status:', resp.status, 'body:', text);

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      // try parse if server returns JSON
      try {
        return JSON.parse(text);
      } catch {
        // if backend returns empty or non-JSON, adapt here:
        return text;
      }
    } catch (err2) {
      console.log('[CHAT] fetch multipart failed:', err2?.message);
      throw err2;
    }
  },
};

export const adminLeadsAPI = {
  list: (params = {}) => api.get('/leads', { params }).then(r => r.data),
  create: payload => api.post('/leads', payload).then(r => r.data),
  // real endpoints you shared
  remove: id => api.delete(`/leads/${id}`).then(r => r.data),
  update: (id, payload) => api.put(`/leads/${id}`, payload).then(r => r.data),

  // change-to-client will navigate to a screen (no API yet)
};

// --- ADMIN SETTINGS APIS ---
export const adminSettingsAPI = {
  // multipart: { profile: object with fields, file: optional RN file { uri, name, type } }
  updateMe: async ({ profile = {}, file = null }) => {
    const fd = new FormData();
    fd.append('employee', JSON.stringify(profile));
    if (file) {
      fd.append('file', file); // { uri, name, type }
    }
    return api
      .put('/employee/me', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  getCompany: () => api.get('/employee/company').then(r => r.data),

  // multipart: fields + optional logoFile
  upsertCompany: async ({ company = {}, logoFile = null }) => {
    const fd = new FormData();
    Object.entries(company).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    if (logoFile) fd.append('logoFile', logoFile); // { uri, name, type }
    return api
      .post('/employee/company', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },
};

export const adminDesignationsAPI = {
  list: () => api.get('/admin/designations').then(r => r.data),
  get: id => api.get(`/admin/designations/${id}`).then(r => r.data),
  create: payload => api.post('/admin/designations', payload).then(r => r.data),
  update: (id, payload) =>
    api.put(`/admin/designations/${id}`, payload).then(r => r.data),
  remove: id => api.delete(`/admin/designations/${id}`).then(r => r.data),
};

export default api;
