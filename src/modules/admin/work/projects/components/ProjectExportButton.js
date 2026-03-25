import React from 'react';
import { Pressable, Text, Alert, Share } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ProjectExportButton({ projects = [] }) {
  const handleExportCSV = async () => {
    try {
      if (!projects.length) {
        Alert.alert('Export', 'No projects available');
        return;
      }

      const headers = [
        'shortCode',
        'name',
        'clientId',
        'startDate',
        'deadline',
        'projectStatus',
        'budget',
      ];

      const rows = projects.map(p =>
        [
          p.shortCode || '',
          p.name || '',
          p.clientId || '',
          p.startDate || '',
          p.deadline || '',
          p.projectStatus || '',
          p.budget || '',
        ].join(','),
      );

      const csv = headers.join(',') + '\n' + rows.join('\n');

      const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

      await Share.share({
        url: dataUrl,
        title: 'Export Projects',
        filename: 'projects_export.csv',
      });
    } catch (err) {
      console.log(err);
      Alert.alert('Export failed', err.message);
    }
  };

  return (
    <Pressable
      onPress={handleExportCSV}
      style={{
        backgroundColor: '#9333ea',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 16,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>
        <Icon name="upload" size={16} color="#fff" /> Export
      </Text>
    </Pressable>
  );
}
