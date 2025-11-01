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
  fetchDepartments,
  openDepartmentModal,
  closeDepartmentModal,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  setDepartmentsMode,
} from '../store/actions';
import {
  selectDepartments,
  selectDepartmentsLoading,
  selectDepartmentsError,
  selectDepartmentsBusyIds,
  selectDepartmentModalOpen,
  selectDepartmentEditing,
  selectDepartmentsMode,
} from '../store/selectors';

import DepartmentsTable from '../components/DepartmentsTable';
import DepartmentModal from '../components/DepartmentModal';
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

export default function AdminDepartmentsScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectDepartments);
  const loading = useSelector(selectDepartmentsLoading);
  const error = useSelector(selectDepartmentsError);
  const busyIds = useSelector(selectDepartmentsBusyIds);
  const modalOpen = useSelector(selectDepartmentModalOpen);
  const editing = useSelector(selectDepartmentEditing);
  const mode = useSelector(selectDepartmentsMode);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSave = payload => {
    if (editing) dispatch(updateDepartment(editing.id, payload));
    else dispatch(createDepartment(payload));
  };

  const onEdit = row => dispatch(openDepartmentModal(row));
  const onDelete = row => dispatch(deleteDepartment(row.id));

  const onChangeParent = (node, newParentId) => {
    if (newParentId === node.parentDepartmentId) return;
    dispatch(
      updateDepartment(node.id, {
        departmentName: node.departmentName,
        parentDepartmentId: newParentId,
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
            onPress={() => dispatch(openDepartmentModal(null))}
          >
            <Text style={[styles.primaryTxt, { color: '#fff' }]}>+ Add</Text>
          </Pressable>
          <Pill
            label="List"
            active={mode === 'list'}
            onPress={() => dispatch(setDepartmentsMode('list'))}
          />
          <Pill
            label="Hierarchy"
            active={mode === 'hierarchy'}
            onPress={() => dispatch(setDepartmentsMode('hierarchy'))}
          />
        </View>
      </View>

      {/* Body */}
      {mode === 'list' ? (
        <>
          <Text style={styles.sectionTitle}>Departments</Text>
          <DepartmentsTable
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
      <DepartmentModal
        visible={modalOpen}
        editing={editing}
        onSave={handleSave}
        onClose={() => dispatch(closeDepartmentModal())}
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
