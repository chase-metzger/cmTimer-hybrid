import Constants from '../common/constants'

const syncSavedSessionWtih = (session, state) => {
  const foundIndex = state.savedSessions.findIndex(item => item.name === session.name);
  const newSavedSessions = [...state.savedSessions];

  newSavedSessions[foundIndex] = session;

  return {
    ...state,
    savedSessions: newSavedSessions
  };
};

const setTimerSetting = (state, settingName, value) => {
  return {
    ...state,
    userSettings: {
      ...state.userSettings,
      timer: {
        ...state.userSettings.timer,
        [settingName]: value
      }
    }
  };
};

const setUserSetting = (state, field, value) => {
  const keys = field.split('.');
  const settingCategory = keys[0];
  const settingName = keys[1];

  switch (settingCategory) {
    case 'timer':
      return setTimerSetting(state, settingName, value);
    default:
      return state;
  }
}

const userSettings = (state, action) => {
  switch (action.type) {
    case 'UPDATE_USER_SETTINGS':
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload
        }
      };
    case 'SET_USER_SETTING':
      return setUserSetting(state, action.payload.settingName, action.payload.settingValue);
    default:
      return state;
  }
};

const rootReducer = (state = Constants.State.DEFAULT_APP_STATE, action) => {
  switch (action.type) {
    case 'CREATE_AND_SET_CURRENT_SESSION': {
      const newSession = {
        ...Constants.State.DEFAULT_SESSION_STATE,
        name: action.payload
      };

      return {
        ...state,
        currentSession: newSession,
        savedSessions: [
          ...state.savedSessions,
          newSession
        ]
      }
    };
    case 'SET_CURRENT_SESSION':
      return {
        ...state,
        currentSession: action.payload
      };
    case 'ADD_TIME_TO_CURRENT_SESSION': {
      const newCurrentSession = {
        ...state.currentSession,
        times: [
          ...state.currentSession.times,
          action.payload
        ]
      };

      return {
        ...state,
        currentSession: newCurrentSession
      };
    }
    case 'RESET_CURRENT_SESSION': {
      const newCurrentSession = {
        ...Constants.State.DEFAULT_SESSION_STATE,
        name: state.currentSession.name
      };

      const syncedState = syncSavedSessionWtih(newCurrentSession, state);

      return {
        ...syncedState,
        currentSession: newCurrentSession
      }
    };
    case 'SYNC_SAVED_SESSIONS_WITH_CURRENT_SESSION':
      return syncSavedSessionWtih(state.currentSession, state);
    case 'ADD_SAVED_SESSION':
      return {
        ...state,
        savedSessions: [
          ...state.savedSessions,
          action.payload
        ],
        currentSession: action.payload
      };
    case 'SET_SAVED_SESSIONS':
      return {
        ...state,
        savedSessions: action.payload
      };
    case 'UPDATE_USER_SETTINGS':
    case 'SET_USER_SETTING':
      return userSettings(state, action);
    default:
      return state;
  }
};

export default rootReducer;
