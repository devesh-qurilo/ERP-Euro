// src/modules/employee/settings/store/reducers.js
import {
  FETCH_ME_REQUEST,
  FETCH_ME_SUCCESS,
  FETCH_ME_FAILURE,
  UPDATE_ME_REQUEST,
  UPDATE_ME_SUCCESS,
  UPDATE_ME_FAILURE,
  FETCH_EMERGENCY_CONTACTS_REQUEST,
  FETCH_EMERGENCY_CONTACTS_SUCCESS,
  FETCH_EMERGENCY_CONTACTS_FAILURE,
  CREATE_EMERGENCY_CONTACT_REQUEST,
  CREATE_EMERGENCY_CONTACT_SUCCESS,
  CREATE_EMERGENCY_CONTACT_FAILURE,
} from './actions';

const initialState = {
  profile: { data: null, loading: false, error: null },
  update: { loading: false, error: null, lastSavedAt: null },
  emergencyContacts: {
    data: [],
    loading: false,
    error: null,
    creating: false,
    createError: null,
  },
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

    // contacts list
    case FETCH_EMERGENCY_CONTACTS_REQUEST:
      return {
        ...state,
        emergencyContacts: {
          ...state.emergencyContacts,
          loading: true,
          error: null,
        },
      };
    case FETCH_EMERGENCY_CONTACTS_SUCCESS:
      return {
        ...state,
        emergencyContacts: {
          ...state.emergencyContacts,
          loading: false,
          data: action.payload,
        },
      };
    case FETCH_EMERGENCY_CONTACTS_FAILURE:
      return {
        ...state,
        emergencyContacts: {
          ...state.emergencyContacts,
          loading: false,
          error: action.error,
        },
      };

    // create contact
    case CREATE_EMERGENCY_CONTACT_REQUEST:
      return {
        ...state,
        emergencyContacts: {
          ...state.emergencyContacts,
          creating: true,
          createError: null,
        },
      };
    case CREATE_EMERGENCY_CONTACT_SUCCESS:
      // optimistic: prepend; saga also refreshes list
      return {
        ...state,
        emergencyContacts: {
          ...state.emergencyContacts,
          creating: false,
          data: [action.payload, ...state.emergencyContacts.data],
        },
      };
    case CREATE_EMERGENCY_CONTACT_FAILURE:
      return {
        ...state,
        emergencyContacts: {
          ...state.emergencyContacts,
          creating: false,
          createError: action.error,
        },
      };

    default:
      return state;
  }
}
