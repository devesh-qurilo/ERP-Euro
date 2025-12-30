import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  fetchAppreciations,
  setApprecFilters,
  setApprecMode,
  openApprecModal,
  openAwardModal,
  deleteAppreciation,
  toggleAward,
  fetchAwards,
} from '../store/actions';

import {
  selectApprecs,
  selectApprecsFilters,
  selectApprecBusyIds,
  selectAwards,
  selectApprecMode,
} from '../store/selectors';

import AppreciationsTable from '../components/AppreciationsTable';
import AwardsTable from '../components/AwardsTable';
import AppreciationModal from '../components/AppreciationModal';
import AwardModal from '../components/AwardModal';

/* ---------------- helpers ---------------- */

const formatDate = d => {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0, 10);
};

/* ---------------- Select ---------------- */

const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ minWidth: 150, marginRight: 8, marginBottom: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(!open)}>
        <Text style={styles.value} numberOfLines={1}>
          {String(value)}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(o => (
            <Pressable
              key={String(o)}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuTxt}>{String(o)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

/* ---------------- Screen ---------------- */

export default function AdminAppreciationsScreen() {
  const dispatch = useDispatch();

  const list = useSelector(selectApprecs);
  const awards = useSelector(selectAwards);
  const filters = useSelector(selectApprecsFilters);
  const busyIds = useSelector(selectApprecBusyIds);
  const mode = useSelector(selectApprecMode);

  const [showPicker, setShowPicker] = useState(null); // 'start' | 'end' | null

  useEffect(() => {
    dispatch(fetchAppreciations());
    dispatch(fetchAwards());
  }, [dispatch]);

  /* -------- filter options -------- */

  const awardOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(list.map(x => x.awardTitle).filter(Boolean))),
    ],
    [list],
  );

  const empOpts = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(list.map(x => x.givenToEmployeeName).filter(Boolean)),
      ),
    ],
    [list],
  );

  /* -------- filtering -------- */

  const filtered = useMemo(() => {
    const q = (filters.q || '').trim().toLowerCase();
    return list.filter(x => {
      if (q) {
        const hay =
          `${x.givenToEmployeeName} ${x.awardTitle} ${x.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.award !== 'All' && x.awardTitle !== filters.award)
        return false;
      if (
        filters.employee !== 'All' &&
        x.givenToEmployeeName !== filters.employee
      )
        return false;
      if (filters.start && x.date && new Date(x.date) < new Date(filters.start))
        return false;
      if (filters.end && x.date && new Date(x.date) > new Date(filters.end))
        return false;
      return true;
    });
  }, [list, filters]);

  const clearFilters = () =>
    dispatch(
      setApprecFilters({
        q: '',
        award: 'All',
        employee: 'All',
        start: '',
        end: '',
      }),
    );

  /* ---------------- UI ---------------- */

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* ================= FILTERS ================= */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Search */}
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={filters.q}
              onChangeText={q => dispatch(setApprecFilters({ q }))}
              placeholder="employee, award, summary"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          <Select
            label="Award"
            value={filters.award}
            options={awardOpts}
            onChange={award => dispatch(setApprecFilters({ award }))}
          />

          <Select
            label="Employee"
            value={filters.employee}
            options={empOpts}
            onChange={employee => dispatch(setApprecFilters({ employee }))}
          />
        </View>

        {/* Date pickers */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          <View style={{ minWidth: 150, marginRight: 8 }}>
            <Text style={styles.label}>Start</Text>
            <Pressable
              onPress={() => setShowPicker('start')}
              style={styles.input}
            >
              <Text style={{ color: filters.start ? '#111827' : '#9ca3af' }}>
                {filters.start || 'Select date'}
              </Text>
            </Pressable>
          </View>

          <View style={{ minWidth: 150 }}>
            <Text style={styles.label}>End</Text>
            <Pressable
              onPress={() => setShowPicker('end')}
              style={styles.input}
            >
              <Text style={{ color: filters.end ? '#111827' : '#9ca3af' }}>
                {filters.end || 'Select date'}
              </Text>
            </Pressable>
          </View>
        </View>

        {(filters.q ||
          filters.start ||
          filters.end ||
          filters.award !== 'All' ||
          filters.employee !== 'All') && (
          <Pressable onPress={clearFilters} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* ================= HEADER ================= */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Appreciations</Text>
        <View style={{ gap: 8 }}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={() => dispatch(openApprecModal(null))}
          >
            <Text style={[styles.primaryTxt, { color: '#fff' }]}>
              + Add Appreciation
            </Text>
          </Pressable>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={[
                styles.primaryBtn,
                mode === 'list' && styles.primaryBtnActive,
              ]}
              onPress={() => dispatch(setApprecMode('list'))}
            >
              <Text style={styles.primaryTxt}>List</Text>
            </Pressable>

            <Pressable
              style={[
                styles.primaryBtn,
                mode === 'awards' && styles.primaryBtnActive,
              ]}
              onPress={() => dispatch(setApprecMode('awards'))}
            >
              <Text style={styles.primaryTxt}>Awards</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* ================= DATE PICKER ================= */}
      {showPicker && (
        <DateTimePicker
          value={
            filters[showPicker] ? new Date(filters[showPicker]) : new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            if (Platform.OS !== 'ios') setShowPicker(null);
            if (event?.type === 'dismissed' || !selectedDate) return;

            dispatch(
              setApprecFilters({
                [showPicker]: formatDate(selectedDate),
              }),
            );

            if (Platform.OS === 'ios') setShowPicker(null);
          }}
        />
      )}

      {/* ================= TABLES ================= */}
      {mode === 'list' ? (
        <AppreciationsTable
          data={filtered}
          busyIds={busyIds}
          onEdit={row => dispatch(openApprecModal(row))}
          onDelete={row => dispatch(deleteAppreciation(row.id))}
        />
      ) : (
        <AwardsTable
          data={awards}
          onAdd={() => dispatch(openAwardModal(null))}
          onEdit={row => dispatch(openAwardModal(row))}
          onToggle={row => dispatch(toggleAward(row.id))}
        />
      )}

      {/* ================= MODALS ================= */}
      <AppreciationModal />
      <AwardModal />
    </ScrollView>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

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

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
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

  primaryBtnActive: { backgroundColor: '#eff6ff' },

  primaryTxt: { fontWeight: '800', color: '#111827' },

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
});
