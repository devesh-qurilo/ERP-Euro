// components/EmployeeProfileCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectEmployeeProfile,
  selectEmployeeProfileLoading,
  selectEmployeeProfileError,
} from '../store/selectors';

export default function EmployeeProfileCard() {
  const profile = useSelector(selectEmployeeProfile);
  const loading = useSelector(selectEmployeeProfileLoading);
  const error = useSelector(selectEmployeeProfileError);

  if (loading) {
    return (
      <View style={[styles.card, styles.center]}>
        <ActivityIndicator size="small" />
        <Text style={styles.helperText}>Loading profile…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.card, styles.center]}>
        <Text style={styles.errorTitle}>Couldn’t load profile</Text>
        <Text style={styles.errorSub}>{String(error)}</Text>
      </View>
    );
  }

  if (!profile) return null;

  const { name, title, employeeId, photoUrl } = profile;

  return (
    <View style={styles.card}>
      <View style={styles.mediaWrap}>
        <Image
          source={{ uri: profile.profilePictureUrl }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {profile.name}
        </Text>
        <Text numberOfLines={1} style={styles.title}>
          {profile.designationName}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          Employee ID: {employeeId}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    // subtle shadow (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#dcd8d8ff',
  },
  mediaWrap: {
    width: 140,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b0b0c',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2e',
    marginBottom: 6,
  },
  meta: {
    fontSize: 16,
    color: '#2a2a2e',
    fontWeight: '500',
  },
  // states
  center: {
    justifyContent: 'center',
  },
  helperText: {
    marginTop: 8,
    color: '#666',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b00020',
    marginBottom: 4,
  },
  errorSub: {
    fontSize: 13,
    color: '#b00020',
  },
});
