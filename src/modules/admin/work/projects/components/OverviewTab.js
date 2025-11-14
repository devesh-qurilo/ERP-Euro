// src/modules/admin/work/projects/screens/OverviewTabConnected.js
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
import { BarChart, PieChart } from 'react-native-chart-kit';
import {
  fetchMetrics, // from your store/actions
} from '../store/actions';
import { selectAWPMetrics, selectAWPBusyIds } from '../store/selectors';

const screenW = Dimensions.get('window').width;
const chartW = Math.min(screenW - 48, 720);

const num = (v, def = 0) => (v == null || Number.isNaN(+v) ? def : +v);

/**
 * OverviewTabConnected
 * Props:
 *   - project: { id, name, ... }  (passed by AdminWorkProjectViewScreen)
 *
 * Behavior:
 *   - dispatch(fetchMetrics(project.id)) on mount / project change
 *   - read metrics via selector selectAWPMetrics(state, project.id)
 *   - shows loading state using busyIds entry "metrics:{projectId}"
 */
export default function OverviewTabConnected({ project }) {
  const dispatch = useDispatch();
  const projectId = project?.id;

  // metrics from redux (null if not fetched)
  const metrics = useSelector(s => selectAWPMetrics(s, projectId));
  // busy ids
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

  if (metricsBusy && !metrics) {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }

  // fallback to passed project fields if metrics not present
  const m = metrics || project || {};
  const budget = num(m.budget, 0);
  const expenses = num(m.expenses, 0);
  const profit = num(m.profit, (m.earning || 0) - (m.expenses || 0));
  const earning = num(m.earning, budget);
  const progress = Math.round(num(m.progressPercent, 0));
  const timeLoggedMinutes = num(m.totalTimeLoggedMinutes, 0);
  const hoursLogged = Math.round(timeLoggedMinutes / 60);
  const hoursEstimate = num(m.hoursEstimate, 0);
  const members = Array.isArray(m.assignedEmployees) ? m.assignedEmployees : [];

  // pie data (budget breakdown)
  const pieData = [
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

  const barData = {
    labels: ['Logged', 'Estimate'],
    datasets: [{ data: [hoursLogged, hoursEstimate] }],
  };

  // small KPI card
  const KPI = ({ label, value, sub }) => (
    <View style={styles.kpi}>
      <Text style={styles.kpiVal}>{value}</Text>
      <Text style={styles.kpiLbl}>{label}</Text>
      {sub ? <Text style={styles.kpiSub}>{sub}</Text> : null}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Top KPIs */}
      <View style={styles.kpiRow}>
        <KPI
          label="Progress"
          value={`${progress}%`}
          sub={`Status: ${m.projectStatus ?? '—'}`}
        />
        <KPI
          label="Hours"
          value={`${hoursLogged}h`}
          sub={`Estimate: ${hoursEstimate}h`}
        />
        <KPI
          label="Budget"
          value={`${m.currency ?? ''} ${budget}`}
          sub={`Expenses: ${m.currency ?? ''} ${expenses}`}
        />
        <KPI label="Profit" value={`${m.currency ?? ''} ${profit}`} />
      </View>

      {/* Charts row */}
      <View style={styles.chartsRow}>
        {/* Left: Progress big + bar */}
        <View style={styles.cardLarge}>
          <Text style={styles.h6}>Progress</Text>
          <View style={styles.progressBigWrap}>
            <View style={styles.progressBigText}>
              <Text style={styles.progressBigPct}>{progress}%</Text>
              <Text style={styles.progressBigLbl}>
                {m.projectStatus ?? '—'}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progress, 100)}%` },
                ]}
              />
            </View>

            <Text style={styles.metaSmall}>
              {m.startDate ? new Date(m.startDate).toLocaleDateString() : '—'} →{' '}
              {m.deadline ? new Date(m.deadline).toLocaleDateString() : '—'}
            </Text>
          </View>
        </View>

        {/* Right: Pie chart */}
        <View style={styles.cardLarge}>
          <Text style={styles.h6}>Budget breakdown</Text>

          {pieData.reduce((s, it) => s + it.value, 0) > 0 ? (
            <PieChart
              data={pieData.map(d => ({ ...d, value: Number(d.value) }))}
              width={chartW * 0.48}
              height={160}
              chartConfig={{
                color: () => '#000',
                labelColor: () => '#374151',
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View style={{ paddingVertical: 20 }}>
              <Text style={styles.muted}>No financial data available</Text>
            </View>
          )}

          <View style={{ marginTop: 8 }}>
            <Text style={styles.kv}>
              <Text style={styles.k}>Earning:</Text> {m.currency} {earning}
            </Text>
            <Text style={styles.kv}>
              <Text style={styles.k}>Expenses:</Text> {m.currency} {expenses}
            </Text>
            <Text style={styles.kv}>
              <Text style={styles.k}>Profit:</Text> {m.currency} {profit}
            </Text>
          </View>
        </View>
      </View>

      {/* Hours bar chart */}
      <View style={styles.card}>
        <Text style={styles.h6}>Time logged</Text>
        <Text style={styles.metaSmall}>Total: {hoursLogged} hours</Text>

        <BarChart
          data={barData}
          width={chartW - 24}
          height={160}
          yAxisSuffix="h"
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59,130,246, ${opacity})`,
            labelColor: () => '#374151',
            propsForBackgroundLines: { strokeDasharray: '' },
          }}
          style={{ marginTop: 8 }}
          withInnerLines={false}
          fromZero
        />
      </View>

      {/* small summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.cardSmall}>
          <Text style={styles.h6}>Tasks</Text>
          <Text style={styles.big}>
            {m.tasksTotal != null ? m.tasksTotal : '—'}
          </Text>
          <Text style={styles.muted}>
            {m.tasksCompleted != null
              ? `${m.tasksCompleted} completed`
              : 'Tasks data not available'}
          </Text>
        </View>

        <View style={styles.cardSmall}>
          <Text style={styles.h6}>Client</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {m.client?.profilePictureUrl ? (
              <Image
                source={{ uri: m.client.profilePictureUrl }}
                style={styles.clientPic}
              />
            ) : (
              <View
                style={[styles.clientPic, { backgroundColor: '#e5e7eb' }]}
              />
            )}
            <View>
              <Text style={styles.kvBold}>{m.client?.name ?? '—'}</Text>
              <Text style={styles.muted}>
                {m.client?.clientId ?? m.clientId ?? '—'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardSmall}>
          <Text style={styles.h6}>Team</Text>
          <Text style={styles.big}>{members.length}</Text>
          <Text style={styles.muted}>Active members</Text>
        </View>
      </View>

      {/* Members list */}
      <View style={styles.card}>
        <Text style={styles.h6}>Members</Text>
        {members.length ? (
          members.map(mb => (
            <View key={mb.employeeId} style={styles.memberRow}>
              <Image
                source={mb.profileUrl ? { uri: mb.profileUrl } : undefined}
                style={styles.avatar}
              />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.kvBold}>{mb.name}</Text>
                <Text style={styles.muted}>
                  {mb.designation ?? '—'} • {mb.department ?? '—'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.muted}>No members</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  err: { color: '#b00020', fontWeight: '700' },

  /* top KPIs */
  kpiRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  kpi: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    alignItems: 'flex-start',
  },
  kpiVal: { fontSize: 18, fontWeight: '900', color: '#111827' },
  kpiLbl: { color: '#6b7280', fontWeight: '700', marginTop: 6 },
  kpiSub: { color: '#9ca3af', marginTop: 6 },

  /* charts row */
  chartsRow: { flexDirection: 'row', gap: 12 },
  cardLarge: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },

  h6: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8 },

  progressBigWrap: { alignItems: 'center' },
  progressBigText: { alignItems: 'center', marginVertical: 8 },
  progressBigPct: { fontSize: 40, fontWeight: '900', color: '#1d4ed8' },
  progressBigLbl: { color: '#6b7280', marginTop: 6 },

  progressTrack: {
    height: 12,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    overflow: 'hidden',
    width: '100%',
    marginTop: 8,
  },
  progressFill: { height: 12, backgroundColor: '#3b82f6' },

  metaSmall: { color: '#6b7280', marginTop: 8 },

  /* summary row */
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardSmall: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    alignItems: 'flex-start',
  },
  big: { fontSize: 28, fontWeight: '900', color: '#111827' },
  kv: { color: '#111827', marginTop: 6 },
  k: { color: '#6b7280' },
  kvBold: { fontWeight: '800', color: '#111827' },

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
  },
  clientPic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
  },

  muted: { color: '#9ca3af' },
});
