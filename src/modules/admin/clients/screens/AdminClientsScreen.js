// src/modules/admin/clients/screens/AdminClientsScreen.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';

import * as A from '../store/actions';
import {
  selectClients,
  selectClientsBusy,
  selectClientsSave,
} from '../store/selectors';

import ClientFormModal from '../components/ClientFormModal';
import ClientsActionSheet from '../components/ClientsActionSheet';
import ClientsTable from '../components/ClientsTable';

const defaultFilters = { q: '', category: '', status: '' };

export default function AdminClientsScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const items = useSelector(selectClients) || [];
  const loading = useSelector(selectClientsBusy);
  const saving = useSelector(selectClientsSave);
  console.log('kashish', items);

  // Local filter state
  const [filters, setFilters] = useState(defaultFilters);
  const [localSearch, setLocalSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [sheet, setSheet] = useState({ open: false, row: null });

  // compact mode: keep pickers short by using small width
  const categories = useMemo(() => ['All', 'Premium', 'Standard', 'Basic'], []);
  const statuses = useMemo(
    () => ['All', 'ACTIVE', 'INACTIVE', 'SUSPENDED'],
    [],
  );

  // debounce for search (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(f => ({ ...f, q: localSearch }));
    }, 300);
    return () => clearTimeout(t);
  }, [localSearch]);

  // load on focus and when filters change
  useFocusEffect(
    useCallback(() => {
      dispatch(A.list(filters));
    }, [dispatch, filters]),
  );

  // --- Handlers ---
  function openMenu(row) {
    setSheet({ open: true, row });
  }
  function toDeal() {
    setSheet({ open: false, row: null });
    nav.navigate('AdminDealsCreate', { prefillFromClient: sheet.row });
  }
  function toView() {
    setSheet({ open: false, row: null });
    nav.navigate('AdminClientView', {
      clientId: sheet.row.clientId,
      id: sheet.row.id,
    });
  }

  function applyFilters() {
    Keyboard.dismiss();
    // ensure q from localSearch is applied immediately
    const merged = { ...filters, q: localSearch };
    setFilters(merged);
    dispatch(A.list(merged));
  }

  function clearFilters() {
    setLocalSearch('');
    setFilters(defaultFilters);
    dispatch(A.list(defaultFilters));
  }

  return (
    <View style={styles.container}>
      {/* COMPACT HORIZONTAL FILTER ROW */}
      <View style={styles.compactFilterCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.compactFilterRow}
        >
          {/* Search */}
          {/* <Text style={styles.compactPickerLabel}>Search</Text> */}
          <View style={styles.compactSearch}>
            <Icon name="search" size={16} style={{ marginLeft: 8 }} />

            <TextInput
              placeholder="Search name / email / clientId"
              value={localSearch}
              onChangeText={setLocalSearch}
              returnKeyType="search"
              onSubmitEditing={() => applyFilters()}
              style={styles.compactSearchInput}
            />
            {localSearch ? (
              <TouchableOpacity
                onPress={() => setLocalSearch('')}
                style={styles.compactClear}
              >
                <Icon name="x" size={14} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category (compact) */}
          <View style={styles.compactPickerWrap}>
            <Text style={styles.compactPickerLabel}>Category</Text>
            <View style={styles.compactPickerBox}>
              <Picker
                selectedValue={filters.category || 'All'}
                onValueChange={val =>
                  setFilters(f => ({
                    ...f,
                    category: val === 'All' ? '' : val,
                  }))
                }
                mode="dropdown"
                style={{ height: Platform.OS === 'ios' ? 32 : undefined }}
              >
                {categories.map(cat => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Status (compact) */}
          <View style={styles.compactPickerWrap}>
            <Text style={styles.compactPickerLabel}>Status</Text>
            <View style={styles.compactPickerBox}>
              <Picker
                selectedValue={filters.status || 'All'}
                onValueChange={val =>
                  setFilters(f => ({ ...f, status: val === 'All' ? '' : val }))
                }
                mode="dropdown"
                style={{ height: Platform.OS === 'ios' ? 32 : undefined }}
              >
                {statuses.map(s => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Small Apply button */}
          <TouchableOpacity
            onPress={applyFilters}
            style={styles.compactApplyBtn}
          >
            <Icon name="filter" size={14} color="#fff" />
            <Text style={styles.compactApplyText}> Apply</Text>
          </TouchableOpacity>

          {/* Clear */}
          <TouchableOpacity
            onPress={clearFilters}
            style={styles.compactClearBtn}
          >
            <Text style={styles.compactClearText}>Clear</Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View style={{ width: 8 }} />

          {/* Add Client (compact) */}
          <TouchableOpacity
            onPress={() => setAddOpen(true)}
            style={styles.compactAddBtn}
            disabled={saving}
          >
            <Icon name="user-plus" size={14} color="#111827" />
            <Text style={styles.compactAddText}> Add Client</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* TABLE */}
      <View style={{ flex: 1, marginTop: 12 }}>
        <ClientsTable items={items} loading={loading} onMenu={openMenu} />
      </View>

      {/* ACTION SHEET */}
      <ClientsActionSheet
        visible={sheet.open}
        onClose={() => setSheet({ open: false, row: null })}
        onView={toView}
        onEdit={() => {
          setEditRow(sheet.row);
          setSheet({ open: false, row: null });
        }}
        onDelete={() => {
          if (!sheet.row) return;
          dispatch(A.remove(sheet.row.id));
          setSheet({ open: false, row: null });
        }}
        onMoveToDeal={toDeal}
      />

      {/* ADD */}
      <ClientFormModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={payload => {
          dispatch(A.create(payload));
          setAddOpen(false);
        }}
      />

      {/* EDIT */}
      <ClientFormModal
        visible={!!editRow}
        initial={editRow}
        onClose={() => setEditRow(null)}
        onSubmit={payload => {
          dispatch(A.update(editRow.id, payload));
          setEditRow(null);
        }}
      />
    </View>
  );
}

/* Styles */
const styles = {
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 12 },
  compactFilterCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e6e9ee',
  },
  compactFilterRow: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  compactSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e9ee',
    paddingHorizontal: 6,
    height: 40,
    marginRight: 8,
    minWidth: 240,
  },
  compactSearchInput: { flex: 1, paddingHorizontal: 8, height: 40 },
  compactClear: { paddingHorizontal: 6 },

  compactPickerWrap: {
    marginRight: 8,
    minWidth: 120,
  },
  compactPickerLabel: { fontSize: 10, color: '#6b7280', marginBottom: 4 },
  compactPickerBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e9ee',
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
  },

  compactApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  compactApplyText: { color: '#fff', fontWeight: '700' },

  compactClearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e9ee',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  compactClearText: { color: '#6b7280', fontWeight: '600' },

  compactAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  compactAddText: { color: '#111827', fontWeight: '700' },
};
