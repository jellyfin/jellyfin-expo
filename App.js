/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
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
    isLoadingComplete: false
  };

  componentDidMount() {
    // Allow screen rotation on iPad
    if (Platform.OS === 'ios' && Platform.isPad) {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.ALL
      );
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
          autoHideSplash={false}
        />
      );
    } else {
      return (
        <ThemeProvider theme={Theme}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <AppNavigator />
        </View>
        </ThemeProvider>
      );
    }
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

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  }
});
