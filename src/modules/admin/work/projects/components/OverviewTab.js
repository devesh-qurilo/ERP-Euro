// src/modules/admin/work/projects/screens/OverviewStyled.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, BarChart } from 'react-native-chart-kit';
import Svg, { Circle } from 'react-native-svg';
import { fetchMetrics } from '../store/actions';
import { selectAWPMetrics, selectAWPBusyIds } from '../store/selectors';
import ProjectTaskListPanel from '../components/ProjectTaskListPanel';

const W = Dimensions.get('window').width;
const CONTENT_PADDING = 12;
const CONTAINER_W = W - CONTENT_PADDING * 2;
const CHART_W = Math.min(CONTAINER_W - 24, 720);

const number = (v, d = 0) => (v == null || Number.isNaN(+v) ? d : +v);

/**
 * OverviewStyled:
 * - dispatch(fetchMetrics(project.id)) on mount
 * - reads metrics from Redux selector selectAWPMetrics(s, projectId)
 * - visually styled per screenshot: rounded cards, semicircle gauge, pie with legend, KPI boxes, bar chart
 */
export default function OverviewStyled({ project }) {
  const dispatch = useDispatch();
  const projectId = project?.id;
  const metrics = useSelector(s => selectAWPMetrics(s, projectId));
  const busyIds = useSelector(selectAWPBusyIds);
  const metricsBusy = projectId
    ? busyIds.includes(`metrics:${projectId}`)
    : false;

  useEffect(() => {
    if (projectId) dispatch(fetchMetrics(projectId));
  }, [dispatch, projectId]);

  if (!projectId) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>No project selected</Text>
      </View>
    );
  }
  if (metricsBusy && !metrics)
    return <ActivityIndicator style={{ marginTop: 20 }} />;

  const m = metrics || project || {};
  const progress = Math.round(number(m.progressPercent, 0));
  const budget = number(m.budget, 0);
  const earning = number(m.earning || m.budget, 0);
  const expenses = number(m.expenses, 0);
  const profit = number(m.profit, earning - expenses);
  const minutes = number(m.totalTimeLoggedMinutes, 0);
  const hoursLogged = Math.round(minutes / 60);
  const hoursEstimate = number(m.hoursEstimate, 0);

  // ---------- TASKS PIE (prefer task-status counts, fallback to financial) ----------
  const STATUS_ORDER = [
    'NOT_STARTED',
    'IN_PROGRESS',
    'ON_HOLD',
    'FINISHED',
    'CANCELLED',
  ];
  const STATUS_META = {
    NOT_STARTED: { label: 'Not Started', color: '#9ca3af' },
    IN_PROGRESS: { label: 'In Progress', color: '#3b82f6' },
    ON_HOLD: { label: 'On Hold', color: '#f59e0b' },
    FINISHED: { label: 'Completed', color: '#2e7d32' },
    CANCELLED: { label: 'Cancelled', color: '#ef4444' },
  };

  // helper: try many shapes in metrics to get task counts
  const getCount = key => {
    // e.g. NOT_STARTED -> tasksNotStarted
    const camel =
      'tasks' +
      key
        .toLowerCase()
        .split('_')
        .map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w))
        .join('');
    if (m[camel] != null) return Number(m[camel]) || 0;

    // e.g. tasksByStatus: { NOT_STARTED: 2, IN_PROGRESS: 3 }
    if (m.tasksByStatus) {
      const tbs = m.tasksByStatus;
      if (tbs[key] != null) return Number(tbs[key]) || 0;
      if (tbs[key.toLowerCase()] != null)
        return Number(tbs[key.toLowerCase()]) || 0;
      if (tbs[key.toUpperCase()] != null)
        return Number(tbs[key.toUpperCase()]) || 0;
    }

    // sometimes metrics might have tasks: [{status, count}, ...]
    if (Array.isArray(m.tasks) && m.tasks.length) {
      const found = m.tasks.find(t => {
        if (!t) return false;
        if (t.status === key) return true;
        if (String(t.status || '').toUpperCase() === key) return true;
        return false;
      });
      if (found) return Number(found.count || found.total || 0) || 0;
    }

    return 0;
  };

  const taskSlices = STATUS_ORDER.map(st => {
    const cnt = getCount(st);
    return {
      status: st,
      count: cnt,
      label: STATUS_META[st].label,
      color: STATUS_META[st].color,
    };
  });
  const totalTasks = taskSlices.reduce((s, x) => s + x.count, 0);

  let pieData;
  if (totalTasks > 0) {
    pieData = taskSlices
      .filter(s => s.count > 0)
      .map(s => ({
        name: s.label,
        value: s.count,
        color: s.color,
        legendFontColor: '#374151',
        legendFontSize: 12,
      }));
  } else {
    // fallback to financial slices
    pieData = [
      {
        name: 'Expenses',
        value: expenses,
        color: '#ef4444',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Profit',
        value: profit,
        color: '#10b981',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Other',
        value: Math.max(0, earning - expenses - profit),
        color: '#3b82f6',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
    ];
  }

  const pieForChartKit = pieData.map(d => ({ ...d, value: Number(d.value) }));

  // Hours bar chart dataset
  const barData = {
    labels: ['Planned', 'Actual'],
    datasets: [{ data: [hoursEstimate || 0, hoursLogged] }],
  };

  const members = Array.isArray(m.assignedEmployees) ? m.assignedEmployees : [];

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Progress card (semicircle + dates) */}
      <ProjectTaskListPanel projectId={projectId} projectMembers={members} />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Project progress</Text>

        <View style={styles.progressRow}>
          <View style={styles.gaugeWrap}>
            {/* semicircle gauge using Svg circle stroke */}
            <Svg width={120} height={60} viewBox="0 0 120 60">
              <Circle
                cx="60"
                cy="60"
                r="48"
                stroke="#e5e7eb"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${Math.PI * 48} ${Math.PI * 48}`}
                transform="rotate(180 60 60)"
              />
              <Circle
                cx="60"
                cy="60"
                r="48"
                stroke="#2e7d32"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${(Math.PI * 48 * progress) / 100} ${
                  Math.PI * 48
                }`}
                transform="rotate(180 60 60)"
              />
            </Svg>

            <Text style={styles.gaugePct}>{progress} %</Text>
          </View>

          <View style={styles.datesCol}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateVal}>
                {m.startDate
                  ? new Date(m.startDate).toLocaleDateString()
                  : '--'}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateVal}>
                {m.deadline ? new Date(m.deadline).toLocaleDateString() : '--'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Client card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Client</Text>
        <View style={styles.clientRow}>
          {m.client?.profilePictureUrl ? (
            <Image
              source={{ uri: m.client.profilePictureUrl }}
              style={styles.clientImg}
            />
          ) : (
            <View style={[styles.clientImg, { backgroundColor: '#e5e7eb' }]} />
          )}
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.clientName}>{m.client?.name ?? '—'}</Text>
            <Text style={styles.clientSub}>
              {m.client?.companyName ?? m.client?.clientId ?? ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Tasks pie card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tasks</Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View>
            <PieChart
              data={pieForChartKit}
              width={Math.min(CHART_W * 0.6, 300)}
              height={180}
              chartConfig={{
                color: () => '#000',
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="0"
              hasLegend={false}
            />
          </View>

          <View style={styles.legendCol}>
            {pieForChartKit.map(slice => (
              <View key={slice.name} style={styles.legendRow}>
                <View
                  style={[
                    styles.legendSwatch,
                    { backgroundColor: slice.color },
                  ]}
                />
                <Text style={styles.legendTxt}>{slice.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* KPI small boxes row (budget, hours, profit, expenses) */}
      <View style={styles.kpiWrap}>
        <View style={styles.smallBox}>
          <Text style={styles.smallIcon}>💰</Text>
          <Text style={styles.smallTitle}>Project Budget</Text>
          <Text style={styles.smallVal}>
            {m.currency ?? ''} {budget ? budget.toLocaleString() : '--'}
          </Text>
        </View>

        <View style={styles.smallBox}>
          <Text style={styles.smallIcon}>⏱️</Text>
          <Text style={styles.smallTitle}>Hours Logged</Text>
          <Text style={styles.smallVal}>
            {hoursLogged ? `${hoursLogged} hrs` : '--'}
          </Text>
        </View>

        <View style={styles.smallBox}>
          <Text style={styles.smallIcon}>📈</Text>
          <Text style={styles.smallTitle}>Profit</Text>
          <Text style={styles.smallVal}>
            {m.currency ?? ''} {profit ? profit.toLocaleString() : '--'}
          </Text>
        </View>
      </View>

      {/* Hours Logged bar chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hours Logged</Text>
        <BarChart
          data={barData}
          width={Math.min(CHART_W, W - 48)}
          height={200}
          showValuesOnTopOfBars
          fromZero
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34,197,94, ${opacity})`,
            labelColor: () => '#374151',
            barPercentage: 0.6,
          }}
          style={{ marginTop: 12 }}
        />
      </View>

      {/* Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Project Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTxt}>{m.summary || '--'}</Text>
        </View>
      </View>

      {/* Members */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Team Members</Text>
        {members.length ? (
          members.map(mem => (
            <View key={mem.employeeId} style={styles.memberRow}>
              <Image
                source={mem.profileUrl ? { uri: mem.profileUrl } : undefined}
                style={styles.avatar}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.memberName}>{mem.name}</Text>
                <Text style={styles.memberSub}>
                  {mem.designation ?? '—'} • {mem.department ?? '—'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.muted}>No members</Text>
        )}
      </View>
      {/* <ProjectTaskListPanel projectId={projectId} /> */}

      {/* bottom spacing */}
      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const CARD_BORDER = {
  borderWidth: 1,
  borderColor: '#e6e7eb',
  backgroundColor: '#fff',
};

const styles = StyleSheet.create({
  wrap: { padding: CONTENT_PADDING, gap: 12 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  err: { color: '#b00020', fontWeight: '700' },

  card: {
    ...CARD_BORDER,
    borderRadius: 10,
    padding: 14,
    // shadow subtle
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gaugeWrap: { width: 140, alignItems: 'center', justifyContent: 'center' },
  gaugePct: {
    marginTop: -10,
    fontSize: 18,
    fontWeight: '800',
    color: '#2e7d32',
  },

  datesCol: { flex: 1, paddingLeft: 8 },
  dateRow: { marginBottom: 8 },
  dateLabel: { color: '#6b7280', fontWeight: '700' },
  dateVal: { color: '#111827', fontWeight: '700', marginTop: 4 },

  clientRow: { flexDirection: 'row', alignItems: 'center' },
  clientImg: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  clientName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  clientSub: { color: '#6b7280', marginTop: 4 },

  // tasks pie
  legendCol: { marginLeft: 12, justifyContent: 'center' },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendSwatch: { width: 22, height: 12, marginRight: 10, borderRadius: 3 },
  legendTxt: { color: '#374151', fontWeight: '700' },

  // small KPI boxes
  kpiWrap: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    justifyContent: 'space-between',
  },
  smallBox: {
    flex: 1,
    ...CARD_BORDER,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  smallIcon: { fontSize: 20 },
  smallTitle: { color: '#6b7280', marginTop: 6, fontWeight: '700' },
  smallVal: { marginTop: 6, fontWeight: '800', fontSize: 16 },

  // members
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  memberName: { fontWeight: '800', color: '#111827' },
  memberSub: { color: '#6b7280' },

  summaryBox: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eef2f6',
    backgroundColor: '#fbfbfb',
    minHeight: 80,
    padding: 12,
    justifyContent: 'center',
  },
  summaryTxt: { color: '#374151' },

  muted: { color: '#9ca3af' },
});
