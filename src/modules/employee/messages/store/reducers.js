import * as T from './types';

const initialState = {
  rooms: [],
  roomsLoading: false,
  roomsError: null,

  // history by peerId
  historyByPeer: {}, // { [peerId]: Message[] }
  historyLoadingByPeer: {}, // { [peerId]: boolean }
  historyErrorByPeer: {}, // { [peerId]: string|null }

  sending: false,
  sendError: null,

  activePeerId: null,

  wsConnected: false,
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    // Rooms
    case T.FETCH_CHAT_ROOMS_REQUEST:
      return { ...state, roomsLoading: true, roomsError: null };
    case T.FETCH_CHAT_ROOMS_SUCCESS:
      return {
        ...state,
        roomsLoading: false,
        rooms: action.payload,
        roomsError: null,
      };
    case T.FETCH_CHAT_ROOMS_FAILURE:
      return { ...state, roomsLoading: false, roomsError: action.error };

    // History
    case T.FETCH_CHAT_HISTORY_REQUEST:
      return {
        ...state,
        historyLoadingByPeer: {
          ...state.historyLoadingByPeer,
          [action.peerId]: true,
        },
        historyErrorByPeer: {
          ...state.historyErrorByPeer,
          [action.peerId]: null,
        },
      };
    case T.FETCH_CHAT_HISTORY_SUCCESS: {
      const { peerId, payload } = action;
      return {
        ...state,
        historyByPeer: { ...state.historyByPeer, [peerId]: payload || [] },
        historyLoadingByPeer: {
          ...state.historyLoadingByPeer,
          [peerId]: false,
        },
      };
    }
    case T.FETCH_CHAT_HISTORY_FAILURE:
      return {
        ...state,
        historyLoadingByPeer: {
          ...state.historyLoadingByPeer,
          [action.peerId]: false,
        },
        historyErrorByPeer: {
          ...state.historyErrorByPeer,
          [action.peerId]: action.error || 'Failed',
        },
      };

    // Send
    case T.SEND_CHAT_MESSAGE_REQUEST:
      return { ...state, sending: true, sendError: null };
    case T.SEND_CHAT_MESSAGE_SUCCESS: {
      const m = action.payload;
      const peerId =
        m?.receiverId === state.activePeerId ||
        m?.senderId === state.activePeerId
          ? state.activePeerId
          : state.activePeerId; // fallback
      const prev = state.historyByPeer[peerId] || [];
      return {
        ...state,
        sending: false,
        historyByPeer: { ...state.historyByPeer, [peerId]: [...prev, m] },
      };
    }
    case T.SEND_CHAT_MESSAGE_FAILURE:
      return {
        ...state,
        sending: false,
        sendError: action.error || 'Failed to send',
      };

    // Active peer
    case T.SET_ACTIVE_PEER:
      return { ...state, activePeerId: action.peerId };

    // Pseudo-WS flags (no-op-safe)
    case T.CONNECT_CHAT_WS:
      return { ...state, wsConnected: true };
    case T.DISCONNECT_CHAT_WS:
      return { ...state, wsConnected: false };
    case T.CHAT_WS_CONNECTED:
      return { ...state, wsConnected: true };
    case T.CHAT_WS_DISCONNECTED:
      return { ...state, wsConnected: false };

    default:
      return state;
  }
}
