export const selectClients = s => s.admin.clients.items;
export const selectClientsBusy = s => s.admin.clients.loading;
export const selectClientsSave = s => s.admin.clients.saving;

/* new selectors for categories */
export const selectCategories = s => s.admin.clients.categories || [];
export const selectCategoriesBusy = s => s.admin.clients.categoriesLoading;
export const selectCategorySaving = s => s.admin.clients.categorySaving;

export const selectSubCategories = s => s.admin.clients.subCategories || [];
export const selectSubCategoriesBusy = s =>
  s.admin.clients.subCategoriesLoading;
export const selectSubCategorySaving = s => s.admin.clients.subCategorySaving;
