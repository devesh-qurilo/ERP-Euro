import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { adminProfileUpdateRequest } from '../store/actions';
import {
  selectAdminProfileUpdating,
  selectAdminProfileUpdateError,
  selectAdminLastProfile,
} from '../store/selectors';
import { pickSingleDoc } from '../../../../utils/filePickers';

export default function AdminProfileSettingsScreen() {
  const dispatch = useDispatch();
  const updating = useSelector(selectAdminProfileUpdating);
  const updateErr = useSelector(selectAdminProfileUpdateError);
  const last = useSelector(selectAdminLastProfile);

  const [f, setF] = useState({
    name: '',
    email: '',
    gender: '',
    birthday: '',
    bloodGroup: '',
    language: '',
    country: '',
    mobile: '',
    address: '',
    about: '',
    slackMemberId: '',
    maritalStatus: '',
  });
  const [file, setFile] = useState(null); // { uri, name, type }

  useEffect(() => {
    if (last) Alert.alert('Updated', `Profile saved for ${last.name}`);
  }, [last]);

  useEffect(() => {
    if (updateErr) Alert.alert('Error', String(updateErr));
  }, [updateErr]);

  const onPickAvatar = async () => {
    const picked = await pickSingleDoc({ type: ['image/*'] });
    if (picked) setFile(picked);
  };

  const onSave = () => {
    if (!f.name || !f.email) {
      Alert.alert('Missing', 'Name & Email are required');
      return;
    }
    // Backend expects multipart with 'employee' (JSON) and optional 'file'
    dispatch(adminProfileUpdateRequest({ profile: f, file }));
  };

  const Field = ({ label, k, placeholder }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={f[k]}
        onChangeText={v => setF(s => ({ ...s, [k]: v }))}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Profile Settings</Text>

      <View style={styles.card}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          {file ? (
            <Image source={{ uri: file.uri }} style={styles.avatar} />
          ) : last?.profilePictureUrl ? (
            <Image
              source={{ uri: last.profilePictureUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Text>👤</Text>
            </View>
          )}

          <Pressable style={styles.secondaryBtn} onPress={onPickAvatar}>
            <Text style={styles.secondaryTxt}>
              {file ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </Pressable>
        </View>

        <Field label="Name" k="name" placeholder="Jams" />
        <Field label="Email" k="email" placeholder="jams@example.com" />
        <Field label="Gender" k="gender" placeholder="male/female/other" />
        <Field label="Birthday" k="birthday" placeholder="YYYY-MM-DD" />
        <Field label="Blood Group" k="bloodGroup" placeholder="O+" />
        <Field label="Language" k="language" placeholder="Hindi" />
        <Field label="Country" k="country" placeholder="India" />
        <Field label="Mobile" k="mobile" placeholder="+91-9540540010" />
        <Field
          label="Address"
          k="address"
          placeholder="Flat, Street, City, State, PIN"
        />
        <Field label="About" k="about" placeholder="About you…" />
        <Field
          label="Slack Member ID"
          k="slackMemberId"
          placeholder="U123456"
        />
        <Field
          label="Marital Status"
          k="maritalStatus"
          placeholder="single/married"
        />

        <Pressable
          style={[styles.primaryBtn, updating && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={updating}
        >
          <Text style={[styles.primaryTxt, { color: '#fff' }]}>
            {updating ? 'Saving…' : 'Save Changes'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 12 },
  title: { fontSize: 20, fontWeight: '900', color: '#0b0b0c' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
  },
  primaryBtn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryTxt: { fontWeight: '900', color: '#111827' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  secondaryTxt: { fontWeight: '800', color: '#111827' },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
