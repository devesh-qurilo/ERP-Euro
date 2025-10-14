// src/modules/employee/works/projects/store/actions.js
export const FETCH_PROJECTS_REQUEST =
  'employee/projects/FETCH_PROJECTS_REQUEST';
export const FETCH_PROJECTS_SUCCESS =
  'employee/projects/FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECTS_FAILURE =
  'employee/projects/FETCH_PROJECTS_FAILURE';

export const TOGGLE_PIN_PROJECT = 'employee/projects/TOGGLE_PIN_PROJECT';

export const fetchProjects = (params = {}) => ({
  type: FETCH_PROJECTS_REQUEST,
  params,
});

export const togglePinProject = projectId => ({
  type: TOGGLE_PIN_PROJECT,
  projectId,
});
