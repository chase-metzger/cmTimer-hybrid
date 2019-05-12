import React from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import moment from 'moment';

export default ({ stats, numTimes, ...rest }) => {
  return (
    <View {...rest}>
      <View style={styles.numberOfSolves}>
        {
          stats.map(stat => <Text key={stat.name}>{stat.name}: {moment(stat.value).format('mm:ss:SS')}</Text>)
        }
        <Text>Number of solves: {numTimes}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  numberOfSolves: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
  },
});
