import React, { useEffect } from 'react';
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
} from '../store/selectors';

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

  useEffect(() => {
    if (!taskId) return;
    if (tab === 'files') dispatch(filesFetch());
    if (tab === 'sub') dispatch(subsFetch());
    if (tab === 'notes') dispatch(notesFetch());
  }, [tab, taskId, dispatch]);

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
          Select a task from table to manage Files, Sub Tasks, Timesheet, and
          Notes.
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
      <View
        style={{ flexDirection: 'row', paddingHorizontal: 12, paddingTop: 10 }}
      >
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

      <View style={{ padding: 14 }}>
        {tab === 'files' && (
          <View>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const picked = await DocumentPicker.pickSingle({
                    copyTo: 'documentDirectory',
                  });
                  const file = {
                    uri: picked.fileCopyUri || picked.uri,
                    name: picked.name,
                    type: picked.type || 'application/octet-stream',
                  };
                  dispatch(filesUpload(file));
                } catch (e) {
                  if (!DocumentPicker.isCancel(e))
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

        {tab === 'timesheet' && (
          <Text style={{ color: '#6B7280' }}>
            Timesheet is a separate module. We’ll plug it here later.
          </Text>
        )}

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

/* Small editors (local UI only) */
function SubEditor({ items, busy, onRefresh, onCreate, onUpdate, onDelete }) {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [edit, setEdit] = React.useState(null);

  return (
    <View>
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
          <TouchableOpacity
            onPress={() => {
              if (!title.trim()) return;
              onCreate({ title, description: desc });
              setTitle('');
              setDesc('');
            }}
            style={btn}
          >
            <Text style={btnTxt}>Add Sub Task</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
                if (!edit.title.trim()) return;
                onUpdate(edit.id, {
                  title: edit.title,
                  description: edit.description,
                });
                setEdit(null);
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

function NotesEditor({ items, busy, onRefresh, onCreate, onDelete }) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(true);

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
        <TouchableOpacity
          onPress={() => {
            if (!title.trim()) return;
            onCreate({ title, content, isPublic });
            setTitle('');
            setContent('');
          }}
          style={[btn, { marginTop: 8 }]}
        >
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

/* styles */
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
