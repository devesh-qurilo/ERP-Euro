// src/modules/admin/leads/screens/AdminLeadContactsScreen.js
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
import {
  fetchAdminLeads,
  setAdminLeadsFilters,
  deleteAdminLead,
  updateAdminLead,
  createAdminLeadRequest, // <-- if your action is named differently, adjust here
} from '../store/actions';
import {
  selectAdminLeads,
  selectAdminLeadsLoading,
  selectAdminLeadsError,
  selectAdminLeadsFilters,
  selectAdminLeadsBusyIds,
} from '../store/selectors';
import LeadsTable from '../components/LeadsTable';
import AddLeadModal from '../contacts/components/AddLeadModal';

const Select = ({ label, value, options, onChange, style }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[{ minWidth: 150, marginRight: 8, marginBottom: 8 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.selectBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {String(value ?? 'All')}
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

export default function AdminLeadContactsScreen() {
  const dispatch = useDispatch();

  // ------- Redux state -------
  const list = useSelector(selectAdminLeads);
  const loading = useSelector(selectAdminLeadsLoading);
  const error = useSelector(selectAdminLeadsError);
  const filters = useSelector(selectAdminLeadsFilters) || {
    q: '',
    source: 'All',
    owner: 'All',
    status: 'All',
    start: '',
    end: '',
  };
  const busyIds = useSelector(selectAdminLeadsBusyIds);
  const me = useSelector(s => s?.auth?.profile?.employeeId) || 'EMP-009';

  useEffect(() => {
    dispatch(fetchAdminLeads());
  }, [dispatch]);

  // ------- Filters options -------
  const sources = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set((list || []).map(x => x.leadSource).filter(Boolean)),
      ),
    ],
    [list],
  );
  const owners = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set((list || []).map(x => x.leadOwner).filter(Boolean)),
      ),
    ],
    [list],
  );
  const statuses = useMemo(
    () => [
      'All',
      ...Array.from(new Set((list || []).map(x => x.status).filter(Boolean))),
    ],
    [list],
  );

  // ------- Filtering -------
  const filtered = useMemo(() => {
    const q = String(filters.q || '')
      .trim()
      .toLowerCase();
    return (list || []).filter(l => {
      if (q) {
        const hay = `${l.name} ${l.email} ${l.companyName || ''} ${
          l.mobileNumber || ''
        } ${l.city || ''} ${l.country || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (
        (filters.source || 'All') !== 'All' &&
        (l.leadSource || '') !== filters.source
      )
        return false;
      if (
        (filters.owner || 'All') !== 'All' &&
        (l.leadOwner || '') !== filters.owner
      )
        return false;
      if (
        (filters.status || 'All') !== 'All' &&
        (l.status || '') !== filters.status
      )
        return false;

      const c = l.createdAt ? new Date(l.createdAt) : null;
      if (filters.start) {
        const s = new Date(filters.start);
        if (c && s > c) return false;
      }
      if (filters.end) {
        const e = new Date(filters.end);
        if (c && e < c) return false;
      }
      return true;
    });
  }, [list, filters]);

  const hasFilters =
    !!String(filters.q || '').trim() ||
    !!filters.start ||
    !!filters.end ||
    (filters.source || 'All') !== 'All' ||
    (filters.owner || 'All') !== 'All' ||
    (filters.status || 'All') !== 'All';

  const resetFilters = () =>
    dispatch(
      setAdminLeadsFilters({
        q: '',
        source: 'All',
        owner: 'All',
        status: 'All',
        start: '',
        end: '',
      }),
    );

  // ------- Row actions -------
  const onView = lead => {
    // future screen
    Alert.alert('View Lead', `Open view for: ${lead.name}`);
  };
  const onEdit = lead => {
    // future screen
    Alert.alert('Edit Lead', `Open edit for: ${lead.name}`);
  };
  const onDelete = lead => {
    Alert.alert('Delete Lead', `Delete ${lead.name}?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteAdminLead(lead.id)),
      },
    ]);
  };
  const onConvert = lead => {
    // future screen
    Alert.alert('Convert', `Convert ${lead.name} to Client (future screen).`);
  };

  // ------- Add Lead modal wiring -------
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* 1) Filters */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ flexBasis: '60%', minWidth: 220, paddingRight: 8 }}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={String(filters.q || '')}
              onChangeText={q => dispatch(setAdminLeadsFilters({ q }))}
              placeholder="name, email, company, phone, location"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150, paddingRight: 8 }}>
            <Text style={styles.label}>Start From</Text>
            <TextInput
              value={String(filters.start || '')}
              onChangeText={start => dispatch(setAdminLeadsFilters({ start }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
          <View style={{ flexBasis: '20%', minWidth: 150 }}>
            <Text style={styles.label}>End To</Text>
            <TextInput
              value={String(filters.end || '')}
              onChangeText={end => dispatch(setAdminLeadsFilters({ end }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          <Select
            label="Source"
            value={filters.source || 'All'}
            options={sources}
            onChange={source => dispatch(setAdminLeadsFilters({ source }))}
          />
          <Select
            label="Owner"
            value={filters.owner || 'All'}
            options={owners}
            onChange={owner => dispatch(setAdminLeadsFilters({ owner }))}
          />
          <Select
            label="Status"
            value={filters.status || 'All'}
            options={statuses}
            onChange={status => dispatch(setAdminLeadsFilters({ status }))}
          />
        </View>

        {hasFilters && (
          <Pressable onPress={resetFilters} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* 2) Header + Add */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Lead Contacts</Text>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: '#1d4ed8' }]}
          onPress={() => setOpenAdd(true)}
        >
          <Text style={[styles.primaryTxt, { color: '#fff' }]}>+ Add Lead</Text>
        </Pressable>
      </View>

      {/* 3) List (horizontal table) */}
      <LeadsTable
        data={filtered}
        loading={loading}
        busyIds={busyIds}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onConvert={onConvert}
      />
      {error && <Text style={styles.err}>Error: {String(error)}</Text>}

      {/* Add Lead Modal (inline) */}
      <AddLeadModal
        visible={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={payload => {
          // auto-inject sensible defaults if the modal doesn’t already
          const body = {
            ...payload,
            addedBy: payload?.addedBy || me,
            leadOwner: payload?.leadOwner || me,
          };
          dispatch(createAdminLeadRequest(body));
          setOpenAdd(false);
        }}
        currentUserId={me}
        defaultOwnerId={me}
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
  primaryTxt: { fontWeight: '900', color: '#111827' },
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
