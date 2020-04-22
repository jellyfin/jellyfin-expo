/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, Text } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class SettingsSection extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    heading: PropTypes.string
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          {this.props.heading}
        </Text>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 15
  },
  heading: {
    color: colors.grey4,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 15,
    marginRight: 15
  }
});
