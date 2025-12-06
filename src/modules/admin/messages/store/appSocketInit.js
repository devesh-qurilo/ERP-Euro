// /src/services/appSocketInit.js
import socketClient from './socketClient';
import store from '../store'; // adjust path to your redux store
import {
  wsConnected,
  wsDisconnect,
  wsMessageReceived,
  wsTyping,
  wsMsgStatus,
  wsOnlineStatus,
  setLocalPresence,
} from '../modules/admin/messages/store/actions';

// call this once after user logs in (pass JWT token)
export function startSocketWithPresence(token, serverUrl) {
  const url = 'https://6jnqmj85-80.inc1.devtunnels.ms'; // change to your server URL
  const socket = socketClient.connect({ url, token });

  socket.on('connected', () => {
    store.dispatch(wsConnected());

    // mark local user present
    const me = store.getState().auth?.user?.employeeId || null;
    if (me) {
      const now = new Date().toISOString();
      store.dispatch(
        setLocalPresence({ employeeId: me, online: true, lastActive: now }),
      );
      // emit to server so others can see (if server supports forwarding)
      socketClient.sendOnlineStatus({ online: true, timestamp: now });
    }
  });

  socket.on('disconnected', reason => {
    store.dispatch(wsDisconnect());
    const me = store.getState().auth?.user?.employeeId || null;
    if (me) {
      const now = new Date().toISOString();
      store.dispatch(
        setLocalPresence({ employeeId: me, online: false, lastActive: now }),
      );
    }
  });

  socket.on('message', msg => {
    store.dispatch(wsMessageReceived(msg));
  });

  socket.on('typing', payload => {
    // payload: { senderId, typing }
    store.dispatch(wsTyping(payload));
  });

  socket.on('message-status', payload => {
    store.dispatch(wsMsgStatus(payload));
  });

  socket.on('online-status', payload => {
    // payload: { employeeId, online, timestamp? }
    // ensure timestamp exists
    const p = payload || {};
    if (!p.timestamp) p.timestamp = new Date().toISOString();
    store.dispatch(wsOnlineStatus(p));
  });

  socket.on('message-ack', payload => {
    // payload: { clientId, message } — map to SEND_MESSAGE_SUCC if needed
    if (payload?.clientId && payload?.message) {
      store.dispatch({
        type: 'admin/messages/SEND_MESSAGE_SUCC',
        payload: payload.message,
        meta: { clientId: payload.clientId },
      });
    }
  });
}

// call this on logout
export function stopSocket() {
  socketClient.disconnect();
}
