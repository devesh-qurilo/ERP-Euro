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
import {
  selectEmpList,
  selectEmpLoading,
  selectEmpError,
  selectEmpBusyIds,
  selectEmpModalOpen,
  selectEmpEditing,
  selectEmpFilters,
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
    const q = (filters.q || '').toLowerCase().trim();
    return list.filter(x => {
      if (q) {
        const hay =
          `${x.employeeId} ${x.name} ${x.email} ${x.mobile} ${x.departmentName} ${x.designationName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.role !== 'All' && (x.role || '') !== filters.role)
        return false;
      if (filters.active !== 'All') {
        const activeBool = filters.active === 'Active';
        if (!!x.active !== activeBool) return false;
      }
      return true;
    });
  }, [list, filters]);

  const resetFilters = () =>
    dispatch(setEmpFilters({ q: '', role: 'All', active: 'All' }));

  const onView = emp =>
    navigation.navigate('AdminEmployeeView', { id: emp.employeeId }); // future
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
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

          <Select
            label="Role"
            value={filters.role}
            options={roles}
            onChange={role => dispatch(setEmpFilters({ role }))}
          />
          <Select
            label="Status"
            value={filters.active}
            options={actives}
            onChange={active => dispatch(setEmpFilters({ active }))}
          />
        </View>

        {hasFilters && (
          <Pressable onPress={resetFilters} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear All</Text>
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
        onClose={() => dispatch(closeEmpModal())}
      />
      <InviteEmployeeModal
        visible={inviteOpen}
        onClose={closeInvite}
        onSend={handleInviteSend}
        loading={inviteLoading}
        lastSuccess={inviteSuccess}
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
});
