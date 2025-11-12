import * as T from './types';

export const listByProject = projectId => ({
  type: T.LIST_BY_PROJECT_REQUEST,
  payload: { projectId },
});
