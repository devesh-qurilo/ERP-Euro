import React from 'react';
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
import {
  adminCompanyFetchRequest,
  adminCompanySaveRequest,
} from '../store/actions';
import {
  selectCompany,
  selectCompanyLoading,
  selectCompanyError,
  selectCompanySaving,
  selectCompanySaveError,
  selectCompanyLastSaved,
} from '../store/selectors';
import { pickSingleDoc } from '../../../../utils/filePickers';

export default function AdminCompanySettingsScreen() {
  const dispatch = useDispatch();
  const company = useSelector(selectCompany);
  const loading = useSelector(selectCompanyLoading);
  const saving = useSelector(selectCompanySaving);
  const saveErr = useSelector(selectCompanySaveError);
  const lastSaved = useSelector(selectCompanyLastSaved);

  const [f, setF] = React.useState({
    companyName: '',
    email: '',
    contactNo: '',
    website: '',
    address: '',
  });
  const [logo, setLogo] = React.useState(null); // { uri, name, type }

  React.useEffect(() => {
    dispatch(adminCompanyFetchRequest());
  }, [dispatch]);

  React.useEffect(() => {
    if (company) {
      setF({
        companyName: company.companyName || '',
        email: company.email || '',
        contactNo: company.contactNo || '',
        website: company.website || '',
        address: company.address || '',
      });
    }
  }, [company]);

  React.useEffect(() => {
    if (lastSaved)
      Alert.alert('Saved', `Company updated: ${lastSaved.companyName}`);
    if (saveErr) Alert.alert('Error', String(saveErr));
  }, [lastSaved, saveErr]);

  const onPickLogo = async () => {
    const picked = await pickSingleDoc({ type: ['image/*'] });
    if (picked) setLogo(picked);
  };

  const onSave = () => {
    if (!f.companyName) {
      Alert.alert('Missing', 'Company name is required');
      return;
    }
    dispatch(adminCompanySaveRequest({ company: f, logoFile: logo }));
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
      <Text style={styles.title}>Company Settings</Text>

      <View style={styles.card}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          {logo ? (
            <Image source={{ uri: logo.uri }} style={styles.logo} />
          ) : company?.logoUrl ? (
            <Image source={{ uri: company.logoUrl }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.logoEmpty]}>
              <Text>🏢</Text>
            </View>
          )}
          <Pressable style={styles.secondaryBtn} onPress={onPickLogo}>
            <Text style={styles.secondaryTxt}>
              {logo ? 'Change Logo' : 'Upload Logo'}
            </Text>
          </Pressable>
        </View>

        <Field
          label="Company Name"
          k="companyName"
          placeholder="TechCorp Global"
        />
        <Field label="Email" k="email" placeholder="contact@company.com" />
        <Field label="Contact No" k="contactNo" placeholder="1234567890" />
        <Field label="Website" k="website" placeholder="https://example.com" />
        <Field
          label="Address"
          k="address"
          placeholder="Street, City, Country"
        />

        <Pressable
          style={[styles.primaryBtn, (saving || loading) && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={saving || loading}
        >
          <Text style={[styles.primaryTxt, { color: '#fff' }]}>
            {saving ? 'Saving…' : 'Save Company'}
          </Text>
        </Pressable>

        {loading ? <Text style={styles.dim}>Loading company…</Text> : null}
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
  logo: { width: 96, height: 96, borderRadius: 12 },
  logoEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: { color: '#64748b', marginTop: 8 },
});
