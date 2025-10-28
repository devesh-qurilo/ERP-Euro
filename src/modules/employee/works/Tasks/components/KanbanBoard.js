// src/modules/employee/works/tasks/components/KanbanBoard.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');

// priority → colors
const PRIORITY = {
  HIGH: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', date: '#b91c1c' },
  MEDIUM: {
    bg: '#fff7ed',
    border: '#f59e0b',
    text: '#7c2d12',
    date: '#b45309',
  },
  LOW: { bg: '#ecfdf5', border: '#10b981', text: '#064e3b', date: '#047857' },
  DEFAULT: {
    bg: '#f8fafc',
    border: '#94a3b8',
    text: '#0f172a',
    date: '#334155',
  },
};
const getPriorityStyle = p => PRIORITY[p?.toUpperCase?.()] || PRIORITY.DEFAULT;

export default function KanbanBoard({ statuses = [], tasks = [] }) {
  // group tasks by taskStageId
  const byStage = useMemo(() => {
    const map = new Map();
    statuses.forEach(s => map.set(s.id, []));
    tasks.forEach(t => {
      const key = t.taskStageId ?? t.taskStage?.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    map.forEach(list =>
      list.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0)),
    );
    return map;
  }, [statuses, tasks]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {statuses.map(status => {
        const list = byStage.get(status.id) || [];
        return (
          <View key={status.id} style={styles.column}>
            {/* header */}
            <View style={styles.colHeader}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: status.labelColor || '#e5e7eb' },
                ]}
              />
              <Text style={styles.colTitle}>{status.name}</Text>
              <View style={styles.countPill}>
                <Text style={styles.countTxt}>{list.length}</Text>
              </View>
            </View>

            {/* cards (vertical) */}
            <ScrollView style={{ flex: 1 }}>
              {list.map(t => {
                const s = getPriorityStyle(t.priority);
                return (
                  <View
                    key={t.id}
                    style={[
                      styles.card,
                      {
                        backgroundColor: s.bg,
                        borderColor: s.border,
                        shadowColor: s.border,
                      },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <Text
                        style={[styles.cardTitle, { color: s.text }]}
                        numberOfLines={1}
                      >
                        {t.title || '—'}
                      </Text>
                      <Text style={[styles.codeTxt, { color: s.text }]}>
                        #{String(t.projectId).padStart(3, '0')}
                      </Text>
                    </View>

                    <View style={styles.rowLine}>
                      <Text style={[styles.iconLike, { color: s.text }]}>
                        📚
                      </Text>
                      <Text
                        style={[styles.subTxt, { color: s.text }]}
                        numberOfLines={1}
                      >
                        {t.projectName || 'Project Name'}
                      </Text>
                    </View>

                    <View style={[styles.rowLine, { marginTop: 8 }]}>
                      {t.assignedEmployees?.[0]?.profileUrl ? (
                        <Image
                          source={{ uri: t.assignedEmployees[0].profileUrl }}
                          style={styles.avatar}
                        />
                      ) : (
                        <View style={[styles.avatar, styles.avatarEmpty]}>
                          <Text>👤</Text>
                        </View>
                      )}
                      <Text style={[styles.iconLike, { color: s.text }]}>
                        📅
                      </Text>
                      <Text
                        style={[
                          styles.dateTxt,
                          { color: s.date, fontWeight: '900' },
                        ]}
                      >
                        {fmtDate(t.dueDate)}
                      </Text>
                    </View>
                  </View>
                );
              })}
              {!list.length && <Text style={styles.emptyTxt}>No tasks</Text>}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 10, paddingBottom: 12, gap: 12 },
  column: {
    width: 300,
    height: 520,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  colHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  colTitle: { fontSize: 20, fontWeight: '900', color: '#333' },
  countPill: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  countTxt: { fontWeight: '900', color: '#475569' },

  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    marginVertical: 8,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '900', maxWidth: 190 },
  codeTxt: { fontWeight: '900' },

  rowLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  iconLike: { fontSize: 16 },
  subTxt: { fontSize: 14 },
  dateTxt: {},

  avatar: { width: 26, height: 26, borderRadius: 13 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTxt: { textAlign: 'center', color: '#94a3b8', marginTop: 8 },
});
