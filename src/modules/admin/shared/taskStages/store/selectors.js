const base = s => s?.admin?.work?.taskStages || s?.shared?.taskStages;
export const selectStages = s => base(s)?.list || [];
export const selectStagesBusy = s => !!base(s)?.busy;
