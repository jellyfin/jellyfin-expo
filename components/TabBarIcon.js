import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    focused: PropTypes.bool.isRequired
  };

  render() {
    return (
      <Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}
