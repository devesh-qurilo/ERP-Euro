import React from 'react';
import { Pressable, Text, Alert } from 'react-native';
import { pick } from '@react-native-documents/picker';
import api from '../../../../services/api';
import Entypo from 'react-native-vector-icons/Feather';

export default function LeadImportButton({ onImported }) {
  const handleImportCSV = async () => {
    try {
      // pick csv file
      const [file] = await pick({
        type: [
          'public.comma-separated-values-text',
          'org.openxmlformats.spreadsheetml.sheet',
          'com.microsoft.excel',
          'public.text',
        ],
      });

      const formData = new FormData();

      formData.append('file', {
        uri: file.uri,
        name: file.name || 'leads.csv',
        type: 'text/csv',
      });

      const res = await api.post('/leads/import/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = res.data;

      const created = result.filter(r => r.status === 'CREATED').length;
      const skipped = result.filter(r => r.status === 'SKIPPED').length;
      const errors = result.filter(r => r.status === 'ERROR').length;

      Alert.alert(
        'Import Completed',
        `Created: ${created}\nSkipped: ${skipped}\nErrors: ${errors}`,
      );

      if (onImported) {
        onImported(); // refresh table
      }
    } catch (err) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') return;

      console.log(err);
      Alert.alert('Import Failed', err.message);
    }
  };

  return (
    <Pressable
      onPress={handleImportCSV}
      style={{
        backgroundColor: '#059669',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>
        <Entypo name="download" size={18} color={'#fff'} />
        {'  '} Import
      </Text>
    </Pressable>
  );
}
