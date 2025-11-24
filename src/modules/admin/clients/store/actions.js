import * as T from './types';
export const list = (filters = {}) => ({
  type: T.LIST_REQUEST,
  payload: { filters },
});
export const create = payload => ({ type: T.CREATE_REQUEST, payload });
export const update = (id, payload) => ({
  type: T.UPDATE_REQUEST,
  payload: { id, ...payload },
});
export const remove = id => ({ type: T.DELETE_REQUEST, payload: { id } });

// existing exports...
// export const list = (filters = {}) => ({
//   type: T.LIST_REQUEST,
//   payload: { filters },
// });
// export const create = payload => ({ type: T.CREATE_REQUEST, payload });
// export const update = (id, payload) => ({
//   type: T.UPDATE_REQUEST,
//   payload: { id, ...payload },
// });
// export const remove = id => ({ type: T.DELETE_REQUEST, payload: { id } });

// --- category actions ---
export const categoryList = () => ({ type: T.CATEGORY_LIST_REQUEST });
export const categoryCreate = payload => ({
  type: T.CATEGORY_CREATE_REQUEST,
  payload,
});
export const categoryDelete = id => ({
  type: T.CATEGORY_DELETE_REQUEST,
  payload: { id },
});

// --- subcategory actions ---
export const subCategoryList = () => ({ type: T.SUBCATEGORY_LIST_REQUEST });
export const subCategoryCreate = payload => ({
  type: T.SUBCATEGORY_CREATE_REQUEST,
  payload,
});
export const subCategoryDelete = id => ({
  type: T.SUBCATEGORY_DELETE_REQUEST,
  payload: { id },
});
