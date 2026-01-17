import * as T from './types';

export const fetchMyTimesheets = (params = {}) => ({
  type: T.FETCH_MY_TIMESHEETS_REQUEST,
  params,
});

export const createTimesheet = payload => ({
  type: T.CREATE_TIMESHEET_REQUEST,
  payload,
});

export const createWeeklyTimesheet = payload => ({
  type: T.CREATE_WEEKLY_TS_REQUEST,
  payload,
});
export const getWeeklyTimesheet = weekStartDate => ({
  type: T.GET_WEEKLY_TS_REQUEST,
  weekStartDate,
});

export const VcreateWeeklyTimesheet = payload => ({
  type: T.VCREATE_WEEKLY_TIMESHEET_REQUEST,
  payload, // { taskId, days: [] }
});

export const VgetWeeklyTimesheet = weekStartDate => ({
  type: T.VGET_WEEKLY_TIMESHEET_REQUEST,
  weekStartDate,
});
