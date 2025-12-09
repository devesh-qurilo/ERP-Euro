// /src/modules/admin/messages/store/sagas.js
import { eventChannel } from 'redux-saga';
import {
  takeLatest,
  call,
  put,
  all,
  select,
  fork,
  take,
  cancel,
  race,
  takeEvery,
} from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T } from './types';
import { AdminchatAPI as chatAPI } from '../../../../services/api'; // adjust path if needed
import socketClient from '../store/socketClient'; // adjust path if needed

/* ---------- Config / constants ---------- */
const AUTH_TOKEN_KEY = 'authToken';
// const SOCKET_URL = 'https://6jnqmj85-80.inc1.devtunnels.ms'; // change if needed
const SOCKET_URL = 'https://erp.skavosystem.com';

/* ---------- auth action names (adjust if your app uses different ones) ---------- */
const AUTH_LOGIN_SUCC = 'AUTH_LOGIN_SUCC';
const AUTH_LOGOUT = 'AUTH_LOGOUT';

/* ---------- selectors ---------- */
const selectAuth = state => state.auth || {};

/* ---------- helper: call API and handle unauthorized uniformly ---------- */
function* safeApiCall(fn, ...args) {
  try {
    const res = yield call(fn, ...args);
    console.log('apiiii', res);
    return res;
  } catch (err) {
    // If the axios interceptor flagged unauthorized, handle centrally
    if (err && err.isUnauthorized) {
      console.warn(
        '[saga] safeApiCall: unauthorized detected, dispatching logout',
      );
      // dispatch logout action so app can navigate to login / clear state
      yield put({ type: AUTH_LOGOUT });
    }
    // Re-throw so calling saga gets the error too
    throw err;
  }
}

/* ---------- REST sagas ---------- */

function* fetchRoomsSaga(action) {
  try {
    const res = yield call(safeApiCall, chatAPI.fetchRooms);
    console.log('deveveveveve', res);
    yield put({ type: T.FETCH_ROOMS_SUCC, payload: res });
  } catch (err) {
    console.error('fetchRoomsSaga error', err);
    yield put({ type: T.FETCH_ROOMS_FAIL, error: err?.message || err });
  }
}

function* fetchHistorySaga(action) {
  const otherId =
    action?.payload?.otherEmployeeId ||
    action?.otherEmployeeId ||
    action?.opts?.otherEmployeeId;

  if (!otherId) {
    yield put({ type: T.FETCH_HISTORY_FAIL, error: 'missing otherEmployeeId' });
    return;
  }

  try {
    const res = yield call(safeApiCall, chatAPI.fetchHistory, otherId);
    console.log('deve hisyyyyyyyyy', res);
    yield put({
      type: T.FETCH_HISTORY_SUCC,
      payload: { otherEmployeeId: otherId, messages: res },
    });
  } catch (err) {
    console.error('fetchHistorySaga error', err);
    yield put({
      type: T.FETCH_HISTORY_FAIL,
      error: err?.message || err,
      meta: { otherEmployeeId: otherId },
    });
  }
}

function* markReadSaga(action) {
  const otherId =
    (action?.payload && action.payload.otherEmployeeId) ||
    action?.otherEmployeeId;
  if (!otherId) {
    yield put({ type: T.MARK_READ_FAIL, error: 'otherEmployeeId required' });
    return;
  }
  try {
    yield call(safeApiCall, chatAPI.markRead, otherId);
    yield put({
      type: T.MARK_READ_SUCC,
      payload: { otherEmployeeId: otherId },
    });
    // refresh rooms to reflect unread counts
    yield put({ type: T.FETCH_ROOMS_REQ });
  } catch (err) {
    console.error('markReadSaga error', err);
    yield put({ type: T.MARK_READ_FAIL, error: err?.message || err });
  }
}

/* ---------- helper: generate chatRoomId like backend ---------- */
function* generateChatRoomIdFromState(otherId) {
  const me = (yield select(selectAuth))?.user?.employeeId || 'ME';
  if (!me || !otherId) return `${me}_${otherId}`;
  return me.localeCompare(otherId) < 0
    ? `${me}_${otherId}`
    : `${otherId}_${me}`;
}

