import {
  FETCH_NOTIFS_REQUEST,
  FETCH_NOTIFS_SUCCESS,
  FETCH_NOTIFS_FAILURE,
  MARK_READ_REQUEST,
  MARK_READ_SUCCESS,
  MARK_READ_FAILURE,
} from './actions';

const initialState = {
  list: [],
  loading: false,
  error: null,
  marking: {}, // map of id -> boolean (in-flight mark-read)
};

export default function employeeNotificationsReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_NOTIFS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_NOTIFS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case FETCH_NOTIFS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case MARK_READ_REQUEST:
      return { ...state, marking: { ...state.marking, [action.id]: true } };
    case MARK_READ_SUCCESS: {
      const id = action.id;
      const next = state.list.map(n =>
        n.id === id
          ? { ...n, readFlag: true, readAt: new Date().toISOString() }
          : n,
      );
      const { [id]: _, ...rest } = state.marking;
      return { ...state, list: next, marking: rest };
    }
    case MARK_READ_FAILURE: {
      const { [action.id]: _, ...rest } = state.marking;
      return { ...state, marking: rest };
    }

    default:
      return state;
  }
}
