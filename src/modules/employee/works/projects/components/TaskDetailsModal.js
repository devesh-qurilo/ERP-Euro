// src/modules/employee/works/projects/components/TaskDetailsModal.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTaskFiles,
  uploadTaskFile,
  fetchSubtasks,
  createSubtask,
  fetchTimesheets,
  fetchNotes,
  createNote,
  clearTaskDetails,
} from '../store/taskDetails/actions';
import {
  selectTaskFiles,
  selectTaskFilesLoading,
  selectSubtasks,
  selectSubtasksLoading,
  selectTimesheets,
  selectTimesheetsLoading,
  selectNotes,
  selectNotesLoading,
} from '../store/taskDetails/selectors';

const Tab = ({ active, label, onPress }) => (
  <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>{label}</Text>
  </Pressable>
);

export default function TaskDetailsModal({ visible, task, onClose }) {
  const taskId = task?.id;
  const projectId = task?.projectId;
  const dispatch = useDispatch();
  const [tab, setTab] = useState('files'); // files | subtasks | timesheet | notes

  // --- Files ---
  const files = useSelector(selectTaskFiles);
  const filesLoading = useSelector(selectTaskFilesLoading);

  const loadFiles = () => taskId && dispatch(fetchTaskFiles(taskId));
  const pickAndUpload = async () => {
    try {
      const res = await DocumentPicker.pickSingle();
      const file = {
        uri: res.uri,
        name: res.name,
        type: res.type || 'application/octet-stream',
      };
      dispatch(uploadTaskFile(taskId, file));
    } catch (e) {
      if (DocumentPicker.isCancel(e)) return;
    }
  };

  // --- Subtasks ---
  const subs = useSelector(selectSubtasks);
  const subsLoading = useSelector(selectSubtasksLoading);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const loadSubs = () => taskId && dispatch(fetchSubtasks(taskId));
  const addSubtask = () => {
    if (!title.trim()) return;
    dispatch(
      createSubtask(taskId, {
        title: title.trim(),
        description: desc.trim() || null,
      }),
    );
    setTitle('');
    setDesc('');
  };

  // --- Timesheet ---

  const sheets = useSelector(selectTimesheets);
  const sheetsLoading = useSelector(selectTimesheetsLoading);

  const loadSheets = () =>
    taskId && dispatch(fetchTimesheets(projectId, taskId));

  // --- Notes ---
  const notes = useSelector(selectNotes);
  const notesLoading = useSelector(selectNotesLoading);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const loadNotes = () => taskId && dispatch(fetchNotes(taskId));
  const addNote = () => {
    if (!noteContent.trim()) return;
    dispatch(
      createNote(taskId, {
        title: noteTitle.trim() || null,
        content: noteContent.trim(),
        isPublic,
      }),
    );
    setNoteTitle('');
    setNoteContent('');
  };

  // optional: clear slice when modal closes
  useEffect(() => {
    if (!visible) dispatch(clearTaskDetails());
  }, [visible, dispatch]);

  // >>> LOAD DATA when modal opens & tab changes <<<
  useEffect(() => {
    if (!visible || !taskId) return;
    switch (tab) {
      case 'files':
        loadFiles();
        break;
      case 'subtasks':
        loadSubs();
        break;
      case 'timesheet':
        loadSheets();
        break;
      case 'notes':
        loadNotes();
        break;
      default:
        break;
    }
  }, [visible, tab, taskId]);

  if (!visible || !task) return null;

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.title} numberOfLines={2}>
        {task.title || 'Task'}
      </Text>
      <Pressable onPress={onClose} style={styles.close}>
        <Text style={{ fontWeight: '900' }}>✕</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Header />
          {/* Tabs */}
          <View style={styles.tabRow}>
            <Tab
              label="Files"
              active={tab === 'files'}
              onPress={() => setTab('files')}
            />
            <Tab
              label="Sub Task"
              active={tab === 'subtasks'}
              onPress={() => setTab('subtasks')}
            />
            <Tab
              label="Timesheet"
              active={tab === 'timesheet'}
              onPress={() => setTab('timesheet')}
            />
            <Tab
              label="Notes"
              active={tab === 'notes'}
              onPress={() => setTab('notes')}
            />
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {tab === 'files' && (
              <View>
                <Pressable onPress={pickAndUpload} style={styles.primaryBtn}>
                  <Text style={styles.primaryTxt}>Upload File</Text>
                </Pressable>

                <View style={styles.table}>
                  <RowHead
                    cols={['File', 'Type', 'Size']}
                    widths={[200, 120, 100]}
                  />
                  {(filesLoading ? [] : files).map((f, i) => (
                    <Row key={f.id || i} widths={[200, 120, 100]}>
                      <View
                        style={[
                          styles.cell,
                          { width: 200, flexDirection: 'row', gap: 8 },
                        ]}
                      >
                        <Text style={styles.body} numberOfLines={1}>
                          {f.filename}
                        </Text>
                      </View>
                      <Cell w={120} text={f.mimeType || '—'} />
                      <Cell w={100} text={fmtSize(f.size)} />
                    </Row>
                  ))}
                  {filesLoading && <Text style={styles.dim}>Loading…</Text>}
                </View>
              </View>
            )}

            {tab === 'subtasks' && (
              <View>
                <View
                  style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}
                >
                  <Input
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={{ flex: 1, minWidth: 180 }}
                  />
                  <Input
                    label="Description"
                    value={desc}
                    onChangeText={setDesc}
                    style={{ flexBasis: '100%' }}
                    multiline
                  />
                </View>
                <Pressable
                  onPress={addSubtask}
                  style={[
                    styles.primaryBtn,
                    { alignSelf: 'flex-start', marginTop: 6 },
                  ]}
                >
                  <Text style={styles.primaryTxt}>Add Subtask</Text>
                </Pressable>

                <View style={[styles.table, { marginTop: 10 }]}>
                  <RowHead
                    cols={['Title', 'Description', 'Status']}
                    widths={[200, 260, 120]}
                  />
                  {(subsLoading ? [] : subs).map(s => (
                    <Row key={s.id} widths={[200, 260, 120]}>
                      <Cell w={200} text={s.title} />
                      <Cell w={260} text={s.description || '—'} />
                      <Cell w={120} text={s.isDone ? 'Done' : 'Open'} />
                    </Row>
                  ))}
                  {subsLoading && <Text style={styles.dim}>Loading…</Text>}
                </View>
              </View>
            )}

            {tab === 'timesheet' && (
              <View>
                <View style={styles.table}>
                  <RowHead
                    cols={[
                      'Employee',
                      'Start Time',
                      'End Time',
                      'Memo',
                      'Hours Logged',
                    ]}
                    widths={[200, 150, 150, 200, 120]}
                  />
                  {(sheetsLoading ? [] : sheets).map(s => (
                    <Row key={s.id} widths={[200, 150, 150, 200, 120]}>
                      <View
                        style={[
                          styles.cell,
                          {
                            width: 200,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                          },
                        ]}
                      >
                        {s.employees?.[0]?.profileUrl ? (
                          <Image
                            source={{ uri: s.employees[0].profileUrl }}
                            style={styles.avatar}
                          />
                        ) : (
                          <View style={[styles.avatar, styles.avatarEmpty]}>
                            <Text>👤</Text>
                          </View>
                        )}
                        <View>
                          <Text style={styles.body} numberOfLines={1}>
                            {s.employees?.[0]?.name || s.employeeId}
                          </Text>
                          <Text style={styles.dim}>Trainee</Text>
                        </View>
                      </View>
                      <Cell
                        w={150}
                        text={`${fmtDate(s.startDate)}\n${fmtTime(
                          s.startTime,
                        )}`}
                      />
                      <Cell
                        w={150}
                        text={`${fmtDate(s.endDate)}\n${fmtTime(s.endTime)}`}
                      />
                      <Cell w={200} text={s.memo || '—'} />
                      <Cell w={120} text={`${s.durationHours ?? 0}h`} />
                    </Row>
                  ))}
                  {sheetsLoading && <Text style={styles.dim}>Loading…</Text>}
                </View>
              </View>
            )}

            {tab === 'notes' && (
              <View>
                <View
                  style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}
                >
                  <Input
                    label="Title"
                    value={noteTitle}
                    onChangeText={setNoteTitle}
                    style={{ flex: 1, minWidth: 140 }}
                  />
                  <Input
                    label="Content"
                    value={noteContent}
                    onChangeText={setNoteContent}
                    style={{ flexBasis: '100%' }}
                    multiline
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 6,
                  }}
                >
                  <Pressable
                    onPress={() => setIsPublic(p => !p)}
                    style={[styles.pill, isPublic && styles.pillActive]}
                  >
                    <Text
                      style={[styles.pillTxt, isPublic && styles.pillTxtActive]}
                    >
                      {isPublic ? 'Public' : 'Private'}
                    </Text>
                  </Pressable>
                  <Pressable onPress={addNote} style={styles.primaryBtn}>
                    <Text style={styles.primaryTxt}>Add Note</Text>
                  </Pressable>
                </View>

                <View style={[styles.table, { marginTop: 10 }]}>
                  <RowHead
                    cols={['Title', 'Content', 'Visibility', 'Created At']}
                    widths={[160, 260, 110, 160]}
                  />
                  {(notesLoading ? [] : notes).map(n => (
                    <Row key={n.id} widths={[160, 260, 110, 160]}>
                      <Cell w={160} text={n.title || '—'} />
                      <Cell w={260} text={n.content} />
                      <Cell w={110} text={n.isPublic ? 'Public' : 'Private'} />
                      <Cell w={160} text={fmtDateTime(n.createdAt)} />
                    </Row>
                  ))}
                  {notesLoading && <Text style={styles.dim}>Loading…</Text>}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* small UI helpers */
