// src/modules/employee/leads/screens/EmployeeLeadsScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeads } from '../store/actions';
import {
  selectLeads,
  selectLeadsLoading,
  selectLeadsError,
} from '../store/selectors';
import LeadsListTable from '../components/LeadsListTable';
import Select from '../components/Select';

const dateOnly = iso => new Date(iso).toISOString().slice(0, 10); // YYYY-MM-DD

export default function EmployeeLeadsScreen() {
  const dispatch = useDispatch();
  const all = useSelector(selectLeads);
  const load = useSelector(selectLeadsLoading);
  const err = useSelector(selectLeadsError);

  useEffect(() => {
    dispatch(fetchMyLeads());
  }, [dispatch]);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [source, setSource] = useState('All');
  const [category, setCategory] = useState('All');

  const [start, setStart] = useState(''); // YYYY-MM-DD (text field to avoid extra deps)
  const [end, setEnd] = useState('');

  // derive filter options from data
  const statusOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(all.map(x => x.status).filter(Boolean))),
    ],
    [all],
  );
  const sourceOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(all.map(x => x.leadSource).filter(Boolean))),
    ],
    [all],
  );
  const categoryOpts = useMemo(
    () => [
      'All',
      ...Array.from(new Set(all.map(x => x.clientCategory).filter(Boolean))),
    ],
    [all],
  );

  const filtered = useMemo(() => {
    return all.filter(l => {
      // keyword across a few fields
      const k = search.trim().toLowerCase();
      if (k) {
        const hay =
          `${l.name} ${l.email} ${l.companyName} ${l.city} ${l.country}`.toLowerCase();
        if (!hay.includes(k)) return false;
      }
      if (status !== 'All' && l.status !== status) return false;
      if (source !== 'All' && l.leadSource !== source) return false;
      if (category !== 'All' && l.clientCategory !== category) return false;
      if (start) {
        if (dateOnly(l.createdAt) < start) return false;
      }
      if (end) {
        if (dateOnly(l.createdAt) > end) return false;
      }
      return true;
    });
  }, [all, search, status, source, category, start, end]);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Filter bar (matches your screenshot vibe) */}
      <View style={styles.filtersRow}>
        <View style={[styles.duration, { flex: 1.2 }]}>
          <Text style={styles.durLabel}>Duration</Text>
          <View style={styles.durInputs}>
            <TextInput
              value={start}
              onChangeText={setStart}
              placeholder="Start YYYY-MM-DD"
              style={styles.durInput}
              autoCapitalize="none"
            />
            <Text style={{ color: '#9ca3af', marginHorizontal: 6 }}>to</Text>
            <TextInput
              value={end}
              onChangeText={setEnd}
              placeholder="End YYYY-MM-DD"
              style={styles.durInput}
              autoCapitalize="none"
            />
          </View>
        </View>
        <Pressable
          style={styles.filterBtn}
          onPress={() =>
            Alert.alert('Filters', 'Advanced filters coming soon.')
          }
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>⚙️</Text>
          <Text style={{ fontWeight: '800', color: '#111827' }}>Filters</Text>
        </Pressable>
      </View>

      {/* Quick filters row */}
      <View style={styles.quickFilters}>
        <TextInput
          style={[styles.search]}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name/email/company"
        />
        <Select
          style={{ width: 140 }}
          label="Status"
          value={status}
          options={statusOpts}
          onChange={setStatus}
        />
        <Select
          style={{ width: 160 }}
          label="Source"
          value={source}
          options={sourceOpts}
          onChange={setSource}
        />
        <Select
          style={{ width: 180 }}
          label="Category"
          value={category}
          options={categoryOpts}
          onChange={setCategory}
        />
      </View>

      {/* Add Lead button (UI only) */}
      <Pressable
        style={styles.addBtn}
        onPress={() =>
          Alert.alert('Add Lead', 'Create API will be wired later.')
        }
      >
        <Text style={styles.addTxt}>+ Add Lead</Text>
      </Pressable>

      {/* Table */}
      <Text style={styles.sectionTitle}>Lead Contacts</Text>
      <LeadsListTable rows={filtered} />

      {load ? <Text style={styles.note}>Loading…</Text> : null}
      {err ? <Text style={styles.err}>Error: {String(err)}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  filtersRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },

  duration: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  durLabel: { fontWeight: '900', color: '#111827', marginBottom: 6 },
  durInputs: { flexDirection: 'row', alignItems: 'center' },
  durInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },

  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },

  quickFilters: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  addBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#2c7be5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  addTxt: { color: '#fff', fontWeight: '900' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0b0b0c',
    marginTop: 4,
  },

  note: { color: '#6b7280', textAlign: 'center', marginTop: 10 },
  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
