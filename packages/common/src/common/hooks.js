import { useState, useEffect, useRef } from 'react';
import { StatusBar, AppState } from 'react-native';
import moment from 'moment';

import storage from '../storage';

export const useTimerInterval = (duration, startImmediately, callback) => {
  const [intervalState, setIntervalState] = useState(startImmediately);
  const [time, setTime] = useState(0);
  useEffect(() => {
    let tmpID = null;
    if (intervalState) {
      tmpID = setInterval(() => {
        setTime(moment.now() - time);
        if (callback) {
          callback();
        }
      }, duration);
    }

    return () => {
      if (tmpID) {
        clearInterval(tmpID);
      }
    }
  }, [intervalState]);

  return {
    isRunning: intervalState,
    time,
    start: () => setIntervalState(true),
    stop: () => setIntervalState(false),
    reset: () => {
      setTime(moment.now())
      setIntervalState(false)
    }
  };
};

export const useStatusBarStyle = (initialStyle) => {
  const [style, setStyle] = useState(initialStyle);
  useEffect(() => {
    StatusBar.setBarStyle(style);

    return () => {
      StatusBar.setBarStyle(initialStyle);
    }
  }, [style]);

  return [style, setStyle];
};

export const useCountdown = (options) => {
  const { expireTime, autoStart, onExpire } = options

  const [expireDate, setExpireDate] = useState(() => expireTime)

  const [seconds, setSeconds] = useState(0)
  function subtractSecond() {
    setSeconds(prev => {
      if (prev === 0) {
        subtractMinute()
        return 59
      } else if (prev > 0) {
        return prev - 1
      }
      return 0
    })
  }

  const [minutes, setMinutes] = useState(0)
  function subtractMinute() {
    setMinutes(prev => {
      if (prev === 0) {
        subtractHour()
        return 59
      } else if (prev > 0) {
        return prev - 1
      }
      return 0
    })
  }

  const [hours, setHours] = useState(0)
  function subtractHour() {
    setHours(prev => {
      if (prev === 0) {
        subtractDay()
        return 23
      } else if (prev > 0) {
        return prev - 1
      }
      return 0
    })
  }

  const [days, setDays] = useState(0)
  function subtractDay() {
    setDays(prev => {
      if (prev > 0) {
        return prev - 1
      }

      reset()
      // if (onExpire) {
      //   onExpire()
      // }

      return 0
    })
  }

  const intervalRef = useRef()

  function start() {
    if (isValidExpireTime(expireDate) && !intervalRef.current) {
      calculateExpireDate()
      intervalRef.current = setInterval(() => calculateExpireDate(), 1000)
    }
  }

  function pause() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }

  function reset() {
    pause()
    setSeconds(0)
    setMinutes(0)
    setHours(0)
    setDays(0)
  }

  function resume() {
    if (isValidExpireTime(expireDate) && !intervalRef.current) {
      intervalRef.current = setInterval(() => subtractSecond(), 1000)
    }
  }

  function calculateExpireDate() {
    const now = new Date().getTime()
    const delta = expireDate.getTime() - now
    const daysRemaining = Math.floor(delta / (1000 * 60 * 60 * 24))
    const hoursRemaining = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60))
    const secondsRemaining = Math.floor((delta % (1000 * 60)) / 1000)
    if (secondsRemaining < 0) {
      reset()
      if (onExpire) {
        onExpire()
      }
    } else {
      setSeconds(secondsRemaining)
      setMinutes(minutesRemaining)
      setHours(hoursRemaining)
      setDays(daysRemaining)
    }
  }

  function isValidExpireTime(time) {
    return (new Date(time).getTime() > 0)
  }

  useEffect(() => {
    if (autoStart === true) {
      start()
    }
    return reset
  }, [])

  // useEffect(() => {
  //   if (!intervalRef.current) {
  //     reset()
  //   }
  // }, [expireDate])

  return { isRunning: intervalRef.current !== undefined, seconds, minutes, hours, days, start, pause, resume, reset, setExpireTime: (time: Date) => setExpireDate(time) }
}

export const useStorage = (key, initialValue, errorCallback) => {
  const [storedValue, setStoredValue] = useState(() => initialValue)

  useEffect(() => {
    storage.load({
      key
    }).then(data => {
      setStoredValue(data);
    }).catch(error => {
      setStoredValue(initialValue);
      if (errorCallback) {
        errorCallback(error);
      }
    });
  }, [key]);

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore);
    storage.save({
      key,
      data: valueToStore
    }).catch(error => (errorCallback && errorCallback(error)));
  }

  return [storedValue, setValue];
}

const currentAppState = AppState.currentState

export const useAppState = (callback) => {
  const [appState, setAppState] = useState(currentAppState);

  function onChange(newState) {
    setAppState(newState);
    if (callback) {
      callback(newState);
    }
  }

  useEffect(() => {
    AppState.addEventListener('change', onChange);

    return () => AppState.removeEventListener('change', onChange);
  }, [callback]);

  return appState;
}

// export const useAsyncStorageObject = (name: string, initialValue?: object, errorCallback?: (error?: Error) => void) => {
//   const [storageObject, setStorageObject] = useAsyncStorage(name, initialValue, errorCallback)

//   function setField(field: string, value: any) {
//     const keys = field.split('.')
//     let newField = { [keys[keys.length - 1]]: value }
//     for (let i = keys.length - 2; i >= 0; --i) {
//       newField = {
//         [keys[i]]: { ...newField }
//       }
//     }

//     setStorageObject({ ...storageObject, ...newField })
//   }

//   return {
//     value: storageObject,
//     setValue: (value: object) => setStorageObject(value),
//     setField
//   }
// }

export const useUserSettings = () => {
  const userSettings = useStorage('userSettings', DEFAULT_USER_SETTINGS, error => console.log(error))

  function setSetting(name, value) {
    userSettings.setField(name, value)
  }

  return {
    value: userSettings.value,
    setSetting,
    setAllSettings: (settings) => userSettings.setValue(settings)
  }
}
