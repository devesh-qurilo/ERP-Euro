import { FETCH_PROJECT_ACTIVITY_REQUEST } from './types';

export const fetchProjectActivity = projectId => ({
  type: FETCH_PROJECT_ACTIVITY_REQUEST,
  projectId,
});
