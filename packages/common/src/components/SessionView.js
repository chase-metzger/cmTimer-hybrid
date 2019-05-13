import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList
} from 'react-native';

import { ListItem } from 'react-native-elements';

import moment from 'moment';
import { scrambleToString } from '../common/scramble_utils';

export default ({ name, times }) => {

  function createListItemText(item, index) {
    return (index + 1) + '. ' + moment(item.value).format('mm:ss:SS');;
  }

  function renderListItem({ item, index }) {
    return (
      <View style={styles.listItemContainer}>
        <ListItem
          key={index}
          title={createListItemText(item, index)}
          subtitle={scrambleToString(item.scramble)}
          containerStyle={{ backgroundColor: 'white' }}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={[{ data: times }]}
        renderItem={renderListItem}
        renderSectionHeader={() => (<View style={styles.sessionListHeader}><Text>{name}</Text></View>)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItemContainer: {
    flex: 1
  },
  timeListItem: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 5
  },
  sessionListHeader: {
    backgroundColor: 'lightgray',
    padding: 2
  }
})
