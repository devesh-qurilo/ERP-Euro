// src/modules/admin/leads/components/LeadsTable.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');

const Header = ({ cols, widths }) => (
  <View style={styles.trHead}>
    {cols.map((c, i) => (
      <View key={c} style={[styles.th, { width: widths[i] }]}>
        <Text style={styles.thTxt}>{c}</Text>
      </View>
    ))}
  </View>
);
const Row = ({ children }) => <View style={styles.tr}>{children}</View>;
const Cell = ({ w, children, text }) => (
  <View style={[styles.cell, { width: w }]}>
    {children ?? <Text style={styles.body}>{text}</Text>}
  </View>
);

export default function LeadsTable({
  data = [],
  loading,
  busyIds = {},
  onView,
  onEdit,
  onDelete,
  onConvert,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      style={styles.tableWrap}
    >
      <View style={styles.table}>
        <Header
          cols={[
            'S.no',
            'Lead Name',
            'Contact Details',
            'Lead Owner',
            'Added By',
            'Created On',
            'Actions',
          ]}
          widths={[80, 260, 320, 220, 220, 160, 260]}
        />
        {(loading ? [] : data).map((l, idx) => (
          <Row key={l.id}>
            <Cell w={80} text={String(idx + 1)} />
            <Cell w={260}>
              <View>
                <Text
                  style={[styles.body, { fontWeight: '900' }]}
                  numberOfLines={1}
                >
                  {l.name || '—'}
                </Text>
                <Text style={styles.dim} numberOfLines={1}>
                  {l.companyName || '—'}
                </Text>
              </View>
            </Cell>

            <Cell w={320}>
              <View>
                <Text style={styles.body} numberOfLines={1}>
                  {l.email || '—'}
                </Text>
                <Text style={styles.dim} numberOfLines={1}>
                  {l.mobileNumber || l.officePhone || '—'}
                </Text>
              </View>
            </Cell>

            <Cell w={220}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                {l.leadOwnerMeta?.profileUrl ? (
                  <Image
                    source={{ uri: l.leadOwnerMeta.profileUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarEmpty]}>
                    <Text>👤</Text>
                  </View>
                )}
                <Text style={styles.body} numberOfLines={1}>
                  {l.leadOwnerMeta?.name || l.leadOwner || '—'}
                </Text>
              </View>
            </Cell>

            <Cell w={220}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                {l.addedByMeta?.profileUrl ? (
                  <Image
                    source={{ uri: l.addedByMeta.profileUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarEmpty]}>
                    <Text>👤</Text>
                  </View>
                )}
                <Text style={styles.body} numberOfLines={1}>
                  {l.addedByMeta?.name || l.addedBy || '—'}
                </Text>
              </View>
            </Cell>

            <Cell w={160} text={fmtDate(l.createdAt)} />

            <Cell w={260}>
              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.btn, styles.dark]}
                  onPress={() => onView(l)}
                >
                  <Text style={styles.white}>View</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.light]}
                  onPress={() => onEdit(l)}
                >
                  <Text style={styles.darkTxt}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.danger]}
                  disabled={busyIds[l.id]}
                  onPress={() => onDelete(l)}
                >
                  <Text style={styles.white}>
                    {busyIds[l.id] ? '...' : 'Delete'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, styles.primary]}
                  onPress={() => onConvert(l)}
                >
                  <Text style={styles.white}>Change to Client</Text>
                </Pressable>
              </View>
            </Cell>
          </Row>
        ))}
        {loading && <Text style={[styles.dim, { padding: 10 }]}>Loading…</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableWrap: { marginTop: 8 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  trHead: { flexDirection: 'row', backgroundColor: '#eef2ff' },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  thTxt: { fontWeight: '900', color: '#374151' },
  tr: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },

  body: { color: '#111827' },
  dim: { color: '#6b7280' },

  avatar: { width: 26, height: 26, borderRadius: 13 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  primary: { backgroundColor: '#2563eb' },
  dark: { backgroundColor: '#111827' },
  light: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#111827' },
  danger: { backgroundColor: '#dc2626' },
  white: { color: '#fff', fontWeight: '900' },
  darkTxt: { color: '#111827', fontWeight: '900' },
});
