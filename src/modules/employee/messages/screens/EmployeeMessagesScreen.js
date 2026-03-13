import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import ChatRoomsScreen from './ChatRoomsScreen';
import ChatRoomScreen from './ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default function EmployeeMessagesScreen() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatRoomsScreen"
        component={ChatRoomsScreen}
        options={{ title: t('employee.messages.roomsTitle') }}
      />
      <Stack.Screen
        name="ChatRoomScreen"
        component={ChatRoomScreen}
        options={{ title: t('employee.messages.roomDetails') }}
      />
    </Stack.Navigator>
  );
}
