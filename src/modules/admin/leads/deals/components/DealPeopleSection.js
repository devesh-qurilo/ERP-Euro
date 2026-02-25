// import React, { useMemo } from 'react';
// import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

// export default function DealPeopleSection({ deal }) {
//   const {
//     dealAgentMeta,
//     dealWatchersMeta = [],
//     assignedEmployeesMeta = [],
//   } = deal || {};

//   // remove duplicates (sometimes agent appears in assigned)
//   const assigned = useMemo(() => {
//     return assignedEmployeesMeta.filter(
//       emp => emp.employeeId !== dealAgentMeta?.employeeId,
//     );
//   }, [assignedEmployeesMeta, dealAgentMeta]);

//   return (
//     <ScrollView
//       contentContainerStyle={{ paddingBottom: 20 }}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* DEAL AGENT */}
//       {dealAgentMeta && (
//         <Section title="Deal Agent">
//           <PersonCard person={dealAgentMeta} highlight />
//         </Section>
//       )}

//       {/* ASSIGNED */}
//       {assigned.length > 0 && (
//         <Section title="Assigned Employees">
//           {assigned.map(p => (
//             <PersonCard key={p.employeeId} person={p} />
//           ))}
//         </Section>
//       )}

//       {/* WATCHERS */}
//       {dealWatchersMeta.length > 0 && (
//         <Section title="Watchers">
//           {dealWatchersMeta.map(p => (
//             <PersonCard key={p.employeeId} person={p} />
//           ))}
//         </Section>
//       )}

//       {!dealAgentMeta &&
//         assigned.length === 0 &&
//         dealWatchersMeta.length === 0 && (
//           <Text style={styles.empty}>No people linked</Text>
//         )}
//     </ScrollView>
//   );
// }

// /* ================= SECTION WRAPPER ================= */

// function Section({ title, children }) {
//   return (
//     <View style={{ marginBottom: 18 }}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <View style={{ marginTop: 8 }}>{children}</View>
//     </View>
//   );
// }

// /* ================= PERSON CARD ================= */

// function PersonCard({ person, highlight }) {
//   return (
//     <View style={[styles.card, highlight && styles.highlightCard]}>
//       {person.profileUrl ? (
//         <Image source={{ uri: person.profileUrl }} style={styles.avatar} />
//       ) : (
//         <View style={styles.avatarFallback}>
//           <Text style={styles.avatarInitial}>
//             {person.name?.charAt(0) || '?'}
//           </Text>
//         </View>
//       )}

//       <View style={{ flex: 1 }}>
//         <Text style={styles.name}>{person.name}</Text>
//         <Text style={styles.meta}>
//           {person.employeeId}
//           {person.designation ? ` • ${person.designation}` : ''}
//           {person.department ? ` • ${person.department}` : ''}
//         </Text>
//       </View>
//     </View>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   sectionTitle: {
//     fontWeight: '700',
//     fontSize: 15,
//     color: '#111827',
//   },

//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 10,
//     elevation: 2,
//   },

//   highlightCard: {
//     borderWidth: 1,
//     borderColor: '#3F6AE1',
//     backgroundColor: '#EEF2FF',
//   },

//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     marginRight: 12,
//   },

//   avatarFallback: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     marginRight: 12,
//     backgroundColor: '#3F6AE1',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   avatarInitial: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   name: {
//     fontWeight: '700',
//     fontSize: 14,
//     color: '#111',
//   },

//   meta: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginTop: 2,
//   },

//   empty: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#6b7280',
//   },
// });

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../../../../services/api';

export default function DealEmployeesSection({ dealId, employees }) {
  const [assigned, setAssigned] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ASSIGNED ================= */

  const fetchAssigned = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/deals/${dealId}/employees`);
      setAssigned(res.data || []);
    } catch (err) {
      // console.log('Fetch employees error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dealId) return;
    fetchAssigned();
  }, [dealId]);

  /* ================= OPTIONS ================= */

  const empOptions = useMemo(() => {
    return (employees || []).map(e => ({
      label: `${e.name} (${e.employeeId})`,
      value: e.employeeId,
    }));
  }, [employees]);

  /* ================= ADD ================= */

  const handleAdd = async () => {
    if (!selectedIds.length) {
      Alert.alert('Select at least one employee');
      return;
    }

    try {
      setLoading(true);

      await api.post(`/deals/${dealId}/employees`, {
        employeeIds: selectedIds,
      });

      setSelectedIds([]);
      fetchAssigned();
    } catch (err) {
      // console.log('Add error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async employeeId => {
    try {
      setLoading(true);

      await api.delete(`/deals/${dealId}/employees/${employeeId}`);

      fetchAssigned();
    } catch (err) {
      // console.log('Delete error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Employees</Text>

      {/* PICKER */}
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={null}
          onValueChange={value => {
            if (!value) return;

            if (!selectedIds.includes(value)) {
              setSelectedIds(prev => [...prev, value]);
            }
          }}
        >
          <Picker.Item label="Select Employee..." value={null} />
          {empOptions.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {/* SELECTED CHIPS */}
      {selectedIds.length > 0 && (
        <View style={styles.selectedWrap}>
          {selectedIds.map(id => (
            <View key={id} style={styles.chip}>
              <Text style={styles.chipText}>{id}</Text>
              <TouchableOpacity
                onPress={() =>
                  setSelectedIds(prev => prev.filter(eid => eid !== id))
                }
              >
                <Text style={styles.removeSmall}> ×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>Add Employees</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

      {/* ASSIGNED LIST */}
      <FlatList
        data={assigned}
        keyExtractor={item => item.employeeId}
        renderItem={({ item }) => (
          <EmployeeCard
            employee={item}
            onDelete={() => handleDelete(item.employeeId)}
          />
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>No employees assigned</Text>
        }
      />
    </View>
  );
}

/* ================= EMPLOYEE CARD ================= */

function EmployeeCard({ employee, onDelete }) {
  return (
    <View style={styles.card}>
      {employee.profileUrl ? (
        <Image source={{ uri: employee.profileUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarLetter}>{employee.name?.charAt(0)}</Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.meta}>
          {employee.employeeId}
          {employee.designation ? ` • ${employee.designation}` : ''}
          {employee.department ? ` • ${employee.department}` : ''}
        </Text>
      </View>

      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 10,
  },

  selectedWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  chip: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    fontWeight: '600',
  },

  removeSmall: {
    color: 'red',
  },

  addBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },

  addBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3F6AE1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarLetter: {
    color: '#fff',
    fontWeight: '700',
  },

  name: {
    fontWeight: '700',
  },

  meta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  remove: {
    color: 'red',
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
});
