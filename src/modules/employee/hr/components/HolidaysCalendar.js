// src/modules/employee/hr/components/HolidaysCalendar.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

const ymd = d => {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${x.getFullYear()}-${m}-${day}`;
};

export default function HolidaysCalendar({ rows = [], year, monthIndex }) {
  const initialDate = ymd(new Date(year, monthIndex, 1));
  const [selected, setSelected] = useState(null);

  const { marked, byDate } = useMemo(() => {
    const marks = {};
    const map = {};
    rows.forEach(r => {
      const k = ymd(r.date);
      map[k] ||= [];
      map[k].push(r);
      const color = r.isDefaultWeekly ? '#9ca3af' : '#10b981';
      const prev = marks[k]?.dots || [];
      // up to 3 dots supported visually; keep last color as primary
      marks[k] = {
        marked: true,
        dots: [...prev, { color }],
        selected: selected === k,
      };
    });
    return { marked: marks, byDate: map };
  }, [rows, selected]);

  const list = selected ? byDate[selected] || [] : [];

  return (
    <View style={styles.card}>
      <Calendar
        initialDate={initialDate}
        markingType="multi-dot"
        markedDates={{
          ...marked,
          ...(selected
            ? {
                [selected]: {
                  ...(marked[selected] || {}),
                  selected: true,
                  selectedColor: '#111827',
                },
              }
            : {}),
        }}
        onDayPress={d => setSelected(d.dateString)}
        theme={{
          todayTextColor: '#2563eb',
          arrowColor: '#111827',
          textMonthFontWeight: '800',
          textDayFontWeight: '600',
        }}
        style={{ borderRadius: 12 }}
      />
      <View style={{ height: 10 }} />
      <Text style={styles.listTitle}>
        {selected ? `Holidays on ${selected}` : 'Tap a date to see holidays'}
      </Text>
      <FlatList
        data={list}
        keyExtractor={it => String(it.id)}
        ListEmptyComponent={
          selected ? <Text style={styles.empty}>None</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: item.isDefaultWeekly ? '#9ca3af' : '#10b981',
                },
              ]}
            />
            <Text style={styles.itemTxt}>{item.occasion}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  listTitle: {
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    marginLeft: 4,
  },
  empty: { color: '#6b7280', marginLeft: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eef2f5',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemTxt: { color: '#1f2328', fontWeight: '800' },
});
