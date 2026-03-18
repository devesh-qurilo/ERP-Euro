export const selectPriorities = state => state.admin?.Priority?.list || [];

export const selectPriorityLoading = state =>
  state.admin?.Priority?.loading || false;
