import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClients,
  setClientQuery,
  setClientModal,
  setSelectedClient,
  createClient,
  updateClient,
  deleteClient,
} from '../store/actions';
import {
  getClients,
  getClientsLoading,
  getClientsSaving,
  getClientQuery,
  getClientsModal,
  getSelectedClient,
} from '../store/selectors';

const COLS = [
  { key: 'clientId', title: 'Client ID', width: 110 },
  { key: 'name', title: 'Name', width: 220 },
  { key: 'contact', title: 'Contact Details', width: 260 },
  { key: 'category', title: 'Catagory', width: 140 },
  { key: 'status', title: 'Status', width: 120 },
  { key: 'created', title: 'Created', width: 150 },
];

export default function AdminClientScreen() {
  const dispatch = useDispatch();
  const rows = useSelector(getClients);
  const loading = useSelector(getClientsLoading);
  const saving = useSelector(getClientsSaving);
  const query = useSelector(getClientQuery);
  const modal = useSelector(getClientsModal);
  const selected = useSelector(getSelectedClient);

  const [localSearch, setLocalSearch] = useState(query.search || '');
  const [actionFor, setActionFor] = useState(null);

  const headerRef = useRef(null);
  const onBodyScroll = useCallback(e => {
    const x = e.nativeEvent.contentOffset.x;
    headerRef.current?.scrollTo?.({ x, animated: false });
  }, []);

  useEffect(() => {
    dispatch(fetchClients(query));
  }, [dispatch]);

  const filtered = useMemo(() => {
    const s = localSearch.trim().toLowerCase();
    const by = r =>
      [
        r.clientId,
        r.name,
        r.email,
        r.mobile,
        r.company?.companyName,
        r.category,
        r.subCategory,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return !s ? rows : rows.filter(r => by(r).includes(s));
  }, [rows, localSearch]);

  function openCreate() {
    dispatch(setSelectedClient(null));
    dispatch(setClientModal(true, 'create'));
  }
  function openEdit(item) {
    dispatch(setSelectedClient(item));
    dispatch(setClientModal(true, 'edit'));
  }
  function openView(item) {
    dispatch(setSelectedClient(item));
    dispatch(setClientModal(true, 'view'));
  }
  function onDeletePress(item) {
    Alert.alert('Delete Client', `Delete ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteClient(item.id)),
      },
    ]);
  }

  return (
    <View style={s.wrap}>
      {/* Section 1: Filters */}
      <Text style={s.h1}>Client Details</Text>
      <View style={s.filters}>
        <TextInput
          placeholder="Search name / email / phone / company"
          placeholderTextColor="#9aa0a6"
          style={s.input}
          value={localSearch}
          onChangeText={setLocalSearch}
        />
        <TouchableOpacity
          style={[s.btn, s.btnGrey]}
          onPress={() =>
            dispatch(fetchClients({ ...query, search: localSearch }))
          }
        >
          <Text style={s.btnTxt}>Apply / Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Add */}
      <View style={s.actionsBar}>
        <TouchableOpacity style={[s.btn, s.btnGreen]} onPress={openCreate}>
          <Text style={s.btnTxt}>+ Add Client</Text>
        </TouchableOpacity>
      </View>

      {/* Section 3: Table */}
      <ScrollView
        ref={headerRef}
        horizontal
        showsHorizontalScrollIndicator
        style={s.headerScroll}
      >
        <View style={[s.row, s.headerRow]}>
          {COLS.map(c => (
            <Text key={c.key} style={[s.th, { width: c.width }]}>
              {c.title}
            </Text>
          ))}
          <Text style={[s.th, { width: 100 }]}>Actions</Text>
        </View>
      </ScrollView>

      {loading ? (
        <View style={s.loading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it, i) => String(it.id ?? i)}
          renderItem={({ item }) => (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator
              onScroll={onBodyScroll}
              scrollEventThrottle={16}
            >
              <View style={s.row}>
                <Text style={[s.td, { width: 110 }]}>{item.clientId}</Text>

                <View
                  style={[
                    s.td,
                    {
                      width: 220,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    },
                  ]}
                >
                  {item.profilePictureUrl ? (
                    <Image
                      source={{ uri: item.profilePictureUrl }}
                      style={s.avatar}
                    />
                  ) : (
                    <View style={[s.avatar, { backgroundColor: '#e5e7eb' }]} />
                  )}
                  <View>
                    <Text style={s.name}>{item.name}</Text>
                    {!!item.company?.companyName && (
                      <Text style={s.subtle}>{item.company.companyName}</Text>
                    )}
                  </View>
                </View>

                <View style={[s.td, { width: 260 }]}>
                  <Text style={s.text}>{item.email}</Text>
                  {!!item.mobile && <Text style={s.subtle}>{item.mobile}</Text>}
                </View>

                <Text style={[s.td, { width: 140 }]}>
                  {item.category || '—'}
                </Text>

                <View
                  style={[
                    s.td,
                    {
                      width: 120,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    },
                  ]}
                >
                  <View
                    style={[
                      s.dot,
                      {
                        backgroundColor:
                          item.status === 'ACTIVE' ? '#22c55e' : '#9aa0a6',
                      },
                    ]}
                  />
                  <Text style={s.text}>{item.status || '—'}</Text>
                </View>

                <Text style={[s.td, { width: 150 }]}>
                  {(item.createdAt || '')
                    .slice(0, 10)
                    .split('-')
                    .reverse()
                    .join('/')}
                </Text>

                <View style={[s.td, { width: 100, alignItems: 'flex-end' }]}>
                  <TouchableOpacity
                    onPress={() => setActionFor(item)}
                    style={s.dotBtn}
                  >
                    <Text style={{ color: '#111' }}>⋮</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* 3-dot actions */}
      <Modal
        visible={!!actionFor}
        transparent
        animationType="fade"
        onRequestClose={() => setActionFor(null)}
      >
        <View style={s.backdrop}>
          <View style={s.cardSm}>
            <Action
              label="View"
              onPress={() => {
                openView(actionFor);
                setActionFor(null);
              }}
            />
            <Action
              label="Edit"
              onPress={() => {
                openEdit(actionFor);
              }}
            />
            <Action
              label="Delete"
              danger
              onPress={() => onDeletePress(actionFor)}
            />
            <Action
              label="Move to Deal"
              onPress={() => {
                /* plug navigation here */ Alert.alert(
                  'Move to Deal',
                  `Prefill deal using ${actionFor?.name}`,
                );
                setActionFor(null);
              }}
            />
            <TouchableOpacity
              onPress={() => setActionFor(null)}
              style={[s.btn, s.btnGrey, { marginTop: 8 }]}
            >
              <Text style={s.btnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add / Edit / View modal */}
      <ClientModal
        visible={modal.visible}
        mode={modal.mode}
        value={selected}
        saving={saving}
        onClose={() => dispatch(setClientModal(false))}
        onSubmit={payload => {
          if (modal.mode === 'create') dispatch(createClient(payload));
          else if (modal.mode === 'edit' && selected?.id)
            dispatch(updateClient(selected.id, payload));
        }}
      />
    </View>
  );
}

/* ---------- modal for view/edit/create ---------- */
function ClientModal({ visible, mode, value, onClose, onSubmit, saving }) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [client, setClient] = useState(blankClient());
  const [profilePicture, setProfilePicture] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    if (!visible) return;
    if (isEdit || isView) {
      setClient({
        name: value?.name || '',
        email: value?.email || '',
        mobile: value?.mobile || '',
        country: value?.country || '',
        gender: value?.gender || '',
        category: value?.category || '',
        subCategory: value?.subCategory || '',
        language: value?.language || '',
        receiveEmail: !!value?.receiveEmail,
        skype: value?.skype || '',
        linkedIn: value?.linkedIn || '',
        twitter: value?.twitter || '',
        facebook: value?.facebook || '',
        company: value?.company || blankCompany(),
      });
    } else {
      setClient(blankClient());
    }
    setProfilePicture(null);
    setCompanyLogo(null);
  }, [visible, isEdit, isView, value]);

  const pick = setter =>
    Alert.alert(
      'File picker',
      'Wire your picker here (DocumentPicker / ImagePicker).',
    );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>
            {isView ? 'Client Details' : isEdit ? 'Edit Client' : 'Add Client'}
          </Text>
          <ScrollView style={{ maxHeight: 480 }}>
            <Section title="Basic" />
            {[
              'name',
              'email',
              'mobile',
              'country',
              'gender',
              'category',
              'subCategory',
              'language',
              'skype',
              'linkedIn',
              'twitter',
              'facebook',
            ].map(k => (
              <Field
                key={k}
                label={k}
                value={String(client[k] ?? '')}
                onChange={t => setClient(s => ({ ...s, [k]: t }))}
                editable={!isView}
              />
            ))}
            <Toggle
              label="Receive Email"
              value={!!client.receiveEmail}
              onChange={v => setClient(s => ({ ...s, receiveEmail: v }))}
              disabled={isView}
            />

            <Section title="Company" />
            {Object.keys(blankCompany()).map(k => (
              <Field
                key={k}
                label={k}
                value={String(client.company?.[k] ?? '')}
                onChange={t =>
                  setClient(s => ({
                    ...s,
                    company: { ...(s.company || {}), [k]: t },
                  }))
                }
                editable={!isView}
              />
            ))}

            {!isView && (
              <>
                <Section title="Files" />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[s.btn, s.btnGrey]}
                    onPress={() => pick(setProfilePicture)}
                  >
                    <Text style={s.btnTxt}>
                      {profilePicture ? 'Change' : 'Pick'} Profile Picture
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.btn, s.btnGrey]}
                    onPress={() => pick(setCompanyLogo)}
                  >
                    <Text style={s.btnTxt}>
                      {companyLogo ? 'Change' : 'Pick'} Company Logo
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>

          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}
          >
            <TouchableOpacity onPress={onClose} style={[s.btn, s.btnGrey]}>
              <Text style={s.btnTxt}>Close</Text>
            </TouchableOpacity>
            {!isView && (
              <TouchableOpacity
                onPress={() =>
                  onSubmit({ client, profilePicture, companyLogo })
                }
                disabled={saving}
                style={[s.btn, s.btnBlue]}
              >
                <Text style={s.btnTxt}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- tiny UI primitives ---------- */
const Field = ({ label, value, onChange, editable = true }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={s.label}>{label.toUpperCase()}</Text>
    <TextInput
      style={[s.input, !editable && { opacity: 0.7 }]}
      value={value}
      onChangeText={onChange}
      editable={editable}
      placeholder={label}
      placeholderTextColor="#9aa0a6"
    />
  </View>
);
const Toggle = ({ label, value, onChange, disabled }) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={() => onChange(!value)}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    }}
  >
    <View style={[s.switch, value && { backgroundColor: '#22c55e' }]} />
    <Text style={s.text}>{label}</Text>
  </TouchableOpacity>
);
const Section = ({ title }) => <Text style={s.section}>{title}</Text>;
const Action = ({ label, danger, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ paddingVertical: 10 }}>
    <Text style={[s.action, danger && { color: '#ef4444' }]}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- helpers ---------- */
const blankCompany = () => ({
  companyName: '',
  website: '',
  officePhone: '',
  taxName: '',
  gstVatNo: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  shippingAddress: '',
});
const blankClient = () => ({
  name: '',
  email: '',
  mobile: '',
  country: '',
  gender: '',
  category: '',
  subCategory: '',
  language: '',
  receiveEmail: false,
  skype: '',
  linkedIn: '',
  twitter: '',
  facebook: '',
  company: blankCompany(),
});

/* ---------- styles ---------- */
const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff', padding: 12 },
  h1: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 8 },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f4f5f7',
    color: '#111',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 240,
  },

  headerScroll: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: { backgroundColor: '#fafafa' },
  th: { color: '#111', fontWeight: '700', paddingHorizontal: 8 },
  td: { color: '#111', paddingHorizontal: 8 },
  text: { color: '#374151' },
  subtle: { color: '#6b7280', fontSize: 12 },
  name: { color: '#111', fontWeight: '700' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotBtn: { backgroundColor: '#e5e7eb', padding: 8, borderRadius: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },

  btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  btnGrey: { backgroundColor: '#e5e7eb' },
  btnBlue: { backgroundColor: '#3b82f6' },
  btnGreen: { backgroundColor: '#22c55e' },
  btnTxt: { color: '#111', fontWeight: '700' },

  loading: { alignItems: 'center', justifyContent: 'center', padding: 24 },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 720,
    borderRadius: 16,
    padding: 16,
  },
  cardSm: {
    backgroundColor: '#fff',
    width: 320,
    borderRadius: 16,
    padding: 12,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 8 },
  section: { marginTop: 10, marginBottom: 6, fontWeight: '700', color: '#111' },
  label: { color: '#6b7280', fontSize: 12, marginBottom: 4 },
  action: { color: '#111', fontWeight: '600' },
});
