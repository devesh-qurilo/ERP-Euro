// // components/DealFilters.js

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectEmpList } from '../../../hr/employees/store/selectors';
// import { fetchEmployees } from '../../../hr/employees/store/actions';

// export default function DealFilters({ defaultParams = {}, onApply }) {
//   const dispatch = useDispatch();
//   const employees = useSelector(selectEmpList) || [];

//   const [search, setSearch] = useState(defaultParams.search || '');
//   const [stage, setStage] = useState(defaultParams.stage || '');
//   const [agent, setAgent] = useState(defaultParams.agent || '');
//   const [priority, setPriority] = useState(defaultParams.priority || '');
//   const [pipeline, setPipeline] = useState(defaultParams.pipeline || '');
//   const [minValue, setMinValue] = useState('');
//   const [maxValue, setMaxValue] = useState('');
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');

//   const empOptions = useMemo(
//     () =>
//       employees.map(e => ({
//         label: `${e.name} (${e.employeeId})`,
//         value: e.employeeId,
//       })),
//     [employees],
//   );

//   const applyFilters = () => {
//     onApply({
//       search,
//       stage,
//       agent,
//       priority,
//       pipeline,
//       minValue,
//       maxValue,
//       dateFrom,
//       dateTo,
//       page: 0,
//     });
//   };
//   useEffect(() => {
//     dispatch(fetchEmployees());
//     //   dispatch(fetchAdminLeads());
//   }, [dispatch]);

//   return (
//     <View style={styles.container}>
//       {/* Search */}
//       <TextInput
//         placeholder="Search title, lead..."
//         style={styles.input}
//         value={search}
//         onChangeText={setSearch}
//       />

//       {/* Stage */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={stage} onValueChange={setStage}>
//           <Picker.Item label="All Stages" value="" />
//           <Picker.Item label="Generated" value="Generated" />
//           <Picker.Item label="Won" value="Won" />
//           <Picker.Item label="Lost" value="Lost" />
//         </Picker>
//       </View>

//       {/* Agent */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={agent} onValueChange={setAgent}>
//           <Picker.Item label="All Agents" value="" />
//           {empOptions.map(opt => (
//             <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
//           ))}
//         </Picker>
//       </View>

//       {/* Priority */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={priority} onValueChange={setPriority}>
//           <Picker.Item label="All Priority" value="" />
//           <Picker.Item label="High" value="High" />
//           <Picker.Item label="Medium" value="Medium" />
//           <Picker.Item label="Low" value="Low" />
//         </Picker>
//       </View>

//       {/* Value Range */}
//       <TextInput
//         placeholder="Min Value"
//         keyboardType="numeric"
//         style={styles.input}
//         value={minValue}
//         onChangeText={setMinValue}
//       />

//       <TextInput
//         placeholder="Max Value"
//         keyboardType="numeric"
//         style={styles.input}
//         value={maxValue}
//         onChangeText={setMaxValue}
//       />

//       {/* Date Range */}
//       <TextInput
//         placeholder="Close From (YYYY-MM-DD)"
//         style={styles.input}
//         value={dateFrom}
//         onChangeText={setDateFrom}
//       />

//       <TextInput
//         placeholder="Close To (YYYY-MM-DD)"
//         style={styles.input}
//         value={dateTo}
//         onChangeText={setDateTo}
//       />

//       <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
//         <Text style={styles.applyText}>Apply</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 12,
//     gap: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#eee',
//     borderRadius: 8,
//     padding: 8,
//     minWidth: 140,
//     backgroundColor: '#fff',
//   },
//   pickerBox: {
//     borderWidth: 1,
//     borderColor: '#eee',
//     borderRadius: 8,
//     minWidth: 160,
//   },
//   applyBtn: {
//     backgroundColor: '#3F6AE1',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   applyText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

// components/DealFilters.js

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Text,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// import { useDispatch, useSelector } from 'react-redux';
// import { selectEmpList } from '../../../hr/employees/store/selectors';
// import { fetchEmployees } from '../../../hr/employees/store/actions';

// export default function DealFilters({ defaultParams = {}, onApply }) {
//   const dispatch = useDispatch();
//   const employees = useSelector(selectEmpList) || [];

//   const [search, setSearch] = useState(defaultParams.search || '');
//   const [stage, setStage] = useState(defaultParams.stage || '');
//   const [agent, setAgent] = useState(defaultParams.agent || '');
//   const [priority, setPriority] = useState(defaultParams.priority || '');
//   const [minValue, setMinValue] = useState('');
//   const [maxValue, setMaxValue] = useState('');
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');

//   const empOptions = useMemo(
//     () =>
//       employees.map(e => ({
//         label: `${e.name} (${e.employeeId})`,
//         value: e.employeeId,
//       })),
//     [employees],
//   );

//   const applyFilters = () => {
//     onApply({
//       search,
//       stage,
//       agent,
//       priority,
//       minValue,
//       maxValue,
//       dateFrom,
//       dateTo,
//       page: 0,
//     });
//   };

//   useEffect(() => {
//     dispatch(fetchEmployees());
//     //   dispatch(fetchAdminLeads());
//   }, [dispatch]);

//   return (
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       contentContainerStyle={styles.container}
//     >
//       {/* Search */}
//       <TextInput
//         placeholder="Search"
//         style={styles.input}
//         value={search}
//         onChangeText={setSearch}
//       />

