export const FETCH_NOTIFS_REQUEST =
  'employee/notifications/FETCH_NOTIFS_REQUEST';
export const FETCH_NOTIFS_SUCCESS =
  'employee/notifications/FETCH_NOTIFS_SUCCESS';
export const FETCH_NOTIFS_FAILURE =
  'employee/notifications/FETCH_NOTIFS_FAILURE';

export const MARK_READ_REQUEST = 'employee/notifications/MARK_READ_REQUEST';
export const MARK_READ_SUCCESS = 'employee/notifications/MARK_READ_SUCCESS';
export const MARK_READ_FAILURE = 'employee/notifications/MARK_READ_FAILURE';

export const fetchNotifications = () => ({ type: FETCH_NOTIFS_REQUEST });
export const markNotificationRead = id => ({ type: MARK_READ_REQUEST, id });
