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
  selectCategories,
} from '../store/selectors';

import ClientFormModal from '../components/ClientFormModal';
import ClientsActionSheet from '../components/ClientsActionSheet';
import ClientsTable from '../components/ClientsTable';

const defaultFilters = { q: '', category: '' };

export default function AdminClientsScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const items = useSelector(selectClients) || [];
  const loading = useSelector(selectClientsBusy);
  const saving = useSelector(selectClientsSave);
  const categories = useSelector(selectCategories) || [];

  // Local filter state (keeps UI snappy)
  const [filters, setFilters] = useState(defaultFilters);
  const [localSearch, setLocalSearch] = useState('');
  const [sheet, setSheet] = useState({ open: false, row: null });
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  // small debounce for search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(f => ({ ...f, q: localSearch }));
    }, 300);
    return () => clearTimeout(t);
  }, [localSearch]);

  // Load clients + categories on focus and when filters change
  useFocusEffect(
    useCallback(() => {
      // refresh categories when screen focuses so dropdown stays up-to-date
      dispatch(A.categoryList());
      // fetch clients list with current filters
      dispatch(A.list(filters));
    }, [dispatch, filters]),
  );

  // Handlers
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

  // Apply the filters (dispatch list)
  function applyFilters(newFilters = {}) {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    dispatch(A.list(merged));
  }

  function clearFilters() {
    setLocalSearch('');
    setFilters(defaultFilters);
    dispatch(A.list(defaultFilters));
  }

  // Category change handler (value is categoryName string per earlier implementation)
  function onCategoryChange(value) {
    const next = value === 'All' ? '' : value;
    applyFilters({ category: next });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6', padding: 12 }}>
      {/* Section 1: horizontal filter row */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: '#e6e9ee',
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingRight: 8 }}
        >
          {/* Search box */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e6e9ee',
              paddingHorizontal: 8,
              marginRight: 8,
              height: 40,
              minWidth: 220,
            }}
          >
            <Icon name="search" size={16} style={{ marginRight: 6 }} />
            <TextInput
              placeholder="Search name / email / clientId"
              value={localSearch}
              onChangeText={setLocalSearch}
              returnKeyType="search"
              onSubmitEditing={() => applyFilters({ q: localSearch })}
              style={{ flex: 1, height: 40 }}
            />
            {localSearch ? (
              <TouchableOpacity
                onPress={() => setLocalSearch('')}
                style={{ padding: 6 }}
              >
                <Icon name="x" size={14} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Compact Category dropdown */}
          <View
            style={{
              minWidth: 200,
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
              Category
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e6e9ee',
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: '#fff',
                height: 40,
                justifyContent: 'center',
              }}
            >
              <Picker
                selectedValue={filters.category || 'All'}
                onValueChange={onCategoryChange}
                mode="dropdown"
                style={{ height: Platform.OS === 'ios' ? 36 : undefined }}
              >
                <Picker.Item label="All" value="All" />
                {(categories || []).map(cat => (
                  <Picker.Item
                    key={cat.id}
                    label={cat.categoryName}
                    value={cat.categoryName}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Apply / Clear quick controls */}
          <TouchableOpacity
            onPress={() => applyFilters({ q: localSearch })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#111827',
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              marginLeft: 6,
            }}
          >
            <Icon name="refresh-ccw" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6 }}>
              Apply
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearFilters}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              backgroundColor: '#fff',
              marginLeft: 8,
            }}
          >
            <Text style={{ color: '#6b7280', fontWeight: '600' }}>Clear</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Section 2: Add button / actions (separate row so filters stay compact) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => setAddOpen(true)}
          style={{
            backgroundColor: '#111827',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Add Client</Text>
        </TouchableOpacity>
      </View>

      {/* Section 3: Table */}
      <View style={{ flex: 1, marginTop: 12 }}>
        <ClientsTable items={items} loading={loading} onMenu={openMenu} />
      </View>

      {/* Action sheet */}
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

      {/* Add modal */}
      <ClientFormModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={payload => {
          dispatch(A.create(payload));
          setAddOpen(false);
        }}
      />

      {/* Edit modal */}
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
