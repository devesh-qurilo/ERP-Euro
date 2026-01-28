// src/modules/admin/work/projects/screens/AdminWorkProjectView.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ProjectTasksPanel from '../components/ProjectTasksPanel';
import ProjectInvoicesTab from '../view/invoices/ProjectInvoicesTab';
import ProjectPaymentsTab from '../view/payments/ProjectPaymentsTab';
import ProjectFilesTab from '../view/files/ProjectFilesTab';
import ProjectActivityTab from '../view/activity/ProjectActivityTab';
import ProjectNotesTab from '../view/notes/ProjectNotesTab';
import OverviewTabConnected from '../components/OverviewTab';

/* --------------------------- helpers / formatters --------------------------- */
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt)
    ? String(d)
    : dt.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
}
const num = (v, def = 0) => (v == null || Number.isNaN(+v) ? def : +v);

/* --------------------------------- Overview -------------------------------- */
function OverviewTabk({ project }) {
  const p = project || {};
  // console.log('tassssss', p);
  const progress = num(p.progressPercent, 0);
  const members = Array.isArray(p.assignedEmployees) ? p.assignedEmployees : [];

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <View style={s.card}>
        <Text style={s.h6}>Project progress</Text>
        <View style={s.progressTrack}>
          <View
            style={[s.progressFill, { width: `${Math.min(progress, 100)}%` }]}
          />
        </View>
        <View style={s.rowBetween}>
          <Text style={s.progressTxt}>{progress}%</Text>
          <Text style={s.meta}>
            {fmtDate(p.startDate)} → {fmtDate(p.deadline)}
          </Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.h6}>Client</Text>
        <Text style={s.kv}>
          <Text style={s.k}>Name:</Text> {p.client?.name ?? '—'}
        </Text>
        <Text style={s.kv}>
          <Text style={s.k}>Code:</Text> {p.shortCode ?? '—'}
        </Text>
        <Text style={s.kv}>
          <Text style={s.k}>Category:</Text> {p.category ?? '—'}
        </Text>
        <Text style={s.kv}>
          <Text style={s.k}>Status:</Text> {p.projectStatus ?? '—'}
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.h6}>Members ({members.length})</Text>
        {members.length ? (
          members.map(m => (
            <Text key={m.employeeId} style={s.kv}>
              {m.name} • {m.designation ?? '—'} • {m.department ?? '—'}
            </Text>
          ))
        ) : (
          <Text style={s.muted}>— No members —</Text>
        )}
      </View>

      <View style={s.card}>
        <Text style={s.h6}>Budget & Hours</Text>
        <Text style={s.kv}>
          <Text style={s.k}>Currency:</Text> {p.currency ?? '—'}
        </Text>
        <Text style={s.kv}>
          <Text style={s.k}>Budget:</Text> {p.budget ?? '—'}
        </Text>
        <Text style={s.kv}>
          <Text style={s.k}>Hours Estimate:</Text> {p.hoursEstimate ?? '—'}
        </Text>
        <Text style={s.kv}>
          <Text style={s.k}>Manual Time:</Text>{' '}
          {p.allowManualTimeLogs ? 'Allowed' : 'Not allowed'}
        </Text>
      </View>

      <View style={s.card}>
        <Text style={s.h6}>Project Summary</Text>
        <Text style={s.body}>{p.summary || '—'}</Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <ProjectTasksPanel projectId={p.id} />
      </View>
    </ScrollView>
  );
}

/* ----------------------------- simple placeholders ----------------------------- */
const Placeholder = ({ label }) => (
  <View style={s.placeholder}>
    <Text style={s.placeholderTxt}>{label} (coming soon)</Text>
  </View>
);

/* ---------------------------------- Screen ---------------------------------- */
export default function AdminWorkProjectViewScreen({ route }) {
  // accept { project } or fallbacks like { item } or { row }
  const project = useMemo(
    () =>
      route?.params?.project ??
      route?.params?.item ??
      route?.params?.row ??
      null,
    [route?.params],
  );

  const [index, setIndex] = React.useState(0);
  const layoutW = Dimensions.get('window').width;

  const [routes] = React.useState([
    { key: 'overview', title: 'Overview' },
    { key: 'invoices', title: 'Invoices' },
    { key: 'payments', title: 'Payments' },
    { key: 'files', title: 'File' },
    { key: 'activity', title: 'Activity' },
    { key: 'notes', title: 'Notes' },
    // { key: 'discussion', title: 'Discussion' },
  ]);

  const renderScene = SceneMap({
    overview: () => <OverviewTabConnected project={project} />,
    invoices: () => (
      <ProjectInvoicesTab
        route={{ params: { projectId: project.id, project } }}
      />
    ),
    payments: () => <ProjectPaymentsTab />,
    files: () => <ProjectFilesTab />,
    activity: () => (
      <ProjectActivityTab
        route={{ params: { project: route.params.project } }}
      />
    ),
    notes: () => <ProjectNotesTab />,
    // discussion: () => <Placeholder label="Discussion" />,
  });

  if (!project) {
    return (
      <View style={s.center}>
        <Text style={s.err}>No project data provided.</Text>
        <Text style={s.hint}>Navigate with: {'{ project: item }'}</Text>
      </View>
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layoutW }}
      renderTabBar={props => (
        <TabBar
          {...props}
          scrollEnabled
          style={{ backgroundColor: '#eef2ff' }}
          indicatorStyle={{ backgroundColor: '#1d4ed8', height: 3 }}
          activeColor="#111827"
          inactiveColor="#6b7280"
          labelStyle={{ textTransform: 'none', fontWeight: '700' }}
        />
      )}
    />
  );
}

/* ----------------------------------- styles ---------------------------------- */
const s = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  h6: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8 },
  progressTrack: {
    height: 12,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    overflow: 'hidden',
  },
  progressFill: { height: 12, backgroundColor: '#3b82f6' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressTxt: { fontWeight: '800', color: '#111827' },
  meta: { color: '#6b7280' },
  kv: { color: '#111827', marginBottom: 4 },
  k: { color: '#6b7280' },
  body: { color: '#111827' },
  muted: { color: '#9ca3af' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderTxt: { color: '#6b7280', fontWeight: '700' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  err: { color: '#b00020', fontWeight: '700', marginBottom: 6 },
  hint: { color: '#6b7280' },
});
