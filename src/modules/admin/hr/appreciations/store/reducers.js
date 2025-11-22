// src/modules/admin/hr/appreciations/store/reducer.js
import {
  APPREC_SET,
  APPREC_ERROR,
  APPREC_BUSY,
  APPREC_SET_FILTERS,
  APPREC_SET_MODE,
  APPREC_OPEN_MODAL,
  APPREC_CLOSE_MODAL,
  AWARDS_SET,
  AWARD_OPEN_MODAL,
  AWARD_CLOSE_MODAL,
} from './actions';

const initial = {
  list: [],
  loading: false,
  error: null,
  busyIds: [],
  filters: { q: '', employee: 'All', award: 'All', start: '', end: '' },
  mode: 'list',
  modalOpen: false,
  editing: null,

  awards: [],
  awardsLoading: false,
  awardModalOpen: false,
  awardEditing: null,
};

export default function appreciationsReducer(state = initial, action) {
  switch (action.type) {
    case APPREC_SET:
      // saga now dispatches { type: APPREC_SET, items: list }
      return {
        ...state,
        list: action.items ?? [],
        loading: false,
        error: null,
      };
    case APPREC_ERROR:
      return { ...state, loading: false, error: action.error };
    case APPREC_BUSY:
      // saga dispatches { type: APPREC_BUSY, payload: boolean }
      // keep both loading and busyIds compatibility. If caller passes ids, use them.
      if (Array.isArray(action.ids)) {
        return { ...state, busyIds: action.ids };
      }
      return { ...state, loading: !!action.payload };
    case APPREC_SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case APPREC_SET_MODE:
      return { ...state, mode: action.mode };
    case APPREC_OPEN_MODAL:
      return { ...state, modalOpen: true, editing: action.editing || null };
    case APPREC_CLOSE_MODAL:
      return { ...state, modalOpen: false, editing: null };

    case AWARDS_SET:
      return { ...state, awards: action.items ?? [], awardsLoading: false };
    case AWARD_OPEN_MODAL:
      return {
        ...state,
        awardModalOpen: true,
        awardEditing: action.editing || null,
      };
    case AWARD_CLOSE_MODAL:
      return { ...state, awardModalOpen: false, awardEditing: null };
    default:
      return state;
  }
}
