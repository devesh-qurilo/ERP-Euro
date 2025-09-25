export const selectNotifs = s => s.employee?.notifications?.list || [];
export const selectNotifsLoading = s =>
  s.employee?.notifications?.loading || false;
export const selectNotifsError = s => s.employee?.notifications?.error || null;
export const selectMarkingMap = s => s.employee?.notifications?.marking || {};
