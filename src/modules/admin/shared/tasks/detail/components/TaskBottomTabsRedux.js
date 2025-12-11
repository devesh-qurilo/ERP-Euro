// src/modules/admin/work/tasks/components/TaskBottomTabsRedux.jsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Linking,
  Keyboard,
  Image,
  ScrollView,
} from 'react-native';

import { pickSingleDoc } from '../../../../../../utils/filePickers';

import { useDispatch, useSelector } from 'react-redux';

import {
  setTab,
  filesFetch,
  filesUpload,
  filesDelete,
  subsFetch,
  subsCreate,
  subsUpdate,
  subsDelete,
  notesFetch,
  notesCreate,
  notesDelete,
  timesheetFetch, // ✅ NEW
} from '../store/actions';

import {
  selectTab,
  selectTaskId,
  selectFiles,
  selectFilesBusy,
  selectSubs,
  selectSubsBusy,
  selectNotes,
  selectNotesBusy,
  selectTimesheet, // ✅ NEW
  selectTimesheetBusy, // ✅ NEW
} from '../store/selectors';

/* ---------- Small UI Button Component ---------- */
const TabBtn = ({ active, title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderBottomWidth: 2,
      borderBottomColor: active ? '#6366F1' : 'transparent',
      marginRight: 12,
    }}
  >
    <Text
      style={{
        fontWeight: active ? '800' : '600',
        color: active ? '#111827' : '#6B7280',
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

/* =======================================================
    MAIN COMPONENT
======================================================= */
export default function TaskBottomTabsRedux() {
  const dispatch = useDispatch();
  const tab = useSelector(selectTab);
  const taskId = useSelector(selectTaskId);

  const files = useSelector(selectFiles);
  const filesBusy = useSelector(selectFilesBusy);

  const subs = useSelector(selectSubs);
  const subsBusy = useSelector(selectSubsBusy);

  const notes = useSelector(selectNotes);
  const notesBusy = useSelector(selectNotesBusy);

  const timesheet = useSelector(selectTimesheet); // ✅ NEW
  const timesheetBusy = useSelector(selectTimesheetBusy); // ✅ NEW

  /* ---------- Auto fetch on tab switch ---------- */
  useEffect(() => {
    if (!taskId) return;

    if (tab === 'files') dispatch(filesFetch());
    if (tab === 'sub') dispatch(subsFetch());
    if (tab === 'notes') dispatch(notesFetch());
    if (tab === 'timesheet') dispatch(timesheetFetch()); // ✅ NEW
  }, [tab, taskId]);

  /* ---------- If no task selected ---------- */
  if (!taskId) {
    return (
      <View
        style={{
          marginTop: 14,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          padding: 14,
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ fontWeight: '700' }}>Task Tools</Text>
        <Text style={{ color: '#6B7280', marginTop: 6 }}>
          Select a task from table to manage Files, Sub Tasks, Timesheet &
          Notes.
        </Text>
      </View>
    );
  }

  /* =======================================================
        RENDER TABS + CONTENT
  ======================================================= */

  return (
    <View
      style={{
        marginTop: 14,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#fff',
      }}
    >
      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingTop: 10 }}>
        <TabBtn
          title="Files"
          active={tab === 'files'}
          onPress={() => dispatch(setTab('files'))}
        />
        <TabBtn
          title="Sub Task"
          active={tab === 'sub'}
          onPress={() => dispatch(setTab('sub'))}
        />
        <TabBtn
          title="Timesheet"
          active={tab === 'timesheet'}
          onPress={() => dispatch(setTab('timesheet'))}
        />
        <TabBtn
          title="Notes"
          active={tab === 'notes'}
          onPress={() => dispatch(setTab('notes'))}
        />
      </View>

      {/* CONTENT */}
      <View style={{ padding: 14 }}>
        {/* ---------------- FILES TAB ---------------- */}
        {tab === 'files' && (
          <View>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const picked = await pickSingleDoc({});
                  if (!picked) return;

                  dispatch(filesUpload(picked));
                } catch (e) {
                  Alert.alert('Upload failed', e?.message || '');
                }
              }}
              style={{ marginBottom: 12 }}
            >
              <Text style={{ color: '#2563EB', fontWeight: '700' }}>
                ＋ Upload File
              </Text>
            </TouchableOpacity>

            <FlatList
              refreshing={filesBusy}
              onRefresh={() => dispatch(filesFetch())}
              data={files}
              keyExtractor={it => String(it.id)}
              renderItem={({ item }) => (
                <View style={rowCard}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ fontWeight: '600' }}>{item.filename}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                      <Text style={{ color: '#2563EB' }}>Open</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => dispatch(filesDelete(item.id))}
                  >
                    <Text style={{ color: '#DC2626', fontWeight: '700' }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: '#6B7280' }}>No files yet.</Text>
              }
            />
          </View>
        )}

        {/* ---------------- SUB TASK TAB ---------------- */}
        {tab === 'sub' && (
          <SubEditor
            items={subs}
            busy={subsBusy}
            onRefresh={() => dispatch(subsFetch())}
            onCreate={p => dispatch(subsCreate(p))}
            onUpdate={(id, p) => dispatch(subsUpdate(id, p))}
            onDelete={id => dispatch(subsDelete(id))}
          />
        )}

        {/* ---------------- TIMESHEET TAB (NEW) ---------------- */}
        {tab === 'timesheet' && (
          <TimesheetTable
            items={timesheet}
            busy={timesheetBusy}
            onRefresh={() => dispatch(timesheetFetch())}
          />
        )}

        {/* ---------------- NOTES TAB ---------------- */}
        {tab === 'notes' && (
          <NotesEditor
            items={notes}
            busy={notesBusy}
            onRefresh={() => dispatch(notesFetch())}
            onCreate={p => dispatch(notesCreate(p))}
            onDelete={id => dispatch(notesDelete(id))}
          />
        )}
      </View>
    </View>
  );
}

