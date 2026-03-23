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

const STATUS_OPTIONS = [
  'IN_PROGRESS',
  'ON_HOLD',
  'CANCELLED',
  'NOT_STARTED',
  'FINISHED',
];

const PROGRESS_OPTIONS = Array.from({ length: 11 }, (_, i) => i * 10); // 0..100

export default function ProjectsTable({
  data = [],
  loading,
  busyIds = [],
  onView,
  onEdit,
  onDelete,
  onStatus, // (id, status)
  onProgress, // (id, percent)
  onPin,
  onUnpin,
  onArchive,
  onUnarchive,
  showClientColumn = true,
}) {
  const [menuItem, setMenuItem] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = item => {
    setMenuItem(item);
    setMenuVisible(true);
  };
  const closeMenu = () => {
    setMenuVisible(false);
    setMenuItem(null);
  };

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
            <Text style={[styles.cell, styles.hcell, { minWidth: 180 }]}>
              Status
            </Text>
            <Text style={[styles.cell, styles.hcell, { minWidth: 100 }]}>
              Progress
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
                  {(item.assignedEmployees || []).slice(0, 2).map(m => (
                    <Image
                      key={m.employeeId}
                      source={m.profileUrl ? { uri: m.profileUrl } : undefined}
                      style={styles.avatar}
                    />
                  ))}
                  {item.assignedEmployees?.length > 2 && (
                    <View style={styles.more}>
                      <Text style={styles.moreTxt}>
                        +{item.assignedEmployees.length - 2}
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

                {/* Status cell: shows current and a small chevron to change */}
                <View style={[styles.cell, styles.statusCell]}>
                  <Pressable
                    style={styles.selectInline}
                    disabled={isBusy}
                    onPress={() => openMenu({ ...item, mode: 'status' })}
                  >
                    <Text numberOfLines={1} style={styles.selectTxt}>
                      {item.projectStatus || '—'}
                    </Text>
                    <Text style={styles.caret}>▾</Text>
                    {isBusy && (
                      <ActivityIndicator
                        size="small"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Pressable>
                </View>

                {/* Progress cell: show percent and allow quick change */}
                <View style={[styles.cell, styles.progressCell]}>
                  <Pressable
                    style={styles.selectInline}
                    disabled={isBusy}
                    onPress={() => openMenu({ ...item, mode: 'progress' })}
                  >
                    <Text numberOfLines={1} style={styles.selectTxt}>
                      {item.progressPercent != null
                        ? `${item.progressPercent}%`
                        : '—'}
                    </Text>
                    <Text style={styles.caret}>▾</Text>
                    {isBusy && (
                      <ActivityIndicator
                        size="small"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Pressable>
                </View>

                {/* Actions */}
                <View style={[styles.cell, styles.actions]}>
                  <Pressable
                    onPress={() => openMenu({ ...item, mode: 'actions' })}
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

      {/* Menu Modal (used for status, progress and full actions) */}
      <Modal
        visible={!!menuVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            {menuItem ? (
              <>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {menuItem.mode === 'status' &&
                    `Change status — ${menuItem.name}`}
                  {menuItem.mode === 'progress' &&
                    `Change progress — ${menuItem.name}`}
                  {menuItem.mode === 'actions' && `Actions — ${menuItem.name}`}
                </Text>

                {/* Status selector */}
                {menuItem.mode === 'status' &&
                  STATUS_OPTIONS.map(s => (
                    <Pressable
                      key={s}
                      style={styles.modalActionBtn}
                      onPress={() => {
                        setMenuVisible(false);
                        onStatus?.(menuItem.id, s);
                      }}
                      disabled={busyIds.includes(menuItem.id)}
                    >
                      <Text
                        style={[
                          styles.modalActionTxt,
                          menuItem.projectStatus === s
                            ? { fontWeight: '800' }
                            : null,
                        ]}
                      >
                        {s}
                      </Text>
                    </Pressable>
                  ))}

                {/* Progress selector */}
                {menuItem.mode === 'progress' &&
                  PROGRESS_OPTIONS.map(p => (
                    <Pressable
                      key={p}
                      style={styles.modalActionBtn}
                      onPress={() => {
                        setMenuVisible(false);
                        onProgress?.(menuItem.id, p);
                      }}
                      disabled={busyIds.includes(menuItem.id)}
                    >
                      <Text
                        style={[
                          styles.modalActionTxt,
                          menuItem.progressPercent === p
                            ? { fontWeight: '800' }
                            : null,
                        ]}
                      >
                        {p}%
                      </Text>
                    </Pressable>
                  ))}

                {/* Actions menu (view/edit/pin/archive/delete) */}
                {menuItem.mode === 'actions' && (
                  <>
                    <Pressable
                      style={styles.modalActionBtn}
                      onPress={() => {
                        setMenuVisible(false);
                        onView?.(menuItem);
                      }}
                    >
                      <Text style={styles.modalActionTxt}>View</Text>
                    </Pressable>

                    <Pressable
                      style={styles.modalActionBtn}
                      onPress={() => {
                        setMenuVisible(false);
                        onEdit?.(menuItem);
                      }}
                    >
                      <Text style={styles.modalActionTxt}>Edit</Text>
                    </Pressable>

                    {menuItem.pinned ? (
                      <Pressable
                        style={styles.modalActionBtn}
                        onPress={() => {
                          setMenuVisible(false);
                          onUnpin?.(menuItem.id);
                        }}
                        disabled={busyIds.includes(menuItem.id)}
                      >
                        <Text style={styles.modalActionTxt}>Unpin</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.modalActionBtn}
                        onPress={() => {
                          setMenuVisible(false);
                          onPin?.(menuItem.id);
                        }}
                        disabled={busyIds.includes(menuItem.id)}
                      >
                        <Text style={styles.modalActionTxt}>Pin</Text>
                      </Pressable>
                    )}

                    {menuItem.archived ? (
                      <Pressable
                        style={styles.modalActionBtn}
                        onPress={() => {
                          setMenuVisible(false);
                          onUnarchive?.(menuItem.id);
                        }}
                        disabled={busyIds.includes(menuItem.id)}
                      >
                        <Text style={styles.modalActionTxt}>Unarchive</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.modalActionBtn}
                        onPress={() => {
                          setMenuVisible(false);
                          onArchive?.(menuItem.id);
                        }}
                        disabled={busyIds.includes(menuItem.id)}
                      >
                        <Text style={styles.modalActionTxt}>Archive</Text>
                      </Pressable>
                    )}

                    <Pressable
                      style={styles.modalActionBtnDanger}
                      onPress={() => {
                        setMenuVisible(false);
                        onDelete?.(menuItem.id);
                      }}
                      disabled={busyIds.includes(menuItem.id)}
                    >
                      <Text style={[styles.modalActionTxt, styles.dangerTxt]}>
                        Delete
                      </Text>
                    </Pressable>
                  </>
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
  table: { minWidth: 1100 },
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

  progressCell: { minWidth: 140 },
  statusCell: { minWidth: 140 },

  selectInline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectTxt: { flex: 1, fontWeight: '600' },
  caret: { color: '#6b7280', marginLeft: 8 },

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
