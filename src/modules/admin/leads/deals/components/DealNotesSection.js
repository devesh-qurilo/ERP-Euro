import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNote,
  updateNote,
  deleteNote,
} from '../../deals/view/store/actions';
import { selectDealNotes } from '../../deals/view/store/selectors';

export default function DealNotesSection({ dealId }) {
  const dispatch = useDispatch();
  const notes = useSelector(selectDealNotes);

  const [editingNote, setEditingNote] = useState(null);

  const [form, setForm] = useState({
    noteTitle: '',
    noteType: 'PUBLIC',
    noteDetails: '',
  });

  /* ================= SAVE (CREATE + UPDATE) ================= */

  const onSave = () => {
    if (!form.noteTitle.trim()) {
      Alert.alert('Validation', 'Note title is required');
      return;
    }

    if (!form.noteDetails.trim()) {
      Alert.alert('Validation', 'Note details are required');
      return;
    }

    const payload = {
      noteTitle: form.noteTitle.trim(),
      noteType: form.noteType,
      noteDetails: form.noteDetails.trim(),
    };

    if (editingNote) {
      dispatch(updateNote(dealId, editingNote.id, payload));
    } else {
      dispatch(addNote(dealId, payload));
    }

    // Reset everything
    setEditingNote(null);
    setForm({
      noteTitle: '',
      noteType: 'PUBLIC',
      noteDetails: '',
    });
  };

  /* ================= EDIT ================= */

  const handleEdit = note => {
    setEditingNote(note);

    setForm({
      noteTitle: note.noteTitle,
      noteType: note.noteType,
      noteDetails: note.noteDetails,
    });
  };

  /* ================= DELETE ================= */

  const handleDelete = noteId => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNote(dealId, noteId)),
      },
    ]);

    if (editingNote?.id === noteId) {
      setEditingNote(null);
      setForm({
        noteTitle: '',
        noteType: 'PUBLIC',
        noteDetails: '',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>
          {editingNote ? 'Update Note' : 'Add Note'}
        </Text>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          value={form.noteTitle}
          onChangeText={v => setForm({ ...form, noteTitle: v })}
          placeholder="Enter note title"
          style={styles.input}
        />

        {/* Visibility Toggle */}
        <Text style={styles.label}>Visibility</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              form.noteType === 'PUBLIC' && styles.toggleActive,
            ]}
            onPress={() => setForm({ ...form, noteType: 'PUBLIC' })}
          >
            <Text
              style={[
                styles.toggleText,
                form.noteType === 'PUBLIC' && styles.toggleTextActive,
              ]}
            >
              PUBLIC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              form.noteType === 'PRIVATE' && styles.toggleActivePrivate,
            ]}
            onPress={() => setForm({ ...form, noteType: 'PRIVATE' })}
          >
            <Text
              style={[
                styles.toggleText,
                form.noteType === 'PRIVATE' && styles.toggleTextActive,
              ]}
            >
              PRIVATE
            </Text>
          </TouchableOpacity>
        </View>

        {/* Details */}
        <Text style={styles.label}>Details</Text>
        <TextInput
          value={form.noteDetails}
          onChangeText={v => setForm({ ...form, noteDetails: v })}
          placeholder="Write detailed note..."
          multiline
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>
            {editingNote ? 'Update Note' : 'Save Note'}
          </Text>
        </TouchableOpacity>

        {/* Existing Notes */}
        <Text style={styles.sectionTitle}>All Notes</Text>

        <FlatList
          data={notes}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{item.noteTitle}</Text>

                <View
                  style={[
                    styles.badge,
                    item.noteType === 'PRIVATE'
                      ? styles.badgePrivate
                      : styles.badgePublic,
                  ]}
                >
                  <Text style={styles.badgeText}>{item.noteType}</Text>
                </View>
              </View>

              <Text style={styles.noteDetails}>{item.noteDetails}</Text>

              {/* ACTION BUTTONS */}
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  label: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#444',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 16,
  },

  editText: {
    color: '#3F6AE1',
    fontWeight: '600',
  },

  deleteText: {
    color: '#ef4444',
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  toggleActive: {
    backgroundColor: '#3F6AE1',
  },

  toggleActivePrivate: {
    backgroundColor: '#ef4444',
  },

  toggleText: {
    fontWeight: '600',
    color: '#555',
  },

  toggleTextActive: {
    color: '#fff',
  },

  saveBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },

  noteCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  noteTitle: {
    fontWeight: '700',
  },

  noteDetails: {
    color: '#555',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  badgePublic: {
    backgroundColor: '#dbeafe',
  },

  badgePrivate: {
    backgroundColor: '#fee2e2',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
