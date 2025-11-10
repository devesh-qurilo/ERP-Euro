import * as T from './types';

export const setTaskId = taskId => ({ type: T.SET_TASK_ID, taskId });
export const setTab = tab => ({ type: T.SET_TAB, tab });

/* Files */
export const filesFetch = () => ({ type: T.FILES_FETCH_REQ });
export const filesUpload = file => ({ type: T.FILES_UPLOAD_REQ, file }); // {uri,name,type}
export const filesDelete = fileId => ({ type: T.FILES_DELETE_REQ, fileId });

/* Subtasks */
export const subsFetch = () => ({ type: T.SUBS_FETCH_REQ });
export const subsCreate = payload => ({ type: T.SUBS_CREATE_REQ, payload }); // {title,description}
export const subsUpdate = (subId, payload) => ({
  type: T.SUBS_UPDATE_REQ,
  subId,
  payload,
});
export const subsDelete = subId => ({ type: T.SUBS_DELETE_REQ, subId });

/* Notes */
export const notesFetch = () => ({ type: T.NOTES_FETCH_REQ });
export const notesCreate = payload => ({ type: T.NOTES_CREATE_REQ, payload }); // {title,content,isPublic}
export const notesDelete = taskNoteId => ({
  type: T.NOTES_DELETE_REQ,
  taskNoteId,
});