/* ---------- sendMessageSaga: optimistic -> socket -> fallback REST ---------- */
function* sendMessageSaga(action) {
  const payload = action?.payload || action;
  const {
    receiverId,
    content,
    messageType = 'TEXT',
    file,
    clientId,
    chatRoomId: providedChatRoomId,
  } = payload || {};

  if (!receiverId) {
    yield put({ type: T.SEND_MESSAGE_FAIL, error: 'receiverId required' });
    return;
  }

  const optimistic = {
    id: clientId || `temp_${Date.now()}`,
    chatRoomId:
      providedChatRoomId ||
      (yield call(generateChatRoomIdFromState, receiverId)),
    senderId: (yield select(selectAuth))?.user?.employeeId || 'ME',
    receiverId,
    content,
    messageType,
    status: 'SENDING',
    createdAt: new Date().toISOString(),
    temp: true,
    clientId,
  };

  // Optimistic update
  yield put({ type: T.SEND_MESSAGE_OPTIMISTIC, payload: optimistic });

  try {
    // Try socket path first
    if (socketClient && socketClient.connected) {
      try {
        socketClient.sendMessage({
          ...payload,
          clientId,
          chatRoomId: optimistic.chatRoomId,
        });

        // wait for ack (server should emit message-ack with clientId) or timeout
        const { ack } = yield race({
          ack: take(
            a =>
              a.type === T.SEND_MESSAGE_SUCC &&
              a.meta &&
              a.meta.clientId === clientId,
          ),
          timeout: call(delay, 8000),
        });

        if (!ack) {
          // no ack -> fallback to REST to ensure persistence
          const formData = new FormData();
          formData.append('receiverId', receiverId);
          formData.append('content', content || '');
          formData.append('messageType', messageType || 'TEXT');
          if (file) formData.append('file', file);

          const res = yield call(safeApiCall, chatAPI.sendMessage, formData);
          console.log('sendmessagesaga', res);
          yield put({
            type: T.SEND_MESSAGE_SUCC,
            payload: res,
            meta: { clientId },
          });
          yield put({ type: T.FETCH_ROOMS_REQ });
        }
      } catch (sockErr) {
        console.warn('socket send failed, falling back to REST', sockErr);
        // fallback to REST
        const formData = new FormData();
        formData.append('receiverId', receiverId);
        formData.append('content', content || '');
        formData.append('messageType', messageType || 'TEXT');
        if (file) formData.append('file', file);

        const res = yield call(safeApiCall, chatAPI.sendMessage, formData);
        yield put({
          type: T.SEND_MESSAGE_SUCC,
          payload: res,
          meta: { clientId },
        });
        yield put({ type: T.FETCH_ROOMS_REQ });
      }
    } else {
      // socket not connected -> use REST
      const formData = new FormData();
      formData.append('receiverId', receiverId);
      formData.append('content', content || '');
      formData.append('messageType', messageType || 'TEXT');
      if (file) formData.append('file', file);

      const res = yield call(safeApiCall, chatAPI.sendMessage, formData);
      yield put({
        type: T.SEND_MESSAGE_SUCC,
        payload: res,
        meta: { clientId },
      });
      yield put({ type: T.FETCH_ROOMS_REQ });
    }
  } catch (err) {
    console.error('sendMessageSaga error', err);
    yield put({
      type: T.SEND_MESSAGE_FAIL,
      error: err?.message || err,
      meta: { clientId },
    });
  }
}

/* small delay helper */
const delay = ms => new Promise(res => setTimeout(res, ms));

/* ---------- Socket event channel (maps socket events -> redux) ---------- */
function createSocketChannel() {
  return eventChannel(emit => {
    const onConnect = () => emit({ type: 'connected' });
    const onDisconnect = reason =>
      emit({ type: 'disconnected', payload: reason });
    const onMessage = msg => emit({ type: 'message', payload: msg });
    const onTyping = payload => emit({ type: 'typing', payload });
    const onMsgStatus = payload => emit({ type: 'message-status', payload });
    const onOnline = payload => emit({ type: 'online-status', payload });
    const onAck = payload => emit({ type: 'message-ack', payload });

    // Attach handlers (socketClient implements on/off)
    socketClient.on('connect', onConnect);
    socketClient.on('disconnect', onDisconnect);
    socketClient.on('message', onMessage);
    socketClient.on('typing', onTyping);
    socketClient.on('message-status', onMsgStatus);
    socketClient.on('online-status', onOnline);
    socketClient.on('message-ack', onAck);

    // unsubscribe
    const unsubscribe = () => {
      try {
        socketClient.off('connect', onConnect);
        socketClient.off('disconnect', onDisconnect);
        socketClient.off('message', onMessage);
        socketClient.off('typing', onTyping);
        socketClient.off('message-status', onMsgStatus);
        socketClient.off('online-status', onOnline);
        socketClient.off('message-ack', onAck);
      } catch (e) {
        console.warn('Error unsubscribing socket handlers', e);
      }
    };

    return unsubscribe;
  });
}

