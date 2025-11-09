import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { listByClient, openForm, openView, deleteOne } from './store/actions';
import {
  selectCVNList,
  selectCVNLoading,
  selectCVNBusyIds,
  selectCVNFormOpen,
  selectCVNEditing,
  selectCVNSubmitting,
  selectCVNViewOpen,
  selectCVNViewItem,
} from './store/selectors';
import NoteFormModal from './components/NoteFormModal';
import NoteViewModal from './components/NoteViewModal';

export default function ClientNotesTab({ route }) {
  const clientId = route?.params?.clientId || route?.clientId;
  const dispatch = useDispatch();
  const list = useSelector(selectCVNList);
  const loading = useSelector(selectCVNLoading);
  const busyIds = useSelector(selectCVNBusyIds);
  const formOpen = useSelector(selectCVNFormOpen);
  const editing = useSelector(selectCVNEditing);
  const submitting = useSelector(selectCVNSubmitting);
  const viewOpen = useSelector(selectCVNViewOpen);
  const viewItem = useSelector(selectCVNViewItem);

  useEffect(() => {
    if (clientId) dispatch(listByClient(clientId));
  }, [clientId, dispatch]);

  const onDelete = item => {
    Alert.alert('Delete Note', `Remove "${item.title}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteOne(clientId, item.id)),
      },
    ]);
  };

  const header = [
    'Title',
    'Type',
    'Detail',
    'Created By',
    'Created At',
    'Actions',
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      {/* Top */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notes</Text>
        <Pressable
          style={[styles.btn, styles.primary]}
          onPress={() => dispatch(openForm(null))}
        >
          <Text style={[styles.btnTxt, { color: '#fff' }]}>+ Add Note</Text>
        </Pressable>
      </View>

      {/* Table */}
      <ScrollView horizontal style={styles.hscroll}>
        <View style={styles.table}>
          {/* Head */}
          <View style={[styles.row, styles.head]}>
            {header.map(h => (
              <Text key={h} style={[styles.cell, styles.hcell]}>
                {h}
              </Text>
            ))}
          </View>

          {/* Body */}
          {loading ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ) : list.length === 0 ? (
            <View style={{ padding: 16 }}>
              <Text style={{ color: '#6b7280' }}>No notes.</Text>
            </View>
          ) : (
            list.map(item => {
              const busy = busyIds.includes(item.id);
              return (
                <View key={item.id} style={styles.row}>
                  <Text
                    style={[styles.cell, { minWidth: 220 }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.cell}>{item.type || '—'}</Text>
                  <Text
                    style={[styles.cell, { minWidth: 280 }]}
                    numberOfLines={1}
                  >
                    {item.detail}
                  </Text>
                  <Text style={styles.cell}>{item.createdBy || '—'}</Text>
                  <Text style={styles.cell}>
                    {item.createdAt?.replace('T', ' ').replace('Z', '') || '—'}
                  </Text>

                  <View style={[styles.cell, styles.actions]}>
                    <Pressable
                      style={styles.dotBtn}
                      onPress={() => dispatch(openView(item))}
                    >
                      <Text>👁️ View</Text>
                    </Pressable>
                    <Pressable
                      style={styles.dotBtn}
                      onPress={() => dispatch(openForm(item))}
                    >
                      <Text>✏️ Edit</Text>
                    </Pressable>
                    <Pressable
                      style={styles.dotBtn}
                      disabled={busy}
                      onPress={() => onDelete(item)}
                    >
                      <Text>{busy ? '…' : '🗑️ Delete'}</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <NoteFormModal
        visible={formOpen}
        editing={editing}
        submitting={submitting}
        clientId={clientId}
        onClose={() => dispatch({ type: 'admin/clientsViewNotes/CLOSE_FORM' })}
      />
      <NoteViewModal
        visible={viewOpen}
        item={viewItem}
        onClose={() => dispatch({ type: 'admin/clientsViewNotes/CLOSE_VIEW' })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0b0b0c' },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: { backgroundColor: '#1d4ed8' },
  btnTxt: { fontWeight: '500', color: '#111827' },

  hscroll: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  table: { minWidth: 1000 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  head: { backgroundColor: '#f8fafc' },
  cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 160 },
  hcell: { fontWeight: '800', color: '#111827' },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 260,
  },
  dotBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
  },
});
