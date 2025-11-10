import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import * as DocumentPicker from '@react-native-documents/picker';
import { taskFilesAPI, subtasksAPI, notesAPI } from '@/services/api';

const TabBtn = ({ active, title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingVertical: 10,
      paddingHorizontal: 16,
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

export default function TaskBottomTabs({ taskId }) {
  const [tab, setTab] = useState('files'); // files | sub | timesheet | notes
  const [files, setFiles] = useState([]);
  const [subs, setSubs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [busy, setBusy] = useState(false);

  const loadFiles = async () => {
    setBusy(true);
    try {
      setFiles(await taskFilesAPI.list(taskId));
    } finally {
      setBusy(false);
    }
  };
  const loadSubs = async () => {
    setBusy(true);
    try {
      setSubs(await subtasksAPI.list(taskId));
    } finally {
      setBusy(false);
    }
  };
  const loadNotes = async () => {
    setBusy(true);
    try {
      setNotes(await notesAPI.list(taskId));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!taskId) return;
    if (tab === 'files') loadFiles();
    if (tab === 'sub') loadSubs();
    if (tab === 'notes') loadNotes();
  }, [taskId, tab]);

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
        <Text style={{ fontWeight: '700', marginBottom: 6 }}>Task Details</Text>
        <Text style={{ color: '#6B7280' }}>
          Select a task to manage Files, Sub Tasks, Timesheet and Notes.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#fff',
      }}
    >
      {/* Tabs */}
      <View
        style={{ flexDirection: 'row', paddingHorizontal: 12, paddingTop: 10 }}
      >
        <TabBtn
          title="Files"
          active={tab === 'files'}
          onPress={() => setTab('files')}
        />
        <TabBtn
          title="Sub Task"
          active={tab === 'sub'}
          onPress={() => setTab('sub')}
        />
        <TabBtn
          title="Timesheet"
          active={tab === 'timesheet'}
          onPress={() => setTab('timesheet')}
        />
        <TabBtn
          title="Notes"
          active={tab === 'notes'}
          onPress={() => setTab('notes')}
        />
      </View>

      <View style={{ padding: 14 }}>
        {tab === 'files' && (
          <FilesTab
            busy={busy}
            files={files}
            onRefresh={loadFiles}
            onUpload={async () => {
              try {
                const picked = await DocumentPicker.pickSingle({
                  copyTo: 'documentDirectory',
                });
                const file = {
                  uri: picked.fileCopyUri || picked.uri,
                  name: picked.name,
                  type: picked.type || 'application/octet-stream',
                };
                await taskFilesAPI.upload(taskId, file);
                await loadFiles();
              } catch (e) {
                if (!DocumentPicker.isCancel(e))
                  Alert.alert('Upload failed', e?.message || '');
              }
            }}
            onDelete={async id => {
              await taskFilesAPI.remove(id);
              await loadFiles();
            }}
          />
        )}

        {tab === 'sub' && (
          <SubtasksTab
            busy={busy}
            items={subs}
            onRefresh={loadSubs}
            onCreate={async payload => {
              await subtasksAPI.create(taskId, payload);
              await loadSubs();
            }}
            onUpdate={async (subId, payload) => {
              await subtasksAPI.update(taskId, subId, payload);
              await loadSubs();
            }}
            onDelete={async subId => {
              await subtasksAPI.remove(taskId, subId);
              await loadSubs();
            }}
          />
        )}

        {tab === 'timesheet' && (
          <View>
            <Text style={{ color: '#6B7280' }}>
              Timesheet is a separate module. We’ll plug it here later.
            </Text>
          </View>
        )}

        {tab === 'notes' && (
          <NotesTab
            busy={busy}
            items={notes}
            onRefresh={loadNotes}
            onCreate={async payload => {
              await notesAPI.create(taskId, payload);
              await loadNotes();
            }}
            onDelete={async taskNoteId => {
              await notesAPI.removeByTaskNoteId(taskNoteId);
              await loadNotes();
            }}
          />
        )}
      </View>
    </View>
  );
}

