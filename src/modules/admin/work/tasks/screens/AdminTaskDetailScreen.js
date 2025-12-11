// src/modules/admin/work/tasks/screens/AdminTaskDetailScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { adminTasksAPI } from '../../../../../services/api';
import TaskBottomTabsRedux from '../../../shared/tasks/detail/components/TaskBottomTabsRedux';
import { setTaskId, setTab } from '../../../shared/tasks/detail/store/actions';

const fmtDate = d => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return String(d);
  }
};

const SmallAvatar = ({ uri, name, size = 28 }) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          marginRight: 6,
          borderWidth: 1,
          borderColor: '#fff',
        }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
      }}
    >
      <Text style={{ fontSize: 12, color: '#6B7280' }}>
        {name ? name[0]?.toUpperCase() : '?'}
      </Text>
    </View>
  );
};

const Pill = ({ text, color = '#F3F4F6', textColor = '#111827' }) => (
  <View
    style={{
      backgroundColor: color,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 6,
    }}
  >
    <Text style={{ fontSize: 12, color: textColor }}>{text}</Text>
  </View>
);

export default function AdminTaskDetailScreen() {
  const { params } = useRoute();
  const taskId = params?.taskId;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // register task id for bottom tabs
  useEffect(() => {
    if (taskId) {
      dispatch(setTaskId(taskId));
      dispatch(setTab('files'));
    }
  }, [taskId, dispatch]);

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    setRefreshing(true);
    try {
      // If you have GET /api/projects/tasks/{id} replace below.
      const all = await adminTasksAPI.listAll();
      const found = Array.isArray(all)
        ? all.find(t => String(t.id) === String(taskId))
        : null;
      setTask(found || null);
    } catch (err) {
      console.warn('Failed to load task', err);
      Alert.alert('Error', 'Unable to fetch task details.');
      setTask(null);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    let ok = true;
    (async () => {
      if (!taskId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        await fetchTask();
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, [taskId, fetchTask]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  if (!task)
    return (
      <View style={{ padding: 16 }}>
        <Text>Task not found.</Text>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            fetchTask();
          }}
          style={{
            marginTop: 12,
            backgroundColor: '#2563EB',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  // UI rendering
  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7F9', padding: 16 }}>
      <ScrollView
        style={{ marginBottom: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#EEE',
            marginBottom: 12,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>
                {task.title}
              </Text>
              <Text style={{ marginTop: 6, color: '#6B7280' }}>
                #{task.projectShortCode || '—'} · {task?.projectName || '—'}
              </Text>
              <Text style={{ marginTop: 8, color: '#374151' }}>
                Stage:{' '}
                <Text style={{ fontWeight: '700' }}>
                  {task?.taskStage?.name || '—'}
                </Text>
                {'  '}· Priority:{' '}
                <Text style={{ fontWeight: '700' }}>
                  {task?.priority || '—'}
                </Text>
              </Text>
            </View>

            <View
              style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setLoading(true);
                  await fetchTask();
                }}
                style={{
                  backgroundColor: '#EEF2FF',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#3730A3', fontWeight: '700' }}>
                  Refresh
                </Text>
              </TouchableOpacity>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>
                {fmtDate(task?.createdAt)}
              </Text>
            </View>
          </View>

          {!!task.description && (
            <Text style={{ marginTop: 12, color: '#374151' }}>
              {task.description}
            </Text>
          )}
        </View>

        {/* Meta info card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#EEE',
            marginBottom: 12,
          }}
        >
          {/* Row 1: Dates */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <View>
              <Text style={{ color: '#6B7280' }}>Start</Text>
              <Text style={{ fontWeight: '700' }}>
                {fmtDate(task.startDate)}
              </Text>
            </View>

            <View>
              <Text style={{ color: '#6B7280' }}>Due</Text>
              <Text style={{ fontWeight: '700' }}>{fmtDate(task.dueDate)}</Text>
            </View>

            <View>
              <Text style={{ color: '#6B7280' }}>Completed</Text>
              <Text style={{ fontWeight: '700' }}>
                {fmtDate(task.completedOn)}
              </Text>
            </View>

            <View>
              <Text style={{ color: '#6B7280' }}>Hours Logged</Text>
              <Text style={{ fontWeight: '700' }}>
                {task.hoursLogged ?? '0'}
              </Text>
            </View>
          </View>

          {/* Row 2: Category / Labels / Milestone */}
          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: '#6B7280', marginBottom: 6 }}>Category</Text>
            <Text style={{ fontWeight: '700' }}>
              {task?.categoryId?.name || '—'}
            </Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: '#6B7280', marginBottom: 6 }}>Labels</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {(task.labels || []).length === 0 ? (
                <Text style={{ color: '#6B7280' }}>—</Text>
              ) : (
                (task.labels || []).map(lbl => (
                  <Pill
                    key={String(lbl.id)}
                    text={lbl.name}
                    color={lbl.colorCode || '#F3F4F6'}
                    textColor="#111827"
                  />
                ))
              )}
            </View>
          </View>

          <View>
            <Text style={{ color: '#6B7280', marginBottom: 6 }}>Milestone</Text>
            {task.milestone ? (
              <View>
                <Text style={{ fontWeight: '700' }}>
                  {task.milestone.title}
                </Text>
                <Text style={{ color: '#6B7280' }}>
                  {fmtDate(task.milestone.startDate)} —{' '}
                  {fmtDate(task.milestone.endDate)}
                </Text>
              </View>
            ) : (
              <Text style={{ color: '#6B7280' }}>—</Text>
            )}
          </View>
        </View>

        {/* Assigned Employees */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#EEE',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#6B7280', marginBottom: 8 }}>Assigned</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            {(task.assignedEmployees || []).length === 0 ? (
              <Text style={{ color: '#6B7280' }}>No assignees</Text>
            ) : (
              (task.assignedEmployees || []).map(emp => (
                <View
                  key={emp.employeeId}
                  style={{ alignItems: 'center', marginRight: 12 }}
                >
                  <SmallAvatar uri={emp.profileUrl} name={emp.name} />
                  <Text
                    style={{ fontSize: 12, color: '#374151' }}
                    numberOfLines={1}
                  >
                    {emp.name}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6B7280' }}>
                    {emp.designation || ''}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* More meta */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <View style={{ marginRight: 12 }}>
              <Text style={{ color: '#6B7280' }}>Time Estimate</Text>
              <Text style={{ fontWeight: '700' }}>
                {task.timeEstimateMinutes
                  ? `${task.timeEstimateMinutes} min`
                  : task.timeEstimate
                  ? 'Yes'
                  : 'No'}
              </Text>
            </View>

            <View style={{ marginRight: 12 }}>
              <Text style={{ color: '#6B7280' }}>Private</Text>
              <Text style={{ fontWeight: '700' }}>
                {task.isPrivate ? 'Yes' : 'No'}
              </Text>
            </View>

            <View style={{ marginRight: 12 }}>
              <Text style={{ color: '#6B7280' }}>Dependent</Text>
              <Text style={{ fontWeight: '700' }}>
                {task.isDependent
                  ? task.dependentTaskId
                    ? `#${task.dependentTaskId}`
                    : 'Yes'
                  : 'No'}
              </Text>
            </View>
          </View>
        </View>

        {/* Attachments */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#EEE',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#6B7280', marginBottom: 8 }}>Attachments</Text>

          {(task.attachments || []).length === 0 ? (
            <Text style={{ color: '#6B7280' }}>No attachments</Text>
          ) : (
            (task.attachments || []).map(att => (
              <View
                key={String(att.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ fontWeight: '600' }}>{att.filename}</Text>
                  <Text style={{ color: '#6B7280', fontSize: 12 }}>
                    {(att.mimeType || '').split('/')[0].toUpperCase() || ''}
                    {' • '}
                    {att.size ? `${Math.round(att.size / 1024)} KB` : ''}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!att.url) return Alert.alert('No file url');
                      Linking.openURL(att.url).catch(() =>
                        Alert.alert('Cannot open file'),
                      );
                    }}
                  >
                    <Text style={{ color: '#2563EB', fontWeight: '700' }}>
                      Open
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Footer meta */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: '#EEE',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#6B7280' }}>Created By</Text>
          <Text style={{ fontWeight: '700' }}>{task.createdBy || '—'}</Text>
          <Text style={{ color: '#6B7280', marginTop: 6 }}>
            Created: {fmtDate(task.createdAt)} · Updated:{' '}
            {fmtDate(task.updatedAt)}
          </Text>
        </View>
        <TaskBottomTabsRedux />
      </ScrollView>

      {/* Tabs (Files / Subtask / Notes) */}
      {/* <TaskBottomTabsRedux /> */}
    </View>
  );
}
