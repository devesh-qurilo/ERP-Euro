import * as T from './types';

export const fetchProjectFiles = projectId => ({
  type: T.FETCH_PROJECT_FILES_REQUEST,
  payload: { projectId },
});

export const fetchProjectFilesSuccess = (projectId, items) => ({
  type: T.FETCH_PROJECT_FILES_SUCCESS,
  payload: { projectId, items },
});

export const fetchProjectFilesFailure = error => ({
  type: T.FETCH_PROJECT_FILES_FAILURE,
  error,
});

export const uploadProjectFile = (projectId, file) => ({
  type: T.UPLOAD_PROJECT_FILE_REQUEST,
  payload: { projectId, file },
});

export const uploadProjectFileSuccess = item => ({
  type: T.UPLOAD_PROJECT_FILE_SUCCESS,
  payload: { item },
});

export const uploadProjectFileFailure = error => ({
  type: T.UPLOAD_PROJECT_FILE_FAILURE,
  error,
});
