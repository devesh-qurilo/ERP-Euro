// const createSagaMiddleware = require('redux-saga').default;
// import rootSaga from './rootSaga';
// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer';

// const sagaMiddleware = createSagaMiddleware();

// export const store = configureStore({
//   reducer: {
//     rootReducer,
//   },
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       thunk: false,
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }).concat(sagaMiddleware),
// });

// sagaMiddleware.run(rootSaga);

// const { configureStore } = require('@reduxjs/toolkit');
// const createSagaMiddleware = require('redux-saga').default;
// const rootReducer = require('./rootReducer');
// const rootSaga = require('./rootSaga');

// // Create saga middleware
// const sagaMiddleware = createSagaMiddleware();

// // Configure store
// const store = configureStore({
//   reducer: rootReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       thunk: false,
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }).concat(sagaMiddleware),
// });

// // Run root saga
// sagaMiddleware.run(rootSaga);

// module.exports = store;

// import { createStore, applyMiddleware } from 'redux';
// import createSagaMiddleware from 'redux-saga';
// import rootReducer from './rootReducer';
// import rootSaga from './rootSaga';

// // Create saga middleware
// const sagaMiddleware = createSagaMiddleware();

// // Configure store
// const configureStore = () => {
//   const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

//   // Run the root saga
//   sagaMiddleware.run(rootSaga);

//   return store;
// };

// export default configureStore;

import { createStore, applyMiddleware } from 'redux';
const createSagaMiddleware = require('redux-saga').default;
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store with middleware
const configureStore = () => {
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

  // Run the root saga
  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
