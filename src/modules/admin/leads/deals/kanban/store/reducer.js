import * as T from './types';

const initial = {
  busy: false,
  stages: [], // [{ id, name }]
  columns: {}, // map stageName -> [deals]
  error: null,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.SET_BUSY:
      return { ...state, busy: action.busy };

    case T.FETCH_OK:
      return {
        ...state,
        busy: false,
        stages: action.stages || [],
        columns: action.columns || {},
        error: null,
      };

    case T.FETCH_ERR:
      return { ...state, busy: false, error: action.error };

    case T.MOVE_CARD_OK:
      return {
        ...state,
        busy: false,
        columns: action.columns || state.columns,
      };

    case T.MOVE_CARD_ERR:
      return { ...state, busy: false, error: action.error };

    case T.STAGE_CREATE_OK:
    case T.STAGE_UPDATE_OK:
    case T.STAGE_DELETE_OK:
      return { ...state }; // we will refetch on changes

    default:
      return state;
  }
}