/* ---------- socket consumer saga ---------- */
function* watchSocketChannel() {
  const chan = yield call(createSocketChannel);
  try {
    while (true) {
      const ev = yield take(chan);
      switch (ev.type) {
        case 'connected':
          yield put({ type: T.WS_CONNECTED });
          break;
        case 'disconnected':
          yield put({ type: T.WS_DISCONNECT });
          break;
        case 'message':
          yield put({
            type: T.WS_MESSAGE_RECEIVED,
            payload: ev.payload,
            msg: ev.payload,
          });
          // refresh rooms for unread counts
          yield put({ type: T.FETCH_ROOMS_REQ });
          break;
        case 'typing':
          yield put({ type: T.WS_TYPING, payload: ev.payload });
          break;
        case 'message-status':
          yield put({ type: T.WS_MSG_STATUS, payload: ev.payload });
          break;
        case 'online-status': {
          const p = ev.payload || {};
          if (!p.timestamp) p.timestamp = new Date().toISOString();
          yield put({ type: T.WS_ONLINE_STATUS, payload: p });
          break;
        }
        case 'message-ack': {
          const ack = ev.payload || {};
          if (ack.clientId && ack.message) {
            yield put({
              type: T.SEND_MESSAGE_SUCC,
              payload: ack.message,
              meta: { clientId: ack.clientId },
            });
            yield put({ type: T.FETCH_ROOMS_REQ });
          } else if (ack.messageId && ack.status) {
            yield put({
              type: T.WS_MSG_STATUS,
              payload: {
                messageId: ack.messageId,
                status: ack.status,
                userId: ack.userId,
              },
            });
          }
          break;
        }
        default:
          break;
      }
    }
  } finally {
    // channel closed
  }
}

/* ---------- socket lifecycle manager (connect/disconnect) ---------- */
function* ensureSocketConnected() {
  try {
    const token = yield call(
      [AsyncStorage, AsyncStorage.getItem],
      AUTH_TOKEN_KEY,
    );
    if (!token) {
      console.warn(
        '[sagas] ensureSocketConnected: no token found, skipping socket connect',
      );
      return null;
    }
    if (!socketClient.connected) {
      console.debug('[sagas] connecting socket with latest token');
      socketClient.connect({ url: SOCKET_URL, token });
    }
    // start watcher
    const watcher = yield fork(watchSocketChannel);
    return watcher;
  } catch (e) {
    console.warn('[sagas] ensureSocketConnected error', e);
    return null;
  }
}

/* ---------- top-level saga to manage socket based on auth events ---------- */
function* authSocketWatcher() {
  let watcherTask = yield call(ensureSocketConnected);

  // Listen for login success to (re)connect and logout to disconnect/cleanup
  while (true) {
    const action = yield take([AUTH_LOGIN_SUCC, AUTH_LOGOUT]);
    if (action.type === AUTH_LOGIN_SUCC) {
      // ensure socket connected with latest token
      if (watcherTask) {
        // cancel previous watcher then reconnect (defensive)
        yield cancel(watcherTask);
      }
      watcherTask = yield call(ensureSocketConnected);
    } else if (action.type === AUTH_LOGOUT) {
      // disconnect socket and cancel watcher
      try {
        socketClient.disconnect();
      } catch (e) {
        /* ignore */
      }
      if (watcherTask) {
        yield cancel(watcherTask);
        watcherTask = null;
      }
      // continue loop and wait for login
    }
  }
}

/* ---------- watchers registration ---------- */
export function* adminMessagesSaga() {
  yield all([
    takeLatest(T.FETCH_ROOMS_REQ, fetchRoomsSaga),
    takeLatest(T.FETCH_HISTORY_REQ, fetchHistorySaga),
    takeLatest(T.SEND_MESSAGE_REQ, sendMessageSaga),
    takeLatest(T.MARK_READ_REQ, markReadSaga),
    // spawn socket lifecycle manager that reacts to auth events
    fork(authSocketWatcher),
  ]);
}

/* ---------- export default (root) ---------- */
export default function* rootSaga() {
  yield fork(adminMessagesSaga);
}
