import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAWPList,
  selectAWPLoading,
  selectAWPBusyIds,
  selectAWPMode,
  selectAWPFilters,
  selectAWPModalOpen,
  selectAWPEditing,
} from '../store/selectors';
import {
  fetchAll,
  setMode,
  setFilters,
  openModal,
  closeModal,
  createProject,
  updateProject,
  deleteProject,
  pinProject,
  unpinProject,
  archiveProject,
  unarchiveProject,
  patchStatus,
} from '../store/actions';
import ProjectsTable from '../components/ProjectsTable';
import ProjectModal from '../components/ProjectModal';
import { useNavigation } from '@react-navigation/native';

export default function AdminWorkProjectsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const list = useSelector(selectAWPList);
  const loading = useSelector(selectAWPLoading);
  const busyIds = useSelector(selectAWPBusyIds);
  const mode = useSelector(selectAWPMode);
  const filters = useSelector(selectAWPFilters);
  const modalOpen = useSelector(selectAWPModalOpen);
  const editing = useSelector(selectAWPEditing);
  const [createBusy, setCreateBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = (filters.q || '').toLowerCase().trim();
    let arr = [...list];
    if (mode === 'pinned') arr = arr.filter(p => p.pinned === true);
    if (mode === 'archived') arr = arr.filter(p => p.archived === true);
    if (q) {
      arr = arr.filter(p =>
        `${p.shortCode} ${p.name} ${p.client?.name ?? ''}`
          .toLowerCase()
          .includes(q),
      );
    }
    if (filters.status !== 'All') {
      arr = arr.filter(p => (p.projectStatus || '—') === filters.status);
    }
    return arr;
  }, [list, filters, mode]);

  const onSave = payload => {
    setCreateBusy(true);
    if (editing) dispatch(updateProject(editing.id, payload));
    else dispatch(createProject(payload));
    // createBusy reset is handled by redux fetch; but keep a guard:
    setTimeout(() => setCreateBusy(false), 1200);
  };

  const onView = item => {
    navigation.navigate('AdminProjectView', { project: item });
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Filters */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Filters</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <View style={{ flexBasis: '60%', minWidth: 220 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={filters.q}
              onChangeText={q => dispatch(setFilters({ q }))}
              placeholder="code, name, client…"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          <Dropdown
            label="Status"
            value={filters.status}
            options={[
              'All',
              'IN_PROGRESS',
              'ON_HOLD',
              'CANCELLED',
              'COMPLETED',
            ]}
            onChange={status => dispatch(setFilters({ status }))}
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.headerRow}>
        {/* <Text style={styles.sectionTitle}>Client projects</Text> */}
        <View style={{ gap: 2, flexDirection: 'row' }}>
          <Pressable
            style={[styles.btn, styles.primary]}
            onPress={() => dispatch(openModal(null))}
          >
            <Text style={[styles.btnTxt, { color: '#fff' }]}>
              + Add Project
            </Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={() => dispatch(setMode('list'))}
          >
            <Text style={styles.btnTxt}>Li</Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={() => dispatch(setMode('calendar'))}
          >
            <Text style={styles.btnTxt}>Cal</Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={() => dispatch(setMode('archived'))}
          >
            <Text style={styles.btnTxt}>Arc</Text>
          </Pressable>
          <Pressable
            style={styles.btn}
            onPress={() => dispatch(setMode('pinned'))}
          >
            <Text style={styles.btnTxt}>Pin</Text>
          </Pressable>
        </View>
      </View>

      {/* View */}
      {mode === 'calendar' ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Calendar (coming soon)</Text>
          <Text style={{ color: '#6b7280' }}>
            Render project dates on a month grid here.
          </Text>
        </View>
      ) : (
        <ProjectsTable
          data={filtered}
          loading={loading}
          busyIds={busyIds}
          onView={onView}
          onEdit={p => dispatch(openModal(p))}
          onDelete={id => dispatch(deleteProject(id))}
          onStatus={(id, status) => dispatch(patchStatus(id, status))}
          onPin={id => dispatch(pinProject(id))}
          onUnpin={id => dispatch(unpinProject(id))}
          onArchive={id => dispatch(archiveProject(id))}
          onUnarchive={id => dispatch(unarchiveProject(id))}
        />
      )}

      <ProjectModal
        visible={modalOpen}
        editing={editing}
        onClose={() => dispatch(closeModal())}
        onSave={onSave}
        busy={createBusy}
      />
    </ScrollView>
  );
}

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={{ minWidth: 150, marginRight: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={opt}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuTxt}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
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
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: { backgroundColor: '#1d4ed8' },
  btnTxt: { fontWeight: '400', color: '#111827', textAlign: 'center' },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    zIndex: 30,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },
});
