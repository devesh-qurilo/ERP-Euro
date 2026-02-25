// src/modules/admin/clients/view/screens/AdminClientViewScreen.js
import * as React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { loadClient } from '../store/actions';
import { selectClientDetail, selectClientDetailBusy } from '../store/selectors';
import ClientProjectsTab from '../projects/ClientProjectsTab';
import ClientInvoicesTab from '../invoices/ClientInvoicesTab';
import ClientPaymentsTab from '../payments/ClientPaymentsTab';
import ClientCreditNotesTab from '../credit-notes/ClientCreditNotesTab';
import ClientDocumentsTab from '../documents/ClientDocumentsTab';
import ClientNotesTab from '../notes/ClientNotesTab';

/* ---------------- Profile Tab (unchanged) ---------------- */
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

/* ---------------- Placeholder ---------------- */
const Placeholder = ({ label }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#6b7280' }}>{label} — coming up</Text>
  </View>
);

/* ---------------- Main Screen ---------------- */
export default function AdminClientViewScreen() {
  const layout = useWindowDimensions();
  const route = useRoute();
  const dispatch = useDispatch();

  // Resolve client identifiers from the navigation payload
  //   const navClient = route?.params?.client || null;
  //   const paramClientId =
  //     route?.params?.clientId ?? route?.params?.id ?? navClient?.clientId;

  const navClient = route?.params?.client || null;
  // numeric DB id for /clients/:id
  const paramId = route?.params?.id ?? navClient?.id;
  // external code like "CLI001" for children tabs
  const paramClientId = route?.params?.clientId ?? navClient?.clientId;
  const clientId = route?.params?.id;
  // console.log('bhaii client routes', route?.params?.id);

  // Load full client detail for Profile tab
  //   React.useEffect(() => {
  //     if (paramClientId) dispatch(loadClient(paramClientId));
  //   }, [paramClientId, dispatch]);

  React.useEffect(() => {
    if (paramId) dispatch(loadClient(paramId));
  }, [paramId, dispatch]);

  // Build routes WITH client data embedded (so each tab receives it)
  const [index, setIndex] = React.useState(0);
  const routes = React.useMemo(
    () => [
      {
        key: 'profile',
        title: 'Profile',
        clientId: paramClientId,
        client: navClient,
      },
      {
        key: 'projects',
        title: 'Projects',
        clientId: paramClientId,
        client: navClient,
      },
      {
        key: 'invoices',
        title: 'Invoices',
        clientId: paramClientId,
        client: navClient,
      },
      {
        key: 'payments',
        title: 'Payments',
        clientId: paramClientId,
        client: navClient,
      },
      {
        key: 'creditNotes',
        title: 'Credit Note',
        clientId: paramClientId,
        client: navClient,
      },
      {
        key: 'documents',
        title: 'Documents',
        clientId: paramClientId,
        client: navClient,
      },
      {
        key: 'notes',
        title: 'Notes',
        clientId: paramClientId,
        client: navClient,
      },
    ],
    [paramClientId, navClient],
  );

  // DO NOT use SceneMap; inject route params manually to each tab
  const renderScene = ({ route }) => {
    const injected = {
      ...route,
      params: { clientId: route.clientId, client: route.client },
    };

    switch (route.key) {
      case 'profile':
        return <ProfileTab />;
      case 'projects':
        return <ClientProjectsTab route={injected} />;
      case 'invoices':
        return <ClientInvoicesTab route={injected} />;
      case 'payments':
        return <ClientPaymentsTab route={injected} />;
      case 'creditNotes':
        return <ClientCreditNotesTab route={injected} />;
      case 'documents':
        return <ClientDocumentsTab route={clientId} />;
      case 'notes':
        return <ClientNotesTab route={clientId} />;
      default:
        return null;
    }
  };

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
