import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

const monthName = d =>
  d.toLocaleString(undefined, { month: 'long', year: 'numeric' });

function buildMonth(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // start Monday
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function ProjectsCalendarModal({ visible, onClose, projects }) {
  const [cursor, setCursor] = useState(() => new Date());

  const days = useMemo(() => buildMonth(cursor), [cursor]);

  // index project markers by date string (YYYY-MM-DD)
  const marks = useMemo(() => {
    const map = {};
    const key = d => new Date(d).toISOString().slice(0, 10);
    projects.forEach(p => {
      if (p.startDate) {
        const k = key(p.startDate);
        map[k] = map[k] || [];
        map[k].push({ t: 'Start', n: p.name });
      }
      if (p.deadline) {
        const k = key(p.deadline);
        map[k] = map[k] || [];
        map[k].push({ t: 'Deadline', n: p.name });
      }
    });
    return map;
  }, [projects]);

  const isSameMonth = (a, b) =>
    a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* header */}
          <View style={styles.head}>
            <Pressable
              onPress={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                )
              }
              style={styles.nav}
            >
              <Text style={styles.navTxt}>◀</Text>
            </Pressable>
            <Text style={styles.title}>{monthName(cursor)}</Text>
            <Pressable
              onPress={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
                )
              }
              style={styles.nav}
            >
              <Text style={styles.navTxt}>▶</Text>
            </Pressable>
          </View>

          {/* week labels */}
          <View style={styles.weekRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
              <Text key={w} style={styles.weekTxt}>
                {w}
              </Text>
            ))}
          </View>

          {/* grid */}
          <View style={styles.grid}>
            {days.map((d, i) => {
              const key = d.toISOString().slice(0, 10);
              const items = marks[key] || [];
              const faded = !isSameMonth(d, cursor);
              const isToday = key === todayKey;
              return (
                <View
                  key={key + i}
                  style={[
                    styles.cell,
                    faded && { backgroundColor: '#fafafa' },
                    isToday && styles.todayBorder,
                  ]}
                >
                  <Text style={[styles.dayNum, faded && { color: '#9ca3af' }]}>
                    {d.getDate()}
                  </Text>
                  {items.length > 0 && (
                    <View style={{ gap: 4, marginTop: 4 }}>
                      {items.slice(0, 3).map((m, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.badge,
                            m.t === 'Start'
                              ? styles.startBg
                              : styles.deadlineBg,
                          ]}
                        >
                          <Text numberOfLines={1} style={styles.badgeTxt}>
                            {m.t}: {m.n}
                          </Text>
                        </View>
                      ))}
                      {items.length > 3 && (
                        <Text style={styles.moreTxt}>
                          +{items.length - 3} more
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* legend + close */}
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: '#34d399' }]} />
            <Text style={styles.legTxt}>Start</Text>
            <View
              style={[
                styles.dot,
                { backgroundColor: '#f97316', marginLeft: 12 },
              ]}
            />
            <Text style={styles.legTxt}>Deadline</Text>
          </View>

          <Pressable onPress={onClose} style={styles.primaryBtn}>
            <Text style={styles.primaryTxt}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111827' },
  nav: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  navTxt: { fontWeight: '900', color: '#111827' },

  weekRow: { flexDirection: 'row', marginTop: 10 },
  weekTxt: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '800',
    color: '#6b7280',
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  cell: {
    width: '14.2857%',
    padding: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minHeight: 90,
  },
  dayNum: { fontWeight: '900', color: '#111827' },
  todayBorder: { borderColor: '#3b82f6' },

  badge: { paddingVertical: 2, paddingHorizontal: 4, borderRadius: 6 },
  startBg: { backgroundColor: '#e9fbef' },
  deadlineBg: { backgroundColor: '#fff3e8' },
  badgeTxt: { fontSize: 11, fontWeight: '800', color: '#111827' },
  moreTxt: { fontSize: 11, color: '#6b7280' },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legTxt: { marginLeft: 6, color: '#374151', fontWeight: '800' },

  primaryBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },
});

// import React from 'react';
// import { View, Modal, Text, Pressable, StyleSheet } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import dayjs from 'dayjs';

// const buildMarks = (projects = []) => {
//   const marks = {};
//   projects.forEach(p => {
//     if (!p.startDate) return;
//     const s = dayjs(p.startDate);
//     const e = p.noDeadline ? s : dayjs(p.deadline || p.startDate);
//     const days = e.diff(s, 'day');
//     for (let i = 0; i <= Math.max(days, 0); i++) {
//       const d = s.add(i, 'day').format('YYYY-MM-DD');
//       const isStart = i === 0;
//       const isEnd = i === Math.max(days, 0);
//       marks[d] = {
//         ...(marks[d] || {}),
//         startingDay: isStart,
//         endingDay: isEnd,
//         color: '#3B82F6',
//         textColor: 'white',
//       };
//     }
//   });
//   return marks;
// };

// export default function ProjectsCalendarModal({ visible, onClose, data }) {
//   const markedDates = React.useMemo(() => buildMarks(data), [data]);

//   return (
//     <Modal
//       transparent
//       visible={visible}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.backdrop}>
//         <View style={styles.card}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Project Calendar</Text>
//             <Pressable onPress={onClose} hitSlop={8}>
//               <Ionicons name="close" size={20} />
//             </Pressable>
//           </View>
//           <Calendar
//             markingType="period"
//             markedDates={markedDates}
//             onDayPress={() => {}}
//             theme={{
//               todayTextColor: '#EF4444',
//               textDayFontWeight: '500',
//               textMonthFontWeight: '700',
//             }}
//           />
//           <View style={styles.legend}>
//             <View style={styles.dot} />
//             <Text style={styles.legendTx}>
//               Blue range = project duration (start → deadline)
//             </Text>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   card: {
//     width: '100%',
//     maxWidth: 520,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   title: { fontWeight: '800', fontSize: 16, color: '#111827' },
//   legend: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
//   dot: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: '#3B82F6',
//     marginRight: 8,
//   },
//   legendTx: { color: '#334155' },
// });
