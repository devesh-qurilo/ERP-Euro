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
  addComment,
  updateComment,
  deleteComment,
} from '../../deals/view/store/actions';
import { selectDealComments } from '../../deals/view/store/selectors';

export default function DealCommentsSection({ dealId }) {
  const dispatch = useDispatch();
  const comments = useSelector(selectDealComments);

  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  /* ---------------- ADD COMMENT ---------------- */
  const onAdd = () => {
    if (!text.trim()) {
      Alert.alert('Validation', 'Comment cannot be empty');
      return;
    }

    dispatch(
      addComment(dealId, {
        commentText: text.trim(),
      }),
    );

    setText('');
  };

  /* ---------------- UPDATE COMMENT ---------------- */
  const onUpdate = commentId => {
    if (!editingText.trim()) {
      Alert.alert('Validation', 'Comment cannot be empty');
      return;
    }

    dispatch(
      updateComment(dealId, commentId, {
        commentText: editingText.trim(),
      }),
    );

    setEditingId(null);
    setEditingText('');
  };

  /* ---------------- DELETE COMMENT ---------------- */
  const onDelete = commentId => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteComment(dealId, commentId)),
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        {/* ADD COMMENT */}
        <Text style={styles.sectionTitle}>Add Comment</Text>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write a comment..."
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
          <Text style={styles.primaryText}>Post Comment</Text>
        </TouchableOpacity>

        {/* LIST COMMENTS */}
        <Text style={styles.sectionTitle}>All Comments</Text>

        <FlatList
          data={comments}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => {
            const isEditing = editingId === item.id;

            return (
              <View style={styles.card}>
                <Text style={styles.commentAuthor}>{item.employeeId}</Text>

                {isEditing ? (
                  <>
                    <TextInput
                      value={editingText}
                      onChangeText={setEditingText}
                      style={[styles.input, { marginTop: 6 }]}
                      multiline
                    />

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => onUpdate(item.id)}
                      >
                        <Text style={styles.saveText}>Save</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setEditingId(null);
                          setEditingText('');
                        }}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.commentText}>{item.commentText}</Text>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingId(item.id);
                          setEditingText(item.commentText);
                        }}
                      >
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => onDelete(item.id)}>
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    textAlignVertical: 'top',
  },

  primaryBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

  commentAuthor: {
    fontWeight: '700',
    fontSize: 13,
    color: '#111',
  },

  commentText: {
    marginTop: 6,
    color: '#444',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },

  editText: {
    color: '#3F6AE1',
    fontWeight: '600',
  },

  deleteText: {
    color: '#ef4444',
    fontWeight: '600',
  },

  saveBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },

  cancelText: {
    color: '#777',
    fontWeight: '600',
    marginLeft: 12,
  },
});
