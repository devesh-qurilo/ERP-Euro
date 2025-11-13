// src/modules/admin/leads/notes/store/actions.js
import * as T from './types';

// leadId -> current lead

export const fetchLeadNotes = leadId => ({
  type: T.FETCH_LEAD_NOTES_REQUEST,
  leadId,
});

export const createLeadNote = (leadId, payload) => ({
  type: T.CREATE_LEAD_NOTE_REQUEST,
  leadId,
  payload, // { noteTitle, noteType, noteDetails }
});

export const updateLeadNote = (leadId, noteId, payload) => ({
  type: T.UPDATE_LEAD_NOTE_REQUEST,
  leadId,
  noteId,
  payload,
});

export const deleteLeadNote = (leadId, noteId) => ({
  type: T.DELETE_LEAD_NOTE_REQUEST,
  leadId,
  noteId,
});
