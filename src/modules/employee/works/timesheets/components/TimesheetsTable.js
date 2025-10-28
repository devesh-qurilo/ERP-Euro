import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = t => (t ? t.slice(0, 5) : '—');

const RowHead = ({ cols, widths }) => (
  <View style={styles.trHead}>
    {cols.map((c, i) => (
      <View key={c} style={[styles.th, { width: widths[i] }]}>
        <Text style={styles.thTxt}>{c}</Text>
      </View>
    ))}
  </View>
);

export default function TimesheetsTable({ data = [], onView }) {
  return (
    <ScrollView horizontal style={styles.tableWrap}>
      <View style={styles.table}>
        <RowHead
          cols={[
            'Employee',
            'Project',
            'Task',
            'Start',
            'End',
            'Memo',
            'Hours',
            'Action',
          ]}
          widths={[220, 120, 100, 160, 160, 240, 90, 100]}
        />
        {data.map(s => (
          <View key={s.id} style={styles.tr}>
            {/* Employee */}
            <View
              style={[
                styles.td,
                {
                  width: 220,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                },
              ]}
            >
              {s.employees?.[0]?.profileUrl ? (
                <Image
                  source={{ uri: s.employees[0].profileUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarEmpty]}>
                  <Text>👤</Text>
                </View>
              )}
              <View>
                <Text style={styles.body} numberOfLines={1}>
                  {s.employees?.[0]?.name || s.employeeId}
                </Text>
                <Text style={styles.dim} numberOfLines={1}>
                  {s.employees?.[0]?.designation || '—'}
                </Text>
              </View>
            </View>

            <Cell w={120} text={`#${s.projectId ?? '—'}`} />
            <Cell w={100} text={String(s.taskId ?? '—')} />
            <Cell
              w={160}
              text={`${fmtDate(s.startDate)} ${fmtTime(s.startTime)}`}
            />
            <Cell
              w={160}
              text={`${fmtDate(s.endDate)} ${fmtTime(s.endTime)}`}
            />
            <Cell w={240} text={s.memo || '—'} />
            <Cell w={90} text={`${s.durationHours ?? 0} h`} />

            <View style={[styles.td, { width: 100 }]}>
              <Pressable onPress={() => onView?.(s)} style={styles.viewBtn}>
                <Text style={styles.viewTxt}>View</Text>
              </Pressable>
            </View>
          </View>
        ))}
        {!data.length && (
          <Text style={{ padding: 12, color: '#6b7280' }}>
            No timesheets yet.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

function Cell({ w, text }) {
  return (
    <View style={[styles.td, { width: w }]}>
      <Text style={styles.body} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tableWrap: { marginTop: 10 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  trHead: { flexDirection: 'row', backgroundColor: '#e8f0ff' },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  thTxt: { fontWeight: '900', color: '#374151' },

  tr: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
  td: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  body: { color: '#111827' },
  dim: { color: '#6b7280' },

  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewBtn: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  viewTxt: { color: '#fff', fontWeight: '900' },
});
