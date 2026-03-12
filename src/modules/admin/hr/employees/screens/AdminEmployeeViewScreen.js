// AdminEmployeeViewScreen.js
import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AdminEmployeeProjectsScreen from '../../employees/work/projects/screens/AdminEmployeeProjectsScreen';
import EmployeeAttendanceCalendar from '../components/EmployeeAttendanceCalendar';
import EmployeeLeaveQuota from '../components/EmployeeLeaveQuota';
import EmployeeLeavesSection from '../components/EmployeeLeavesSection';
// import { useDispatch, useSelector } from 'react-redux';
import {
  openAttModal,
  closeAttModal,
  markAttByDates,
  markAttByMonth,
} from '../../attendance/store/actions';

import { selectAttModalOpen } from '../../attendance/store/selectors';
import MarkAttendanceModal from '../../attendance/components/MarkAttendanceModal';

// If you pass the whole employee object via navigation, great.
// Otherwise we try to find it from Redux list by id.
const root = s => s.admin?.hr?.employees || {};
const selectEmpList = s => root(s).list || [];

function useEmployeeFromParams(route) {
  const { emp, id } = route.params || {};
  const list = useSelector(selectEmpList);

  return useMemo(() => {
    if (emp) return emp;
    if (!id) return null;
    return list.find(e => e.employeeId === id) || null;
  }, [emp, id, list]);
}

/* -------------------------------- Profile Tab -------------------------------- */
const Bullet = ({ label, value }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletLabel}>{label}</Text>
    <Text style={styles.bulletValue}>{value ?? '—'}</Text>
  </View>
);

const StatCard = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value ?? '—'}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Tiny stacked bar “chart” (dependency-free visual)
const TinyStatusChart = ({
  completed = 0,
  todo = 0,
  progress = 0,
  cancelled = 0,
  notStarted = 0,
}) => {
  const total = completed + todo + progress + cancelled + notStarted || 1;
  const pct = x => `${(x / total) * 100}%`;

  return (
    <View style={styles.chartBox}>
      <View style={styles.chartBar}>
        <View style={[styles.sliceCompleted, { width: pct(completed) }]} />
        <View style={[styles.sliceTodo, { width: pct(todo) }]} />
        <View style={[styles.sliceProgress, { width: pct(progress) }]} />
        <View style={[styles.sliceCancelled, { width: pct(cancelled) }]} />
        <View style={[styles.sliceNotStarted, { width: pct(notStarted) }]} />
      </View>
      <View style={styles.legendWrap}>
        <View style={styles.legendRow}>
          <View style={[styles.k, styles.sliceCompleted]} />
          <Text style={styles.legendTxt}>Completed</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.k, styles.sliceTodo]} />
          <Text style={styles.legendTxt}>To Do</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.k, styles.sliceProgress]} />
          <Text style={styles.legendTxt}>In Progress</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.k, styles.sliceCancelled]} />
          <Text style={styles.legendTxt}>Cancelled</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.k, styles.sliceNotStarted]} />
          <Text style={styles.legendTxt}>Not Started</Text>
        </View>
      </View>
    </View>
  );
};

