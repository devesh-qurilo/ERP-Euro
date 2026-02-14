import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOne } from '../../deals/store/actions';
import { selectDealOne } from '../../deals/store/selectors';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  fetchDocs,
  uploadDoc,
  fetchFollowups,
  addFollowup,
  updateFollowup,
  fetchNotes,
  addNote,
  updateNote,
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  fetchTags,
  addTag,
  deleteTag,
} from '../../deals/view/store/actions';
import {
  selectDealDocs,
  selectDealFollowups,
  selectDealNotes,
  selectDealComments,
  selectDealTags,
  selectDealTabsBusy,
} from '../../deals/view/store/selectors';
import DocumentPicker, { types } from '@react-native-documents/picker';
import { Linking } from 'react-native';

export default function AdminDealViewScreen({ route }) {
  const { dealId } = route.params || {};
  const dispatch = useDispatch();

  const deal = useSelector(selectDealOne);
  const busy = useSelector(selectDealTabsBusy);

  // tabs
  const tabs = [
    'documents',
    'Follow up',
    'People',
    'Notes',
    'Comments',
    'Tags',
  ];
  const [active, setActive] = useState('documents');

  useEffect(() => {
    if (!dealId) return;

    dispatch(fetchOne(dealId));
  }, [dealId]);

  useEffect(() => {
    if (!dealId) return;

    if (active === 'documents') dispatch(fetchDocs(dealId));
    if (active === 'Follow up') dispatch(fetchFollowups(dealId));
    if (active === 'Notes') dispatch(fetchNotes(dealId));
    if (active === 'Comments') dispatch(fetchComments(dealId));
    if (active === 'Tags') dispatch(fetchTags(dealId));
  }, [active, dealId]);

  if (!deal) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      {/* Top: deal info card */}
      <View
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>
          Deal Information
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: '600' }}>Sales Pipeline →</Text>
          <Text style={{ fontWeight: '600' }}>{deal.dealStage}</Text>
        </View>
        <InfoRow label="Deal Name" value={deal.title} />
        <InfoRow
          label="Lead Contact"
          value={deal.dealAgentMeta?.name || '--'}
        />
        <InfoRow label="Email" value="--" />
        <InfoRow label="Company Name" value="--" />
        <InfoRow label="Deal Category" value={deal.dealCategory || '--'} />
        <InfoRow
          label="Deal Agent"
          value={deal.dealAgentMeta?.name || deal.dealAgent}
        />
        <InfoRow
          label="Deal Watcher"
          value={
            (deal.dealWatchersMeta || []).map(w => w.name).join(', ') || '--'
          }
        />
        <InfoRow label="Close Date" value={deal.expectedCloseDate || '--'} />
        <InfoRow
          label="Deal Value"
          value={
            deal.value != null
              ? `₹${Number(deal.value).toLocaleString()}`
              : '--'
          }
        />
      </View>

      {/* Tabs header */}
      <View style={{ borderWidth: 1, borderRadius: 12, paddingTop: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 16,
            paddingHorizontal: 12,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          {tabs.map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setActive(t)}
              style={{
                paddingVertical: 8,
                borderBottomWidth: active === t ? 2 : 0,
              }}
            >
              <Text style={{ fontWeight: active === t ? '700' : '500' }}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ borderTopWidth: 1, padding: 12 }}>
          {busy && <ActivityIndicator />}

          {active === 'documents' && <DocumentsTab dealId={dealId} />}

          {active === 'Follow up' && <FollowupsTab dealId={dealId} />}

          {active === 'People' && <PeopleTab deal={deal} />}

          {active === 'Notes' && <NotesTab dealId={dealId} />}

          {active === 'Comments' && <CommentsTab dealId={dealId} />}

          {active === 'Tags' && <TagsTab dealId={dealId} />}
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 6 }}>
      <Text style={{ width: 150, color: '#555' }}>{label}</Text>
      <Text style={{ fontWeight: '500' }}>{String(value ?? '--')}</Text>
    </View>
  );
}

