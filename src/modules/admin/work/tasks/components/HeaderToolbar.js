import React from 'react';
import { View, TextInput } from 'react-native';
import { Button } from './ui';

export default function HeaderToolbar({
  view,
  onChangeView,
  onAdd,
  onMyTask,
  onApprove,
  search,
  onSearch,
}) {
  const is = m => view === m;
  const Btn = ({ label, mode }) => (
    <Button
      title={label}
      onPress={() => onChangeView(mode)}
      bg={is(mode) ? '#111827' : '#E5E7EB'}
      color={is(mode) ? '#fff' : '#111827'}
      style={{ paddingHorizontal: 12, paddingVertical: 8 }}
    />
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginBottom: 10,
      }}
    >
      <Button title="+ Add" onPress={onAdd} />
      <Button title="👤" onPress={onMyTask} bg="#E5E7EB" color="#111827" />

      <Btn label="≡" mode="list" />
      <Btn label="🗓️" mode="calendar" />
      <Btn label="Kanban" mode="kanban" />
      <Btn label="📌" mode="pin" />
      <Button
        title="⚠️"
        onPress={onApprove ? onApprove : () => onChangeView('approval')}
        bg={is('approval') ? '#111827' : '#E5E7EB'}
        color={is('approval') ? '#fff' : '#111827'}
        style={{ paddingHorizontal: 12, paddingVertical: 8 }}
      />

      {/* <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <View
          style={{
            width: 40,
            height: 36,
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            paddingHorizontal: 3,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TextInput
            value={search}
            onChangeText={onSearch}
            placeholder="Search"
            style={{ flex: 1 }}
          />
        </View>
      </View> */}
    </View>
  );
}
