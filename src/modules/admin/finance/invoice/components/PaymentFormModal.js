// // src/modules/admin/work/payments/PaymentFormModal.js

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Platform,
//   Alert,
//   KeyboardAvoidingView,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import * as DocumentPicker from '@react-native-documents/picker';
// import { useDispatch, useSelector } from 'react-redux';

// // Selectors
// import { selectClients } from '../../../clients/store/selectors';
// import * as ClientsActions from '../../../clients/store/actions';
// import { selectAWPList } from '../../../work/projects/store/selectors';
// import * as ProjectsActions from '../../../work/projects/store/actions';

// function toRNFile(doc) {
//   const uri = doc.fileCopyUri || doc.uri;
//   return {
//     uri,
//     name: doc.name || 'payment.bin',
//     type: doc.type || 'application/octet-stream',
//   };
// }

// export default function PaymentFormModal({
//   visible,
//   onClose,
//   onSubmit,
//   initial,
// }) {
//   const dispatch = useDispatch();
//   const clients = useSelector(selectClients) || [];
//   const projects = useSelector(selectAWPList) || [];

//   const blank = {
//     projectId: '',
//     clientId: '',
//     currency: 'USD',
//     amount: '',
//     transactionId: '',
//     invoiceId: '',
//     paymentGatewayId: '',
//     notes: '',
//   };

//   const [form, setForm] = useState(initial || blank);
//   const [file, setFile] = useState(null);

//   // Load clients & projects
//   useEffect(() => {
//     if (visible) {
//       setForm(initial || blank);
//       setFile(null);

//       if (!clients?.length) dispatch(ClientsActions.list({}));
//       if (!projects?.length) dispatch(ProjectsActions.fetchAll());
//     }
//   }, [visible]);

//   useEffect(() => {
//     if (visible && initial) setForm(initial);
//   }, [initial, visible]);

//   function change(k, v) {
//     setForm(prev => ({ ...prev, [k]: v }));
//   }

//   async function pickReceipt() {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
//         copyTo: 'cachesDirectory',
//       });
//       const doc = Array.isArray(res) ? res[0] : res;
//       setFile(toRNFile(doc));
//     } catch (e) {
//       if (!DocumentPicker.isCancel(e)) {
//         // console.log('[PaymentFormModal] File pick error:', e?.message);
//         Alert.alert('File selection failed');
//       }
//     }
//   }

//   // Filter projects based on selected client
//   const filteredProjects = useMemo(() => {
//     if (!form.clientId) return projects;
//     return projects.filter(p => {
//       const pid =
//         p.clientId ??
//         p.client_id ??
//         (p.client && (p.client.clientId ?? p.client.id));
//       return String(pid) === String(form.clientId);
//     });
//   }, [projects, form.clientId]);

//   function save() {
//     if (!form.clientId) return Alert.alert('Validation', 'Select client');
//     if (!form.projectId) return Alert.alert('Validation', 'Select project');
//     if (!form.amount || Number.isNaN(Number(form.amount)))
//       return Alert.alert('Validation', 'Enter valid amount');

//     const payment = {
//       ...form,
//       amount: Number(form.amount),
//       paymentGatewayId: form.paymentGatewayId
//         ? Number(form.paymentGatewayId)
//         : undefined,

//       // IMPORTANT: backend wants codes as strings
//       clientId: String(form.clientId),
//       projectId: String(form.projectId),
//     };

//     onSubmit({ payment, file });
//   }

//   return (
//     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//       <KeyboardAvoidingView
//         style={{ flex: 1, backgroundColor: '#fff' }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView
//             contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//             keyboardShouldPersistTaps="handled"
//           >
//             {/* Header */}
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginBottom: 12,
//                 marginTop: 8,
//               }}
//             >
//               <Text style={{ fontSize: 18, fontWeight: '700' }}>
//                 Add Payment
//               </Text>
//               <TouchableOpacity onPress={onClose}>
//                 <Text>Close</Text>
//               </TouchableOpacity>
//             </View>

