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

import HolidaysTable from '../components/HolidaysTable';
import HolidaysCalendar from '../components/HolidaysCalendar';
import HolidayModal from '../components/HolidayModal';
import { selectEditingHoliday } from '../store/selectors';
import EditHolidayModal from '../components/EditHolidayModal';

import {
  fetchHolidays,
  openHolidayModal,
  closeHolidayModal,
  createHolidaysBulk,
  setHolidayFilters,
  setHolidayMode,
  updateHoliday,
  openHolidayEditModal,
  deleteHoliday,
} from '../store/actions';
import {
  selectHolidays,
  selectHolidaysLoading,
  selectHolidaysError,
  selectHolidayFilters,
  selectHolidayModalOpen,
  selectHolidayCreating,
  selectHolidayMode,
} from '../store/selectors';

export default function AdminHolidaysScreen() {
  const dispatch = useDispatch();
  const list = useSelector(selectHolidays);
  const loading = useSelector(selectHolidaysLoading);
  const error = useSelector(selectHolidaysError);
  const filters = useSelector(selectHolidayFilters);
  const addModalOpen = useSelector(selectHolidayModalOpen);
  const creating = useSelector(selectHolidayCreating);
  const mode = useSelector(selectHolidayMode);
  const editingHoliday = useSelector(selectEditingHoliday);

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = (filters.q || '').trim().toLowerCase();
    return list.filter(h => {
      if (q) {
        const hay = `${h.occasion} ${h.date}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.start) {
        const d = new Date(h.date);
        if (new Date(filters.start) > d) return false;
      }
      if (filters.end) {
        const d = new Date(h.date);
        if (new Date(filters.end) < d) return false;
      }
      return true;
    });
  }, [list, filters]);

  const resetFilters = () =>
    dispatch(setHolidayFilters({ q: '', start: '', end: '' }));

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      {/* 1) Filters */}
      <View style={s.card}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={s.label}>Search</Text>
            <TextInput
              value={filters.q}
              onChangeText={q => dispatch(setHolidayFilters({ q }))}
              placeholder="occasion or date"
              placeholderTextColor="#9ca3af"
              style={s.input}
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150, paddingRight: 8 }}>
            <Text style={s.label}>Start From</Text>
            <TextInput
              value={filters.start}
              onChangeText={start => dispatch(setHolidayFilters({ start }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={s.input}
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150 }}>
            <Text style={s.label}>End To</Text>
            <TextInput
              value={filters.end}
              onChangeText={end => dispatch(setHolidayFilters({ end }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={s.input}
            />
          </View>
        </View>

        {filters.q?.trim() || filters.start || filters.end ? (
          <Pressable onPress={resetFilters} style={s.clearBtn}>
            <Text style={s.clearTxt}>Clear All</Text>
          </Pressable>
        ) : null}
      </View>

      {/* 2) Buttons */}
      <View style={s.headerRow}>
        <Text style={s.sectionTitle}>Holidays</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            style={[s.primaryBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={() => dispatch(openHolidayModal())}
          >
            <Text style={[s.primaryTxt, { color: '#fff' }]}>
              + Create Holidays
            </Text>
          </Pressable>
          <Pressable
            style={s.primaryBtn}
            onPress={() => dispatch(setHolidayMode('list'))}
          >
            <Text style={s.primaryTxt}>List</Text>
          </Pressable>
          <Pressable
            style={s.primaryBtn}
            onPress={() => dispatch(setHolidayMode('calendar'))}
          >
            <Text style={s.primaryTxt}>Calendar</Text>
          </Pressable>
        </View>
      </View>

      {/* 3) Content */}
      {mode === 'calendar' ? (
        <HolidaysCalendar data={filtered} />
      ) : (
        // <HolidaysTable data={filtered} loading={loading} />
        <HolidaysTable
          data={filtered}
          loading={loading}
          onEdit={holiday => {
            // console.log('EDIT CLICKED', holiday);
            dispatch(openHolidayEditModal(holiday));
          }}
          onDelete={id => {
            // console.log('DELETE CLICKED', id);
            dispatch(deleteHoliday(id));
          }}
        />
      )}

      {error ? <Text style={s.err}>Error: {String(error)}</Text> : null}

      {/* <HolidayModal
        visible={modalOpen}
        onClose={() => dispatch(closeHolidayModal())}
        onSave={payload => dispatch(createHolidaysBulk(payload))}
        loading={creating}
      /> */}

      {/* <HolidayModal
        visible={modalOpen}
        editingHoliday={editingHoliday} // ✅ now exists
        onClose={() => dispatch(closeHolidayModal())}
        onSave={(id, payload) =>
          id
            ? dispatch(updateHoliday(id, payload))
            : dispatch(createHolidaysBulk(payload))
        }
        loading={creating}
      /> */}
      <HolidayModal
        visible={addModalOpen}
        onClose={() => dispatch(closeHolidayModal())}
        onSave={payload => dispatch(createHolidaysBulk(payload))}
        loading={creating}
      />

      <EditHolidayModal
        visible={!!editingHoliday}
        holiday={editingHoliday}
        onClose={() => dispatch(closeHolidayModal())}
        onSave={(id, payload) => dispatch(updateHoliday(id, payload))}
        loading={creating}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
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

  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primaryTxt: { fontWeight: '300', color: '#111827' },

  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
