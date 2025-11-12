export const selectProjectActivity = s =>
  s?.admin?.projectViewActivity?.items || [];

export const selectProjectActivityBusy = s =>
  !!s?.admin?.projectViewActivity?.loading;

export const selectProjectActivityError = s =>
  s?.admin?.projectViewActivity?.error;
