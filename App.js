import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, ScreenOrientation } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/Colors';

export default class App extends React.Component {
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
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <AppNavigator />
        </View>
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
