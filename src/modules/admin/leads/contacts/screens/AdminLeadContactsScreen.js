// src/modules/admin/leads/contacts/screens/AdminLeadContactsScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  fetchAdminLeads,
  createLeadRequest,
  deleteAdminLead,
  updateAdminLead,
} from '../store/actions';

import AddLeadModal from '../components/AddLeadModal';

function TH({ w, children }) {
  return (
    <View style={[styles.cell, { width: w }]}>
      <Text style={styles.th}>{children}</Text>
    </View>
  );
}
function TD({ w, children }) {
  return <View style={[styles.cell, { width: w }]}>{children}</View>;
}

export default function AdminLeadContactsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // ---- redux state ----
  const leads = useSelector(s => s.admin?.leads?.list || []);
  const loading = useSelector(s => s.admin?.leads?.loading);
  const creating = useSelector(s => s.admin?.leads?.creating);
  const me = useSelector(s => s.auth?.profile?.employeeId) || 'EMP-009';

  useEffect(() => {
    dispatch(fetchAdminLeads());
  }, [dispatch]);

  // ---- filters ----
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(x =>
      `${x.name} ${x.email} ${x.companyName || ''} ${x.mobileNumber || ''}`
        .toLowerCase()
        .includes(q),
    );
  }, [leads, search]);

  // ---- add / edit modal ----
  const [openAdd, setOpenAdd] = useState(false);
  const [editLead, setEditLead] = useState(null); // null => create mode

  // ---- action menu (3-dot) ----
  const [actionLead, setActionLead] = useState(null);
  const [showActions, setShowActions] = useState(false);

  const openActionMenu = lead => {
    setActionLead(lead);
    setShowActions(true);
  };

  const closeActionMenu = () => {
    setShowActions(false);
    setActionLead(null);
  };

  const handleView = () => {
    if (!actionLead) return;
    closeActionMenu();
    // TODO: change route name as per your stack
    navigation.navigate('AdminLeadContactView', { id: actionLead.id });
  };

  const handleEdit = () => {
    if (!actionLead) return;
    closeActionMenu();
    setEditLead(actionLead);
    setOpenAdd(true);
  };

  const handleDelete = () => {
    if (!actionLead) return;
    dispatch(deleteAdminLead(actionLead.id)); // DELETE /leads/:id via saga/api
    closeActionMenu();
  };

  const handleConvertToClient = () => {
    if (!actionLead) return;
    // TODO: call your convert-to-client API or navigation here
    // console.log('[LEAD] change to client ->', actionLead.id);
    closeActionMenu();
  };

  const handleOpenAdd = () => {
    setEditLead(null); // create mode
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setEditLead(null);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      {/* Filters + Add */}
      <View style={styles.card}>
        <Text style={styles.label}>Search</Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="name, email, phone, company"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <Pressable style={styles.addBtn} onPress={handleOpenAdd}>
            <Text style={styles.addTxt}>
              {creating ? 'Adding…' : '+ Add Lead'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Table */}
      <Text style={styles.h2}>Lead Contacts</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={[styles.tr, styles.head]}>
            <TH w={70}>S.no</TH>
            <TH w={220}>Lead Name</TH>
            <TH w={280}>Contact Details</TH>
            <TH w={180}>Lead Owner</TH>
            <TH w={180}>Added By</TH>
            <TH w={120}>Status</TH>
            <TH w={160}>Created On</TH>
            <TH w={80}>...</TH>
          </View>

          {(loading ? [] : filtered).map((x, i) => (
            <View key={x.id} style={styles.tr}>
              <TD w={70}>
                <Text>{i + 1}</Text>
              </TD>

              <TD w={220}>
                <Text style={styles.bold}>{x.name}</Text>
                <Text style={styles.dim}>{x.companyName || '—'}</Text>
              </TD>

              <TD w={280}>
                <Text>{x.email || '—'}</Text>
                <Text style={styles.dim}>{x.mobileNumber || '—'}</Text>
              </TD>

              <TD w={180}>
                <Text>{x.leadOwnerMeta?.name || x.leadOwner}</Text>
              </TD>

              <TD w={180}>
                <Text>{x.addedByMeta?.name || x.addedBy}</Text>
              </TD>

              <TD w={120}>
                <Text>{x.status || 'New'}</Text>
              </TD>

              <TD w={160}>
                <Text>
                  {x.createdAt
                    ? new Date(x.createdAt).toLocaleDateString()
                    : '—'}
                </Text>
              </TD>

              <TD w={80}>
                <View style={styles.actionCell}>
                  <Pressable
                    style={styles.dotBtn}
                    onPress={() => openActionMenu(x)}
                  >
                    <Text style={styles.dotText}>⋯</Text>
                  </Pressable>
                </View>
              </TD>
            </View>
          ))}

          {loading && (
            <Text style={{ padding: 10, color: '#6b7280' }}>Loading…</Text>
          )}
        </View>
      </ScrollView>

      {/* Add / Edit Lead Modal */}
      <AddLeadModal
        visible={openAdd}
        onClose={handleCloseAdd}
        // NOTE:
        // - For CREATE -> dispatch(createLeadRequest)
        // - For EDIT   -> dispatch(updateAdminLead)
        onSave={payload => {
          if (editLead) {
            // PUT /leads/:id (edit)
            dispatch(updateAdminLead(editLead.id, payload));
          } else {
            // POST /leads (create)
            dispatch(createLeadRequest(payload));
          }
        }}
        currentUserId={me}
        defaultOwnerId={me}
        mode={editLead ? 'edit' : 'create'}
        initialData={editLead}
      />

      {/* Action Modal (3-dot menu) */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={closeActionMenu}
      >
        <View style={styles.actionsBackdrop}>
          <View style={styles.actionsSheet}>
            <Text style={styles.actionsTitle}>Lead Actions</Text>

            <Pressable style={styles.actionItem} onPress={handleView}>
              <Text style={styles.actionItemText}>View</Text>
            </Pressable>

            <Pressable style={styles.actionItem} onPress={handleEdit}>
              <Text style={styles.actionItemText}>Edit</Text>
            </Pressable>

            <Pressable style={styles.actionItemDanger} onPress={handleDelete}>
              <Text style={styles.actionItemDangerText}>Delete</Text>
            </Pressable>

            <Pressable
              style={[styles.actionItem, { marginTop: 4 }]}
              onPress={handleConvertToClient}
            >
              <Text style={styles.actionItemText}>Change to Client</Text>
            </Pressable>

            <Pressable style={styles.actionCancel} onPress={closeActionMenu}>
              <Text style={styles.actionCancelText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  addBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addTxt: { color: '#fff', fontWeight: '900' },

  h2: { fontSize: 18, fontWeight: '900', color: '#111827', marginVertical: 8 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tr: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
  head: { backgroundColor: '#f1f5f9' },
  cell: {
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  th: { fontWeight: '900', color: '#374151' },
  bold: { fontWeight: '900', color: '#111827' },
  dim: { color: '#6b7280', fontSize: 12 },

  // 3-dot cell
  actionCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  dotText: {
    fontSize: 20,
    lineHeight: 20,
    color: '#111827',
    fontWeight: '900',
  },

  // old buttons (kept in case you need them)
  act: {
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actDanger: {
    backgroundColor: '#b91c1c',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actTxt: { color: '#fff', fontWeight: '900' },

  // action modal
  actionsBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  actionsSheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  actionItem: {
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  actionItemText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
  },
  actionItemDanger: {
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  actionItemDangerText: {
    color: '#b91c1c',
    fontWeight: '800',
    fontSize: 14,
  },
  actionCancel: {
    marginTop: 6,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionCancelText: {
    color: '#374151',
    fontWeight: '700',
  },
});