/* ---------- Files tab ---------- */
function FilesTab({ files, busy, onUpload, onDelete, onRefresh }) {
  return (
    <View>
      <TouchableOpacity
        onPress={onUpload}
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
      >
        <Text style={{ color: '#2563EB', fontWeight: '700' }}>
          ＋ Upload File
        </Text>
      </TouchableOpacity>

      <FlatList
        refreshing={busy}
        onRefresh={onRefresh}
        data={files}
        keyExtractor={it => String(it.id)}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 10,
              padding: 10,
              marginBottom: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontWeight: '600' }}>{item.filename}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                <Text style={{ color: '#2563EB' }}>Open</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => onDelete(item.id)}>
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
  );
}

/* ---------- Subtasks tab ---------- */
function SubtasksTab({ items, busy, onRefresh, onCreate, onUpdate, onDelete }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [edit, setEdit] = useState(null); // {id, title, description}

  const submit = async () => {
    if (!title.trim()) return Alert.alert('Enter title');
    await onCreate({ title, description: desc });
    setTitle('');
    setDesc('');
  };

  const saveEdit = async () => {
    if (!edit?.title?.trim()) return Alert.alert('Enter title');
    await onUpdate(edit.id, {
      title: edit.title,
      description: edit.description,
    });
    setEdit(null);
  };

  return (
    <View>
      {/* add form */}
      {!edit && (
        <View style={{ marginBottom: 12 }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            style={inputStyle}
          />
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Description"
            style={[inputStyle, { height: 80, marginTop: 8 }]}
            multiline
          />
          <TouchableOpacity onPress={submit} style={primaryBtn}>
            <Text style={primaryBtnTxt}>Add Sub Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* edit form */}
      {edit && (
        <View style={{ marginBottom: 12 }}>
          <TextInput
            value={edit.title}
            onChangeText={t => setEdit({ ...edit, title: t })}
            placeholder="Title"
            style={inputStyle}
          />
          <TextInput
            value={edit.description}
            onChangeText={t => setEdit({ ...edit, description: t })}
            placeholder="Description"
            style={[inputStyle, { height: 80, marginTop: 8 }]}
            multiline
          />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={saveEdit} style={primaryBtn}>
              <Text style={primaryBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEdit(null)} style={ghostBtn}>
              <Text style={ghostBtnTxt}>Cancel</Text>
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
                <Text style={{ color: '#111827', fontWeight: '700' }}>
                  Edit
                </Text>
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

/* ---------- Notes tab ---------- */
function NotesTab({ items, busy, onRefresh, onCreate, onDelete }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const add = async () => {
    if (!title.trim()) return Alert.alert('Enter title');
    await onCreate({ title, content, isPublic });
    setTitle('');
    setContent('');
  };

  return (
    <View>
      <View style={{ marginBottom: 12 }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          style={inputStyle}
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Content"
          style={[inputStyle, { height: 80, marginTop: 8 }]}
          multiline
        />
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}
        >
          <TouchableOpacity
            onPress={() => setIsPublic(!isPublic)}
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
        </View>
        <TouchableOpacity onPress={add} style={[primaryBtn, { marginTop: 8 }]}>
          <Text style={primaryBtnTxt}>Add Note</Text>
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

/* styles */
const inputStyle = {
  height: 40,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 10,
  backgroundColor: '#fff',
};
const primaryBtn = {
  backgroundColor: '#2563EB',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 8,
  alignSelf: 'flex-start',
};
const primaryBtnTxt = { color: '#fff', fontWeight: '800' };
const ghostBtn = {
  backgroundColor: '#E5E7EB',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 8,
  alignSelf: 'flex-start',
};
const ghostBtnTxt = { color: '#111827', fontWeight: '800' };
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
