import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import ModalSelector from 'react-native-modal-selector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { adminProfileUpdateRequest } from '../store/actions';
import {
  selectAdminProfileUpdating,
  selectAdminProfileUpdateError,
  selectAdminLastProfile,
} from '../store/selectors';
import { pickSingleDoc } from '../../../../utils/filePickers';

/* -------------------- */
/*   MEMO FIELD INPUT   */
/* -------------------- */
const Field = React.memo(({ label, icon, value, placeholder, onChange }) => (
  <View style={{ marginBottom: 18 }}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.inputWrap}>
      <Feather
        name={icon}
        size={18}
        color="#6b7280"
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  </View>
));

/* -------------------------- */
/*       MAIN SCREEN          */
/* -------------------------- */
export default function AdminProfileSettingsScreen() {
  const dispatch = useDispatch();
  const updating = useSelector(selectAdminProfileUpdating);
  const updateErr = useSelector(selectAdminProfileUpdateError);
  const last = useSelector(selectAdminLastProfile);

  const [file, setFile] = useState(null);

  // Original data from backend
  const initialData = last || {};

  // Only changed fields stored here
  const [f, setF] = useState({});

  const updateField = useCallback(
    (key, value) => setF(prev => ({ ...prev, [key]: value })),
    [],
  );

  // ------------ DATE PICKER ------------
  const [showDate, setShowDate] = useState(false);

  const onChangeDate = (_, selectedDate) => {
    setShowDate(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      updateField('birthday', iso);
    }
  };

  // ------------ GENDER DROPDOWN ------------
  const genderOptions = [
    { key: 1, label: 'Male' },
    { key: 2, label: 'Female' },
    { key: 3, label: 'Other' },
  ];

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
    if (!initialData.name && !f.name) {
      return Alert.alert('Missing', 'Name is required');
    }

    if (!initialData.email && !f.email) {
      return Alert.alert('Missing', 'Email is required');
    }

    // send only changed fields
    const finalPayload = { ...f };

    dispatch(adminProfileUpdateRequest({ profile: finalPayload, file }));
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.wrap}
      >
        <Text style={styles.title}>Profile Settings</Text>

        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {file ? (
              <Image source={{ uri: file.uri }} style={styles.avatar} />
            ) : initialData.profilePictureUrl ? (
              <Image
                source={{ uri: initialData.profilePictureUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarEmpty]}>
                <Feather name="user" size={40} color="#9ca3af" />
              </View>
            )}

            <Pressable style={styles.secondaryBtn} onPress={onPickAvatar}>
              <Feather name="upload" size={16} color="#1d4ed8" />
              <Text style={styles.secondaryTxt}>
                {file ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </Pressable>
          </View>

          {/* Name */}
          <Field
            label="Name"
            icon="user"
            value={f.name ?? initialData.name ?? ''}
            placeholder="Your name"
            onChange={v => updateField('name', v)}
          />

          {/* Email */}
          <Field
            label="Email"
            icon="mail"
            value={f.email ?? initialData.email ?? ''}
            placeholder="your@email.com"
            onChange={v => updateField('email', v)}
          />

          {/* Gender Dropdown */}
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.label}>Gender</Text>

            <ModalSelector
              data={genderOptions}
              initValue={f.gender ?? initialData.gender ?? 'Select Gender'}
              onChange={option => updateField('gender', option.label)}
              style={styles.inputWrap}
            >
              <View style={styles.inputWrap}>
                <Feather name="users" size={18} color="#6b7280" />
                <Text style={{ marginLeft: 8, color: '#111827', flex: 1 }}>
                  {f.gender ?? initialData.gender ?? 'Select Gender'}
                </Text>
                <Feather name="chevron-down" size={20} color="#6b7280" />
              </View>
            </ModalSelector>
          </View>

          {/* Birthday Date Picker */}
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.label}>Birthday</Text>

            <Pressable
              style={styles.inputWrap}
              onPress={() => setShowDate(true)}
            >
              <Feather name="calendar" size={18} color="#6b7280" />
              <Text style={{ marginLeft: 1, color: '#111827' }}>
                {f.birthday ?? initialData.birthday ?? 'Select Date'}
              </Text>
            </Pressable>

            {showDate && (
              <DateTimePicker
                value={
                  f.birthday
                    ? new Date(f.birthday)
                    : initialData.birthday
                    ? new Date(initialData.birthday)
                    : new Date()
                }
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>

          {/* Others */}
          <Field
            label="Country"
            icon="globe"
            value={f.country ?? initialData.country ?? ''}
            placeholder="Lithuania"
            onChange={v => updateField('country', v)}
          />

          <Field
            label="Mobile"
            icon="phone"
            value={f.mobile ?? initialData.mobile ?? ''}
            placeholder="+370 "
            onChange={v => updateField('mobile', v)}
          />

          <Field
            label="Address"
            icon="map-pin"
            value={f.address ?? initialData.address ?? ''}
            placeholder="Street, City"
            onChange={v => updateField('address', v)}
          />

          <Field
            label="About"
            icon="info"
            value={f.about ?? initialData.about ?? ''}
            placeholder="Something about you"
            onChange={v => updateField('about', v)}
          />

          <Pressable
            style={[styles.primaryBtn, updating && { opacity: 0.6 }]}
            onPress={onSave}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryTxt}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

/* -------------------------- */
/*           STYLES           */
/* -------------------------- */
const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 140 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  avatarContainer: { alignItems: 'center', marginBottom: 20 },

  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 48,
  },

  input: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    paddingVertical: 10,
  },

  primaryBtn: {
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  primaryTxt: { color: '#fff', fontWeight: '900', fontSize: 15 },

  secondaryBtn: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1d4ed8',
  },
  secondaryTxt: { fontWeight: '700', color: '#1d4ed8', fontSize: 14 },
});
