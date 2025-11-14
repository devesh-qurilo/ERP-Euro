import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

export default function ProjectsTable({
  data = [],
  loading,
  busyIds = [],
  onView,
  onEdit,
  onDelete,
  onStatus,
  onPin,
  onUnpin,
  onArchive,
  onUnarchive,
  showClientColumn = true,
}) {
  const [menuItem, setMenuItem] = useState(null); // the item for which modal is open
  const [menuVisible, setMenuVisible] = useState(false);

  function openMenu(item) {
    setMenuItem(item);
    setMenuVisible(true);
  }
  function closeMenu() {
    setMenuVisible(false);
    setMenuItem(null);
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <>
      <ScrollView horizontal style={styles.hscroll}>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.head]}>
            <Text style={[styles.cell, styles.hcell]}>Code</Text>
            <Text style={[styles.cell, styles.hcell, { minWidth: 220 }]}>
              Project Name
            </Text>
            <Text style={[styles.cell, styles.hcell, { minWidth: 160 }]}>
              Members
            </Text>
            <Text style={[styles.cell, styles.hcell]}>Start Date</Text>
            <Text style={[styles.cell, styles.hcell]}>Deadline</Text>
            {showClientColumn && (
              <Text style={[styles.cell, styles.hcell, { minWidth: 200 }]}>
                Client
              </Text>
            )}
            <Text style={[styles.cell, styles.hcell, { minWidth: 200 }]}>
              Status
            </Text>
            <Text style={[styles.cell, styles.hcell, { minWidth: 120 }]}>
              Actions
            </Text>
          </View>

          {/* Rows */}
          {data.map(item => {
            const isBusy = busyIds.includes?.(item.id);

            return (
              <View key={item.id} style={styles.row}>
                <Text style={styles.cell}>#{item.shortCode || '—'}</Text>

                <Text
                  style={[styles.cell, { minWidth: 220 }]}
                  numberOfLines={1}
                >
                  {item.name || '—'}
                </Text>

                <View style={[styles.cell, styles.members]}>
                  {(item.assignedEmployees || []).slice(0, 4).map(m => (
                    <Image
                      key={m.employeeId}
                      source={m.profileUrl ? { uri: m.profileUrl } : undefined}
                      style={styles.avatar}
                    />
                  ))}
                  {item.assignedEmployees?.length > 4 && (
                    <View style={styles.more}>
                      <Text style={styles.moreTxt}>
                        +{item.assignedEmployees.length - 4}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.cell}>{item.startDate || '—'}</Text>

                <Text style={styles.cell}>
                  {item.deadline || (item.noDeadline ? 'No deadline' : '—')}
                </Text>

                {showClientColumn && (
                  <View style={[styles.cell, styles.client]}>
                    {item.client?.profilePictureUrl ? (
                      <Image
                        source={{ uri: item.client.profilePictureUrl }}
                        style={styles.clientPic}
                      />
                    ) : null}
                    <Text numberOfLines={1} style={{ maxWidth: 160 }}>
                      {item.client?.name || '—'}
                    </Text>
                  </View>
                )}

                <View style={[styles.cell, styles.progress]}>
                  <Text>{item.projectStatus || '—'}</Text>
                  {item.progressPercent != null && (
                    <View style={styles.barWrap}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${Math.min(100, item.progressPercent)}%` },
                        ]}
                      />
                      <Text style={styles.barPct}>{item.progressPercent}%</Text>
                    </View>
                  )}
                </View>

                {/* Single 3-dot action button */}
                <View style={[styles.cell, styles.actions]}>
                  <Pressable
                    onPress={() => openMenu(item)}
                    style={styles.dotBtn}
                    accessibilityLabel="Open actions"
                  >
                    <Text style={{ fontSize: 18 }}>⋯</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal menu */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            {menuItem ? (
              <>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  Actions — {menuItem.name || menuItem.shortCode || 'Project'}
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalActionBtn}
                    onPress={() => {
                      closeMenu();
                      onView?.(menuItem);
                    }}
                  >
                    <Text style={styles.modalActionTxt}>View</Text>
                  </Pressable>

                  <Pressable
                    style={styles.modalActionBtn}
                    onPress={() => {
                      closeMenu();
                      onEdit?.(menuItem);
                    }}
                  >
                    <Text style={styles.modalActionTxt}>Edit</Text>
                  </Pressable>

                  {/* Pin / Unpin */}
                  {menuItem.pinned ? (
                    <Pressable
                      style={styles.modalActionBtn}
                      onPress={() => {
                        closeMenu();
                        onUnpin?.(menuItem.id);
                      }}
                      disabled={busyIds.includes(menuItem.id)}
                    >
                      <Text
                        style={[
                          styles.modalActionTxt,
                          busyIds.includes(menuItem.id) && styles.disabledTxt,
                        ]}
                      >
                        Unpin
                      </Text>
                      {busyIds.includes(menuItem.id) && (
                        <ActivityIndicator
                          size="small"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.modalActionBtn}
                      onPress={() => {
                        closeMenu();
                        onPin?.(menuItem.id);
                      }}
                      disabled={busyIds.includes(menuItem.id)}
                    >
                      <Text
                        style={[
                          styles.modalActionTxt,
                          busyIds.includes(menuItem.id) && styles.disabledTxt,
                        ]}
                      >
                        Pin
                      </Text>
                      {busyIds.includes(menuItem.id) && (
                        <ActivityIndicator
                          size="small"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </Pressable>
                  )}

                  {/* Archive / Unarchive */}
                  {menuItem.archived ? (
                    <Pressable
                      style={styles.modalActionBtn}
                      onPress={() => {
                        closeMenu();
                        onUnarchive?.(menuItem.id);
                      }}
                      disabled={busyIds.includes(menuItem.id)}
                    >
                      <Text
                        style={[
                          styles.modalActionTxt,
                          busyIds.includes(menuItem.id) && styles.disabledTxt,
                        ]}
                      >
                        Unarchive
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.modalActionBtn}
                      onPress={() => {
                        closeMenu();
                        onArchive?.(menuItem.id);
                      }}
                      disabled={busyIds.includes(menuItem.id)}
                    >
                      <Text
                        style={[
                          styles.modalActionTxt,
                          busyIds.includes(menuItem.id) && styles.disabledTxt,
                        ]}
                      >
                        Archive
                      </Text>
                    </Pressable>
                  )}

                  {/* Delete */}
                  <Pressable
                    style={styles.modalActionBtnDanger}
                    onPress={() => {
                      closeMenu();
                      onDelete?.(menuItem.id);
                    }}
                    disabled={busyIds.includes(menuItem.id)}
                  >
                    <Text
                      style={[
                        styles.modalActionTxt,
                        styles.dangerTxt,
                        busyIds.includes(menuItem.id) && styles.disabledTxt,
                      ]}
                    >
                      Delete
                    </Text>
                  </Pressable>
                </View>

                {/* optional status action if provided */}
                {onStatus && (
                  <View style={{ marginTop: 8 }}>
                    <Pressable
                      style={styles.modalActionBtn}
                      onPress={() => {
                        closeMenu();
                        onStatus?.(menuItem);
                      }}
                    >
                      <Text style={styles.modalActionTxt}>Change Status</Text>
                    </Pressable>
                  </View>
                )}
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  hscroll: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  table: { minWidth: 1000 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  head: { backgroundColor: '#f8fafc' },
  cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 140 },
  hcell: { fontWeight: '800', color: '#111827' },

  members: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 160,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 4,
    backgroundColor: '#e5e7eb',
  },
  more: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  moreTxt: { fontSize: 12, fontWeight: '700' },

  client: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 200 },
  clientPic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
  },

  progress: { minWidth: 200 },
  barWrap: {
    marginTop: 6,
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#1d4ed8',
  },
  barPct: { fontSize: 10, textAlign: 'center', color: '#fff' },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
    justifyContent: 'flex-start',
  },
  dotBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  /* modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  modalWrap: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: { fontWeight: '700', marginBottom: 8 },
  modalActions: { marginTop: 6 },

  modalActionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalActionBtnDanger: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  modalActionTxt: { fontWeight: '600' },
  dangerTxt: { color: '#b91c1c' },
  disabledTxt: { color: '#9ca3af' },
});
