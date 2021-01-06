import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainNavigator from './navigation/MainNavigator';
import {Provider} from 'react-redux'
import authReducer from './store/reducers/auth';
import blogReducer from './store/reducers/blog';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

const rootReducer = combineReducers({
  auth : authReducer,
  blog: blogReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'dancing': require('./assets/fonts/Dancing.ttf')
}
)};


export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setDataLoaded(true);
        }}
        onError = {console.warn}
      />
    );
  }


  return (
    <Provider store={store}>
          <MainNavigator />
     </Provider>

  )};
