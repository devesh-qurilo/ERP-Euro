import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';

const roles = ['ROLE_EMPLOYEE', 'ROLE_ADMIN'];

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

const RoleSelect = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        style={[styles.roleBtn, disabled && { opacity: 0.6 }]}
        onPress={() => !disabled && setOpen(o => !o)}
      >
        <Text style={styles.roleTxt} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.roleCaret}>▾</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {roles.map(r => (
            <Pressable
              key={r}
              style={styles.menuItem}
              onPress={() => {
                onChange(r);
                setOpen(false);
              }}
            >
              <Text style={styles.menuItemTxt}>{r}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function EmployeesTable({
  data = [],
  loading,
  busyIds = [],
  onView,
  onEdit,
  onDelete,
  onRoleChange,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const widths = [140, 260, 260, 220, 180, 100, 120];
  const cols = [
    'Employee Id',
    'Name',
    'Email',
    'Reporting To',
    'User Role',
    'Status',
    'Actions',
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tableWrap}
    >
      <View style={styles.table}>
        <RowHead cols={cols} widths={widths} />
        {(loading ? [] : data).map(row => {
          const busy =
            busyIds.includes(row.employeeId) ||
            busyIds.includes(`role:${row.employeeId}`);
          return (
            <Row key={row.employeeId}>
              <Cell w={widths[0]} text={`#${row.employeeId}`} />
              <Cell w={widths[1]}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  {row.profilePictureUrl ? (
                    <Image
                      source={{ uri: row.profilePictureUrl }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarEmpty]}>
                      <Text>👤</Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.body} numberOfLines={1}>
                      {row.name}
                    </Text>
                    <Text style={styles.dim}>{row.designationName || '—'}</Text>
                  </View>
                </View>
              </Cell>
              <Cell w={widths[2]} text={row.email} />
              <Cell w={widths[3]}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  {row.reportingToName ? (
                    <Text style={styles.body}>{row.reportingToName}</Text>
                  ) : (
                    <Text style={styles.dim}>—</Text>
                  )}
                </View>
              </Cell>
              <Cell w={widths[4]}>
                <RoleSelect
                  value={row.role || 'ROLE_EMPLOYEE'}
                  onChange={r => onRoleChange(row.employeeId, r)}
                  disabled={busy}
                />
              </Cell>
              <Cell w={widths[5]}>
                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor: row.active ? '#DCFCE7' : '#FEE2E2',
                      color: row.active ? '#166534' : '#991B1B',
                    },
                  ]}
                >
                  {row.active ? 'Active' : 'Inactive'}
                </Text>
              </Cell>
              <Cell w={widths[6]}>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    style={styles.menuBtn}
                    onPress={() =>
                      setOpenMenuId(
                        openMenuId === row.employeeId ? null : row.employeeId,
                      )
                    }
                  >
                    <Text style={styles.menuBtnTxt}>⋮</Text>
                  </Pressable>
                  {openMenuId === row.employeeId && (
                    <View style={styles.menu}>
                      <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                          setOpenMenuId(null);
                          onView(row);
                        }}
                      >
                        <Text style={styles.menuItemTxt}>View</Text>
                      </Pressable>
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
                          Alert.alert('Delete', `Delete ${row.name}?`, [
                            { text: 'Cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => onDelete(row.employeeId),
                            },
                          ]);
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

  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontWeight: '700',
  },

  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  roleTxt: { flex: 1, color: '#111827', fontWeight: '700' },
  roleCaret: { color: '#6b7280' },

  menuBtn: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  menuBtnTxt: { color: '#fff', fontWeight: '900' },

  menu: {
    position: 'static',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 140,
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
