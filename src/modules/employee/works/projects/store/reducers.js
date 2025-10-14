// src/modules/employee/works/projects/store/reducers.js
import {
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  TOGGLE_PIN_PROJECT,
} from './actions';

const initialState = {
  list: [],
  loading: false,
  error: null,
  pinned: [], // array of project ids
};

export default function employeeProjectsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROJECTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROJECTS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case FETCH_PROJECTS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case TOGGLE_PIN_PROJECT: {
      const id = action.projectId;
      const has = state.pinned.includes(id);
      return {
        ...state,
        pinned: has
          ? state.pinned.filter(x => x !== id)
          : [id, ...state.pinned],
      };
    }

    default:
      return state;
  }
}
