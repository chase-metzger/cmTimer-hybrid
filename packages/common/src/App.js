import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import Icon from 'react-native-vector-icons/Entypo';

import { MaterialHeaderButtons, Item as MaterialItem } from './components/MaterialHeaderButtons';

import { Provider, connect } from './context';
import rootReducer from './context/reducers';

import { useStorage, useStatusBarStyle, useAppState } from './common/hooks';
import Constants from './common/constants';

import TimerScreen from './screens/TimerScreen';
import StatsAndSessionScreen from './screens/StatsAndSessionScreen';
import NewSessionScreen from './screens/NewSessionScreen';

import makeAppContainer from './app_container';

const StatsNavigator = createStackNavigator({
  stats: StatsAndSessionScreen,
  new_session: {
    screen: NewSessionScreen,
    navigationOptions: {
    }
  }
},
  {
    mode: 'modal',
    defaultNavigationOptions: {
      headerBackTitleVisisble: false,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'black'
      }
    }
  });

const MainNavigator = createBottomTabNavigator({
  timer: {
    screen: TimerScreen,
    navigationOptions: {
      title: 'Timer',
      tabBarIcon: ({ tintColor }) => <Icon name="stopwatch" color={tintColor} size={25} />,
    }
  },
  stats: {
    screen: StatsNavigator,
    navigationOptions: {
      title: 'Stats',
      tabBarIcon: ({ tintColor }) => <Icon name="bar-graph" color={tintColor} size={25} />
    }
  }
}, {
    tabBarOptions: {
      iconStyle: {
        backgroundColor: 'white'
      },
      inactiveBackgroundColor: 'black',
      activeBackgroundColor: 'black',
    }
  });


const AppContainer = makeAppContainer(MainNavigator);


const App = (props) => {
  useStatusBarStyle('light-content');

  const [loadedSessions, setLoadedSessions] = useStorage('savedSessions', props.savedSessions, console.log);
  const [loadedCurrentSession, setLoadedCurrentSession] = useStorage('currentSession', props.currentSession, console.log);

  useAppState(state => {
    if (state === 'background' || state === 'inactive') {
      setLoadedSessions(props.savedSessions);
      setLoadedCurrentSession(props.currentSession);
      //todo user settings
    }
  });

  React.useEffect(() => {
    if (loadedSessions) {
      props.setSavedSessions(loadedSessions)
    }

    if (loadedCurrentSession) {
      props.setCurrentSession(loadedCurrentSession)
    }

    // if (userSettings.value) {
    //   props.setUserSettings(userSettings.value)
    // }
  }, [loadedSessions, loadedCurrentSession])//, userSettings.value])

  return <AppContainer />
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSavedSessions: (sessions) => dispatch({ type: 'SET_SAVED_SESSIONS', payload: sessions }),
    setCurrentSession: (session) => dispatch({ type: 'SET_CURRENT_SESSION', payload: session }),
    // setUserSettings: (userSettings: UserSettings) => dispatch({
    //   type: 'UPDATE_USER_SETTINGS', payload: userSettings
    // })
  }
}

const ConnectedApp = connect(state => ({ ...state }), mapDispatchToProps)(App)

const defaultState = { ...Constants.State.DEFAULT_APP_STATE };

export default () => {
  return (
    <Provider
      defaultState={defaultState}
      reducer={rootReducer}
    >
      <ConnectedApp />
    </Provider>
  );
};
