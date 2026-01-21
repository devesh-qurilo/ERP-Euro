// /src/services/tasks.api.js
import api from '../../../../../services/api';

// ---------------------- DROPDOWNS ----------------------

// Task categories
export const fetchCategories = () =>
  api.get('/task/task-categories').then(r => r.data);

// Projects
export const fetchProjects = () => api.get('/api/projects').then(r => r.data);

// Stages
export const fetchTaskStages = () => api.get('/status').then(r => r.data);

// Employees (assign to)
export const fetchEmployees = () => api.get('/employee/all').then(r => r.data);

// Milestones for selected project
export const fetchMilestones = projectId =>
  api
    .get(`/api/projects/${encodeURIComponent(projectId)}/milestones`)
    .then(r => r.data);

// Labels for selected project
export const fetchLabels = projectId =>
  api
    .get(`/projects/${encodeURIComponent(projectId)}/labels`)
    .then(r => r.data);

// ---------------------- CREATE TASK ----------------------

export const createTask = payload => {
  const fd = new FormData();

  // Text fields
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
    if (payload[k] !== undefined && payload[k] !== null) {
      fd.append(k, String(payload[k]));
    }
  });

  // Arrays
  if (payload.assignedEmployeeIds) {
    fd.append('assignedEmployeeIds', payload.assignedEmployeeIds.join(','));
  }

  if (payload.labelIds) {
    fd.append('labelIds', payload.labelIds.join(','));
  }

  // File
  if (payload.taskFile) {
    fd.append('taskFile', {
      uri: payload.taskFile.uri,
      name: payload.taskFile.name,
      type: payload.taskFile.type,
    });
  }

  return api
    .post('/api/projects/tasks', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(r => r.data);
};

// ---------------------- UPDATE TASK ----------------------

export const updateTask = (taskId, payload) => {
  const fd = new FormData();

  [
    'title',
    'category',
    'description',
    'priority',
    'isPrivate',
    'timeEstimateMinutes',
    'isDependent',
    'projectId',
  ].forEach(k => {
    if (payload[k] !== undefined && payload[k] !== null) {
      fd.append(k, String(payload[k]));
    }
  });

  if (payload.assignedEmployeeIds) {
    fd.append('assignedEmployeeIds', payload.assignedEmployeeIds.join(','));
  }

  if (payload.labelIds) {
    fd.append('labelIds', payload.labelIds.join(','));
  }

  return api
    .put(`/api/projects/tasks/${encodeURIComponent(taskId)}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(r => r.data);
};

// ---------------------- TASK CATEGORIES (CRUD) ----------------------

// Create category
export const createCategory = payload =>
  api.post('/task/task-categories', payload).then(r => r.data);

// Delete category
export const deleteCategory = categoryId =>
  api
    .delete(`/task/task-categories/${encodeURIComponent(categoryId)}`)
    .then(r => r.data);

// ---------------------- LABELS (CRUD) ----------------------

// CREATE
export const createLabel = payload =>
  api.post('/api/labels', payload).then(r => r.data);

// UPDATE
export const updateLabel = (labelId, payload) =>
  api.put(`/api/labels/${labelId}`, payload).then(r => r.data);

// DELETE
export const deleteLabel = labelId =>
  api.delete(`/api/labels/${labelId}`).then(r => r.data);
