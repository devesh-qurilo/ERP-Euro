/* types */
export const APPREC_FETCH = 'APPREC/FETCH';
export const APPREC_SET = 'APPREC/SET';
export const APPREC_ERROR = 'APPREC/ERROR';
export const APPREC_CREATE = 'APPREC/CREATE';
export const APPREC_UPDATE = 'APPREC/UPDATE';
export const APPREC_DELETE = 'APPREC/DELETE';
export const APPREC_BUSY = 'APPREC/BUSY';

export const AWARDS_FETCH = 'AWARDS/FETCH';
export const AWARDS_SET = 'AWARDS/SET';
export const AWARDS_CREATE = 'AWARDS/CREATE';
export const AWARDS_UPDATE = 'AWARDS/UPDATE';
export const AWARDS_TOGGLE = 'AWARDS/TOGGLE';

export const APPREC_SET_FILTERS = 'APPREC/SET_FILTERS';
export const APPREC_SET_MODE = 'APPREC/SET_MODE';
export const APPREC_OPEN_MODAL = 'APPREC/OPEN_MODAL';
export const APPREC_CLOSE_MODAL = 'APPREC/CLOSE_MODAL';
export const AWARD_OPEN_MODAL = 'AWARD/OPEN_MODAL';
export const AWARD_CLOSE_MODAL = 'AWARD/CLOSE_MODAL';

/* creators */
export const fetchAppreciations = () => ({ type: APPREC_FETCH });
export const createAppreciation = payload => ({ type: APPREC_CREATE, payload });
export const updateAppreciation = (id, payload) => ({
  type: APPREC_UPDATE,
  id,
  payload,
});
export const deleteAppreciation = id => ({ type: APPREC_DELETE, id });

export const fetchAwards = () => ({ type: AWARDS_FETCH });
export const createAward = payload => ({ type: AWARDS_CREATE, payload });
export const updateAward = (id, payload) => ({
  type: AWARDS_UPDATE,
  id,
  payload,
});
export const toggleAward = id => ({ type: AWARDS_TOGGLE, id });

export const setApprecFilters = filters => ({
  type: APPREC_SET_FILTERS,
  filters,
});
export const setApprecMode = mode => ({ type: APPREC_SET_MODE, mode }); // 'list' | 'awards'
export const openApprecModal = (editing = null) => ({
  type: APPREC_OPEN_MODAL,
  editing,
});
export const closeApprecModal = () => ({ type: APPREC_CLOSE_MODAL });
export const openAwardModal = (editing = null) => ({
  type: AWARD_OPEN_MODAL,
  editing,
});
export const closeAwardModal = () => ({ type: AWARD_CLOSE_MODAL });
