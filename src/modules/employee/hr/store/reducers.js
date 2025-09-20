// src/modules/employee/hr/store/reducers.js
import {
  FETCH_MY_LEAVES_REQUEST,
  FETCH_MY_LEAVES_SUCCESS,
  FETCH_MY_LEAVES_FAILURE,
} from './actions';

const initialState = {
  myLeaves: { data: [], loading: false, error: null },
};

export default function employeeHRReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MY_LEAVES_REQUEST:
      return {
        ...state,
        myLeaves: { ...state.myLeaves, loading: true, error: null },
      };

    case FETCH_MY_LEAVES_SUCCESS:
      return {
        ...state,
        myLeaves: { data: action.payload, loading: false, error: null },
      };

    case FETCH_MY_LEAVES_FAILURE:
      return {
        ...state,
        myLeaves: { ...state.myLeaves, loading: false, error: action.error },
      };

    default:
      return state; // <— returns initialState on first call
  }
}
