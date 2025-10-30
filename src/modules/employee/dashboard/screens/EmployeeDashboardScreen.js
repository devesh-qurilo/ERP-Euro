// src/modules/employee/dashboard/screens/EmployeeDashboardScreen.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Existing cards you already have
import EmployeeProfileCard from '../../profile/components/EmployeeInfoCard';
import LeaveQuotaTable from '../components/LeaveQuotaTable';
import AppreciationsTable from '../components/AppreciationsTable';

// Redux selectors/actions you already created
import { selectProjects } from '../../works/projects/store/selectors';
import { fetchProjects } from '../../works/projects/store/actions';

import {
  selectTasks,
  selectTasksLoading,
  selectTasksError,
} from '../../works/tasks/store/selectors';
import { fetchMyTasks } from '../../works/tasks/store/actions';

import {
  selectMyTimesheets,
  selectMyTimesheetsLoad,
  selectMyTimesheetsError,
} from '../../works/timesheets/store/selectors';
import { fetchMyTimesheets } from '../../works/timesheets/store/actions';

const StatTile = ({ label, value, tone = 'default', onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.tile, toneStyle(tone)]}>
      <Text style={styles.tileVal}>{value}</Text>
      <Text style={styles.tileLbl}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const toneStyle = t => {
  switch (t) {
    case 'blue':
      return { backgroundColor: '#e0f2fe', borderColor: '#bae6fd' };
    case 'amber':
      return { backgroundColor: '#fef9c3', borderColor: '#fde68a' };
    case 'green':
      return { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' };
    case 'rose':
      return { backgroundColor: '#ffe4e6', borderColor: '#fecdd3' };
    default:
      return { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' };
  }
};

const Section = ({ title, right, children, style }) => (
  <View style={[styles.sectionCard, style]}>
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {right}
    </View>
    {children}
  </View>
);

const ItemRow = ({ title, subtitle, right, avatar }) => (
  <View style={styles.row}>
    {avatar ? (
      <Image source={{ uri: avatar }} style={styles.rowAvatar} />
    ) : (
      <View style={[styles.rowAvatar, styles.rowAvatarEmpty]}>
        <Text>👤</Text>
      </View>
    )}
    <View style={{ flex: 1 }}>
      <Text style={styles.rowTitle} numberOfLines={1}>
        {title}
      </Text>
      {!!subtitle && (
        <Text style={styles.rowSub} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
    {!!right && <Text style={styles.rowRight}>{right}</Text>}
  </View>
);

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = t => (t ? t.slice(0, 5) : '—');

const EmployeeDashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux data
  const projects = useSelector(selectProjects);
  const tasks = useSelector(selectTasks);
  const tasksLoading = useSelector(selectTasksLoading);
  const tasksErr = useSelector(selectTasksError);

  const timesheets = useSelector(selectMyTimesheets);
  const tsLoading = useSelector(selectMyTimesheetsLoad);
  const tsErr = useSelector(selectMyTimesheetsError);

  // Initial load
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchMyTasks());
    dispatch(fetchMyTimesheets());
  }, [dispatch]);

  // Pull to refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(fetchProjects());
      dispatch(fetchMyTasks());
      dispatch(fetchMyTimesheets());
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Derived stats
  const pinnedTasks = useMemo(() => tasks.filter(t => !!t.pinned), [tasks]);
  const todayHours = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return timesheets
      .filter(s => s.startDate === today || s.endDate === today)
      .reduce((acc, s) => acc + (Number(s.durationHours) || 0), 0);
  }, [timesheets]);

  // Recent slices
  const recentProjects = useMemo(() => projects.slice(0, 5), [projects]);
  const recentTasks = useMemo(() => tasks.slice(0, 6), [tasks]);
  const recentLogs = useMemo(() => timesheets.slice(0, 6), [timesheets]);

  // Quick nav helpers (adjust route names if different in your navigator)
  const goTo = {
    profile: () => navigation.navigate('Profile'),
    leads: () => navigation.navigate('Leads'),
    tasks: () => navigation.navigate('WorkTasks'),
    hr: () => navigation.navigate('HRLeaves'),
    projects: () => navigation.navigate('WorkProjects'),
    timesheets: () => navigation.navigate('WorkTimesheet'),
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile + Leave + Appreciations (your existing reusable components) */}
      <EmployeeProfileCard />
      <LeaveQuotaTable />
      <View style={{ height: 16 }} />
      <AppreciationsTable />

      {/* Top Stats */}
      <View style={{ height: 16 }} />
      <View style={styles.tilesRow}>
        <StatTile
          label="My Projects"
          value={projects.length}
          tone="blue"
          onPress={goTo.projects}
        />
        <StatTile
          label="My Tasks"
          value={tasks.length}
          tone="amber"
          onPress={goTo.tasks}
        />
        <StatTile
          label="Pinned Tasks"
          value={pinnedTasks.length}
          tone="rose"
          onPress={goTo.tasks}
        />
        <StatTile
          label="Today Hours"
          value={`${todayHours}h`}
          tone="green"
          onPress={goTo.timesheets}
        />
      </View>

      {/* Recent Projects */}
      <Section
        title="Recent Projects"
        right={
          <TouchableOpacity onPress={goTo.projects} style={styles.moreBtn}>
            <Text style={styles.moreTxt}>View All →</Text>
          </TouchableOpacity>
        }
      >
        {recentProjects.map(p => (
          <ItemRow
            key={p.id}
            title={p.name}
            subtitle={`Client: ${p.client?.name || '—'} • ${
              p.noDeadline ? 'No deadline' : `Due: ${fmtDate(p.deadline)}`
            }`}
            right={
              p.progressPercent != null ? `${p.progressPercent}%` : undefined
            }
            avatar={p.client?.profilePictureUrl}
          />
        ))}
        {!projects.length && (
          <Text style={styles.dim}>No projects assigned yet.</Text>
        )}
      </Section>

      {/* My Tasks */}
      <Section
        title="My Tasks"
        right={
          tasksLoading ? (
            <Text style={styles.dim}>Loading…</Text>
          ) : (
            <TouchableOpacity onPress={goTo.tasks} style={styles.moreBtn}>
              <Text style={styles.moreTxt}>View All →</Text>
            </TouchableOpacity>
          )
        }
      >
        {recentTasks.map(t => (
          <ItemRow
            key={t.id}
            title={t.title}
            subtitle={`${t.taskStage?.name || '—'} • ${
              t.priority || '—'
            } • Due ${fmtDate(t.dueDate)}`}
            right={t.pinned ? '📌' : undefined}
            avatar={t.assignedEmployees?.[0]?.profileUrl}
          />
        ))}
        {!!tasksErr && (
          <Text style={styles.err}>Error: {String(tasksErr)}</Text>
        )}
        {!tasks.length && !tasksLoading && (
          <Text style={styles.dim}>No tasks yet.</Text>
        )}
      </Section>

      {/* Recent Time Logs */}
      <Section
        title="Recent Time Logs"
        right={
          tsLoading ? (
            <Text style={styles.dim}>Loading…</Text>
          ) : (
            <TouchableOpacity onPress={goTo.timesheets} style={styles.moreBtn}>
              <Text style={styles.moreTxt}>View All →</Text>
            </TouchableOpacity>
          )
        }
      >
        {recentLogs.map(s => (
          <ItemRow
            key={s.id}
            title={`${fmtDate(s.startDate)} ${fmtTime(s.startTime)} → ${fmtDate(
              s.endDate,
            )} ${fmtTime(s.endTime)}`}
            subtitle={s.memo || '—'}
            right={`${s.durationHours ?? 0}h`}
            avatar={s.employees?.[0]?.profileUrl}
          />
        ))}
        {!!tsErr && <Text style={styles.err}>Error: {String(tsErr)}</Text>}
        {!timesheets.length && !tsLoading && (
          <Text style={styles.dim}>No timelogs yet.</Text>
        )}
      </Section>

      {/* Quick Actions (kept from your original) */}
      <View style={[styles.sectionCard, { marginBottom: 24 }]}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton} onPress={goTo.profile}>
          <Text style={styles.actionText}>View My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={goTo.leads}>
          <Text style={styles.actionText}>Check Leads</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={goTo.tasks}>
          <Text style={styles.actionText}>View Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={goTo.hr}>
          <Text style={styles.actionText}>HR Portal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },

  // Tiles
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  tile: {
    flexGrow: 1,
    minWidth: 150,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  tileVal: { fontSize: 22, fontWeight: '900', color: '#0b0b0c' },
  tileLbl: { marginTop: 4, color: '#334155', fontWeight: '700' },

  // Sections
  sectionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  moreBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  moreTxt: { color: '#111827', fontWeight: '800' },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f1f5f9',
  },
  rowAvatar: { width: 36, height: 36, borderRadius: 18 },
  rowAvatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontWeight: '900', color: '#111827' },
  rowSub: { color: '#64748b', marginTop: 2, fontSize: 12 },
  rowRight: { color: '#111827', fontWeight: '900' },

  // Misc
  dim: { color: '#6b7280', paddingTop: 6 },
  err: { color: '#b00020', paddingTop: 6, fontWeight: '700' },

  // Quick Actions (kept from your original)
  actionButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

export default EmployeeDashboardScreen;
