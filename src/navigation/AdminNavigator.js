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
import Icon from 'react-native-vector-icons/Feather'; // Feather is crisp and minimal

// --- REAL SCREENS (adjust paths if needed) ---
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

// Redux action
import { logout as logoutAction } from '../store/actions';

// Constants
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* -------------------------- ICON SET (Feather) -------------------------- 
   Map logical icons to Feather icon names. Adjust icons easily here.
   Feather reference: https://oblador.github.io/react-native-vector-icons/
*/
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

/* ---------------------------- SMALL HELPERS ---------------------------- */
const safeAnimate = () =>
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

/* ---------------------------- SUB-NAV STACKS ---------------------------- */
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
        component={AdminEmployeeViewScreen}
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

/* -------------------------- GLASS DRAWER ITEM -------------------------- 
   Memoized for performance. Uses vector Icon instead of image.
*/
const GlassDrawerItem = React.memo(function GlassDrawerItem({
  label,
  iconName,
  onPress,
  isActive = false,
  isSubItem = false,
  accessibilityLabel,
}) {
  const iconSize = isSubItem ? 18 : 20;
  const iconColor = isActive ? '#ffffff' : '#1E293B';
  const gradientColors = isActive
    ? ['rgba(37, 99, 235, 0.95)', 'rgba(29, 78, 216, 0.95)']
    : ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)'];

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        styles.glassItem,
        isSubItem && styles.glassSubItem,
        isActive && styles.glassItemActive,
        pressed && styles.glassItemPressed,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <LinearGradient
        colors={gradientColors}
        style={[
          styles.glassItemGradient,
          isSubItem && styles.glassSubItemGradient,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.glassItemContent}>
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={iconSize} color={iconColor} />
          </View>
          <Text
            style={[
              styles.glassItemLabel,
              isSubItem && styles.glassSubItemLabel,
            ]}
          >
            {label}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
});

/* ------------------------ Active-route helper hook ----------------------- */
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

