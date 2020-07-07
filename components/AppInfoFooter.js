/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, Text } from 'react-native-elements';
import Constants from 'expo-constants';

import { getAppName } from '../utils/Device';

const AppInfoFooter = () => (
  <View style={styles.container}>
    <Text style={styles.text}>{`${getAppName()}`}</Text>
    <Text style={styles.text}>{`${Constants.nativeAppVersion} (${Constants.nativeBuildVersion})`}</Text>
    <Text style={styles.text}>{`Expo Version: ${Constants.expoVersion}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: 15
  },
  text: {
    color: colors.grey4,
    fontSize: 15
  }
});

export default AppInfoFooter;
