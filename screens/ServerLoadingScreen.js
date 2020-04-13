/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';

import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';

export default class ServerLoadingScreen extends React.Component {
  state = { areResourcesReady: false };

  constructor(props) {
    super(props);
    SplashScreen.preventAutoHide();
  }

  async getServers() {
    return await CachingStorage.getInstance().getItem(StorageKeys.Servers);
  }

  async bootstrapAsync() {
    const servers = await this.getServers();
    const hasServer = !!servers && servers.length > 0;
    console.info('servers', servers, hasServer);

    // Ensure the splash screen is hidden
    SplashScreen.hide();
    // Navigate to the appropriate screen
    this.props.navigation.navigate(hasServer ? 'Main' : 'AddServer');
  }

  componentDidMount() {
    this.bootstrapAsync();
  }

  render() {
    if (!this.state.areResourcesReady) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Image
          style={{ flex: 1, resizeMode: 'contain', width: undefined, height: undefined }}
          source={require('../assets/images/splash.png')}
          onLoadEnd={() => {
            // wait for image's content to fully load [`Image#onLoadEnd`] (https://facebook.github.io/react-native/docs/image#onloadend)
            SplashScreen.hide();
          }}
          fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
        />
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  }
});
