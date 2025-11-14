// src/modules/admin/lead/Deal/screens/AdminDealScreen.js
import React, { useEffect, useState, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
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

/**
 * AdminDealScreen (fancy table, retains actions per row)
 * Drop-in replacement — keeps your behavior and restores the action menu.
 */

export default function AdminDealScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const dealsState = useSelector(selectDeals) || [];
  const busy = useSelector(selectDealsBusy);
  const params = useSelector(selectDealsParams) || {};
  const formOpen = useSelector(selectFormOpen);
  const editing = useSelector(selectEditing);

  // local UI
  const [pipeline, setPipeline] = useState(params.pipeline || '');
  const [dateFrom, setDateFrom] = useState(params.dateFrom || '');
  const [dateTo, setDateTo] = useState(params.dateTo || '');
  const [query, setQuery] = useState(params.q || '');
  const [page, setPage] = useState(params.page ?? 0);
  const [size, setSize] = useState(params.size ?? 10);

  // lead options cached for modal
  const [leadOptions, setLeadOptions] = useState([]);
  useEffect(() => {
    dispatch(fetchList());
    (async () => {
      try {
        const data = await adminLeadsAPI.list({ page: 0, size: 200 });
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
      } catch (err) {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    const p = { pipeline, dateFrom, dateTo, q: query, page, size };
    dispatch(setParams(p));
    dispatch(fetchList(p));
  };

  // derive rows from deals state (supports paged or plain array)
  const rows = Array.isArray(dealsState?.content)
    ? dealsState.content
    : Array.isArray(dealsState)
    ? dealsState
    : [];

  return (
    <View style={styles.screen}>
      {/* Top controls */}
      <View style={styles.topRow}>
        <Text style={styles.title}>Deals</Text>

        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Search deals, lead, tags..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => {
              setPage(0);
              applyFilters();
            }}
            style={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              setPage(0);
              applyFilters();
            }}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.filterCol}>
          <Text style={styles.filterLabel}>Start</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={dateFrom}
            onChangeText={setDateFrom}
            style={styles.filterInput}
          />
        </View>

        <View style={styles.filterCol}>
          <Text style={styles.filterLabel}>End</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={dateTo}
            onChangeText={setDateTo}
            style={styles.filterInput}
          />
        </View>

        <View style={styles.filterCol}>
          <Text style={styles.filterLabel}>Pipeline</Text>
          <TextInput
            placeholder="Default Pipeline"
            value={pipeline}
            onChangeText={setPipeline}
            style={styles.filterInput}
          />
        </View>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => {
            setPage(0);
            applyFilters();
          }}
        >
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            dispatch(setEditing(null));
            dispatch(setFormOpen(true));
          }}
        >
          <Text style={styles.addBtnText}>+ Add Deal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.simpleBtn}
          onPress={() => dispatch(fetchList())}
        >
          <Text style={styles.simpleBtnText}>List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.simpleBtn}
          onPress={() => navigation.navigate('AdminDealKanban')}
        >
          <Text style={[styles.simpleBtnText, { color: '#3F6AE1' }]}>
            Kanban
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fancy table (LeadsTable-style) */}
      <LeadsStyleTable
        data={rows}
        loading={busy}
        busyIds={{}} // pass actual busy ids map if available from your state
      />

      {/* Pagination (simple) */}
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page <= 0}
          onPress={() => setPage(p => Math.max(0, p - 1))}
          style={[styles.pageBtn, page <= 0 && styles.disabled]}
        >
          <Text>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>Page {page + 1}</Text>
        <TouchableOpacity
          onPress={() => setPage(p => p + 1)}
          style={styles.pageBtn}
        >
          <Text>Next</Text>
        </TouchableOpacity>

        <View style={{ width: 12 }} />
        <Text style={{ color: '#666' }}>Rows</Text>
        <TouchableOpacity
          onPress={() => setSize(10)}
          style={[styles.sizeBtn, size === 10 && styles.sizeBtnActive]}
        >
          <Text>10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSize(20)}
          style={[styles.sizeBtn, size === 20 && styles.sizeBtnActive]}
        >
          <Text>20</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
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

