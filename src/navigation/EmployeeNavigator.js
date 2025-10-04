// src/navigation/EmployeeNavigator.js
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
  DrawerItem,
} from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';

// Employee modules
import EmployeeDashboardScreen from '../modules/employee/dashboard/screens/EmployeeDashboardScreen';
import EmployeeLeadsScreen from '../modules/employee/leads/screens/EmployeeLeadsScreen';
import EmployeeWorksScreen from '../modules/employee/works/screens/EmployeeWorksScreen';
import EmployeeProfileScreen from '../modules/employee/profile/screens/EmployeeProfileScreen';

// HR sub-screens
import EmployeeHRLeavesScreen from '../modules/employee/hr/screens/EmployeeHRLeavesScreen';
import EmployeeHRAttendanceScreen from '../modules/employee/hr/screens/EmployeeHRAttendanceScreen';
import EmployeeHRAppreciationsScreen from '../modules/employee/hr/screens/EmployeeHRAppreciationsScreen';
import EmployeeHRHolidaysScreen from '../modules/employee/hr/screens/EmployeeHRHolidaysScreen';

// Common
import MessagesScreen from '../modules/common/screens/MessagesScreen';
import EmployeeNotificationsScreen from '../modules/employee/notifications/screens/EmployeeNotificationsScreen';
import EmployeeSettingsScreen from '../modules/employee/settings/screens/EmployeeSettingsScreen';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

// Import your local PNG icons
const icons = {
  // dashboard: require('../assets/icons/dashboard.png'),
  // profile: require('../assets/icons/profile.png'),
  // leads: require('../assets/icons/leads.png'),
  // works: require('../assets/icons/works.png'),
  // hr: require('../assets/icons/hr.png'),
  // leaves: require('../assets/icons/leaves.png'),
  // attendance: require('../assets/icons/attendance.png'),
  // appreciations: require('../assets/icons/appreciations.png'),
  // holidays: require('../assets/icons/holidays.png'),
  // messages: require('../assets/icons/messages.png'),
  // notifications: require('../assets/icons/notifications.png'),
  // settings: require('../assets/icons/settings.png'),
  // chevronDown: require('../assets/icons/chevron-down.png'),
  // chevronRight: require('../assets/icons/chevron-right.png'),
  dashboard: require('../assets/icons/dashboard.png'),
  profile: require('../assets/icons/dashicons_awards.png'),
  leads: require('../assets/icons/leads.png'),
  works: require('../assets/icons/dashicons_awards.png'),
  hr: require('../assets/icons/HRMS.png'),
  leaves: require('../assets/icons/dashicons_awards.png'),
  attendance: require('../assets/icons/dashicons_awards.png'),
  appreciations: require('../assets/icons/dashicons_awards.png'),
  holidays: require('../assets/icons/dashicons_awards.png'),
  messages: require('../assets/icons/Messages.png'),
  notifications: require('../assets/icons/notification.png'),
  settings: require('../assets/icons/dashicons_awards.png'),
  chevronDown: require('../assets/icons/dashicons_awards.png'),
  chevronRight: require('../assets/icons/dashicons_awards.png'),
};

// Smooth expand/collapse on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Custom Glass Drawer Item Component
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

// ---------- Custom Drawer Content ----------
function EmployeeDrawerContent(props) {
  const { navigation, state } = props;
  const [hrOpen, setHrOpen] = React.useState(false);

  const activeRoute = state.routeNames[state.index];

  const toggleHR = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
    });
    setHrOpen(v => !v);
  };

  const go = routeName => {
    // collapse HR whenever navigating elsewhere
    if (hrOpen && !routeName.startsWith('HR')) {
      LayoutAnimation.configureNext({
        duration: 300,
        create: { type: 'easeInEaseOut', property: 'opacity' },
        update: { type: 'easeInEaseOut' },
      });
      setHrOpen(false);
    }
    navigation.navigate(routeName);
  };

  return (
    <ImageBackground
      source={require('../assets/icons/dashicons_awards.png')} // Add your background image
      style={styles.drawerBackground}
      blurRadius={10}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={styles.drawerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onTouchStart={() => {
            if (hrOpen) {
              LayoutAnimation.configureNext({
                duration: 300,
                create: { type: 'easeInEaseOut', property: 'opacity' },
                update: { type: 'easeInEaseOut' },
              });
              setHrOpen(false);
            }
          }}
        > */}

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section with Glass Effect */}
          <View style={styles.headerSection}>
            <LinearGradient
              colors={['rgba(37, 99, 235, 0.15)', 'rgba(59, 130, 246, 0.1)']}
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
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.employeeName}>John Doe</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Navigation Items */}
          <View style={styles.navigationSection}>
            {/* Top items */}
            <GlassDrawerItem
              label="Dashboard"
              icon={icons.dashboard}
              onPress={() => go('Dashboard')}
              isActive={activeRoute === 'Dashboard'}
            />
            <GlassDrawerItem
              label="My Profile"
              icon={icons.profile}
              onPress={() => go('Profile')}
              isActive={activeRoute === 'Profile'}
            />
            <GlassDrawerItem
              label="Leads"
              icon={icons.leads}
              onPress={() => go('Leads')}
              isActive={activeRoute === 'Leads'}
            />
            <GlassDrawerItem
              label="Works"
              icon={icons.works}
              onPress={() => go('Works')}
              isActive={activeRoute === 'Works'}
            />

            {/* HR collapsible group with glass effect */}
            <View style={styles.hrGroup}>
              <Pressable
                onPress={toggleHR}
                style={({ pressed }) => [
                  styles.hrHeader,
                  pressed && styles.hrHeaderPressed,
                ]}
              >
                <LinearGradient
                  colors={[
                    'rgba(241, 245, 249, 0.95)',
                    'rgba(248, 250, 252, 0.9)',
                  ]}
                  style={styles.hrHeaderGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.hrHeaderContent}>
                    <View style={styles.hrTitleContainer}>
                      <Image source={icons.hr} style={styles.hrIcon} />
                      <Text style={styles.hrTitle}>HR</Text>
                    </View>
                    <Image
                      source={hrOpen ? icons.chevronDown : icons.chevronRight}
                      style={[
                        styles.chevIcon,
                        hrOpen && styles.chevIconRotated,
                      ]}
                    />
                  </View>
                </LinearGradient>
              </Pressable>

              {hrOpen && (
                <View style={styles.hrList}>
                  <GlassDrawerItem
                    label="Leaves"
                    icon={icons.leaves}
                    onPress={() => go('HRLeaves')}
                    isActive={activeRoute === 'HRLeaves'}
                    isSubItem={true}
                  />
                  <GlassDrawerItem
                    label="Attendance"
                    icon={icons.attendance}
                    onPress={() => go('HRAttendance')}
                    isActive={activeRoute === 'HRAttendance'}
                    isSubItem={true}
                  />
                  <GlassDrawerItem
                    label="Appreciations"
                    icon={icons.appreciations}
                    onPress={() => go('HRAppreciations')}
                    isActive={activeRoute === 'HRAppreciations'}
                    isSubItem={true}
                  />
                  <GlassDrawerItem
                    label="Holidays"
                    icon={icons.holidays}
                    onPress={() => go('HRHolidays')}
                    isActive={activeRoute === 'HRHolidays'}
                    isSubItem={true}
                  />
                </View>
              )}
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(203, 213, 225, 0.6)',
                  'transparent',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.separatorLine}
              />
            </View>

            {/* Bottom items */}
            <GlassDrawerItem
              label="Messages"
              icon={icons.messages}
              onPress={() => go('Messages')}
              isActive={activeRoute === 'Messages'}
            />
            <GlassDrawerItem
              label="Notifications"
              icon={icons.notifications}
              onPress={() => go('Notifications')}
              isActive={activeRoute === 'Notifications'}
            />
            <GlassDrawerItem
              label="Settings"
              icon={icons.settings}
              onPress={() => go('Settings')}
              isActive={activeRoute === 'Settings'}
            />
          </View>
        </DrawerContentScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

