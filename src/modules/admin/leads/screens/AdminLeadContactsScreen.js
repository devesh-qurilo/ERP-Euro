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
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LeadImportExport from '../components/LeadImportExport';
import LeadExportButton from '../components/LeadExportButton';

import {
  fetchAdminLeads,
  setAdminLeadsFilters,
  deleteAdminLead,
  updateAdminLead,
  createLeadRequest,
} from '../store/actions';
import {
  selectAdminLeads,
  selectAdminLeadsLoading,
  selectAdminLeadsError,
  selectAdminLeadsFilters,
  selectAdminLeadsBusyIds,
} from '../store/selectors';
import DateFilterField from '../components/DateFilterField';
import { selectEmpList } from '../../hr/employees/store/selectors';
import { fetchEmployees } from '../../hr/employees/store/actions';

import LeadsTable from '../components/LeadsTable';
import AddLeadModal from '../contacts/components/AddLeadModal';

// Simple select dropdown for filters
const Select = ({ label, value, options, onChange, style }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={[{ minWidth: 160, marginRight: 12 }, style]}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.selectBtn} onPress={() => setOpen(true)}>
        <Text style={styles.value} numberOfLines={1}>
          {String(value ?? 'All')}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.dropdownOverlay}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdownModal}>
            <ScrollView>
              {options.map(opt => (
                <Pressable
                  key={String(opt)}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{String(opt)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

// Helper: only allowed fields for PUT /leads/:id
const buildUpdateBody = payload => ({
  name: payload.name,
  email: payload.email,
  clientCategory: payload.clientCategory,
  leadSource: payload.leadSource,
  leadOwner: payload.leadOwner,
  addedBy: payload.addedBy,
  autoConvertToClient: payload.autoConvertToClient,
  companyName: payload.companyName,
  officialWebsite: payload.officialWebsite,
  mobileNumber: payload.mobileNumber,
  officePhone: payload.officePhone,
  city: payload.city,
  state: payload.state,
  postalCode: payload.postalCode,
  country: payload.country,
  companyAddress: payload.companyAddress,
});

export default function AdminLeadContactsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
  const me = useSelector(s => s?.auth?.profile?.employeeId) || '';
  const employees = useSelector(selectEmpList);
  console.log('list lead', list);
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminLeads());
  }, [dispatch]);

  // ------- Filter options -------
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

  // ------- Apply filters -------
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

  // =========================
  //   ACTION MENU + FORMS
  // =========================
  const [actionLead, setActionLead] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // formMode: 'create' | 'edit' | 'convert'
  const [formMode, setFormMode] = useState('create');
  const [formTarget, setFormTarget] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // 3-dot click callback from table
  const onRowMenuPress = lead => {
    setActionLead(lead);
    setShowActionMenu(true);
  };

  // ------- action handlers -------
  const handleView = lead => {
    setShowActionMenu(false);
    // TODO: adjust route name as per your navigator
    // navigation.navigate('AdminLeadViewScreen', { id: lead.id });
    navigation.navigate('AdminLeadViewScreen', { id: lead.id });
  };

  const empOptions = useMemo(
    () =>
      employees.map(e => ({
        label: `${e.name} (${e.employeeId})`,
        value: e.employeeId,
      })),
    [employees],
  );

  const handleEdit = lead => {
    setShowActionMenu(false);
    setFormMode('edit');
    setFormTarget(lead);
    setOpenForm(true);
  };

  const handleDelete = lead => {
    setShowActionMenu(false);
    Alert.alert('Delete Lead', `Delete ${lead.name}?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteAdminLead(lead.id)),
      },
    ]);
  };

  const handleConvert = lead => {
    // "Add to Client"
    setShowActionMenu(false);
    setFormMode('convert');
    setFormTarget(lead);
    setOpenForm(true); // same AddLeadModal open
  };

  const openCreateModal = () => {
    setFormMode('create');
    setFormTarget(null);
    setOpenForm(true);
  };

  // ------- Save from AddLeadModal -------
  const handleSaveLead = payload => {
    if (formMode === 'create') {
      // POST /leads
      const body = {
        ...payload,
        addedBy: payload?.addedBy || me,
        leadOwner: payload?.leadOwner || me,
      };
      dispatch(createLeadRequest(body));
    } else if (formMode === 'edit' && formTarget) {
      // EDIT: PUT /leads/:id with ONLY allowed fields
      const base = buildUpdateBody(payload);
      dispatch(updateAdminLead(formTarget.id, base));
    } else if (formMode === 'convert' && formTarget) {
      // ADD TO CLIENT: same fields, but autoConvertToClient = true
      const base = buildUpdateBody(payload);
      const body = {
        ...base,
        autoConvertToClient: true,
      };
      dispatch(updateAdminLead(formTarget.id, body));
    }

    setOpenForm(false);
    setFormTarget(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* 1) Filters card */}
      <View style={styles.card}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {/* SEARCH */}
          <View style={styles.filterItemWide}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              value={String(filters.q || '')}
              onChangeText={q => dispatch(setAdminLeadsFilters({ q }))}
              placeholder="Search name, email, company..."
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          {/* SOURCE */}
          <Select
            label="Source"
            value={filters.source || 'All'}
            options={sources}
            onChange={source => dispatch(setAdminLeadsFilters({ source }))}
            style={styles.filterItem}
          />

          {/* OWNER */}
          <Select
            label="Owner"
            value={filters.owner || 'All'}
            options={owners}
            onChange={owner => dispatch(setAdminLeadsFilters({ owner }))}
            style={styles.filterItem}
          />

          {/* STATUS */}
          <Select
            label="Status"
            value={filters.status || 'All'}
            options={statuses}
            onChange={status => dispatch(setAdminLeadsFilters({ status }))}
            style={styles.filterItem}
          />

          {/* START DATE */}
          <View style={styles.filterItem}>
            <Text style={styles.calender}>Select Calender From</Text>
            <DateFilterField
              label="Start"
              value={filters.start}
              onChange={start => dispatch(setAdminLeadsFilters({ start }))}
            />
          </View>

          {/* END DATE */}
          <View style={styles.filterItem}>
            <Text style={styles.calender}>Select Calender To</Text>
            <DateFilterField
              label="End"
              value={filters.end}
              onChange={end => dispatch(setAdminLeadsFilters({ end }))}
            />
          </View>

          {/* CLEAR BUTTON */}
          {hasFilters && (
            <Pressable onPress={resetFilters} style={styles.clearBtnInline}>
              <Text style={styles.clearTxt}>Clear</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>

      {/* 2) Header + Add button */}
      <View style={styles.headerRow}>
        {/* <Text style={styles.sectionTitle}>Lead Contacts</Text> */}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <LeadImportExport
            leads={filtered}
            onImported={() => dispatch(fetchAdminLeads())}
          />

          <LeadExportButton leads={filtered} />

          <Pressable
            style={[styles.primaryBtn, { backgroundColor: '#1d4ed8' }]}
            onPress={openCreateModal}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>+ Add Lead</Text>
          </Pressable>
        </View>
      </View>

      {/* 3) Table area */}
      <LeadsTable
        data={filtered}
        loading={loading}
        busyIds={busyIds}
        onRowMenuPress={onRowMenuPress}
      />
      {error && <Text style={styles.err}>Error: {String(error)}</Text>}

      {/* 4) Add / Edit / Add-to-client modal */}
      <AddLeadModal
        visible={openForm}
        onClose={() => {
          setOpenForm(false);
          setFormTarget(null);
        }}
        onSave={handleSaveLead}
        currentUserId={me}
        defaultOwnerId={me}
        empOptions={empOptions}
        initialData={formTarget}
      />

      {/* 5) 3-dot Action bottom sheet */}
      {/* 5) Modern Action Bottom Sheet */}
      <Modal
        visible={showActionMenu && !!actionLead}
        animationType="fade"
        transparent
        onRequestClose={() => setShowActionMenu(false)}
      >
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.sheetContainer}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>{actionLead?.name || 'Lead'}</Text>

            <Text style={styles.sheetSubtitle}>Choose an action</Text>

            <Pressable
              style={styles.sheetItem}
              onPress={() => handleView(actionLead)}
            >
              <Ionicons name="eye-outline" size={22} color="#2563eb" />
              <Text style={styles.sheetText}>View Lead</Text>
            </Pressable>

            <Pressable
              style={styles.sheetItem}
              onPress={() => handleEdit(actionLead)}
            >
              <Ionicons name="create-outline" size={22} color="#16a34a" />
              <Text style={styles.sheetText}>Edit Lead</Text>
            </Pressable>

            <Pressable
              style={styles.sheetItem}
              onPress={() => handleConvert(actionLead)}
            >
              <Ionicons name="person-add-outline" size={22} color="#7c3aed" />
              <Text style={styles.sheetText}>Add to Client</Text>
            </Pressable>

            <Pressable
              style={[styles.sheetItem, styles.sheetDelete]}
              onPress={() => handleDelete(actionLead)}
            >
              <Ionicons name="trash-outline" size={22} color="#dc2626" />
              <Text style={styles.sheetDeleteText}>Delete Lead</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  sheetContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  sheetHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#d1d5db',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 14,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },

  sheetSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    gap: 12,
  },

  sheetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  sheetDelete: {
    backgroundColor: '#fef2f2',
  },

  sheetDeleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#dc2626',
  },
  wrap: {
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
  },
  calender: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
  },
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
  clearTxt: {
    fontWeight: '800',
    color: '#111827',
  },
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
  err: {
    color: '#b00020',
    textAlign: 'center',
    marginTop: 10,
  },

  // bottom sheet action menu
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  actionBtn: {
    paddingVertical: 10,
  },
  actionTxt: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  actionDanger: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#fee2e2',
    marginVertical: 4,
  },
  actionDangerTxt: {
    color: '#b91c1c',
  },
  filterRow: {
    alignItems: 'flex-end',
    paddingBottom: 4,
  },

  filterItem: {
    minWidth: 160,
    marginRight: 12,
  },

  filterItemWide: {
    minWidth: 260,
    marginRight: 12,
  },

  clearBtnInline: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },

  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    maxHeight: 400,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },

  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
});
