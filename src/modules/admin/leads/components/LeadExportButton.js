import React from 'react';
import { Pressable, Text, Alert, Share } from 'react-native';
import Entypo from 'react-native-vector-icons/Feather';

export default function LeadExportButton({ leads = [] }) {
  const handleExportCSV = async () => {
    try {
      if (!leads.length) {
        Alert.alert('Export', 'No leads available');
        return;
      }

      const headers = [
        'name',
        'email',
        'companyName',
        'mobileNumber',
        'city',
        'state',
        'country',
        'postalCode',
        'officialWebsite',
        'officePhone',
      ];

      const rows = leads.map(l =>
        [
          l.name,
          l.email,
          l.companyName || '',
          l.mobileNumber || '',
          l.city || '',
          l.state || '',
          l.country || '',
          l.postalCode || '',
          l.officialWebsite || '',
          l.officePhone || '',
        ].join(','),
      );

      const csv = headers.join(',') + '\n' + rows.join('\n');

      const dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

      await Share.share({
        url: dataUrl,
        title: 'Export Leads',
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
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>
        <Entypo name="upload" size={18} color={'#fff'} /> {'  '}Export
      </Text>
    </Pressable>
  );
}
