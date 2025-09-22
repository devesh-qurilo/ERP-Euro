import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

// Re-use existing dashboard components
import EmployeeProfileCard from '../../profile/components/EmployeeInfoCard';
import LeaveQuotaTable from '../../dashboard/components/LeaveQuotaTable';

export default function ProfileOverviewModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile Overview</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>✕</Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* 1) Employee profile card */}
            <EmployeeProfileCard />

            {/* 2) Leave quota table */}
            <View style={{ height: 16 }} />
            <LeaveQuotaTable />
            {/* LeaveQuotaTable already fetches quota on mount and supports horizontal scroll */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '92%',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0b0b0c' },
  closeBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  closeTxt: { fontSize: 18 },
  content: { paddingBottom: 16 },
});
