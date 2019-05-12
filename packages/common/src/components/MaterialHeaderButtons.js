import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons'

export const MaterialHeaderButton = (props) => {
  return <HeaderButton {...props} IconComponent={Icon} />
}

export const MaterialHeaderButtons = (props) => {
  return <HeaderButtons {...props} HeaderButtonComponent={MaterialHeaderButton} />
}

export const Item = HeaderButtons.Item;