// ---------- Navigator ----------
export default function EmployeeNavigator() {
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
            colors={['rgba(37, 99, 235, 0.95)', 'rgba(29, 78, 216, 0.95)']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: 'rgba(255,255,255,0.7)',
        drawerStyle: {
          width: width * 0.8,
          backgroundColor: 'transparent',
        },
      }}
      drawerContent={props => <EmployeeDrawerContent {...props} />}
    >
      {/* All your existing screens remain the same */}
      <Drawer.Screen
        name="Dashboard"
        component={EmployeeDashboardScreen}
        options={{ title: 'Employee Dashboard' }}
      />
      <Drawer.Screen
        name="Profile"
        component={EmployeeProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Drawer.Screen
        name="Leads"
        component={EmployeeLeadsScreen}
        options={{ title: 'Leads Management' }}
      />
      <Drawer.Screen
        name="Works"
        component={EmployeeWorksScreen}
        options={{ title: 'Works & Tasks' }}
      />
      <Drawer.Screen
        // name="HRLeaves"
        // component={EmployeeHRLeavesScreen}
        name="HRLeaves"
        component={EmployeeHRLeavesScreen}
        options={{
          title: 'HR • Leaves',
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="HRAttendance"
        component={EmployeeHRAttendanceScreen}
        options={{ title: 'HR • Attendance', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="HRAppreciations"
        component={EmployeeHRAppreciationsScreen}
        options={{
          title: 'HR • Appreciations',
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="HRHolidays"
        component={EmployeeHRHolidaysScreen}
        options={{ title: 'HR • Holidays', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Drawer.Screen
        name="Notifications"
        component={EmployeeNotificationsScreen}
        options={{
          drawerLabel: 'Notifications jhg',
          title: 'Notifications devesh',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={EmployeeSettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerBackground: {
    flex: 1,
  },
  drawerGradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    flexGrow: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerGlass: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
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
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    // textShadowColor: 'rgba(0,0,0,0.3)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
  navigationSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  glassItem: {
    marginVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  glassSubItem: {
    marginLeft: 20,
    marginVertical: 2,
    borderRadius: 12,
  },
  glassItemGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  glassSubItemGradient: {
    borderRadius: 12,
  },
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
  itemIcon: {
    width: 24,
    height: 24,
    tintColor: '#1E293B',
  },
  subItemIcon: {
    width: 20,
    height: 20,
    tintColor: '#1E293B',
  },
  glassItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: 0.2,
    // textShadowColor: 'rgba(0,0,0,0.3)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 1,
  },
  glassSubItemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  glassItemActive: {
    transform: [{ scale: 0.98 }],
  },
  glassItemPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },
  hrGroup: {
    marginVertical: 8,
  },
  hrHeader: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 4,
  },
  hrHeaderGradient: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  hrHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  hrTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hrIcon: {
    width: 24,
    height: 24,
    tintColor: '#1E293B',
    marginRight: 12,
  },
  hrTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.3,
    // textShadowColor: 'rgba(0,0,0,0.3)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
  chevIcon: {
    width: 16,
    height: 16,
    tintColor: '#006afeff',
  },
  chevIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  hrHeaderPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  hrList: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(59, 130, 246, 0.3)',
    marginLeft: 16,
  },
  separator: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  separatorLine: {
    height: 1,
  },
});
