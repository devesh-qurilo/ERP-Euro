import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchList,
  deleteDeal,
  setFormOpen,
  setEditing,
  setParams,
  setFollowupOpen,
} from '../../deals/store/actions';
import {
  selectDeals,
  selectDealsBusy,
  selectDealsParams,
  selectFormOpen,
  selectEditing,
} from '../../deals/store/selectors';
import { adminLeadsAPI } from '../../../../../services/api';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../../../../../navigation/rootNav';

export default function AdminDealScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();
  const navigation = useNavigation();

  const deals = useSelector(selectDeals);
  const busy = useSelector(selectDealsBusy);
  const params = useSelector(selectDealsParams);
  const formOpen = useSelector(selectFormOpen);
  const editing = useSelector(selectEditing);

  // filters
  const [pipeline, setPipeline] = useState(params.pipeline || 'Sales');
  const [dateFrom, setDateFrom] = useState(params.dateFrom || '');
  const [dateTo, setDateTo] = useState(params.dateTo || '');

  // leads dropdown for create/edit
  const [leadOptions, setLeadOptions] = useState([]);
  useEffect(() => {
    dispatch(fetchList());
    (async () => {
      try {
        const data = await adminLeadsAPI.list({ page: 0, size: 100 });
        const rows = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];
        setLeadOptions(
          rows.map(x => ({
            id: x.id,
            name: x.name || x.leadName || `Lead #${x.id}`,
          })),
        );
      } catch {}
    })();
  }, [dispatch]);

  const onApplyFilters = () => {
    dispatch(setParams({ pipeline, dateFrom, dateTo }));
    dispatch(fetchList({ pipeline, dateFrom, dateTo }));
  };

  // section 1: filters
  const Filters = () => (
    <View
      style={{
        padding: 12,
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text>Duration</Text>
      <TextInput
        placeholder="Start (YYYY-MM-DD)"
        value={dateFrom}
        onChangeText={setDateFrom}
        style={{ borderWidth: 1, borderRadius: 8, padding: 8, minWidth: 140 }}
      />
      <TextInput
        placeholder="End (YYYY-MM-DD)"
        value={dateTo}
        onChangeText={setDateTo}
        style={{ borderWidth: 1, borderRadius: 8, padding: 8, minWidth: 140 }}
      />
      <Text>Pipeline</Text>
      <TextInput
        placeholder="Sales / Default Pipeline"
        value={pipeline}
        onChangeText={setPipeline}
        style={{ borderWidth: 1, borderRadius: 8, padding: 8, minWidth: 160 }}
      />
      <TouchableOpacity
        onPress={onApplyFilters}
        style={{
          backgroundColor: '#222',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff' }}>Apply</Text>
      </TouchableOpacity>
    </View>
  );

  // section 2: buttons
  const Buttons = () => (
    <View
      style={{
        paddingHorizontal: 12,
        paddingBottom: 8,
        flexDirection: 'row',
        gap: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          dispatch(setEditing(null));
          dispatch(setFormOpen(true));
        }}
        style={{
          backgroundColor: '#3F6AE1',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>+ Add Deal</Text>
      </TouchableOpacity>

      {/* List button (default active) */}
      <TouchableOpacity
        onPress={() => dispatch(fetchList())}
        style={{
          backgroundColor: '#333',
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff' }}>List</Text>
      </TouchableOpacity>

      {/* Kanban button (future) */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AdminDealKanban')}
        style={{
          backgroundColor: '#eee',
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
      >
        <Text>Kanban</Text>
      </TouchableOpacity>
    </View>
  );

  // action menu item
  const RowActions = ({ item }) => {
    const [open, setOpen] = useState(false);

    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={{ paddingHorizontal: 8 }}
        >
          <Text>⋯</Text>
        </TouchableOpacity>
        {open && (
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 22,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderRadius: 8,
              zIndex: 50,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpen(false);
                nav.navigate('AdminDealView', { dealId: item.id });
              }}
              style={{ padding: 10 }}
            >
              <Text>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOpen(false);
                dispatch(setEditing(item));
                dispatch(setFormOpen(true));
              }}
              style={{ padding: 10 }}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOpen(false);
                dispatch(deleteDeal(item.id));
              }}
              style={{ padding: 10 }}
            >
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOpen(false);
                dispatch(setFollowupOpen(true, item.id));
              }}
              style={{ padding: 10 }}
            >
              <Text>Add Follow-up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // section 3: table list (horizontal)
  const Table = () => (
    <View style={{ flex: 1, padding: 12 }}>
      {busy ? (
        <ActivityIndicator />
      ) : (
        <ScrollView horizontal>
          <View
            style={{
              minWidth: 800,
              borderWidth: 1,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <View style={{ backgroundColor: '#f5f5f5', flexDirection: 'row' }}>
              {[
                'Deal Name',
                'Lead Name',
                'Contact Details',
                'Stage',
                'Agent',
                'Value',
                'Actions',
              ].map((h, idx) => (
                <View
                  key={idx}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRightWidth: idx < 6 ? 1 : 0,
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>{h}</Text>
                </View>
              ))}
            </View>
            {/* Rows */}
            {deals.map((it, i) => (
              <View
                key={it.id ?? i}
                style={{ flexDirection: 'row', borderTopWidth: 1 }}
              >
                <View style={{ flex: 1, padding: 12 }}>
                  <Text>{it.title}</Text>
                </View>
                <View style={{ flex: 1, padding: 12 }}>
                  <Text>{it.dealAgentMeta?.name || '-'}</Text>
                </View>
                <View style={{ flex: 1, padding: 12 }}>
                  <Text>{it.dealAgentMeta?.name ?? '--'}</Text>
                  <Text style={{ color: '#777' }}>
                    {it.dealAgentMeta?.employeeId ?? ''}
                  </Text>
                </View>
                <View style={{ flex: 1, padding: 12 }}>
                  <Text>{it.dealStage}</Text>
                </View>
                <View style={{ flex: 1, padding: 12 }}>
                  <Text>{it.dealAgent}</Text>
                </View>
                <View style={{ flex: 1, padding: 12 }}>
                  <Text>{String(it.value)}</Text>
                </View>
                <View
                  style={{ width: 80, padding: 12, alignItems: 'flex-end' }}
                >
                  <RowActions item={it} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Filters />
      <Buttons />
      <Table />
      <DealFormModal
        open={formOpen}
        editing={editing}
        onClose={() => dispatch(setFormOpen(false))}
        leadOptions={leadOptions}
      />
      <FollowupModal />
    </View>
  );
}

// -------------- Add/Edit Deal Modal ----------------
function DealFormModal({ open, editing, onClose, leadOptions }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(() => ({
    title: editing?.title || '',
    leadId: editing?.leadId ?? null,
    pipeline: editing?.pipeline || 'Default Pipeline',
    dealStage: editing?.dealStage || 'Generated',
    dealCategory: editing?.dealCategory || 'Corporate',
    dealAgent: editing?.dealAgent || '',
    dealWatchers: editing?.dealWatchers || [],
    value: editing?.value ?? '',
    expectedCloseDate: editing?.expectedCloseDate || '',
    dealContact: editing?.dealContact || '',
  }));

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        leadId: editing.leadId ?? null,
        pipeline: editing.pipeline || 'Default Pipeline',
        dealStage: editing.dealStage || 'Generated',
        dealCategory: editing.dealCategory || 'Corporate',
        dealAgent: editing.dealAgent || '',
        dealWatchers: editing.dealWatchers || [],
        value: editing.value ?? '',
        expectedCloseDate: editing.expectedCloseDate || '',
        dealContact: editing.dealContact || '',
      });
    } else {
      setForm(f => ({ ...f, title: '', leadId: null, value: '' }));
    }
  }, [editing, open]);

  const onSave = () => {
    const payload = {
      ...form,
      value: Number(form.value) || 0,
      dealWatchers: Array.isArray(form.dealWatchers)
        ? form.dealWatchers
        : String(form.dealWatchers || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
    };
    if (editing?.id) {
      dispatch({ type: 'admin/deals/UPDATE_REQUEST', id: editing.id, payload });
    } else {
      // leadId required on create
      dispatch({ type: 'admin/deals/CREATE_REQUEST', payload });
    }
  };

  if (!open) return null;
  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
            {editing ? 'Edit Deal' : 'Add Deal'}
          </Text>

          <TextInput
            placeholder="Title"
            value={form.title}
            onChangeText={v => setForm({ ...form, title: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          {/* Lead selector (simple text input to keep RN minimal) */}
          <TextInput
            placeholder="Lead ID"
            value={form.leadId?.toString() || ''}
            onChangeText={v =>
              setForm({ ...form, leadId: v ? Number(v) : null })
            }
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Pipeline"
            value={form.pipeline}
            onChangeText={v => setForm({ ...form, pipeline: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Deal Stage"
            value={form.dealStage}
            onChangeText={v => setForm({ ...form, dealStage: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Deal Category"
            value={form.dealCategory}
            onChangeText={v => setForm({ ...form, dealCategory: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Deal Agent (EMP-XXX)"
            value={form.dealAgent}
            onChangeText={v => setForm({ ...form, dealAgent: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Deal Watchers (comma EMP-IDs)"
            value={
              Array.isArray(form.dealWatchers)
                ? form.dealWatchers.join(',')
                : String(form.dealWatchers || '')
            }
            onChangeText={v => setForm({ ...form, dealWatchers: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Value"
            keyboardType="numeric"
            value={String(form.value ?? '')}
            onChangeText={v => setForm({ ...form, value: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Expected Close Date (YYYY-MM-DD)"
            value={form.expectedCloseDate}
            onChangeText={v => setForm({ ...form, expectedCloseDate: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Deal Contact"
            value={form.dealContact}
            onChangeText={v => setForm({ ...form, dealContact: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 12,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 12,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              style={{
                backgroundColor: '#3F6AE1',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff' }}>
                {editing ? 'Save' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// -------------- Add Follow-up Modal ----------------
function FollowupModal() {
  const dispatch = useDispatch();
  const open = useSelector(s => s.admin?.deals?.followupOpen);
  const dealId = useSelector(s => s.admin?.deals?.followupDealId);
  const [f, setF] = useState({
    nextDate: '',
    startTime: '',
    remarks: '',
    sendReminder: true,
    remindBefore: 1,
    remindUnit: 'DAYS', // DAYS/HOURS/MINUTES if backend allows
  });

  if (!open) return null;
  const onSave = () => {
    dispatch({
      type: 'admin/deals/FOLLOWUP_CREATE_REQUEST',
      dealId,
      payload: f,
    });
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={() =>
        dispatch({ type: 'admin/deals/SET_FOLLOWUP_OPEN', open: false })
      }
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
            Add Follow-up
          </Text>

          <TextInput
            placeholder="Next Date (YYYY-MM-DD)"
            value={f.nextDate}
            onChangeText={v => setF({ ...f, nextDate: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Start Time (HH:mm)"
            value={f.startTime}
            onChangeText={v => setF({ ...f, startTime: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Remarks"
            value={f.remarks}
            onChangeText={v => setF({ ...f, remarks: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Remind Before (number)"
            keyboardType="numeric"
            value={String(f.remindBefore)}
            onChangeText={v => setF({ ...f, remindBefore: Number(v) || 0 })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 8,
            }}
          />

          <TextInput
            placeholder="Remind Unit (DAYS)"
            value={f.remindUnit}
            onChangeText={v => setF({ ...f, remindUnit: v })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 12,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                dispatch({
                  type: 'admin/deals/SET_FOLLOWUP_OPEN',
                  open: false,
                  dealId: null,
                })
              }
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              style={{
                backgroundColor: '#3F6AE1',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
