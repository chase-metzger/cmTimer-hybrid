import { StyleSheet, Platform } from 'react-native';

export const DEFAULT_TIMER_BACKGROUND_COLOR = '#a12';
export const PRESSED_TIMER_BACKGROUND_COLOR = '#1a4';

export const COMMON_STYLES = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'android' ? 24 : 0,
    backgroundColor: 'black'
  },
  headerTitle: Platform.select({
    web: {
      margin: 15,
      fontSize: 24
    },
    default: {
      fontSize: 24
    }
  })
});
