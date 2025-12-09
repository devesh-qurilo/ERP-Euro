// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   Pressable,
//   Image,
//   Alert,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   adminCompanyFetchRequest,
//   adminCompanySaveRequest,
// } from '../store/actions';
// import {
//   selectCompany,
//   selectCompanyLoading,
//   selectCompanyError,
//   selectCompanySaving,
//   selectCompanySaveError,
//   selectCompanyLastSaved,
// } from '../store/selectors';
// import { pickSingleDoc } from '../../../../utils/filePickers';

// export default function AdminCompanySettingsScreen() {
//   const dispatch = useDispatch();
//   const company = useSelector(selectCompany);
//   const loading = useSelector(selectCompanyLoading);
//   const saving = useSelector(selectCompanySaving);
//   const saveErr = useSelector(selectCompanySaveError);
//   const lastSaved = useSelector(selectCompanyLastSaved);

//   const [f, setF] = React.useState({
//     companyName: '',
//     email: '',
//     contactNo: '',
//     website: '',
//     address: '',
//   });
//   const [logo, setLogo] = React.useState(null); // { uri, name, type }

//   React.useEffect(() => {
//     dispatch(adminCompanyFetchRequest());
//   }, [dispatch]);

//   React.useEffect(() => {
//     if (company) {
//       setF({
//         companyName: company.companyName || '',
//         email: company.email || '',
//         contactNo: company.contactNo || '',
//         website: company.website || '',
//         address: company.address || '',
//       });
//     }
//   }, [company]);

//   React.useEffect(() => {
//     if (lastSaved)
//       Alert.alert('Saved', `Company updated: ${lastSaved.companyName}`);
//     if (saveErr) Alert.alert('Error', String(saveErr));
//   }, [lastSaved, saveErr]);

//   const onPickLogo = async () => {
//     const picked = await pickSingleDoc({ type: ['image/*'] });
//     if (picked) setLogo(picked);
//   };

//   const onSave = () => {
//     if (!f.companyName) {
//       Alert.alert('Missing', 'Company name is required');
//       return;
//     }
//     dispatch(adminCompanySaveRequest({ company: f, logoFile: logo }));
//   };

//   const Field = ({ label, k, placeholder }) => (
//     <View style={{ marginBottom: 10 }}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={f[k]}
//         onChangeText={v => setF(s => ({ ...s, [k]: v }))}
//         placeholder={placeholder}
//         placeholderTextColor="#9ca3af"
//         style={styles.input}
//         autoCapitalize="none"
//       />
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.wrap}>
//       <Text style={styles.title}>Company Settings</Text>

//       <View style={styles.card}>
//         <View style={{ alignItems: 'center', marginBottom: 12 }}>
//           {logo ? (
//             <Image source={{ uri: logo.uri }} style={styles.logo} />
//           ) : company?.logoUrl ? (
//             <Image source={{ uri: company.logoUrl }} style={styles.logo} />
//           ) : (
//             <View style={[styles.logo, styles.logoEmpty]}>
//               <Text>🏢</Text>
//             </View>
//           )}
//           <Pressable style={styles.secondaryBtn} onPress={onPickLogo}>
//             <Text style={styles.secondaryTxt}>
//               {logo ? 'Change Logo' : 'Upload Logo'}
//             </Text>
//           </Pressable>
//         </View>

//         <Field
//           label="Company Name"
//           k="companyName"
//           placeholder="TechCorp Global"
//         />
//         <Field label="Email" k="email" placeholder="contact@company.com" />
//         <Field label="Contact No" k="contactNo" placeholder="1234567890" />
//         <Field label="Website" k="website" placeholder="https://example.com" />
//         <Field
//           label="Address"
//           k="address"
//           placeholder="Street, City, Country"
//         />

//         <Pressable
//           style={[styles.primaryBtn, (saving || loading) && { opacity: 0.6 }]}
//           onPress={onSave}
//           disabled={saving || loading}
//         >
//           <Text style={[styles.primaryTxt, { color: '#fff' }]}>
//             {saving ? 'Saving…' : 'Save Company'}
//           </Text>
//         </Pressable>

