/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { activateKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/Colors';
import Theme from './utils/Theme';

export default class App extends React.Component {
  static propTypes = {
    skipLoadingScreen: PropTypes.bool
  };

  state = {
    isSplashReady: false
  };

  componentDidMount() {
    // Lock portrait orientation on iPhone
    if (Platform.OS === 'ios' && !Platform.isPad) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  }

  render() {
    if (!this.state.isSplashReady && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={console.warn}
          onFinish={() => this.setState({ isSplashReady: true })}
          autoHideSplash={false}
        />
      );
    }
    activateKeepAwake();
    return (
      <ThemeProvider theme={Theme}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <AppNavigator />
        </View>
      </ThemeProvider>
    );
  }

  _loadImagesAsync = () => {
    const images = [
      require('./assets/images/splash.png'),
      require('./assets/images/logowhite.png')
    ];
    return images.map(image => Asset.fromModule(image).downloadAsync());
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font
      }),
      ...this._loadImagesAsync()
    ]);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  }
});