const Input = ({ label, style, multiline = false, ...rest }) => (
  <View style={[{ minWidth: 160, flexBasis: 160 }, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...rest}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      style={[
        styles.input,
        multiline && { height: 88, textAlignVertical: 'top' },
      ]}
      placeholderTextColor="#9ca3af"
    />
  </View>
);

const RowHead = ({ cols, widths }) => (
  <View style={styles.trHead}>
    {cols.map((c, i) => (
      <View key={c} style={[styles.th, { width: widths[i] }]}>
        <Text style={styles.thTxt}>{c}</Text>
      </View>
    ))}
  </View>
);
const Row = ({ children }) => <View style={styles.tr}>{children}</View>;
const Cell = ({ w, text }) => (
  <View style={[styles.cell, { width: w }]}>
    <Text style={styles.body} numberOfLines={2}>
      {text}
    </Text>
  </View>
);

const fmtSize = b =>
  !b && b !== 0 ? '—' : `${(b / 1024 / 1024).toFixed(2)} MB`;
const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = t => (t ? t.slice(0, 5) : '—');
const fmtDateTime = s => (s ? new Date(s).toLocaleString() : '—');

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  close: { padding: 6 },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0b0b0c',
    flex: 1,
    paddingRight: 8,
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 6,
    paddingTop: 10,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#e0e7ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  tabTxt: { color: '#374151', fontWeight: '900' },
  tabTxtActive: { color: '#1f2937', textDecorationLine: 'underline' },

  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
  },

  primaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },

  pill: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillActive: { backgroundColor: '#111827' },
  pillTxt: { color: '#111827', fontWeight: '900' },
  pillTxtActive: { color: '#fff' },

  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  trHead: { flexDirection: 'row', backgroundColor: '#e8f0ff' },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  thTxt: { fontWeight: '900', color: '#374151' },

  tr: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#f1f5f9' },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  body: { color: '#111827' },

  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },

  dim: { color: '#6b7280', padding: 12 },
});
