export const rahul = s => s?.admin?.projectViewNotes;

export const selectProjectNotes = s => s?.admin?.projectViewNotes?.items || [];
export const selectProjectNotesBusy = s =>
  !!s?.admin?.projectViewNotes?.loading;
export const selectProjectNotesError = s => s?.admin?.projectViewNotes?.error;

export const selectProjectNotesCreateOpen = s =>
  !!s?.admin?.projectViewNotes?.createOpen;
export const selectProjectNotesCreateBusy = s =>
  !!s?.admin?.projectViewNotes?.createBusy;
export const selectProjectNotesCreatePreset = s =>
  s?.admin?.projectViewNotes?.createPreset || null;

export const selectProjectNotesBusyIds = s =>
  s?.admin?.projectViewNotes?.busyIds || [];
