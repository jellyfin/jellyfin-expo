/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Platform, RefreshControl, StatusBar, StyleSheet, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { ScreenOrientation } from 'expo';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import Url from 'url';

import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';
import JellyfinValidator from '../utils/JellyfinValidator';

export default class HomeScreen extends React.Component {
  state = {
    server: null,
    serverUrl: null,
    isError: false,
    isLoading: true,
    isRefreshing: false,
    isVideoPlaying: false
  };

  static navigationOptions = {
    header: null
  };

  async bootstrapAsync() {
    let server = await CachingStorage.getInstance().getItem(StorageKeys.Servers);
    let activeServer = await CachingStorage.getInstance().getItem(StorageKeys.ActiveServer) || 0;

    // If the activeServer is greater than the length of the server array, reset it to 0
    if (activeServer && server.length && activeServer > server.length - 1) {
      await CachingStorage.getInstance().setItem(StorageKeys.ActiveServer, 0);
      activeServer = 0;
    }

    if (server.length > 0) {
      server = server[activeServer];
    }

    const serverUrl = JellyfinValidator.getServerUrl(server);

    this.setState({
      server,
      serverUrl
    });
  }

  getErrorView() {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error contacting Jellyfin server.</Text>
        <Button
          buttonStyle={{
            marginLeft: 15,
            marginRight: 15
          }}
          icon={{
            name: Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh',
            type: 'ionicon'
          }}
          title='Try again?'
          onPress={() => this.onRefresh()}
        />
      </View>
    );
  }

  onNavigationChange(navigation) {
    if (!navigation.url) {
      console.warn('No url provided to onNavigationChange', navigation);
      return;
    }
    const url = Url.parse(navigation.url);
    console.debug('navigationChange', navigation, url);

    let { isVideoPlaying } = this.state;
    // Modal windows in the player also trigger hash changes
    // Ignore any hashes that do not look start with '#!/'
    if (url.hash && url.hash.startsWith('#!/')) {
      isVideoPlaying = url.hash === '#!/videoosd.html';
    }

    this.setState({
      url,
      isVideoPlaying
    });
  }

  onGoHome() {
    this.webview.injectJavaScript('window.Emby && window.Emby.Page && typeof window.Emby.Page.goHome === "function" && window.Emby.Page.goHome();');
  }

  onRefresh() {
    this.setState({
      isLoading: true,
      isRefreshing: true
    });
    this.webview.reload();
    this.setState({ isRefreshing: false });
  }

  updateScreenOrientation() {
    if (this.state.isVideoPlaying) {
      // Lock to landscape orientation
      console.debug('locking orientation to landscape');
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      console.debug('removing orientation lock')
      // Remove the orientation lock
      ScreenOrientation.unlockAsync();
    }
  }

  componentDidMount() {
    // Expose the goHome method to navigation props
    this.props.navigation.setParams({ goHome: () => this.onGoHome() });
    // Bootstrap component state
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

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.navigation.state.params.activeServer != 'undefined') {
      this.bootstrapAsync();
    }
  }

  render() {
    // Hide webview until loaded
    const webviewStyle = (this.state.isError || this.state.isLoading) ?
      styles.loading : styles.container;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
        {!this.state.isVideoPlaying && (
          <View style={styles.statusBarSpacer} />
        )}
        {this.state.serverUrl && (
          <WebView
            ref={ref => (this.webview = ref)}
            source={{ uri: this.state.serverUrl }}
            style={webviewStyle}

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
            onNavigationStateChange={async ({ url }) => {
              if (!url) {
                return;
              }

                if ((this.state.serverUrl && 
                        !url.startsWith(this.state.serverUrl) && 
                        !url.startsWith(this.state.serverUrl.replace(/^http:\/\//i, "https://"))) 
                        || url.includes('/System/Logs/Log')) {
                console.log('Opening browser for external url', url);
                try {
                  await WebBrowser.openBrowserAsync(url, {
                    toolbarColor: Colors.backgroundColor
                  });
                } catch(err) {
                  console.warn('Error opening browser', err);
                }
                this.webview.stopLoading();
              }
            }}

            // Make scrolling feel faster
            decelerationRate='normal'
            // Error screen is displayed if loading fails
            renderError={() => this.getErrorView()}
            // Loading screen is displayed when refreshing
            renderLoading={() => <View style={styles.container} />}
            // Update state on loading error
            onError={() => { this.setState({ isError: true }) }}
            // Update state when loading is complete
            onLoad={() => {
              this.setState({
                isError: false,
                isLoading: false
              });
            }}
            // Media playback options to fix video player
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            // Use WKWebView on iOS
            useWebKit={true}
          />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    opacity: 0
  },
  statusBarSpacer: {
    backgroundColor: Colors.backgroundColor,
    height: Constants.statusBarHeight
  },
  error: {
    fontSize: 17,
    paddingBottom: 17,
    textAlign: 'center'
  }
});
