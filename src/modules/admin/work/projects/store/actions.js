import * as T from './types';

export const setMode = mode => ({ type: T.AWP_SET_MODE, mode });
export const setFilters = patch => ({ type: T.AWP_SET_FILTERS, patch });

export const fetchAll = () => ({ type: T.AWP_FETCH_ALL });
export const createProject = payload => ({ type: T.AWP_CREATE, payload });
export const updateProject = (id, p) => ({
  type: T.AWP_UPDATE,
  id,
  payload: p,
});
export const deleteProject = id => ({ type: T.AWP_DELETE, id });

export const patchStatus = (id, status) => ({
  type: T.AWP_PATCH_STATUS,
  id,
  status,
});
export const pinProject = id => ({ type: T.AWP_PIN, id });
export const unpinProject = id => ({ type: T.AWP_UNPIN, id });
export const archiveProject = id => ({ type: T.AWP_ARCHIVE, id });
export const unarchiveProject = id => ({ type: T.AWP_UNARCHIVE, id });

export const openModal = editing => ({ type: T.AWP_OPEN_MODAL, editing });
export const closeModal = () => ({ type: T.AWP_CLOSE_MODAL });

// NEW
export const patchProgress = (id, percent) => ({
  type: T.AWP_PATCH_PROGRESS,
  id,
  percent,
});

export const fetchMetrics = projectId => ({
  type: T.AWP_FETCH_METRICS,
  projectId,
});

export const setMetrics = (projectId, metrics) => ({
  type: T.AWP_SET_METRICS,
  projectId,
  metrics,
});

// AWP category actions (append)
export const fetchProjectCategories = () => ({ type: T.AWP_CAT_LIST });
export const createProjectCategory = payload => ({
  type: T.AWP_CAT_CREATE,
  payload,
});
export const deleteProjectCategory = id => ({ type: T.AWP_CAT_DELETE, id });
