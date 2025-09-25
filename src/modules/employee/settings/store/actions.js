export const FETCH_ME_REQUEST = 'employee/settings/FETCH_ME_REQUEST';
export const FETCH_ME_SUCCESS = 'employee/settings/FETCH_ME_SUCCESS';
export const FETCH_ME_FAILURE = 'employee/settings/FETCH_ME_FAILURE';

export const UPDATE_ME_REQUEST = 'employee/settings/UPDATE_ME_REQUEST';
export const UPDATE_ME_SUCCESS = 'employee/settings/UPDATE_ME_SUCCESS';
export const UPDATE_ME_FAILURE = 'employee/settings/UPDATE_ME_FAILURE';

export const FETCH_EMERGENCY_CONTACTS_REQUEST =
  'employee/settings/FETCH_EMERGENCY_CONTACTS_REQUEST';
export const FETCH_EMERGENCY_CONTACTS_SUCCESS =
  'employee/settings/FETCH_EMERGENCY_CONTACTS_SUCCESS';
export const FETCH_EMERGENCY_CONTACTS_FAILURE =
  'employee/settings/FETCH_EMERGENCY_CONTACTS_FAILURE';

export const CREATE_EMERGENCY_CONTACT_REQUEST =
  'employee/settings/CREATE_EMERGENCY_CONTACT_REQUEST';
export const CREATE_EMERGENCY_CONTACT_SUCCESS =
  'employee/settings/CREATE_EMERGENCY_CONTACT_SUCCESS';
export const CREATE_EMERGENCY_CONTACT_FAILURE =
  'employee/settings/CREATE_EMERGENCY_CONTACT_FAILURE';

export const fetchMe = () => ({ type: FETCH_ME_REQUEST });

/** payload: { employee: {...}, profilePictureFile?: { uri, name, type } } */
export const updateMe = payload => ({ type: UPDATE_ME_REQUEST, payload });

export const fetchEmergencyContacts = employeeId => ({
  type: FETCH_EMERGENCY_CONTACTS_REQUEST,
  employeeId,
});

export const createEmergencyContact = ({ employeeId, contact }) => ({
  type: CREATE_EMERGENCY_CONTACT_REQUEST,
  employeeId,
  contact,
});
