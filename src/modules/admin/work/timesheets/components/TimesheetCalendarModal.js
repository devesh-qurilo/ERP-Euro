import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/* ---------------- helpers ---------------- */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toKey = d => new Date(d).toISOString().slice(0, 10);

const startOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = d => new Date(d.getFullYear(), d.getMonth() + 1, 0);

/* ---------------- main ---------------- */

export default function TimesheetCalendarModal({
  visible,
  onClose,
  items = [],
}) {
  const [cursor, setCursor] = useState(new Date());

  /* group timesheets by date */
  const byDate = useMemo(() => {
    const map = {};
    items.forEach(t => {
      if (!t.startDate) return;
      const k = toKey(t.startDate);
      (map[k] ||= []).push(t);
    });
    return map;
  }, [items]);

  /* build month grid */
  const grid = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);

    const cells = [];
    const firstDayIndex = start.getDay();

    // empty leading cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }

    // month days
    for (let d = 1; d <= end.getDate(); d++) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }

    return cells;
  }, [cursor]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          {/* Header */}
          <View style={s.header}>
            <Pressable
              onPress={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                )
              }
            >
              <Icon name="chevron-back" size={24} />
            </Pressable>

            <Text style={s.h2}>
              {cursor.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>

            <Pressable
              onPress={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
                )
              }
            >
              <Icon name="chevron-forward" size={24} />
            </Pressable>

            <Pressable onPress={onClose} style={s.closeBtn}>
              <Icon name="close" size={22} />
            </Pressable>
          </View>

          {/* Week Days */}
          <View style={s.weekRow}>
            {DAYS.map(d => (
              <Text key={d} style={s.weekDay}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <ScrollView contentContainerStyle={s.grid}>
            {grid.map((date, i) => {
              if (!date) return <View key={i} style={s.cellEmpty} />;

              const key = toKey(date);
              const dayItems = byDate[key] || [];

              return (
                <View key={key} style={s.cell}>
                  <Text style={s.dateNum}>{date.getDate()}</Text>

                  {dayItems.slice(0, 3).map(t => (
                    <View key={t.id} style={s.event}>
                      <Text numberOfLines={1} style={s.eventTxt}>
                        #{t.taskId} • {t.durationHours ?? 0}h
                      </Text>
                    </View>
                  ))}

                  {dayItems.length > 3 && (
                    <Text style={s.more}>+{dayItems.length - 3} more</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- styles ---------------- */

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },

  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  h2: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },

  weekRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '800',
    color: '#6b7280',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    width: '14.28%',
    minHeight: 90,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    padding: 4,
  },
  cellEmpty: {
    width: '14.28%',
    minHeight: 90,
  },

  dateNum: {
    fontWeight: '900',
    marginBottom: 4,
    color: '#111827',
  },

  event: {
    backgroundColor: '#e0e7ff',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 2,
  },
  eventTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  more: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
});
