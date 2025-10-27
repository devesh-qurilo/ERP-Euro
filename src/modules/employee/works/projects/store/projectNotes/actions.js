import { FETCH_PROJECT_NOTES_REQUEST } from './types';

export const fetchProjectNotes = projectId => ({
  type: FETCH_PROJECT_NOTES_REQUEST,
  projectId,
});
