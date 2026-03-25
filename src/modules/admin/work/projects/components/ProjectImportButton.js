import React from 'react';
import { Pressable, Text, Alert } from 'react-native';
import { pick } from '@react-native-documents/picker';
import api from '../../../../../services/api';
import Icon from 'react-native-vector-icons/Feather';

export default function ProjectImportButton({ onImported }) {
  const handleImportCSV = async () => {
    try {
      const [file] = await pick({
        type: ['public.comma-separated-values-text', 'public.text'],
      });

      const formData = new FormData();

      formData.append('file', {
        uri: file.uri,
        name: file.name || 'projects.csv',
        type: 'text/csv',
      });

      const res = await api.post('/api/projects/import/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = res.data;

      const created = result.filter(r => r.status === 'CREATED').length;
      const skipped = result.filter(r => r.status === 'SKIPPED').length;
      const errors = result.filter(r => r.status === 'ERROR').length;

      const issues = result
        .filter(r => r.status !== 'CREATED')
        .slice(0, 5)
        .map(r => `Row ${r.rowNumber}: ${r.reason}`)
        .join('\n');

      Alert.alert(
        'Import Completed',
        `Created: ${created}\nSkipped: ${skipped}\nErrors: ${errors}\n\n${issues}`,
      );

      if (onImported) onImported();
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
        backgroundColor: '#16a34a',
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>
        <Icon name="download" size={16} color="#fff" /> Import
      </Text>
    </Pressable>
  );
}
