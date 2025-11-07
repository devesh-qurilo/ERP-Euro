import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';
import * as T from './types';
import { adminFinanceInvoicesAPI as API } from '../../../../../services/api';
import { list as listAction } from './actions';

// map server paging shape -> reducer shape
function mapPage(payload) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      page: 0,
      size: payload.length,
      total: payload.length,
    };
  }
  // support Spring-style { content, number, size, totalElements }
  if (payload?.content) {
    return {
      items: payload.content,
      page: payload.number ?? 0,
      size: payload.size ?? 20,
      total: payload.totalElements ?? payload.content.length,
    };
  }
  // support { items, page, size, total }
  return {
    items: payload.items ?? [],
    page: payload.page ?? 0,
    size: payload.size ?? 20,
    total: payload.total ?? 0,
  };
}

const selectListState = s => s.admin.finance.invoice.list;

function* listSaga({ payload }) {
  try {
    const listState = yield select(selectListState);
    const params = {
      page: listState.page,
      size: listState.size,
      ...listState.filters,
      ...(payload || {}),
    };
    const data = yield call(API.list, params);
    console.log('listSaga', data);
    yield put({ type: T.LIST_SUCCESS, payload: mapPage(data) });
  } catch (err) {
    yield put({
      type: T.LIST_FAILURE,
      payload: err?.message || 'Failed to load invoices',
    });
  }
}

function* getOneSaga({ payload: { invoiceNumber } }) {
  try {
    const data = yield call(API.getOne, invoiceNumber);
    console.log('getOneSaga', data);
    yield put({ type: T.GET_ONE_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.GET_ONE_FAILURE,
      payload: e?.message || 'Failed to fetch invoice',
    });
  }
}

function* createSaga({ payload }) {
  try {
    const created = yield call(API.create, payload);
    console.log('create saga', created);
    yield put({ type: T.CREATE_SUCCESS, payload: created });
    // refresh list after create
    yield put(listAction());
  } catch (e) {
    yield put({
      type: T.CREATE_FAILURE,
      payload: e?.message || 'Create failed',
    });
  }
}

function* updateSaga({ payload: { invoiceNumber, data } }) {
  try {
    const updated = yield call(API.update, invoiceNumber, data);
    console.log('updated', updated);
    yield put({ type: T.UPDATE_SUCCESS, payload: updated });
    yield put(listAction());
  } catch (e) {
    yield put({
      type: T.UPDATE_FAILURE,
      payload: e?.message || 'Update failed',
    });
  }
}

function* uploadFileSaga({ payload: { invoiceNumber, file } }) {
  try {
    yield call(API.uploadFile, invoiceNumber, file);
    console.log('upload file');
    yield put({ type: T.UPLOAD_FILE_SUCCESS });
    yield put(getOneSaga({ payload: { invoiceNumber } })); // refresh current if opened
  } catch (e) {
    yield put({
      type: T.UPLOAD_FILE_FAILURE,
      payload: e?.message || 'Upload failed',
    });
  }
}

