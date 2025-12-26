import * as T from './types';

export const fetchHolidays = () => ({ type: T.FETCH_HOLIDAYS_REQUEST });
export const openHolidayModal = () => ({ type: T.OPEN_HOLIDAY_MODAL });
export const closeHolidayModal = () => ({ type: T.CLOSE_HOLIDAY_MODAL });

export const createHolidaysBulk = payload => ({
  type: T.CREATE_HOLIDAYS_REQUEST,
  payload, // { holidays: [...] }
});

export const setHolidayFilters = patch => ({
  type: T.SET_HOLIDAY_FILTERS,
  patch,
});
export const setHolidayMode = mode => ({ type: T.SET_HOLIDAY_MODE, mode });

export const openHolidayEditModal = holiday => ({
  type: T.OPEN_HOLIDAY_EDIT_MODAL,
  payload: holiday,
});

export const updateHoliday = (id, payload) => ({
  type: T.UPDATE_HOLIDAY_REQUEST,
  id,
  payload,
});

export const deleteHoliday = id => ({
  type: T.DELETE_HOLIDAY_REQUEST,
  id,
});
