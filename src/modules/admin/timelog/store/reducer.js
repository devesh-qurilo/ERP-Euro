import {
  FETCH_TIMELOG_REQUEST,
  FETCH_TIMELOG_SUCCESS,
  FETCH_TIMELOG_FAILURE,
  SET_TIMELOG_SELECTED_DATE,
} from './actions';

const initialState = {
  loading: false,
  error: null,
  date: null, // kept for backward compatibility (last fetched date)
  selectedDate: null, // global selected date (YYYY-MM-DD)
  timeLogs: [],
  summary: {
    date: null,
    totalMinutes: 0,
    totalHours: 0,
    segments: [],
    usedPct: 0,
  },
};

export default function timelogReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TIMELOG_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload?.date ?? state.selectedDate,
      };

    case FETCH_TIMELOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        date: action.payload?.date ?? state.date,
      };

    case FETCH_TIMELOG_SUCCESS:
      return {
        ...state,
        loading: false,
        timeLogs: action.payload.timeLogs || [],
        summary: action.payload.summary || initialState.summary,
        error: null,
      };

    case FETCH_TIMELOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
}
