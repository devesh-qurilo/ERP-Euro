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
import { addTag, deleteTag } from '../../deals/view/store/actions';
import { selectDealTags } from '../../deals/view/store/selectors';
import { fetchTags } from '../../deals/view/store/actions';

export default function DealTagsSection({ dealId }) {
  const dispatch = useDispatch();
  const tags = useSelector(selectDealTags);

  const [tag, setTag] = useState('');

  /* ---------------- ADD TAG ---------------- */
  const onAdd = () => {
    const clean = tag.trim();

    if (!clean) {
      Alert.alert('Validation', 'Tag cannot be empty');
      return;
    }

    // prevent duplicates
    const exists = (tags || []).some(
      t => (t.tagName || t).toLowerCase() === clean.toLowerCase(),
    );

    if (exists) {
      Alert.alert('Duplicate', 'Tag already exists');
      return;
    }

    dispatch(addTag(dealId, { tagName: clean }));
    setTag('');
  };

  /* ---------------- DELETE TAG ---------------- */
  const onDelete = tagId => {
    Alert.alert('Delete Tag', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteTag(dealId, tagId));
          dispatch(fetchTags(dealId)); // 🔥 REFRESH AFTER DELETE
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Manage Tags</Text>

        {/* ADD INPUT */}
        <View style={styles.inputRow}>
          <TextInput
            value={tag}
            onChangeText={setTag}
            placeholder="Enter new tag"
            style={styles.input}
          />

          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* TAG LIST */}
        {!tags?.length && (
          <Text style={styles.emptyText}>No tags added yet</Text>
        )}

        <FlatList
          data={tags}
          keyExtractor={item => String(item.id || item.tagName || item)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => {
            const tagName = item.tagName || item;
            const tagId = item.id;

            return (
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>{tagName}</Text>
                {tagName && (
                  <TouchableOpacity onPress={() => onDelete(tagId)}>
                    <Text style={styles.deleteText}>×</Text>
                  </TouchableOpacity>
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
    marginBottom: 12,
  },

  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 44,
  },

  addBtn: {
    backgroundColor: '#3F6AE1',
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },

  addText: {
    color: '#fff',
    fontWeight: '700',
  },

  emptyText: {
    color: '#777',
    marginBottom: 10,
  },

  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: '48%',
    justifyContent: 'space-between',
  },

  tagText: {
    fontWeight: '600',
    color: '#333',
  },

  deleteText: {
    color: '#ef4444',
    fontWeight: '800',
    marginLeft: 8,
    fontWeight: '600',
  },
});