//       {/* Stage */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={stage} onValueChange={setStage}>
//           <Picker.Item label="All Stages" value="" />
//           <Picker.Item label="Generated" value="Generated" />
//           <Picker.Item label="Won" value="Won" />
//           <Picker.Item label="Lost" value="Lost" />
//         </Picker>
//       </View>

//       {/* Agent */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={agent} onValueChange={setAgent}>
//           <Picker.Item label="All Agents" value="" />
//           {empOptions.map(opt => (
//             <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
//           ))}
//         </Picker>
//       </View>

//       {/* Priority */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={priority} onValueChange={setPriority}>
//           <Picker.Item label="All Priority" value="" />
//           <Picker.Item label="High" value="High" />
//           <Picker.Item label="Medium" value="Medium" />
//           <Picker.Item label="Low" value="Low" />
//         </Picker>
//       </View>

//       {/* Min Value */}
//       <TextInput
//         placeholder="Min $"
//         keyboardType="numeric"
//         style={styles.inputSmall}
//         value={minValue}
//         onChangeText={setMinValue}
//       />

//       {/* Max Value */}
//       <TextInput
//         placeholder="Max $"
//         keyboardType="numeric"
//         style={styles.inputSmall}
//         value={maxValue}
//         onChangeText={setMaxValue}
//       />

//       {/* Date From */}
//       <TextInput
//         placeholder="From (YYYY-MM-DD)"
//         style={styles.inputMedium}
//         value={dateFrom}
//         onChangeText={setDateFrom}
//       />

//       {/* Date To */}
//       <TextInput
//         placeholder="To (YYYY-MM-DD)"
//         style={styles.inputMedium}
//         value={dateTo}
//         onChangeText={setDateTo}
//       />

//       {/* Apply Button */}
//       <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
//         <Text style={styles.applyText}>Apply</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     alignItems: 'center',
//     gap: 10,
//   },

//   input: {
//     width: 160,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     padding: 8,
//     backgroundColor: '#fff',
//   },

//   inputSmall: {
//     width: 100,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     padding: 8,
//     backgroundColor: '#fff',
//   },

//   inputMedium: {
//     width: 140,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     padding: 8,
//     backgroundColor: '#fff',
//   },

//   pickerBox: {
//     width: 160,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },

//   applyBtn: {
//     backgroundColor: '#3F6AE1',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },

//   applyText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

// components/DealFilters.js

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmpList } from '../../../hr/employees/store/selectors';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import SelectModal from './SelectModal';

export default function DealFilters({ onChange }) {
  const employees = useSelector(selectEmpList) || [];
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [agent, setAgent] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [showStage, setShowStage] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const stageOptions = [
    { label: 'All Stages', value: '' },
    { label: 'Generated', value: 'Generated' },
    { label: 'Won', value: 'Won' },
    { label: 'Lost', value: 'Lost' },
  ];

  const handleClear = () => {
    setSearch('');
    setStage('');
    setAgent('');
    setDateFrom(null);
    setDateTo(null);

    onChange({}); // reset filters in parent
  };

  const agentOptions = useMemo(
    () =>
      [{ label: 'All Agents', value: '' }].concat(
        employees.map(e => ({
          label: `${e.name} (${e.employeeId})`,
          value: e.employeeId,
        })),
      ),
    [employees],
  );

  /* 🔥 Instant filtering */
  useEffect(() => {
    onChange({
      search,
      stage,
      agent,
      dateFrom,
      dateTo,
    });
  }, [search, stage, agent, dateFrom, dateTo]);

  useEffect(() => {
    dispatch(fetchEmployees());
    //   dispatch(fetchAdminLeads());
  }, [dispatch]);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Pressable style={styles.clearBtn} onPress={handleClear}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
        {/* Search */}
        <TextInput
          placeholder="Search"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />

        {/* Stage */}
        <Pressable style={styles.dropdown} onPress={() => setShowStage(true)}>
          <Text>{stage || 'Stage'}</Text>
        </Pressable>

        {/* Agent */}
        <Pressable style={styles.dropdown} onPress={() => setShowAgent(true)}>
          <Text>{agent || 'Agent'}</Text>
        </Pressable>

        {/* Date From */}
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowFromPicker(true)}
        >
          <Text>
            {dateFrom ? dateFrom.toISOString().slice(0, 10) : 'From Date'}
          </Text>
        </Pressable>

        {/* Date To */}
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowToPicker(true)}
        >
          <Text>{dateTo ? dateTo.toISOString().slice(0, 10) : 'To Date'}</Text>
        </Pressable>
      </ScrollView>

      {/* Dropdown Modals */}
      <SelectModal
        visible={showStage}
        options={stageOptions}
        onSelect={setStage}
        onClose={() => setShowStage(false)}
      />

      <SelectModal
        visible={showAgent}
        options={agentOptions}
        onSelect={setAgent}
        onClose={() => setShowAgent(false)}
      />

      {/* Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={dateFrom || new Date()}
          mode="date"
          display="default"
          onChange={(_, selected) => {
            setShowFromPicker(false);
            if (selected) setDateFrom(selected);
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={dateTo || new Date()}
          mode="date"
          display="default"
          onChange={(_, selected) => {
            setShowToPicker(false);
            if (selected) setDateTo(selected);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-start',
    gap: 10,
    // backgroundColor: '#d84242',
  },

  input: {
    width: 160,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },

  dropdown: {
    minWidth: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  clearBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },

  clearText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
