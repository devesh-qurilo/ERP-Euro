import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  RefreshControl,
} from 'react-native';
import { pick, isCancel } from '@react-native-documents/picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjectFiles,
  uploadProjectFile,
} from '../store/projectFiles/actions';
import {
  selectProjectFiles,
  selectProjectFilesError,
  selectProjectFilesLoading,
  selectProjectFilesUploading,
} from '../store/selectors';

const fmtSize = b =>
  b || b === 0 ? `${(b / 1024 / 1024).toFixed(2)} MB` : '—';

export default function ProjectFilesTab({ route }) {
  const { projectId } = route.params || {};
  const dispatch = useDispatch();

  const files = useSelector(selectProjectFiles(projectId));
  const loading = useSelector(selectProjectFilesLoading);
  const uploading = useSelector(selectProjectFilesUploading);
  const error = useSelector(selectProjectFilesError);

  const load = useCallback(() => {
    if (projectId) dispatch(fetchProjectFiles(projectId));
  }, [dispatch, projectId]);

  // load on mount and on project change
  React.useEffect(() => {
    load();
  }, [load]);

  const pickAndUpload = async () => {
    try {
      // @react-native-documents/picker returns an array
      const [picked] = await pick({
        allowMultiSelection: false,
        // optionally restrict:
        // type: [types.images, types.pdf, types.plainText, types.allFiles]
      });
      const file = {
        uri: picked.uri,
        name: picked.name ?? 'file',
        // some providers expose mime as `mimeType`
        type: res.type ?? res.mimeType ?? 'application/octet-stream',
      };
      dispatch(uploadProjectFile(projectId, file));
    } catch (e) {
      if (isCancel(e)) return; // user cancelled
      // optional: show toast
      console.warn('File pick error', e);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      refreshControl={
        <RefreshControl refreshing={!!loading} onRefresh={load} />
      }
    >
      {/* Upload button */}
      <View style={styles.row}>
        <Pressable
          onPress={pickAndUpload}
          style={styles.primaryBtn}
          disabled={uploading}
        >
          <Text style={styles.primaryTxt}>
            {uploading ? 'Uploading…' : 'Upload File'}
          </Text>
        </Pressable>
        <Pressable onPress={load} style={styles.ghostBtn}>
          <Text style={styles.ghostTxt}>Refresh</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}

      {/* Table */}
      <View style={styles.table}>
        <HeaderRow
          columns={['File', 'Type', 'Size', 'Uploaded By']}
          widths={[220, 130, 110, 150]}
        />
        {(files || []).map((f, i) => (
          <DataRow key={f.id || i} widths={[220, 130, 110, 150]}>
            <Cell w={220}>
              <Text
                style={[styles.link]}
                numberOfLines={2}
                onPress={() => f.url && Linking.openURL(f.url)}
              >
                {f.filename || f.path || 'Open'}
              </Text>
            </Cell>
            <Cell w={130} text={f.mimeType || '—'} />
            <Cell w={110} text={fmtSize(f.size)} />
            <Cell w={150} text={f.uploadedBy || '—'} />
          </DataRow>
        ))}
        {!loading && (!files || files.length === 0) ? (
          <Text style={styles.dim}>No files uploaded yet.</Text>
        ) : null}
        {loading ? <Text style={styles.dim}>Loading…</Text> : null}
      </View>
    </ScrollView>
  );
}

const HeaderRow = ({ columns, widths }) => (
  <View style={styles.trHead}>
    {columns.map((c, i) => (
      <View key={c} style={[styles.th, { width: widths[i] }]}>
        <Text style={styles.thTxt}>{c}</Text>
      </View>
    ))}
  </View>
);

const DataRow = ({ children }) => <View style={styles.tr}>{children}</View>;
const Cell = ({ w, text, children }) => (
  <View style={[styles.cell, { width: w }]}>
    {children ? (
      children
    ) : (
      <Text style={styles.body} numberOfLines={2}>
        {text}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },

  primaryBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },

  ghostBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ghostTxt: { color: '#111827', fontWeight: '900' },

  table: {
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
  link: { color: '#2563eb', fontWeight: '800' },
  body: { color: '#111827' },

  err: { color: '#b00020', marginVertical: 8 },
  dim: { color: '#6b7280', padding: 12 },
});
