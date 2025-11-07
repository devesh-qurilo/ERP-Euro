// src/modules/admin/work/projects/components/ProjectTasksPanel.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasksByProject,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
} from '../store/tasks/actions'; // <-- adjust path if different

/* =========================== selectors (no crash) =========================== */
const selectTasksState = (s, projectId) =>
  s?.admin?.work?.projects?.tasks || {}; // { byProject: { [id]: [] }, busy: false, error: null }

const useTasks = projectId => {
  return useSelector(s => {
    const root = selectTasksState(s, projectId);
    const list =
      root.byProject && projectId != null
        ? root.byProject[projectId] || []
        : [];
    return {
      list,
      busy: !!root.busy,
      error: root.error || null,
    };
  });
};

/* =============================== helpers =================================== */
function fmtDate(d) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    const day = String(dt.getDate()).padStart(2, '0');
    const mo = dt.toLocaleString('en-US', { month: 'short' });
    const yr = dt.getFullYear();
    return `${day} ${mo}, ${yr}`;
  } catch {
    return d;
  }
}

// form state seeder (prevents "seed missing" error)
function seed(item) {
  if (!item) {
    return {
      title: '',
      category: '',
      startDate: '',
      dueDate: '',
      noDueDate: false,
      taskStageId: '',
      assignedEmployeeIds: '', // comma string
      description: '',
      labelIds: '', // comma string
      milestoneId: '',
      priority: 'LOW',
      isPrivate: false,
      timeEstimateMinutes: '',
      isDependent: false,
      projectId: '',
    };
  }
  const assignedIds = (
    item.assignedEmployeeIds && item.assignedEmployeeIds.length
      ? item.assignedEmployeeIds
      : (item.assignedEmployees || []).map(e => e.employeeId)
  ).join(', ');

  const lblIds = (item.labels || []).map(l => l.id).join(', ');

  return {
    title: item.title || '',
    category: item?.categoryId?.name || '',
    startDate: item.startDate || '',
    dueDate: item.dueDate || '',
    noDueDate: !!item.noDueDate,
    taskStageId: item.taskStageId || item?.taskStage?.id || '',
    assignedEmployeeIds: assignedIds,
    description: item.description || '',
    labelIds: lblIds,
    milestoneId: item.milestoneId || item?.milestone?.id || '',
    priority: item.priority || 'LOW',
    isPrivate: !!item.isPrivate,
    timeEstimateMinutes:
      item.timeEstimateMinutes != null ? String(item.timeEstimateMinutes) : '',
    isDependent: !!item.isDependent,
    projectId: item.projectId || '',
  };
}

/* ============================== small atoms ================================ */
const Col = ({ children, style, w }) => (
  <View
    style={[
      { width: w || 180, paddingVertical: 10, paddingHorizontal: 8 },
      style,
    ]}
  >
    {children}
  </View>
);

const H = ({ children, w }) => (
  <Col w={w}>
    <Text style={styles.th}>{children}</Text>
  </Col>
);

const Cell = ({ text }) => (
  <Text numberOfLines={1} style={styles.td}>
    {text ?? '—'}
  </Text>
);

const Badge = ({ text, tone = 'default' }) => (
  <View
    style={[
      styles.badge,
      tone === 'ok' && {
        backgroundColor: '#DCFCE7',
        borderColor: '#86EFAC',
        color: '#14532D',
      },
      tone === 'warn' && {
        backgroundColor: '#FEF9C3',
        borderColor: '#FDE68A',
        color: '#513C06',
      },
      tone === 'danger' && {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5',
        color: '#7F1D1D',
      },
    ]}
  >
    <Text style={styles.badgeTxt}>{text}</Text>
  </View>
);

