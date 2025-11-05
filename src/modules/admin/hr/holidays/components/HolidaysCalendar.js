import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const toKey = d => new Date(d).toISOString().slice(0, 10);

export default function HolidaysCalendar({ data = [] }) {
  const [selected, setSelected] = useState(toKey(new Date()));

  const { marked, byDate } = useMemo(() => {
    const m = {},
      map = {};
    data.forEach(h => {
      const k = toKey(h.date);
      m[k] = { marked: true, dotColor: '#1d4ed8' };
      (map[k] || (map[k] = [])).push(h);
    });
    if (selected)
      m[selected] = {
        ...(m[selected] || {}),
        selected: true,
        selectedColor: '#1d4ed8',
      };
    return { marked: m, byDate: map };
  }, [data, selected]);

  const list = byDate[selected] || [];

  return (
    <View style={s.card}>
      <Text style={s.title}>Holidays Calendar</Text>
      <Calendar
        markedDates={marked}
        onDayPress={d => setSelected(d.dateString)}
      />

      <Text style={s.subTitle}>
        {selected} • {list.length} item{list.length === 1 ? '' : 's'}
      </Text>
      {list.map((h, i) => (
        <View key={i} style={s.item}>
          <Text style={s.itemTitle}>{h.occasion}</Text>
          <Text style={s.itemMeta}>{h.date}</Text>
        </View>
      ))}
      {!list.length && <Text style={s.empty}>No holiday on this day.</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '700',
    color: '#111827',
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemTitle: { fontWeight: '800', color: '#111827' },
  itemMeta: { color: '#6b7280', marginTop: 2 },
  empty: { color: '#6b7280', paddingVertical: 12 },
});
