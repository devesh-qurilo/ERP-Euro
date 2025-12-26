import React, { useEffect, useMemo, useRef, useState } from 'react';
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

import { selectEmpList } from '../../employees/store/selectors';

/* ================= PILL ================= */

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

/* ================= SCREEN ================= */

export default function AdminLeavesScreen() {
  const dispatch = useDispatch();
  const wasApplying = useRef(false);
  const prevBusyCount = useRef(0);

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

  const employees = useSelector(selectEmpList);

  /* ===== FETCH ===== */

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'profile') dispatch(fetchQuota());
  }, [mode, dispatch]);

  useEffect(() => {
    // when all row actions finished → refetch list
    if (prevBusyCount.current > 0 && busyIds.length === 0) {
      dispatch(fetchLeaves());
    }
    prevBusyCount.current = busyIds.length;
  }, [busyIds, dispatch]);

  /* ===== CLOSE MODAL ON SUCCESS ===== */

  useEffect(() => {
    if (wasApplying.current && !applying && modalOpen) {
      dispatch(closeLeaveModal());
    }
    wasApplying.current = applying;
  }, [applying, modalOpen, dispatch]);

  /* ===== FILTER ===== */

  const filtered = useMemo(() => {
    const q = (filters.q || '').toLowerCase().trim();
    return list.filter(x => {
      if (q) {
        const hay =
          `${x.employeeName} ${x.employeeId} ${x.leaveType} ${x.status} ${x.reason}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.type !== 'All' && x.leaveType !== filters.type) return false;
      if (filters.status !== 'All' && x.status !== filters.status) return false;
      return true;
    });
  }, [list, filters]);

  /* ===== ACTIONS ===== */

  const onApprove = row =>
    dispatch(patchLeaveStatus(row.id, { status: 'APPROVED' }));

  const onReject = row => {
    Alert.prompt
      ? Alert.prompt('Reject', 'Enter rejection reason', txt =>
          dispatch(
            patchLeaveStatus(row.id, {
              status: 'REJECTED',
              rejectionReason: txt || 'Not specified',
            }),
          ),
        )
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

  const onDelete = row =>
    Alert.alert('Delete Leave', `Delete ${row.employeeName}'s leave?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteLeave(row.id)),
      },
    ]);

  const handleApply = payload => dispatch(applyLeaves(payload));

  const resetFilters = () =>
    dispatch(setLeavesFilters({ q: '', type: 'All', status: 'All' }));

  /* ================= UI ================= */

  return (
    <View style={styles.screen}>
      {/* ===== ROW 1 : MODE ===== */}
      <View style={styles.modeRow}>
        {['list', 'calendar', 'profile'].map(m => (
          <Pill
            key={m}
            label={m[0].toUpperCase() + m.slice(1)}
            active={mode === m}
            onPress={() => dispatch(setLeavesMode(m))}
          />
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          paddingHorizontal: 12,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.filterBlock}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={filters.q}
              onChangeText={q => dispatch(setLeavesFilters({ q }))}
              placeholder="employee, reason, status"
              style={styles.input}
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
        </ScrollView>

        <View style={{ flexDirection: 'column', gap: 10 }}>
          <Pressable
            style={[styles.primaryBtn, styles.addBtn]}
            onPress={() => dispatch(openLeaveModal())}
          >
            <Text style={styles.addTxt}>+ Add Leaves</Text>
          </Pressable>

          <Pressable style={styles.primaryBtn} onPress={resetFilters}>
            <Text style={styles.primaryTxt}>Clear</Text>
          </Pressable>
        </View>
      </View>

      {/* ===== ROW 3 : CONTENT ===== */}
      <View style={styles.content}>
        {mode === 'profile' ? (
          <LeaveQuotaCard data={quota} loading={quotaLoading} />
        ) : mode === 'calendar' ? (
          <LeavesCalendar
            data={filtered}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
          />
        ) : (
          <ScrollView horizontal>
            <LeavesTable
              data={filtered}
              loading={loading}
              busyIds={busyIds}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
            />
          </ScrollView>
        )}
      </View>

      {error && <Text style={styles.err}>{String(error)}</Text>}

      <LeaveApplyModal
        visible={modalOpen}
        onClose={() => dispatch(closeLeaveModal())}
        onSave={handleApply}
        employees={employees}
        applying={applying}
      />
    </View>
  );
}

/* ================= SMALL SELECT ================= */

const SelectSmall = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.selectWrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value}>{value}</Text>
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
              <Text>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9fafb' },

  modeRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },

  pill: {
    borderWidth: 1,
    maxWidth: 160,
    minWidth: 100,
    borderColor: '#0042c6ff',
    paddingHorizontal: 14,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  pillActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  pillTxt: { fontWeight: '800', color: '#111827', textAlign: 'center' },
  pillTxtActive: { color: '#fff' },

  filtersRow: {
    paddingHorizontal: 12,
    gap: 10,
    backgroundColor: '#1d4ed8',
    paddingBottom: 8,
    alignItems: 'flex-start',
    maxHeight: 90,
  },

  filterBlock: { maxWidth: 120 },

  content: { flex: 1, paddingHorizontal: 12 },

  label: { fontSize: 12, fontWeight: '800', marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },

  selectWrap: { minWidth: 150 },

  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },

  value: { flex: 1 },
  caret: { opacity: 0.6 },

  menu: {
    position: 'static',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 10,
  },

  menuItem: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    // alignSelf: 'flex-end',
  },

  addBtn: { backgroundColor: '#1d4ed8' },
  addTxt: { color: '#fff', fontWeight: '800' },
  primaryTxt: { fontWeight: '800' },

  err: { color: '#b00020', textAlign: 'center', margin: 10 },
});