//             {/* CLIENT PICKER */}
//             <View style={{ marginBottom: 12 }}>
//               <Text style={{ marginBottom: 6 }}>Client</Text>
//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: '#ccc',
//                   borderRadius: 8,
//                   overflow: 'hidden',
//                 }}
//               >
//                 <Picker
//                   selectedValue={form.clientId}
//                   onValueChange={val => {
//                     change('clientId', val);
//                     change('projectId', ''); // Reset project on client change
//                   }}
//                 >
//                   <Picker.Item label="Select client" value="" />
//                   {clients.map(c => {
//                     const value = c.clientId ?? c.client_id ?? c.code ?? c.id;
//                     const label =
//                       c.name ||
//                       c.company?.companyName ||
//                       c.clientName ||
//                       `Client ${value}`;

//                     return (
//                       <Picker.Item
//                         key={String(value)}
//                         label={label}
//                         value={String(value)}
//                       />
//                     );
//                   })}
//                 </Picker>
//               </View>
//             </View>

//             {/* PROJECT PICKER */}
//             <View style={{ marginBottom: 12 }}>
//               <Text style={{ marginBottom: 6 }}>Project</Text>
//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: '#ccc',
//                   borderRadius: 8,
//                   overflow: 'hidden',
//                 }}
//               >
//                 <Picker
//                   selectedValue={form.projectId}
//                   onValueChange={val => change('projectId', val)}
//                 >
//                   <Picker.Item label="Select project" value="" />
//                   {filteredProjects.map(p => {
//                     const value =
//                       p.projectCode ?? p.project_code ?? p.shortCode ?? p.id;

//                     const label =
//                       p.name ||
//                       p.projectName ||
//                       p.title ||
//                       p.shortCode ||
//                       `Project ${value}`;

//                     return (
//                       <Picker.Item
//                         key={String(value)}
//                         label={label}
//                         value={String(value)}
//                       />
//                     );
//                   })}
//                 </Picker>
//               </View>
//             </View>

//             {/* Currency */}
//             <Field
//               label="Currency"
//               value={form.currency}
//               onChange={t => change('currency', t)}
//             />

//             {/* Amount */}
//             <Field
//               label="Amount"
//               value={form.amount}
//               onChange={t => change('amount', t)}
//               numeric
//             />

//             {/* Transaction ID */}
//             <Field
//               label="Transaction ID"
//               value={form.transactionId}
//               onChange={t => change('transactionId', t)}
//             />

//             {/* Invoice ID */}
//             <Field
//               label="Invoice ID"
//               value={form.invoiceId}
//               onChange={t => change('invoiceId', t)}
//             />

//             {/* Payment Gateway */}
//             <Field
//               label="Payment Gateway ID"
//               value={form.paymentGatewayId}
//               onChange={t => change('paymentGatewayId', t)}
//               numeric
//             />

//             {/* Notes */}
//             <Field
//               label="Notes"
//               value={form.notes}
//               onChange={t => change('notes', t)}
//               multiline
//             />

//             {/* File Picker */}
//             <TouchableOpacity
//               onPress={pickReceipt}
//               style={{
//                 backgroundColor: '#111827',
//                 padding: 12,
//                 borderRadius: 10,
//                 marginTop: 4,
//               }}
//             >
//               <Text
//                 style={{
//                   color: '#fff',
//                   textAlign: 'center',
//                   fontWeight: '700',
//                 }}
//               >
//                 Choose receipt (doc/image)
//               </Text>
//             </TouchableOpacity>

//             {file && (
//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: '#ccc',
//                   borderRadius: 10,
//                   padding: 12,
//                   marginTop: 10,
//                 }}
//               >
//                 <Text style={{ fontWeight: '600' }}>Attached:</Text>
//                 <Text numberOfLines={1}>Name: {file.name}</Text>
//                 <Text numberOfLines={1}>Type: {file.type}</Text>
//                 <Text numberOfLines={1}>URI: {file.uri}</Text>
//               </View>
//             )}

//             <TouchableOpacity
//               onPress={save}
//               style={{
//                 backgroundColor: '#111827',
//                 padding: 14,
//                 borderRadius: 10,
//                 marginTop: 16,
//                 marginBottom: 30,
//               }}
//             >
//               <Text
//                 style={{
//                   color: '#fff',
//                   textAlign: 'center',
//                   fontWeight: '700',
//                 }}
//               >
//                 Save Payment
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// }

