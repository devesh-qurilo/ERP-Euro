// src/modules/admin/clients/screens/AdminClientsScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as A from '../store/actions';
import {
  selectClients,
  selectClientsBusy,
  selectClientsSave,
} from '../store/selectors';

import ClientFormModal from '../components/ClientFormModal';
import ClientsActionSheet from '../components/ClientsActionSheet';
import ClientsTable from '../components/ClientsTable';

export default function AdminClientsScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();
  const items = useSelector(selectClients);
  const loading = useSelector(selectClientsBusy);
  const saving = useSelector(selectClientsSave);

  const [filters, setFilters] = useState({ q: '', category: '', status: '' }); // wire your actual filter inputs if needed
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [sheet, setSheet] = useState({ open: false, row: null });

  // load on focus (and when filters change)
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

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      {/* Section 1: Filters (simple stub; replace with your inputs) */}
      <View
        style={{
          marginBottom: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
        }}
      >
        <Text style={{ fontWeight: '700', marginBottom: 6 }}>Filters</Text>
        {/* plug your TextInputs / dropdowns and call setFilters(...) */}
        <Text style={{ color: '#6b7280' }}>
          Search / Category / Status … (wired to redux list)
        </Text>
      </View>

      {/* Section 2: Actions */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 12,
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
      <ClientsTable items={items} loading={loading} onMenu={openMenu} />

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
          dispatch(A.remove(sheet.row.id));
          setSheet({ open: false, row: null });
        }}
        onMoveToDeal={toDeal}
      />

      {/* Add */}
      <ClientFormModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={payload => {
          dispatch(A.create(payload));
          setAddOpen(false);
        }}
      />

      {/* Edit */}
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
