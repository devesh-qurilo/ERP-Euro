import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const EmployeeProfileCard = ({ employee, onEditPress }) => {
  return (
    <View style={styles.card}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              employee.imageUrl ||
              'https://via.placeholder.com/120x120?text=Employee',
          }}
          style={styles.profileImage}
          resizeMode="cover"
        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.role}>{employee.jobRole}</Text>
          <Text style={styles.employeeId}>
            Employee ID: {employee.employeeId}
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Department</Text>
            <Text style={styles.detailValue}>{employee.department}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      employee.status === 'active' ? '#27ae60' : '#e74c3c',
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {employee.status === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{employee.email}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{employee.phone}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Join Date</Text>
            <Text style={styles.detailValue}>{employee.joinDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecf0f1',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 14,
    color: '#95a5a6',
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 20,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
});

export default EmployeeProfileCard;