//         {loading ? <Text style={styles.dim}>Loading company…</Text> : null}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { padding: 12, gap: 12 },
//   title: { fontSize: 20, fontWeight: '900', color: '#0b0b0c' },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#111827',
//     backgroundColor: '#fff',
//   },
//   primaryBtn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     backgroundColor: '#1d4ed8',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   primaryTxt: { fontWeight: '900', color: '#111827' },
//   secondaryBtn: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#fff',
//     marginTop: 8,
//   },
//   secondaryTxt: { fontWeight: '800', color: '#111827' },
//   logo: { width: 96, height: 96, borderRadius: 12 },
//   logoEmpty: {
//     backgroundColor: '#f3f4f6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dim: { color: '#64748b', marginTop: 8 },
// });

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
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

export default function AdminCompanySettingsScreen() {
  const dispatch = useDispatch();
  const company = useSelector(selectCompany);
  const loading = useSelector(selectCompanyLoading);
  const saving = useSelector(selectCompanySaving);
  const saveErr = useSelector(selectCompanySaveError);
  const lastSaved = useSelector(selectCompanyLastSaved);

  const [logo, setLogo] = useState(null);
  const [f, setF] = useState({}); // only changed fields stored here

  const updateField = useCallback(
    (key, value) => setF(prev => ({ ...prev, [key]: value })),
    [],
  );

  useEffect(() => {
    dispatch(adminCompanyFetchRequest());
  }, [dispatch]);

  // Alerts
  useEffect(() => {
    if (lastSaved)
      Alert.alert('Saved', `Company updated: ${lastSaved.companyName}`);
  }, [lastSaved]);

  useEffect(() => {
    if (saveErr) Alert.alert('Error', String(saveErr));
  }, [saveErr]);

  // pick logo
  const onPickLogo = async () => {
    const picked = await pickSingleDoc({ type: ['image/*'] });
    if (picked) setLogo(picked);
  };

  // SAVE ONLY CHANGED FIELDS
  const onSave = () => {
    const initial = company || {};

    if (!initial.companyName && !f.companyName)
      return Alert.alert('Missing', 'Company name is required');

    const finalPayload = { ...f };

    dispatch(
      adminCompanySaveRequest({ company: finalPayload, logoFile: logo }),
    );
  };

  const initial = company || {};

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        extraScrollHeight={140}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.wrap}
      >
        <Text style={styles.title}>Company Settings</Text>

        <View style={styles.card}>
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {logo ? (
              <Image source={{ uri: logo.uri }} style={styles.logo} />
            ) : initial.logoUrl ? (
              <Image source={{ uri: initial.logoUrl }} style={styles.logo} />
            ) : (
              <View style={[styles.logo, styles.logoEmpty]}>
                <Feather name="image" size={40} color="#9ca3af" />
              </View>
            )}

            <Pressable style={styles.secondaryBtn} onPress={onPickLogo}>
              <Feather name="upload" size={16} color="#1d4ed8" />
              <Text style={styles.secondaryTxt}>
                {logo ? 'Change Logo' : 'Upload Logo'}
              </Text>
            </Pressable>
          </View>

          {/* INPUT FIELDS */}
          <Field
            label="Company Name"
            icon="briefcase"
            value={f.companyName ?? initial.companyName ?? ''}
            placeholder="TechCorp Global"
            onChange={v => updateField('companyName', v)}
          />

          <Field
            label="Email"
            icon="mail"
            value={f.email ?? initial.email ?? ''}
            placeholder="contact@company.com"
            onChange={v => updateField('email', v)}
          />

          <Field
            label="Contact No"
            icon="phone"
            value={f.contactNo ?? initial.contactNo ?? ''}
            placeholder="+370"
            onChange={v => updateField('contactNo', v)}
          />

          <Field
            label="Website"
            icon="globe"
            value={f.website ?? initial.website ?? ''}
            placeholder="https://example.com"
            onChange={v => updateField('website', v)}
          />

          <Field
            label="Address"
            icon="map-pin"
            value={f.address ?? initial.address ?? ''}
            placeholder="Street, City, Country"
            onChange={v => updateField('address', v)}
          />

          {/* SAVE BUTTON */}
          <Pressable
            style={[styles.primaryBtn, (saving || loading) && { opacity: 0.6 }]}
            onPress={onSave}
            disabled={saving || loading}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryTxt}>Save Company</Text>
            )}
          </Pressable>

          {loading ? (
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#1d4ed8" />
              <Text style={styles.dim}>Loading company…</Text>
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

/* -------------------------- */
/*           STYLES           */
/* -------------------------- */

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 150 },
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

  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },

  logo: { width: 96, height: 96, borderRadius: 12 },
  logoEmpty: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

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

  dim: { color: '#64748b', marginTop: 4 },
});
