import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMyLeads } from '../store/actions';
import {
  selectLeads,
  selectLeadsLoading,
  selectLeadsError,
} from '../store/selectors';

import LeadsFilterCard from '../components/LeadsFilterCard';
import LeadsListTable from '../components/LeadsListTable';
import AddLeadModal from '../components/AddLeadModal';

const EmployeeLeadsScreen = () => {
  const dispatch = useDispatch();

  // Store data
  const all = useSelector(selectLeads);
  const load = useSelector(selectLeadsLoading);
  const err = useSelector(selectLeadsError);

  // Resolve employeeId for prefill in Add modal
  const employeeId = useSelector(
    s =>
      s.employee?.profile?.data?.employeeId ||
      s.employee?.settings?.profile?.data?.employeeId ||
      s.auth?.user?.employeeId ||
      '',
  );

  useEffect(() => {
    dispatch(fetchMyLeads());
  }, [dispatch]);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [source, setSource] = useState('All');
  const [category, setCategory] = useState('All');
  const [start, setStart] = useState(''); // YYYY-MM-DD
  const [end, setEnd] = useState('');

  // Options derived from data
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

  const hasFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          start ||
          end ||
          status !== 'All' ||
          source !== 'All' ||
          category !== 'All',
      ),
    [search, start, end, status, source, category],
  );

  // Only filter when something is set; otherwise show all
  const filtered = useMemo(() => {
    if (!hasFilters) return all;

    const norm = (v = '') => String(v).toLowerCase();
    return all.filter(l => {
      if (search.trim()) {
        const hay = `${l.name} ${l.email} ${l.companyName} ${l.city} ${l.country}`;
        if (!norm(hay).includes(norm(search))) return false;
      }
      if (status !== 'All' && l.status !== status) return false;
      if (source !== 'All' && l.leadSource !== source) return false;
      if (category !== 'All' && l.clientCategory !== category) return false;

      const created = new Date(l.createdAt);
      if (start && new Date(start) > created) return false;
      if (end && new Date(end) < created) return false;
      return true;
    });
  }, [all, hasFilters, search, status, source, category, start, end]);

  const clearFilters = () => {
    setSearch('');
    setStatus('All');
    setSource('All');
    setCategory('All');
    setStart('');
    setEnd('');
  };

  // Add Lead modal
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      keyboardShouldPersistTaps="handled"
    >
      {/* Filters card */}
      <LeadsFilterCard
        search={search}
        onSearch={setSearch}
        status={status}
        statusOpts={statusOpts}
        onStatus={setStatus}
        source={source}
        sourceOpts={sourceOpts}
        onSource={setSource}
        category={category}
        categoryOpts={categoryOpts}
        onCategory={setCategory}
        start={start}
        onStart={setStart}
        end={end}
        onEnd={setEnd}
        hasFilters={hasFilters}
        onClear={clearFilters}
        onOpenAdd={() => setOpenAdd(true)}
      />

      {/* Table */}
      <Text style={styles.sectionTitle}>Lead Contacts</Text>
      <LeadsListTable rows={filtered} />

      {load ? <Text style={styles.note}>Loading…</Text> : null}
      {err ? <Text style={styles.err}>Error: {String(err)}</Text> : null}

      {/* Add Lead modal */}
      <AddLeadModal
        visible={openAdd}
        onClose={() => setOpenAdd(false)}
        defaultEmployeeId={employeeId}
      />
    </ScrollView>
  );
};

export default EmployeeLeadsScreen;

/* --------------------------- styles --------------------------- */
const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0b0b0c',
    marginTop: 10,
  },
  note: { color: '#6b7280', textAlign: 'center', marginTop: 10 },
  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },
});