/* ================================ modals =================================== */
function ViewModal({ visible, onClose, item }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Task Details</Text>
          <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator>
            <Row label="Title" value={item?.title} />
            <Row label="Category" value={item?.categoryId?.name} />
            <Row label="Stage" value={item?.taskStage?.name} />
            <Row label="Priority" value={item?.priority} />
            <Row label="Start" value={fmtDate(item?.startDate)} />
            <Row label="Due" value={fmtDate(item?.dueDate)} />
            <Row label="No Due" value={String(!!item?.noDueDate)} />
            <Row label="Private" value={String(!!item?.isPrivate)} />
            <Row
              label="Estimate (min)"
              value={String(item?.timeEstimateMinutes ?? '—')}
            />
            <Row
              label="Assigned To"
              value={(item?.assignedEmployees || [])
                .map(e => e.name)
                .join(', ')}
            />
            <Row
              label="Labels"
              value={(item?.labels || []).map(l => `${l.name}`).join(', ')}
            />
            <Row label="Milestone" value={item?.milestone?.title} />
            <Row label="Description" value={item?.description} multiline />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable onPress={onClose} style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EditModal({ visible, onClose, initial, onSubmit, projectId }) {
  const [f, setF] = useState(() => {
    const s = seed(initial);
    return { ...s, projectId: projectId || s.projectId };
  });

  useEffect(() => {
    const s = seed(initial);
    setF({ ...s, projectId: projectId || s.projectId });
  }, [initial, projectId]);

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const submit = () => {
    // turn comma strings into arrays where saga expects them
    const payload = {
      ...f,
      assignedEmployeeIds: f.assignedEmployeeIds
        ? f.assignedEmployeeIds
            .split(',')
            .map(x => x.trim())
            .filter(Boolean)
        : [],
      labelIds: f.labelIds
        ? f.labelIds
            .split(',')
            .map(x => x.trim())
            .filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { maxWidth: 720 }]}>
          <Text style={styles.modalTitle}>
            {initial ? 'Edit Task' : 'Add Task'}
          </Text>

          <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator>
            <Field
              label="Title"
              value={f.title}
              onChangeText={t => set('title', t)}
            />
            <Field
              label="Category"
              value={f.category}
              onChangeText={t => set('category', t)}
            />
            <Field
              label="Start Date (YYYY-MM-DD)"
              value={f.startDate}
              onChangeText={t => set('startDate', t)}
            />
            <Field
              label="Due Date (YYYY-MM-DD)"
              value={f.dueDate}
              onChangeText={t => set('dueDate', t)}
            />
            <Field
              label="No Due Date (true/false)"
              value={String(f.noDueDate)}
              onChangeText={t => set('noDueDate', t === 'true')}
            />
            <Field
              label="Task Stage Id"
              value={String(f.taskStageId)}
              onChangeText={t => set('taskStageId', t)}
            />
            <Field
              label="Assigned Employee Ids (comma)"
              value={f.assignedEmployeeIds}
              onChangeText={t => set('assignedEmployeeIds', t)}
            />
            <Field
              label="Description"
              value={f.description}
              multiline
              onChangeText={t => set('description', t)}
            />
            <Field
              label="Label Ids (comma)"
              value={f.labelIds}
              onChangeText={t => set('labelIds', t)}
            />
            <Field
              label="Milestone Id"
              value={String(f.milestoneId)}
              onChangeText={t => set('milestoneId', t)}
            />
            <Field
              label="Priority (LOW/MEDIUM/HIGH/URGENT)"
              value={f.priority}
              onChangeText={t => set('priority', t)}
            />
            <Field
              label="Private (true/false)"
              value={String(f.isPrivate)}
              onChangeText={t => set('isPrivate', t === 'true')}
            />
            <Field
              label="Time Estimate (minutes)"
              value={String(f.timeEstimateMinutes)}
              onChangeText={t => set('timeEstimateMinutes', t)}
            />
            <Field
              label="Is Dependent (true/false)"
              value={String(f.isDependent)}
              onChangeText={t => set('isDependent', t === 'true')}
            />
            <Field
              label="Project Id"
              value={String(f.projectId)}
              onChangeText={t => set('projectId', t)}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable onPress={onClose} style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryTxt}>Cancel</Text>
            </Pressable>
            <Pressable onPress={submit} style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryTxt}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* =============================== main panel ================================= */
