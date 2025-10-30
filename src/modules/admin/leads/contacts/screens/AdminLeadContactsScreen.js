// src/modules/admin/leads/contacts/screens/AdminLeadContactsScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLeadsRequest, createLeadRequest } from '../store/actions';
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

  // ---- redux state ----
  const leads = useSelector(s => s.admin?.leads?.list || []);
  const loading = useSelector(s => s.admin?.leads?.loading);
  const creating = useSelector(s => s.admin?.leads?.creating);
  const me = useSelector(s => s.auth?.profile?.employeeId) || 'EMP-009';

  useEffect(() => {
    dispatch(fetchLeadsRequest());
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

  // ---- add modal ----
  const [openAdd, setOpenAdd] = useState(false);

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
          <Pressable style={styles.addBtn} onPress={() => setOpenAdd(true)}>
            <Text style={styles.addTxt}>+ Add Lead</Text>
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
            <TH w={220}>Actions</TH>
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
                <Text>{x.status}</Text>
              </TD>

              <TD w={160}>
                <Text>
                  {x.createdAt
                    ? new Date(x.createdAt).toLocaleDateString()
                    : '—'}
                </Text>
              </TD>

              <TD w={220}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable style={styles.act}>
                    <Text style={styles.actTxt}>View</Text>
                  </Pressable>
                  <Pressable style={styles.act}>
                    <Text style={styles.actTxt}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.actDanger}>
                    <Text style={styles.actTxt}>Delete</Text>
                  </Pressable>
                  <Pressable style={styles.act}>
                    <Text style={styles.actTxt}>→ Client</Text>
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

      {/* Add Lead Modal (WIRED TO BUTTON) */}
      <AddLeadModal
        visible={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={payload => dispatch(createLeadRequest(payload))}
        currentUserId={me}
        defaultOwnerId={me}
      />
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
});