// ////////////////////
// // REUSABLE FIELD //
// ////////////////////
// function Field({ label, value, onChange, numeric, multiline }) {
//   return (
//     <View style={{ marginBottom: 12 }}>
//       <Text style={{ marginBottom: 6 }}>{label}</Text>
//       <TextInput
//         value={String(value ?? '')}
//         onChangeText={onChange}
//         keyboardType={numeric ? 'numeric' : 'default'}
//         placeholder={label}
//         multiline={!!multiline}
//         style={{
//           borderWidth: 1,
//           borderColor: '#ccc',
//           borderRadius: 10,
//           padding: 10,
//           minHeight: multiline ? 80 : undefined,
//           textAlignVertical: multiline ? 'top' : 'center',
//         }}
//       />
//     </View>
//   );
// }

// full file: PaymentFormModal.js

import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from '@react-native-documents/picker';
import { useDispatch, useSelector } from 'react-redux';

// existing selectors/actions
import { selectClients } from '../../../clients/store/selectors';
import * as ClientsActions from '../../../clients/store/actions';
import { selectAWPList } from '../../../work/projects/store/selectors';
import * as ProjectsActions from '../../../work/projects/store/actions';

// new gateways module
import * as GatewaysActions from '../../paymentGateways/actions';
import {
  selectPaymentGateways,
  selectPaymentGatewaysLoading,
  selectPaymentGatewaysCreating,
} from '../../paymentGateways/selectors';

function toRNFile(doc) {
  const uri = doc.fileCopyUri || doc.uri;
  return {
    uri,
    name: doc.name || 'payment.bin',
    type: doc.type || 'application/octet-stream',
  };
}

