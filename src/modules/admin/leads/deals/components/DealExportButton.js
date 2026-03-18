import React from 'react';
import { Pressable, Text, Alert, Share } from 'react-native';

export default function DealExportButton({ deals = [] }) {
  const formatDate = date => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const handleExportCSV = async () => {
    try {
      if (!deals.length) {
        Alert.alert('Export', 'No deals available');
        return;
      }

      const headers = [
        'title',
        'value',
        'dealStage',
        'leadName',
        'expectedCloseDate',
        'pipeline',
      ];

      const rows = deals.map(d =>
        [
          d.title,
          d.value || 0,
          d.dealStage || '',
          d.leadName || '',
          formatDate(d.expectedCloseDate),
          d.pipeline || '',
        ].join(','),
      );

      const csv = headers.join(',') + '\n' + rows.join('\n');

      const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

      await Share.share({
        url: dataUrl,
        title: 'Export Deals',
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
        backgroundColor: '#2563eb',
        padding: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>Export</Text>
    </Pressable>
  );
}
