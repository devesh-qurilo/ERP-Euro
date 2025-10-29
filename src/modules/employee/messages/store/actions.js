import * as T from './types';

// Rooms
export const fetchChatRooms = () => ({ type: T.FETCH_CHAT_ROOMS_REQUEST });

// History
export const fetchChatHistory = peerId => ({
  type: T.FETCH_CHAT_HISTORY_REQUEST,
  peerId,
});

// Send
export const sendChatMessage = ({
  receiverId,
  content,
  messageType = 'TEXT',
}) => ({
  type: T.SEND_CHAT_MESSAGE_REQUEST,
  payload: { receiverId, content, messageType },
});

// Active peer
export const setActivePeer = peerId => ({ type: T.SET_ACTIVE_PEER, peerId });

// Pseudo-WS lifecycle (safe even without a real socket)
export const connectChatWS = () => ({ type: T.CONNECT_CHAT_WS });
export const disconnectChatWS = () => ({ type: T.DISCONNECT_CHAT_WS });
