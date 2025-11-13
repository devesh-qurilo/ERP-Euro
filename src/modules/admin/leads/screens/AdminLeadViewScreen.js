// src/modules/admin/leads/screens/AdminLeadViewScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectAdminLeads } from '../store/selectors';

const TabButton = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.tabBtn, active && styles.tabBtnActive]}
  >
    <Text style={[styles.tabTxt, active && styles.tabTxtActive]}>{label}</Text>
  </Pressable>
);

const FieldRow = ({ label, value }) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value ? String(value) : '-'}</Text>
  </View>
);

export default function AdminLeadViewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const leads = useSelector(selectAdminLeads);
  const lead = useMemo(
    () => (leads || []).find(l => String(l.id) === String(id)),
    [leads, id],
  );

  const [tab, setTab] = useState('profile'); // 'profile' | 'notes' | 'deal'

  const title = lead?.name || 'Lead Detail';

  // If not found
  if (!lead) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundTxt}>Lead not found.</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backPill}>
          <Text style={styles.backArrow}>{'←'}</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subTitle} numberOfLines={1}>
            {lead.companyName || 'No company name'}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton
          label="Profile"
          active={tab === 'profile'}
          onPress={() => setTab('profile')}
        />
        <TabButton
          label="Notes"
          active={tab === 'notes'}
          onPress={() => setTab('notes')}
        />
        <TabButton
          label="Deal"
          active={tab === 'deal'}
          onPress={() => setTab('deal')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'profile' && (
          <>
            {/* Basic Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Basic Information</Text>
              <FieldRow label="Lead Name" value={lead.name} />
              <FieldRow label="Email" value={lead.email} />
              <FieldRow label="Mobile" value={lead.mobileNumber} />
              <FieldRow label="Client Category" value={lead.clientCategory} />
              <FieldRow label="Lead Source" value={lead.leadSource} />
            </View>

            {/* Owner / Created Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Owner & Created By</Text>
              <FieldRow label="Lead Owner" value={lead.leadOwner} />
              <FieldRow label="Added By" value={lead.addedBy} />
              <FieldRow
                label="Auto Convert To Client"
                value={lead.autoConvertToClient ? 'Yes' : 'No'}
              />
              <FieldRow
                label="Created At"
                value={
                  lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString()
                    : '-'
                }
              />
            </View>

            {/* Company Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Company Information</Text>
              <FieldRow label="Company Name" value={lead.companyName} />
              <FieldRow label="Official Website" value={lead.officialWebsite} />
              <FieldRow label="Office Phone" value={lead.officePhone} />
              <FieldRow label="City" value={lead.city} />
              <FieldRow label="State" value={lead.state} />
              <FieldRow label="Postal Code" value={lead.postalCode} />
              <FieldRow label="Country" value={lead.country} />
              <FieldRow label="Company Address" value={lead.companyAddress} />
            </View>
          </>
        )}

        {tab === 'notes' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.placeholderTxt}>
              Notes tab will be implemented later.
            </Text>
          </View>
        )}

        {tab === 'deal' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Deal</Text>
            <Text style={styles.placeholderTxt}>
              Deal tab will be implemented later.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 4,
  },
  backArrow: {
    fontSize: 14,
    color: '#111827',
    marginRight: 3,
  },
  backLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  subTitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 6,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  tabBtnActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  tabTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
  },
  tabTxtActive: {
    color: '#ffffff',
  },

  content: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },

  fieldRow: {
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: '700',
  },
  fieldValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },

  placeholderTxt: {
    fontSize: 13,
    color: '#6b7280',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  notFoundTxt: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: '#111827',
    borderRadius: 10,
  },
  backTxt: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