/* ---------------- LeadsStyleTable (with per-row action menu) ---------------- */
function LeadsStyleTable({ data = [], loading = false, busyIds = {} }) {
  if (loading) {
    return (
      <View style={ltStyles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <View style={ltStyles.center}>
        <Text style={ltStyles.emptyTxt}>No deals found.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* Header */}
        <View style={[ltStyles.row, ltStyles.headerRow]}>
          <Text style={[ltStyles.cell, ltStyles.headerCell, { minWidth: 220 }]}>
            Deal Name
          </Text>
          <Text style={[ltStyles.cell, ltStyles.headerCell, { minWidth: 160 }]}>
            Lead Name
          </Text>
          <Text style={[ltStyles.cell, ltStyles.headerCell, { minWidth: 140 }]}>
            Mobile
          </Text>
          <Text style={[ltStyles.cell, ltStyles.headerCell, { minWidth: 120 }]}>
            Stage
          </Text>
          <Text style={[ltStyles.cell, ltStyles.headerCell, { minWidth: 160 }]}>
            Agent
          </Text>
          <Text
            style={[
              ltStyles.cell,
              ltStyles.headerCell,
              { minWidth: 120, textAlign: 'right' },
            ]}
          >
            Value
          </Text>
          <Text
            style={[ltStyles.cell, ltStyles.headerCell, ltStyles.actionsCol]}
          />
        </View>

        {/* Rows */}
        {data.map(item => (
          <DealRow key={item.id} item={item} busy={!!busyIds?.[item.id]} />
        ))}
      </View>
    </ScrollView>
  );
}

/* ---------------- Single Deal Row (separate component so we can use hooks per-row) ---------------- */
const DealRow = memo(function DealRow({ item, busy }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const leadName =
    item.leadName || item.assignedEmployeesMeta?.[0]?.name || '-';
  const leadMobile =
    item.leadMobile || item.contactNumber || item.dealContact || '-';
  const agentName = item.dealAgentMeta?.name || item.dealAgent || '-';
  const valueStr = item.value != null ? String(item.value) : '-';

  const onView = () => {
    setOpen(false);
    navigation.navigate('AdminDealView', { dealId: item.id });
  };
  const onEdit = () => {
    setOpen(false);
    dispatch(setEditing(item));
    dispatch(setFormOpen(true));
  };
  const onDelete = () => {
    setOpen(false);
    dispatch(deleteDeal(item.id));
  };
  const onAddFollowup = () => {
    setOpen(false);
    dispatch(setFollowupOpen(true, item.id));
  };

  return (
    <View style={ltStyles.row}>
      <Text style={[ltStyles.cell, { minWidth: 220 }]} numberOfLines={1}>
        {item.title || '-'}
      </Text>

      <Text style={[ltStyles.cell, { minWidth: 160 }]} numberOfLines={1}>
        {leadName}
      </Text>

      <Text style={[ltStyles.cell, { minWidth: 140 }]} numberOfLines={1}>
        {leadMobile}
      </Text>

      <View style={[ltStyles.cell, { minWidth: 120 }]}>
        <View style={ltStyles.stagePill}>
          <Text style={ltStyles.stageText}>{item.dealStage || '-'}</Text>
        </View>
      </View>

      <Text style={[ltStyles.cell, { minWidth: 160 }]} numberOfLines={1}>
        {agentName}
      </Text>

      <Text
        style={[ltStyles.cell, { minWidth: 120, textAlign: 'right' }]}
        numberOfLines={1}
      >
        {valueStr}
      </Text>

      <View style={[ltStyles.cell, ltStyles.actionsCol]}>
        {busy ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Pressable style={ltStyles.dotBtn} onPress={() => setOpen(s => !s)}>
              <Text style={ltStyles.dotIcon}>⋮</Text>
            </Pressable>

            {open && (
              <View style={styles.menuPopup}>
                <Pressable onPress={onView} style={styles.menuItem}>
                  <Text>View</Text>
                </Pressable>
                <Pressable onPress={onEdit} style={styles.menuItem}>
                  <Text>Edit</Text>
                </Pressable>
                <Pressable onPress={onDelete} style={styles.menuItem}>
                  <Text style={{ color: 'red' }}>Delete</Text>
                </Pressable>
                <Pressable onPress={onAddFollowup} style={styles.menuItem}>
                  <Text>Add Follow-up</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
});

/* ---------------- Add/Edit Deal Modal ---------------- */
function DealFormModal({ open, editing, onClose, leadOptions = [] }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
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
  });

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
      dispatch({ type: 'admin/deals/CREATE_REQUEST', payload });
    }
    onClose();
  };

  if (!open) return null;
  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {editing ? 'Edit Deal' : 'Add Deal'}
          </Text>

          <TextInput
            placeholder="Title"
            value={form.title}
            onChangeText={v => setForm({ ...form, title: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Lead ID"
            value={form.leadId?.toString() || ''}
            onChangeText={v =>
              setForm({ ...form, leadId: v ? Number(v) : null })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Pipeline"
            value={form.pipeline}
            onChangeText={v => setForm({ ...form, pipeline: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Deal Stage"
            value={form.dealStage}
            onChangeText={v => setForm({ ...form, dealStage: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Deal Category"
            value={form.dealCategory}
            onChangeText={v => setForm({ ...form, dealCategory: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Deal Agent (EMP-xxx)"
            value={form.dealAgent}
            onChangeText={v => setForm({ ...form, dealAgent: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Deal Watchers (comma)"
            value={
              Array.isArray(form.dealWatchers)
                ? form.dealWatchers.join(',')
                : String(form.dealWatchers || '')
            }
            onChangeText={v => setForm({ ...form, dealWatchers: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Value"
            keyboardType="numeric"
            value={String(form.value ?? '')}
            onChangeText={v => setForm({ ...form, value: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Expected Close Date (YYYY-MM-DD)"
            value={form.expectedCloseDate}
            onChangeText={v => setForm({ ...form, expectedCloseDate: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Deal Contact"
            value={form.dealContact}
            onChangeText={v => setForm({ ...form, dealContact: v })}
            style={styles.input}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 12,
            }}
          >
            <TouchableOpacity onPress={onClose} style={{ marginRight: 12 }}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.primaryBtnSmall}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>
                {editing ? 'Save' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- Followup Modal ---------------- */
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
    remindUnit: 'DAYS',
  });

  useEffect(() => {
    if (!open) {
      setF({
        nextDate: '',
        startTime: '',
        remarks: '',
        sendReminder: true,
        remindBefore: 1,
        remindUnit: 'DAYS',
      });
    }
  }, [open]);

  if (!open) return null;

  const onSave = () => {
    dispatch({
      type: 'admin/deals/FOLLOWUP_CREATE_REQUEST',
      dealId,
      payload: f,
    });
    dispatch({
      type: 'admin/deals/SET_FOLLOWUP_OPEN',
      open: false,
      dealId: null,
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add Follow-up</Text>
          <TextInput
            placeholder="Next Date (YYYY-MM-DD)"
            value={f.nextDate}
            onChangeText={v => setF({ ...f, nextDate: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Start Time (HH:mm)"
            value={f.startTime}
            onChangeText={v => setF({ ...f, startTime: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Remarks"
            value={f.remarks}
            onChangeText={v => setF({ ...f, remarks: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Remind Before (number)"
            keyboardType="numeric"
            value={String(f.remindBefore)}
            onChangeText={v => setF({ ...f, remindBefore: Number(v) || 0 })}
            style={styles.input}
          />
          <TextInput
            placeholder="Remind Unit (DAYS)"
            value={f.remindUnit}
            onChangeText={v => setF({ ...f, remindUnit: v })}
            style={styles.input}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 12,
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
              style={{ marginRight: 12 }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.primaryBtnSmall}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FB' },
  topRow: {
    padding: 12,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#111' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: {
    minWidth: 220,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e9ef',
  },
  searchBtn: {
    backgroundColor: '#3F6AE1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchBtnText: { color: '#fff', fontWeight: '700' },

  filters: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterCol: { flexDirection: 'column' },
  filterLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '700',
    marginBottom: 6,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: 8,
    padding: 8,
    minWidth: 120,
    backgroundColor: '#fff',
  },
  applyBtn: {
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  applyBtnText: { color: '#fff', fontWeight: '700' },

  buttonsRow: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  simpleBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  simpleBtnText: { color: '#333', fontWeight: '700' },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 8,
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  disabled: { opacity: 0.4 },
  pageInfo: { marginHorizontal: 12, fontWeight: '700' },
  sizeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  sizeBtnActive: { backgroundColor: '#E9F2FF', borderColor: '#cfe3ff' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  primaryBtnSmall: {
    backgroundColor: '#3F6AE1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },

  /* menu */
  menuPopup: {
    position: 'absolute',
    right: 0,
    top: 26,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eef0f3',
    borderRadius: 8,
    zIndex: 40,
    width: 150,
    overflow: 'hidden',
  },
  menuItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f6f6f6' },
});

/* ---------------- LeadsTable-like styles ---------------- */
const ltStyles = StyleSheet.create({
  center: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTxt: {
    color: '#6b7280',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    minHeight: 52,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  headerRow: {
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  headerCell: {
    fontWeight: '800',
    color: '#374151',
  },
  actionsCol: {
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dotBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dotIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4b5563',
  },
  stagePill: {
    backgroundColor: '#eef6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  stageText: { color: '#2b6bd8', fontWeight: '700' },
});
