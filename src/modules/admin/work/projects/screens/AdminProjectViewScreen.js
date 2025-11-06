// src/modules/admin/work/projects/screens/AdminWorkProjectView.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function fmtDate(d) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return String(d);
    return dt.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(d);
  }
}
const num = (v, def = 0) =>
  v == null || Number.isNaN(Number(v)) ? def : Number(v);

export default function AdminWorkProjectView({ route, navigation }) {
  // accept any common param key and fall back safely
  const project = useMemo(
    () =>
      route?.params?.project ??
      route?.params?.item ??
      route?.params?.row ??
      null,
    [route?.params],
  );

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>No project data provided.</Text>
        <Text style={styles.hint}>
          Navigate with: {'{ project: item }'} and ensure the route name
          matches.
        </Text>
      </View>
    );
  }

  const p = project || {};
  const progress = num(p.progressPercent, 0); // ✅ avoid “progressPercent of undefined”
  const start = fmtDate(p.startDate); // ✅ avoid “startDate of undefined”
  const end = fmtDate(p.deadline);

  const members = Array.isArray(p.assignedEmployees) ? p.assignedEmployees : [];
  const clientName = p.client?.name ?? '—';

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Tabs header (static for now) */}
      <View style={styles.tabs}>
        {[
          'Overview',
          'Invoices',
          'Payments',
          'File',
          'Activity',
          'Notes',
          'Discussion',
        ].map(t => (
          <View
            key={t}
            style={[styles.tab, t === 'Overview' && styles.tabActive]}
          >
            <Text
              style={[styles.tabTxt, t === 'Overview' && styles.tabTxtActive]}
            >
              {t}
            </Text>
          </View>
        ))}
      </View>

      {/* Overview */}
      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.h6}>Project progress</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.big}>{progress}%</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.kv}>
                <Text style={styles.k}>Start Date:</Text> {start}
              </Text>
              <Text style={styles.kv}>
                <Text style={styles.k}>End Date:</Text> {end}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.h6}>Client</Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Name:</Text> {clientName}
          </Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Code:</Text> {p.shortCode ?? '—'}
          </Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Category:</Text> {p.category ?? '—'}
          </Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Status:</Text> {p.projectStatus ?? '—'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h6}>Members ({members.length})</Text>
          {members.length === 0 ? (
            <Text style={styles.muted}>— No members —</Text>
          ) : (
            members.map(m => (
              <Text key={m.employeeId} style={styles.kv}>
                {m.name} • {m.designation ?? '—'} • {m.department ?? '—'}
              </Text>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.h6}>Budget & Hours</Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Currency:</Text> {p.currency ?? '—'}
          </Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Budget:</Text> {p.budget ?? '—'}
          </Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Hours Estimate:</Text>{' '}
            {p.hoursEstimate ?? '—'}
          </Text>
          <Text style={styles.kv}>
            <Text style={styles.k}>Manual Time:</Text>{' '}
            {p.allowManualTimeLogs ? 'Allowed' : 'Not allowed'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h6}>Summary</Text>
          <Text style={styles.body}>{p.summary || '—'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  tabActive: { backgroundColor: '#111827' },
  tabTxt: { color: '#111827' },
  tabTxtActive: { color: '#fff', fontWeight: '700' },

  grid: { gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  h6: { fontSize: 16, fontWeight: '800', marginBottom: 8, color: '#111827' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  big: { fontSize: 28, fontWeight: '900', color: '#111827' },
  kv: { color: '#111827', marginBottom: 4 },
  k: { color: '#6b7280' },
  body: { color: '#111827' },
  muted: { color: '#9ca3af' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  err: { color: '#b00020', fontWeight: '700', marginBottom: 6 },
  hint: { color: '#6b7280', textAlign: 'center' },
});
