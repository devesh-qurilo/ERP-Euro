import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchKanban,
  moveCard,
  createStage,
  updateStage,
  deleteStage,
} from '../store/actions';
import {
  selectKanbanBusy,
  selectKanbanStages,
  selectKanbanColumns,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';

/**
 * Fancy Kanban screen (drop-in)
 * - soft shadows, rounded columns
 * - card shows: title, leadName, leadMobile, colored tags, avatar stack
 * - Open button is a pill
 * - Move menu remains simple (keeps behavior)
 */

export default function AdminDealKanbanScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const busy = useSelector(selectKanbanBusy);
  const stages = useSelector(selectKanbanStages);
  const columns = useSelector(selectKanbanColumns);

  useEffect(() => {
    dispatch(fetchKanban());
  }, [dispatch]);

  if (busy && !stages.length)
    return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Deals Kanban</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => dispatch(fetchKanban())}
            style={styles.refreshBtn}
          >
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.columnsContainer}
        showsHorizontalScrollIndicator={false}
      >
        {stages.map(stage => (
          <View key={stage.id} style={styles.column}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnTitle}>{stage.name}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {(columns[stage.name] || []).length}
                </Text>
              </View>
            </View>

            <FlatList
              data={columns[stage.name] || []}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <KanbanCard
                  item={item}
                  stage={stage}
                  stages={stages}
                  dispatch={dispatch}
                  navigation={nav}
                />
              )}
              style={{ marginTop: 10 }}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </View>
        ))}

        {/* Unassigned column if any */}
        {columns['Unassigned'] && columns['Unassigned'].length > 0 && (
          <View style={styles.column} key="unassigned">
            <View style={styles.columnHeader}>
              <Text style={styles.columnTitle}>Unassigned</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {columns['Unassigned'].length}
                </Text>
              </View>
            </View>

            <FlatList
              data={columns['Unassigned']}
              keyExtractor={i => String(i.id)}
              renderItem={({ item }) => (
                <KanbanCard
                  item={item}
                  stage={{ name: 'Unassigned' }}
                  stages={stages}
                  dispatch={dispatch}
                />
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------------- Kanban Card (fancy) ---------------- */
function KanbanCard({ item, stage, stages, dispatch, navigation }) {
  const [openMenu, setOpenMenu] = useState(false);
  console.log('chandu', item);

  // minimal required fields
  const leadName =
    item.leadName || item.assignedEmployeesMeta?.[0]?.name || '--';
  const leadMobile = item.leadMobile || '--';
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const calend = item.followups[0]?.nextDate || '--';

  // avatars from assignedEmployeesMeta (max 3)
  const avatars = (item.assignedEmployeesMeta || []).slice(0, 3);

  // first 2 tags to show
  const visibleTags = tags.slice(0, 2);
  const overflow = tags.length - visibleTags.length;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {/* <Text style={styles.cardTitle} numberOfLines={1}>
          {calend}
        </Text> */}

        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate?.('AdminDealView', { dealId: item.id })
            }
            style={styles.openPill}
          >
            <Text style={styles.openPillText}>Open</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOpenMenu(!openMenu)}
            style={styles.menuBtn}
          >
            <Text style={styles.openPillText}>Stages</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={{ flex: 1 }}>
          <Text style={styles.leadName}>{leadName}</Text>
          <Text style={styles.leadMobile}>{leadMobile}</Text>
          <Text style={styles.leadCalender}>{calend}</Text>
          <View style={styles.tagsRow}>
            {visibleTags.length === 0 && (
              <Text style={styles.noTagsText}>No tags</Text>
            )}
            {visibleTags.map((t, i) => (
              <TagChip key={`${t}-${i}`} text={t} index={i} />
            ))}
            {overflow > 0 && <TagChip text={`+${overflow}`} compact />}
          </View>
        </View>

        {/* avatar stack on right */}
        <View style={styles.avatarStack}>
          {avatars.map((a, i) => (
            <Image
              key={i}
              source={{ uri: a.profileUrl }}
              style={[styles.avatar, { marginLeft: i === 0 ? 0 : -8 }]}
            />
          ))}
          {(item.assignedEmployeesMeta || []).length > avatars.length && (
            <View
              style={[styles.avatar, styles.avatarMore, { marginLeft: -8 }]}
            >
              <Text style={styles.avatarMoreText}>
                +{(item.assignedEmployeesMeta || []).length - avatars.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* move menu */}
      {openMenu && (
        <View style={styles.menu}>
          <Text style={styles.menuLabel}>Move to</Text>
          {stages.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => {
                setOpenMenu(false);
                if (s.name === stage.name) return;
                dispatch(moveCard(item.id, s.name));
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

/* ---------------- Tag chip ---------------- */
function TagChip({ text, index = 0, compact = false }) {
  // pick soft color by index (rotate)
  const colors = ['#E9F5FF', '#EAF7EE', '#FFF4E6', '#F5E7FF', '#FDEEEE'];
  const bg = colors[index % colors.length];
  return (
    <View
      style={[
        styles.tagChip,
        compact ? styles.tagChipCompact : null,
        { backgroundColor: bg },
      ]}
    >
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

/* ---------------- FancyTable stub (for future use) ----------------
   Reuse styles.card and TagChip to keep consistent look.
*/
export function FancyTable({ rows = [] }) {
  return (
    <View style={{ padding: 12 }}>
      {rows.map(r => (
        <View key={r.id} style={[styles.card, { marginBottom: 12 }]}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ fontWeight: '700' }}>{r.title}</Text>
            <Text style={{ color: '#777' }}>{r.leadMobile || '--'}</Text>
          </View>

          <View style={{ marginTop: 8 }}>
            <Text style={{ color: '#333' }}>{r.leadName || '--'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              {(r.tags || []).slice(0, 3).map((t, i) => (
                <TagChip key={i} text={t} index={i} />
              ))}
              {(r.tags || []).length === 0 && (
                <Text style={{ color: '#999' }}>No tags</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#F6F7FB' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#222' },
  refreshBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  refreshText: { color: '#3F6AE1', fontWeight: '600' },

  columnsContainer: { paddingBottom: 40, paddingLeft: 2, paddingRight: 12 },
  column: {
    width: 340,
    marginRight: 14,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eef0f3',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnTitle: { fontSize: 16, fontWeight: '800', color: '#222' },
  countBadge: {
    backgroundColor: '#F0F3F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: '#333', fontWeight: '700' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef0f3',
    marginBottom: 12,

    // soft shadow (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontWeight: '800', fontSize: 15, color: '#222', maxWidth: 220 },

  openPill: {
    backgroundColor: '#E9F2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    marginBottom: 8,
  },
  openPillText: { color: '#2B6BD8', fontWeight: '700' },

  menuBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  menuText: { fontSize: 20, color: '#666' },

  cardBody: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  leadName: { fontSize: 14, fontWeight: '700', color: '#222' },
  leadMobile: { color: '#666', marginTop: 4 },
  leadCalender: {
    color: '#843838ff',
    marginTop: 4,
    backgroundColor: '#b4d2deff',
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
  noTagsText: { color: '#999', fontSize: 12 },
  tagChip: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: '#e6e9ef',
  },
  tagChipCompact: { paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 12, color: '#333' },

  avatarStack: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatarMore: {
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMoreText: { color: '#2B6BD8', fontWeight: '700' },

  menu: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  menuLabel: { color: '#333', fontWeight: '700', marginBottom: 6 },
  menuItem: { paddingVertical: 8 },
  menuItemText: { color: '#333' },
});
