const sel = s => s.admin?.dealsView || {};
export const selectDealTabsBusy = s => !!sel(s).busy;
export const selectDealComments = s => sel(s).comments || [];
export const selectDealTags = s => sel(s).tags || [];
export const selectDealDocs = s => sel(s).documents || [];
export const selectDealNotes = s => sel(s).notes || [];
export const selectDealFollowups = s => sel(s).followups || [];
export const selectDealTabsErr = s => sel(s).error;
