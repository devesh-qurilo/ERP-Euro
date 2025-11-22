import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { employeeAPI } from '../../../../services/api'; // adjust path if needed

// helper: YYYY-MM-DD -> readable
const formatDate = iso => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso.split('T')[0] ?? iso;
  }
};

const calcAge = iso => {
  if (!iso) return null;
  const b = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const mo = now.getMonth() - b.getMonth();
  const da = now.getDate() - b.getDate();
  if (mo < 0 || (mo === 0 && da < 0)) age--;
  return age;
};

const SkillChip = ({ text }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{text}</Text>
  </View>
);

export default function ProfileCardDashboard({
  compact = false,
  onPressEdit = null,
}) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    employeeAPI
      .getProfile()
      .then(data => {
        if (!mounted) return;
        setProfile(data);
      })
      .catch(err => {
        if (!mounted) return;
        console.error('[ProfileCard] fetch error', err);
        setError(err?.message || 'Failed to load profile');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = () => {
    if (typeof onPressEdit === 'function') return onPressEdit(profile);
    // fallback route name — adjust if your app uses a different route
    navigation.navigate('Profile', { employeeId: profile?.employeeId });
  };

  if (loading) {
    return (
      <View style={[styles.card, compact && styles.cardCompact]}>
        <View style={styles.loaderRow}>
          <ActivityIndicator />
          <Text style={{ marginLeft: 10, color: '#6b7280' }}>
            Loading profile…
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.card, compact && styles.cardCompact]}>
        <Text style={styles.errTitle}>Unable to load profile</Text>
        <Text style={styles.errMsg}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            setLoading(true);
            setError(null);
            employeeAPI
              .getProfile()
              .then(d => setProfile(d))
              .catch(e => setError(e?.message || 'Failed'))
              .finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryTxt}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.card, compact && styles.cardCompact]}>
        <Text style={styles.errMsg}>No profile data</Text>
      </View>
    );
  }

  const age = calcAge(profile.birthday);

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.headerRow}>
        <View style={styles.left}>
          {profile.profilePictureUrl ? (
            <Image
              source={{ uri: profile.profilePictureUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {(profile.name || 'U')
                  .split(' ')
                  .map(s => s[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name || '—'}
          </Text>
          <Text style={styles.designation} numberOfLines={1}>
            {profile.designationName ?? profile.departmentName ?? '—'}
          </Text>

          <View style={styles.rowInline}>
            <Text style={styles.smallMuted}>{profile.employeeId}</Text>
            <View style={{ width: 8 }} />
            <Text style={styles.smallMuted}>
              {profile.role?.replace('ROLE_', '') ?? ''}
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contact}>{profile.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.skillsWrap}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {(profile.skills || []).length === 0 ? (
            <Text style={styles.smallMuted}>No skills listed</Text>
          ) : (
            (profile.skills || []).map(s => <SkillChip key={s} text={s} />)
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6eef6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
  },
  cardCompact: {
    padding: 10,
  },

  headerRow: { flexDirection: 'row', alignItems: 'center' },
  left: { marginRight: 12 },
  avatar: {
    width: 122,
    height: 92,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { color: '#075985', fontWeight: '800', fontSize: 20 },

  meta: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  designation: { fontSize: 13, color: '#6b7280', marginTop: 4 },

  rowInline: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  smallMuted: { color: '#6b7280', fontSize: 12 },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  contact: { color: '#2563eb', fontSize: 13 },

  actions: { marginLeft: 12 },
  editBtn: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editTxt: { color: '#022027', fontWeight: '800' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stat: { flex: 1, alignItems: 'flex-start' },
  statLabel: { color: '#9ca3af', fontSize: 12 },
  statValue: { fontWeight: '800', marginTop: 6, color: '#0f172a' },

  aboutWrap: { marginTop: 12 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 6,
  },
  aboutText: { color: '#374151', lineHeight: 18 },

  skillsWrap: { marginTop: 12 },
  chipsRow: { paddingVertical: 4 },
  chip: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  chipText: { color: '#1e3a8a', fontWeight: '800' },

  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  errTitle: { fontWeight: '800', color: '#b91c1c' },
  errMsg: { color: '#6b7280', marginTop: 6 },
  retryBtn: {
    marginTop: 8,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryTxt: { color: '#7f1d1d', fontWeight: '800' },
});
