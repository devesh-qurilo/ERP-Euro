// /src/modules/admin/messages/store/reducers.js
import { T } from './types';

const initial = {
  connected: false,
  rooms: [],
  roomsLoading: false,
  history: {}, // { [otherEmployeeId]: { loading, items: [] } }
  sending: false,
  typing: {}, // { [employeeId]: boolean }
  online: {}, // legacy quick flag
  presence: {}, // NEW: { [employeeId]: { online: bool, lastActive: ISOString } }
  activeRoomId: null,
};

export default function messagesReducer(state = initial, action) {
  switch (action.type) {
    case T.WS_CONNECTED:
      return { ...state, connected: true };

    case T.WS_DISCONNECT:
      return { ...state, connected: false };

    case T.FETCH_ROOMS_REQ:
      return { ...state, roomsLoading: true };
    case T.FETCH_ROOMS_SUCC:
      return { ...state, roomsLoading: false, rooms: action.payload || [] };
    case T.FETCH_ROOMS_FAIL:
      return { ...state, roomsLoading: false };

    case T.FETCH_HISTORY_REQ: {
      const key = action.payload?.otherEmployeeId || action.otherEmployeeId;
      return {
        ...state,
        history: {
          ...state.history,
          [key]: { ...(state.history[key] || {}), loading: true },
        },
      };
    }
    case T.FETCH_HISTORY_SUCC: {
      const { otherEmployeeId, messages } = action.payload || {};
      const key = otherEmployeeId;
      return {
        ...state,
        history: {
          ...state.history,
          [key]: { loading: false, items: messages || [] },
        },
      };
    }
    case T.FETCH_HISTORY_FAIL: {
      const key =
        action.meta?.otherEmployeeId || action.payload?.otherEmployeeId;
      return {
        ...state,
        history: {
          ...state.history,
          [key]: { ...(state.history[key] || {}), loading: false },
        },
      };
    }

    case T.SEND_MESSAGE_REQ:
      return { ...state, sending: true };

    case T.SEND_MESSAGE_OPTIMISTIC: {
      const msg = action.payload;
      // add optimistic msg to history for receiver and sender
      const updateHistory = (h, key) => {
        const prev = (h[key] && h[key].items) || [];
        return { ...h, [key]: { loading: false, items: [...prev, msg] } };
      };
      const h1 = updateHistory(state.history, msg.receiverId);
      const h2 = updateHistory(h1, msg.senderId);
      // update rooms: set lastMessage/updatedAt
      const rooms = (state.rooms || []).map(r => {
        if (
          (r.participant1Id === msg.senderId &&
            r.participant2Id === msg.receiverId) ||
          (r.participant1Id === msg.receiverId &&
            r.participant2Id === msg.senderId)
        ) {
          return { ...r, lastMessage: msg, updatedAt: msg.createdAt };
        }
        return r;
      });
      return { ...state, sending: true, history: h2, rooms };
    }

    case T.SEND_MESSAGE_SUCC: {
      const msg = action.payload;
      // replace optimistic with real message in histories
      const histories = { ...(state.history || {}) };
      Object.keys(histories).forEach(key => {
        histories[key] = {
          ...histories[key],
          items: (histories[key].items || []).map(m =>
            (m.clientId &&
              action.meta?.clientId &&
              m.clientId === action.meta.clientId) ||
            m.id === msg.id
              ? msg
              : m,
          ),
        };
      });
      // update rooms list
      const rooms = (state.rooms || []).map(r => {
        if (
          (r.participant1Id === msg.senderId &&
            r.participant2Id === msg.receiverId) ||
          (r.participant1Id === msg.receiverId &&
            r.participant2Id === msg.senderId)
        ) {
          return { ...r, lastMessage: msg, updatedAt: msg.createdAt };
        }
        return r;
      });
      return { ...state, sending: false, history: histories, rooms };
    }

    case T.SEND_MESSAGE_FAIL:
      return { ...state, sending: false };

    case T.WS_MESSAGE_RECEIVED: {
      const msg = action.payload || action.msg;
      const h = { ...(state.history || {}) };
      const key = msg.senderId; // store per-other user keyed by sender for convenience
      const prev = (h[key] && h[key].items) || [];
      h[key] = { loading: false, items: [...prev, msg] };

      // upsert room
      const existing = (state.rooms || []).slice();
      const roomIndex = existing.findIndex(r => r.id === msg.chatRoomId);
      const roomObj = {
        id: msg.chatRoomId,
        participant1Id: msg.participant1Id || msg.senderId,
        participant2Id: msg.participant2Id || msg.receiverId,
        participant1Details: msg.senderDetails,
        participant2Details: msg.receiverDetails,
        lastMessage: msg,
        updatedAt: msg.createdAt,
        unreadCount:
          existing[roomIndex] && existing[roomIndex].unreadCount
            ? existing[roomIndex].unreadCount + (msg.receiverId ? 1 : 1)
            : 1,
      };
      if (roomIndex >= 0)
        existing[roomIndex] = { ...existing[roomIndex], ...roomObj };
      else existing.unshift(roomObj);

      return { ...state, history: h, rooms: existing };
    }

    case T.WS_TYPING:
      return {
        ...state,
        typing: {
          ...(state.typing || {}),
          [action.payload.senderId]: !!action.payload.typing,
        },
      };

    case T.WS_MSG_STATUS: {
      const msgId = action.payload?.messageId;
      const status = action.payload?.status;
      const histories = { ...state.history };
      Object.keys(histories).forEach(key => {
        histories[key] = {
          ...histories[key],
          items: (histories[key].items || []).map(m =>
            m.id === msgId ? { ...m, status } : m,
          ),
        };
      });
      return { ...state, history: histories };
    }

    case T.WS_ONLINE_STATUS: {
      // payload: { employeeId, online, timestamp? }
      const { employeeId, online, timestamp } = action.payload || {};
      const now = timestamp || new Date().toISOString();
      return {
        ...state,
        online: {
          ...(state.online || {}),
          [employeeId]: !!online,
        },
        presence: {
          ...(state.presence || {}),
          [employeeId]: { online: !!online, lastActive: now },
        },
      };
    }

    case T.SET_LOCAL_PRESENCE: {
      const { employeeId, online, lastActive } = action.payload || {};
      const now = lastActive || new Date().toISOString();
      return {
        ...state,
        online: { ...(state.online || {}), [employeeId]: !!online },
        presence: {
          ...(state.presence || {}),
          [employeeId]: { online: !!online, lastActive: now },
        },
      };
    }

    case T.MARK_READ_SUCC: {
      const other = action.payload?.otherEmployeeId || action.otherEmployeeId;
      const rooms2 = (state.rooms || []).map(r => {
        const p1 = r.participant1Id;
        const p2 = r.participant2Id;
        if (p1 === other || p2 === other) {
          return { ...r, unreadCount: 0 };
        }
        return r;
      });
      return { ...state, rooms: rooms2 };
    }

    case T.SET_ACTIVE_ROOM: {
      return { ...state, activeRoomId: action.payload?.roomId || null };
    }

    default:
      return state;
  }
}
