import * as React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { loadClient } from '../store/actions';
import { selectClientDetail, selectClientDetailBusy } from '../store/selectors';
import ClientProjectsTab from '../projects/ClientProjectsTab';

// ---------- Profile Tab ----------
function ProfileTab() {
  const data = useSelector(selectClientDetail);
  const busy = useSelector(selectClientDetailBusy);

  if (busy)
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading…</Text>
      </View>
    );
  if (!data)
    return (
      <View style={{ padding: 16 }}>
        <Text>No data.</Text>
      </View>
    );

  const company = data.company || {};
  const row = (label, value) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}
    >
      <Text style={{ color: '#6b7280' }}>{label}</Text>
      <Text style={{ color: '#111827', maxWidth: '65%', textAlign: 'right' }}>
        {value ?? '—'}
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      {/* top card */}
      <View
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          flexDirection: 'row',
        }}
      >
        {data.profilePictureUrl ? (
          <Image
            source={{ uri: data.profilePictureUrl }}
            style={{ width: 56, height: 56, borderRadius: 12, marginRight: 12 }}
          />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              marginRight: 12,
              backgroundColor: '#e5e7eb',
            }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{data.name}</Text>
          <Text style={{ color: '#6b7280' }}>{company.companyName || '—'}</Text>
        </View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Information */}
      <View
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: '700', marginBottom: 12 }}>
          Profile Information
        </Text>
        {row('Name', data.name)}
        {row('Email', data.email)}
        {row('Gender', data.gender || '—')}
        {row('Company Name', company.companyName || '—')}
        {row('Company Logo', company.companyLogoUrl ? 'Attached' : '—')}
        {row('Mobile', data.mobile)}
        {row('Office Phone No.', company.officePhone || '—')}
        {row('Official Website', company.website || '—')}
        {row('GST/VAT No.', company.gstVatNo || '—')}
        {row('Address', company.address || '—')}
        {row('State', company.state || '—')}
        {row('Country', data.country || '—')}
        {row('Postal Code', company.postalCode || '—')}
        {row('Language', data.language || '—')}
      </View>

      {/* Quick pie placeholders like screenshot (static for now) */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Projects</Text>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#e5e7eb',
              alignSelf: 'center',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Invoices</Text>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#e5e7eb',
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// ---------- Placeholder tabs (wire next) ----------
const Placeholder = ({ label }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#6b7280' }}>{label} — coming up</Text>
  </View>
);

// ---------- Main screen with TabView ----------
export default function AdminClientViewScreen() {
  const layout = useWindowDimensions();
  const route = useRoute();
  const dispatch = useDispatch();
  const id =
    route?.params?.id ?? route?.params?.clientId ?? route?.params?.client?.id;

  React.useEffect(() => {
    if (id) dispatch(loadClient(id));
  }, [id, dispatch]);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'profile', title: 'Profile' },
    { key: 'projects', title: 'Projects' },
    { key: 'invoices', title: 'Invoices' },
    { key: 'payments', title: 'Payments' },
    { key: 'creditNotes', title: 'Credit Note' },
    { key: 'documents', title: 'Documents' },
    { key: 'notes', title: 'Notes' },
  ]);

  const renderScene = SceneMap({
    profile: ProfileTab,
    projects: ClientProjectsTab,
    invoices: () => <Placeholder label="Invoices" />,
    payments: () => <Placeholder label="Payments" />,
    creditNotes: () => <Placeholder label="Credit Notes" />,
    documents: () => <Placeholder label="Documents" />,
    notes: () => <Placeholder label="Notes" />,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={{ backgroundColor: '#111827', height: 2 }}
          style={{ backgroundColor: '#fff' }}
          labelStyle={{ color: '#111827', textTransform: 'none' }}
          inactiveColor="#6b7280"
          activeColor="#111827"
        />
      )}
    />
  );
}
