// src/modules/admin/leads/screens/AdminLeadViewScreen.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { formatDate } from '../../../../utils/helpers';

import { selectAdminLeads } from '../store/selectors';
import {
  selectLeadNotesList,
  selectLeadNotesLoading,
  selectLeadNotesError,
  selectLeadNotesBusyIds,
} from '../notes/store/selectors';
import {
  fetchLeadNotes,
  createLeadNote,
  updateLeadNote,
  deleteLeadNote,
} from '../notes/store/actions';

import LeadDeals from '../components/LeadDeals';

// ----------------- Small UI helpers -----------------
const TabButton = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.tabBtn, active && styles.tabBtnActive]}
  >
    <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>{label}</Text>
  </Pressable>
);

const FieldRow = ({ label, value }) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value ? String(value) : '-'}</Text>
  </View>
);

const TypePills = ({ value, onChange }) => {
  const options = ['PUBLIC', 'PRIVATE'];
  return (
    <View style={styles.pillsRow}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.pillTxt, active && styles.pillTxtActive]}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

// ----------------- Add / Edit Note Modal -----------------
const NoteModal = ({ visible, onClose, onSave, initial }) => {
  const [noteTitle, setNoteTitle] = useState(initial?.noteTitle || '');
  const [noteType, setNoteType] = useState(initial?.noteType || 'PUBLIC');
  const [noteDetails, setNoteDetails] = useState(initial?.noteDetails || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setNoteTitle(initial?.noteTitle || '');
      setNoteType(initial?.noteType || 'PUBLIC');
      setNoteDetails(initial?.noteDetails || '');
    }
  }, [visible, initial]);

  const valid = noteTitle.trim() && noteDetails.trim();

  const handleSubmit = async () => {
    if (!valid || saving) return;
    try {
      setSaving(true);
      await onSave?.({
        noteTitle: noteTitle.trim(),
        noteType,
        noteDetails: noteDetails.trim(),
      });
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!initial?.id;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>
                  {isEdit ? 'Edit Note' : 'Add Note'}
                </Text>

                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.modalLabel}>Title</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={noteTitle}
                    onChangeText={setNoteTitle}
                    placeholder="Profitable Lead"
                  />
                </View>

                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.modalLabel}>Type</Text>
                  <TypePills value={noteType} onChange={setNoteType} />
                </View>

                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.modalLabel}>Details</Text>
                  <TextInput
                    style={[
                      styles.modalInput,
                      { height: 100, textAlignVertical: 'top' },
                    ]}
                    value={noteDetails}
                    onChangeText={setNoteDetails}
                    multiline
                    placeholder="Need to complete at time"
                  />
                </View>

                <View style={styles.modalFooter}>
                  <Pressable
                    style={[styles.modalBtn, styles.modalCancel]}
                    onPress={onClose}
                  >
                    <Text style={styles.modalCancelTxt}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.modalBtn,
                      valid ? styles.modalSave : styles.modalSaveDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!valid || saving}
                  >
                    <Text style={styles.modalSaveTxt}>
                      {saving ? 'Saving…' : isEdit ? 'Update' : 'Save'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ----------------- Main Screen -----------------
export default function AdminLeadViewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { id } = route.params || {}; // leadId from navigation

  const leads = useSelector(selectAdminLeads);
  const lead = useMemo(
    () => (leads || []).find(l => String(l.id) === String(id)),
    [leads, id],
  );

  const [tab, setTab] = useState('profile'); // 'profile' | 'notes' | 'deal'

  // Notes from Redux
  const notes = useSelector(s => selectLeadNotesList(s, id));
  const notesLoading = useSelector(s => selectLeadNotesLoading(s, id));
  const notesError = useSelector(s => selectLeadNotesError(s, id));
  const notesBusyIds = useSelector(selectLeadNotesBusyIds);

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const title = lead?.name || 'Lead Detail';

  // If lead not found
  if (!lead) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundTxt}>Lead not found.</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // ---------- Notes helpers (Redux + Saga) ----------
  const loadNotes = () => {
    if (!lead?.id) return;
    dispatch(fetchLeadNotes(lead.id));
  };

  const handleAddNotePress = () => {
    setEditingNote(null);
    setNoteModalVisible(true);
  };

  const handleEditNotePress = note => {
    setEditingNote(note);
    setNoteModalVisible(true);
  };

  const handleDeleteNotePress = note => {
    Alert.alert('Delete Note', `Delete "${note.noteTitle}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (!lead?.id) return;
          dispatch(deleteLeadNote(lead.id, note.id));
        },
      },
    ]);
  };

  const handleSaveNote = async payload => {
    // payload: { noteTitle, noteType, noteDetails }
    if (!lead?.id) return;

    if (editingNote?.id) {
      // EDIT
      dispatch(updateLeadNote(lead.id, editingNote.id, payload));
    } else {
      // CREATE
      dispatch(createLeadNote(lead.id, payload));
    }
  };

  // Load notes when tab is opened first time / becomes active
  useEffect(() => {
    if (tab === 'notes' && lead?.id) {
      loadNotes();
    }
  }, [tab, lead?.id]);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backPill}>
          <Text style={styles.backArrow}>{'←'}</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subTitle} numberOfLines={1}>
            {lead.companyName || 'No company name'}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton
          label="Profile"
          active={tab === 'profile'}
          onPress={() => setTab('profile')}
        />
        <TabButton
          label="Notes"
          active={tab === 'notes'}
          onPress={() => setTab('notes')}
        />
        <TabButton
          label="Deal"
          active={tab === 'deal'}
          onPress={() => setTab('deal')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <>
            {/* Basic Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Basic Information</Text>
              <FieldRow label="Lead Name" value={lead.name} />
              <FieldRow label="Email" value={lead.email} />
              <FieldRow label="Mobile" value={lead.mobileNumber} />
              <FieldRow label="Client Category" value={lead.clientCategory} />
              <FieldRow label="Lead Source" value={lead.leadSource} />
            </View>

            {/* Owner / Created Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Owner & Created By</Text>
              <FieldRow label="Lead Owner" value={lead.leadOwner} />
              <FieldRow label="Added By" value={lead.addedBy} />
              <FieldRow
                label="Auto Convert To Client"
                value={lead.autoConvertToClient ? 'Yes' : 'No'}
              />
              <FieldRow
                label="Created At"
                value={
                  lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString()
                    : '-'
                }
              />
            </View>

            {/* Company Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Company Information</Text>
              <FieldRow label="Company Name" value={lead.companyName} />
              <FieldRow label="Official Website" value={lead.officialWebsite} />
              <FieldRow label="Office Phone" value={lead.officePhone} />
              <FieldRow label="City" value={lead.city} />
              <FieldRow label="State" value={lead.state} />
              <FieldRow label="Postal Code" value={lead.postalCode} />
              <FieldRow label="Country" value={lead.country} />
              <FieldRow label="Company Address" value={lead.companyAddress} />
            </View>
          </>
        )}

        {tab === 'notes' && (
          <>
            {/* ===== HEADER ===== */}
            <View style={styles.notesHeaderRow}>
              <Text style={styles.cardTitle}>Notes</Text>

              <Pressable style={styles.addNoteBtn} onPress={handleAddNotePress}>
                <Text style={styles.addNoteTxt}>+ Add Note</Text>
              </Pressable>
            </View>

            {/* ===== LOADING ===== */}
            {notesLoading && (
              <View style={styles.notesCenter}>
                <ActivityIndicator />
              </View>
            )}

            {/* ===== ERROR ===== */}
            {notesError && (
              <View style={styles.notesCenter}>
                <Text style={styles.notesErrorTxt}>{notesError}</Text>
              </View>
            )}

            {/* ===== EMPTY STATE ===== */}
            {!notesLoading && !notesError && notes.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No Notes Yet</Text>
                <Text style={styles.emptySub}>
                  Start documenting important updates about this lead.
                </Text>
              </View>
            )}

            {/* ===== NOTES LIST ===== */}
            {!notesLoading &&
              !notesError &&
              notes.map(note => {
                const busy = !!notesBusyIds[note.id];
                const isPublic = note.noteType === 'PUBLIC';

                return (
                  <View key={note.id} style={styles.noteCard}>
                    {/* HEADER */}
                    <View style={styles.noteTopRow}>
                      <View style={styles.noteLeft}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarTxt}>
                            {note.createdBy?.charAt(0) || 'U'}
                          </Text>
                        </View>

                        <View>
                          <Text style={styles.noteTitle}>{note.noteTitle}</Text>
                          <View style={styles.metaRow}>
                            <View
                              style={[
                                styles.typeBadge,
                                {
                                  backgroundColor: isPublic
                                    ? '#e0f2fe'
                                    : '#fef3c7',
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.typeTxt,
                                  {
                                    color: isPublic ? '#0369a1' : '#92400e',
                                  },
                                ]}
                              >
                                {note.noteType}
                              </Text>
                            </View>

                            <Text style={styles.metaTxt}>{note.createdBy}</Text>

                            <Text style={styles.metaTxt}>
                              • {formatDate(note.createdAt)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* ACTIONS */}
                      <View>
                        {busy ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <Pressable
                            style={styles.kebabBtn}
                            onPress={() => handleEditNotePress(note)}
                          >
                            <Text style={styles.kebabTxt}>⋮</Text>
                          </Pressable>
                        )}
                      </View>
                    </View>

                    {/* DETAILS */}
                    <Text style={styles.noteDetails}>{note.noteDetails}</Text>

                    {/* FOOTER ACTIONS */}
                    <View style={styles.noteFooter}>
                      <Pressable onPress={() => handleEditNotePress(note)}>
                        <Text style={styles.footerAction}>Edit</Text>
                      </Pressable>

                      <Pressable onPress={() => handleDeleteNotePress(note)}>
                        <Text
                          style={[styles.footerAction, { color: '#b91c1c' }]}
                        >
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
          </>
        )}

        {tab === 'deal' && (
          <View style={styles.card}>
            {/* <Text style={styles.cardTitle}>Deals</Text> */}

            <LeadDeals leadId={lead?.id} />
          </View>
        )}
      </ScrollView>

      {/* Note Add/Edit Modal */}
      <NoteModal
        visible={noteModalVisible}
        onClose={() => {
          setNoteModalVisible(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        initial={editingNote}
      />
    </View>
  );
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9,
    marginRight: 4,
    width: 120,
  },
  backArrow: {
    fontSize: 20,
    color: '#1d4ed8',
    marginRight: 3,
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  subTitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 6,
    gap: 8,
  },
  tabBtn: {
    width: 118,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  tabBtnActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  tabTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
  },
  tabTxtActive: {
    color: '#ffffff',
  },

  notesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  addNoteBtn: {
    backgroundColor: '#3F6AE1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 3,
    width: 120,
  },

  addNoteTxt: {
    color: '#fff',
    fontWeight: '600',
  },

  notesCenter: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  notesErrorTxt: {
    color: '#b91c1c',
  },

  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  emptySub: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
  },

  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  noteTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  noteLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarTxt: {
    fontWeight: '700',
  },

  noteTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },

  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },

  typeTxt: {
    fontSize: 10,
    fontWeight: '700',
  },

  metaTxt: {
    fontSize: 11,
    color: '#6b7280',
    marginRight: 6,
  },

  noteDetails: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
    color: '#374151',
  },

  noteFooter: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 20,
  },

  footerAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3F6AE1',
  },

  kebabBtn: {
    padding: 6,
  },

  kebabTxt: {
    fontSize: 18,
  },

  content: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },

  fieldRow: {
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: '700',
  },
  fieldValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },

  placeholderTxt: {
    fontSize: 13,
    color: '#6b7280',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  notFoundTxt: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderRadius: 10,
  },
  backTxt: {
    color: '#ffffff',
    fontWeight: '800',
  },

  // Notes
  notesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  addNoteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1d4ed8',
    borderRadius: 999,
  },
  addNoteTxt: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  notesCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  notesErrorTxt: {
    color: '#b91c1c',
    fontSize: 13,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  noteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1d4ed8',
  },
  noteMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  metaTxt: {
    fontSize: 11,
    color: '#6b7280',
  },
  noteDetails: {
    marginTop: 8,
    fontSize: 13,
    color: '#111827',
  },
  noteActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  noteActionTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#eeeaeaff',
    justifyContent: 'center',
    padding: 16,
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalCancel: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  modalCancelTxt: {
    color: '#111827',
    fontWeight: '800',
  },
  modalSave: {
    backgroundColor: '#305ab6',
  },
  modalSaveDisabled: {
    backgroundColor: '#9ca3af',
  },
  modalSaveTxt: {
    color: '#ffffff',
    fontWeight: '800',
  },

  // Type pills
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  pillActive: {
    backgroundColor: '#305ab6',
    borderColor: '#305ab6',
  },
  pillTxt: {
    fontSize: 11,
    color: '#4b5563',
    fontWeight: '700',
  },
  pillTxtActive: {
    color: '#ffffff',
  },
});