/* =======================================================
    TIMESHEET COMPONENT
======================================================= */
// function TimesheetTable({ items, busy, onRefresh }) {
//   return (
//     <FlatList
//       refreshing={busy}
//       onRefresh={onRefresh}
//       data={items}
//       keyExtractor={it => String(it.id)}
//       renderItem={({ item }) => (
//         <View style={rowCard}>
//           <Text style={{ fontWeight: '700' }}>
//             {item.projectShortCode} / {item.taskName}
//           </Text>

//           {/* Employee details */}
//           <View style={{ marginTop: 6 }}>
//             {item.employees?.map(emp => (
//               <View
//                 key={emp.employeeId}
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   marginBottom: 6,
//                 }}
//               >
//                 <Image
//                   source={{ uri: emp.profileUrl }}
//                   style={{
//                     width: 26,
//                     height: 26,
//                     borderRadius: 13,
//                     marginRight: 8,
//                   }}
//                 />
//                 <Text>{emp.name}</Text>
//               </View>
//             ))}
//           </View>

//           <Text style={{ marginTop: 6, color: '#6B7280' }}>
//             Start: {item.startDate} {item.startTime}
//           </Text>
//           <Text style={{ color: '#6B7280' }}>
//             End: {item.endDate} {item.endTime}
//           </Text>

//           <Text style={{ marginTop: 6, fontWeight: '700' }}>
//             Duration: {item.durationHours} hrs
//           </Text>

//           {!!item.memo && (
//             <Text style={{ marginTop: 6, color: '#374151' }}>
//               Memo: {item.memo}
//             </Text>
//           )}
//         </View>
//       )}
//       ListEmptyComponent={
//         <Text style={{ color: '#6B7280' }}>No timesheet entries.</Text>
//       }
//     />
//   );
// }

