import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, updateMe } from '../store/actions';
import {
  selectMe,
  selectMeLoading,
  selectMeError,
  selectUpdateLoading,
  selectUpdateError,
  selectLastSavedAt,
} from '../store/selectors';
import ProfileDetailsForm from '../components/ProfileDetailsForm';
import EmergencyContactCreate from '../components/EmergencyContactCreate';
import EmergencyContactsTable from '../components/EmergencyContactsTable';

export default function EmployeeSettingsScreen() {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const employeeId = me?.employeeId;
  const loading = useSelector(selectMeLoading);
  const loadErr = useSelector(selectMeError);

  const saving = useSelector(selectUpdateLoading);
  const saveErr = useSelector(selectUpdateError);
  const savedAt = useSelector(selectLastSavedAt);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const initialValues = useMemo(
    () => ({
      name: me?.name || '',
      email: me?.email || '',
      gender: me?.gender || '',
      birthday: me?.birthday || '',
      bloodGroup: me?.bloodGroup || '',
      language: me?.language || '',
      country: me?.country || '',
      mobile: me?.mobile || '',
      address: me?.address || '',
      about: me?.about || '',
      slackMemberId: me?.slackMemberId || '',
      maritalStatus: me?.maritalStatus || '',
    }),
    [me],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Settings</Text>

      {loading && !me ? <ActivityIndicator /> : null}
      {loadErr ? (
        <Text style={styles.err}>Failed to load: {String(loadErr)}</Text>
      ) : null}
      {saveErr ? (
        <Text style={styles.err}>Save failed: {String(saveErr)}</Text>
      ) : null}
      {savedAt ? <Text style={styles.ok}>Saved ✓</Text> : null}

      <ProfileDetailsForm
        initialValues={initialValues}
        profilePictureUrl={me?.profilePictureUrl}
        saving={saving}
        onSubmit={payload => dispatch(updateMe(payload))}
      />

      {/* 🔜 Add more settings components here later */}

      <EmergencyContactCreate employeeId={employeeId} />
      <EmergencyContactsTable employeeId={employeeId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '900', color: '#0b0b0c' },
  err: { color: '#b00020' },
  ok: { color: '#16a34a', fontWeight: '800' },
});
