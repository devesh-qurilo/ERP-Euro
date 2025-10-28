import { FETCH_MY_TIMESHEETS_REQUEST } from './types';

export const fetchMyTimesheets = (params = {}) => ({
  type: FETCH_MY_TIMESHEETS_REQUEST,
  params,
});
