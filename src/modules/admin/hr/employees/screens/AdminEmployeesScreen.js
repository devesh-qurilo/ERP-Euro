import React, { useEffect, useMemo } from 'react';
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
  fetchEmployees,
  openEmpModal,
  closeEmpModal,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  patchEmployeeRole,
  setEmpFilters,
} from '../store/actions';
import FilterModal from '../components/FilterModal';
import {
  selectEmpList,
  selectEmpLoading,
  selectEmpError,
  selectEmpBusyIds,
  selectEmpModalOpen,
  selectEmpEditing,
  selectEmpFilters,
  selectEmpCreating,
  selectEmpCreateError,
} from '../store/selectors';
import EmployeesTable from '../components/EmployeesTable';
import EmployeeModal from '../components/EmployeeModal';

import InviteEmployeeModal from '../components/InviteEmployeeModal';
import { inviteEmployee, clearInviteState } from '../store/actions';

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

const Select = ({ label, value, options, onChange, style }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={[{ minWidth: 150, marginRight: 8, marginBottom: 8 }, style]}>
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
              key={String(opt)}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuTxt}>{String(opt)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function AdminEmployeesScreen({ navigation }) {
  const dispatch = useDispatch();
  const list = useSelector(selectEmpList);
  const loading = useSelector(selectEmpLoading);
  const error = useSelector(selectEmpError);
  const busyIds = useSelector(selectEmpBusyIds);
  const modalOpen = useSelector(selectEmpModalOpen);
  const editing = useSelector(selectEmpEditing);
  const filters = useSelector(selectEmpFilters);
  const creating = useSelector(selectEmpCreating);
  const [filterModal, setFilterModal] = React.useState(null);

  const createError = useSelector(selectEmpCreateError);

  const [inviteOpen, setInviteOpen] = React.useState(false);

  const inviteLoading = useSelector(
    s => !!s.admin?.hr?.employees?.inviteLoading,
  );
  const inviteSuccess = useSelector(
    s => !!s.admin?.hr?.employees?.inviteSuccess,
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // derived filter options (client-side)
  const roles = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.role).filter(Boolean))),
    ],
    [list],
  );
  const actives = ['All', 'Active', 'Inactive'];

  const filtered = useMemo(() => {
    const q = (filters?.q || '').toLowerCase().trim();

    return list.filter(x => {
      if (q) {
        const hay =
          `${x.employeeId} ${x.name} ${x.email} ${x.mobile} ${x.departmentName} ${x.designationName}`.toLowerCase();

        if (!hay.includes(q)) return false;
      }

      if (filters?.department && filters.department !== 'All') {
        if (x.departmentName !== filters.department) return false;
      }

      if (filters?.designation && filters.designation !== 'All') {
        if (x.designationName !== filters.designation) return false;
      }

      if (filters?.reportingTo && filters.reportingTo !== 'All') {
        if (x.reportingToId !== filters.reportingTo) return false;
      }

      if (filters?.role && filters.role !== 'All') {
        if ((x.role || '') !== filters.role) return false;
      }

      if (filters?.active && filters.active !== 'All') {
        const activeBool = filters.active === 'Active';
        if (!!x.active !== activeBool) return false;
      }

      return true;
    });
  }, [list, filters]);

  const resetFilters = () =>
    dispatch(setEmpFilters({ q: '', role: 'All', active: 'All' }));

  const onView = emp => navigation.navigate('AdminEmployeeView', { emp: emp }); // future
  const onEdit = emp => dispatch(openEmpModal(emp));
  const onDelete = empId => dispatch(deleteEmployee(empId));
  const onRoleChange = (empId, role) =>
    dispatch(patchEmployeeRole(empId, role));

  const openInvite = () => {
    dispatch(clearInviteState());
    setInviteOpen(true);
  };
  const closeInvite = () => setInviteOpen(false);

  const handleInviteSend = ({ to, message }) => {
    dispatch(inviteEmployee({ to, message }));
  };

  const departments = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(list.map(x => x.departmentName).filter(x => x && x !== 'NA')),
      ),
    ],
    [list],
  );

  const designations = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(list.map(x => x.designationName).filter(x => x && x !== 'NA')),
      ),
    ],
    [list],
  );

  const reportingTo = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.reportingToId).filter(Boolean))),
    ],
    [list],
  );

  const handleSave = ({ employee, file }) => {
    if (editing)
      dispatch(
        updateEmployee(editing.employeeId, {
          employee: { ...employee, employeeId: editing.employeeId },
          file,
        }),
      );
    else dispatch(createEmployee({ employee, file }));
  };

  const hasFilters = !!(
    (filters.q || '').trim() ||
    filters.role !== 'All' ||
    filters.active !== 'All'
  );

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* 1) Filters */}
      <View style={styles.card}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <View style={{ width: 220, marginRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={filters.q}
              onChangeText={q => dispatch(setEmpFilters({ q }))}
              placeholder="id, name, email, phone, department, designation"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <Pressable
            style={styles.filterBtn}
            onPress={() => setFilterModal('department')}
          >
            <Text style={styles.filterText}>
              Department: {filters.department || 'All'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.filterBtn}
            onPress={() => setFilterModal('designation')}
          >
            <Text style={styles.filterText}>
              Designation: {filters.designation || 'All'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.filterBtn}
            onPress={() => setFilterModal('role')}
          >
            <Text style={styles.filterText}>Role: {filters.role || 'All'}</Text>
          </Pressable>

          <Pressable
            style={styles.filterBtn}
            onPress={() => setFilterModal('status')}
          >
            <Text style={styles.filterText}>
              Status: {filters.active || 'All'}
            </Text>
          </Pressable>
        </ScrollView>

        {hasFilters && (
          <Pressable onPress={resetFilters} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear</Text>
          </Pressable>
        )}
      </View>

      {/* 2) Buttons */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Employees Details</Text>
        <View style={{ flexDirection: 'column', gap: 8 }}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={() => dispatch(openEmpModal(null))}
          >
            <Text style={[styles.primaryTxt, { color: '#fff' }]}>
              + Add Employee
            </Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={openInvite}>
            <Text style={styles.primaryTxt}>+ Invite Employee</Text>
          </Pressable>
        </View>
      </View>

      {/* 3) Table */}
      <EmployeesTable
        data={filtered}
        loading={loading}
        busyIds={busyIds}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onRoleChange={onRoleChange}
      />
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      <EmployeeModal
        visible={modalOpen}
        editing={editing}
        onSave={handleSave}
        saving={creating}
        error={createError}
        onClose={() => dispatch(closeEmpModal())}
      />
      <InviteEmployeeModal
        visible={inviteOpen}
        onClose={closeInvite}
        onSend={handleInviteSend}
        loading={inviteLoading}
        lastSuccess={inviteSuccess}
      />
      <FilterModal
        visible={filterModal === 'department'}
        title="Select Department"
        options={departments}
        value={filters.department}
        onSelect={v => dispatch(setEmpFilters({ department: v }))}
        onClose={() => setFilterModal(null)}
      />

      <FilterModal
        visible={filterModal === 'designation'}
        title="Select Designation"
        options={designations}
        value={filters.designation}
        onSelect={v => dispatch(setEmpFilters({ designation: v }))}
        onClose={() => setFilterModal(null)}
      />

      <FilterModal
        visible={filterModal === 'role'}
        title="Select Role"
        options={roles}
        value={filters.role}
        onSelect={v => dispatch(setEmpFilters({ role: v }))}
        onClose={() => setFilterModal(null)}
      />

      <FilterModal
        visible={filterModal === 'status'}
        title="Select Status"
        options={actives}
        value={filters.active}
        onSelect={v => dispatch(setEmpFilters({ active: v }))}
        onClose={() => setFilterModal(null)}
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
    zIndex: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },

  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primaryTxt: { fontWeight: '400', color: '#111827' },
  clearBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  clearTxt: { fontWeight: '800', color: '#111827' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0b0b0c',
    marginTop: 4,
  },

  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
  filterBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },

  filterText: {
    fontWeight: '600',
    color: '#111827',
  },
});
