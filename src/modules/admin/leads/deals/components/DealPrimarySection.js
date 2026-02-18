import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';

export default function DealPrimarySection({ deal }) {
  if (!deal) return null;

  const callLead = () => {
    if (deal.leadMobile) Linking.openURL(`tel:${deal.leadMobile}`);
  };

  const emailLead = () => {
    if (deal.leadEmail) Linking.openURL(`mailto:${deal.leadEmail}`);
  };

  return (
    <View style={styles.container}>
      {/* ================= TOP HEADER ================= */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{deal.title}</Text>
          <Text style={styles.pipeline}>
            {deal.pipeline} → {deal.dealStage}
          </Text>
        </View>

        {deal.priority && (
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: deal.priority.color },
            ]}
          >
            <Text style={styles.priorityText}>{deal.priority.status}</Text>
          </View>
        )}
      </View>

      <Divider />

      {/* ================= DEAL DETAILS ================= */}
      <SectionTitle text="Deal Details" />

      <Info label="Deal ID" value={deal.id} />
      <Info label="Category" value={deal.dealCategory} />
      <Info
        label="Value"
        // value={`$${Number(deal.value || 0).toLocaleString()}`}
        value={`$${deal.value}`}
      />
      <Info label="Expected Close" value={deal.expectedCloseDate} />
      <Info label="Created At" value={formatDate(deal.createdAt)} />
      <Info label="Updated At" value={formatDate(deal.updatedAt)} />

      <Divider />

      {/* ================= LEAD DETAILS ================= */}
      <SectionTitle text="Lead Details" />

      <Info label="Lead ID" value={deal.leadId} />
      <Info label="Name" value={deal.leadName} />
      <Info label="Email" value={deal.leadEmail} />
      <Info label="Mobile" value={deal.leadMobile} />
      <Info label="Company" value={deal.leadCompany} />

      {/* ACTION BUTTONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.callBtn} onPress={callLead}>
          <Text style={styles.btnText}>📞 Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailBtn} onPress={emailLead}>
          <Text style={styles.btnText}>✉ Email</Text>
        </TouchableOpacity>
      </View>

      <Divider />

      {/* ================= ASSIGNMENT ================= */}
      <SectionTitle text="Assignment" />

      <Info
        label="Deal Agent"
        value={deal.dealAgentMeta?.name || deal.dealAgent}
      />

      <Info
        label="Watchers"
        value={deal.dealWatchersMeta?.map(w => w.name).join(', ') || '--'}
      />

      <Text style={styles.subHeading}>Assigned Employees</Text>

      {(deal.assignedEmployeesMeta || []).map(emp => (
        <View key={emp.employeeId} style={styles.employeeRow}>
          {emp.profileUrl ? (
            <Image source={{ uri: emp.profileUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.empName}>{emp.name}</Text>
            <Text style={styles.empMeta}>
              {emp.employeeId} • {emp.designation || '--'} •{' '}
              {emp.department || '--'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ================= COMPONENTS ================= */

function Info({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '--'}</Text>
    </View>
  );
}

function SectionTitle({ text }) {
  return <Text style={styles.sectionTitle}>{text}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function formatDate(dateStr) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString();
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },

  pipeline: {
    marginTop: 4,
    color: '#6b7280',
    fontWeight: '600',
  },

  priorityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  priorityText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  sectionTitle: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  label: {
    width: 130,
    color: '#666',
  },

  value: {
    flex: 1,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 14,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  callBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },

  emailBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
  },

  subHeading: {
    marginTop: 12,
    fontWeight: '700',
  },

  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ddd',
    marginRight: 10,
  },

  empName: {
    fontWeight: '600',
  },

  empMeta: {
    fontSize: 12,
    color: '#777',
  },
});