function ProfileTab({ emp }) {
  const stats = { tasks: 4, projects: 2, hours: 2 };

  const taskBreakdown = {
    completed: 12,
    todo: 5,
    progress: 18,
    cancelled: 3,
    notStarted: 2,
  };

  const dispatch = useDispatch();
  const modalOpen = useSelector(selectAttModalOpen);

  const onSave = ({ type, body }) => {
    if (type === 'dates') dispatch(markAttByDates(body));
    else dispatch(markAttByMonth(body));
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {/* Header card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={
                emp?.profilePictureUrl
                  ? { uri: emp.profilePictureUrl }
                  : require('../../../../../assets/icons/dashicons_awards.png')
              }
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.empName}>{emp?.name || '—'}</Text>
              <Text style={styles.empSub}>{emp?.designationName || '—'}</Text>
              <Text style={styles.empMeta}>
                Employee ID: {emp?.employeeId || '—'}
              </Text>
              <Text style={styles.empMeta}>
                Reporting To: {emp?.reportingToName || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.aboutTxt}>{emp?.about?.trim() || '—'}</Text>
        </View>

        {/* Quick info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View style={styles.colHalf}>
              <Bullet label="Email" value={emp?.email} />
              <Bullet label="Phone" value={emp?.mobile} />
              <Bullet label="Gender" value={emp?.gender} />
              <Bullet label="Birthday" value={emp?.birthday} />
            </View>

            <View style={styles.colHalf}>
              <Bullet label="Blood Group" value={emp?.bloodGroup} />
              <Bullet label="Department" value={emp?.departmentName} />
              <Bullet label="Country" value={emp?.country} />
              <Bullet label="Office Shift" value={emp?.officeShift} />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.row, { marginBottom: 12 }]}>
          <StatCard label="Tasks" value={stats.tasks} />
          <StatCard label="Projects" value={stats.projects} />
          <StatCard label="Hours Logged" value={stats.hours} />
        </View>

        {/* Task chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tasks</Text>
          <TinyStatusChart {...taskBreakdown} />
        </View>

        {/* Attendance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance</Text>

          <EmployeeAttendanceCalendar employeeId={emp?.employeeId} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave Quota</Text>

          <EmployeeLeaveQuota employeeId={emp?.employeeId} />
        </View>

        <View style={styles.card}>
          {/* <Text style={styles.cardTitle}>Employee Leaves</Text> */}

          <EmployeeLeavesSection employeeId={emp?.employeeId} />
        </View>
      </ScrollView>

      {/* 🔴 Modal must be outside ScrollView */}
      <MarkAttendanceModal
        visible={modalOpen}
        onClose={() => dispatch(closeAttModal())}
        onSave={onSave}
      />
    </>
  );
}

/* ------------------------------ Placeholder Tabs ----------------------------- */
const Placeholder = ({ label }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderTxt}>{label} (coming soon)</Text>
  </View>
);

/* --------------------------------- Main Screen -------------------------------- */
export default function AdminEmployeeViewScreen({ route }) {
  const emp = useEmployeeFromParams(route);

  const layout = Dimensions.get('window');
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'profile', title: 'Profile' },
    { key: 'work', title: 'Work' },
    { key: 'docs', title: 'Documents' },
    { key: 'emergency', title: 'Emergency' },
    { key: 'promotion', title: 'Promotion' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'profile':
        return <ProfileTab emp={emp} />;

      case 'work':
        return <AdminEmployeeProjectsScreen emp={emp} />;

      case 'docs':
        return <Placeholder label="Documents" />;

      case 'emergency':
        return <Placeholder label="Emergency" />;

      case 'promotion':
        return <Placeholder label="Promotion" />;

      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#1d4ed8', height: 3 }}
          style={{ backgroundColor: '#eef2ff' }}
          activeColor="#111827"
          inactiveColor="#6b7280"
          labelStyle={{ fontWeight: '700', textTransform: 'none' }}
          scrollEnabled
        />
      )}
    />
  );
}

/* ----------------------------------- Styles ---------------------------------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  avatar: { width: 72, height: 72, borderRadius: 12 },
  empName: { fontSize: 20, fontWeight: '800', color: '#111827' },
  empSub: { color: '#374151', fontWeight: '600', marginTop: 2 },
  empMeta: { color: '#6b7280', marginTop: 2 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  aboutTxt: { color: '#374151' },

  bulletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  bulletLabel: { color: '#6b7280', width: '45%' },
  bulletValue: { color: '#111827', width: '55%', textAlign: 'right' },
  colHalf: { width: '50%', paddingRight: 10 },

  row: { flexDirection: 'row', gap: 10, paddingHorizontal: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '900', color: '#1f2a66' },
  statLabel: { color: '#374151', marginTop: 4, fontWeight: '600' },

  chartBox: { paddingVertical: 6 },
  chartBar: {
    height: 16,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sliceCompleted: { backgroundColor: '#1f7a3e' },
  sliceTodo: { backgroundColor: '#f2b632' },
  sliceProgress: { backgroundColor: '#3b82f6' },
  sliceCancelled: { backgroundColor: '#dc2626' },
  sliceNotStarted: { backgroundColor: '#9ca3af' },
  legendWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  k: { width: 14, height: 14, borderRadius: 3 },
  legendTxt: { color: '#111827' },

  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderTxt: { color: '#6b7280', fontWeight: '700' },
});
