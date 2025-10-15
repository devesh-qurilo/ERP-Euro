import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectProjects } from '../../projects/store/selectors';

const fmt = d => (d ? new Date(d).toLocaleDateString() : '—');
const pct = v => Math.max(0, Math.min(100, Number(v ?? 0)));

export default function ProjectOverviewTab({ route }) {
  const { projectId } = route.params || {};
  const all = useSelector(selectProjects);
  const project = useMemo(
    () => all.find(p => p.id === projectId),
    [all, projectId],
  );

  if (!project) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#6b7280' }}>Project not found.</Text>
      </View>
    );
  }

  const progress = pct(project.progressPercent);
  const hoursTotal =
    project.totalTimeLoggedMinutes != null
      ? (project.totalTimeLoggedMinutes / 60).toFixed(1)
      : null;

  // Simple derived “task” split for now (you’ll replace with real task stats later)
  const todo = Math.max(0, 100 - progress);
  const incomplete = Math.min(progress, 100 - progress * 0.3);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {/* Project progress */}
      <View style={styles.card}>
        <Text style={styles.h2}>Project progress</Text>
        <View style={styles.rowBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ring percent={progress} />
            <Text style={styles.bigPct}>{progress} %</Text>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={styles.kv}>
              <Text style={styles.k}>Start Date </Text>
              {fmt(project.startDate)}
            </Text>
            <Text style={styles.kv}>
              <Text style={styles.k}>End Date </Text>
              {project.noDeadline ? 'No deadline' : fmt(project.deadline)}
            </Text>
          </View>
        </View>
      </View>

      {/* Client */}
      <View style={styles.card}>
        <Text style={styles.h2}>Client</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            marginTop: 8,
          }}
        >
          {project.client?.profilePictureUrl ? (
            <Image
              source={{ uri: project.client.profilePictureUrl }}
              style={styles.clientAvatar}
            />
          ) : (
            <View style={[styles.clientAvatar, styles.avatarEmpty]}>
              <Text>👤</Text>
            </View>
          )}
          <View>
            <Text style={styles.clientName}>{project.client?.name || '—'}</Text>
            <Text style={styles.clientOrg}>{project.companyName || ' '}</Text>
          </View>
        </View>
      </View>

      {/* Task (stub donut) */}
      <View style={styles.card}>
        <Text style={styles.h2}>Task</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <Legend color="#f59e0b" label="TO - Do" />
          <Legend color="#ef4444" label="Incomplete" />
        </View>
        <Donut likeA="todo" todo={todo} incomplete={incomplete} />
      </View>

      {/* Hours Logged */}
      <View style={styles.card}>
        <Text style={styles.h2}>Hours Logged</Text>
        {hoursTotal != null ? (
          <Text style={styles.hoursTxt}>{hoursTotal} hrs total</Text>
        ) : (
          <Text style={styles.dim}>No time logs yet.</Text>
        )}
      </View>

      {/* Members */}
      <View style={styles.card}>
        <Text style={styles.h2}>Members</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 10,
          }}
        >
          {(project.assignedEmployees || []).map((m, i) => (
            <View key={m.employeeId || i} style={styles.memberChip}>
              {m.profileUrl ? (
                <Image
                  source={{ uri: m.profileUrl }}
                  style={styles.memberAvatar}
                />
              ) : (
                <View style={[styles.memberAvatar, styles.avatarEmpty]}>
                  <Text>👤</Text>
                </View>
              )}
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.memberName} numberOfLines={1}>
                  {m.name || '—'}
                </Text>
                <Text style={styles.memberSub} numberOfLines={1}>
                  {m.designation || m.department || ' '}
                </Text>
              </View>
            </View>
          ))}
          {(!project.assignedEmployees ||
            project.assignedEmployees.length === 0) && (
            <Text style={styles.dim}>No members assigned.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

/* ------------ Tiny visual helpers (no 3rd-party libs) ------------- */
function Ring({ percent = 0 }) {
  // visual: bar pretending to be a semi-ring
  const p = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.ringBase}>
      <View style={[styles.ringFill, { width: `${p}%` }]} />
    </View>
  );
}

function Legend({ color, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: 18,
          height: 14,
          borderRadius: 4,
          backgroundColor: color,
        }}
      />
      <Text style={{ fontWeight: '800', color: '#374151' }}>{label}</Text>
    </View>
  );
}

function Donut({ todo = 70, incomplete = 30 }) {
  // Simple stacked bar (readable on mobile)
  const sum = Math.max(1, todo + incomplete);
  const tPct = (todo / sum) * 100;
  const iPct = 100 - tPct;
  return (
    <View style={styles.donutWrap}>
      <View
        style={[
          styles.donutSeg,
          { width: `${tPct}%`, backgroundColor: '#f59e0b' },
        ]}
      />
      <View
        style={[
          styles.donutSeg,
          { width: `${iPct}%`, backgroundColor: '#ef4444' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  h2: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  bigPct: { fontSize: 20, fontWeight: '900', color: '#0b0b0c' },
  kv: { fontWeight: '800', color: '#111827' },
  k: { color: '#6b7280' },

  clientAvatar: { width: 64, height: 64, borderRadius: 12 },
  clientName: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  clientOrg: { color: '#6b7280', marginTop: 2 },

  donutWrap: {
    height: 16,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    marginTop: 16,
  },
  donutSeg: { height: '100%' },

  hoursTxt: { marginTop: 10, fontWeight: '900', color: '#111827' },
  dim: { color: '#6b7280', marginTop: 8 },

  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    minWidth: 160,
  },
  memberAvatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  memberName: { fontWeight: '900', color: '#111827', maxWidth: 160 },
  memberSub: { color: '#6b7280', marginTop: 2, maxWidth: 160 },

  ringBase: {
    width: 92,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  ringFill: { height: '100%', backgroundColor: '#22c55e' },
});
