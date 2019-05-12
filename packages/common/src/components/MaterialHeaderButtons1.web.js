import React from 'react';
import { View, Button } from 'react-native';

export const MaterialHeaderButton = (props) => {
  return <Button {...props} />
}

export const MaterialHeaderButtons = (props) => {
  return (
    <View style={[{ flex: 1 }, props.style]}>
      {props.children}
    </View>
  );
}

export const Item = Button;
