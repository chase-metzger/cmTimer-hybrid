import React from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.algorithmText}>{props.scramble}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  },

  algorithmText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center'
  }
});
