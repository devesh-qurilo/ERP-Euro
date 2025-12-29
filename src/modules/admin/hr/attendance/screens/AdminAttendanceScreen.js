// src/modules/admin/hr/attendance/screens/AdminAttendanceScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAttList,
  fetchAttByEmployee,
  setAttFilters,
  setAttMode,
  openAttModal,
  closeAttModal,
  markAttByDates,
  markAttByMonth,
} from '../store/actions';
import {
  selectAttList,
  selectAttLoading,
  selectAttError,
  selectAttMember,
  selectAttMemberLoading,
  selectAttFilters,
  selectAttMode as selectMode,
  selectAttModalOpen,
} from '../store/selectors';
import { selectEmpList } from '../../employees/store/selectors';
import AttendanceTable from '../components/AttendanceTable';
import MemberAttendanceTable from '../components/MemberAttendanceTable';
import MarkAttendanceModal from '../components/MarkAttendanceModal';

const SegBtn = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.segBtn, active && styles.segBtnActive]}
  >
    <Text style={[styles.segTxt, active && styles.segTxtActive]}>{label}</Text>
  </Pressable>
);

const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ minWidth: 180, marginRight: 8, marginBottom: 8 }}>
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
              key={String(opt.value ?? opt)}
              onPress={() => {
                onChange(opt.value ?? opt);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuTxt}>{String(opt.label ?? opt)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const Legend = () => (
  <View style={styles.legend}>
    {[
      ['⭐', 'Holiday'],
      ['📅', 'Day Off'],
      ['✔', 'Present'],
      ['½', 'Half Day'],
      ['●', 'Late'],
      ['🛫', 'On Leave'],
    ].map(([icon, txt]) => (
      <View key={txt} style={styles.legendItem}>
        <Text style={styles.legendIcon}>{icon}</Text>
        <Text style={styles.legendTxt}>{txt}</Text>
      </View>
    ))}
  </View>
);

export default function AdminAttendanceScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectAttList);
  const loading = useSelector(selectAttLoading);
  const error = useSelector(selectAttError);

  const member = useSelector(selectAttMember);
  const memberLoading = useSelector(selectAttMemberLoading);

  const filters = useSelector(selectAttFilters);
  const mode = useSelector(selectMode);
  const modalOpen = useSelector(selectAttModalOpen);

  const employees = useSelector(selectEmpList);
  const empOptions = useMemo(
    () =>
      employees.map(e => ({
        label: `${e.name} (${e.employeeId})`,
        value: e.employeeId,
      })),
    [employees],
  );
  const [selectedEmp, setSelectedEmp] = useState(empOptions[0]?.value || '');

  useEffect(() => {
    dispatch(fetchAttList());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = (filters.q || '').trim().toLowerCase();
    if (!q) return list;
    return list.filter(r =>
      `${r.employeeName} ${r.employeeId} ${r.status} ${r.date}`
        .toLowerCase()
        .includes(q),
    );
  }, [list, filters]);

  const onSave = ({ type, body }) => {
    if (type === 'dates') dispatch(markAttByDates(body));
    else dispatch(markAttByMonth(body));
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Top title + segmented 3 buttons */}
      <View style={styles.headerRow}>
        {/* <Text style={styles.sectionTitle}>Ma</Text> */}
        <View style={styles.segBar}>
          <SegBtn
            label="+ Mark Attendance"
            active={false}
            onPress={() => dispatch(openAttModal())}
          />
          <SegBtn
            label="List"
            active={mode === 'list'}
            onPress={() => {
              dispatch(setAttMode('list'));
              dispatch(fetchAttList());
            }}
          />
          <SegBtn
            label="Attendance by Member"
            active={mode === 'member'}
            onPress={() => {
              const id = selectedEmp || empOptions[0]?.value;
              dispatch(setAttMode('member'));
              if (id) dispatch(fetchAttByEmployee(id));
            }}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 240, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={filters.q}
              onChangeText={q => dispatch(setAttFilters({ q }))}
              placeholder="employee, id, status, date"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
          {mode === 'member' && (
            <Select
              label="Employee"
              value={selectedEmp}
              options={empOptions}
              onChange={v => {
                setSelectedEmp(v);
                dispatch(fetchAttByEmployee(v));
              }}
            />
          )}
        </View>
      </View>

      {/* Legend like your mock */}
      <Legend />

      {/* Horizontal tables */}
      {mode === 'list' ? (
        <View style={styles.hScrollWrap}>
          <AttendanceTable data={filtered} loading={loading} />
        </View>
      ) : (
        <View style={styles.hScrollWrap}>
          <MemberAttendanceTable data={member} loading={memberLoading} />
        </View>
      )}
      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      <MarkAttendanceModal
        visible={modalOpen}
        onClose={() => dispatch(closeAttModal())}
        onSave={onSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
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
  segBar: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 4,
    borderRadius: 12,
    gap: 6,
  },
  segBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  segBtnActive: { backgroundColor: '#111827' },
  segTxt: { fontWeight: '300', color: '#111827' },
  segTxtActive: { color: '#fff' },

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
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    zIndex: 30,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendIcon: { fontSize: 12 },
  legendTxt: { color: '#374151', fontSize: 12, fontWeight: '700' },

  hScrollWrap: { borderRadius: 12, overflow: 'hidden' },
  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
