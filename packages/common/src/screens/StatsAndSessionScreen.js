import React from 'react';

import {
  View,
  Platform,
  SafeAreaView,
  ScrollView
} from 'react-native';

import { Divider } from 'react-native-elements';

import SessionView from '../components/SessionView';
import StatsView from '../components/StatsView';
import { MaterialHeaderButtons, Item } from '../components/MaterialHeaderButtons'

import { connect } from '../context';

// interface Props {
//   resetCurrentSession: () => void,
//   setCurrentSession: (session: SessionTypes.Session) => void,
//   createNewSession: (name: string) => SessionTypes.Session,
//   navigation: any,
//   savedSessions: Array<SessionTypes.Session>,
//   currentSession: SessionTypes.Session,
// }

class StatsAndSessionScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Stats',
      headerStyle: {
        marginTop: Platform.OS === 'android' ? 24 : 0,
        backgroundColor: 'black'
      },
      headerTintColor: 'white',
      headerLeft: (
        <MaterialHeaderButtons>
          <Item
            title="Clear"
            color="white"
            onPress={() => navigation.getParam('resetCurrentSession')()}
          />
        </MaterialHeaderButtons>
      ),
      headerRight: (
        <MaterialHeaderButtons>
          <Item
            title="Sessions"
            color="white"
            onPress={() => navigation.navigate('new_session', { ...navigation.state.params })}
          />
        </MaterialHeaderButtons>
      )
    }
  }

  componentDidMount() {
    const { navigation, resetCurrentSession } = this.props
    navigation.setParams({
      resetCurrentSession
    });
  }

  render() {
    let { currentSession } = this.props;
    if (!currentSession) {
      currentSession = { times: [], stats: [] };
    }
    return (
      <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1 }}>
          <StatsView stats={currentSession.stats} numTimes={currentSession.times.length} />
          <Divider style={{ height: 2 }} />
          <ScrollView style={{ flex: 8, backgroundColor: 'white' }}>
            <SessionView key={currentSession.name} name={currentSession.name} times={currentSession.times} />
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentSession: state.currentSession,
    savedSessions: state.savedSessions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetCurrentSession: () => dispatch({ type: 'RESET_CURRENT_SESSION' }),
    setCurrentSession: (session) => dispatch({ type: 'SET_CURRENT_SESSION', payload: session }),
    createNewSession: (name) => dispatch({ type: 'ADD_SAVED_SESSION', payload: name })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsAndSessionScreen)
//export default StatsAndSessionScreen;
