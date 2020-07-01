/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Platform, RefreshControl, StatusBar, StyleSheet, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react';
import Constants from 'expo-constants';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import PropTypes from 'prop-types';

import { useStores } from '../hooks/useStores';
import Colors from '../constants/Colors';
import { getAppName, getSafeDeviceName } from '../utils/Device';
import NativeShell from '../utils/NativeShell';
import { openBrowser } from '../utils/WebBrowser';

const injectedJavaScript = `
window.ExpoAppInfo = {
  appName: '${getAppName()}',
  appVersion: '${Constants.nativeAppVersion}',
  deviceId: '${Constants.deviceId}',
  deviceName: '${getSafeDeviceName().replace(/'/g, '\\\'')}'
};

${NativeShell}

true;
`;

@observer
class HomeScreen extends React.Component {
  state = {
    isError: false,
    isFullscreen: false,
    isLoading: true,
    isRefreshing: false
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    rootStore: PropTypes.object.isRequired
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

  onGoHome() {
    this.webview.injectJavaScript('window.Emby && window.Emby.Page && typeof window.Emby.Page.goHome === "function" && window.Emby.Page.goHome();');
  }

  async onMessage({ nativeEvent: state }) {
    try {
      const { event, data } = JSON.parse(state.data);
      switch (event) {
        case 'enableFullscreen':
          this.setState({ isFullscreen: true });
          break;
        case 'disableFullscreen':
          this.setState({ isFullscreen: false });
          break;
        case 'openUrl':
          console.log('Opening browser for external url', data.url);
          openBrowser(data.url);
          break;
        case 'updateMediaSession':
          // Keep the screen awake when music is playing
          // TODO: Add a setting to disable this
          activateKeepAwake();
          break;
        case 'hideMediaSession':
          // When music session stops disable keep awake
          // TODO: Add a setting to disable this
          deactivateKeepAwake();
          break;
        case 'console.debug':
          console.debug('[Browser Console]', data);
          break;
        case 'console.error':
          console.error('[Browser Console]', data);
          break;
        case 'console.info':
          console.info('[Browser Console]', data);
          break;
        case 'console.log':
          console.log('[Browser Console]', data);
          break;
        case 'console.warn':
          console.warn('[Browser Console]', data);
          break;
        default:
          console.debug('[HomeScreen.onMessage]', event, data);
      }
    } catch (ex) {
      console.warn('Exception handling message', state.data);
    }
  }

  onRefresh() {
    // Disable pull to refresh when in fullscreen
    if (this.state.isFullscreen) return;

    this.setState({
      isLoading: true,
      isRefreshing: true
    });
    this.webview.reload();
    this.setState({ isRefreshing: false });
  }

  async updateScreenOrientation() {
    if (Platform.OS === 'ios' && !Platform.isPad) {
      if (this.state.isFullscreen) {
        // Lock to landscape orientation
        // For some reason video apps on iPhone use LANDSCAPE_RIGHT ¯\_(ツ)_/¯
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        // Allow either landscape orientation after forcing initial rotation
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        // Restore portrait orientation lock
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    }
  }

  componentDidMount() {
    // Override the default tab press behavior so a second press sends the webview home
    this.props.navigation.addListener('tabPress', e => {
      if (this.props.navigation.isFocused()) {
        // Prevent default behavior
        e.preventDefault();

        this.onGoHome();
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isFullscreen !== this.state.isFullscreen) {
      // Update the screen orientation
      this.updateScreenOrientation();
      // Show/hide the bottom tab bar
      this.props.navigation.setOptions({
        tabBarVisible: !this.state.isFullscreen
      });
      // Show/hide the status bar
      StatusBar.setHidden(this.state.isFullscreen);
    }
  }

  render() {
    // When not in fullscreen, the top adjustment is handled by the spacer View
    const safeAreaStyle = this.state.isFullscreen ? styles.container : { ...styles.container, paddingTop: 0 };
    // Hide webview until loaded
    const webviewStyle = (this.state.isError || this.state.isLoading) ? styles.loading : styles.container;

    if (!this.props.rootStore.serverStore.servers || this.props.rootStore.serverStore.servers.length === 0) {
      return null;
    }
    const server = this.props.rootStore.serverStore.servers[this.props.rootStore.settingStore.activeServer];

    return (
      <SafeAreaView style={safeAreaStyle} >
        {!this.state.isFullscreen && (
          <View style={styles.statusBarSpacer} />
        )}
        <ScrollView
          style={styles.container}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            Platform.OS === 'ios' ? (
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.onRefresh()}
                tintColor={Colors.tabText}
              />
            ) : null
          }
        >
          {server && server.urlString && (
            <WebView
              ref={ref => (this.webview = ref)}
              source={{ uri: server.urlString }}
              style={webviewStyle}
              // Inject javascript for NativeShell
              injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
              // Handle messages from NativeShell
              onMessage={this.onMessage.bind(this)}
              // Make scrolling feel faster
              decelerationRate='normal'
              // Error screen is displayed if loading fails
              renderError={() => this.getErrorView()}
              // Loading screen is displayed when refreshing
              renderLoading={() => <View style={styles.container} />}
              // Update state on loading error
              onError={({ nativeEvent: state }) => {
                console.warn('Error', state);
                this.setState({ isError: true });
              }}
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
      </SafeAreaView>
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
    backgroundColor: Colors.headerBackgroundColor,
    height: Constants.statusBarHeight
  },
  error: {
    fontSize: 17,
    paddingBottom: 17,
    textAlign: 'center'
  }
});

// Inject the Navigation Hook as a prop to mimic the legacy behavior
const HomeScreenWithNavigation = observer((props) => {
  const stores = useStores();
  return <HomeScreen {...props} navigation={useNavigation()} route={useRoute()} {...stores} />;
});

export default HomeScreenWithNavigation;
