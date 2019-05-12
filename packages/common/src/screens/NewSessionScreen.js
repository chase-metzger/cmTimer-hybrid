import React from 'react';
import { Alert, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import {
  Input,
  ListItem
} from 'react-native-elements'

import { Item, MaterialHeaderButtons } from '../components/MaterialHeaderButtons'
import { connect } from '../context'

// interface Props {
//   navigation: any,
//   savedSessions: SessionTypes.SavedSessions,
//   createNewSession: (name: string) => SessionTypes.Session,
//   setCurrentSession: (session: SessionTypes.Session) => void,
//   currentSession: SessionTypes.Session,
// }

// interface State {
//   selectedSessionName: string,
//   newSessionName: string
// }

class NewSessionScreen extends React.Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'New Session',
      headerLeft: (
        <MaterialHeaderButtons>
          <Item
            title="Cancel"
            color={navigationOptions.headerTintColor}
            onPress={() => navigation.pop()}
          />
        </MaterialHeaderButtons>
      )
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedSessionName: props.currentSession.name,
      newSessionName: ''
    };
  }

  setSessionNameInput = (newSessionName) => {
    this.setState({ newSessionName })
  }

  onSubmitEditing = () => {
    const { navigation, savedSessions, createNewSession } = this.props
    const trimmedName = this.state.newSessionName.trim()
    if (trimmedName === '') {
      Alert.alert('Name can not be empty!')
      return
    }

    if (savedSessions.find(session => session.name === trimmedName)) {
      Alert.alert('A session with that name already exists')
      return
    }

    createNewSession(trimmedName)
    navigation.pop()
  }

  onSelectSessionFromList = (selectedSessionName) => {
    const { navigation, currentSession, savedSessions, setCurrentSession } = this.props

    if (currentSession.name !== selectedSessionName) {
      this.setState({ selectedSessionName })
      const found = savedSessions.find(session => session.name === selectedSessionName)
      setCurrentSession(found)
      navigation.pop()
    }
  }

  renderSession = ({ item }) => {
    if (item.name !== this.state.selectedSessionName) {
      return (
        <ListItem
          chevron={true}
          key={item.name}
          title={item.name}
          onPress={() => this.onSelectSessionFromList(item.name)}
        />
      )
    } else {
      return (
        <ListItem
          key={item.name}
          title={item.name}
          rightIcon={{ name: 'check', type: 'feather', color: 'blue' }}
          onPress={() => this.onSelectSessionFromList(item.name)}
        />
      )
    }
  }

  renderSessionsList = () => {
    return (
      <FlatList
        keyExtractor={item => item.name}
        data={this.props.savedSessions}
        renderItem={this.renderSession}
      />
    )
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Input
          inputStyle={styles.textInput}
          value={this.state.newSessionName}
          containerStyle={{ margin: 15 }}
          returnKeyType="done"
          placeholder="New session name..."
          onChangeText={this.setSessionNameInput}
          onSubmitEditing={() => this.onSubmitEditing()}
        />
        {this.renderSessionsList()}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    color: 'black'
  }
})


const mapStateToProps = (state) => {
  return {
    ...state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createNewSession: (name: string) => dispatch({ type: 'CREATE_AND_SET_CURRENT_SESSION', payload: name }),
    setCurrentSession: (session) => dispatch({ type: 'SET_CURRENT_SESSION', payload: session })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSessionScreen)
