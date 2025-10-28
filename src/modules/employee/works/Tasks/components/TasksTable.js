// src/modules/employee/works/tasks/components/TasksTable.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function TasksTable({ data = [], onPin, onView }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.hscroll}
    >
      <View style={styles.table}>
        {/* header */}
        <View style={[styles.tr, styles.trHead]}>
          <Th w={240} text="Title" />
          <Th w={160} text="Project" />
          <Th w={140} text="Start" />
          <Th w={140} text="Due" />
          <Th w={140} text="Stage" />
          <Th w={120} text="Priority" />
          <Th w={180} text="Actions" />
        </View>

        {/* rows */}
        {data.map((t, idx) => (
          <View key={t.id || idx} style={styles.tr}>
            <Td w={240}>
              <Text style={styles.bold} numberOfLines={1}>
                {t.title || '—'}
              </Text>
              {!!t.description && (
                <Text style={styles.dim} numberOfLines={1}>
                  {t.description}
                </Text>
              )}
            </Td>

            <Td w={160}>
              <Text numberOfLines={1}>{String(t.projectId ?? '—')}</Text>
            </Td>

            <Td w={140}>
              <Text>{fmtDate(t.startDate)}</Text>
            </Td>

            <Td w={140}>
              <Text>{t.noDueDate ? 'No due' : fmtDate(t.dueDate)}</Text>
            </Td>

            <Td w={140}>
              <Badge
                label={t.taskStage?.name || '—'}
                color={t.taskStage?.labelColor || '#9ca3af'}
              />
            </Td>

            <Td w={120}>
              <Badge
                label={(t.priority || '—').toString().toUpperCase()}
                color={priorityColor(t.priority)}
              />
            </Td>

            {/* ACTIONS — always same line */}
            <Td w={180} noPadding>
              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => onPin?.(t)}
                  style={[
                    styles.btn,
                    t.pinned ? styles.btnDark : styles.btnLight,
                  ]}
                  hitSlop={8}
                >
                  <Text style={[styles.btnTxt, t.pinned && styles.btnTxtDark]}>
                    {t.pinned ? 'Unpin' : 'Pin'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => onView?.(t)}
                  style={[styles.btn, styles.btnOutline]}
                  hitSlop={8}
                >
                  <Text style={[styles.btnTxt, styles.btnTxtOutline]}>
                    View
                  </Text>
                </Pressable>
              </View>
            </Td>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* helpers */
const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const priorityColor = p => {
  switch ((p || '').toUpperCase()) {
    case 'HIGH':
      return '#b91c1c';
    case 'MEDIUM':
      return '#b45309';
    case 'LOW':
      return '#047857';
    default:
      return '#6b7280';
  }
};

/* small atoms */
function Th({ w, text }) {
  return (
    <View style={[styles.th, { width: w }]}>
      <Text style={styles.thTxt} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}
function Td({ w, children, noPadding }) {
  return (
    <View
      style={[
        styles.td,
        { width: w },
        noPadding && { paddingVertical: 0, paddingHorizontal: 0 },
      ]}
    >
      {children}
    </View>
  );
}
function Badge({ label, color }) {
  return (
    <View
      style={[
        styles.badge,
        { borderColor: color + '33', backgroundColor: color + '18' },
      ]}
    >
      <Text style={[styles.badgeTxt, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/* styles */
const styles = StyleSheet.create({
  hscroll: { marginTop: 8 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center', // ✅ keeps action buttons aligned horizontally
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  trHead: {
    backgroundColor: '#e8f0ff',
    borderTopWidth: 0,
  },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  thTxt: { fontWeight: '900', color: '#374151' },
  td: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
    minHeight: 56,
    justifyContent: 'center',
  },
  bold: { fontWeight: '900', color: '#111827' },
  dim: { color: '#6b7280', marginTop: 2 },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeTxt: { fontWeight: '900', fontSize: 12 },

  /* ACTION buttons row — forces single line */
  actionRow: {
    flexDirection: 'row', // ✅ horizontal
    alignItems: 'center',
    gap: 8, // RN 0.71+ supports gap; if not, replace with marginRight
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLight: {
    backgroundColor: '#f3f4f6',
  },
  btnDark: {
    backgroundColor: '#111827',
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  btnTxt: { fontWeight: '900', color: '#111827' },
  btnTxtDark: { color: '#fff' },
  btnTxtOutline: { color: '#111827' },
});
