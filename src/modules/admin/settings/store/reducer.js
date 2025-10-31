import * as T from './types';

const initial = {
  // profile
  profileUpdating: false,
  profileUpdateError: null,
  lastProfile: null,

  // company
  company: null,
  companyLoading: false,
  companyError: null,
  companySaving: false,
  companySaveError: null,
  lastCompanySaved: null,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    // Profile
    case T.ADMIN_PROFILE_UPDATE_REQUEST:
      return { ...state, profileUpdating: true, profileUpdateError: null };
    case T.ADMIN_PROFILE_UPDATE_SUCCESS:
      return { ...state, profileUpdating: false, lastProfile: action.payload };
    case T.ADMIN_PROFILE_UPDATE_FAILURE:
      return {
        ...state,
        profileUpdating: false,
        profileUpdateError: action.error,
      };

    // Company fetch
    case T.ADMIN_COMPANY_FETCH_REQUEST:
      return { ...state, companyLoading: true, companyError: null };
    case T.ADMIN_COMPANY_FETCH_SUCCESS:
      return { ...state, companyLoading: false, company: action.payload };
    case T.ADMIN_COMPANY_FETCH_FAILURE:
      return { ...state, companyLoading: false, companyError: action.error };

    // Company save
    case T.ADMIN_COMPANY_SAVE_REQUEST:
      return {
        ...state,
        companySaving: true,
        companySaveError: null,
        lastCompanySaved: null,
      };
    case T.ADMIN_COMPANY_SAVE_SUCCESS:
      return {
        ...state,
        companySaving: false,
        lastCompanySaved: action.payload,
        company: action.payload,
      };
    case T.ADMIN_COMPANY_SAVE_FAILURE:
      return { ...state, companySaving: false, companySaveError: action.error };

    default:
      return state;
  }
}