function TimesheetTable({ items, busy, onRefresh }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={{ minWidth: 100 }}>
        {/* HEADER */}
        <View style={headerRow}>
          <Text style={[cell, headerTxt, { width: 140 }]}>Employee</Text>
          <Text style={[cell, headerTxt, { width: 200 }]}>Project</Text>
          <Text style={[cell, headerTxt, { width: 160 }]}>Start</Text>
          <Text style={[cell, headerTxt, { width: 160 }]}>End</Text>
          <Text style={[cell, headerTxt, { width: 100 }]}>Hours</Text>
          <Text style={[cell, headerTxt, { width: 200 }]}>Memo</Text>
        </View>

        {/* BODY */}
        <FlatList
          style={{ height: 400 }}
          refreshing={busy}
          onRefresh={onRefresh}
          data={items}
          keyExtractor={it => String(it.id)}
          renderItem={({ item }) => <TimesheetRow item={item} />}
          ListEmptyComponent={
            <Text style={{ padding: 10, color: '#6B7280' }}>
              No timesheet entries.
            </Text>
          }
        />
      </View>
    </ScrollView>
  );
}

/* ---------------- ROW ---------------- */
function TimesheetRow({ item }) {
  const emp = item.employees?.[0];

  return (
    <View style={row}>
      <View
        style={[
          cell,
          { width: 140, flexDirection: 'row', alignItems: 'center' },
        ]}
      >
        <Image
          source={{ uri: emp?.profileUrl }}
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: '#E5E7EB',
            marginRight: 8,
          }}
        />
        <Text>{emp?.name}</Text>
      </View>

      <Text style={[cell, { width: 200 }]}>
        {item.projectShortCode} - {item.projectName}
      </Text>

      <Text style={[cell, { width: 160 }]}>
        {item.startDate} {item.startTime}
      </Text>

      <Text style={[cell, { width: 160 }]}>
        {item.endDate} {item.endTime}
      </Text>

      <Text style={[cell, { width: 100 }]}>{item.durationHours} hrs</Text>

      <Text style={[cell, { width: 200 }]} numberOfLines={1}>
        {item.memo || '—'}
      </Text>
    </View>
  );
}

/* ---------------- ROW ITEM ---------------- */
// function TimesheetRow({ item }) {
//   const emp = item.employees?.[0];

//   return (
//     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//       <View style={row}>
//         <View
//           style={[
//             cell,
//             { minWidth: 120, flexDirection: 'row', alignItems: 'center' },
//           ]}
//         >
//           <Image
//             source={{ uri: emp?.profileUrl }}
//             style={{
//               width: 26,
//               height: 26,
//               borderRadius: 13,
//               backgroundColor: '#E5E7EB',
//               marginRight: 8,
//             }}
//           />
//           <Text>{emp?.name}</Text>
//         </View>

//         <Text style={[cell, { minWidth: 160 }]}>
//           {item.projectShortCode} - {item.projectName}
//         </Text>

//         <Text style={[cell, { minWidth: 140 }]}>
//           {item.startDate} {item.startTime}
//         </Text>

//         <Text style={[cell, { minWidth: 140 }]}>
//           {item.endDate} {item.endTime}
//         </Text>

//         <Text style={[cell, { minWidth: 100 }]}>{item.durationHours} hrs</Text>

//         <Text style={[cell, { minWidth: 200 }]} numberOfLines={1}>
//           {item.memo || '—'}
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

