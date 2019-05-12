import React from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { useCountdown } from '../common/hooks';

export default (props) => {
  const countdown = useCountdown({
    autoStart: props.autoStart,
    expireTime: props.expireTime,
    onExpire: props.onExpire
  })

  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.timeText}>{countdown.seconds.toString()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red'
  },

  timeText: {
    color: 'white',
    fontSize: 48
  }
})
