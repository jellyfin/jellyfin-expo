import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ScreenOrientation } from 'expo';
import Url from 'url-parse';

import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';
import JellyfinValidator from '../utils/JellyfinValidator';

// Loading component rendered in webview to avoid flash of white
const loading = () => (
  <View style={styles.container} />
);

export default class HomeScreen extends React.Component {
  state = {
    server: null,
    isVideoPlaying: false
  };

  static navigationOptions = {
    header: null
  };

  async bootstrapAsync() {
    let server = await CachingStorage.getInstance().getItem(StorageKeys.Servers);
    if (server.length > 0) {
      server = server[0];
    }
    this.setState({ server });
  }

  onNavigationChange(navigation) {
    const url = new Url(navigation.url);
    this.setState({
      url,
      isVideoPlaying: url.hash && url.hash === '#!/videoosd.html'
    });
  }

  async updateScreenOrientation() {
    let lock;
    if (this.state.isVideoPlaying) {
      // Lock to landscape orientation
      lock = ScreenOrientation.OrientationLock.LANDSCAPE;
    } else if (Platform.OS === 'ios' && Platform.isPad) {
      // Allow screen rotation on iPad
      lock = ScreenOrientation.OrientationLock.ALL;
    } else {
      // Lock phone devices to Portrait
      if (Platform.OS === 'ios') {
        // Workaround a bug where PORTRAIT orientation lock does not rotate iOS device
        // https://github.com/expo/expo/issues/4646
        lock = ScreenOrientation.OrientationLock.PORTRAIT_UP;
      } else {
        lock = ScreenOrientation.OrientationLock.PORTRAIT;
      }
    }
    console.log('updateScreenOrientation', lock);
    ScreenOrientation.lockAsync(lock);
  }

  componentDidMount() {
    this.bootstrapAsync();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isVideoPlaying !== this.state.isVideoPlaying) {
      // Update the screen orientation
      this.updateScreenOrientation();
      // Show/hide the bottom tab bar
      this.props.navigation.setParams({
        tabBarVisible: !this.state.isVideoPlaying
      });
      // Show/hide the status bar
      StatusBar.setHidden(this.state.isVideoPlaying);
    }
  }

  render() {
    if (!this.state.server || !this.state.server.url) {
      return loading();
    }

    return (
      <WebView
        source={{ uri: JellyfinValidator.getServerUrl(this.state.server) }}
        style={styles.container}

        // Inject javascript to watch URL hash changes
        injectedJavaScript={`
          (function() {
            function wrap(fn) {
              return function wrapper() {
                var res = fn.apply(this, arguments);
                window.ReactNativeWebView.postMessage('navigationStateChange');
                return res;
              }
            }

            history.pushState = wrap(history.pushState);
            history.replaceState = wrap(history.replaceState);
            window.addEventListener('popstate', function() {
              window.ReactNativeWebView.postMessage('navigationStateChange');
            });
          })();

          true;
        `}
        onMessage={({ nativeEvent: state }) => {
          // console.debug('message', state);
          if (state.data === 'navigationStateChange') {
            this.onNavigationChange(state);
          }
        }}

        // Make scrolling feel faster
        decelerationRate='normal'
        // Display loading indicator
        startInLoadingState={true}
        renderLoading={loading}
        // Media playback options to fix video player
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Use WKWebView on iOS
        useWebKit={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  }
});
