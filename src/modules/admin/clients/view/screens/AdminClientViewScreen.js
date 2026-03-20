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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabView, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { loadClient, loadClientStats } from '../store/actions';
import {
  selectClientDetail,
  selectClientDetailBusy,
  selectClientStats,
} from '../store/selectors';
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
  const dispatch = useDispatch();
  const stats = useSelector(selectClientStats);

  React.useEffect(() => {
    if (data?.id) {
      dispatch(loadClientStats(data.id));
    }
  }, [data?.id]);

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
      <View style={styles.headerCard}>
        {data.profilePictureUrl ? (
          <Image
            source={{ uri: data.profilePictureUrl }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.subText}>
            {company.companyName || 'No Company'}
          </Text>
        </View>

        {/* <TouchableOpacity style={styles.menuBtn}>
          <Text style={{ fontSize: 16 }}>⋮</Text>
        </TouchableOpacity> */}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        {/* TOTAL PROJECTS */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Projects</Text>
          <Text style={styles.statValue}>
            {stats?.projects?.projectCount ?? 0}
          </Text>
        </View>

        {/* TOTAL EARNINGS */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Earnings</Text>
          <Text style={styles.statValue}>
            {stats?.projects?.totalEarning ?? 0}
          </Text>
        </View>

        {/* DUE INVOICE */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Due Invoice</Text>
          <Text style={styles.statValue}>
            {stats?.invoices?.unpaidInvoiceCount ?? 0}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
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

const styles = {
  statCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',

    // shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    // elevation (Android)
    elevation: 3,
  },

  statTitle: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 8,
    fontWeight: '500',
  },

  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4f46e5', // purple like your UI
    letterSpacing: 1,
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 12,
  },

  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  subText: {
    color: '#6b7280',
    marginTop: 2,
  },

  menuBtn: {
    padding: 8,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 14,
  },

  simpleCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },

  bigNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4f46e5',
    marginTop: 6,
  },
};
