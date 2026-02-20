import * as T from './types';

const initialState = {
  list: [],
  loading: false,
};

export default function reducerPriority(state = initialState, action) {
  switch (action.type) {
    case T.FETCH_REQ:
      return { ...state, loading: true };

    case T.FETCH_OK:
      return { ...state, loading: false, list: action.payload };

    case T.FETCH_ERR:
      return { ...state, loading: false };

    default:
      return state;
  }
}
