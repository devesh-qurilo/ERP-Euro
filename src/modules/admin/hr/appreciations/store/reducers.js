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
      return { ...state, list: action.items, loading: false, error: null };
    case APPREC_ERROR:
      return { ...state, loading: false, error: action.error };
    case APPREC_BUSY:
      return { ...state, busyIds: action.ids };
    case APPREC_SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case APPREC_SET_MODE:
      return { ...state, mode: action.mode };
    case APPREC_OPEN_MODAL:
      return { ...state, modalOpen: true, editing: action.editing || null };
    case APPREC_CLOSE_MODAL:
      return { ...state, modalOpen: false, editing: null };

    case AWARDS_SET:
      return { ...state, awards: action.items, awardsLoading: false };
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