export default function PaymentFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}) {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients) || [];
  const projects = useSelector(selectAWPList) || [];

  const gateways = useSelector(selectPaymentGateways) || [];
  const gatewaysLoading = useSelector(selectPaymentGatewaysLoading);
  const gatewaysCreating = useSelector(selectPaymentGatewaysCreating);

  const blank = {
    projectId: '',
    clientId: '',
    currency: 'USD',
    amount: '',
    transactionId: '',
    invoiceId: '',
    paymentGatewayId: '',
    notes: '',
  };

  const [form, setForm] = useState(initial || blank);
  const [file, setFile] = useState(null);
  const [manageGatewaysOpen, setManageGatewaysOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(initial || blank);
      setFile(null);
      if (!clients?.length) dispatch(ClientsActions.list({}));
      if (!projects?.length) dispatch(ProjectsActions.fetchAll());

      // load gateways
      dispatch(GatewaysActions.list());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (visible && initial) setForm(initial);
  }, [initial, visible]);

  function change(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function pickReceipt() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });
      const doc = Array.isArray(res) ? res[0] : res;
      setFile(toRNFile(doc));
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        // console.log('[PaymentFormModal] File pick error:', e?.message);
        Alert.alert('File selection failed');
      }
    }
  }

  const filteredProjects = useMemo(() => {
    if (!form.clientId) return projects;
    return projects.filter(p => {
      const pid =
        p.clientId ??
        p.client_id ??
        (p.client && (p.client.clientId ?? p.client.id));
      return String(pid) === String(form.clientId);
    });
  }, [projects, form.clientId]);

  function save() {
    if (!form.clientId) return Alert.alert('Validation', 'Select client');
    if (!form.projectId) return Alert.alert('Validation', 'Select project');
    if (!form.amount || Number.isNaN(Number(form.amount)))
      return Alert.alert('Validation', 'Enter valid amount');

    const payment = {
      ...form,
      amount: Number(form.amount),
      paymentGatewayId: form.paymentGatewayId
        ? Number(form.paymentGatewayId)
        : undefined,

      // ensure strings for clientId/projectId if backend expects codes (you previously configured this)
      clientId: String(form.clientId),
      projectId: String(form.projectId),
    };

    onSubmit({ payment, file });
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
                marginTop: 60,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700' }}>
                Add Payment
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>

            {/* CLIENT PICKER */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Client</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Picker
                  selectedValue={form.clientId}
                  onValueChange={val => {
                    change('clientId', val);
                    change('projectId', '');
                  }}
                  itemStyle={{ height: 100 }}
                >
                  <Picker.Item label="Select client" value="" />
                  {clients.map(c => {
                    const value = c.clientId ?? c.client_id ?? c.code ?? c.id;
                    const label =
                      c.name ||
                      c.company?.companyName ||
                      c.clientName ||
                      `Client ${value}`;
                    return (
                      <Picker.Item
                        key={String(value)}
                        label={label}
                        value={String(value)}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            {/* PROJECT PICKER */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Project</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Picker
                  selectedValue={form.projectId}
                  onValueChange={val => change('projectId', val)}
                  itemStyle={{ height: 100 }}
                >
                  <Picker.Item label="Select project" value="" />
                  {filteredProjects.map(p => {
                    const value =
                      p.projectCode ?? p.project_code ?? p.shortCode ?? p.id;
                    const label =
                      p.name ||
                      p.projectName ||
                      p.title ||
                      p.shortCode ||
                      `Project ${value}`;
                    return (
                      <Picker.Item
                        key={String(value)}
                        label={label}
                        value={String(value)}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>

            {/* PAYMENT GATEWAY PICKER + ADD BUTTON */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Payment Gateway</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  {gatewaysLoading ? (
                    <View style={{ padding: 12, alignItems: 'center' }}>
                      <ActivityIndicator />
                    </View>
                  ) : (
                    <Picker
                      selectedValue={form.paymentGatewayId}
                      onValueChange={val => change('paymentGatewayId', val)}
                      itemStyle={{ height: 100 }}
                    >
                      <Picker.Item label="Select gateway" value="" />
                      {gateways.map(g => (
                        <Picker.Item
                          key={String(g.id)}
                          label={g.name}
                          value={String(g.id)}
                        />
                      ))}
                    </Picker>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => setManageGatewaysOpen(true)}
                  style={{
                    marginLeft: 8,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontWeight: '700' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Currency */}
            <Field
              label="Currency"
              value={form.currency}
              onChange={t => change('currency', t)}
            />

            {/* Amount */}
            <Field
              label="Amount"
              value={form.amount}
              onChange={t => change('amount', t)}
              numeric
            />

            {/* Transaction ID */}
            <Field
              label="Transaction ID"
              value={form.transactionId}
              onChange={t => change('transactionId', t)}
            />

            {/* Invoice ID */}
            <Field
              label="Invoice ID"
              value={form.invoiceId}
              onChange={t => change('invoiceId', t)}
            />

            {/* Payment Gateway ID is now the picker above; this field removed from raw inputs */}

            {/* Notes */}
            <Field
              label="Notes"
              value={form.notes}
              onChange={t => change('notes', t)}
              multiline
            />

            <TouchableOpacity
              onPress={pickReceipt}
              style={{
                backgroundColor: '#111827',
                padding: 12,
                borderRadius: 10,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              >
                Choose receipt (doc/image)
              </Text>
            </TouchableOpacity>

            {file && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  padding: 12,
                  marginTop: 10,
                }}
              >
                <Text style={{ fontWeight: '600' }}>Attached:</Text>
                <Text numberOfLines={1}>Name: {file.name}</Text>
                <Text numberOfLines={1}>Type: {file.type}</Text>
                <Text numberOfLines={1}>URI: {file.uri}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={save}
              style={{
                backgroundColor: '#111827',
                padding: 14,
                borderRadius: 10,
                marginTop: 16,
                marginBottom: 30,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              >
                Save Payment
              </Text>
            </TouchableOpacity>

            {/* Manage Gateways Modal */}
            <ManageGatewayModal
              visible={manageGatewaysOpen}
              onClose={() => setManageGatewaysOpen(false)}
              gateways={gateways}
              loading={gatewaysLoading}
              creating={gatewaysCreating}
              onCreate={name => dispatch(GatewaysActions.create({ name }))}
              onDelete={id => dispatch(GatewaysActions.remove(id))}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, value, onChange, numeric, multiline }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={String(value ?? '')}
        onChangeText={onChange}
        keyboardType={numeric ? 'numeric' : 'default'}
        placeholder={label}
        multiline={!!multiline}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 10,
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}

/* small modal for managing gateways */
function ManageGatewayModal({
  visible,
  onClose,
  gateways,
  loading,
  creating,
  onCreate,
  onDelete,
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (!visible) setName('');
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{ flex: 1, backgroundColor: '#fff', padding: 16, marginTop: 50 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            Manage Payment Gateways
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 6 }}>Add new gateway</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Gateway name"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 8,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if (!name || !name.trim()) return Alert.alert('Enter name');
                onCreate({ name: name.trim() });
                setName('');
              }}
              style={{
                marginLeft: 8,
                padding: 10,
                backgroundColor: '#111827',
                borderRadius: 8,
              }}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff' }}>Add</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 8, flex: 1 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Existing</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={gateways}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    style={{ padding: 8 }}
                  >
                    <Text style={{ color: '#dc2626' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
