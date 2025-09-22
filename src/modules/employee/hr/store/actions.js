export const FETCH_MY_LEAVES_REQUEST = 'employee/hr/FETCH_MY_LEAVES_REQUEST';
export const FETCH_MY_LEAVES_SUCCESS = 'employee/hr/FETCH_MY_LEAVES_SUCCESS';
export const FETCH_MY_LEAVES_FAILURE = 'employee/hr/FETCH_MY_LEAVES_FAILURE';

export const APPLY_LEAVE_REQUEST = 'employee/hr/APPLY_LEAVE_REQUEST';
export const APPLY_LEAVE_SUCCESS = 'employee/hr/APPLY_LEAVE_SUCCESS';
export const APPLY_LEAVE_FAILURE = 'employee/hr/APPLY_LEAVE_FAILURE';

export const fetchMyLeaves = () => ({ type: FETCH_MY_LEAVES_REQUEST });

/**
 * payload: { leaveData: {...}, documents: DocumentPickerFile[] }
 * documents is optional
 */
export const applyLeave = payload => ({ type: APPLY_LEAVE_REQUEST, payload });
