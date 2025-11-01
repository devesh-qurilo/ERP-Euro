// src/navigation/AdminNavigator.js
import React from 'react';
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
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

// REAL SCREENS YOU HAVE
import AdminLeadContactsScreen from '../modules/admin/leads/screens/AdminLeadContactsScreen';
import AdminProfileSettingsScreen from '../modules/admin/settings/screens/AdminProfileSettingsScreen';
import AdminCompanySettingsScreen from '../modules/admin/settings/screens/AdminCompanySettingsScreen';
import AdminDesignationsScreen from '../modules/admin/hr/designations/screens/AdminDesignationsScreen';
import AdminDepartmentsScreen from '../modules/admin/hr/departments/screens/AdminDepartmentsScreen';

// ---------------------------------------------------------------------------
// PLACEHOLDERS (swap with real screens later)
// ---------------------------------------------------------------------------
const P = ({ title }) => (
  <View style={styles.screenWrap}>
    <Text style={styles.screenTitle}>{title}</Text>
    <Text style={styles.dim}>Plug your real component here.</Text>
  </View>
);

const AdminDashboardScreen = () => <P title="Admin • Dashboard" />;
const AdminClientsScreen = () => <P title="Admin • Clients" />;
const AdminMessagesScreen = () => <P title="Admin • Messages" />;

const AdminLeadsDealsScreen = () => <P title="Leads • Deals" />;

const AdminHREmployeesScreen = () => <P title="HR • Employees" />;
const AdminHRLeavesScreen = () => <P title="HR • Leaves" />;
const AdminHRHolidaysScreen = () => <P title="HR • Holidays" />;
const AdminHRAttendanceScreen = () => <P title="HR • Attendance" />;
const AdminHRDesignationsScreen = () => <P title="HR • Designations" />;
const AdminHRDepartmentsScreen = () => <P title="HR • Departments" />;
const AdminHRAppreciationsScreen = () => <P title="HR • Appreciations" />;

const AdminWorkProjectsScreen = () => <P title="Work • Projects" />;
const AdminWorkTasksScreen = () => <P title="Work • Tasks" />;
const AdminWorkTimesheetsScreen = () => <P title="Work • Timesheets" />;
const AdminWorkRoadmapScreen = () => <P title="Work • Project Roadmap" />;

const AdminFinanceInvoicesScreen = () => <P title="Finance • Invoices" />;
const AdminFinanceDealsScreen = () => <P title="Finance • Deals" />;

// ---------------------------------------------------------------------------
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// ICONS
// ---------------------------------------------------------------------------
const icons = {
  dashboard: require('../assets/icons/dashboard.png'),
  clients: require('../assets/icons/dashicons_awards.png'),
  leads: require('../assets/icons/dashicons_awards.png'),
  hr: require('../assets/icons/HRMS.png'),
  work: require('../assets/icons/HRMS.png'),
  finance: require('../assets/icons/dashicons_awards.png'),
  messages: require('../assets/icons/Messages.png'),
  settings: require('../assets/icons/dashicons_awards.png'),
  chevronDown: require('../assets/icons/dashicons_awards.png'),
  chevronRight: require('../assets/icons/dashicons_awards.png'),
};

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ---------------------------------------------------------------------------
// SUB-NAVIGATORS (Stacks) per module group
// ---------------------------------------------------------------------------
function LeadsStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LeadsContacts"
    >
      <Stack.Screen name="LeadsContacts" component={AdminLeadContactsScreen} />
      <Stack.Screen name="LeadsDeals" component={AdminLeadsDealsScreen} />
    </Stack.Navigator>
  );
}

function HRStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HREmployees"
    >
      <Stack.Screen name="HREmployees" component={AdminHREmployeesScreen} />
      <Stack.Screen name="HRLeaves" component={AdminHRLeavesScreen} />
      <Stack.Screen name="HRHolidays" component={AdminHRHolidaysScreen} />
      <Stack.Screen name="HRAttendance" component={AdminHRAttendanceScreen} />
      <Stack.Screen name="HRDesignations" component={AdminDesignationsScreen} />
      <Stack.Screen name="HRDepartments" component={AdminDepartmentsScreen} />
      <Stack.Screen
        name="HRAppreciations"
        component={AdminHRAppreciationsScreen}
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
      <Stack.Screen name="WorkTasks" component={AdminWorkTasksScreen} />
      <Stack.Screen
        name="WorkTimesheets"
        component={AdminWorkTimesheetsScreen}
      />
      <Stack.Screen name="WorkRoadmap" component={AdminWorkRoadmapScreen} />
    </Stack.Navigator>
  );
}

function FinanceStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="FinanceInvoices"
    >
      <Stack.Screen
        name="FinanceInvoices"
        component={AdminFinanceInvoicesScreen}
      />
      <Stack.Screen name="FinanceDeals" component={AdminFinanceDealsScreen} />
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

// ---------------------------------------------------------------------------
// Drawer Item (glass style)
// ---------------------------------------------------------------------------
function GlassDrawerItem({
  label,
  icon,
  onPress,
  isActive = false,
  isSubItem = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.glassItem,
        isSubItem && styles.glassSubItem,
        isActive && styles.glassItemActive,
        pressed && styles.glassItemPressed,
      ]}
    >
      <LinearGradient
        colors={
          isActive
            ? ['rgba(37, 99, 235, 0.95)', 'rgba(29, 78, 216, 0.85)']
            : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)']
        }
        style={[
          styles.glassItemGradient,
          isSubItem && styles.glassSubItemGradient,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.glassItemContent}>
          <View style={styles.iconContainer}>
            <Image
              source={icon}
              style={[styles.itemIcon, isSubItem && styles.subItemIcon]}
            />
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
}

// ---------------------------------------------------------------------------
// Helper: find active nested child for highlighting
// ---------------------------------------------------------------------------
function useActiveHelpers(drawerState) {
  const activeTop = drawerState.routeNames[drawerState.index];
  const routes = drawerState.routes;

  // returns childRouteName if current top route is a stack and has nested state
  const getActiveChild = stackName => {
    const route = routes.find(r => r.name === stackName);
    const nested = route?.state;
    if (nested && typeof nested.index === 'number') {
      return (
        nested.routeNames?.[nested.index] || nested.routes?.[nested.index]?.name
      );
    }
    // React Navigation v6 stores in nested.routes
    const nr = route?.state?.routes?.[route.state.index];
    return nr?.name;
  };

  const isActiveStack = (stackName, childName) => {
    if (activeTop !== stackName) return false;
    const child = getActiveChild(stackName);
    return child === childName;
  };

  return { activeTop, isActiveStack };
}

