import * as T from './types';

const initial = {
  list: [],
  loading: false,
  error: null,
  //   weekly: null,
  //   weeklyLoading: false,
  //   weeklyError: null,
  weekly: { data: null, loading: false, error: null },
};

export default function AdminTimesheetsReducer(state = initial, action) {
  switch (action.type) {
    case T.FETCH_MY_TIMESHEETS_REQUEST:
      return { ...state, loading: true, error: null };
    case T.FETCH_MY_TIMESHEETS_SUCCESS:
      return { ...state, loading: false, list: action.payload || [] };
    case T.FETCH_MY_TIMESHEETS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case T.CREATE_TIMESHEET_REQUEST:
      return { ...state, create: { loading: true, error: null } };
    case T.CREATE_TIMESHEET_SUCCESS:
      return {
        ...state,
        create: { loading: false, error: null },
        // optimistic prepend to list
        my: { ...state.my, data: [action.payload, ...state.my.data] },
      };
    case T.CREATE_TIMESHEET_FAILURE:
      return { ...state, create: { loading: false, error: action.error } };

    case T.CREATE_WEEKLY_TS_REQUEST:
      return { ...state, weeklyLoading: true, weeklyError: null };
    case T.CREATE_WEEKLY_TS_SUCCESS:
      return { ...state, weeklyLoading: false, weekly: action.payload };
    case T.CREATE_WEEKLY_TS_FAILURE:
      return { ...state, weeklyLoading: false, weeklyError: action.error };

    case T.GET_WEEKLY_TS_REQUEST:
      return { ...state, weeklyLoading: true, weeklyError: null };
    case T.GET_WEEKLY_TS_SUCCESS:
      return { ...state, weeklyLoading: false, weekly: action.payload };
    case T.GET_WEEKLY_TS_FAILURE:
      return { ...state, weeklyLoading: false, weeklyError: action.error };

    // weekly create
    case T.CREATE_WEEKLY_TIMESHEET_REQUEST:
      return {
        ...state,
        weekly: { ...state.weekly, loading: true, error: null },
      };
    case T.CREATE_WEEKLY_TIMESHEET_SUCCESS:
      return {
        ...state,
        weekly: { data: action.payload, loading: false, error: null },
      };
    case T.CREATE_WEEKLY_TIMESHEET_FAILURE:
      return {
        ...state,
        weekly: { ...state.weekly, loading: false, error: action.error },
      };

    // weekly get
    case T.GET_WEEKLY_TIMESHEET_REQUEST:
      return {
        ...state,
        weekly: { ...state.weekly, loading: true, error: null },
      };
    case T.GET_WEEKLY_TIMESHEET_SUCCESS:
      return {
        ...state,
        weekly: { data: action.payload, loading: false, error: null },
      };
    case T.GET_WEEKLY_TIMESHEET_FAILURE:
      return {
        ...state,
        weekly: { ...state.weekly, loading: false, error: action.error },
      };

    default:
      return state;
  }
}
