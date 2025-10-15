import {
  FETCH_MY_LEADS_REQUEST,
  FETCH_MY_LEADS_SUCCESS,
  FETCH_MY_LEADS_FAILURE,
  CREATE_LEAD_REQUEST,
  CREATE_LEAD_SUCCESS,
  CREATE_LEAD_FAILURE,
} from './actions';

const initialState = {
  list: [],
  loading: false,
  error: null,

  create: {
    loading: false,
    error: null,
  },
};

export default function employeeLeadsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MY_LEADS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_MY_LEADS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case FETCH_MY_LEADS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case CREATE_LEAD_REQUEST:
      return { ...state, create: { loading: true, error: null } };
    case CREATE_LEAD_SUCCESS:
      return {
        ...state,
        create: { loading: false, error: null },
        // prepend new lead so user sees it immediately
        list: [action.payload, ...state.list],
      };
    case CREATE_LEAD_FAILURE:
      return { ...state, create: { loading: false, error: action.error } };

    default:
      return state;
  }
}
