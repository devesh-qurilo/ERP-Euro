import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import * as DocumentPicker from '@react-native-documents/picker';

import {
  fetchEmployeeDocs,
  uploadEmployeeDoc,
  deleteEmployeeDoc,
} from '../store/actions';

import {
  selectEmployeeDocs,
  selectEmployeeDocsLoading,
} from '../store/selectors';

export default function EmployeeDocumentsTab({ empId }) {
  const dispatch = useDispatch();

  const docs = useSelector(selectEmployeeDocs);
  const loading = useSelector(selectEmployeeDocsLoading);

  useEffect(() => {
    dispatch(fetchEmployeeDocs(empId));
  }, [empId]);

  async function pickFile() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      dispatch(uploadEmployeeDoc(empId, res[0]));
    } catch (e) {}
  }

  function remove(doc) {
    Alert.alert('Delete Document', `Delete ${doc.filename}?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteEmployeeDoc(empId, doc.id)),
      },
    ]);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>

        <Pressable style={styles.uploadBtn} onPress={pickFile}>
          <Text style={styles.uploadTxt}>+ Upload</Text>
        </Pressable>
      </View>

      <ScrollView>
        {docs.map(d => (
          <View key={d.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{d.filename}</Text>
              <Text style={styles.meta}>
                {Math.round(d.size / 1024)} KB • {d.mime}
              </Text>
              <Text style={styles.meta}>
                {new Date(d.uploadedAt).toDateString()}
              </Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => Linking.openURL(d.url)}
                style={styles.viewBtn}
              >
                <Text style={styles.btnTxt}>View</Text>
              </Pressable>

              <Pressable onPress={() => remove(d)} style={styles.deleteBtn}>
                <Text style={styles.btnTxt}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {!docs.length && (
          <Text style={styles.empty}>No documents uploaded</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
  },

  uploadBtn: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  uploadTxt: {
    color: '#fff',
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  name: {
    fontWeight: '700',
  },

  meta: {
    fontSize: 12,
    color: '#6b7280',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
  },

  viewBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  btnTxt: {
    color: '#fff',
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
  },
});
