const sel = s => s.admin?.dealsKanban || {};
export const selectKanbanBusy = s => !!sel(s).busy;
export const selectKanbanStages = s => sel(s).stages || [];
export const selectKanbanColumns = s => sel(s).columns || {};
