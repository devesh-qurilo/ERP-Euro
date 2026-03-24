import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import FilesTable from './components/FilesTable';
import FileUploadModal from './components/FileUploadModal';

import {
  listByProject,
  openUpload,
  closeUpload,
  uploadFile,
  deleteFile,
} from './store/actions';
import {
  selectProjectFiles,
  selectProjectFilesBusy,
  selectProjectFilesError,
  selectProjectFilesUploadOpen,
  selectProjectFilesUploadBusy,
  selectProjectFilesUploadPreset,
  selectProjectFilesBusyIds,
} from './store/selectors';

export default function ProjectFilesTab() {
  const route = useRoute();
  const dispatch = useDispatch();

  const projectId =
    route?.params?.projectId || route?.params?.project?.id || route?.params?.id;

  const rows = useSelector(selectProjectFiles);
  const loading = useSelector(selectProjectFilesBusy);
  const error = useSelector(selectProjectFilesError);
  const uploadOpen = useSelector(selectProjectFilesUploadOpen);
  const uploadBusy = useSelector(selectProjectFilesUploadBusy);
  const preset = useSelector(selectProjectFilesUploadPreset);
  const busyIds = useSelector(selectProjectFilesBusyIds);

  const [q, setQ] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (projectId) dispatch(listByProject(projectId));
    }, [dispatch, projectId]),
  );

  console.log('list of project');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r =>
      `${r.filename} ${r.mimeType || ''} ${r.uploadedBy || ''} ${
        r.taskId || ''
      }`
        .toLowerCase()
        .includes(s),
    );
  }, [rows, q]);

  const onDelete = row =>
    Alert.alert('Delete file?', row.filename, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteFile(row.id, projectId)),
      },
    ]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 12, gap: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Filters */}
      <View style={s.card}>
        <Text style={s.title}>Filters</Text>
        <Text style={s.label}>Search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="filename, mime, uploadedBy, taskId…"
          placeholderTextColor="#9ca3af"
          style={s.input}
        />
        {!!error && (
          <Text style={{ color: '#b91c1c', marginTop: 8 }}>
            {String(error)}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View
        style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}
      >
        <Pressable
          style={[s.btn, s.primary]}
          onPress={() => dispatch(openUpload({ projectId }))}
        >
          <Text style={[s.btnTxt, { color: '#fff' }]}>+ Upload File</Text>
        </Pressable>
      </View>

      {/* Table */}
      <FilesTable
        data={filtered}
        loading={loading}
        busyIds={busyIds}
        onDelete={onDelete}
      />

      {/* Upload Modal (no document-picker; URI/URL input) */}
      <FileUploadModal
        visible={uploadOpen}
        busy={uploadBusy}
        onClose={() => dispatch(closeUpload())}
        onUpload={file => dispatch(uploadFile(projectId, file))}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  btnTxt: { color: '#1d4ed8', fontWeight: '600' },
  primary: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
});
