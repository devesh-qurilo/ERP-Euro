import * as T from './types';

export const listByProject = projectId => ({
  type: T.LIST_REQUEST,
  payload: { projectId },
});

export const openUpload = preset => ({
  type: T.UPLOAD_OPEN,
  payload: preset || null,
});
export const closeUpload = () => ({ type: T.UPLOAD_CLOSE });

export const uploadFile = (projectId, file) => ({
  type: T.UPLOAD_REQUEST,
  payload: { projectId, file },
});

export const deleteFile = (fileId, projectId) => ({
  type: T.DELETE_REQUEST,
  payload: { fileId, projectId },
});
