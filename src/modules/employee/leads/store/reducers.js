import {
  FETCH_MY_LEADS_REQUEST,
  FETCH_MY_LEADS_SUCCESS,
  FETCH_MY_LEADS_FAILURE,
} from './actions';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export default function employeeLeadsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MY_LEADS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_MY_LEADS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case FETCH_MY_LEADS_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
