import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
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
  const [openMenuId, setOpenMenuId] = useState(null);

  const widths = [120, 200, 160, 140];
  const cols = ['#ID', 'Designation', 'Parent', 'Action'];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tableWrap}
    >
      <View style={styles.table}>
        <RowHead cols={cols} widths={widths} />
        {(loading ? [] : data).map(row => {
          const busy = busyIds.includes(row.id);
          const parent =
            row.parentDesignationName ||
            (row.parentDesignationId ? `#${row.parentDesignationId}` : '—');
          return (
            <Row key={row.id}>
              <Cell w={widths[0]} text={`#${row.id}`} />
              <Cell w={widths[1]} text={row.designationName} />
              <Cell w={widths[2]} text={parent} />
              <Cell w={widths[3]}>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    style={styles.menuBtn}
                    onPress={() =>
                      setOpenMenuId(openMenuId === row.id ? null : row.id)
                    }
                    disabled={busy}
                  >
                    <Text style={styles.menuTxt}>{busy ? '…' : '⋮'}</Text>
                  </Pressable>
                  {openMenuId === row.id && (
                    <View style={styles.menu}>
                      <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                          setOpenMenuId(null);
                          onEdit(row);
                        }}
                      >
                        <Text style={styles.menuItemTxt}>Edit</Text>
                      </Pressable>
                      <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                          setOpenMenuId(null);
                          Alert.alert(
                            'Delete',
                            `Delete ${row.designationName}?`,
                            [
                              { text: 'Cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => onDelete(row),
                              },
                            ],
                          );
                        }}
                      >
                        <Text
                          style={[styles.menuItemTxt, { color: '#b00020' }]}
                        >
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </Cell>
            </Row>
          );
        })}
        {loading && <Text style={[styles.dim, { padding: 10 }]}>Loading…</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableWrap: { marginTop: 6 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
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
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  menuTxt: { color: '#fff', fontWeight: '900' },

  menu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 120,
    zIndex: 5,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuItemTxt: { color: '#111827', fontWeight: '700' },
});
