// LeavesCalendar.js (RN CLI)
// Show day-wise leaves using react-native-calendars
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// (Optional) short weekday names
LocaleConfig.locales.en = {
  monthNames: [],
  monthNamesShort: [],
  dayNames: [],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

const COLORS = {
  APPROVED: '#16a34a',
  REJECTED: '#ef4444',
  PENDING: '#f59e0b',
  SICK: '#ef4444',
  CASUAL: '#22c55e',
  EARNED: '#6366f1',
};

// yyyy-mm-dd
const toKey = d => new Date(d).toISOString().slice(0, 10);

// expand a range [start,end] into yyyy-mm-dd[]
const expandRange = (start, end) => {
  const out = [];
  if (!start || !end) return out;
  let cur = new Date(start);
  const last = new Date(end);
  // normalize to midnight
  cur.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  while (cur.getTime() <= last.getTime()) {
    out.push(toKey(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
};

export default function LeavesCalendar({
  data = [], // list from /employee/api/leaves
  onApprove,
  onReject,
  onDelete, // actions
}) {
  const [selected, setSelected] = useState(toKey(new Date()));

  // Build { [date]: { dots:[{color}], marked:true } }
  const { marked, byDate } = useMemo(() => {
    const m = {};
    const map = {};
    data.forEach(lv => {
      let days = [];
      if (lv.singleDate) days = [toKey(lv.singleDate)];
      else days = expandRange(lv.startDate, lv.endDate);

      days.forEach(d => {
        const dotColor = COLORS[lv.status] || '#64748b';
        const existing = m[d]?.dots || [];
        m[d] = { dots: [...existing, { color: dotColor }], marked: true };
        (map[d] || (map[d] = [])).push(lv);
      });
    });
    // also highlight selected
    if (selected) {
      m[selected] = {
        ...(m[selected] || {}),
        selected: true,
        selectedColor: '#1d4ed8',
      };
    }
    return { marked: m, byDate: map };
  }, [data, selected]);

  const dayLeaves = byDate[selected] || [];

  return (
    <View style={s.card}>
      <Text style={s.title}>Leaves Calendar</Text>

      <Calendar
        markingType="multi-dot"
        markedDates={marked}
        onDayPress={d => setSelected(d.dateString)}
        theme={{
          todayTextColor: '#1d4ed8',
          arrowColor: '#1d4ed8',
        }}
      />

      <View style={s.legendRow}>
        <Legend label="Approved" color={COLORS.APPROVED} />
        <Legend label="Pending" color={COLORS.PENDING} />
        <Legend label="Rejected" color={COLORS.REJECTED} />
      </View>

      {/* Day details */}
      <Text style={s.subTitle}>
        {selected} — {dayLeaves.length} leave{dayLeaves.length === 1 ? '' : 's'}
      </Text>

      <ScrollView style={{ maxHeight: 260 }}>
        {dayLeaves.map(lv => (
          <View key={lv.id} style={s.item}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{lv.employeeName}</Text>
              <Text style={s.meta}>
                {lv.leaveType} • {lv.durationType?.replace('_', ' ')} •{' '}
                {lv.reason || '—'}
              </Text>
              <Text style={s.metaSmall}>
                status: {lv.status}
                {lv.approvedByName ? ` • by ${lv.approvedByName}` : ''}
              </Text>
            </View>

            <View style={s.actions}>
              <ActBtn
                label="Approve"
                color="#16a34a"
                onPress={() => onApprove(lv)}
              />
              <ActBtn
                label="Reject"
                color="#ef4444"
                onPress={() => onReject(lv)}
              />
              <ActBtn
                label="Delete"
                color="#111827"
                onPress={() => onDelete(lv)}
              />
            </View>
          </View>
        ))}
        {!dayLeaves.length && (
          <Text
            style={{
              color: '#6b7280',
              paddingVertical: 12,
              textAlign: 'center',
            }}
          >
            No leaves on this day.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function Legend({ label, color }) {
  return (
    <View style={s.legend}>
      <View style={[s.dot, { backgroundColor: color }]} />
      <Text style={s.legendTxt}>{label}</Text>
    </View>
  );
}

function ActBtn({ label, color, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.btn, { backgroundColor: color }]}>
      <Text style={s.btnTxt}>{label}</Text>
    </Pressable>
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
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8, color: '#111827' },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
    color: '#111827',
  },
  legendRow: { flexDirection: 'row', gap: 14, marginTop: 8, marginBottom: 2 },
  legend: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendTxt: { color: '#334155', fontWeight: '600' },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  name: { fontWeight: '800', color: '#111827' },
  meta: { color: '#374151', marginTop: 2 },
  metaSmall: { color: '#6b7280', marginTop: 2, fontSize: 12 },

  actions: { flexDirection: 'row', gap: 6, marginLeft: 10 },
  btn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  btnTxt: { color: '#fff', fontWeight: '700' },
});
