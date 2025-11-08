import React, { useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CreditNotesTable from './components/CreditNotesTable';
import CreditNoteViewModal from './components/CreditNoteViewModal';
import CreditNoteEditModal from './components/CreditNoteEditModal';

import {
  listByClient,
  setFilters,
  openView,
  closeView,
  openEdit,
  closeEdit,
  updateCreditNote,
  deleteCreditNote,
} from './store/actions';

import {
  selectCNCList,
  selectCNCLoading,
  selectCNCError,
  selectCNCFilters,
  selectCNCBusyIds,
  selectCNCViewOpen,
  selectCNCViewing,
  selectCNCEditOpen,
  selectCNCEditing,
  selectCNCEditBusy,
} from './store/selectors';

export default function ClientCreditNotesTab({ route }) {
  const dispatch = useDispatch();
  const clientId = route?.params?.client?.clientId || route?.params?.clientId;

  const list = useSelector(selectCNCList);
  const loading = useSelector(selectCNCLoading);
  const error = useSelector(selectCNCError);
  const filters = useSelector(selectCNCFilters);
  const busyIds = useSelector(selectCNCBusyIds);

  const viewOpen = useSelector(selectCNCViewOpen);
  const viewing = useSelector(selectCNCViewing);

  const editOpen = useSelector(selectCNCEditOpen);
  const editing = useSelector(selectCNCEditing);
  const editBusy = useSelector(selectCNCEditBusy);

  useEffect(() => {
    if (clientId) dispatch(listByClient(clientId));
  }, [clientId, dispatch]);

  const filtered = useMemo(() => {
    const q = (filters.q || '').toLowerCase().trim();
    if (!q) return list;
    return list.filter(x =>
      `${x.creditNoteNumber} ${x.client?.name ?? ''} ${
        x.project?.projectName ?? ''
      }`
        .toLowerCase()
        .includes(q),
    );
  }, [list, filters]);

  return (
    <View style={{ padding: 12, gap: 12 }}>
      <View style={s.card}>
        <Text style={s.title}>Filters</Text>
        <Text style={s.label}>Search</Text>
        <TextInput
          value={filters.q}
          onChangeText={q => dispatch(setFilters({ q }))}
          placeholder="credit-note no., client, project…"
          placeholderTextColor="#9ca3af"
          style={s.input}
        />
        {!!error && (
          <Text style={{ color: '#b91c1c', marginTop: 8 }}>
            {String(error)}
          </Text>
        )}
      </View>

      <CreditNotesTable
        data={filtered}
        loading={loading}
        busyIds={busyIds}
        onView={item => dispatch(openView(item))}
        onEdit={item => dispatch(openEdit(item))}
        onDelete={item =>
          Alert.alert('Delete', `Delete ${item.creditNoteNumber}?`, [
            { text: 'Cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => dispatch(deleteCreditNote(item.id, clientId)),
            },
          ])
        }
      />

      <CreditNoteViewModal
        visible={viewOpen}
        item={viewing}
        onClose={() => dispatch(closeView())}
      />

      <CreditNoteEditModal
        visible={editOpen}
        item={editing}
        busy={editBusy}
        onClose={() => dispatch(closeEdit())}
        onSave={payload =>
          dispatch(updateCreditNote(editing.id, payload, clientId))
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 20, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
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
});
