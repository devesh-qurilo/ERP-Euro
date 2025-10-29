export const selectChatRooms = s => s.employee?.messages?.rooms || [];
export const selectChatRoomsLoading = s => !!s.employee?.messages?.roomsLoading;
export const selectChatRoomsError = s =>
  s.employee?.messages?.roomsError || null;

export const selectActivePeerId = s =>
  s.employee?.messages?.activePeerId || null;

export const selectChatHistory = peerId => s =>
  (peerId && s.employee?.messages?.historyByPeer?.[peerId]) || [];

export const selectChatHistoryLoading = peerId => s =>
  !!(peerId && s.employee?.messages?.historyLoadingByPeer?.[peerId]);

export const selectChatWSConnected = s => !!s.employee?.messages?.wsConnected;
export const selectChatSending = s => !!s.employee?.messages?.sending;
