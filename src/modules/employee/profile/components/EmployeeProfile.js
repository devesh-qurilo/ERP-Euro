import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeProfileRequest } from '../store/action';
import {
  selectEmployeeProfile,
  selectEmployeeProfileLoading,
  selectEmployeeProfileError,
} from '../store/selectors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EmployeeProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectEmployeeProfile);
  const loading = useSelector(selectEmployeeProfileLoading);
  const error = useSelector(selectEmployeeProfileError);

  useEffect(() => {
    dispatch(fetchEmployeeProfileRequest());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', `Failed to load profile: ${error}`);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: profile.profilePictureUrl || 'https://via.placeholder.com/120',
          }}
          style={styles.profileImage}
          onError={() => console.log('Image load error')}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.department}>{profile.departmentName}</Text>
          <Text style={styles.employeeId}>{profile.employeeId}</Text>
          <Text style={styles.designation}>{profile.designationName}</Text>
        </View>
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem icon="email" label="Email" value={profile.email} />
          <InfoItem icon="phone" label="Mobile" value={profile.mobile} />
          <InfoItem icon="wc" label="Gender" value={profile.gender} />
          <InfoItem icon="cake" label="Birthday" value={profile.birthday} />
          <InfoItem
            icon="bloodtype"
            label="Blood Group"
            value={profile.bloodGroup}
          />
          <InfoItem
            icon="translate"
            label="Language"
            value={profile.language}
          />
        </View>
      </View>

      {/* Employment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Employment Details</Text>
        <View style={styles.infoGrid}>
          <InfoItem
            icon="business"
            label="Department"
            value={profile.departmentName}
          />
          <InfoItem
            icon="work"
            label="Designation"
            value={profile.designationName}
          />
          <InfoItem
            icon="event"
            label="Joining Date"
            value={profile.joiningDate}
          />
          <InfoItem
            icon="access-time"
            label="Office Shift"
            value={profile.officeShift}
          />
          <InfoItem
            icon="attach-money"
            label="Hourly Rate"
            value={`$${profile.hourlyRate}`}
          />
          <InfoItem
            icon="group"
            label="Reporting To"
            value={profile.reportingToName}
          />
        </View>
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem
            icon="location-on"
            label="Address"
            value={profile.address}
          />
          <InfoItem
            icon="business"
            label="Business Address"
            value={profile.businessAddress}
          />
          <InfoItem icon="flag" label="Country" value={profile.country} />
          <InfoItem
            icon="favorite"
            label="Marital Status"
            value={profile.maritalStatus}
          />
          <InfoItem
            icon="work"
            label="Employment Type"
            value={profile.employmentType}
          />
          <InfoItem
            icon="notifications"
            label="Email Notifications"
            value={profile.receiveEmailNotification ? 'Enabled' : 'Disabled'}
          />
        </View>
      </View>

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* About */}
      {profile.about && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{profile.about}</Text>
        </View>
      )}
    </ScrollView>
  );
};

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoHeader}>
      <Icon name={icon} size={16} color="#7f8c8d" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue} numberOfLines={2}>
      {value || 'N/A'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  department: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 2,
  },
  employeeId: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  designation: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 5,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 5,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
  },
  skillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});

export default EmployeeProfile;
