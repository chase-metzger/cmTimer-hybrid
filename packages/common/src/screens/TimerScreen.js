import React from 'react';
import {
  View
} from 'react-native';

import TimerView from '../components/TimerView';
import ScrambleView from '../components/ScrambleView';

import { connect } from '../context';
import { generateScramble, scrambleToString } from '../common/scramble_utils';

// interface Props {
//   settings: Setting<TimingSettings>
//   addTimeToCurrentSession: (time: SessionTime) => object
//   syncSavedSessions: () => void
// }

const TimerScreen = (props) => {
  const { addTimeToCurrentSession, syncSavedSessions } = props;
  const [scramble, setScramble] = React.useState(() => generateScramble(25));
  const [scrambleString, setScrambleString] = React.useState(scrambleToString(scramble));

  React.useEffect(() => {
    setScrambleString(scrambleToString(scramble));
  }, [scramble]);

  // const inspectionTime = props.settings.inspectionTime
  const inspectionTime = 15;

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrambleView style={{ flex: 1 }} scramble={scrambleString} />
      <TimerView
        style={{ flex: 3 }}
        inspectionTime={inspectionTime ? inspectionTime.value : 0}
        onTimerDone={(time) => {
          addTimeToCurrentSession({ value: time, scramble });
          syncSavedSessions();
          setScramble(generateScramble(25));
        }}
      />
    </View>
  )
}

const mapStateToProps = (state) => {
  return {
    //  settings: state.userSettings.timer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTimeToCurrentSession: (time) => dispatch({ type: 'ADD_TIME_TO_CURRENT_SESSION', payload: time }),
    syncSavedSessions: () => dispatch({ type: 'SYNC_SAVED_SESSIONS_WITH_CURRENT_SESSION' })
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TimerScreen)
// export default TimerScreen;
