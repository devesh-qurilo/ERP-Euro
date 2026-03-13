// import React from 'react';
// import {  StatusBar } from 'react-native';
// import AppNavigator from './src/navigation/AppNavigator';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const App = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={{ flex: 1 }}>
//         <AppNavigator />
//       </SafeAreaView>
//     </>
//   );
// };

// export default App;

// import React from 'react';
// import {  StatusBar } from 'react-native';
// import AppNavigator from './src/navigation/AppNavigator';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const App = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={{ flex: 1 }}>
//         <AppNavigator />
//       </SafeAreaView>
//     </>
//   );
// };

// export default App;

// import React from 'react';
// import { SafeAreaView, StatusBar } from 'react-native';
// import { Provider } from 'react-redux';
// import AppNavigator from './kkkkkk/navigation/AppNavigator';
// import configureStore from './kkkkkk/store/configureStore';

// const store = configureStore();

// const App = () => {
//   return (
//     <Provider store={store}>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={{ flex: 1 }}>
//         <AppNavigator />
//       </SafeAreaView>
//     </Provider>
//   );
// };

// export default App;

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/localization/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import configureStore from './src/store/configureStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigator />
        </SafeAreaView>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
