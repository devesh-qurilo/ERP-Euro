import * as T from './types';

export const listByProject = projectId => ({
  type: T.LIST_BY_PROJECT_REQUEST,
  payload: { projectId },
});

export const openCreate = preset => ({
  type: T.CREATE_OPEN,
  payload: preset || null,
});
export const closeCreate = () => ({ type: T.CREATE_CLOSE });

export const createNote = (projectId, note) => ({
  type: T.CREATE_REQUEST,
  payload: { projectId, note },
});

export const deleteNote = (noteId, projectId) => ({
  type: T.DELETE_REQUEST,
  payload: { noteId, projectId },
});
