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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal } from 'react-native';

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
import DealFormModal from '../../leads/deals/components/DealFormModal';
import {
  selectEditing,
  selectFormOpen,
} from '../../leads/deals/store/selectors';
import { setFormOpen } from '../../leads/deals/store/actions';

const defaultFilters = {
  q: '',
  category: '',
  client: '',
  startDate: '',
  endDate: '',
};

export default function AdminClientsScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const itemsl = useSelector(selectClients) || [];
  const loading = useSelector(selectClientsBusy);
  const saving = useSelector(selectClientsSave);
  const categories = useSelector(selectCategories) || [];

  // Local filter state (keeps UI snappy)
  const [filters, setFilters] = useState(defaultFilters);
  const [localSearch, setLocalSearch] = useState('');
  const [sheet, setSheet] = useState({ open: false, row: null });
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [addtoDeal, setAddtoDeal] = useState(false);
  const formOpen = useSelector(selectFormOpen);
  const editing = useSelector(selectEditing);
  // small debounce for search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(f => ({ ...f, q: localSearch }));
    }, 300);
    return () => clearTimeout(t);
  }, [localSearch]);

  // Load clients + categories on focus and when filters change
  // useFocusEffect(
  //   useCallback(() => {
  //     // refresh categories when screen focuses so dropdown stays up-to-date
  //     dispatch(A.categoryList());
  //     // fetch clients list with current filters
  //     // dispatch(A.list(filters));
  //   }, [dispatch, filters]),
  // );

  useFocusEffect(
    useCallback(() => {
      dispatch(A.categoryList());

      // load clients first time
      dispatch(A.list(defaultFilters));
    }, [dispatch]),
  );

  // const filteredItems = useMemo(() => {

  const items = useMemo(() => {
    return (itemsl || []).filter(c => {
      // 🔍 SEARCH
      if (filters.q) {
        const q = filters.q.toLowerCase();

        const match =
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.mobile?.toLowerCase().includes(q) ||
          c.clientId?.toLowerCase().includes(q);

        if (!match) return false;
      }

      // 📂 CATEGORY
      if (filters.category && c.category !== filters.category) return false;

      // 📅 START DATE
      if (filters.startDate) {
        const created = new Date(c.createdAt);
        const start = new Date(filters.startDate);

        if (created < start) return false;
      }

      // 📅 END DATE
      if (filters.endDate) {
        const created = new Date(c.createdAt);
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);

        if (created > end) return false;
      }

      return true;
    });
  }, [itemsl, filters]);

  // // console.log('devesh client data', itemsl);

  // Handlers
  function openMenu(row) {
    setSheet({ open: true, row });
  }
  function toDeal() {
    setSheet({ open: false, row: null });
    // nav.navigate('AdminDealsCreate', { prefillFromClient: sheet.row });
    dispatch(setFormOpen(true));
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
    <View style={{ flex: 1, backgroundColor: '#f3f4f6', padding: 2 }}>
      {/* Section 1: horizontal filter row */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingVertical: 8,
          // paddingHorizontal: 8,
          borderColor: '#e6e9ee',
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingRight: 8 }}
        >
          {/* FILTER SECTION */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {/* SEARCH */}
              <View style={{ width: 220 }}>
                {/* <Text
                  style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}
                >
                  Search
                </Text> */}
                <TextInput
                  placeholder="Name / Email / Client ID"
                  value={localSearch}
                  onChangeText={setLocalSearch}
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 40,
                    backgroundColor: '#fff',
                  }}
                />
              </View>

              {/* CATEGORY */}
              <View style={{ width: 200 }}>
                {/* <Text
                  style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}
                >
                  Category
                </Text> */}

                <TouchableOpacity
                  onPress={() => setCategoryModal(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                    height: 40,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                  }}
                >
                  <Text>{filters.category || 'Select Category'}</Text>
                </TouchableOpacity>
              </View>

              <Modal visible={categoryModal} transparent animationType="fade">
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#fff',
                      width: 320,
                      borderRadius: 10,
                      padding: 16,
                      maxHeight: 400,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        marginBottom: 10,
                      }}
                    >
                      Select Category
                    </Text>

                    <ScrollView>
                      <TouchableOpacity
                        onPress={() => {
                          applyFilters({ category: '' });
                          setCategoryModal(false);
                        }}
                        style={{ paddingVertical: 12 }}
                      >
                        <Text>All</Text>
                      </TouchableOpacity>

                      {categories.map(cat => (
                        <TouchableOpacity
                          key={cat.id}
                          onPress={() => {
                            applyFilters({ category: cat.categoryName });
                            setCategoryModal(false);
                          }}
                          style={{ paddingVertical: 12 }}
                        >
                          <Text>{cat.categoryName}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <TouchableOpacity
                      onPress={() => setCategoryModal(false)}
                      style={{ marginTop: 10 }}
                    >
                      <Text style={{ color: 'red', textAlign: 'center' }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* START DATE */}
              <View style={{ width: 180 }}>
                {/* <Text
                  style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}
                >
                  Start Date
                </Text> */}

                <TouchableOpacity
                  onPress={() => setShowStart(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                    height: 40,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                  }}
                >
                  <Text>{filters.startDate || 'Select Start Date'}</Text>
                </TouchableOpacity>
              </View>

              {/* END DATE */}
              <View style={{ width: 180 }}>
                {/* <Text
                  style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}
                >
                  End Date
                </Text> */}

                <TouchableOpacity
                  onPress={() => setShowEnd(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                    height: 40,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                  }}
                >
                  <Text>{filters.endDate || 'Select End Date'}</Text>
                </TouchableOpacity>
              </View>

              {/* APPLY BUTTON */}
              <View style={{ justifyContent: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => applyFilters({ q: localSearch })}
                  style={{
                    backgroundColor: '#2b6bd8',
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>

              {/* RESET */}
              <View style={{ justifyContent: 'flex-end' }}>
                <TouchableOpacity
                  onPress={clearFilters}
                  style={{
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
        {showStart && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowStart(false);
              if (date) {
                const d = date.toISOString().slice(0, 10);
                applyFilters({ startDate: d });
              }
            }}
          />
        )}

        {showEnd && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowEnd(false);
              if (date) {
                const d = date.toISOString().slice(0, 10);
                applyFilters({ endDate: d });
              }
            }}
          />
        )}
        <TouchableOpacity
          onPress={() => setAddOpen(true)}
          style={{
            backgroundColor: '#2b6bd8',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Add Clienthh</Text>
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
          console.log('payload', payload);
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
      {/* {addtoDeal && ( */}
      <DealFormModal
        open={formOpen}
        editing={editing}
        onClose={() => dispatch(setFormOpen(false))}
      />
      {/* )} */}
    </View>
  );
}
