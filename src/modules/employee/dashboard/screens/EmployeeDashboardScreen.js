// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import EmployeeProfileCard from '../components/employees/EmployeeProfileCard';
// import { fetchEmployeeProfileRequest } from '../store/actions';
// import {
//   selectEmployeeProfile,
//   selectEmployeeLoading,
// } from '../store/selectors';
// import { selectAuthUser } from '../../../auth/store/selectors';
// import { useNavigation } from '@react-navigation/native';

// const EmployeeDashboardScreen = () => {
//   //   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const employeeProfile = useSelector(selectEmployeeProfile);
//   const loading = useSelector(selectEmployeeLoading);
//   const authUser = useSelector(selectAuthUser);
//   const [refreshing, setRefreshing] = React.useState(false);

//   useEffect(() => {
//     if (authUser?.employeeId) {
//       dispatch(fetchEmployeeProfileRequest(authUser.employeeId));
//     }
//   }, [dispatch, authUser]);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     if (authUser?.employeeId) {
//       dispatch(fetchEmployeeProfileRequest(authUser.employeeId));
//     }
//     setRefreshing(false);
//   };

//   const handleEditProfile = () => {
//     // navigation.navigate('EditProfile', { employee: employeeProfile });
//     console.log('edit profile');
//   };

//   if (loading && !employeeProfile) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text>Loading your profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//       }
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>My Dashboard</Text>
//         <Text style={styles.subtitle}>Welcome back, {authUser?.name}!</Text>
//       </View>

//       {/* Employee Profile Card */}
//       {employeeProfile && (
//         <EmployeeProfileCard
//           employee={employeeProfile}
//           onEditPress={handleEditProfile}
//         />
//       )}

//       {/* Quick Stats */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Quick Overview</Text>

//         <View style={styles.statsGrid}>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>12</Text>
//             <Text style={styles.statLabel}>Tasks Due</Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>8</Text>
//             <Text style={styles.statLabel}>Completed</Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>95%</Text>
//             <Text style={styles.statLabel}>Attendance</Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>3</Text>
//             <Text style={styles.statLabel}>Leaves Left</Text>
//           </View>
//         </View>
//       </View>

//       {/* Quick Actions */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Quick Actions</Text>

//         <View style={styles.actionsGrid}>
//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionIcon}>📋</Text>
//             <Text style={styles.actionText}>Tasks</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionIcon}>📅</Text>
//             <Text style={styles.actionText}>Schedule</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionIcon}>💰</Text>
//             <Text style={styles.actionText}>Payroll</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionIcon}>🏢</Text>
//             <Text style={styles.actionText}>Leave</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#2c3e50',
//     padding: 24,
//     paddingTop: 50,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#bdc3c7',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   section: {
//     backgroundColor: '#ffffff',
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 16,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statItem: {
//     width: '48%',
//     backgroundColor: '#3498db',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#ffffff',
//     opacity: 0.9,
//   },
//   actionsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   actionButton: {
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#ecf0f1',
//     borderRadius: 8,
//     minWidth: 70,
//   },
//   actionIcon: {
//     fontSize: 24,
//     marginBottom: 4,
//   },
//   actionText: {
//     fontSize: 12,
//     color: '#2c3e50',
//     fontWeight: '500',
//   },
// });

// export default EmployeeDashboardScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const EmployeeDashboardScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Employee Dashboard</Text>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Welcome to your dashboard!</Text>
        <Text style={styles.subText}>
          Here you can access all your work tools.
        </Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.actionText}>View My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Check Leads</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>View Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>HR Portal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  quickActions: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmployeeDashboardScreen;
