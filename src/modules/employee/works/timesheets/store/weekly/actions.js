// src/modules/employee/works/timesheets/store/weekly/actions.js
import * as T from './types';

export const fetchWeekly = weekStartDate => ({
  type: T.FETCH_WEEKLY_REQUEST,
  weekStartDate,
});
export const createWeekly = payload => ({
  type: T.CREATE_WEEKLY_REQUEST,
  payload,
});
