export const FETCH_MY_LEAVES_REQUEST = 'employee/hr/FETCH_MY_LEAVES_REQUEST';
export const FETCH_MY_LEAVES_SUCCESS = 'employee/hr/FETCH_MY_LEAVES_SUCCESS';
export const FETCH_MY_LEAVES_FAILURE = 'employee/hr/FETCH_MY_LEAVES_FAILURE';

export const APPLY_LEAVE_REQUEST = 'employee/hr/APPLY_LEAVE_REQUEST';
export const APPLY_LEAVE_SUCCESS = 'employee/hr/APPLY_LEAVE_SUCCESS';
export const APPLY_LEAVE_FAILURE = 'employee/hr/APPLY_LEAVE_FAILURE';

// hr attendnce
export const FETCH_MY_ATTENDANCE_REQUEST =
  'employee/hr/FETCH_MY_ATTENDANCE_REQUEST';
export const FETCH_MY_ATTENDANCE_SUCCESS =
  'employee/hr/FETCH_MY_ATTENDANCE_SUCCESS';
export const FETCH_MY_ATTENDANCE_FAILURE =
  'employee/hr/FETCH_MY_ATTENDANCE_FAILURE';

export const FETCH_APPRECIATIONS_REQUEST =
  'employee/hr/FETCH_APPRECIATIONS_REQUEST';
export const FETCH_APPRECIATIONS_SUCCESS =
  'employee/hr/FETCH_APPRECIATIONS_SUCCESS';
export const FETCH_APPRECIATIONS_FAILURE =
  'employee/hr/FETCH_APPRECIATIONS_FAILURE';

export const FETCH_HOLIDAYS_REQUEST = 'employee/hr/FETCH_HOLIDAYS_REQUEST';
export const FETCH_HOLIDAYS_SUCCESS = 'employee/hr/FETCH_HOLIDAYS_SUCCESS';
export const FETCH_HOLIDAYS_FAILURE = 'employee/hr/FETCH_HOLIDAYS_FAILURE';

export const fetchMyLeaves = () => ({ type: FETCH_MY_LEAVES_REQUEST });

/**
 * payload: { leaveData: {...}, documents: DocumentPickerFile[] }
 * documents is optional
 */
export const applyLeave = payload => ({ type: APPLY_LEAVE_REQUEST, payload });
export const fetchMyAttendance = () => ({ type: FETCH_MY_ATTENDANCE_REQUEST });
export const fetchAppreciations = () => ({ type: FETCH_APPRECIATIONS_REQUEST });

export const fetchHolidays = () => ({ type: FETCH_HOLIDAYS_REQUEST });