export default function ProjectTasksPanel({ projectId }) {
  const dispatch = useDispatch();
  const { list, busy, error } = useTasks(projectId);

  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (projectId) dispatch(fetchTasksByProject(projectId));
  }, [dispatch, projectId]);

  const rows = useMemo(() => list || [], [list]);

  const onAdd = () => {
    console.log('projectId', projectId), setAdding(true);
  };
  const onView = item => setViewing(item);
  const onEdit = item => setEditing(item);
  const onDelete = item =>
    dispatch(deleteProjectTask({ projectId, taskId: item.id }));

  const submitAdd = payload => {
    setAdding(false);
    dispatch(createProjectTask(payload));
  };

  const submitEdit = payload => {
    setEditing(null);
    dispatch(updateProjectTask(editing.id, payload));
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
      }}
    >
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>Task Details</Text>
        <Pressable style={styles.btnPrimary} onPress={onAdd}>
          <Text style={styles.btnPrimaryTxt}>+ Add Task</Text>
        </Pressable>
      </View>

      {busy && (
        <View style={{ padding: 12 }}>
          <ActivityIndicator />
        </View>
      )}
      {error && (
        <View style={{ padding: 12 }}>
          <Text style={{ color: '#b91c1c' }}>{String(error)}</Text>
        </View>
      )}

      {/* table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        style={{ borderTopWidth: 1, borderColor: '#e5e7eb' }}
      >
        <View>
          {/* head */}
          <View style={styles.thead}>
            <H w={80}>ID</H>
            <H w={260}>Task Name</H>
            <H w={140}>Category</H>
            <H w={140}>Start Date</H>
            <H w={140}>Due Date</H>
            <H w={120}>Estimate</H>
            <H w={180}>Assigned To</H>
            <H w={120}>Priority</H>
            <H w={140}>Stage</H>
            <H w={220}>Actions</H>
          </View>

          {/* body */}
          {rows.map(item => (
            <View key={item.id} style={styles.trow}>
              <Col w={80}>
                <Cell text={`#${item.id}`} />
              </Col>
              <Col w={260}>
                <Cell text={item.title} />
              </Col>
              <Col w={140}>
                <Cell text={item?.categoryId?.name} />
              </Col>
              <Col w={140}>
                <Cell text={fmtDate(item.startDate)} />
              </Col>
              <Col w={140}>
                <Cell text={fmtDate(item.dueDate)} />
              </Col>
              <Col w={120}>
                <Cell text={`${item.timeEstimateMinutes ?? 0}m`} />
              </Col>
              <Col w={180}>
                <Cell
                  text={(item.assignedEmployees || [])
                    .map(e => e.name)
                    .join(', ')}
                />
              </Col>
              <Col w={120}>
                <Badge
                  text={item.priority || 'LOW'}
                  tone={
                    item.priority === 'URGENT'
                      ? 'danger'
                      : item.priority === 'HIGH'
                      ? 'warn'
                      : 'default'
                  }
                />
              </Col>
              <Col w={140}>
                <Cell text={item?.taskStage?.name} />
              </Col>
              <Col w={220}>
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.btnGhost}
                    onPress={() => onView(item)}
                  >
                    <Text style={styles.btnGhostTxt}>View</Text>
                  </Pressable>
                  <Pressable
                    style={styles.btnGhost}
                    onPress={() => onEdit(item)}
                  >
                    <Text style={styles.btnGhostTxt}>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={styles.btnDanger}
                    onPress={() => onDelete(item)}
                  >
                    <Text style={styles.btnDangerTxt}>Delete</Text>
                  </Pressable>
                </View>
              </Col>
            </View>
          ))}

          {rows.length === 0 && !busy && (
            <View style={{ padding: 16 }}>
              <Text style={{ color: '#6b7280' }}>
                No tasks found for this project.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* modals */}
      <ViewModal
        visible={!!viewing}
        item={viewing}
        onClose={() => setViewing(null)}
      />
      <EditModal
        visible={adding}
        initial={null}
        projectId={projectId}
        onClose={() => setAdding(false)}
        onSubmit={submitAdd}
      />
      <EditModal
        visible={!!editing}
        initial={editing}
        projectId={projectId}
        onClose={() => setEditing(null)}
        onSubmit={submitEdit}
      />
    </View>
  );
}

/* ============================== tiny subviews =============================== */
function Row({ label, value, multiline }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: '#6b7280', marginBottom: 4 }}>{label}</Text>
      <Text style={{ color: '#111827' }} numberOfLines={multiline ? 0 : 2}>
        {value?.length ? value : '—'}
      </Text>
    </View>
  );
}

function Field({ label, multiline, ...props }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: '#374151', marginBottom: 6, fontWeight: '600' }}>
        {label}
      </Text>
      <TextInput
        {...props}
        multiline={!!multiline}
        style={[
          styles.input,
          multiline && { height: 100, textAlignVertical: 'top' },
        ]}
        placeholder={label}
      />
    </View>
  );
}

/* ================================= styles ================================== */
const styles = StyleSheet.create({
  header: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontWeight: '800', fontSize: 16, color: '#111827' },

  thead: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  trow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  th: { fontWeight: '700', color: '#374151' },
  td: { color: '#111827' },

  actionRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btnPrimary: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnPrimaryTxt: { color: '#fff', fontWeight: '700' },
  btnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#fff',
  },
  btnSecondaryTxt: { color: '#111827', fontWeight: '700' },
  btnGhost: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  btnGhostTxt: { color: '#111827', fontWeight: '700' },
  btnDanger: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  btnDangerTxt: { color: '#fff', fontWeight: '700' },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  badgeTxt: { color: '#111827', fontWeight: '700', fontSize: 12 },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 640,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: '#111827',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 12,
  },
});
