import React from 'react';
import { Pressable, Text, Alert, Share } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ClientExportButton({ clients = [] }) {
  const handleExportCSV = async () => {
    try {
      if (!clients.length) {
        Alert.alert('Export', 'No clients available');
        return;
      }

      const headers = [
        'clientId',
        'name',
        'email',
        'mobile',
        'category',
        'country',
      ];

      const rows = clients.map(c =>
        [
          c.clientId || '',
          c.name || '',
          c.email || '',
          c.mobile || '',
          c.category || '',
          c.country || '',
        ].join(','),
      );

      const csv = headers.join(',') + '\n' + rows.join('\n');

      const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

      await Share.share({
        url: dataUrl,
        title: 'Export Clients',
        filename: 'clients_export.csv', // ✅ your requirement
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
        padding: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: '#fff' }}>
        <Icon name="upload" size={16} color="#fff" /> Export
      </Text>
    </Pressable>
  );
}
