// src/modules/admin/clients/components/ClientFormModal.js
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { pickImageOrDoc } from './fileHelpers';

export default function ClientFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}) {
  const blank = {
    name: '',
    email: '',
    mobile: '',
    country: '',
    gender: '',
    category: '',
    subCategory: '',
    language: '',
    receiveEmail: false,
    skype: '',
    linkedIn: '',
    twitter: '',
    facebook: '',
    company: {
      companyName: '',
      website: '',
      officePhone: '',
      taxName: '',
      gstVatNo: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      shippingAddress: '',
    },
  };
  const [client, setClient] = useState(blank);
  const [profilePicture, setProfile] = useState(null);
  const [companyLogo, setLogo] = useState(null);

  useEffect(() => {
    if (visible) {
      if (initial)
        setClient({
          ...blank,
          ...initial,
          company: { ...blank.company, ...(initial.company || {}) },
        });
      else setClient(blank);
      setProfile(null);
      setLogo(null);
    }
  }, [visible, initial]);

  const F = (k, v) => setClient(p => ({ ...p, [k]: v }));
  const FC = (k, v) =>
    setClient(p => ({ ...p, company: { ...(p.company || {}), [k]: v } }));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: '#fff',
          marginTop: 50,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            {initial ? 'Edit' : 'Add'} Client
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        {[
          ['name', 'Full Name'],
          ['email', 'Email'],
          ['mobile', 'Mobile'],
          ['country', 'Country'],
          ['gender', 'Gender'],
          ['category', 'Category'],
          ['subCategory', 'Sub Category'],
          ['language', 'Language'],
          ['skype', 'Skype'],
          ['linkedIn', 'LinkedIn'],
          ['twitter', 'Twitter'],
          ['facebook', 'Facebook'],
        ].map(([k, label]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={String(client[k] ?? '')}
              onChangeText={t => F(k, t)}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        ))}

        <Text style={{ fontWeight: '700', marginTop: 12, marginBottom: 8 }}>
          Company
        </Text>
        {[
          ['companyName', 'Company Name'],
          ['website', 'Website'],
          ['officePhone', 'Office Phone'],
          ['taxName', 'Tax Name'],
          ['gstVatNo', 'GST/VAT No'],
          ['address', 'Address'],
          ['city', 'City'],
          ['state', 'State'],
          ['postalCode', 'Postal Code'],
          ['shippingAddress', 'Shipping Address'],
        ].map(([k, label]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={String(client.company?.[k] ?? '')}
              onChangeText={t => FC(k, t)}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={async () => setProfile(await pickImageOrDoc())}
          style={{
            backgroundColor: '#111827',
            padding: 12,
            borderRadius: 10,
            marginTop: 6,
          }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Choose Profile Picture (optional)
          </Text>
        </TouchableOpacity>
        {profilePicture ? (
          <Text style={{ marginTop: 6 }}>Attached: {profilePicture.name}</Text>
        ) : null}

        <TouchableOpacity
          onPress={async () => setLogo(await pickImageOrDoc())}
          style={{
            backgroundColor: '#111827',
            padding: 12,
            borderRadius: 10,
            marginTop: 6,
          }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Choose Company Logo (optional)
          </Text>
        </TouchableOpacity>
        {companyLogo ? (
          <Text style={{ marginTop: 6 }}>Attached: {companyLogo.name}</Text>
        ) : null}

        <TouchableOpacity
          onPress={() => onSubmit({ client, profilePicture, companyLogo })}
          style={{
            backgroundColor: '#111827',
            padding: 14,
            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            {initial ? 'Save' : 'Create'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}