// ---------------------------------------------------------------------------
// Custom Drawer Content (collapsible groups + proper nested navigation)
// ---------------------------------------------------------------------------
function AdminDrawerContent(props) {
  const { navigation, state } = props;
  const { activeTop, isActiveStack } = useActiveHelpers(state);

  const [leadsOpen, setLeadsOpen] = React.useState(false);
  const [hrOpen, setHrOpen] = React.useState(false);
  const [workOpen, setWorkOpen] = React.useState(false);
  const [financeOpen, setFinanceOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const animate = () =>
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  // Navigate into a stack's specific child
  const navigateTo = (stackName, childName) => {
    animate();
    navigation.navigate(stackName, { screen: childName });
  };

  const GroupHeader = ({ label, icon, open, onToggle }) => (
    <Pressable
      onPress={() => {
        animate();
        onToggle();
      }}
    >
      <LinearGradient
        colors={['rgba(241,245,249,0.95)', 'rgba(248,250,252,0.9)']}
        style={styles.hrHeaderGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.hrHeaderContent}>
          <View style={styles.hrTitleContainer}>
            <Image source={icon} style={styles.hrIcon} />
            <Text style={styles.hrTitle}>{label}</Text>
          </View>
          <Image
            source={open ? icons.chevronDown : icons.chevronRight}
            style={[styles.chevIcon, open && styles.chevIconRotated]}
          />
        </View>
      </LinearGradient>
    </Pressable>
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
          {/* Header */}
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
                    source={require('../assets/icons/dashicons_awards.png')}
                    style={styles.avatar}
                  />
                </View>
                <Text style={styles.welcomeText}>Admin Panel</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.navigationSection}>
            {/* Dashboard */}
            <GlassDrawerItem
              label="Dashboard"
              icon={icons.dashboard}
              onPress={() => navigation.navigate('AdminDashboard')}
              isActive={activeTop === 'AdminDashboard'}
            />

            {/* Leads group */}
            <GroupHeader
              label="Leads"
              icon={icons.leads}
              open={leadsOpen}
              onToggle={() => setLeadsOpen(v => !v)}
            />
            {leadsOpen && (
              <View style={styles.hrList}>
                <GlassDrawerItem
                  label="Lead Contacts"
                  icon={icons.leads}
                  onPress={() => navigateTo('Leads', 'LeadsContacts')}
                  isActive={isActiveStack('Leads', 'LeadsContacts')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Deals"
                  icon={icons.leads}
                  onPress={() => navigateTo('Leads', 'LeadsDeals')}
                  isActive={isActiveStack('Leads', 'LeadsDeals')}
                  isSubItem
                />
              </View>
            )}

            {/* Clients (single) */}
            <GlassDrawerItem
              label="Clients"
              icon={icons.clients}
              onPress={() => navigation.navigate('Clients')}
              isActive={activeTop === 'Clients'}
            />

            {/* HR group */}
            <GroupHeader
              label="HR"
              icon={icons.hr}
              open={hrOpen}
              onToggle={() => setHrOpen(v => !v)}
            />
            {hrOpen && (
              <View style={styles.hrList}>
                <GlassDrawerItem
                  label="Employees"
                  icon={icons.hr}
                  onPress={() => navigateTo('HR', 'HREmployees')}
                  isActive={isActiveStack('HR', 'HREmployees')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Leaves"
                  icon={icons.hr}
                  onPress={() => navigateTo('HR', 'HRLeaves')}
                  isActive={isActiveStack('HR', 'HRLeaves')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Holidays"
                  icon={icons.hr}
                  onPress={() => navigateTo('HR', 'HRHolidays')}
                  isActive={isActiveStack('HR', 'HRHolidays')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Attendance"
                  icon={icons.hr}
                  onPress={() => navigateTo('HR', 'HRAttendance')}
                  isActive={isActiveStack('HR', 'HRAttendance')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Designations"
                  icon={icons.hr}
                  onPress={() => navigateTo('HR', 'HRDesignations')}
                  isActive={isActiveStack('HR', 'HRDesignations')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Departments"
                  icon={icons.hr}
                  onPress={() => navigateTo('HR', 'HRDepartments')}
                  isActive={isActiveStack('HR', 'HRDepartments')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Appreciations"
                  icon={icons.hr}
                  onPress={() => navigateTo('HR', 'HRAppreciations')}
                  isActive={isActiveStack('HR', 'HRAppreciations')}
                  isSubItem
                />
              </View>
            )}

            {/* Work group */}
            <GroupHeader
              label="Work"
              icon={icons.work}
              open={workOpen}
              onToggle={() => setWorkOpen(v => !v)}
            />
            {workOpen && (
              <View style={styles.hrList}>
                <GlassDrawerItem
                  label="Projects"
                  icon={icons.work}
                  onPress={() => navigateTo('Work', 'WorkProjects')}
                  isActive={isActiveStack('Work', 'WorkProjects')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Tasks"
                  icon={icons.work}
                  onPress={() => navigateTo('Work', 'WorkTasks')}
                  isActive={isActiveStack('Work', 'WorkTasks')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Timesheets"
                  icon={icons.work}
                  onPress={() => navigateTo('Work', 'WorkTimesheets')}
                  isActive={isActiveStack('Work', 'WorkTimesheets')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Project Roadmap"
                  icon={icons.work}
                  onPress={() => navigateTo('Work', 'WorkRoadmap')}
                  isActive={isActiveStack('Work', 'WorkRoadmap')}
                  isSubItem
                />
              </View>
            )}

            {/* Finance group */}
            <GroupHeader
              label="Finance"
              icon={icons.finance}
              open={financeOpen}
              onToggle={() => setFinanceOpen(v => !v)}
            />
            {financeOpen && (
              <View style={styles.hrList}>
                <GlassDrawerItem
                  label="Invoices"
                  icon={icons.finance}
                  onPress={() => navigateTo('Finance', 'FinanceInvoices')}
                  isActive={isActiveStack('Finance', 'FinanceInvoices')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Deals"
                  icon={icons.finance}
                  onPress={() => navigateTo('Finance', 'FinanceDeals')}
                  isActive={isActiveStack('Finance', 'FinanceDeals')}
                  isSubItem
                />
              </View>
            )}

            {/* Messages (single) */}
            <GlassDrawerItem
              label="Messages"
              icon={icons.messages}
              onPress={() => navigation.navigate('Messages')}
              isActive={activeTop === 'Messages'}
            />

            {/* Settings group */}
            <GroupHeader
              label="Settings"
              icon={icons.settings}
              open={settingsOpen}
              onToggle={() => setSettingsOpen(v => !v)}
            />
            {settingsOpen && (
              <View style={styles.hrList}>
                <GlassDrawerItem
                  label="Company Settings"
                  icon={icons.settings}
                  onPress={() => navigateTo('Settings', 'CompanySettings')}
                  isActive={isActiveStack('Settings', 'CompanySettings')}
                  isSubItem
                />
                <GlassDrawerItem
                  label="Profile Settings"
                  icon={icons.settings}
                  onPress={() => navigateTo('Settings', 'ProfileSettings')}
                  isActive={isActiveStack('Settings', 'ProfileSettings')}
                  isSubItem
                />
              </View>
            )}
          </View>
        </DrawerContentScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

// ---------------------------------------------------------------------------
// Drawer Navigator wiring all stacks/screens
// ---------------------------------------------------------------------------
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
      }}
      drawerContent={props => <AdminDrawerContent {...props} />}
    >
      {/* Singles */}
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Drawer.Screen
        name="Clients"
        component={AdminClientsScreen}
        options={{ title: 'Clients', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="Messages"
        component={AdminMessagesScreen}
        options={{ title: 'Messages', drawerItemStyle: { height: 0 } }}
      />

      {/* Groups (hidden in drawer; enter via nested nav) */}
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

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
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
    width: 70,
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
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
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
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: { width: 24, height: 24, tintColor: '#1E293B' },
  subItemIcon: { width: 20, height: 20, tintColor: '#1E293B' },
  glassItemLabel: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  glassSubItemLabel: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  glassItemActive: { transform: [{ scale: 0.98 }] },
  glassItemPressed: { transform: [{ scale: 0.96 }], opacity: 0.8 },

  hrHeaderGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
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
  chevIcon: { width: 16, height: 16, tintColor: '#006afeff' },
  chevIconRotated: { transform: [{ rotate: '90deg' }] },
  hrList: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(59,130,246,0.3)',
    marginLeft: 16,
    marginBottom: 4,
  },

  screenWrap: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  screenTitle: { fontSize: 22, fontWeight: '900', color: '#0b0b0c' },
  dim: { color: '#64748b', marginTop: 8 },
});
