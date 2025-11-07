import * as T from './types';

export const list = (payload = {}) => ({ type: T.LIST_REQUEST, payload });
export const setFilters = filters => ({
  type: T.SET_FILTERS,
  payload: filters,
});
export const setPage = page => ({ type: T.SET_PAGE, payload: page });
export const setSize = size => ({ type: T.SET_SIZE, payload: size });

export const getOne = invoiceNumber => ({
  type: T.GET_ONE_REQUEST,
  payload: { invoiceNumber },
});
export const create = data => ({ type: T.CREATE_REQUEST, payload: data });
export const update = (invoiceNumber, data) => ({
  type: T.UPDATE_REQUEST,
  payload: { invoiceNumber, data },
});

export const uploadFile = (invoiceNumber, file) => ({
  type: T.UPLOAD_FILE_REQUEST,
  payload: { invoiceNumber, file },
});
export const deleteFile = (invoiceNumber, fileUrl) => ({
  type: T.DELETE_FILE_REQUEST,
  payload: { invoiceNumber, fileUrl },
});

export const sendReminder = invoiceNumber => ({
  type: T.REMINDER_REQUEST,
  payload: { invoiceNumber },
});
export const markPaid = invoiceId => ({
  type: T.MARK_PAID_REQUEST,
  payload: { invoiceId },
});

export const addReceipt = data => ({
  type: T.ADD_RECEIPT_REQUEST,
  payload: data,
});
export const listReceipts = invoiceId => ({
  type: T.LIST_RECEIPTS_REQUEST,
  payload: { invoiceId },
});

export const addPayment = ({ payment, file }) => ({
  type: T.ADD_PAYMENT_REQUEST,
  payload: { payment, file },
});
export const listPayments = invoiceNumber => ({
  type: T.LIST_PAYMENTS_REQUEST,
  payload: { invoiceNumber },
});

export const deleteInvoice = invoiceNumber => ({
  type: T.DELETE_REQUEST,
  payload: { invoiceNumber },
});

export const deleteReceipt = (createdId, invoiceId) => ({
  type: T.RECEIPT_DELETE_REQUEST,
  payload: { createdId, invoiceId }, // invoiceId so we can refresh list
});

export const downloadReceipt = createdId => ({
  type: T.RECEIPT_DOWNLOAD_REQUEST,
  payload: { createdId },
});

// export const listPayments = (invoiceNumber) => ({ type: T.LIST_PAYMENTS_REQUEST, payload: { invoiceNumber } });

export const editPayment = (paymentId, payload, invoiceNumber) => ({
  type: T.EDIT_PAYMENT_REQUEST,
  payload: { paymentId, payload, invoiceNumber },
});

export const deletePayment = (paymentId, invoiceNumber) => ({
  type: T.DELETE_PAYMENT_REQUEST,
  payload: { paymentId, invoiceNumber },
});
