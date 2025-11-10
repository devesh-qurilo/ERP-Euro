const base = s => s.admin?.work?.taskDetail || s.shared?.tasksDetail;

export const selectTaskId = s => base(s)?.taskId || null;
export const selectTab = s => base(s)?.tab || 'files';

export const selectFiles = s => base(s)?.files?.list || [];
export const selectFilesBusy = s => !!base(s)?.files?.busy;

export const selectSubs = s => base(s)?.subs?.list || [];
export const selectSubsBusy = s => !!base(s)?.subs?.busy;

export const selectNotes = s => base(s)?.notes?.list || [];
export const selectNotesBusy = s => !!base(s)?.notes?.busy;
