// /src/modules/admin/messages/store/selectors.js
export const selectMessagesState = s => s.admin?.adminMessages || {};
export const selectAdminRooms = s => selectMessagesState(s).rooms || [];
export const selectAdminRoomsLoading = s =>
  !!selectMessagesState(s).roomsLoading;
export const selectAdminHistory = (s, otherEmployeeId) =>
  selectMessagesState(s).history?.[otherEmployeeId]?.items || [];
export const selectAdminHistoryMeta = (s, otherEmployeeId) =>
  selectMessagesState(s).history?.[otherEmployeeId] || {
    loading: false,
    items: [],
  };
export const selectAdminSending = s => !!selectMessagesState(s).sending;
export const selectTyping = s => selectMessagesState(s).typing || {};
export const selectOnline = s => selectMessagesState(s).online || {};
export const selectPresence = s => selectMessagesState(s).presence || {};
export const selectPresenceFor = (s, employeeId) =>
  (selectMessagesState(s).presence || {})[employeeId] || {
    online: false,
    lastActive: null,
  };
export const selectIsOnline = (s, employeeId) =>
  !!(selectMessagesState(s).presence || {})[employeeId]?.online;
