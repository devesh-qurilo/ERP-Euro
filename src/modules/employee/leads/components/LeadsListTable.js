// src/modules/employee/leads/components/LeadsListTable.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';

const COLS = [
  { key: 'name', label: 'Name', width: 260 },
  { key: 'email', label: 'Email', width: 320 },
  { key: 'mobile', label: 'Mob. Number', width: 220 },
  { key: 'company', label: 'Company', width: 280 },
  { key: 'status', label: 'Status', width: 160 },
  { key: 'addedBy', label: 'Added By', width: 160 },
  { key: 'created', label: 'Created On', width: 180 },
  { key: 'actions', label: 'Actions', width: 120 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

const fmtDate = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
};

export default function LeadsListTable({ rows = [] }) {
  const [open, setOpen] = useState(false);
  const [curr, setCurr] = useState(null);

  const data = useMemo(
    () =>
      rows.map(r => ({
        id: String(r.id),
        name: r.name || '—',
        email: r.email || '—',
        mobile: r.mobileNumber || r.officePhone || '—',
        company: r.companyName || '—',
        status: r.status || '—',
        addedBy: r.addedBy || r.leadOwner || '—',
        created: fmtDate(r.createdAt),
        raw: r,
      })),
    [rows],
  );

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.alt : null]}>
      <View style={[styles.cell, { width: COLS[0].width }]}>
        <Text style={styles.text} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={[styles.cell, { width: COLS[1].width }]}>
        <Text style={styles.text} numberOfLines={1}>
          {item.email}
        </Text>
      </View>
      <View style={[styles.cell, { width: COLS[2].width }]}>
        <Text style={styles.text} numberOfLines={1}>
          {item.mobile}
        </Text>
      </View>
      <View style={[styles.cell, { width: COLS[3].width }]}>
        <Text style={styles.text} numberOfLines={1}>
          {item.company}
        </Text>
      </View>
      <View style={[styles.cell, { width: COLS[4].width }]}>
        <Text style={styles.badge}>{item.status}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[5].width }]}>
        <Text style={styles.text}>{item.addedBy}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[6].width }]}>
        <Text style={styles.text}>{item.created}</Text>
      </View>
      <View style={[styles.cell, { width: COLS[7].width }]}>
        <Pressable
          style={styles.eyeBtn}
          onPress={() => {
            setCurr(item.raw);
            setOpen(true);
          }}
        >
          <Text style={{ fontSize: 18 }}>👁️</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_WIDTH }}
      >
        <View style={{ width: TABLE_WIDTH }}>
          <View style={[styles.row, styles.headRow]}>
            {COLS.map(c => (
              <View key={c.key} style={[styles.cell, { width: c.width }]}>
                <Text style={[styles.text, styles.head]}>{c.label}</Text>
              </View>
            ))}
          </View>

          <FlatList
            data={data}
            keyExtractor={it => it.id}
            renderItem={renderRow}
            nestedScrollEnabled
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </ScrollView>

      {/* Details modal */}
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{curr?.name}</Text>
            {curr && (
              <>
                <Text style={styles.kv}>
                  Email: <Text style={styles.v}>{curr.email || '—'}</Text>
                </Text>
                <Text style={styles.kv}>
                  Mobile:{' '}
                  <Text style={styles.v}>
                    {curr.mobileNumber || curr.officePhone || '—'}
                  </Text>
                </Text>
                <Text style={styles.kv}>
                  Company:{' '}
                  <Text style={styles.v}>{curr.companyName || '—'}</Text>
                </Text>
                <Text style={styles.kv}>
                  City: <Text style={styles.v}>{curr.city || '—'}</Text>
                </Text>
                <Text style={styles.kv}>
                  Country: <Text style={styles.v}>{curr.country || '—'}</Text>
                </Text>
                <Text style={styles.kv}>
                  Status: <Text style={styles.v}>{curr.status || '—'}</Text>
                </Text>
                <Text style={styles.kv}>
                  Created:{' '}
                  <Text style={styles.v}>{fmtDate(curr.createdAt)}</Text>
                </Text>
              </>
            )}
            <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    minHeight: 60,
    paddingHorizontal: 6,
  },
  headRow: {
    backgroundColor: '#eef3ff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  alt: { backgroundColor: '#fafbfc' },
  cell: { justifyContent: 'center', paddingVertical: 12, paddingRight: 8 },
  text: { fontSize: 16, color: '#1f2328' },
  head: { fontWeight: '900', color: '#374151' },
  badge: {
    backgroundColor: '#e5f7eb',
    color: '#166534',
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },

  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    color: '#111827',
  },
  kv: { color: '#374151', marginBottom: 4 },
  v: { fontWeight: '800', color: '#111827' },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeTxt: { color: '#fff', fontWeight: '900' },
});
