import * as T from './types';
const initial = {
  items: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  filters: {},

  /* category state */
  categories: [],
  categoriesLoading: false,
  categorySaving: false,

  /* subcategory state */
  subCategories: [],
  subCategoriesLoading: false,
  subCategorySaving: false,
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case T.LIST_REQUEST:
      return {
        ...state,
        loading: true,
        filters: action.payload?.filters || state.filters,
        error: null,
      };
    case T.LIST_SUCCESS:
      return { ...state, loading: false, items: action.payload || [] };
    case T.LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case T.CREATE_REQUEST:
    case T.UPDATE_REQUEST:
      return { ...state, saving: true, error: null };
    case T.CREATE_SUCCESS:
    case T.UPDATE_SUCCESS:
      return { ...state, saving: false };
    case T.CREATE_FAILURE:
    case T.UPDATE_FAILURE:
      return { ...state, saving: false, error: action.payload };

    case T.DELETE_REQUEST:
      return { ...state, deleting: true, error: null };
    case T.DELETE_SUCCESS:
      return { ...state, deleting: false };
    case T.DELETE_FAILURE:
      return { ...state, deleting: false, error: action.payload };

    /* category reducers */
    case T.CATEGORY_LIST_REQUEST:
      return { ...state, categoriesLoading: true };
    case T.CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categoriesLoading: false,
        categories: action.payload || [],
      };
    case T.CATEGORY_LIST_FAILURE:
      return { ...state, categoriesLoading: false };

    case T.CATEGORY_CREATE_REQUEST:
      return { ...state, categorySaving: true };
    case T.CATEGORY_CREATE_SUCCESS:
      return { ...state, categorySaving: false };
    case T.CATEGORY_CREATE_FAILURE:
      return { ...state, categorySaving: false };

    case T.CATEGORY_DELETE_REQUEST:
      return { ...state, categorySaving: true };
    case T.CATEGORY_DELETE_SUCCESS:
      return { ...state, categorySaving: false };
    case T.CATEGORY_DELETE_FAILURE:
      return { ...state, categorySaving: false };

    /* subcategory reducers */
    case T.SUBCATEGORY_LIST_REQUEST:
      return { ...state, subCategoriesLoading: true };
    case T.SUBCATEGORY_LIST_SUCCESS:
      return {
        ...state,
        subCategoriesLoading: false,
        subCategories: action.payload || [],
      };
    case T.SUBCATEGORY_LIST_FAILURE:
      return { ...state, subCategoriesLoading: false };

    case T.SUBCATEGORY_CREATE_REQUEST:
      return { ...state, subCategorySaving: true };
    case T.SUBCATEGORY_CREATE_SUCCESS:
      return { ...state, subCategorySaving: false };
    case T.SUBCATEGORY_CREATE_FAILURE:
      return { ...state, subCategorySaving: false };

    case T.SUBCATEGORY_DELETE_REQUEST:
      return { ...state, subCategorySaving: true };
    case T.SUBCATEGORY_DELETE_SUCCESS:
      return { ...state, subCategorySaving: false };
    case T.SUBCATEGORY_DELETE_FAILURE:
      return { ...state, subCategorySaving: false };

    default:
      return state;
  }
}
