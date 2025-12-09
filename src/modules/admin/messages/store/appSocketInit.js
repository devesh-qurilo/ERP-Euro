// /src/services/appSocketInit.js
import stompSocket from './socketStomp';
import store from '../store'; // default redux store
import {
  wsConnected,
  wsDisconnect,
  wsMessageReceived,
  wsTyping,
  wsMsgStatus,
  wsOnlineStatus,
  setLocalPresence,
} from '../modules/admin/messages/store/actions';

// subscribeDestinations - adjust to server topics you use
const DESTINATIONS = {
  USER_QUEUE_MESSAGES: '/user/queue/messages',
  USER_QUEUE_TYPING: '/user/queue/typing',
  USER_QUEUE_MSG_STATUS: '/user/queue/message-status',
  TOPIC_ONLINE: '/topic/online-status',
  // If server uses different destinations, update accordingly
};

let subscriptions = [];

export function startSocketWithPresence(token, serverUrl) {
  // connect
  stompSocket.connect({ token, url: serverUrl });

  // handlers
  const onConnect = frame => {
    store.dispatch(wsConnected());

    // set local presence in store
    const me = store.getState()?.auth?.user?.employeeId || null;
    if (me) {
      const now = new Date().toISOString();
      store.dispatch(
        setLocalPresence({ employeeId: me, online: true, lastActive: now }),
      );
      // optionally notify server via app destination if server supports
      try {
        stompSocket.send('/app/chat.online', { online: true });
      } catch (e) {}
    }

    // subscribe to user-specific endpoints
    try {
      subscriptions.push(
        stompSocket.subscribe(DESTINATIONS.USER_QUEUE_MESSAGES, msg => {
          // msg.body expected to be ChatMessageResponse JSON
          store.dispatch(
            wsMessageReceived({
              msg: msg.body,
              otherEmployeeId: deriveOther(msg.body),
            }),
          );
        }),
      );

      subscriptions.push(
        stompSocket.subscribe(DESTINATIONS.USER_QUEUE_TYPING, msg => {
          store.dispatch(wsTyping(msg.body));
        }),
      );

      subscriptions.push(
        stompSocket.subscribe(DESTINATIONS.USER_QUEUE_MSG_STATUS, msg => {
          store.dispatch(wsMsgStatus(msg.body));
        }),
      );

      subscriptions.push(
        stompSocket.subscribe(DESTINATIONS.TOPIC_ONLINE, msg => {
          const payload = msg.body;
          if (!payload.timestamp) payload.timestamp = new Date().toISOString();
          store.dispatch(wsOnlineStatus(payload));
        }),
      );
    } catch (e) {
      console.warn('Failed to subscribe to STOMP destinations', e);
    }
  };

  const onDisconnect = evt => {
    store.dispatch(wsDisconnect());
  };

  stompSocket.on('connect', onConnect);
  stompSocket.on('disconnect', onDisconnect);
  stompSocket.on('stompError', frame => console.error('STOMP Error', frame));

  // return something for debug
  return stompSocket;
}

export function stopSocket() {
  // unsubscribe
  try {
    subscriptions.forEach(s => {
      try {
        s.unsubscribe();
      } catch (e) {}
    });
    subscriptions = [];
  } catch (e) {}
  try {
    stompSocket.disconnect();
  } catch (e) {}
}

/**
 * Quick helper: given chat message, return otherEmployeeId relative to our user.
 * Make it robust.
 */
function deriveOther(msg = {}) {
  const me = store.getState()?.auth?.user?.employeeId || null;
  if (!msg) return null;
  if (me) {
    return String(msg.senderId) === String(me) ? msg.receiverId : msg.senderId;
  }
  if (msg.chatRoomId && msg.chatRoomId.includes('_')) {
    const parts = msg.chatRoomId.split('_');
    return parts[0] === parts[1] ? parts[0] : parts[0];
  }
  return msg.senderId || msg.receiverId || null;
}
