import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { chatAPI } from '../../../../services/api'; // your axios instance

// If you already have chat APIs, use them. Falling back to raw endpoints here.
// const chatAPI = {
//   rooms: () => api.get('/api/chat/rooms').then(r => r.data),
//   history: peerId =>
//     api
//       .get(`/api/chat/history/${encodeURIComponent(peerId)}`)
//       .then(r => r.data),
//   send: async ({ receiverId, content, messageType }) => {
//     const fd = new FormData();
//     fd.append('receiverId', receiverId);
//     fd.append('content', content);
//     fd.append('messageType', messageType || 'TEXT');
//     const r = await api.post('/api/chat/send', fd);
//     return r.data;
//   },
// };

// Rooms
function* fetchRooms() {
  try {
    const data = yield call(chatAPI.listRooms);
    yield put({ type: T.FETCH_CHAT_ROOMS_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_CHAT_ROOMS_FAILURE,
      error: e?.message || 'Failed',
    });
  }
}

// History
function* fetchHistory({ peerId }) {
  try {
    const data = yield call(chatAPI.history, peerId);
    yield put({ type: T.FETCH_CHAT_HISTORY_SUCCESS, peerId, payload: data });
  } catch (e) {
    yield put({
      type: T.FETCH_CHAT_HISTORY_FAILURE,
      peerId,
      error: e?.message || 'Failed',
    });
  }
}

// Send
function* sendMsg({ payload }) {
  try {
    console.log('[CHAT] saga sending ->', payload);
    const data = yield call(chatAPI.send, payload);
    console.log('[CHAT] saga response <-', data);
    yield put({ type: T.SEND_CHAT_MESSAGE_SUCCESS, payload: data });
  } catch (e) {
    // log everything we can
    console.log('[CHAT] saga error !! message:', e?.message);
    console.log('[CHAT] code:', e?.code);
    console.log('[CHAT] response status:', e?.response?.status);
    console.log('[CHAT] response data:', e?.response?.data);
    console.log('[CHAT] request:', !!e?.request, e?.request?.responseURL);
    yield put({
      type: T.SEND_CHAT_MESSAGE_FAILURE,
      error: e?.message || 'Failed to send',
    });
  }
}

// (Optional) WS connect/disconnect can be no-ops for now — just flip flags
function* connectWS() {
  // If you integrate a real socket, do it here and dispatch CHAT_WS_CONNECTED/CHAT_WS_DISCONNECTED accordingly
  yield put({ type: T.CHAT_WS_CONNECTED });
}
function* disconnectWS() {
  // Close socket here if you opened one in connectWS
  yield put({ type: T.CHAT_WS_DISCONNECTED });
}

export function* chatWatcher() {
  yield all([
    takeLatest(T.FETCH_CHAT_ROOMS_REQUEST, fetchRooms),
    takeLatest(T.FETCH_CHAT_HISTORY_REQUEST, fetchHistory),
    takeLatest(T.SEND_CHAT_MESSAGE_REQUEST, sendMsg),
    takeLatest(T.CONNECT_CHAT_WS, connectWS),
    takeLatest(T.DISCONNECT_CHAT_WS, disconnectWS),
  ]);
}
