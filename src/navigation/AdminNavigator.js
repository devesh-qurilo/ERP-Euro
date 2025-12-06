// src/navigation/AdminNavigator.js
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

// Screens (keep your existing imports)
import AdminLeadContactsScreen from '../modules/admin/leads/screens/AdminLeadContactsScreen';
import AdminProfileSettingsScreen from '../modules/admin/settings/screens/AdminProfileSettingsScreen';
import AdminCompanySettingsScreen from '../modules/admin/settings/screens/AdminCompanySettingsScreen';
import AdminDesignationsScreen from '../modules/admin/hr/designations/screens/AdminDesignationsScreen';
import AdminDepartmentsScreen from '../modules/admin/hr/departments/screens/AdminDepartmentsScreen';
import AdminEmployeesScreen from '../modules/admin/hr/employees/screens/AdminEmployeesScreen';
import AdminEmployeeViewScreen from '../modules/admin/hr/employees/screens/AdminEmployeeViewScreen';
import AdminLeavesScreen from '../modules/admin/hr/leaves/screens/AdminLeavesScreen';
import AdminHolidaysScreen from '../modules/admin/hr/holidays/screens/AdminHolidaysScreen';
import AdminAttendanceScreen from '../modules/admin/hr/attendance/screens/AdminAttendanceScreen';
import AdminWorkProjectsScreen from '../modules/admin/work/projects/screens/AdminWorkProjectsScreen';
import AdminProjectViewScreen from '../modules/admin/work/projects/screens/AdminProjectViewScreen';
import AdminFinanceInvoice from '../modules/admin/finance/invoice/screens/AdminFinanceInvoice';
import InvoiceReceiptsScreen from '../modules/admin/finance/invoice/screens/InvoiceReceiptsScreen';
import InvoicePaymentsScreen from '../modules/admin/finance/invoice/screens/InvoicePaymentsScreen';
import CreditNotesScreen from '../modules/admin/finance/invoice/screens/CreditNotesScreen';
import AdminFinanceCreditNotes from '../modules/admin/finance/credit-notes/screens/AdminFinanceCreditNotes';
import AdminClientsScreen from '../modules/admin/clients/screens/AdminClientsScreen';
import AdminClientViewScreen from '../modules/admin/clients/view/screens/AdminClientViewScreen';
import AdminDealScreen from '../modules/admin/leads/deals/screens/AdminDealScreen';
import AdminDealViewScreen from '../modules/admin/leads/deals/screens/AdminDealViewScreen';
import AdminWorkTaskScreen from '../modules/admin/work/Task/screens/AdminWorkTaskScreen';
import AdminTaskDetailScreen from '../modules/admin/work/tasks/screens/AdminTaskDetailScreen';
import AdminTimesheetsScreen from '../modules/admin/work/timesheets/screens/AdminWorkTimesheetScreen';
import AdminAppreciationsScreen from '../modules/admin/hr/appreciations/screens/AdminAppreciationsScreen';
import AdminLeadViewScreen from '../modules/admin/leads/screens/AdminLeadViewScreen';
import AdminDealKanbanScreen from '../modules/admin/leads/deals/kanban/screens/AdminDealKanbanScreen';
import AdminDashboardScreen from '../modules/admin/dashboard/screens/AdminDashboardScreen';
// import AdminMessageViewScreen, {
//   AdminMessageRoomScreen,
// } from '../modules/admin/messages/Screens/AdminEmployeeViewScreen';
import AdminMessageViewScreen from '../modules/admin/messages/screens/AdminEmployeeViewScreen';
import AdminMessageRoomScreen from '../modules/admin/messages/screens/AdminMessageRoomScreen';

// Redux action
import { logout as logoutAction } from '../store/actions';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

