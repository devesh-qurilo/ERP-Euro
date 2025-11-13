// src/modules/admin/leads/notes/store/selectors.js

const base = s => s.admin?.leadNotes || {};

export const selectLeadNotesLeadId = s => base(s).leadId;

export const selectLeadNotesList = (s, leadId) => {
  const slice = base(s);
  if (!slice.leadId || String(slice.leadId) !== String(leadId)) return [];
  return slice.list || [];
};

export const selectLeadNotesLoading = (s, leadId) => {
  const slice = base(s);
  if (!slice.leadId || String(slice.leadId) !== String(leadId)) return false;
  return !!slice.loading;
};

export const selectLeadNotesError = (s, leadId) => {
  const slice = base(s);
  if (!slice.leadId || String(slice.leadId) !== String(leadId)) return null;
  return slice.error || null;
};

export const selectLeadNotesCreating = s => !!base(s).creating;
export const selectLeadNotesBusyIds = s => base(s).busyIds || {};
