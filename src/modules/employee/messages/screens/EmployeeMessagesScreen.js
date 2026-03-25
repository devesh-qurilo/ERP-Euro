import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatRoomsScreen from './ChatRoomsScreen';
import ChatRoomScreen from './ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default function EmployeeMessagesScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatRoomsScreen"
        component={ChatRoomsScreen}
        options={{ title: 'Message' }}
      />
      <Stack.Screen
        name="ChatRoomScreen"
        component={ChatRoomScreen}
        options={{ title: 'm Details' }}
      />
    </Stack.Navigator>
  );
}
