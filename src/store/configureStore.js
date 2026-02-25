// export default configureStore;

// import { createStore, applyMiddleware } from 'redux';
// const createSagaMiddleware = require('redux-saga').default;
// import rootReducer from './rootReducer';
// import rootSaga from './rootSaga';

// // Create saga middleware
// const sagaMiddleware = createSagaMiddleware();

// // Configure store with middleware
// const configureStore = () => {
//   const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

//   // Run the root saga
//   sagaMiddleware.run(rootSaga);

//   return store;
// };

// export default configureStore;

// src/store/configureStore.js
import { createStore, applyMiddleware, compose } from 'redux';
const createSagaMiddleware = require('redux-saga').default;
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

// Use DevTools compose if available (RN Debugger sets it on `global`)
const composeEnhancers =
  (__DEV__ &&
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) ||
  compose;

export const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );
  // console.log('STATE check Devesh kumar singgggggg', store.getState());

  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
