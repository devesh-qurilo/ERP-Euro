export const FETCH_PROJECTS_REQUEST =
  'employee/projects/FETCH_PROJECTS_REQUEST';
export const FETCH_PROJECTS_SUCCESS =
  'employee/projects/FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECTS_FAILURE =
  'employee/projects/FETCH_PROJECTS_FAILURE';

// 🔁 server-backed pin toggle
export const TOGGLE_PIN_PROJECT_REQUEST =
  'employee/projects/TOGGLE_PIN_PROJECT_REQUEST';
export const TOGGLE_PIN_PROJECT_SUCCESS =
  'employee/projects/TOGGLE_PIN_PROJECT_SUCCESS';
export const TOGGLE_PIN_PROJECT_FAILURE =
  'employee/projects/TOGGLE_PIN_PROJECT_FAILURE';
export const FETCH_PROJECT_METRICS_REQUEST =
  'employee/projects/FETCH_PROJECT_METRICS_REQUEST';
export const FETCH_PROJECT_METRICS_SUCCESS =
  'employee/projects/FETCH_PROJECT_METRICS_SUCCESS';
export const FETCH_PROJECT_METRICS_FAILURE =
  'employee/projects/FETCH_PROJECT_METRICS_FAILURE';

export const fetchProjectMetrics = projectId => ({
  type: FETCH_PROJECT_METRICS_REQUEST,
  projectId,
});

export const fetchProjects = (params = {}) => ({
  type: FETCH_PROJECTS_REQUEST,
  params,
});

/**
 * Toggle pin for a project.
 * @param {number} projectId
 * @param {boolean} desiredPinned - the target state
 * @param {boolean} prevPinned    - current state (for rollback)
 */
export const togglePinProject = (projectId, desiredPinned, prevPinned) => ({
  type: TOGGLE_PIN_PROJECT_REQUEST,
  projectId,
  desiredPinned,
  prevPinned,
});
