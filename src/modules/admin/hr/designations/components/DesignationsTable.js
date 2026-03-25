import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from 'react-native';

const RowHead = ({ cols, widths }) => (
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

export default function DesignationsTable({
  data = [],
  loading,
  busyIds = [],
  onEdit,
  onDelete,
}) {
  const [menuFor, setMenuFor] = useState(null); // row object or null

  const widths = [120, 200, 160, 140];
  const cols = ['#ID', 'Designation', 'Parent', 'Action'];

  const busy = id => busyIds.includes(id);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableWrap}
      >
        <View style={styles.table /* no overflow hidden! */}>
          <RowHead cols={cols} widths={widths} />
          {(loading ? [] : data).map(row => {
            const parent =
              row.parentDesignationName ||
              (row.parentDesignationId ? `#${row.parentDesignationId}` : '—');
            return (
              <Row key={row.id}>
                <Cell w={widths[0]} text={`#${row.id}`} />
                <Cell w={widths[1]} text={row.designationName} />
                <Cell w={widths[2]} text={parent} />
                <Cell w={widths[3]}>
                  <Pressable
                    style={styles.menuBtn}
                    onPress={() => setMenuFor(row)}
                    disabled={busy(row.id)}
                  >
                    <Text style={styles.menuTxt}>
                      {busy(row.id) ? '…' : '⋮'}
                    </Text>
                  </Pressable>
                </Cell>
              </Row>
            );
          })}
          {loading && (
            <Text style={[styles.dim, { padding: 10 }]}>Loading…</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating modal menu so it never gets clipped */}
      <Modal
        visible={!!menuFor}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuFor(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuFor(null)}>
          <View style={styles.menuSheet}>
            <Text style={styles.menuTitle}>{menuFor?.designationName}</Text>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                const row = menuFor;
                setMenuFor(null);
                onEdit(row);
              }}
            >
              <Text style={styles.menuItemTxt}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                const row = menuFor;
                setMenuFor(null);
                Alert.alert('Delete', `Delete ${row?.designationName}?`, [
                  { text: 'Cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete(row),
                  },
                ]);
              }}
            >
              <Text style={[styles.menuItemTxt, { color: '#b00020' }]}>
                Delete
              </Text>
            </Pressable>
            <Pressable style={styles.closeBtn} onPress={() => setMenuFor(null)}>
              <Text style={styles.closeTxt}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tableWrap: { marginTop: 6 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    // IMPORTANT: don't clip children so menus can extend (we use Modal now anyway)
    // overflow: 'hidden',
  },
  trHead: { flexDirection: 'row', backgroundColor: '#e8f0ff' },
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

  menuBtn: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  menuTxt: { color: '#fff', fontWeight: '900' },

  // Modal menu
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 20,
  },
  menuSheet: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 42,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 220,
  },
  menuTitle: { fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  menuItem: { paddingVertical: 10 },
  menuItemTxt: { color: '#111827', fontWeight: '700' },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeTxt: { color: '#111827', fontWeight: '800' },
});
