import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
// using ONE picker only
import { pick, types, isCancel } from '@react-native-documents/picker';

/**
 * Props:
 *  - initialValues: object with employee fields (name, email, etc.)
 *  - profilePictureUrl: remote URL string (from server)
 *  - saving: boolean (disable button / show loader)
 *  - onSubmit: function({ employee, profilePictureFile })
 *  - style: optional container style
 */
export default function ProfileDetailsForm({
  initialValues = {},
  profilePictureUrl,
  saving = false,
  onSubmit,
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

  // local selected file for immediate preview + upload
  const [pickedFile, setPickedFile] = useState(null);

  // ensure initial values populate once they arrive/refresh
  useEffect(() => {
    setForm(prev => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  // helper: derive a stable preview URI and force Image rerender on change
  const previewUri = pickedFile?.uri || profilePictureUrl || null;
  const previewKey = useMemo(
    () => (previewUri ? `${previewUri}?ts=${Date.now()}` : 'no-img'),
    [previewUri],
  );

  const pickPhoto = async () => {
    try {
      const files = await pick({
        allowMultiSelection: false,
        type: [types.images], // you can also specify [types.jpeg, types.png]
      });
      const f = files?.[0];
      if (!f?.uri) return;

      // RN FormData likes { uri, name, type }
      setPickedFile({
        uri: f.uri,
        name: f.name || getFileNameFromUri(f.uri) || 'profile.jpg',
        type: f.mimeType || guessMimeFromName(f.name) || 'image/jpeg',
      });
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

    // Normalize a few fields if your backend expects lowercase values
    const employee = {
      name: form.name?.trim(),
      email: form.email?.trim(),
      gender: form.gender, // keep as-is or enforce lowercase if required
      birthday: form.birthday,
      bloodGroup: form.bloodGroup,
      language: form.language,
      country: form.country,
      mobile: form.mobile,
      address: form.address,
      about: form.about,
      slackMemberId: form.slackMemberId,
      maritalStatus: form.maritalStatus,
    };

    onSubmit?.({
      employee,
      profilePictureFile: pickedFile || null, // saga will send as FormData field: "file"
    });
  };

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>Profile Details</Text>
      <View style={styles.divider} />

      {/* Profile picture */}
      <Text style={styles.label}>Profile Picture</Text>
      <Pressable onPress={pickPhoto} style={styles.uploadBox}>
        {previewUri ? (
          <Image
            key={previewKey} // force rerender on new pick
            source={{ uri: previewUri }}
            style={styles.preview}
            resizeMode="cover"
          />
        ) : (
          <>
            <Text style={styles.uploadIcon}>🖼️➕</Text>
            <Text style={styles.uploadHint}>Tap to choose a photo</Text>
          </>
        )}
      </Pressable>

      {/* Form fields */}
      <Field label="Your Name *">
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={v => setForm({ ...form, name: v })}
          placeholder="--"
        />
      </Field>

      <Field label="Email Id *">
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
          placeholder="country"
        />
      </Field>

      <View style={styles.row2}>
        <Field label="Mobile *" style={{ flex: 1.1 }}>
          <TextInput
            style={styles.input}
            value={form.mobile}
            onChangeText={v => setForm({ ...form, mobile: v })}
            keyboardType="phone-pad"
            placeholder="+370 ..."
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

/* helpers */
function getFileNameFromUri(uri = '') {
  try {
    const p = uri.split('?')[0];
    const seg = p.split('/').pop();
    return seg || null;
  } catch {
    return null;
  }
}
function guessMimeFromName(name = '') {
  const n = name.toLowerCase();
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
  if (n.endsWith('.heic')) return 'image/heic';
  return null;
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
    overflow: 'hidden',
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
