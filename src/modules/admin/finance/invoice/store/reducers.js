import * as T from './types';

const initial = {
  list: {
    items: [],
    page: 0,
    size: 200000,
    total: 0,
    loading: false,
    error: null,
    filters: {
      q: '',
      clientId: null,
      status: null,
      dateFrom: null,
      dateTo: null,
    },
  },
  current: { data: null, loading: false, error: null },
  crud: { creating: false, updating: false, deleting: false, error: null },
  files: { working: false, error: null },
  actions: { reminding: false, markingPaid: false, error: null },
  receipts: { items: [], loading: false, error: null },
  payments: {
    items: [],
    loading: false,
    error: null,
    editing: false,
    deleting: false,
  },
  receipts: {
    items: [],
    loading: false,
    error: null,
    deleting: false,
    downloading: false,
  },
  creditNotes: { items: [], loading: false, creating: false, error: null },
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.SET_FILTERS:
      return {
        ...state,
        list: {
          ...state.list,
          filters: { ...state.list.filters, ...action.payload },
        },
      };
    case T.SET_PAGE:
      return { ...state, list: { ...state.list, page: action.payload } };
    case T.SET_SIZE:
      return { ...state, list: { ...state.list, size: action.payload } };

    case T.LIST_REQUEST:
      return { ...state, list: { ...state.list, loading: true, error: null } };
    case T.LIST_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          items: action.payload.items,
          page: action.payload.page,
          size: action.payload.size,
          total: action.payload.total,
        },
      };
    case T.LIST_FAILURE:
      return {
        ...state,
        list: { ...state.list, loading: false, error: action.payload },
      };

    case T.GET_ONE_REQUEST:
      return { ...state, current: { data: null, loading: true, error: null } };
    case T.GET_ONE_SUCCESS:
      return {
        ...state,
        current: { data: action.payload, loading: false, error: null },
      };
    case T.GET_ONE_FAILURE:
      return {
        ...state,
        current: { data: null, loading: false, error: action.payload },
      };

    case T.DELETE_REQUEST:
      return { ...state, crud: { ...state.crud, deleting: true, error: null } };
    case T.DELETE_SUCCESS:
      return { ...state, crud: { ...state.crud, deleting: false } };
    case T.DELETE_FAILURE:
      return {
        ...state,
        crud: { ...state.crud, deleting: false, error: action.payload },
      };

    case T.CREATE_REQUEST:
      return { ...state, crud: { ...state.crud, creating: true, error: null } };
    case T.CREATE_SUCCESS:
      return { ...state, crud: { ...state.crud, creating: false } };
    case T.CREATE_FAILURE:
      return {
        ...state,
        crud: { ...state.crud, creating: false, error: action.payload },
      };

    case T.RECEIPT_DELETE_REQUEST:
      return {
        ...state,
        receipts: { ...state.receipts, deleting: true, error: null },
      };
    case T.RECEIPT_DELETE_SUCCESS:
      return { ...state, receipts: { ...state.receipts, deleting: false } };
    case T.RECEIPT_DELETE_FAILURE:
      return {
        ...state,
        receipts: { ...state.receipts, deleting: false, error: action.payload },
      };

    case T.CREDIT_NOTE_LIST_REQUEST:
      return {
        ...state,
        creditNotes: { ...state.creditNotes, loading: true, error: null },
      };
    case T.CREDIT_NOTE_LIST_SUCCESS:
      return {
        ...state,
        creditNotes: {
          ...state.creditNotes,
          loading: false,
          items: action.payload || [],
        },
      };
    case T.CREDIT_NOTE_LIST_FAILURE:
      return {
        ...state,
        creditNotes: {
          ...state.creditNotes,
          loading: false,
          error: action.payload,
        },
      };

    case T.CREDIT_NOTE_ADD_REQUEST:
      return {
        ...state,
        creditNotes: { ...state.creditNotes, creating: true, error: null },
      };
    case T.CREDIT_NOTE_ADD_SUCCESS:
      return {
        ...state,
        creditNotes: { ...state.creditNotes, creating: false },
      };
    case T.CREDIT_NOTE_ADD_FAILURE:
      return {
        ...state,
        creditNotes: {
          ...state.creditNotes,
          creating: false,
          error: action.payload,
        },
      };

    case T.RECEIPT_DOWNLOAD_REQUEST:
      return {
        ...state,
        receipts: { ...state.receipts, downloading: true, error: null },
      };
    case T.RECEIPT_DOWNLOAD_SUCCESS:
      return { ...state, receipts: { ...state.receipts, downloading: false } };
    case T.RECEIPT_DOWNLOAD_FAILURE:
      return {
        ...state,
        receipts: {
          ...state.receipts,
          downloading: false,
          error: action.payload,
        },
      };

    case T.UPDATE_REQUEST:
      return { ...state, crud: { ...state.crud, updating: true, error: null } };
    case T.UPDATE_SUCCESS:
      return { ...state, crud: { ...state.crud, updating: false } };
    case T.UPDATE_FAILURE:
      return {
        ...state,
        crud: { ...state.crud, updating: false, error: action.payload },
      };

    case T.UPLOAD_FILE_REQUEST:
    case T.DELETE_FILE_REQUEST:
      return {
        ...state,
        files: { ...state.files, working: true, error: null },
      };
    case T.UPLOAD_FILE_SUCCESS:
    case T.DELETE_FILE_SUCCESS:
      return { ...state, files: { ...state.files, working: false } };
    case T.UPLOAD_FILE_FAILURE:
    case T.DELETE_FILE_FAILURE:
      return {
        ...state,
        files: { ...state.files, working: false, error: action.payload },
      };

    case T.REMINDER_REQUEST:
      return {
        ...state,
        actions: { ...state.actions, reminding: true, error: null },
      };
    case T.REMINDER_SUCCESS:
      return { ...state, actions: { ...state.actions, reminding: false } };
    case T.REMINDER_FAILURE:
      return {
        ...state,
        actions: { ...state.actions, reminding: false, error: action.payload },
      };

    case T.LIST_PAYMENTS_REQUEST:
      return {
        ...state,
        payments: { ...state.payments, loading: true, error: null },
      };
    case T.LIST_PAYMENTS_SUCCESS:
      return {
        ...state,
        payments: {
          ...state.payments,
          loading: false,
          items: action.payload || [],
        },
      };
    case T.LIST_PAYMENTS_FAILURE:
      return {
        ...state,
        payments: { ...state.payments, loading: false, error: action.payload },
      };

    case T.EDIT_PAYMENT_REQUEST:
      return {
        ...state,
        payments: { ...state.payments, editing: true, error: null },
      };
    case T.EDIT_PAYMENT_SUCCESS:
      return { ...state, payments: { ...state.payments, editing: false } };
    case T.EDIT_PAYMENT_FAILURE:
      return {
        ...state,
        payments: { ...state.payments, editing: false, error: action.payload },
      };

    case T.DELETE_PAYMENT_REQUEST:
      return {
        ...state,
        payments: { ...state.payments, deleting: true, error: null },
      };
    case T.DELETE_PAYMENT_SUCCESS:
      return { ...state, payments: { ...state.payments, deleting: false } };
    case T.DELETE_PAYMENT_FAILURE:
      return {
        ...state,
        payments: { ...state.payments, deleting: false, error: action.payload },
      };

    case T.MARK_PAID_REQUEST:
      return {
        ...state,
        actions: { ...state.actions, markingPaid: true, error: null },
      };
    case T.MARK_PAID_SUCCESS:
      return { ...state, actions: { ...state.actions, markingPaid: false } };
    case T.MARK_PAID_FAILURE:
      return {
        ...state,
        actions: {
          ...state.actions,
          markingPaid: false,
          error: action.payload,
        },
      };

    case T.LIST_RECEIPTS_REQUEST:
      return {
        ...state,
        receipts: { ...state.receipts, loading: true, error: null },
      };
    case T.LIST_RECEIPTS_SUCCESS:
      return {
        ...state,
        receipts: { items: action.payload, loading: false, error: null },
      };
    case T.LIST_RECEIPTS_FAILURE:
      return {
        ...state,
        receipts: { ...state.receipts, loading: false, error: action.payload },
      };

    case T.LIST_PAYMENTS_REQUEST:
      return {
        ...state,
        payments: { ...state.payments, loading: true, error: null },
      };
    case T.LIST_PAYMENTS_SUCCESS:
      return {
        ...state,
        payments: { items: action.payload, loading: false, error: null },
      };
    case T.LIST_PAYMENTS_FAILURE:
      return {
        ...state,
        payments: { ...state.payments, loading: false, error: action.payload },
      };

    default:
      return state;
  }
}
