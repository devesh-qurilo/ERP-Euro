import * as T from './types';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export default function reducerPriority(state = initialState, action) {
  switch (action.type) {
    case T.FETCH_REQ:
    case T.CREATE_REQ:
    case T.UPDATE_REQ:
    case T.DELETE_REQ:
      return { ...state, loading: true };

    case T.FETCH_OK:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };

    case T.CREATE_OK:
      return {
        ...state,
        loading: false,
        // list: [...state.list, action.payload],
      };

    case T.UPDATE_OK:
      return {
        ...state,
        loading: false,
        list: state.list.map(p =>
          p.id === action.payload.id ? action.payload : p,
        ),
      };

    case T.DELETE_OK:
      return {
        ...state,
        loading: false,
        list: state.list.filter(p => p.id !== action.id),
      };

    case T.FETCH_ERR:
    case T.CREATE_ERR:
    case T.UPDATE_ERR:
    case T.DELETE_ERR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case T.ASSIGN_DEAL_PRIORITY_OK:
      return {
        ...state,
        loading: false,
      };

    case T.REMOVE_DEAL_PRIORITY_OK:
      return {
        ...state,
        loading: false,
      };

    case 'kanban/UPDATE_DEAL_PRIORITY':
      return {
        ...state,
        columns: Object.fromEntries(
          Object.entries(state.columns).map(([stage, deals]) => [
            stage,
            deals.map(deal =>
              deal.id === action.dealId
                ? {
                    ...deal,
                    priority: action.priority,
                  }
                : deal,
            ),
          ]),
        ),
      };

    case 'kanban/REMOVE_DEAL_PRIORITY':
      return {
        ...state,
        columns: Object.fromEntries(
          Object.entries(state.columns).map(([stage, deals]) => [
            stage,
            deals.map(deal =>
              deal.id === action.dealId ? { ...deal, priority: null } : deal,
            ),
          ]),
        ),
      };
    default:
      return state;
  }
}
