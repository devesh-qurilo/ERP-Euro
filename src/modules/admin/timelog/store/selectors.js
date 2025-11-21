// selectors.js
// Keep this file small and defensive (works even if slice missing)

export const selectTimelogState = state => state?.admin?.timelog ?? {};

/**
 * Basic selectors used across components
 */
export const selectTimelogLoading = state =>
  Boolean(selectTimelogState(state).loading);

export const selectTimelogError = state =>
  selectTimelogState(state).error ?? null;

export const selectTimelogDate = state =>
  selectTimelogState(state).date ?? null;

/**
 * The globally selected date (for dashboard-level date control)
 */
export const selectTimelogSelectedDate = state =>
  selectTimelogState(state).selectedDate ?? null;

/**
 * Entries (timeLogs) array
 */
export const selectTimelogEntries = state =>
  selectTimelogState(state).timeLogs ?? [];

/**
 * Summary object (totalMinutes, totalHours, segments, usedPct)
 */
export const selectTimelogSummary = state =>
  selectTimelogState(state).summary ?? {
    date: null,
    totalMinutes: 0,
    totalHours: 0,
    segments: [],
    usedPct: 0,
  };
