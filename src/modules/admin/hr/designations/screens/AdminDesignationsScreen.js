import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDesignations,
  openDesignationModal,
  closeDesignationModal,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  setDesignationsMode,
} from '../store/actions';
import {
  selectDesignations,
  selectDesignationsLoading,
  selectDesignationsError,
  selectDesignationsBusyIds,
  selectDesignationModalOpen,
  selectDesignationEditing,
  selectDesignationsMode,
} from '../store/selectors';

import DesignationsTable from '../components/DesignationsTable';
import DesignationModal from '../components/DesignationModal';
import HierarchyView from '../components/HierarchyView';

const Pill = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.pill, active && styles.pillActive]}
  >
    <Text style={[styles.pillTxt, active && styles.pillTxtActive]}>
      {label}
    </Text>
  </Pressable>
);

export default function AdminDesignationsScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectDesignations);
  const loading = useSelector(selectDesignationsLoading);
  const error = useSelector(selectDesignationsError);
  const busyIds = useSelector(selectDesignationsBusyIds);
  const modalOpen = useSelector(selectDesignationModalOpen);
  const editing = useSelector(selectDesignationEditing);
  const mode = useSelector(selectDesignationsMode);

  useEffect(() => {
    dispatch(fetchDesignations());
  }, [dispatch]);

  const handleSave = payload => {
    if (editing) dispatch(updateDesignation(editing.id, payload));
    else dispatch(createDesignation(payload));
  };

  const onEdit = row => dispatch(openDesignationModal(row));
  const onDelete = row => dispatch(deleteDesignation(row.id));

  const onChangeParent = (node, newParentId) => {
    if (newParentId === node.parentDesignationId) return;
    dispatch(
      updateDesignation(node.id, {
        designationName: node.designationName,
        parentDesignationId: newParentId,
      }),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Top actions */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={() => dispatch(openDesignationModal(null))}
          >
            <Text style={[styles.primaryTxt, { color: '#fff' }]}>+ Add</Text>
          </Pressable>
          <Pill
            label="List"
            active={mode === 'list'}
            onPress={() => dispatch(setDesignationsMode('list'))}
          />
          <Pill
            label="Hierarchy"
            active={mode === 'hierarchy'}
            onPress={() => dispatch(setDesignationsMode('hierarchy'))}
          />
        </View>
      </View>

      {/* Body */}
      {mode === 'list' ? (
        <>
          <Text style={styles.sectionTitle}>Designations</Text>
          <DesignationsTable
            data={list}
            loading={loading}
            busyIds={busyIds}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Hierarchy</Text>
          <HierarchyView items={list} onChangeParent={onChangeParent} />
        </>
      )}

      {error && <Text style={styles.err}>Error: {String(error)}</Text>}

      {/* Modal */}
      <DesignationModal
        visible={modalOpen}
        editing={editing}
        onSave={handleSave}
        onClose={() => dispatch(closeDesignationModal())}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0b0b0c',
    marginTop: 4,
  },

  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#1d4ed8',
  },
  primaryTxt: { fontWeight: '900', color: '#111827' },

  pill: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillActive: { backgroundColor: '#111827' },
  pillTxt: { color: '#111827', fontWeight: '900' },
  pillTxtActive: { color: '#fff' },

  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
