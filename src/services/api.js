// /src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base URL (change to your production URL)
const API_BASE_URL = 'https://6jnqmj85-80.inc1.devtunnels.ms';
// const API_BASE_URL = 'https://erp.skavosystem.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Storage keys (change if your app uses different keys)
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

// --- Refresh token mutex/queue helpers ---
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

// --- request interceptor: attach token ---
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token in interceptor:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

// --- helper: perform refresh and update storage ---
async function performTokenRefresh() {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // call refresh endpoint (adjust path/shape to your backend)
    const resp = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });
    // expected response shape: { accessToken: '...', refreshToken: '...' } - adapt as needed
    const data = resp.data || {};
    const newAccessToken = data.accessToken || data.token || data.access_token;
    const newRefreshToken =
      data.refreshToken || data.refresh_token || refreshToken;

    if (!newAccessToken)
      throw new Error('Refresh response missing access token');

    await AsyncStorage.setItem(AUTH_TOKEN_KEY, newAccessToken);
    if (newRefreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    }

    return newAccessToken;
  } catch (err) {
    // ensure no stale tokens remain if refresh fails
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
    } catch (e) {
      console.warn('Error clearing storage after failed refresh', e);
    }
    throw err;
  }
}

// --- response interceptor: handle 401 with refresh/retry ---
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // if no response or not a 401, just propagate
    const status = error?.response?.status;
    if (!status || status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop: if original request already retried, give up
    if (originalRequest && originalRequest._retry) {
      // Mark as unauthorized for caller to handle (e.g., show login)
      error.isUnauthorized = true;
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber(async newToken => {
          try {
            // set header and retry
            if (newToken) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            originalRequest._retry = true;
            const resp = await api(originalRequest);
            resolve(resp);
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    // Start refresh flow
    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        const newToken = await performTokenRefresh();
        // notify queued requests
        onRefreshed(newToken);
        // retry original request
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        originalRequest._retry = true;
        const resp = await api(originalRequest);
        resolve(resp);
      } catch (refreshErr) {
        // Refresh failed: mark error for caller and reject
        refreshErr.isUnauthorized = true;
        reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    });
  },
);

// ---- Auth API helpers ----
export const authAPI = {
  login: credentials =>
    api
      .post('/auth/login', credentials)
      .then(response => response.data)
      .catch(error => {
        console.error('Login API error:', error);
        throw error;
      }),
  logout: () =>
    api
      .post('/auth/logout')
      .then(r => r.data)
      .catch(err => {
        throw err;
      }),
  refreshToken: refreshToken =>
    api.post('/auth/refresh', { refreshToken }).then(response => response.data),
};

// ---- Employee API ----
export const employeeAPI = {
  getProfile: () => api.get('/employee/me').then(response => response.data),
  updateMe: formData => api.put('/employee/me', formData).then(r => r.data),
  updateProfile: profileData =>
    api.put('/employee/me', profileData).then(response => response.data),
  uploadProfilePicture: formData =>
    api
      .post('/employee/me/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => response.data),
};

// export const employeeAPI = {
//   getProfile: () => api.get('/employee/me').then(response => response.data),
//   updateMe: formData => api.put('/employee/me', formData).then(r => r.data),

//   updateProfile: profileData =>
//     api.put('/employee/me', profileData).then(response => response.data),

//   uploadProfilePicture: formData =>
//     api
//       .post('/employee/me/profile-picture', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//       .then(response => response.data),
// };

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

// append to /src/services/api.js (after employeeAPI)
// export const AdminchatAPI = {
//   // GET /api/chat/rooms
//   fetchRooms: () =>
//     api
//       .get('/api/chat/rooms')
//       .then(res => res.data)
//       .catch(error => {
//         console.error('chatAPI.fetchRooms error', error);
//         throw error;
//       }),

//   // GET /api/chat/history/{otherEmployeeId}
//   fetchHistory: otherEmployeeId =>
//     api
//       .get(`/api/chat/history/${encodeURIComponent(otherEmployeeId)}`)
//       .then(res => res.data)
//       .catch(error => {
//         console.error('chatAPI.fetchHistory error', error);
//         throw error;
//       }),

//   // POST /api/chat/send  (multipart/form-data)
//   sendMessage: formData =>
//     api
//       .post('/api/chat/send', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       .then(res => res.data)
//       .catch(error => {
//         console.error('chatAPI.sendMessage error', error);
//         throw error;
//       }),

//   // POST /api/chat/mark-read/{otherEmployeeId}
//   markRead: otherEmployeeId =>
//     api
//       .post(`/api/chat/mark-read/${encodeURIComponent(otherEmployeeId)}`)
//       .then(res => res.data)
//       .catch(error => {
//         console.error('chatAPI.markRead error', error);
//         throw error;
//       }),
// };

export const AdminchatAPI = {
  fetchRooms: () =>
    api
      .get('/api/chat/rooms')
      .then(res => res.data)
      .catch(error => {
        console.error('chatAPI.fetchRooms error', error);
        throw error;
      }),

  fetchHistory: otherEmployeeId =>
    api
      .get(`/api/chat/history/${encodeURIComponent(otherEmployeeId)}`)
      .then(res => res.data)
      .catch(error => {
        console.error('chatAPI.fetchHistory error', error);
        throw error;
      }),

  sendMessage: formData =>
    api
      .post('/api/chat/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => res.data)
      .catch(error => {
        console.error('chatAPI.sendMessage error', error);
        throw error;
      }),

  markRead: otherEmployeeId =>
    api
      .post(`/api/chat/mark-read/${encodeURIComponent(otherEmployeeId)}`)
      .then(res => res.data)
      .catch(error => {
        console.error('chatAPI.markRead error', error);
        throw error;
      }),
};

export const adminLeadsAPI = {
  list: (params = {}) => api.get('/leads', { params }).then(r => r.data),
  create: payload => api.post('/leads', payload).then(r => r.data),
  // real endpoints you shared
  remove: id => api.delete(`/leads/${id}`).then(r => r.data),
  update: (id, payload) => api.put(`/leads/${id}`, payload).then(r => r.data),

  listNotes(leadId) {
    return axios.get(`/leads/${leadId}/notes`).then(r => r.data);
  },

  createNote(leadId, payload) {
    return axios.post(`/leads/${leadId}/notes`, payload).then(r => r.data);
  },

  updateNote(leadId, noteId, payload) {
    return axios
      .put(`/leads/${leadId}/notes/${noteId}`, payload)
      .then(r => r.data);
  },

  deleteNote(leadId, noteId) {
    return axios.delete(`/leads/${leadId}/notes/${noteId}`).then(r => r.data);
  },
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
      .put('/employee/company', fd, {
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

export const adminDepartmentsAPI = {
  list: () => api.get('/admin/departments').then(r => r.data),
  create: payload => api.post('/admin/departments', payload).then(r => r.data),
  update: (id, payload) =>
    api.put(`/admin/departments/${id}`, payload).then(r => r.data),
  remove: id => api.delete(`/admin/departments/${id}`).then(r => r.data),
};

// NOTE: list uses server paging ?page=&size=
export const adminEmployeesAPI = {
  list: ({ page = 0, size = 20 } = {}) =>
    api.get('/employee', { params: { page, size } }).then(r => r.data),

  me: () => api.get('/employee/me').then(r => r.data),

  create: ({ employee, file }) => {
    const fd = new FormData();
    fd.append('employee', JSON.stringify(employee));
    if (file) {
      fd.append('file', {
        uri: file.uri,
        name: file.name || 'profile.jpg',
        type: file.type || 'image/jpeg',
      });
    }
    return api.post('/employee', fd).then(r => r.data);
  },

  update: (employeeId, { employee, file }) => {
    const fd = new FormData();
    fd.append('employee', JSON.stringify(employee));
    if (file) {
      fd.append('file', {
        uri: file.uri,
        name: file.name || 'profile.jpg',
        type: file.type || 'image/jpeg',
      });
    }
    return api
      .put(`/employee/${encodeURIComponent(employeeId)}`, fd)
      .then(r => r.data);
  },

  remove: employeeId =>
    api.delete(`/employee/${encodeURIComponent(employeeId)}`).then(r => r.data),

  patchRole: (employeeId, role) =>
    api
      .patch(`/employee/${encodeURIComponent(employeeId)}/role`, { role })
      .then(r => r.data),

  invite: ({ to, message }) =>
    api.post('/employee/invite', { to, message }).then(r => r.data),
};
// --- PROJECTS ---

export const projectsApi = {
  listByEmployee: employeeId =>
    api
      .get(`/api/projects/employee/${encodeURIComponent(employeeId)}`)
      .then(r => r.data),

  create: payload => {
    const fd = new FormData();
    fd.append('shortCode', payload.shortCode);
    fd.append('projectName', payload.projectName);
    fd.append('startDate', payload.startDate);
    fd.append('deadline', payload.deadline);
    fd.append('noDeadline', String(!!payload.noDeadline));
    fd.append('projectCategory', payload.projectCategory);
    // fd.append('departmentId', String(payload.departmentId));

    if (payload.department != null && payload.department !== '') {
      fd.append('department', String(payload.department));
    }
    if (payload.clientId) fd.append('clientId', payload.clientId);
    if (payload.projectSummary)
      fd.append('projectSummary', payload.projectSummary);
    fd.append(
      'tasksNeedAdminApproval',
      String(!!payload.tasksNeedAdminApproval),
    );
    fd.append('currency', payload.currency);
    if (payload.projectBudget != null)
      fd.append('projectBudget', String(payload.projectBudget));
    if (payload.hoursEstimate != null)
      fd.append('hoursEstimate', String(payload.hoursEstimate));
    fd.append('allowManualTimeLogs', String(!!payload.allowManualTimeLogs));
    if (payload.companyFile) {
      fd.append('companyFile', {
        uri: payload.companyFile.uri,
        name: payload.companyFile.name || 'upload.bin',
        type: payload.companyFile.type || 'application/octet-stream',
      });
    }
    if (payload.assignedEmployeeIds?.length) {
      fd.append('assignedEmployeeIds', payload.assignedEmployeeIds.join(','));
    }
    return api
      .post('/api/projects', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  update: (projectId, payload) => {
    const fd = new FormData();
    if (payload.projectName) fd.append('name', payload.projectName);
    if (payload.startDate) fd.append('startDate', payload.startDate);
    if (payload.deadline) fd.append('deadline', payload.deadline);
    if (payload.noDeadline != null)
      fd.append('noDeadline', String(!!payload.noDeadline));
    if (payload.category) fd.append('category', payload.category);
    if (payload.departmentId != null)
      fd.append('departmentId', String(payload.departmentId));
    if (payload.summary) fd.append('summary', payload.summary);
    if (payload.tasksNeedAdminApproval != null)
      fd.append(
        'tasksNeedAdminApproval',
        String(!!payload.tasksNeedAdminApproval),
      );
    if (payload.currency) fd.append('currency', payload.currency);
    if (payload.budget != null) fd.append('budget', String(payload.budget));
    if (payload.hoursEstimate != null)
      fd.append('hoursEstimate', String(payload.hoursEstimate));
    if (payload.allowManualTimeLogs != null)
      fd.append('allowManualTimeLogs', String(!!payload.allowManualTimeLogs));
    if (payload.projectStatus)
      fd.append('projectStatus', payload.projectStatus);
    if (payload.progressPercent != null)
      fd.append('progressPercent', String(payload.progressPercent));
    if (payload.calculateProgressThroughTasks != null)
      fd.append(
        'calculateProgressThroughTasks',
        String(!!payload.calculateProgressThroughTasks),
      );
    if (payload.companyFile) {
      fd.append('companyFile', {
        uri: payload.companyFile.uri,
        name: payload.companyFile.name || 'upload.bin',
        type: payload.companyFile.type || 'application/octet-stream',
      });
    }
    return api
      .put(`/api/projects/${projectId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  remove: projectId =>
    api.delete(`/api/projects/${projectId}`).then(r => r.data),

  patchStatus: (projectId, status) => {
    const fd = new FormData();
    fd.append('status', status);
    return api
      .put(`/api/projects/${projectId}/status`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },
};

// --- LEAVES (ADMIN/HR) --- //
export const AdminleavesAPI = {
  // list all employees' leaves
  list: () => api.get('/employee/api/leaves').then(r => r.data),

  // current user's quota (for the Profile tab)
  myQuota: () => api.get('/employee/leave-quota/me').then(r => r.data),

  // apply leaves (admin can apply for multiple employees)
  apply: ({ leaveData, documents /* File[] | undefined */ }) => {
    const fd = new FormData();
    fd.append('leaveData', JSON.stringify(leaveData));
    (documents || []).forEach((f, idx) => {
      // @react-native-documents/picker gives us { uri, name, type }
      fd.append('documents', {
        uri: f.uri,
        name: f.name || `doc_${idx}.pdf`,
        type: f.type || 'application/octet-stream',
      });
    });
    return api
      .post('/employee/api/leaves/apply', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // approve / reject
  patchStatus: (leaveId, { status, rejectionReason }) =>
    api
      .patch(`/employee/api/leaves/${leaveId}/status`, {
        status,
        rejectionReason,
      })
      .then(r => r.data),

  // delete a leave
  remove: leaveId =>
    api.delete(`/employee/api/leaves/${leaveId}`).then(r => r.data),
};

// GET /employee/api/holidays
export const fetchHolidaysAPI = () =>
  api.get('/employee/api/holidays').then(r => r.data);

// POST /employee/api/holidays/bulk
// payload = { holidays: [{ date: 'YYYY-MM-DD', occasion: '...' }, ...] }
export const createHolidaysBulkAPI = payload =>
  api.post('/employee/api/holidays/bulk', payload).then(r => r.data);

export const updateHolidayAPI = (id, payload) =>
  api.put(`/employee/api/holidays/${id}`, payload).then(r => r.data);

export const deleteHolidayAPI = id =>
  api.delete(`/employee/api/holidays/${id}`).then(r => r.data);

export const adminAttendanceAPI = {
  // POST /employee/attendance/mark  (by specific dates)
  markByDates: payload =>
    api.post('/employee/attendance/mark', payload).then(r => r.data),

  // POST /employee/attendance/mark/month  (by month)
  markByMonth: payload =>
    api.post('/employee/attendance/mark/month', payload).then(r => r.data),

  // GET /employee/attendance/GetAllAttendance  (big list)
  listAll: () =>
    api.get('/employee/attendance/GetAllAttendance').then(r => r.data),

  // GET /employee/attendance/{employeeId}/all-saved  (attendance by member)
  byEmployee: employeeId =>
    api
      .get(`/employee/attendance/${encodeURIComponent(employeeId)}/all-saved`)
      .then(r => r.data),
};
// src/api/adminAwardsAPI.js
const toFormFile = f =>
  f
    ? {
        uri: Platform.OS === 'ios' ? f.uri.replace('file://', '') : f.uri,
        name: f.name || 'upload.jpg',
        type: f.type || 'image/jpeg',
      }
    : null;

export const adminAwardsAPI = {
  // GET /employee/api/awards  (list)
  list: () => api.get('/employee/api/awards').then(r => r.data),

  // POST /employee/api/awards  (create; multipart)
  create: ({ title, summary, iconFile }) => {
    const fd = new FormData();
    fd.append('title', String(title));
    fd.append('summary', String(summary || ''));
    const f = toFormFile(iconFile);
    if (f) fd.append('iconFile', f);
    return api
      .post('/employee/api/awards', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // PUT /employee/api/awards/{id}  (update; multipart)
  update: (id, { title, summary, iconFile }) => {
    const fd = new FormData();
    fd.append('title', String(title));
    fd.append('summary', String(summary || ''));
    const f = toFormFile(iconFile);
    if (f) fd.append('iconFile', f);
    return api
      .put(`/employee/api/awards/${encodeURIComponent(id)}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // PATCH /employee/api/awards/{id}/toggle-status
  toggleStatus: id =>
    api
      .patch(`/employee/api/awards/${encodeURIComponent(id)}/toggle-status`)
      .then(r => r.data),
};

// src/api/adminAppreciationsAPI.js
// NOTE: expects a pre-configured axios instance exported as `api`
const AtoFormFile = f => {
  if (!f || !f.uri) return null;

  return {
    uri: Platform.OS === 'ios' ? f.uri.replace('file://', '') : f.uri,
    name: f.name || 'upload.jpg',
    type: f.type || 'image/jpeg',
  };
};

export const adminAppreciationsAPI = {
  // GET /employee/appreciations  (list)
  list: () => api.get('/employee/appreciations').then(r => r.data),

  // // POST /employee/appreciations  (create; multipart)
  create: ({ awardId, givenToEmployeeId, date, summary, photoFile }) => {
    const fd = new FormData();
    fd.append('awardId', String(awardId));
    fd.append('givenToEmployeeId', String(givenToEmployeeId));
    fd.append('date', String(date));
    fd.append('summary', String(summary || ''));
    const f = AtoFormFile(photoFile);
    if (f) fd.append('photoFile', f);
    return api
      .post('/employee/appreciations', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // // PUT /employee/admin/appreciations/{id}  (update; multipart)
  update: (id, { awardId, givenToEmployeeId, date, summary, photoFile }) => {
    const fd = new FormData();
    fd.append('awardId', String(awardId));
    fd.append('givenToEmployeeId', String(givenToEmployeeId));
    fd.append('date', String(date));
    fd.append('summary', String(summary || ''));
    const f = AtoFormFile(photoFile);
    if (f) fd.append('photoFile', f);
    return api
      .put(`/employee/admin/appreciations/${encodeURIComponent(id)}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // // DELETE /employee/admin/appreciations/{id}
  remove: id =>
    api
      .delete(`/employee/admin/appreciations/${encodeURIComponent(id)}`)
      .then(r => r.data),
};

// --- ADMIN PROJECTS (all projects) ---

export const adminWorkProjectsAPI = {
  // Full list (used for list, calendar, pinned, archived client-side)
  list: () => api.get('/api/projects').then(r => r.data),

  // Create (multipart)
  create: payload => projectsApi.create(payload),

  // Update (multipart)
  update: (id, payload) => projectsApi.update(id, payload),

  // Delete
  remove: id => api.delete(`/api/projects/${id}`).then(r => r.data),

  // Status (multipart form with 'status')
  patchStatus: (id, status) => projectsApi.patchStatus(id, status),

  // Pin / Unpin
  pin: id => api.post(`/projects/${id}/pin`).then(r => r.data),
  unpin: id => api.delete(`/projects/${id}/pin`).then(r => r.data),

  // Archive / Unarchive
  archive: id => api.post(`/projects/${id}/archive`).then(r => r.data),
  unarchive: id => api.delete(`/projects/${id}/archive`).then(r => r.data),
  // Status (multipart form with 'status')
  patchStatus: (id, status) => projectsApi.patchStatus(id, status),

  // Progress (multipart form with 'percent')
  patchProgress: (id, percent) => projectsApi.patchProgress(id, percent),
  metrics: id => api.get(`/api/projects/${id}/metrics`).then(r => r.data),

  getProjectCategories: () =>
    api.get('/api/projects/category').then(r => r.data),

  createProjectCategory: payload =>
    api.post('/api/projects/category', payload).then(r => r.data),

  deleteProjectCategory: id =>
    api.delete(`/api/projects/category/${id}`).then(r => r.data),
};
export const adminProjectTasksAPI = {
  // GET /projects/{projectId}/tasks
  listByProject: projectId =>
    api
      .get(`/projects/${encodeURIComponent(projectId)}/tasks`)
      .then(r => r.data),

  // POST /api/projects/tasks  (multipart if file present)
  create: payload => {
    const fd = new FormData();
    // text fields
    [
      'title',
      'category',
      'startDate',
      'dueDate',
      'noDueDate',
      'taskStageId',
      'description',
      'milestoneId',
      'priority',
      'isPrivate',
      'timeEstimateMinutes',
      'isDependent',
      'projectId',
    ].forEach(k => {
      if (payload[k] !== undefined && payload[k] !== null)
        fd.append(k, String(payload[k]));
    });

    // arrays -> comma separated strings (server accepts)
    if (payload.assignedEmployeeIds)
      fd.append('assignedEmployeeIds', payload.assignedEmployeeIds.join(','));
    if (payload.labelIds) fd.append('labelIds', payload.labelIds.join(','));

    if (payload.taskFile) {
      fd.append('taskFile', {
        uri: payload.taskFile.uri,
        name: payload.taskFile.name || 'upload.bin',
        type: payload.taskFile.type || 'application/octet-stream',
      });
    }
    return api
      .post('/api/projects/tasks', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // PUT /api/projects/tasks/{taskId}
  update: (taskId, payload) => {
    const fd = new FormData();
    [
      'title',
      'category',
      'noDueDate',
      'description',
      'priority',
      'isPrivate',
      'timeEstimateMinutes',
      'isDependent',
      'projectId',
    ].forEach(k => {
      if (payload[k] !== undefined && payload[k] !== null)
        fd.append(k, String(payload[k]));
    });

    if (payload.assignedEmployeeIds)
      fd.append('assignedEmployeeIds', payload.assignedEmployeeIds.join(','));
    if (payload.labelIds) fd.append('labelIds', payload.labelIds.join(','));

    return api
      .put(`/api/projects/tasks/${encodeURIComponent(taskId)}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // DELETE /api/projects/{projectId}/tasks/{taskId}
  remove: ({ projectId, taskId }) =>
    api
      .delete(
        `/api/projects/${encodeURIComponent(
          projectId,
        )}/tasks/${encodeURIComponent(taskId)}`,
      )
      .then(r => r.data),
};

export const adminPaymentGatewaysAPI = {
  list: () => api.get('/api/payment-gateways').then(r => r.data),
  create: payload =>
    api.post('/api/payment-gateways', payload).then(r => r.data),
  remove: id =>
    api
      .delete(`/api/payment-gateways/${encodeURIComponent(id)}`)
      .then(r => r.data),
};

// --- ADMIN FINANCE: INVOICES / PAYMENTS / RECEIPTS ---
export const adminFinanceInvoicesAPI = {
  // LIST with optional paging & filters
  list: ({
    page = 0,
    size = 2000000,
    q,
    clientId,
    status,
    dateFrom,
    dateTo,
  } = {}) =>
    api
      .get('/api/invoices', {
        params: { page, size, q, clientId, status, dateFrom, dateTo },
      })
      .then(r => r.data),

  // CREATE (JSON body as per spec)
  create: payload => api.post('/api/invoices', payload).then(r => r.data),

  // GET ONE (by invoiceNumber)
  getOne: invoiceNumber =>
    api
      .get(`/api/invoices/${encodeURIComponent(invoiceNumber)}`)
      .then(r => r.data),

  // UPDATE (by invoiceNumber)
  update: (invoiceNumber, payload) =>
    api
      .put(`/api/invoices/${encodeURIComponent(invoiceNumber)}`, payload)
      .then(r => r.data),

  // FILES: upload (FormData: field name "file")
  uploadFile: (invoiceNumber, file /* { uri, name, type } */) => {
    const fd = new FormData();
    fd.append('file', {
      uri: file.uri,
      name: file.name || 'upload.bin',
      type: file.type || 'application/octet-stream',
    });
    return api
      .post(`/api/invoices/${encodeURIComponent(invoiceNumber)}/files`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // FILES: delete (by fileUrl)
  deleteFile: (invoiceNumber, fileUrl) =>
    api
      .delete(`/api/invoices/${encodeURIComponent(invoiceNumber)}/files`, {
        params: { fileUrl },
      })
      .then(r => r.data),
  deleteInvoice: invoiceNumber =>
    api
      .delete(`/api/invoices/${encodeURIComponent(invoiceNumber)}`)
      .then(r => r.data),

  // REMINDER (by invoiceNumber)
  sendReminder: invoiceNumber =>
    api
      .post(
        `/api/invoices/${encodeURIComponent(
          invoiceNumber,
        )}/actions/send-reminder-email`,
      )
      .then(r => r.data),

  // MARK PAID (uses invoiceId)
  markPaid: invoiceId =>
    api
      .patch(`/api/invoices/${encodeURIComponent(invoiceId)}/mark-paid`)
      .then(r => r.data),

  // ADD RECEIPT (singular endpoint /api/invoice)
  addReceipt: payload => api.post('/api/invoice', payload).then(r => r.data),

  // VIEW RECEIPTS by invoiceId
  listReceiptsByInvoiceId: invoiceId =>
    api
      .get(`/api/invoice/receipt/${encodeURIComponent(invoiceId)}`)
      .then(r => r.data),

  // PAYMENTS: create (FormData: "payment" JSON + optional "file")
  createPayment: ({ payment, file = null }) => {
    const fd = new FormData();
    fd.append('payment', JSON.stringify(payment));
    if (file) {
      fd.append('file', {
        uri: file.uri,
        name: file.name || 'receipt.png',
        type: file.type || 'application/octet-stream',
      });
    }
    return api
      .post('/api/payments', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // PAYMENTS: list by invoiceNumber
  listPaymentsByInvoiceNumber: invoiceNumber =>
    api
      .get(`/api/payments/invoice/${encodeURIComponent(invoiceNumber)}`)
      .then(r => r.data),

  deleteReceipt: createdId =>
    api
      .delete(`/api/invoice/${encodeURIComponent(createdId)}`)
      .then(r => r.data),

  // DOWNLOAD receipt PDF (returns ArrayBuffer)
  downloadReceiptPdf: createdId =>
    api
      .get(`/api/invoice/${encodeURIComponent(createdId)}/pdf`, {
        params: { disposition: 'attachment' },
        responseType: 'arraybuffer',
      })
      .then(r => r.data),

  updatePayment: (paymentId, payload) =>
    api
      .put(`/api/payments/${encodeURIComponent(paymentId)}`, payload)
      .then(r => r.data),

  deletePayment: paymentId =>
    api
      .delete(`/api/payments/${encodeURIComponent(paymentId)}`)
      .then(r => r.data),

  addCreditNote: (invoiceNumber, { creditNote, file }) => {
    const fd = new FormData();
    fd.append('creditNote', JSON.stringify(creditNote)); // <-- text field
    if (file) fd.append('file', file); // <-- optional file
    return api
      .post(
        `/api/invoices/${encodeURIComponent(invoiceNumber)}/credit-notes`,
        fd,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      .then(r => r.data);
  },
  listCreditNotes: invoiceNumber =>
    api
      .get(`/api/invoices/${encodeURIComponent(invoiceNumber)}/credit-notes`)
      .then(r => r.data),
};

export const financeCreditNotesAPI = {
  // GET all credit notes
  listAll: () => api.get('/api/credit-notes/getAll').then(r => r.data),

  // PUT /api/credit-notes/:id  (edit)
  update: (id, payload) =>
    api
      .put(`/api/credit-notes/${encodeURIComponent(id)}`, payload)
      .then(r => r.data),

  // DELETE /api/credit-notes/:id
  remove: id =>
    api.delete(`/api/credit-notes/${encodeURIComponent(id)}`).then(r => r.data),
};

// --- ADMIN CLIENTS (exact to your contract) ---
const toRNFile = f =>
  f
    ? {
        uri: f.uri,
        name: f.name || 'file',
        type: f.type || 'application/octet-stream',
      }
    : null;

export const clientsAPI = {
  list: (params = {}) => api.get('/clients', { params }).then(r => r.data),

  create: async ({ client, profilePicture, companyLogo }) => {
    const fd = new FormData();
    fd.append('client', JSON.stringify(client));
    if (profilePicture) fd.append('profilePicture', profilePicture); // {uri,name,type}
    if (companyLogo) fd.append('companyLogo', companyLogo);
    return api
      .post('/clients', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  update: async (id, { client, profilePicture, companyLogo }) => {
    const fd = new FormData();
    fd.append('client', JSON.stringify(client));
    if (profilePicture) fd.append('profilePicture', profilePicture);
    if (companyLogo) fd.append('companyLogo', companyLogo);
    return api
      .put(`/clients/${encodeURIComponent(id)}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  remove: id =>
    api.delete(`/clients/${encodeURIComponent(id)}`).then(r => r.data),
  get: id => api.get(`/clients/${encodeURIComponent(id)}`).then(r => r.data),

  /* categories */
  getCategories: () => api.get('/clients/category').then(r => r.data),
  createCategory: payload =>
    api.post('/clients/category', payload).then(r => r.data),
  deleteCategory: id => api.delete(`/clients/category/${id}`).then(r => r.data),

  /* subcategories */
  getSubcategories: () =>
    api.get('/clients/category/subcategory').then(r => r.data),
  createSubcategory: payload =>
    api.post('/clients/category/subcategory', payload).then(r => r.data),
  deleteSubcategory: id =>
    api.delete(`/clients/category/subcategory/${id}`).then(r => r.data),
};

// add near other project APIs
export const clientProjectsAPI = {
  listByClient: clientId =>
    api
      .get(`/api/projects/client/${encodeURIComponent(clientId)}`)
      .then(r => r.data),
};

export const clientInvoicesAPI = {
  listByClient: clientId =>
    api
      .get(`/api/invoices/client/${encodeURIComponent(clientId)}`)
      .then(r => r.data),
};

// --- PAYMENTS (BY CLIENT) ---
export const clientPaymentsAPI = {
  // If your backend path differs, change it here.
  listByClient: clientId =>
    api
      .get(`/api/payments/client/${encodeURIComponent(clientId)}`)
      .then(r => r.data),

  // Existing (edit/delete) endpoints you already shared earlier:
  update: (paymentId, payload) =>
    api
      .put(`/api/payments/${encodeURIComponent(paymentId)}`, payload)
      .then(r => r.data),

  remove: paymentId =>
    api
      .delete(`/api/payments/${encodeURIComponent(paymentId)}`)
      .then(r => r.data),
};

export const projectPaymentsAPI = {
  // ✅ LIST BY PROJECT
  listByProject: projectId =>
    api
      .get(`/api/payments/project/${encodeURIComponent(projectId)}`)
      .then(r => r.data),

  // (keep these so edit/delete continue to work exactly like client)
  update: (paymentId, payload) =>
    api
      .put(`/api/payments/${encodeURIComponent(paymentId)}`, payload)
      .then(r => r.data),

  remove: paymentId =>
    api
      .delete(`/api/payments/${encodeURIComponent(paymentId)}`)
      .then(r => r.data),
};
// --- PAYMENTS (CREATE) ---
export const paymentsAPI = {
  create: async ({ payment, file }) => {
    const fd = new FormData();
    fd.append('payment', JSON.stringify(payment));
    if (file) {
      fd.append('file', {
        uri: file.uri,
        name: file.name || 'receipt.pdf',
        type: file.type || 'application/octet-stream',
      });
    }
    return api
      .post('/api/payments', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },
};

// --- CREDIT NOTES (CLIENT) ---
export const clientCreditNotesAPI = {
  listByClient: clientId =>
    api
      .get(`/api/credit-notes/client/${encodeURIComponent(clientId)}`)
      .then(r => r.data),

  update: (id, payload) =>
    api
      .put(`/api/credit-notes/${encodeURIComponent(id)}`, payload)
      .then(r => r.data),

  remove: id =>
    api.delete(`/api/credit-notes/${encodeURIComponent(id)}`).then(r => r.data),
};

// --- Client Documents (per client) ---
export const clientDocumentsAPI = {
  list: clientId =>
    api
      .get(`/clients/${encodeURIComponent(clientId)}/documents`)
      .then(r => r.data),

  upload: (clientId, file /* { uri, name, type } */) => {
    const fd = new FormData();
    fd.append('file', {
      uri: file.uri,
      name: file.name || 'upload.bin',
      type: file.type || 'application/octet-stream',
    });
    return api
      .post(`/clients/${encodeURIComponent(clientId)}/documents`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  remove: (clientId, docId) =>
    api
      .delete(
        `/clients/${encodeURIComponent(
          clientId,
        )}/documents/${encodeURIComponent(docId)}`,
      )
      .then(r => r.data),

  // NOTE: Mobile me download ko usually open URL se handle karte hain (Linking),
  // agar API direct attachment return karta hai to aap RNFS/FileViewer se save/open kar sakte ho.
  // Yaha hum UI me Linking.openURL fallback karenge.
  downloadUrl: (clientId, docId) =>
    `${API_BASE_URL.replace(/\/+$/, '')}/clients/${encodeURIComponent(
      clientId,
    )}/documents/${encodeURIComponent(docId)}`,
};

// --- Client Notes ---
export const clientNotesAPI = {
  list: clientId =>
    api.get(`/clients/${encodeURIComponent(clientId)}/notes`).then(r => r.data),

  create: (clientId, payload /* { title, detail, type } */) =>
    api
      .post(`/clients/${encodeURIComponent(clientId)}/notes`, payload)
      .then(r => r.data),

  update: (clientId, noteId, payload) =>
    api
      .put(
        `/clients/${encodeURIComponent(clientId)}/notes/${encodeURIComponent(
          noteId,
        )}`,
        payload,
      )
      .then(r => r.data),

  remove: (clientId, noteId) =>
    api
      .delete(
        `/clients/${encodeURIComponent(clientId)}/notes/${encodeURIComponent(
          noteId,
        )}`,
      )
      .then(r => r.data),
};

// --- ADMIN DEALS ---
export const adminDealsAPI = {
  list: (params = {}) => api.get('/deals', { params }).then(r => r.data),
  get: id => api.get(`/deals/${encodeURIComponent(id)}`).then(r => r.data),
  create: (payload /* JSON */) => api.post('/deals', payload).then(r => r.data),
  update: (id, payload /* JSON */) =>
    api.put(`/deals/${encodeURIComponent(id)}`, payload).then(r => r.data),
  remove: id =>
    api.delete(`/deals/${encodeURIComponent(id)}`).then(r => r.data),

  addFollowup: (dealId, payload /* JSON */) =>
    api
      .post(`/deals/${encodeURIComponent(dealId)}/followups`, payload)
      .then(r => r.data),
};

// ---- DEAL VIEW SUB-APIS (comments, tags, documents, notes, followups)
export const adminDealViewAPI = {
  // COMMENTS
  listComments: dealId =>
    api.get(`/deals/${encodeURIComponent(dealId)}/comments`).then(r => r.data),
  addComment: (dealId, payload) =>
    api
      .post(`/deals/${encodeURIComponent(dealId)}/comments`, payload)
      .then(r => r.data),
  updateComment: (dealId, commentId, payload) =>
    api
      .put(
        `/deals/${encodeURIComponent(dealId)}/comments/${encodeURIComponent(
          commentId,
        )}`,
        payload,
      )
      .then(r => r.data),
  deleteComment: (dealId, commentId) =>
    api
      .delete(
        `/deals/${encodeURIComponent(dealId)}/comments/${encodeURIComponent(
          commentId,
        )}`,
      )
      .then(r => r.data),

  // TAGS
  listTags: dealId =>
    api.get(`/deals/${encodeURIComponent(dealId)}/tags`).then(r => r.data),
  addTag: (dealId, payload /* { tagName } */) =>
    api
      .post(`/deals/${encodeURIComponent(dealId)}/tags`, payload)
      .then(r => r.data),
  deleteTag: (dealId, tagId) =>
    api
      .delete(
        `/deals/${encodeURIComponent(dealId)}/tags/${encodeURIComponent(
          tagId,
        )}`,
      )
      .then(r => r.data),

  // DOCUMENTS
  listDocuments: dealId =>
    api.get(`/deals/${encodeURIComponent(dealId)}/documents`).then(r => r.data),
  uploadDocument: (dealId, file /* {uri,name,type} */) => {
    const fd = new FormData();
    fd.append('file', {
      uri: file.uri,
      name: file.name || 'upload.bin',
      type: file.type || 'application/octet-stream',
    });
    return api
      .post(`/deals/${encodeURIComponent(dealId)}/documents`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // NOTES
  listNotes: dealId =>
    api.get(`/deals/${encodeURIComponent(dealId)}/notes`).then(r => r.data),
  addNote: (dealId, payload) =>
    api
      .post(`/deals/${encodeURIComponent(dealId)}/notes`, payload)
      .then(r => r.data),
  updateNote: (dealId, noteId, payload) =>
    api
      .put(
        `/deals/${encodeURIComponent(dealId)}/notes/${encodeURIComponent(
          noteId,
        )}`,
        payload,
      )
      .then(r => r.data),

  // FOLLOWUPS
  listFollowups: dealId =>
    api.get(`/deals/${encodeURIComponent(dealId)}/followups`).then(r => r.data),
  addFollowup: (dealId, payload) =>
    api
      .post(`/deals/${encodeURIComponent(dealId)}/followups`, payload)
      .then(r => r.data),
  updateFollowup: (dealId, followupId, payload) =>
    api
      .put(
        `/deals/${encodeURIComponent(dealId)}/followups/${encodeURIComponent(
          followupId,
        )}`,
        payload,
      )
      .then(r => r.data),
};

// --- ADMIN TASKS (INDEPENDENT) ---
// export const adminTasksAPI = {
//   // master list (independent of project/employee)
//   listAll: () => api.get('/api/projects/tasks/getAll').then(r => r.data),

//   // create (multipart)
//   create: payload => adminProjectTasksAPI.create(payload),

//   // update (multipart)
//   update: (taskId, payload) => adminProjectTasksAPI.update(taskId, payload),

//   // delete
//   remove: taskId =>
//     api
//       .delete(`/api/projects/tasks/${encodeURIComponent(taskId)}/delete`)
//       .then(r => r.data),

//   // pin / unpin
//   pin: taskId => taskPinAPI.pin(taskId),
//   unpin: taskId => taskPinAPI.unpin(taskId),
// };

// --- ADMIN TASKS (ALL) ---  // 🔁 reusable by shared/tasks saga
export const adminTasksAPI = {
  // GET /api/projects/tasks/getAll
  listAll: () => api.get('/api/projects/tasks/getAll').then(r => r.data),

  // POST /api/projects/tasks (multipart FormData) — reuse existing tasksAPI
  create: payload => tasksAPI.create(payload),

  // PUT /api/projects/tasks/{taskId} — reuse adminProjectTasksAPI.update
  update: (taskId, payload) => adminProjectTasksAPI.update(taskId, payload),

  // DELETE /api/projects/tasks/{taskId}/delete
  remove: taskId =>
    api
      .delete(`/api/projects/tasks/${encodeURIComponent(taskId)}/delete`)
      .then(r => r.data),

  // PIN/UNPIN via your existing taskPinAPI
  pin: taskId => taskPinAPI.pin(taskId),
  unpin: taskId => taskPinAPI.unpin(taskId),

  updateStatus: (taskId, statusId) =>
    api
      .patch(
        `/api/projects/tasks/${encodeURIComponent(
          taskId,
        )}/status?statusId=${encodeURIComponent(statusId)}`,
      )
      .then(r => r.data),
};

// Task Files
export const AtaskFilesAPI = {
  list: taskId => api.get(`/files/tasks/${taskId}`).then(r => r.data),
  upload: (taskId, file) => {
    const form = new FormData();
    form.append('file', file); // { uri, name, type }
    return api
      .post(`/files/tasks/${taskId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },
  remove: fileId =>
    api.delete(`/files/${encodeURIComponent(fileId)}`).then(r => r.data), // 👈 NEW
};

// Subtasks
export const AsubtasksAPI = {
  list: taskId => api.get(`/tasks/${taskId}/subtasks`).then(r => r.data),
  create: (taskId, payload) =>
    api.post(`/tasks/${taskId}/subtasks`, payload).then(r => r.data),
  update: (taskId, subId, payload) =>
    api.put(`/tasks/${taskId}/subtasks/${subId}`, payload).then(r => r.data), // 👈 NEW
  remove: (taskId, subId) =>
    api.delete(`/tasks/${taskId}/subtasks/${subId}`).then(r => r.data), // 👈 NEW
};

// Notes
export const AnotesAPI = {
  list: taskId => api.get(`/tasks/${taskId}/notes`).then(r => r.data),
  create: (taskId, payload) =>
    api.post(`/tasks/${taskId}/notes`, payload).then(r => r.data),
  removeByTaskNoteId: taskNoteId =>
    api
      .delete(`/notes/task/${encodeURIComponent(taskNoteId)}`)
      .then(r => r.data), // 👈 NEW (your delete path)
};

export const AstatusesAPI = {
  list: () => api.get('/status').then(r => r.data),
  create: payload => api.post('/status', payload).then(r => r.data),
  update: (id, payload) =>
    api.put(`/status/${encodeURIComponent(id)}`, payload).then(r => r.data), // <—
  remove: id =>
    api.delete(`/status/${encodeURIComponent(id)}`).then(r => r.data),
};

export const ATimesheetsAPI = {
  listByTaskId: taskId =>
    api.get(`/timesheets/task/${taskId}`).then(r => r.data),
};

// --- MY TIMESHEETS (list) ---
export const AdminmyTimesheetsAPI = {
  list: (params = {}) => api.get('/timesheets', { params }).then(r => r.data),
  create: payload => api.post('/timesheets', payload).then(r => r.data),
  remove: id => api.delete(`/timesheets/${id}`),
};

// --- WEEKLY TIMESHEETS ---
export const AdminweeklyTimesheetsAPI = {
  create: payload => api.post('/weekly-timesheets', payload).then(r => r.data),
  getMine: weekStartDate =>
    api
      .get('/weekly-timesheets', { params: { weekStartDate } })
      .then(r => r.data),
};

export const AdminWeeklyTimesheetsAPI = {
  create: payload => api.post('/timesheets/weekly', payload).then(r => r.data),

  getMine: weekStartDate =>
    api
      .get('/timesheets/weekly', { params: { weekStartDate } })
      .then(r => r.data),
};

export const projectInvoicesAPI = {
  listByProject: projectId =>
    api
      .get(`/api/invoices/project/${encodeURIComponent(projectId)}`)
      .then(r => (Array.isArray(r.data) ? r.data : [])),
};

// --- PROJECT FILES ---
export const AdminprojectFilesAPI = {
  list: projectId =>
    api
      .get(`/files/projects/${encodeURIComponent(projectId)}`)
      .then(r => r.data),

  upload: async (projectId, file) => {
    const fd = new FormData();
    // file = { uri, name, type }
    fd.append('file', {
      uri: file.uri,
      name: file.name || 'upload.bin',
      type: file.type || 'application/octet-stream',
    });
    return api
      .post(`/files/projects/${encodeURIComponent(projectId)}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  remove: fileId =>
    api.delete(`/files/${encodeURIComponent(fileId)}`).then(r => r.data),
};

export const AdminprojectActivityAPI = {
  listByProject: projectId =>
    api
      .get(`/projects/${encodeURIComponent(projectId)}/activity`)
      .then(r => r.data),
};

// --- PROJECT NOTES ---
export const projectNotesAPI = {
  listByProject: projectId =>
    api
      .get(`/projects/${encodeURIComponent(projectId)}/notes`)
      .then(r => r.data),

  create: (projectId, note) =>
    api
      .post(`/projects/${encodeURIComponent(projectId)}/notes`, note)
      .then(r => r.data),

  remove: noteId =>
    api
      .delete(`/notes/project/${encodeURIComponent(noteId)}`)
      .then(r => r.data),
};

// --- STAGES API (kanban)
export const stagesAPI = {
  list: () => api.get('/stages').then(r => r.data),
  create: payload => api.post('/stages', payload).then(r => r.data),
  update: (id, payload) =>
    api.put(`/stages/${encodeURIComponent(id)}`, payload).then(r => r.data),
  remove: id =>
    api.delete(`/stages/${encodeURIComponent(id)}`).then(r => r.data),
};

export default api;
