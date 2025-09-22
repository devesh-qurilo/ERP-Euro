// src/modules/employee/hr/components/LeavesCalendarModal.js
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves } from '../store/actions';
import { selectMyLeavesData, selectMyLeavesLoading } from '../store/selectors';

// Colors by STATUS (you can switch to leaveType if you prefer)
const STATUS_COLORS = {
  APPROVED: '#16a34a',
  PENDING: '#f59e0b',
  REJECTED: '#ef4444',
  DEFAULT: '#9ca3af',
};

function ymd(date) {
  if (!date) return null;
  try {
    const d = new Date(date);
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  } catch {
    return null;
  }
}

function eachDate(start, end) {
  const s = new Date(start),
    e = new Date(end);
  const out = [];
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push(ymd(d));
  }
  return out;
}

// priority so overlapping marks pick a “stronger” status
const PRIORITY = { REJECTED: 3, PENDING: 2, APPROVED: 1, DEFAULT: 0 };

export default function LeavesCalendarModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const leaves = useSelector(selectMyLeavesData);
  const loading = useSelector(selectMyLeavesLoading);

  // ensure data exists
  useEffect(() => {
    if (visible && (!leaves || leaves.length === 0)) dispatch(fetchMyLeaves());
  }, [visible, leaves, dispatch]);

  const [selected, setSelected] = useState(null);

  const initialDate = useMemo(() => {
    // prefer first upcoming/past leave
    const first = (leaves || [])[0];
    return ymd(first?.singleDate || first?.startDate || new Date());
  }, [leaves]);

  // Build Calendar markings (period ranges + single days)
  const { markedDates, dayMap } = useMemo(() => {
    const marks = {};
    const perDateLeaves = {}; // map date -> leaves occurring that date (for details list)

    const setMark = (date, payload, status) => {
      // Choose higher-priority status color if conflicts
      const prev = marks[date];
      const prevKey = prev?._status || 'DEFAULT';
      const currKey = status || 'DEFAULT';
      if (!prev || PRIORITY[currKey] >= PRIORITY[prevKey]) {
        marks[date] = {
          ...(prev || {}),
          ...payload,
          color: STATUS_COLORS[currKey] || STATUS_COLORS.DEFAULT,
        };
        marks[date]._status = currKey; // internal
      }
    };

    (leaves || []).forEach(row => {
      const status = row.status || 'DEFAULT';
      const color = STATUS_COLORS[status] || STATUS_COLORS.DEFAULT;

      if (row.singleDate) {
        const d = ymd(row.singleDate);
        setMark(
          d,
          { startingDay: true, endingDay: true, textColor: 'white' },
          status,
        );
        (perDateLeaves[d] ||= []).push(row);
      } else if (row.startDate || row.endDate) {
        const s = ymd(row.startDate || row.endDate);
        const e = ymd(row.endDate || row.startDate);
        const days = eachDate(s, e);
        days.forEach((d, i) => {
          const payload =
            i === 0
              ? { startingDay: true, textColor: 'white' }
              : i === days.length - 1
              ? { endingDay: true, textColor: 'white' }
              : { textColor: 'white' };
          setMark(d, payload, status);
          (perDateLeaves[d] ||= []).push(row);
        });
      }
    });

    return { markedDates: marks, dayMap: perDateLeaves };
  }, [leaves]);

  const listForSelected = useMemo(
    () => (selected ? dayMap[selected] || [] : []),
    [selected, dayMap],
  );

  const onDayPress = useCallback(day => {
    const key = day?.dateString;
    setSelected(key);
  }, []);

  // add selected visual (keeps period color)
  const markedWithSelected = useMemo(() => {
    if (!selected) return markedDates;
    const clone = { ...markedDates };
    clone[selected] = {
      ...(clone[selected] || {}),
      selected: true,
      selectedColor: '#111827',
    };
    return clone;
  }, [markedDates, selected]);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Leaves Calendar</Text>
            <Pressable onPress={onClose} style={styles.close}>
              <Text style={styles.closeTxt}>✕</Text>
            </Pressable>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {['APPROVED', 'PENDING', 'REJECTED'].map(s => (
              <View key={s} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: STATUS_COLORS[s] },
                  ]}
                />
                <Text style={styles.legendTxt}>
                  {s[0] + s.slice(1).toLowerCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar */}
          <Calendar
            initialDate={initialDate}
            onDayPress={onDayPress}
            markingType="period"
            markedDates={markedWithSelected}
            theme={{
              textMonthFontWeight: '800',
              textDayFontWeight: '600',
              todayTextColor: '#2563eb',
              arrowColor: '#111827',
            }}
            style={{ borderRadius: 12 }}
          />

          {/* Day details */}
          <View style={styles.details}>
            <Text style={styles.detailsTitle}>
              {selected ? `Leaves on ${selected}` : 'Tap a date to see details'}
            </Text>

            <FlatList
              data={listForSelected}
              keyExtractor={it => String(it.id)}
              ListEmptyComponent={
                selected ? (
                  <Text style={styles.empty}>No leaves on this date.</Text>
                ) : null
              }
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          STATUS_COLORS[item.status] || STATUS_COLORS.DEFAULT,
                      },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.employeeName} •{' '}
                      {item.leaveType?.[0] +
                        item.leaveType?.slice(1)?.toLowerCase()}
                    </Text>
                    <Text style={styles.itemSub} numberOfLines={1}>
                      {item.durationType === 'FULL_DAY'
                        ? 'Full Day'
                        : item.durationType === 'MULTIPLE'
                        ? `${ymd(item.startDate)} → ${ymd(item.endDate)}`
                        : item.durationType}
                      {item.reason ? ` — ${item.reason}` : ''}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    padding: 12,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  close: { padding: 6 },
  closeTxt: { fontSize: 18 },
  legend: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 4,
    marginBottom: -4,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { color: '#374151', fontWeight: '700' },

  details: { marginTop: 8, gap: 8, flex: 1 },
  detailsTitle: { fontWeight: '900', color: '#0b0b0c' },
  empty: { color: '#6b7280' },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eef2f5',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemTitle: { fontWeight: '800', color: '#111827' },
  itemSub: { color: '#6b7280' },
});