/* ---------------------- Documents ---------------------- */
function DocumentsTab({ dealId }) {
  const dispatch = useDispatch();
  const list = useSelector(selectDealDocs);

  const pickAndUpload = async () => {
    try {
      // single file
      const res = await DocumentPicker.pickSingle({
        type: [types.allFiles], // or types.images if you want only images
        mode: 'open',
        copyTo: 'documentDirectory', // ensures we get a file path we can read
      });

      // @react-native-documents/picker returns:
      // { uri, name, size, type, fileCopyUri (if copyTo used) }
      const uri = res.fileCopyUri || res.uri;

      const file = {
        uri,
        name: res.name || 'upload.bin',
        type: res.type || 'application/octet-stream',
      };

      dispatch(uploadDoc(dealId, file));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // user cancelled — ignore
      } else {
        console.warn('Document pick error:', err);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickAndUpload} style={{ marginBottom: 10 }}>
        <Text style={{ color: '#3F6AE1' }}>+ Upload File</Text>
      </TouchableOpacity>

      {list.map(doc => (
        <TouchableOpacity
          key={doc.id}
          onPress={() => Linking.openURL(doc.url)}
          style={{ paddingVertical: 8, borderBottomWidth: 1 }}
        >
          <Text>{doc.filename}</Text>
          <Text style={{ color: '#777', fontSize: 12 }}>{doc.uploadedAt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ---------------------- Follow ups ---------------------- */
function FollowupsTab({ dealId }) {
  const dispatch = useDispatch();
  const list = useSelector(selectDealFollowups);
  const [f, setF] = useState({
    nextDate: null, // Date
    startTime: null, // Date
    remarks: '',
    sendReminder: true,
    remindBefore: 1,
    remindUnit: 'DAYS',
  });
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  // const onCreate = () => dispatch(addFollowup(dealId, f));
  const onCreate = () => {
    if (!f.nextDate || !f.startTime) return;

    dispatch(
      addFollowup(dealId, {
        ...f,
        nextDate: f.nextDate.toISOString().slice(0, 10),
        startTime: f.startTime.toTimeString().slice(0, 5), // HH:mm
      }),
    );
  };

  return (
    <View>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Add Follow up</Text>
      {/* NEXT DATE */}
      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Next Date</Text>
      <Pressable style={styles.input} onPress={() => setShowDate(true)}>
        <Text>
          {f.nextDate ? f.nextDate.toISOString().slice(0, 10) : 'Select date'}
        </Text>
      </Pressable>

      {showDate && (
        <DateTimePicker
          value={f.nextDate || new Date()}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowDate(false);
            if (d) setF({ ...f, nextDate: d });
          }}
        />
      )}

      {/* START TIME */}
      <Text style={{ fontWeight: '600', marginBottom: 4, marginTop: 8 }}>
        Start Time
      </Text>
      <Pressable style={styles.input} onPress={() => setShowTime(true)}>
        <Text>
          {f.startTime
            ? f.startTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Select time'}
        </Text>
      </Pressable>

      {showTime && (
        <DateTimePicker
          value={f.startTime || new Date()}
          mode="time"
          display="default"
          onChange={(_, t) => {
            setShowTime(false);
            if (t) setF({ ...f, startTime: t });
          }}
        />
      )}

      {/* <Field
        label="Next Date"
        value={f.nextDate}
        onChange={v => setF({ ...f, nextDate: v })}
        placeholder="YYYY-MM-DD"
      />
      <Field
        label="Start Time"
        value={f.startTime}
        onChange={v => setF({ ...f, startTime: v })}
        placeholder="HH:mm"
      /> */}
      <Field
        label="Remarks"
        value={f.remarks}
        onChange={v => setF({ ...f, remarks: v })}
      />
      <Field
        label="Remind Before"
        value={String(f.remindBefore)}
        onChange={v => setF({ ...f, remindBefore: Number(v) || 0 })}
        keyboardType="numeric"
      />
      <Field
        label="Remind Unit"
        value={f.remindUnit}
        onChange={v => setF({ ...f, remindUnit: v })}
      />
      <TouchableOpacity
        onPress={onCreate}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#3F6AE1',
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff' }}>Save</Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>All Follow ups</Text>
      {list.map(it => (
        <View key={it.id} style={{ paddingVertical: 8, borderBottomWidth: 1 }}>
          <Text>
            {it.nextDate} {it.startTime} • {it.status}
          </Text>
          <Text style={{ color: '#777' }}>{it.remarks}</Text>
          {/* example inline update */}
          {/* <TouchableOpacity onPress={()=>dispatch(updateFollowup(dealId, it.id, { ...it, status:'CANCELLED' }))}>
            <Text style={{ color:'#3F6AE1' }}>Mark Cancelled</Text>
          </TouchableOpacity> */}
        </View>
      ))}
    </View>
  );
}

/* ---------------------- People ---------------------- */
function PeopleTab({ deal }) {
  const rows = [
    ...(deal.assignedEmployeesMeta || []),
    ...(deal.dealWatchersMeta || []),
    deal.dealAgentMeta ? [deal.dealAgentMeta] : [],
  ]
    .flat()
    .filter(Boolean);

  return (
    <View>
      {rows.map((p, idx) => (
        <View
          key={`${p.employeeId}-${idx}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
          }}
        >
          {p.profileUrl ? (
            <Image
              source={{ uri: p.profileUrl }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 10,
              }}
            />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600' }}>{p.name}</Text>
            <Text style={{ color: '#777', fontSize: 12 }}>
              {p.employeeId} • {p.designation || '--'} • {p.department || '--'}
            </Text>
          </View>
        </View>
      ))}
      {rows.length === 0 && <Text>No people linked.</Text>}
    </View>
  );
}

/* ---------------------- Notes ---------------------- */
function NotesTab({ dealId }) {
  const dispatch = useDispatch();
  const notes = useSelector(selectDealNotes);
  const [form, setForm] = useState({
    noteTitle: '',
    noteType: 'PUBLIC',
    noteDetails: '',
  });

  const onCreate = () => dispatch(addNote(dealId, form));

  return (
    <View>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Add Note</Text>
      <Field
        label="Title"
        value={form.noteTitle}
        onChange={v => setForm({ ...form, noteTitle: v })}
      />
      <Field
        label="Type"
        value={form.noteType}
        onChange={v => setForm({ ...form, noteType: v })}
        placeholder="PUBLIC/PRIVATE"
      />
      <Field
        label="Details"
        value={form.noteDetails}
        onChange={v => setForm({ ...form, noteDetails: v })}
        multiline
      />
      <TouchableOpacity
        onPress={onCreate}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#3F6AE1',
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff' }}>Save</Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>All Notes</Text>
      {notes.map(n => (
        <View key={n.id} style={{ paddingVertical: 8, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: '600' }}>
            {n.noteTitle} <Text style={{ color: '#777' }}>({n.noteType})</Text>
          </Text>
          <Text style={{ color: '#555' }}>{n.noteDetails}</Text>
        </View>
      ))}
    </View>
  );
}

/* ---------------------- Comments ---------------------- */
function CommentsTab({ dealId }) {
  const dispatch = useDispatch();
  const comments = useSelector(selectDealComments);

  const [text, setText] = useState('');
  const onAdd = () => {
    if (!text.trim()) return;
    dispatch(addComment(dealId, { commentText: text }));
    setText('');
  };

  return (
    <View>
      <TextInput
        placeholder="Write a comment..."
        value={text}
        onChangeText={setText}
        style={{ borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 }}
      />
      <TouchableOpacity
        onPress={onAdd}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#3F6AE1',
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff' }}>Post</Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />
      {comments.map(c => (
        <View key={c.id} style={{ paddingVertical: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: '600' }}>{c.employeeId}</Text>
          <Text style={{ color: '#333' }}>{c.commentText}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
            <TouchableOpacity
              onPress={() =>
                dispatch(
                  updateComment(dealId, c.id, {
                    commentText: c.commentText + ' (edited)',
                  }),
                )
              }
            >
              <Text style={{ color: '#3F6AE1' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dispatch(deleteComment(dealId, c.id))}
            >
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------------- Tags ---------------------- */
function TagsTab({ dealId }) {
  const dispatch = useDispatch();
  const tags = useSelector(selectDealTags);
  const [tag, setTag] = useState('');

  const onAdd = () => {
    if (!tag.trim()) return;
    dispatch(addTag(dealId, { tagName: tag.trim() }));
    setTag('');
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <TextInput
          placeholder="New tag"
          value={tag}
          onChangeText={setTag}
          style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}
        />
        <TouchableOpacity
          onPress={onAdd}
          style={{ backgroundColor: '#3F6AE1', padding: 8, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {(tags || []).map((t, idx) => (
          <View
            key={`${t}-${idx}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 16,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text>{String(t)}</Text>
            <TouchableOpacity
              onPress={() => dispatch(deleteTag(dealId, idx + 1))}
              style={{ marginLeft: 6 }}
            >
              <Text style={{ color: 'red' }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ---------------------- Helpers ---------------------- */
function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  multiline,
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      {label ? (
        <Text style={{ color: '#555', marginBottom: 4 }}>{label}</Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={!!multiline}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          minHeight: multiline ? 80 : undefined,
        }}
      />
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
};