/* --------------------------- CUSTOM DRAWER --------------------------- */
function AdminDrawerContent(props) {
  const { navigation, state } = props;
  const dispatch = useDispatch();
  const { activeTop, isActiveStack } = useActiveHelpers(state);

  const [leadsOpen, setLeadsOpen] = React.useState(false);
  const [hrOpen, setHrOpen] = React.useState(false);
  const [workOpen, setWorkOpen] = React.useState(false);
  const [financeOpen, setFinanceOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const animateToggle = useCallback(() => safeAnimate(), []);

  const navigateTo = useCallback(
    (stackName, childName) => {
      animateToggle();
      navigation.navigate(stackName, { screen: childName });
    },
    [navigation, animateToggle],
  );

  const GroupHeader = useCallback(({ label, iconName, open, onToggle }) => {
    return (
      <Pressable
        onPress={() => {
          safeAnimate();
          onToggle(v => !v);
        }}
        style={{ marginVertical: 6 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`${label} group`}
      >
        <LinearGradient
          colors={['rgba(241,245,249,0.95)', 'rgba(248,250,252,0.9)']}
          style={styles.hrHeaderGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
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
              style={open && styles.chevIconRotated}
            />
          </View>
        </LinearGradient>
      </Pressable>
    );
  }, []);

  // Logout handler - production hardened
  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            // Clear stored auth keys
            await Promise.all([
              AsyncStorage.removeItem('authToken'),
              AsyncStorage.removeItem('refreshToken'),
              AsyncStorage.removeItem('userData'),
            ]);
          } catch (err) {
            console.warn('Error clearing storage during logout', err);
          }

          // dispatch redux logout to reset in-memory state
          try {
            dispatch(logoutAction());
          } catch (e) {
            console.warn('Dispatch logout failed', e);
          }

          // move to Login route - reset navigation stack
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

          // For accessibility, announce navigation change
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
          colors={['rgba(37,99,235,0.15)', 'rgba(59,130,246,0.1)']}
          style={styles.headerGlass}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/icons/192x192.png')}
                style={styles.avatar}
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
      blurRadius={10}
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
                <GlassDrawerItem
                  label="Lead Contacts"
                  iconName={ICONS.leads}
                  onPress={() => navigateTo('Leads', 'LeadsContacts')}
                  isActive={isActiveStack('Leads', 'LeadsContacts')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Deals"
                  iconName={ICONS.leads}
                  onPress={() => navigateTo('Leads', 'AdminDeal')}
                  isActive={isActiveStack('Leads', 'AdminDeal')}
                  isSubItem
                />
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
                <GlassDrawerItem
                  label="Employees"
                  iconName={ICONS.hr}
                  onPress={() => navigateTo('HR', 'HREmployees')}
                  isActive={isActiveStack('HR', 'HREmployees')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Leaves"
                  iconName={ICONS.hr}
                  onPress={() => navigateTo('HR', 'HRLeaves')}
                  isActive={isActiveStack('HR', 'HRLeaves')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Holidays"
                  iconName={ICONS.hr}
                  onPress={() => navigateTo('HR', 'HRHolidays')}
                  isActive={isActiveStack('HR', 'HRHolidays')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Attendance"
                  iconName={ICONS.hr}
                  onPress={() => navigateTo('HR', 'HRAttendance')}
                  isActive={isActiveStack('HR', 'HRAttendance')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Designations"
                  iconName={ICONS.hr}
                  onPress={() => navigateTo('HR', 'HRDesignations')}
                  isActive={isActiveStack('HR', 'HRDesignations')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Departments"
                  iconName={ICONS.hr}
                  onPress={() => navigateTo('HR', 'HRDepartments')}
                  isActive={isActiveStack('HR', 'HRDepartments')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Appreciations"
                  iconName={ICONS.hr}
                  onPress={() => navigateTo('HR', 'HRAppreciations')}
                  isActive={isActiveStack('HR', 'HRAppreciations')}
                  isSubItem
                />
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
                <GlassDrawerItem
                  label="Projects"
                  iconName={ICONS.work}
                  onPress={() => navigateTo('Work', 'WorkProjects')}
                  isActive={isActiveStack('Work', 'WorkProjects')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Tasks"
                  iconName={ICONS.work}
                  onPress={() => navigateTo('Work', 'WorkTasks')}
                  isActive={isActiveStack('Work', 'WorkTasks')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Timesheets"
                  iconName={ICONS.work}
                  onPress={() => navigateTo('Work', 'WorkTimesheets')}
                  isActive={isActiveStack('Work', 'WorkTimesheets')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Project Roadmap"
                  iconName={ICONS.work}
                  onPress={() => navigateTo('Work', 'WorkRoadmap')}
                  isActive={isActiveStack('Work', 'WorkRoadmap')}
                  isSubItem
                />
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
                <GlassDrawerItem
                  label="Invoices"
                  iconName={ICONS.finance}
                  onPress={() => navigateTo('Finance', 'FinanceInvoices')}
                  isActive={isActiveStack('Finance', 'FinanceInvoices')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Credit Notes"
                  iconName={ICONS.finance}
                  onPress={() => navigateTo('Finance', 'FinanceDeals')}
                  isActive={isActiveStack('Finance', 'FinanceDeals')}
                  isSubItem
                />
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
                <GlassDrawerItem
                  label="Company Settings"
                  iconName={ICONS.settings}
                  onPress={() => navigateTo('Settings', 'CompanySettings')}
                  isActive={isActiveStack('Settings', 'CompanySettings')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Profile Settings"
                  iconName={ICONS.settings}
                  onPress={() => navigateTo('Settings', 'ProfileSettings')}
                  isActive={isActiveStack('Settings', 'ProfileSettings')}
                  isSubItem
                />
              </View>
            )}
          </View>

          {/* Logout - separated visually */}
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

/* ------------------------- DRAWER NAVIGATOR (export) ------------------------- */
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
        component={() => (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>Messages</Text>
          </View>
        )}
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

/* -------------------------------- STYLES -------------------------------- */
const styles = StyleSheet.create({
  drawerBackground: { flex: 1 },
  drawerGradient: { flex: 1 },
  scrollContent: { paddingTop: 0, flexGrow: 1 },
  headerSection: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  headerGlass: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: { alignItems: 'center' },
  avatarContainer: {
    width: 90,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#3B82F6',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 32 },
  welcomeText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  navigationSection: { flex: 1, paddingHorizontal: 16 },
  glassItem: { marginVertical: 4, borderRadius: 16, overflow: 'hidden' },
  glassSubItem: { marginLeft: 20, marginVertical: 2, borderRadius: 12 },
  glassItemGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  glassSubItemGradient: { borderRadius: 12 },
  glassItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemIcon: { width: 24, height: 24, tintColor: '#1E293B' },
  subItemIcon: { width: 20, height: 20, tintColor: '#1E293B' },
  glassItemLabel: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  glassSubItemLabel: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  glassItemActive: { transform: [{ scale: 0.98 }] },
  glassItemPressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
  hrHeaderGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 4,
  },
  hrHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  hrTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  hrIcon: { width: 24, height: 24, tintColor: '#1E293B', marginRight: 12 },
  hrTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  chevIconRotated: { transform: [{ rotate: '90deg' }] },
  hrList: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(59,130,246,0.18)',
    marginLeft: 16,
    marginBottom: 4,
  },
});