// Enable LayoutAnimation (Android)
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* Icons */
const ICONS = {
  dashboard: 'home',
  clients: 'users',
  leads: 'file-text',
  hr: 'users',
  work: 'briefcase',
  finance: 'dollar-sign',
  messages: 'message-circle',
  settings: 'settings',
  logout: 'log-out',
  chevronRight: 'chevron-right',
  chevronDown: 'chevron-down',
};

/* small helpers */
const safeAnimate = () =>
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
const ACTIVE_GRADIENT = ['rgba(37,99,235,0.95)', 'rgba(29,78,216,0.95)'];

/* ----------------------- Sub stacks (unchanged) ----------------------- */
function LeadsStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LeadsContacts"
    >
      <Stack.Screen name="AdminDeal" component={AdminDealScreen} />
      <Stack.Screen name="AdminDealView" component={AdminDealViewScreen} />
      <Stack.Screen name="LeadsContacts" component={AdminLeadContactsScreen} />
      <Stack.Screen name="AdminDealKanban" component={AdminDealKanbanScreen} />
      <Stack.Screen
        name="AdminLeadViewScreen"
        component={AdminLeadViewScreen}
      />
    </Stack.Navigator>
  );
}

function Clients() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AdminClients"
    >
      <Stack.Screen name="AdminClients" component={AdminClientsScreen} />
      <Stack.Screen name="AdminClientView" component={AdminClientViewScreen} />
    </Stack.Navigator>
  );
}

function HRStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HREmployees"
    >
      <Stack.Screen name="HREmployees" component={AdminEmployeesScreen} />
      <Stack.Screen
        name="AdminEmployeeView"
        component={AdminMessageViewScreen}
        options={{ title: 'Employee' }}
      />
      <Stack.Screen name="HRLeaves" component={AdminLeavesScreen} />
      <Stack.Screen name="HRHolidays" component={AdminHolidaysScreen} />
      <Stack.Screen name="HRAttendance" component={AdminAttendanceScreen} />
      <Stack.Screen name="HRDesignations" component={AdminDesignationsScreen} />
      <Stack.Screen name="HRDepartments" component={AdminDepartmentsScreen} />
      <Stack.Screen
        name="HRAppreciations"
        component={AdminAppreciationsScreen}
      />
    </Stack.Navigator>
  );
}

function WorkStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="WorkProjects"
    >
      <Stack.Screen name="WorkProjects" component={AdminWorkProjectsScreen} />
      <Stack.Screen name="WorkTasks" component={AdminWorkTaskScreen} />
      <Stack.Screen name="AdminTaskDetail" component={AdminTaskDetailScreen} />
      <Stack.Screen
        name="AdminProjectView"
        component={AdminProjectViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="WorkTimesheets" component={AdminTimesheetsScreen} />
    </Stack.Navigator>
  );
}

function FinanceStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="FinanceInvoices"
    >
      <Stack.Screen name="FinanceInvoices" component={AdminFinanceInvoice} />
      <Stack.Screen name="FinanceDeals" component={AdminFinanceCreditNotes} />
      <Stack.Screen name="CreditNotesScreen" component={CreditNotesScreen} />
      <Stack.Screen
        name="InvoiceReceiptsScreen"
        component={InvoiceReceiptsScreen}
      />
      <Stack.Screen
        name="InvoicePaymentsScreen"
        component={InvoicePaymentsScreen}
      />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AdminMessageView"
    >
      <Stack.Screen
        name="AdminMessageView"
        component={AdminMessageViewScreen}
      />
      <Stack.Screen
        name="AdminMessageRoom"
        component={AdminMessageRoomScreen}
        options={{
          headerShown: true,
          headerTitle: 'Chat',
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerBackground: () => (
            <LinearGradient
              colors={['rgba(37,99,235,0.95)', 'rgba(29,78,216,0.95)']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="CompanySettings"
    >
      <Stack.Screen
        name="CompanySettings"
        component={AdminCompanySettingsScreen}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={AdminProfileSettingsScreen}
      />
    </Stack.Navigator>
  );
}

/* ----------------------- Drawer item with borders ----------------------- */
const ITEM_HEIGHT = 52;
const SUB_ITEM_HEIGHT = 44;

const GlassDrawerItem = React.memo(
  function GlassDrawerItem({
    label,
    iconName,
    onPress,
    isActive = false,
    isSubItem = false,
    accessibilityLabel,
  }) {
    const iconSize = isSubItem ? 18 : 20;
    const containerStyle = [
      styles.glassItem,
      isSubItem && styles.glassSubItem,
      { height: isSubItem ? SUB_ITEM_HEIGHT : ITEM_HEIGHT },
      isActive && styles.glassItemActive,
    ];

    // Left active border for top-level items, sub-active border for subitems
    const leftBorder = isActive
      ? isSubItem
        ? styles.subActiveLeftBorder
        : styles.activeLeftBorder
      : null;

    const content = isActive ? (
      <LinearGradient
        colors={ACTIVE_GRADIENT}
        style={[
          styles.glassItemGradientActive,
          { height: isSubItem ? SUB_ITEM_HEIGHT : ITEM_HEIGHT },
        ]}
      >
        <View style={[styles.glassItemContent, leftBorder]}>
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={iconSize} color="#fff" />
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.glassItemLabel,
              isSubItem && styles.glassSubItemLabel,
              styles.glassItemLabelActive,
            ]}
          >
            {label}
          </Text>
        </View>
      </LinearGradient>
    ) : (
      <View
        style={[
          styles.glassItemGradientFallback,
          { height: isSubItem ? SUB_ITEM_HEIGHT : ITEM_HEIGHT },
        ]}
      >
        <View style={[styles.glassItemContent, leftBorder]}>
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={iconSize} color="#1E293B" />
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.glassItemLabel,
              isSubItem && styles.glassSubItemLabel,
            ]}
          >
            {label}
          </Text>
        </View>
      </View>
    );

    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        style={({ pressed }) => [
          containerStyle,
          pressed && styles.glassItemPressed,
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
      >
        {content}
      </Pressable>
    );
  },
  (p, n) =>
    p.label === n.label &&
    p.isActive === n.isActive &&
    p.isSubItem === n.isSubItem &&
    p.onPress === n.onPress,
);

/* --------------------------- active-route helper --------------------------- */
function useActiveHelpers(drawerState) {
  const activeTop = drawerState.routeNames[drawerState.index];
  const routes = drawerState.routes;

  const getActiveChild = stackName => {
    const route = routes.find(r => r.name === stackName);
    const nested = route?.state;
    if (nested && typeof nested.index === 'number') {
      return (
        nested.routeNames?.[nested.index] || nested.routes?.[nested.index]?.name
      );
    }
    const nr = route?.state?.routes?.[route.state?.index];
    return nr?.name;
  };

  const isActiveStack = (stackName, childName) => {
    if (activeTop !== stackName) return false;
    const child = getActiveChild(stackName);
    return child === childName;
  };

  return { activeTop, isActiveStack };
}

