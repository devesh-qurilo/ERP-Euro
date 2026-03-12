// import { useDispatch, useSelector } from 'react-redux';
// import {
//   selectEmployeePromotions,
//   selectEmployeePromotionsLoading,
// } from '../store/selectors';

// import { selectDesignations } from '../../designations/store/selectors';
// import { selectDepartments } from '../../departments/store/selectors';

// import {
//   deleteEmployeePromotion,
//   fetchEmployeePromotions,
// } from '../store/actions';
// import { useEffect } from 'react';
// import { Pressable, ScrollView, Text, View } from 'react-native';

// export default function EmployeePromotionTab({ emp }) {
//   const dispatch = useDispatch();

//   const promotions = useSelector(selectEmployeePromotions);
//   const loading = useSelector(selectEmployeePromotionsLoading);

//   const designations = useSelector(selectDesignations);
//   const departments = useSelector(selectDepartments);

//   useEffect(() => {
//     dispatch(fetchEmployeePromotions(emp?.employeeId));
//   }, [emp]);

//   return (
//     <View style={styles.card}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Promotion History</Text>

//         <Pressable
//           style={styles.addBtn}
//           onPress={() => dispatch({ type: 'OPEN_PROMOTION_MODAL' })}
//         >
//           <Text style={styles.addTxt}>+ Add Promotion</Text>
//         </Pressable>
//       </View>

//       <ScrollView>
//         {promotions.map(p => (
//           <View key={p.id} style={styles.row}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.designation}>
//                 {p.oldDesignationName} → {p.newDesignationName}
//               </Text>

//               <Text style={styles.meta}>
//                 {p.oldDepartmentName} → {p.newDepartmentName}
//               </Text>

//               <Text style={styles.meta}>
//                 {new Date(p.createdAt).toDateString()}
//               </Text>

//               {p.remarks ? (
//                 <Text style={styles.remark}>{p.remarks}</Text>
//               ) : null}
//             </View>

//             <Pressable onPress={() => dispatch(deleteEmployeePromotion(p.id))}>
//               <Text style={{ color: '#ef4444', fontWeight: '700' }}>
//                 Delete
//               </Text>
//             </Pressable>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import {
  closePromotionModal,
  createEmployeePromotion,
  fetchEmployeePromotions,
} from '../store/actions';

import { selectDesignations } from '../../designations/store/selectors';
import { selectDepartments } from '../../departments/store/selectors';

import { fetchDesignations } from '../../designations/store/actions';
import { fetchDepartments } from '../../departments/store/actions';

const Select = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!emp?.employeeId) return;

    dispatch(fetchEmployeePromotions(emp.employeeId));

    dispatch(fetchDesignations());
    dispatch(fetchDepartments());
  }, [emp]);

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.select} onPress={() => setOpen(o => !o)}>
        <Text>{value?.label || 'Select'}</Text>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          <ScrollView>
            {options.map(o => (
              <Pressable
                key={o.value}
                style={styles.menuItem}
                onPress={() => {
                  onChange(o);
                  setOpen(false);
                }}
              >
                <Text>{o.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default function PromotionModal({ visible, emp }) {
  const dispatch = useDispatch();

  const designations = useSelector(selectDesignations);
  const departments = useSelector(selectDepartments);

  const designationOptions = (designations || []).map(d => ({
    label: d.designationName,
    value: d.id,
  }));

  const departmentOptions = (departments || []).map(d => ({
    label: d.departmentName,
    value: d.id,
  }));

  const [newDesignation, setNewDesignation] = useState(null);
  const [newDepartment, setNewDepartment] = useState(null);
  const [remarks, setRemarks] = useState('');

  const [isPromotion, setIsPromotion] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);

  const save = () => {
    dispatch(
      createEmployeePromotion(emp.employeeId, {
        oldDesignationId: emp.designationId,
        oldDepartmentId: emp.departmentId,
        newDepartmentId: newDepartment?.value,
        newDesignationId: newDesignation?.value,
        isPromotion,
        sendNotification,
        remarks,
      }),
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Promotion</Text>

          <ScrollView>
            {/* OLD DESIGNATION */}
            <View style={styles.readonly}>
              <Text style={styles.label}>Old Designation</Text>
              <Text>{emp?.designationName}</Text>
            </View>

            {/* OLD DEPARTMENT */}
            <View style={styles.readonly}>
              <Text style={styles.label}>Old Department</Text>
              <Text>{emp?.departmentName}</Text>
            </View>

            {/* NEW DEPARTMENT */}
            <Select
              label="New Department"
              value={newDepartment}
              options={departmentOptions}
              onChange={setNewDepartment}
            />

            {/* NEW DESIGNATION */}
            <Select
              label="New Designation"
              value={newDesignation}
              options={designationOptions}
              onChange={setNewDesignation}
            />

            {/* IS PROMOTION */}
            <Pressable
              style={styles.toggle}
              onPress={() => setIsPromotion(p => !p)}
            >
              <Text>Is Promotion: {isPromotion ? 'Yes' : 'No'}</Text>
            </Pressable>

            {/* SEND NOTIFICATION */}
            <Pressable
              style={styles.toggle}
              onPress={() => setSendNotification(p => !p)}
            >
              <Text>Send Notification: {sendNotification ? 'Yes' : 'No'}</Text>
            </Pressable>

            {/* REMARKS */}
            <Text style={styles.label}>Remarks</Text>

            <TextInput
              style={styles.input}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Promotion reason"
              multiline
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={styles.btn}
              onPress={() => dispatch(closePromotionModal())}
            >
              <Text>Cancel</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.primary]} onPress={save}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },

  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '85%',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  label: {
    fontWeight: '700',
    marginBottom: 4,
  },

  readonly: {
    marginBottom: 10,
  },

  select: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
  },

  menu: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    maxHeight: 200,
  },

  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  toggle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },

  btn: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },

  primary: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
});
