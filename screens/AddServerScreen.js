/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import ServerInput from '../components/ServerInput';
import Colors from '../constants/Colors';

export default class AddServerScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            style={styles.logoImage}
            source={require('../assets/images/logowhite.png')}
            fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300` 
          />
        </View>
        <ServerInput
          navigation={this.props.navigation}
          containerStyle={styles.serverTextContainer}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  serverTextContainer: {
    flex: 1.5,
    alignContent: 'flex-start'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor
  },
  logoImage: {
    marginBottom: 12,
    width: '90%',
    height: undefined,
    // Aspect ration of the logo
    aspectRatio: 3.18253
  }
});