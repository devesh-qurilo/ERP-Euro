import React, { memo, useState, useMemo } from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { deleteDeal, setEditing, setFormOpen } from '../deals/store/actions';
import { selectPriorities } from '../deals/priorities/selectors';
import api from '../../../../services/api';
import { selectKanbanStages } from '../deals/kanban/store/selectors';

const DealRow = memo(function DealRow({
  item,
  busy,
  onAddFollowup,
  onEdit,
  columns,
  onDelete,
  onRowUpdate,
}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const priorities = useSelector(selectPriorities);
  const [stageDropdown, setStageDropdown] = useState(false);
  const [priorityDropdown, setPriorityDropdown] = useState(false);

  /* ================= FORMATTERS ================= */

  const formattedValue = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(item.value || 0));
  }, [item.value]);

  const formattedCloseDate = useMemo(() => {
    if (!item.expectedCloseDate) return '—';
    return item.expectedCloseDate;
  }, [item.expectedCloseDate]);

  const latestFollowup = useMemo(() => {
    if (!item.followups?.length) return null;

    return [...item.followups].sort(
      (a, b) => new Date(b.nextDate) - new Date(a.nextDate),
    )[0];
  }, [item.followups]);

  const stages = useSelector(selectKanbanStages);

  /* ================= UPDATE STAGE ================= */

  const handleStageChange = async stageName => {
    // 🔥 Optimistic update first
    onRowUpdate?.(item.id, {
      dealStage: stageName,
    });

    try {
      await api.put(`/deals/${item.id}/stage?stage=${stageName}`);
    } catch (err) {
      // console.log('Stage update error', err);
    }
  };

  /* ================= UPDATE PRIORITY ================= */

  const handlePriorityChange = async status => {
    const selected = priorities.find(p => p.status === status);
    if (!selected) return;

    // 🔥 Optimistic update
    onRowUpdate?.(item.id, {
      priority: {
        ...item.priority,
        status: selected.status,
        color: selected.color,
      },
    });

    try {
      await api.put(`/deals/${item.id}/priority`, {
        priorityId: selected.id,
      });
    } catch (err) {
      console.log('Priority update error', err);
    }
  };

  /* ================= ACTIONS ================= */

  const handleView = () => {
    setMenuOpen(false);
    navigation.navigate('AdminDealView', {
      dealId: item.id,
    });
  };

  // const handleEdit = () => {
  //   setMenuOpen(false);
  //   dispatch(setEditing(item));
  //   dispatch(setFormOpen(true));
  // };

  const handleEdit = () => {
    setMenuOpen(false);
    if (onEdit) {
      onEdit(item);
    } else {
      dispatch(setEditing(item));
      dispatch(setFormOpen(true));
    }
  };

  // const handleDelete = () => {
  //   setMenuOpen(false);
  //   dispatch(deleteDeal(item.id));
  // };

  const handleFollowup = () => {
    setMenuOpen(false);
    onAddFollowup?.(item.id);
  };

  const handleDelete = () => {
    setMenuOpen(false);

    if (onDelete) {
      onDelete(item);
    } else {
      dispatch(deleteDeal(item.id));
    }
  };

  /* ================= UI ================= */

  const Winfilter = item.dealStage?.trim().toLowerCase();
  return (
    <View style={styles.row}>
      {/* DEALkk */}
      <View style={[styles.cell, { width: columns[0].width }]}>
        <Text numberOfLines={1}>{item.title}</Text>
      </View>

      {/* LEAD */}
      <View style={[styles.cell, { width: columns[1].width }]}>
        <Text style={styles.leadName} numberOfLines={1}>
          {item.leadName}
        </Text>
        <Text style={styles.subText} numberOfLines={1}>
          {item.leadMobile}
        </Text>
      </View>

      {/* VALUE */}
      <View style={[styles.cell, { width: columns[2].width }]}>
        <Text style={{ fontWeight: '700' }}>{formattedValue}</Text>
      </View>

      {/* CLOSE DATE */}
      <View style={[styles.cell, { width: columns[3].width }]}>
        <Text>{formattedCloseDate}</Text>
      </View>

      {/* FOLLOWUP */}
      <View style={[styles.cell, { width: columns[4].width }]}>
        <Text numberOfLines={1}>
          {latestFollowup ? `${latestFollowup.nextDate} ` : '—'}
        </Text>
      </View>

      {/* AGENT */}
      <View
        style={[
          styles.cell,
          {
            width: columns[5].width,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
      >
        {item.dealAgentMeta?.profileUrl ? (
          <Image
            source={{ uri: item.dealAgentMeta.profileUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <Text style={{ marginLeft: 8 }} numberOfLines={1}>
          {item.dealAgentMeta?.name || item.dealAgent}
        </Text>
      </View>

      {/* WATCHERS */}
      <View
        style={[
          styles.cell,
          {
            width: columns[6].width,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
      >
        {item.dealWatchersMeta?.slice(0, 3).map(w => (
          <View key={w.employeeId} style={styles.watcherWrap}>
            {w.profileUrl ? (
              <Image
                source={{ uri: w.profileUrl }}
                style={styles.smallAvatar}
              />
            ) : (
              <View style={styles.smallAvatarPlaceholder} />
            )}
          </View>
        ))}
        {item.dealWatchersMeta?.length > 3 && (
          <Text style={{ marginLeft: 6 }}>
            +{item.dealWatchersMeta.length - 3}
          </Text>
        )}
      </View>

      {/* STAGE DROPDOWN */}
      <View style={[styles.cell, { width: columns[7].width }]}>
        <Pressable
          style={styles.stageBadge}
          onPress={() => setStageDropdown(true)}
        >
          <Text style={styles.stageText}>{item.dealStage}</Text>
        </Pressable>
      </View>

      {/* PRIORITY
      <View style={[styles.cell, { width: columns[8].width }]}>
        <Pressable
          style={[
            styles.priorityBadge,
            { backgroundColor: item.priority?.color || '#999' },
          ]}
          onPress={() => setPriorityDropdown(true)}
        >
          <Text style={styles.priorityText}>
            {item.priority?.status || 'Select'}
          </Text>
        </Pressable>
      </View> */}

      {/* TAGS */}
      <View
        style={[styles.cell, { width: columns[8].width, flexDirection: 'row' }]}
      >
        {item.tags?.slice(0, 2).map((tag, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* ACTIONS */}
      <View
        style={[
          styles.cell,
          { width: columns[9].width, alignItems: 'flex-center' },
        ]}
      >
        {busy ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Pressable onPress={() => setMenuOpen(s => !s)}>
              <Text style={{ fontSize: 24 }}>⋮</Text>
            </Pressable>

            {menuOpen &&
              (Winfilter == 'win' ? (
                <View style={styles.menu}>
                  <Pressable onPress={handleView} style={styles.menuItem}>
                    <Text>View</Text>
                  </Pressable>
                  <Pressable onPress={handleEdit} style={styles.menuItem}>
                    <Text>Edit</Text>
                  </Pressable>
                  <Pressable onPress={handleDelete} style={styles.menuItem}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.menu}>
                  <Pressable onPress={handleView} style={styles.menuItem}>
                    <Text>View</Text>
                  </Pressable>
                  <Pressable onPress={handleEdit} style={styles.menuItem}>
                    <Text>Edit</Text>
                  </Pressable>
                  <Pressable onPress={handleFollowup} style={styles.menuItem}>
                    <Text>Add Followup</Text>
                  </Pressable>
                  <Pressable onPress={handleDelete} style={styles.menuItem}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </Pressable>
                </View>
              ))}
          </>
        )}
      </View>

      {stageDropdown && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setStageDropdown(false)}
          >
            <View style={styles.dropdownCard}>
              <ScrollView style={{ maxHeight: 220 }}>
                {stages?.map(stage => (
                  <Pressable
                    key={stage.id}
                    style={styles.dropdownItem}
                    onPress={async () => {
                      await handleStageChange(stage.name);
                      setStageDropdown(false);
                    }}
                  >
                    <Text>{stage.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}

      {priorityDropdown && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setPriorityDropdown(false)}
          >
            <View style={styles.dropdownCard}>
              {/* REMOVE PRIORITY */}
              {item.priority && (
                <Pressable
                  style={styles.dropdownItem}
                  onPress={async () => {
                    try {
                      await api.delete(`/deals/${item.id}/priority`);

                      // 🔥 Optimistic remove
                      onRowUpdate?.(item.id, {
                        priority: null,
                      });

                      setPriorityDropdown(false);
                    } catch (err) {
                      console.log('Delete priority error', err);
                    }
                  }}
                >
                  <Text style={{ color: 'red' }}>Remove Priority</Text>
                </Pressable>
              )}

              {/* LIST */}
              <ScrollView style={{ maxHeight: 220 }}>
                {priorities?.map(p => (
                  <Pressable
                    key={p.id}
                    style={styles.dropdownItem}
                    onPress={async () => {
                      await handlePriorityChange(p.status);
                      setPriorityDropdown(false);
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: p.color,
                          marginRight: 8,
                        }}
                      />
                      <Text>{p.status}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
});

export default DealRow;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ebe8e8',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  cell: {
    paddingHorizontal: 12,
    fontSize: 13,
  },

  subText: {
    fontSize: 11,
    color: '#888',
  },

  leadName: {
    fontWeight: '600',
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
  },

  smallAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  smallAvatarPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ddd',
  },

  watcherWrap: {
    marginRight: -6,
  },

  stageBadge: {
    backgroundColor: '#eef6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  stageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2b6bd8',
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },

  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },

  tagText: {
    fontSize: 11,
  },

  actionsCol: {
    minWidth: 60,
    alignItems: 'flex-end',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdownCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    width: 200,
    elevation: 5,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  menu: {
    position: 'absolute',
    right: 0,
    top: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 140,
    elevation: 6,
    zIndex: 999,
  },

  menuItem: {
    padding: 10,
  },
});