/* --------------------------- Drawer content --------------------------- */
function AdminDrawerContent(props) {
  const { navigation, state } = props;
  const dispatch = useDispatch();
  const { activeTop, isActiveStack } = useActiveHelpers(state);

  const [leadsOpen, setLeadsOpen] = React.useState(false);
  const [hrOpen, setHrOpen] = React.useState(false);
  const [workOpen, setWorkOpen] = React.useState(false);
  const [financeOpen, setFinanceOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const animateToggle = useCallback(
    () => requestAnimationFrame(() => safeAnimate()),
    [],
  );
  const navigateTo = useCallback(
    (stackName, childName) => {
      animateToggle();
      navigation.navigate(stackName, { screen: childName });
    },
    [navigation, animateToggle],
  );

  // memoized children lists
  const leadChildren = useMemo(
    () => [
      { label: 'Lead Contacts', icon: ICONS.leads, child: 'LeadsContacts' },
      { label: 'Deals', icon: ICONS.leads, child: 'AdminDeal' },
    ],
    [],
  );

  const hrChildren = useMemo(
    () => [
      { label: 'Employees', icon: ICONS.hr, child: 'HREmployees' },
      { label: 'Leaves', icon: ICONS.hr, child: 'HRLeaves' },
      { label: 'Holidays', icon: ICONS.hr, child: 'HRHolidays' },
      { label: 'Attendance', icon: ICONS.hr, child: 'HRAttendance' },
      { label: 'Designations', icon: ICONS.hr, child: 'HRDesignations' },
      { label: 'Departments', icon: ICONS.hr, child: 'HRDepartments' },
      { label: 'Appreciations', icon: ICONS.hr, child: 'HRAppreciations' },
    ],
    [],
  );

  const workChildren = useMemo(
    () => [
      { label: 'Projects', icon: ICONS.work, child: 'WorkProjects' },
      { label: 'Tasks', icon: ICONS.work, child: 'WorkTasks' },
      { label: 'Timesheets', icon: ICONS.work, child: 'WorkTimesheets' },
      { label: 'Project Roadmap', icon: ICONS.work, child: 'WorkRoadmap' },
    ],
    [],
  );

  const financeChildren = useMemo(
    () => [
      { label: 'Invoices', icon: ICONS.finance, child: 'FinanceInvoices' },
      { label: 'Credit Notes', icon: ICONS.finance, child: 'FinanceDeals' },
    ],
    [],
  );

  const settingsChildren = useMemo(
    () => [
      {
        label: 'Company Settings',
        icon: ICONS.settings,
        child: 'CompanySettings',
      },
      {
        label: 'Profile Settings',
        icon: ICONS.settings,
        child: 'ProfileSettings',
      },
    ],
    [],
  );

  const GroupHeader = useCallback(
    ({ label, iconName, open, onToggle }) => {
      return (
        <Pressable
          onPress={() => {
            animateToggle();
            onToggle(v => !v);
          }}
          style={styles.groupHeaderPressable}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={`${label} group`}
        >
          <View style={styles.hrHeaderBox}>
            <View style={styles.hrHeaderContent}>
              <View style={styles.hrTitleContainer}>
                <Icon
                  name={iconName}
                  size={18}
                  color="#1E293B"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.hrTitle}>{label}</Text>
              </View>
              <Icon
                name={open ? ICONS.chevronDown : ICONS.chevronRight}
                size={16}
                color="#006afeff"
              />
            </View>
          </View>
        </Pressable>
      );
    },
    [animateToggle],
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await Promise.all([
              AsyncStorage.removeItem('authToken'),
              AsyncStorage.removeItem('refreshToken'),
              AsyncStorage.removeItem('userData'),
            ]);
          } catch (err) {
            console.warn('Error clearing storage during logout', err);
          }

          try {
            dispatch(logoutAction());
          } catch (e) {
            console.warn('Dispatch logout failed', e);
          }

          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

          try {
            AccessibilityInfo.announceForAccessibility(
              'Logged out. Redirecting to login.',
            );
          } catch (_) {}
        },
      },
    ]);
  }, [dispatch, navigation]);

  const HeaderSection = useMemo(
    () => (
      <View style={styles.headerSection}>
        <LinearGradient
          colors={['rgba(37,99,235,0.12)', 'rgba(59,130,246,0.06)']}
          style={styles.headerGlass}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/icons/192x192.png')}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.welcomeText}>Skova</Text>
          </View>
        </LinearGradient>
      </View>
    ),
    [],
  );

  return (
    <ImageBackground
      source={require('../assets/icons/dashicons_awards.png')}
      style={styles.drawerBackground}
      blurRadius={Platform.OS === 'ios' ? 10 : 0}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={styles.drawerGradient}
      >
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
        >
          {HeaderSection}

          <View style={styles.navigationSection}>
            <GlassDrawerItem
              label="Dashboard"
              iconName={ICONS.dashboard}
              onPress={() => navigation.navigate('AdminDashboard')}
              isActive={activeTop === 'AdminDashboard'}
            />

            <GroupHeader
              label="Leads"
              iconName={ICONS.leads}
              open={leadsOpen}
              onToggle={setLeadsOpen}
            />
            {leadsOpen && (
              <View style={styles.hrList}>
                {leadChildren.map((item, idx) => (
                  <View key={item.label}>
                    <GlassDrawerItem
                      label={item.label}
                      iconName={item.icon}
                      onPress={() => navigateTo('Leads', item.child)}
                      isActive={isActiveStack('Leads', item.child)}
                      isSubItem
                    />
                    {/* sub-item separator */}
                    {idx < leadChildren.length - 1 && (
                      <View style={styles.subItemSeparator} />
                    )}
                  </View>
                ))}
              </View>
            )}

            <GlassDrawerItem
              label="Clients"
              iconName={ICONS.clients}
              onPress={() => navigation.navigate('Clients')}
              isActive={activeTop === 'Clients'}
            />

            <GroupHeader
              label="HR"
              iconName={ICONS.hr}
              open={hrOpen}
              onToggle={setHrOpen}
            />
            {hrOpen && (
              <View style={styles.hrList}>
                {hrChildren.map((item, idx) => (
                  <View key={item.label}>
                    <GlassDrawerItem
                      label={item.label}
                      iconName={item.icon}
                      onPress={() => navigateTo('HR', item.child)}
                      isActive={isActiveStack('HR', item.child)}
                      isSubItem
                    />
                    {idx < hrChildren.length - 1 && (
                      <View style={styles.subItemSeparator} />
                    )}
                  </View>
                ))}
              </View>
            )}

            <GroupHeader
              label="Work"
              iconName={ICONS.work}
              open={workOpen}
              onToggle={setWorkOpen}
            />
            {workOpen && (
              <View style={styles.hrList}>
                {workChildren.map((item, idx) => (
                  <View key={item.label}>
                    <GlassDrawerItem
                      label={item.label}
                      iconName={item.icon}
                      onPress={() => navigateTo('Work', item.child)}
                      isActive={isActiveStack('Work', item.child)}
                      isSubItem
                    />
                    {idx < workChildren.length - 1 && (
                      <View style={styles.subItemSeparator} />
                    )}
                  </View>
                ))}
              </View>
            )}

            <GroupHeader
              label="Finance"
              iconName={ICONS.finance}
              open={financeOpen}
              onToggle={setFinanceOpen}
            />
            {financeOpen && (
              <View style={styles.hrList}>
                {financeChildren.map((item, idx) => (
                  <View key={item.label}>
                    <GlassDrawerItem
                      label={item.label}
                      iconName={item.icon}
                      onPress={() => navigateTo('Finance', item.child)}
                      isActive={isActiveStack('Finance', item.child)}
                      isSubItem
                    />
                    {idx < financeChildren.length - 1 && (
                      <View style={styles.subItemSeparator} />
                    )}
                  </View>
                ))}
              </View>
            )}

            <GlassDrawerItem
              label="Messages"
              iconName={ICONS.messages}
              onPress={() => navigation.navigate('Messages')}
              isActive={activeTop === 'Messages'}
            />

            <GroupHeader
              label="Settings"
              iconName={ICONS.settings}
              open={settingsOpen}
              onToggle={setSettingsOpen}
            />
            {settingsOpen && (
              <View style={styles.hrList}>
                {settingsChildren.map((item, idx) => (
                  <View key={item.label}>
                    <GlassDrawerItem
                      label={item.label}
                      iconName={item.icon}
                      onPress={() => navigateTo('Settings', item.child)}
                      isActive={isActiveStack('Settings', item.child)}
                      isSubItem
                    />
                    {idx < settingsChildren.length - 1 && (
                      <View style={styles.subItemSeparator} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={{ marginTop: 16 }} />
          <GlassDrawerItem
            label="Logout"
            iconName={ICONS.logout}
            onPress={handleLogout}
            isActive={false}
            accessibilityLabel="Logout button"
          />
        </DrawerContentScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

/* --------------------- Drawer navigator (export) --------------------- */
export default function AdminNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerBackground: () => (
          <LinearGradient
            colors={['rgba(37,99,235,0.95)', 'rgba(29,78,216,0.95)']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        drawerStyle: { width: width * 0.8, backgroundColor: 'transparent' },
        sceneContainerStyle: { backgroundColor: '#F8FAFC' },
      }}
      drawerContent={props => <AdminDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Drawer.Screen
        name="Clients"
        component={Clients}
        options={{ title: 'Clients', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesStack}
        options={{ title: 'Messages', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="Leads"
        component={LeadsStack}
        options={{ title: 'Leads', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="HR"
        component={HRStack}
        options={{ title: 'HR', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="Work"
        component={WorkStack}
        options={{ title: 'Work', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="Finance"
        component={FinanceStack}
        options={{ title: 'Finance', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{ title: 'Settings', drawerItemStyle: { height: 0 } }}
      />
    </Drawer.Navigator>
  );
}

/* -------------------------------- Styles -------------------------------- */
const styles = StyleSheet.create({
  drawerBackground: { flex: 1 },
  drawerGradient: { flex: 1 },
  scrollContent: { paddingTop: 0, flexGrow: 1 },

  headerSection: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  headerGlass: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.12)',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 3,
    alignItems: 'center',
  },
  headerContent: { alignItems: 'center' },
  avatarContainer: {
    width: 74,
    height: 74,
    borderRadius: 74 / 2,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: Platform.OS === 'android' ? 1 : 0,
  },
  avatar: { width: '100%', height: '100%' },
  welcomeText: { fontSize: 14, color: '#475569', fontWeight: '600' },

  navigationSection: { flex: 1, paddingHorizontal: 14, paddingBottom: 24 },

  // drawer items & containers
  glassItem: {
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    // tab border: subtle rounded outline
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.03)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  glassSubItem: {
    marginLeft: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.02)',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  // Active left border for top-level item
  activeLeftBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    paddingLeft: 6, // account for border so content doesn't shift
  },

  // Slight left accent for active subitem
  subActiveLeftBorder: {
    borderLeftWidth: 3,
    borderLeftColor: '#60A5FA',
    paddingLeft: 6,
  },

  glassItemGradientActive: {
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },

  glassItemGradientFallback: {
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  glassItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  glassItemLabel: {
    fontSize: Platform.OS === 'android' ? 15 : 15,
    color: '#0f172a',
    fontWeight: '600',
    flexShrink: 1,
  },

  glassSubItemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },

  glassItemLabelActive: {
    color: '#ffffff',
  },

  glassItemActive: {
    transform: [{ scale: 0.998 }],
  },

  glassItemPressed: {
    opacity: 0.95,
  },

  // Group header with box border to look like a mini-table header
  groupHeaderPressable: {
    marginVertical: 6,
  },

  hrHeaderBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.06)',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: Platform.OS === 'android' ? 0 : 1,
  },

  hrHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },

  hrTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  hrTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },

  hrList: {
    marginTop: 6,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(59,130,246,0.06)',
    marginLeft: 12,
    marginBottom: 4,
    // sub-table border box to group subitems visually
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingRight: 8,
  },

  // separator between sub items to mimic table rows
  subItemSeparator: {
    height: 1,
    backgroundColor: 'rgba(15,23,42,0.03)',
    marginHorizontal: 8,
    marginTop: 6,
  },
});
