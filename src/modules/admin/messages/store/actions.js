// /src/modules/admin/messages/store/actions.js
import { T } from './types';

// Rooms
export const fetchAdminRooms = (opts = {}) => ({
  type: T.FETCH_ROOMS_REQ,
  payload: opts,
});
export const fetchAdminRoomsSucc = rooms => ({
  type: T.FETCH_ROOMS_SUCC,
  payload: rooms,
});
export const fetchAdminRoomsFail = err => ({
  type: T.FETCH_ROOMS_FAIL,
  error: err,
});

// History
export const fetchAdminHistory = otherEmployeeId => ({
  type: T.FETCH_HISTORY_REQ,
  payload: { otherEmployeeId },
});
export const fetchAdminHistorySucc = (otherEmployeeId, messages) => ({
  type: T.FETCH_HISTORY_SUCC,
  payload: { otherEmployeeId, messages },
});
export const fetchAdminHistoryFail = err => ({
  type: T.FETCH_HISTORY_FAIL,
  error: err,
});

// Send message
export const sendAdminMessage = payload => ({
  type: T.SEND_MESSAGE_REQ,
  payload,
});
export const sendAdminMessageOptimistic = msg => ({
  type: T.SEND_MESSAGE_OPTIMISTIC,
  payload: msg,
});
export const sendAdminMessageSucc = msg => ({
  type: T.SEND_MESSAGE_SUCC,
  payload: msg,
});
export const sendAdminMessageFail = (err, meta = {}) => ({
  type: T.SEND_MESSAGE_FAIL,
  error: err,
  meta,
});

// Mark read
export const markMessagesAsRead = otherEmployeeId => ({
  type: T.MARK_READ_REQ,
  payload: { otherEmployeeId },
});
export const markMessagesAsReadSucc = otherEmployeeId => ({
  type: T.MARK_READ_SUCC,
  payload: { otherEmployeeId },
});
export const markMessagesAsReadFail = err => ({
  type: T.MARK_READ_FAIL,
  error: err,
});

// WebSocket actions
export const wsConnect = (opts = {}) => ({ type: T.WS_CONNECT, payload: opts });
export const wsDisconnect = () => ({ type: T.WS_DISCONNECT });
export const wsConnected = () => ({ type: T.WS_CONNECTED });
export const wsMessageReceived = msg => ({
  type: T.WS_MESSAGE_RECEIVED,
  payload: msg,
});
export const wsTyping = payload => ({ type: T.WS_TYPING, payload });
export const wsMsgStatus = payload => ({ type: T.WS_MSG_STATUS, payload });
export const wsOnlineStatus = payload => ({
  type: T.WS_ONLINE_STATUS,
  payload,
});

// local presence (frontend authoritative)
export const setLocalPresence = ({ employeeId, online, lastActive }) => ({
  type: T.SET_LOCAL_PRESENCE,
  payload: { employeeId, online, lastActive },
});

// UI helper
export const setActiveAdminRoom = roomId => ({
  type: T.SET_ACTIVE_ROOM,
  payload: { roomId },
});
