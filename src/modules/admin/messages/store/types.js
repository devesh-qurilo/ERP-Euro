// /src/modules/admin/messages/store/types.js
export const T = {
  // Rooms (list)
  FETCH_ROOMS_REQ: 'admin/messages/FETCH_ROOMS_REQ',
  FETCH_ROOMS_SUCC: 'admin/messages/FETCH_ROOMS_SUCC',
  FETCH_ROOMS_FAIL: 'admin/messages/FETCH_ROOMS_FAIL',

  // History (per-other user)
  FETCH_HISTORY_REQ: 'admin/messages/FETCH_HISTORY_REQ',
  FETCH_HISTORY_SUCC: 'admin/messages/FETCH_HISTORY_SUCC',
  FETCH_HISTORY_FAIL: 'admin/messages/FETCH_HISTORY_FAIL',

  // Send message
  SEND_MESSAGE_REQ: 'admin/messages/SEND_MESSAGE_REQ',
  SEND_MESSAGE_OPTIMISTIC: 'admin/messages/SEND_MESSAGE_OPTIMISTIC',
  SEND_MESSAGE_SUCC: 'admin/messages/SEND_MESSAGE_SUCC',
  SEND_MESSAGE_FAIL: 'admin/messages/SEND_MESSAGE_FAIL',

  // Mark read
  MARK_READ_REQ: 'admin/messages/MARK_READ_REQ',
  MARK_READ_SUCC: 'admin/messages/MARK_READ_SUCC',
  MARK_READ_FAIL: 'admin/messages/MARK_READ_FAIL',

  // UI
  SET_ACTIVE_ROOM: 'admin/messages/SET_ACTIVE_ROOM',

  // WebSocket related
  WS_CONNECT: 'admin/messages/WS_CONNECT',
  WS_DISCONNECT: 'admin/messages/WS_DISCONNECT',
  WS_CONNECTED: 'admin/messages/WS_CONNECTED',
  WS_MESSAGE_RECEIVED: 'admin/messages/WS_MESSAGE_RECEIVED',
  WS_TYPING: 'admin/messages/WS_TYPING',
  WS_MSG_STATUS: 'admin/messages/WS_MSG_STATUS',
  WS_ONLINE_STATUS: 'admin/messages/WS_ONLINE_STATUS',

  // Local presence
  SET_LOCAL_PRESENCE: 'admin/messages/SET_LOCAL_PRESENCE',
};
