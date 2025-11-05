import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import LeavesTable from '../components/LeavesTable';
import LeaveQuotaCard from '../components/LeaveQuotaCard';
import LeaveApplyModal from '../components/LeaveApplyModal';
import LeavesCalendar from '../components/LeavesCalendar';

import {
  fetchLeaves,
  fetchQuota,
  setLeavesMode,
  setLeavesFilters,
  openLeaveModal,
  closeLeaveModal,
  applyLeaves,
  patchLeaveStatus,
  deleteLeave,
} from '../store/actions';
import {
  selectLeaves,
  selectLeavesLoading,
  selectLeavesError,
  selectLeavesFilters,
  selectLeavesMode,
  selectLeaveModalOpen,
  selectLeavesApplying,
  selectLeavesBusyIds,
  selectLeaveQuota,
  selectLeaveQuotaLoading,
} from '../store/selectors';

// we'll reuse admin employees list for multi-select in apply modal
import { selectEmpList } from '../../employees/store/selectors';

// const [mode, setMode] = React.useState('list'); // 'list' | 'calendar' | 'profile'

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

export default function AdminLeavesScreen() {
  const dispatch = useDispatch();

  const list = useSelector(selectLeaves);
  const loading = useSelector(selectLeavesLoading);
  const error = useSelector(selectLeavesError);
  const filters = useSelector(selectLeavesFilters);
  const mode = useSelector(selectLeavesMode);

  const modalOpen = useSelector(selectLeaveModalOpen);
  const applying = useSelector(selectLeavesApplying);
  const busyIds = useSelector(selectLeavesBusyIds);

  const quota = useSelector(selectLeaveQuota);
  const quotaLoading = useSelector(selectLeaveQuotaLoading);

  const employees = useSelector(selectEmpList); // from Admin → HR → Employees list
  // const [mode, setMode] = React.useState('list');
  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'profile') dispatch(fetchQuota());
  }, [dispatch, mode]);

  // client-side filters
  const filtered = useMemo(() => {
    const q = (filters.q || '').toLowerCase().trim();
    return list.filter(x => {
      if (q) {
        const hay =
          `${x.employeeName} ${x.employeeId} ${x.leaveType} ${x.status} ${x.reason}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.type !== 'All' && (x.leaveType || '') !== filters.type)
        return false;
      if (filters.status !== 'All' && (x.status || '') !== filters.status)
        return false;
      return true;
    });
  }, [list, filters]);

  const onApprove = row =>
    dispatch(patchLeaveStatus(row.id, { status: 'APPROVED' }));
  const onReject = row => {
    Alert.prompt
      ? Alert.prompt('Reject', 'Enter rejection reason', txt => {
          dispatch(
            patchLeaveStatus(row.id, {
              status: 'REJECTED',
              rejectionReason: txt || 'Not specified',
            }),
          );
        })
      : Alert.alert('Reject Leave', 'Reject this leave?', [
          { text: 'Cancel' },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: () =>
              dispatch(
                patchLeaveStatus(row.id, {
                  status: 'REJECTED',
                  rejectionReason: 'Not specified',
                }),
              ),
          },
        ]);
  };
  const onDelete = row => {
    Alert.alert('Delete Leave', `Delete ${row.employeeName}'s leave?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteLeave(row.id)),
      },
    ]);
  };

  const handleApply = payload => dispatch(applyLeaves(payload));

  const resetFilters = () =>
    dispatch(setLeavesFilters({ q: '', type: 'All', status: 'All' }));

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Top pills */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['list', 'calendar', 'profile'].map(m => (
          <Pill
            key={m}
            label={m[0].toUpperCase() + m.slice(1)}
            active={mode === m}
            onPress={() => dispatch(setLeavesMode(m))}
          />
        ))}
      </View>

      {/* Filters + Add button row */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={filters.q}
              onChangeText={q => dispatch(setLeavesFilters({ q }))}
              placeholder="employee, reason, status, type"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <SelectSmall
            label="Type"
            value={filters.type}
            options={['All', 'SICK', 'CASUAL', 'EARNED']}
            onChange={type => dispatch(setLeavesFilters({ type }))}
          />
          <SelectSmall
            label="Status"
            value={filters.status}
            options={['All', 'APPROVED', 'PENDING', 'REJECTED']}
            onChange={status => dispatch(setLeavesFilters({ status }))}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={() => dispatch(openLeaveModal())}
          >
            <Text style={[styles.primaryTxt, { color: '#fff' }]}>
              + Add Leaves
            </Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={resetFilters}>
            <Text style={styles.primaryTxt}>Clear Filters</Text>
          </Pressable>
        </View>
      </View>

      {mode === 'calendar' && (
        <LeavesCalendar
          data={leaves}
          onApprove={lv => dispatch(approveLeave(lv.id))}
          onReject={lv => dispatch(rejectLeave(lv.id))}
          onDelete={lv => dispatch(deleteLeave(lv.id))}
        />
      )}

      {/* Content by mode */}
      {mode === 'profile' ? (
        <LeaveQuotaCard data={quota} loading={quotaLoading} />
      ) : mode === 'calendar' ? (
        <View style={styles.card}>
          <Text style={{ fontWeight: '700' }}>
            Calendar view (coming later)
          </Text>
        </View>
      ) : (
        <LeavesTable
          data={filtered}
          loading={loading}
          busyIds={busyIds}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      )}

      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      <LeaveApplyModal
        visible={modalOpen}
        onClose={() => dispatch(closeLeaveModal())}
        onSave={handleApply}
        employees={employees}
        applying={applying}
      />
    </ScrollView>
  );
}

/** small select used in filter row */
const SelectSmall = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ minWidth: 150, marginRight: 8, marginBottom: 8 }}>
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

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  pill: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  pillActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  pillTxt: { fontWeight: '800', color: '#111827' },
  pillTxtActive: { color: '#fff' },

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
  primaryTxt: { fontWeight: '800', color: '#111827' },

  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
