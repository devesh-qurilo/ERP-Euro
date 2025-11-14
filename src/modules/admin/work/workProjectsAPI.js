import api from '../../../services/api'; // <-- adjust if your axios instance lives elsewhere

const toFormFile = f =>
  f
    ? {
        uri: f.uri,
        name: f.name || 'upload.bin',
        type: f.type || 'application/octet-stream',
      }
    : null;

export const kadminWorkProjectsAPI = {
  // GET /api/projects (admin: list all – used for list, calendar, pinned, archived views client-side)
  listAll: () => api.get('/api/projects').then(r => r.data),

  // POST /api/projects (multipart)
  create: payload => {
    const fd = new FormData();
    fd.append('shortCode', payload.shortCode);
    fd.append('projectName', payload.projectName);
    fd.append('startDate', payload.startDate);
    fd.append('deadline', payload.deadline);
    fd.append('noDeadline', String(!!payload.noDeadline));
    fd.append('projectCategory', payload.projectCategory);
    fd.append('departmentId', String(payload.departmentId));
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
    const cf = toFormFile(payload.companyFile);
    if (cf) fd.append('companyFile', cf);
    if (payload.assignedEmployeeIds?.length) {
      fd.append('assignedEmployeeIds', payload.assignedEmployeeIds.join(','));
    }
    return api
      .post('/api/projects', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // PUT /api/projects/{id} (multipart)
  update: (id, payload) => {
    const fd = new FormData();
    if (payload.name) fd.append('name', payload.name);
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
    const cf = toFormFile(payload.companyFile);
    if (cf) fd.append('companyFile', cf);

    return api
      .put(`/api/projects/${encodeURIComponent(id)}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // DELETE /api/projects/{id}
  remove: id =>
    api.delete(`/api/projects/${encodeURIComponent(id)}`).then(r => r.data),

  // PATCH /api/projects/{id}/status (multipart form with "status")
  patchStatus: (id, status) => {
    const fd = new FormData();
    fd.append('status', status);
    return api
      .patch(`/api/projects/${encodeURIComponent(id)}/status`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data);
  },

  // Pin/Unpin/Archive/Unarchive (NOTE: no /api prefix per your spec)
  pin: id =>
    api.post(`/projects/${encodeURIComponent(id)}/pin`).then(r => r.data),
  unpin: id =>
    api.delete(`/projects/${encodeURIComponent(id)}/pin`).then(r => r.data),
  archive: id =>
    api.post(`/projects/${encodeURIComponent(id)}/archive`).then(r => r.data),
  unarchive: id =>
    api.delete(`/projects/${encodeURIComponent(id)}/archive`).then(r => r.data),
};
