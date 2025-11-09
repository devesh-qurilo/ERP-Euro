import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const fmt = d => {
  if (!d) return 'Unknown';
  const dt = new Date(d);
  if (isNaN(+dt)) return String(d);
  return dt.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

export default function TaskCalendar({ data = [], onPressTask }) {
  // group by startDate
  const groups = useMemo(() => {
    const m = new Map();
    data.forEach(t => {
      const k = t?.startDate || 'Unknown';
      const arr = m.get(k) || [];
      arr.push(t);
      m.set(k, arr);
    });
    // sort by date asc (Unknown last)
    return Array.from(m.entries()).sort(([a], [b]) => {
      if (!a) return 1;
      if (!b) return -1;
      return new Date(a) - new Date(b);
    });
  }, [data]);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        padding: 12,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: '#111827',
          marginBottom: 8,
        }}
      >
        Calendar (by Start Date)
      </Text>

      {groups.map(([dateKey, tasks]) => (
        <View key={dateKey} style={{ marginBottom: 14 }}>
          <View
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontWeight: '700', color: '#111827' }}>
              {fmt(dateKey)}
            </Text>
          </View>

          <View style={{ marginTop: 8 }}>
            {tasks.map(t => (
              <TouchableOpacity
                key={t.id}
                onPress={() => onPressTask && onPressTask(t)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: '#EEE',
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontWeight: '600', color: '#111827' }}>
                  {t.title}
                </Text>
                <Text style={{ color: '#6B7280', marginTop: 2 }}>
                  Stage: {t?.taskStage?.name || '—'} · Priority:{' '}
                  {t?.priority || '—'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
