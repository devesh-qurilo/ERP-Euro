// src/modules/employee/works/tasks/components/TasksTable.js
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';

const Cell = ({ w, children }) => (
  <View style={[styles.cell, { width: w }]}>{children}</View>
);
const Head = ({ cols }) => (
  <View style={styles.thead}>
    {cols.map((c, i) => (
      <Cell key={i} w={c.w}>
        <Text style={styles.th}>{c.label}</Text>
      </Cell>
    ))}
  </View>
);
const Row = ({ cols }) => (
  <View style={styles.row}>
    {cols.map((c, i) => (
      <Cell key={i} w={c.w}>
        <Text style={styles.td} numberOfLines={2}>
          {c.text}
        </Text>
      </Cell>
    ))}
  </View>
);

const fmt = d => (d ? new Date(d).toLocaleDateString() : '—');

export default function TasksTable({ data = [], onPin, onView }) {
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = [...data].sort((a, b) => {
    const A = a[sortKey] || '';
    const B = b[sortKey] || '';
    if (A < B) return sortDir === 'asc' ? -1 : 1;
    if (A > B) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = k => {
    if (k === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(k);
      setSortDir('asc');
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
    >
      <View>
        <Head
          cols={[
            { label: 'Title', w: 220 },
            { label: 'Project', w: 160 },
            { label: 'Stage', w: 140 },
            { label: 'Priority', w: 110 },
            { label: 'Start', w: 120 },
            { label: 'Due', w: 120 },
            { label: 'Pinned', w: 90 },
            { label: 'Actions', w: 160 },
          ]}
        />
        {sorted.map(t => (
          <Row
            key={t.id}
            cols={[
              { w: 220, text: t.title || '—' },
              { w: 160, text: String(t.projectId || '—') },
              { w: 140, text: t.taskStage?.name || '—' },
              { w: 110, text: t.priority || '—' },
              { w: 120, text: fmt(t.startDate) },
              { w: 120, text: t.noDueDate ? 'No due' : fmt(t.dueDate) },
              { w: 90, text: t.pinned ? 'Yes' : 'No' },
              {
                w: 160,
                text: '',
                render: true,
              },
            ]}
          />
        ))}
        {/* overlay actions row to keep layout simple */}
        {sorted.map(t => (
          <View
            key={`btns-${t.id}`}
            style={[styles.row, { position: 'relative', top: -48 }]}
          >
            <View style={{ width: 220 }} />
            <View style={{ width: 160 }} />
            <View style={{ width: 140 }} />
            <View style={{ width: 110 }} />
            <View style={{ width: 120 }} />
            <View style={{ width: 120 }} />
            <View style={{ width: 90 }} />
            <View
              style={[
                styles.cell,
                { width: 160, flexDirection: 'row', gap: 8 },
              ]}
            >
              <Pressable style={styles.btn} onPress={() => onPin?.(t)}>
                <Text style={styles.btnTxt}>{t.pinned ? 'Unpin' : 'Pin'}</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnDark]}
                onPress={() => onView?.(t)}
              >
                <Text style={[styles.btnTxt, { color: '#fff' }]}>View</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  thead: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  th: { fontWeight: '900', color: '#374151' },
  td: { color: '#111827' },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  btnDark: { backgroundColor: '#111827', borderColor: '#111827' },
  btnTxt: { fontWeight: '900', color: '#111827' },
});
