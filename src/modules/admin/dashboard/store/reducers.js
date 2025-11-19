// src/modules/admin/dashboard/store/reducer.js
import {
  FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST,
  FETCH_ADMIN_DASHBOARD_COUNTS_SUCCESS,
  FETCH_ADMIN_DASHBOARD_COUNTS_FAILURE,
} from './actions';

const initialState = {
  loading: false,
  error: null,
  projects: { pendingCount: 0, overdueCount: 0 },
  tasks: { pendingCount: 0, overdueCount: 0 },
  deals: { totalDeals: 0, convertedDeals: 0 },
  followups: { pendingCount: 0, upcomingCount: 0 },
};

export default function adminDashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ADMIN_DASHBOARD_COUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        projects: action.payload.projects || state.projects,
        tasks: action.payload.tasks || state.tasks,
        deals: action.payload.deals || state.deals,
        followups: action.payload.followups || state.followups,
      };
    case FETCH_ADMIN_DASHBOARD_COUNTS_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
