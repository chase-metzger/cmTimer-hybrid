import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

//TODOO ADD ACONSTANTNSLNTALSTLSLLASFLSDFLSDLFSLJFLFSLDFJD

const Constants = {
  UI: {
    DEFAULT_TIMER_BACKGROUND_COLOR: 'red',
    PRESSED_TIMER_BACKGROUND_COLOR: 'green'
  }
};
//import Constants from '../common/constants'

import CountdownView from './CountdownView';
import { useTimerInterval } from '../common/hooks';
import moment from 'moment';



export default (props) => {
  const [backgroundColor, setBackgroundColor] = useState(Constants.UI.DEFAULT_TIMER_BACKGROUND_COLOR)
  const timer = useTimerInterval(50, false)
  const [isHoldingDown, setIsHoldingDown] = useState(false)

  const [isCountdownRunning, setCountdownRunning] = useState(false)
  const [countdownExpire, setCountdownExpire] = useState(undefined)

  useEffect(() => {
    if (isHoldingDown) {
      setBackgroundColor(Constants.UI.PRESSED_TIMER_BACKGROUND_COLOR)
    } else {
      setBackgroundColor(Constants.UI.DEFAULT_TIMER_BACKGROUND_COLOR)
    }
  }, [isHoldingDown])

  function onTimerPress() {
    if (timer.isRunning) {
      timer.stop()
      if (props.onTimerDone) {
        props.onTimerDone(timer.time, 'BLAH BLAH')
      }
    }
  }

  function onTimerLongPress() {
    if (!timer.isRunning || isCountdownRunning) {
      setIsHoldingDown(true)
    } else {
      timer.stop()
      if (props.onTimerDone) {
        props.onTimerDone(timer.time, 'flsljsdlfsdj')
      }
    }
  }

  function onTimerPressOut() {
    if (isCountdownRunning && isHoldingDown) {
      setCountdownRunning(false)
      timer.reset()
      setIsHoldingDown(false)
      timer.start()
    } else if (isHoldingDown) {
      timer.reset()
      setIsHoldingDown(false)
      const secondsLater = new Date()
      secondsLater.setSeconds(secondsLater.getSeconds() + 15)
      setCountdownExpire(secondsLater)
      setCountdownRunning(true)
    }
  }

  return (
    <View style={props.style}>
      <TouchableHighlight
        style={[styles.timerTextContainer, { backgroundColor: backgroundColor }]}
        activeOpacity={0.7}
        onPress={onTimerPress}
        onLongPress={onTimerLongPress}
        onPressOut={onTimerPressOut}
      >
        {
          isCountdownRunning ? <CountdownView
            style={{ backgroundColor: backgroundColor }}
            expireTime={countdownExpire}
            onExpire={() => console.log('done with countdown')}
            autoStart={true} />
            :
            <Text style={styles.timerText}>{moment(timer.time).format('mm:ss:SS')}</Text>
        }
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  timerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  timerText: {
    color: 'white',
    fontSize: 48
  }
})
