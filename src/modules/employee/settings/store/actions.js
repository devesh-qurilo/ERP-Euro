export const FETCH_ME_REQUEST = 'employee/settings/FETCH_ME_REQUEST';
export const FETCH_ME_SUCCESS = 'employee/settings/FETCH_ME_SUCCESS';
export const FETCH_ME_FAILURE = 'employee/settings/FETCH_ME_FAILURE';

export const UPDATE_ME_REQUEST = 'employee/settings/UPDATE_ME_REQUEST';
export const UPDATE_ME_SUCCESS = 'employee/settings/UPDATE_ME_SUCCESS';
export const UPDATE_ME_FAILURE = 'employee/settings/UPDATE_ME_FAILURE';

export const fetchMe = () => ({ type: FETCH_ME_REQUEST });

/** payload: { employee: {...}, profilePictureFile?: { uri, name, type } } */
export const updateMe = payload => ({ type: UPDATE_ME_REQUEST, payload });
