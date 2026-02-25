import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { uploadDoc, fetchDocs } from '../../deals/view/store/actions';
import {
  selectDealDocs,
  selectDealTabsBusy,
} from '../../deals/view/store/selectors';

import { pickImageOrDoc } from '../../../clients/components/fileHelpers'; // 👈 YOUR HELPER FILE

export default function DocumentsTab({ dealId }) {
  const dispatch = useDispatch();
  const docs = useSelector(selectDealDocs);
  const busy = useSelector(selectDealTabsBusy);

  useEffect(() => {
    if (dealId) {
      dispatch(fetchDocs(dealId));
    }
  }, [dealId]);

  const handleUpload = async () => {
    try {
      // console.log('Opening picker...');
      const file = await pickImageOrDoc(); // 👈 CLEAN CALL

      if (!file) return;

      // console.log('Uploading:', file);

      dispatch(uploadDoc(dealId, file));
    } catch (err) {
      // console.log('Picker Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.uploadText}>+ Upload</Text>
        </TouchableOpacity>
      </View>

      {busy && <ActivityIndicator style={{ marginVertical: 10 }} />}

      {!docs?.length && !busy && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No documents uploaded yet</Text>
        </View>
      )}

      <FlatList
        data={docs}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <DocumentCard doc={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

/* ================= DOCUMENT CARD ================= */

function DocumentCard({ doc }) {
  const filename = doc.filename || doc.name || 'File';
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filename);
  const isPdf = /\.pdf$/i.test(filename);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => Linking.openURL(doc.url)}
    >
      <View style={styles.preview}>
        {isImage ? (
          <Image source={{ uri: doc.url }} style={styles.image} />
        ) : (
          <View style={styles.fileIcon}>
            <Text style={styles.fileIconText}>{isPdf ? 'PDF' : 'FILE'}</Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.fileName} numberOfLines={1}>
          {filename}
        </Text>
        <Text style={styles.fileDate}>
          Uploaded: {formatDate(doc.uploadedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ================= HELPERS ================= */

function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString();
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  uploadBtn: {
    backgroundColor: '#3F6AE1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  uploadText: {
    color: '#fff',
    fontWeight: '700',
  },

  emptyBox: {
    padding: 30,
    alignItems: 'center',
  },

  emptyText: {
    color: '#777',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },

  preview: {
    marginRight: 12,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  fileIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fileIconText: {
    fontWeight: '700',
    color: '#3F6AE1',
  },

  fileName: {
    fontWeight: '600',
    fontSize: 14,
  },

  fileDate: {
    color: '#777',
    fontSize: 12,
    marginTop: 4,
  },
});