/* =======================================================
    SUBTASK EDITOR COMPONENT
======================================================= */
function SubEditor({ items, busy, onRefresh, onCreate, onUpdate, onDelete }) {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [edit, setEdit] = React.useState(null);

  const handleSave = () => {
    Keyboard.dismiss(); // Close keyboard
    if (!title.trim()) return;
    onCreate({ title, description: desc });
    setTitle('');
    setDesc('');
    onRefresh();
  };

  return (
    <View>
      {/* CREATE MODE */}
      {!edit ? (
        <View style={{ marginBottom: 12 }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            style={input}
          />
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Description"
            style={[input, { height: 80, marginTop: 8 }]}
            multiline
          />
          <TouchableOpacity onPress={handleSave} style={btn}>
            <Text style={btnTxt}>Add Sub Task</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* EDIT MODE */
        <View style={{ marginBottom: 12 }}>
          <TextInput
            value={edit.title}
            onChangeText={t => setEdit({ ...edit, title: t })}
            placeholder="Title"
            style={input}
          />
          <TextInput
            value={edit.description}
            onChangeText={t => setEdit({ ...edit, description: t })}
            placeholder="Description"
            style={[input, { height: 80, marginTop: 8 }]}
            multiline
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                if (!edit.title.trim()) return;
                onUpdate(edit.id, {
                  title: edit.title,
                  description: edit.description,
                });
                setEdit(null);
                onRefresh();
              }}
              style={btn}
            >
              <Text style={btnTxt}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEdit(null)} style={btnGhost}>
              <Text style={btnGhostTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        refreshing={busy}
        onRefresh={onRefresh}
        data={items}
        keyExtractor={it => String(it.id)}
        renderItem={({ item }) => (
          <View style={rowCard}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontWeight: '700' }}>{item.title}</Text>
              <Text style={{ color: '#6B7280', marginTop: 2 }}>
                {item.description || '—'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 14 }}>
              <TouchableOpacity
                onPress={() =>
                  setEdit({
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                  })
                }
              >
                <Text style={{ fontWeight: '700' }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Text style={{ color: '#DC2626', fontWeight: '700' }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#6B7280' }}>No subtasks yet.</Text>
        }
      />
    </View>
  );
}

/* =======================================================
    NOTES EDITOR COMPONENT
======================================================= */
function NotesEditor({ items, busy, onRefresh, onCreate, onDelete }) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(true);

  const handleSave = () => {
    Keyboard.dismiss();
    if (!title.trim()) return;
    onCreate({ title, content, isPublic });
    setTitle('');
    setContent('');
    onRefresh();
  };

  return (
    <View>
      <View style={{ marginBottom: 12 }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          style={input}
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Content"
          style={[input, { height: 80, marginTop: 8 }]}
          multiline
        />

        <TouchableOpacity
          onPress={() => setIsPublic(!isPublic)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#9CA3AF',
              marginRight: 8,
              backgroundColor: isPublic ? '#2563EB' : 'transparent',
            }}
          />
          <Text>Public</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} style={[btn, { marginTop: 8 }]}>
          <Text style={btnTxt}>Add Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        refreshing={busy}
        onRefresh={onRefresh}
        data={items}
        keyExtractor={it => String(it.id)}
        renderItem={({ item }) => (
          <View style={rowCard}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontWeight: '700' }}>{item.title}</Text>
              <Text style={{ color: '#6B7280', marginTop: 2 }}>
                {item.content}
              </Text>
              <Text style={{ color: '#6B7280', marginTop: 2 }}>
                Public: {item.isPublic ? 'Yes' : 'No'}
              </Text>
            </View>

            <TouchableOpacity onPress={() => onDelete(item.id)}>
              <Text style={{ color: '#DC2626', fontWeight: '700' }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#6B7280' }}>No notes yet.</Text>
        }
      />
    </View>
  );
}

/* =======================================================
    SHARED STYLE OBJECTS
======================================================= */
const input = {
  height: 40,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 10,
  backgroundColor: '#fff',
};

const btn = {
  backgroundColor: '#2563EB',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 8,
  alignSelf: 'flex-start',
};

const btnTxt = { color: '#fff', fontWeight: '800' };

const btnGhost = {
  backgroundColor: '#E5E7EB',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 8,
  alignSelf: 'flex-start',
};

const btnGhostTxt = { color: '#111827', fontWeight: '800' };

const rowCard = {
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 10,
  padding: 10,
  marginBottom: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const headerRow = {
  flexDirection: 'row',
  backgroundColor: '#F3F4F6',
  borderBottomWidth: 1,
  borderColor: '#E5E7EB',
  paddingVertical: 10,
};

const row = {
  flexDirection: 'row',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderColor: '#E5E7EB',
  backgroundColor: '#fff',
};

const cell = {
  paddingHorizontal: 10,
  justifyContent: 'center',
};

const headerTxt = {
  fontWeight: '700',
  color: '#374151',
};