function* deleteFileSaga({ payload: { invoiceNumber, fileUrl } }) {
  try {
    yield call(API.deleteFile, invoiceNumber, fileUrl);
    console.log('delete file');
    yield put({ type: T.DELETE_FILE_SUCCESS });
    yield put(getOneSaga({ payload: { invoiceNumber } }));
  } catch (e) {
    console.log('dddddelete file');
    yield put({
      type: T.DELETE_FILE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

function* reminderSaga({ payload: { invoiceNumber } }) {
  try {
    yield call(API.sendReminder, invoiceNumber);

    yield put({ type: T.REMINDER_SUCCESS });
  } catch (e) {
    yield put({
      type: T.REMINDER_FAILURE,
      payload: e?.message || 'Reminder failed',
    });
  }
}

// function* markPaidSaga({ payload: { invoiceId } }) {
//   try {
//     yield call(API.markPaid, invoiceId);
//     console.log('invoive number', invoiceId);
//     yield put({ type: T.MARK_PAID_SUCCESS });
//     yield put(listAction());
//   } catch (e) {
//     console.log('dddddinvoive number', invoiceId);
//     yield put({
//       type: T.MARK_PAID_FAILURE,
//       payload: e?.message || 'Mark paid failed',
//     });
//   }
// }

function* addReceiptSaga({ payload }) {
  try {
    yield call(API.addReceipt, payload);
    console.log('add receipt');
    yield put({ type: T.ADD_RECEIPT_SUCCESS });
  } catch (e) {
    yield put({
      type: T.ADD_RECEIPT_FAILURE,
      payload: e?.message || 'Add receipt failed',
    });
  }
}

function* listReceiptsSaga({ payload: { invoiceId } }) {
  try {
    const rows = yield call(API.listReceiptsByInvoiceId, invoiceId);
    console.log('listReceiptsSaga', invoiceId);
    yield put({ type: T.LIST_RECEIPTS_SUCCESS, payload: rows });
  } catch (e) {
    yield put({
      type: T.LIST_RECEIPTS_FAILURE,
      payload: e?.message || 'Load receipts failed',
    });
  }
}

// function* addPaymentSaga({ payload: { payment, file } }) {
//   try {
//     const res = yield call(API.createPayment, { payment, file });
//     console.log('addPaymentSaga', res);
//     yield put({ type: T.ADD_PAYMENT_SUCCESS, payload: res });
//     yield put(listAction());
//   } catch (e) {
//     yield put({
//       type: T.ADD_PAYMENT_FAILURE,
//       payload: e?.message || 'Add payment failed',
//     });
//   }
// }

function* listPaymentsSaga({ payload: { invoiceNumber } }) {
  try {
    const rows = yield call(API.listPaymentsByInvoiceNumber, invoiceNumber);
    console.log('listPaymentsSaga', rows);
    yield put({ type: T.LIST_PAYMENTS_SUCCESS, payload: rows });
  } catch (e) {
    yield put({
      type: T.LIST_PAYMENTS_FAILURE,
      payload: e?.message || 'Load payments failed',
    });
  }
}

function* deleteSaga({ payload: { invoiceNumber } }) {
  try {
    yield call(API.deleteInvoice, invoiceNumber);
    yield put({ type: T.DELETE_SUCCESS });
    yield put(listAction()); // refresh
  } catch (e) {
    yield put({
      type: T.DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

function* markPaidSaga({ payload: { invoiceId } }) {
  try {
    console.log('invoiceNumber ', invoiceId);
    // let invoiceId = invoiceNumber;
    // NOTE: backend expects invoiceId here, not invoiceNumber
    yield call(API.markPaid, invoiceId);
    yield put({ type: T.MARK_PAID_SUCCESS });
    yield put(listAction());
  } catch (e) {
    yield put({
      type: T.MARK_PAID_FAILURE,
      payload: e?.message || 'Mark paid failed',
    });
  }
}

function* addPaymentSaga({ payload: { payment, file } }) {
  try {
    const res = yield call(API.createPayment, { payment, file });
    yield put({ type: T.ADD_PAYMENT_SUCCESS, payload: res });
    yield put(listAction());
  } catch (e) {
    yield put({
      type: T.ADD_PAYMENT_FAILURE,
      payload: e?.message || 'Add payment failed',
    });
  }
}

function arrayBufferToBase64(buf) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return typeof btoa !== 'undefined'
    ? btoa(binary)
    : Buffer.from(binary, 'binary').toString('base64');
}

function* deleteReceiptSaga({ payload: { createdId, invoiceId } }) {
  try {
    yield call(API.deleteReceipt, createdId);
    yield put({ type: T.RECEIPT_DELETE_SUCCESS });
    // refresh current list
    yield put({ type: T.LIST_RECEIPTS_REQUEST, payload: { invoiceId } });
  } catch (e) {
    yield put({
      type: T.RECEIPT_DELETE_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

function* downloadReceiptSaga({ payload: { createdId } }) {
  try {
    const arr = yield call(API.downloadReceiptPdf, createdId); // ArrayBuffer
    // Web: trigger a real download
    if (Platform.OS === 'web') {
      const blob = new Blob([arr], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${createdId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      // Native: open data URL in default viewer (works on most devices)
      const b64 = arrayBufferToBase64(arr);
      const dataUrl = `data:application/pdf;base64,${b64}`;
      yield call(Linking.openURL, dataUrl);
    }
    yield put({ type: T.RECEIPT_DOWNLOAD_SUCCESS });
  } catch (e) {
    yield put({
      type: T.RECEIPT_DOWNLOAD_FAILURE,
      payload: e?.message || 'Download failed',
    });
  }
}

// function* listPaymentsSaga({ payload: { invoiceNumber } }) {
//   try {
//     const data = yield call(API.listPaymentsByInvoice, invoiceNumber); // you already have this in API as /api/payments/invoice/{invoiceNumber}
//     yield put({ type: T.LIST_PAYMENTS_SUCCESS, payload: data });
//   } catch (e) {
//     yield put({
//       type: T.LIST_PAYMENTS_FAILURE,
//       payload: e?.message || 'Load payments failed',
//     });
//   }
// }

function* editPaymentSaga({ payload: { paymentId, payload, invoiceNumber } }) {
  try {
    yield call(API.updatePayment, paymentId, payload);
    yield put({ type: T.EDIT_PAYMENT_SUCCESS });
    yield put({ type: T.LIST_PAYMENTS_REQUEST, payload: { invoiceNumber } });
  } catch (e) {
    yield put({
      type: T.EDIT_PAYMENT_FAILURE,
      payload: e?.message || 'Edit failed',
    });
  }
}

function* deletePaymentSaga({ payload: { paymentId, invoiceNumber } }) {
  try {
    yield call(API.deletePayment, paymentId);
    yield put({ type: T.DELETE_PAYMENT_SUCCESS });
    yield put({ type: T.LIST_PAYMENTS_REQUEST, payload: { invoiceNumber } });
  } catch (e) {
    yield put({
      type: T.DELETE_PAYMENT_FAILURE,
      payload: e?.message || 'Delete failed',
    });
  }
}

function* listCreditNotesSaga({ payload: { invoiceNumber } }) {
  try {
    const data = yield call(API.listCreditNotes, invoiceNumber);
    yield put({ type: T.CREDIT_NOTE_LIST_SUCCESS, payload: data });
  } catch (e) {
    yield put({
      type: T.CREDIT_NOTE_LIST_FAILURE,
      payload: e?.message || 'Load failed',
    });
  }
}

function* addCreditNoteSaga({ payload: { invoiceNumber, creditNote, file } }) {
  try {
    const res = yield call(API.addCreditNote, invoiceNumber, {
      creditNote,
      file,
    });
    yield put({ type: T.CREDIT_NOTE_ADD_SUCCESS, payload: res });
    // refresh credit-notes + invoices list
    yield put({ type: T.CREDIT_NOTE_LIST_REQUEST, payload: { invoiceNumber } });
    yield put({ type: T.LIST_REQUEST }); // refresh invoices table
  } catch (e) {
    yield put({
      type: T.CREDIT_NOTE_ADD_FAILURE,
      payload: e?.message || 'Create failed',
    });
  }
}

export function* adminFinanceInvoiceWatcher() {
  yield all([
    takeLatest(T.LIST_REQUEST, listSaga),
    takeLatest(T.GET_ONE_REQUEST, getOneSaga),
    takeLatest(T.CREATE_REQUEST, createSaga),
    takeLatest(T.UPDATE_REQUEST, updateSaga),
    takeLatest(T.UPLOAD_FILE_REQUEST, uploadFileSaga),
    takeLatest(T.DELETE_FILE_REQUEST, deleteFileSaga),
    takeLatest(T.REMINDER_REQUEST, reminderSaga),
    takeLatest(T.MARK_PAID_REQUEST, markPaidSaga),
    takeLatest(T.ADD_RECEIPT_REQUEST, addReceiptSaga),
    takeLatest(T.LIST_RECEIPTS_REQUEST, listReceiptsSaga),
    takeLatest(T.ADD_PAYMENT_REQUEST, addPaymentSaga),
    takeLatest(T.LIST_PAYMENTS_REQUEST, listPaymentsSaga),

    takeLatest(T.MARK_PAID_REQUEST, markPaidSaga),
    takeLatest(T.ADD_PAYMENT_REQUEST, addPaymentSaga),
    takeLatest(T.DELETE_REQUEST, deleteSaga),

    takeLatest(T.RECEIPT_DELETE_REQUEST, deleteReceiptSaga),
    takeLatest(T.RECEIPT_DOWNLOAD_REQUEST, downloadReceiptSaga),

    takeLatest(T.LIST_PAYMENTS_REQUEST, listPaymentsSaga),
    takeLatest(T.EDIT_PAYMENT_REQUEST, editPaymentSaga),
    takeLatest(T.DELETE_PAYMENT_REQUEST, deletePaymentSaga),

    takeLatest(T.CREDIT_NOTE_LIST_REQUEST, listCreditNotesSaga),
    takeLatest(T.CREDIT_NOTE_ADD_REQUEST, addCreditNoteSaga),
  ]);
}

export default function* sagas() {
  yield fork(adminFinanceInvoiceWatcher);
}
