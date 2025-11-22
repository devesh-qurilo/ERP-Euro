import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAppreciations,
  setApprecFilters,
  setApprecMode,
  openApprecModal,
  openAwardModal,
  deleteAppreciation,
  toggleAward,
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

export default function AdminAppreciationsScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectApprecs);
  const awards = useSelector(selectAwards);
  const filters = useSelector(selectApprecsFilters);
  const busyIds = useSelector(selectApprecBusyIds);
  const mode = useSelector(selectApprecMode);
  console.log('selector list aprr', list);

  useEffect(() => {
    dispatch(fetchAppreciations());
  }, [dispatch]);

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

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Filters */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          <View style={{ minWidth: 150, marginRight: 8 }}>
            <Text style={styles.label}>Start</Text>
            <TextInput
              value={filters.start}
              onChangeText={start => dispatch(setApprecFilters({ start }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          <View style={{ minWidth: 150 }}>
            <Text style={styles.label}>End</Text>
            <TextInput
              value={filters.end}
              onChangeText={end => dispatch(setApprecFilters({ end }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
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

      {/* Buttons row */}
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

      {/* Tables */}
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

      {/* Modals */}
      <AppreciationModal />
      <AwardModal />
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
