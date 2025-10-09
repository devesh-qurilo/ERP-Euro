import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { pick, types, isCancel } from '@react-native-documents/picker';

export default function ProfileDetailsForm({
  initialValues = {},
  profilePictureUrl,
  saving = false,
  onSubmit, // ({ employee, profilePictureFile })
  style,
}) {
  const [form, setForm] = useState({
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
  const [pickedFile, setPickedFile] = useState(null);

  useEffect(() => {
    setForm(prev => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const pickPhoto = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setPickedFile({ uri: res.uri, name: res.name, type: res.type });
      const files = await pick({
        allowMultiSelection: false,
        type: [types.images], // or [types.jpeg, types.png]
      });
      const f = files?.[0];
      if (f) {
        setPickedFile({ uri: f.uri, name: f.name, type: f.mimeType });
      }
    } catch (e) {
      if (!isCancel(e)) {
        Alert.alert('Picker error', String(e?.message || e));
      }
    }
  };

  const submit = () => {
    if (!form.name?.trim() || !form.email?.trim()) {
      Alert.alert('Missing fields', 'Your Name and Email Id are required.');
      return;
    }
    onSubmit?.({
      employee: {
        name: form.name,
        email: form.email,
        gender: form.gender,
        birthday: form.birthday,
        bloodGroup: form.bloodGroup,
        language: form.language,
        country: form.country,
        mobile: form.mobile,
        address: form.address,
        about: form.about,
        slackMemberId: form.slackMemberId,
        maritalStatus: form.maritalStatus,
      },
      profilePictureFile: pickedFile,
    });
  };

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>Profile Details</Text>

      <View style={styles.divider} />

      {/* Profile picture */}
      <Text style={styles.label}>Profile Picture</Text>
      <Pressable onPress={pickPhoto} style={styles.uploadBox}>
        {pickedFile?.uri || profilePictureUrl ? (
          <Image
            source={{ uri: pickedFile?.uri || profilePictureUrl }}
            style={styles.preview}
          />
        ) : (
          <>
            <Text style={styles.uploadIcon}>🖼️➕</Text>
            <Text style={styles.uploadHint}>Choose a file</Text>
          </>
        )}
      </Pressable>

      {/* Form */}
      <Field label="Your Name *">
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={v => setForm({ ...form, name: v })}
          placeholder="--"
        />
      </Field>

      <Field label="Email Id *" hint="Must have at least 8 characters">
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={v => setForm({ ...form, email: v })}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="--"
        />
      </Field>

      <View style={styles.row2}>
        <Field label="Gender *" style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            value={form.gender}
            onChangeText={v => setForm({ ...form, gender: v })}
            placeholder="Female / Male / Other"
          />
        </Field>
        <Field label="Blood Group *" style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            value={form.bloodGroup}
            onChangeText={v => setForm({ ...form, bloodGroup: v })}
            placeholder="B+"
          />
        </Field>
      </View>

      <Field label="Date of Birth *">
        <TextInput
          style={styles.input}
          value={form.birthday}
          onChangeText={v => setForm({ ...form, birthday: v })}
          placeholder="YYYY-MM-DD"
        />
      </Field>

      <Field label="Marital Status">
        <TextInput
          style={styles.input}
          value={form.maritalStatus}
          onChangeText={v => setForm({ ...form, maritalStatus: v })}
          placeholder="Single / Married"
        />
      </Field>

      <Field label="Language *">
        <TextInput
          style={styles.input}
          value={form.language}
          onChangeText={v => setForm({ ...form, language: v })}
          placeholder="--"
        />
      </Field>

      <Field label="Country *">
        <TextInput
          style={styles.input}
          value={form.country}
          onChangeText={v => setForm({ ...form, country: v })}
          placeholder="India"
        />
      </Field>

      <View style={styles.row2}>
        <Field label="Mobile *" style={{ flex: 1.1 }}>
          <TextInput
            style={styles.input}
            value={form.mobile}
            onChangeText={v => setForm({ ...form, mobile: v })}
            keyboardType="phone-pad"
            placeholder="+91 ..."
          />
        </Field>
        <Field label="Slack Member Id *" style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            value={form.slackMemberId}
            onChangeText={v => setForm({ ...form, slackMemberId: v })}
            placeholder="--"
          />
        </Field>
      </View>

      <Field label="Address">
        <TextInput
          style={[styles.input, styles.textarea]}
          value={form.address}
          onChangeText={v => setForm({ ...form, address: v })}
          placeholder="--"
          multiline
        />
      </Field>

      <Field label="About">
        <TextInput
          style={[styles.input, styles.textarea]}
          value={form.about}
          onChangeText={v => setForm({ ...form, about: v })}
          placeholder="--"
          multiline
        />
      </Field>

      <Pressable
        onPress={submit}
        style={[styles.saveBtn, saving && { opacity: 0.6 }]}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveTxt}>Save</Text>
        )}
      </Pressable>
    </View>
  );
}

function Field({ label, hint, children, style }) {
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

/* styles */
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111827' },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
    borderRadius: 1,
  },

  label: { color: '#374151', fontWeight: '800', marginBottom: 6 },
  uploadBox: {
    height: 140,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  preview: { width: '100%', height: '100%', borderRadius: 12 },
  uploadIcon: { fontSize: 28, color: '#9aa0a6' },
  uploadHint: { color: '#6b7280', marginTop: 6 },

  row2: { flexDirection: 'row', gap: 12 },

  fieldLabel: { color: '#374151', fontWeight: '800', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textarea: { height: 90, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: '#6b7280', marginTop: 4 },

  saveBtn: {
    marginTop: 6,
    backgroundColor: '#2c7be5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveTxt: { color: '#fff', fontWeight: '900' },
});
