// src/modules/employee/settings/store/reducers.js
import {
  FETCH_ME_REQUEST,
  FETCH_ME_SUCCESS,
  FETCH_ME_FAILURE,
  UPDATE_ME_REQUEST,
  UPDATE_ME_SUCCESS,
  UPDATE_ME_FAILURE,
} from './actions';

const initialState = {
  profile: { data: null, loading: false, error: null },
  update: { loading: false, error: null, lastSavedAt: null },
};

export default function employeeSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ME_REQUEST:
      return {
        ...state,
        profile: { ...state.profile, loading: true, error: null },
      };
    case FETCH_ME_SUCCESS:
      return {
        ...state,
        profile: { data: action.payload, loading: false, error: null },
      };
    case FETCH_ME_FAILURE:
      return {
        ...state,
        profile: { ...state.profile, loading: false, error: action.error },
      };

    case UPDATE_ME_REQUEST:
      return {
        ...state,
        update: { loading: true, error: null, lastSavedAt: null },
      };
    case UPDATE_ME_SUCCESS:
      return {
        ...state,
        update: { loading: false, error: null, lastSavedAt: Date.now() },
        profile: { data: action.payload, loading: false, error: null },
      };
    case UPDATE_ME_FAILURE:
      return {
        ...state,
        update: { loading: false, error: action.error, lastSavedAt: null },
      };

    default:
      return state;
  }
}
