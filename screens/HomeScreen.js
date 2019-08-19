import React from 'react';
import { StyleSheet, View, WebView } from 'react-native';

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
    server: null
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

  componentDidMount() {
    this.bootstrapAsync();
  }

  render() {
    if (!this.state.server || !this.state.server.url) {
      return loading();
    }

    return (
      <WebView
        source={{ uri: JellyfinValidator.getServerUrl(this.state.server) }}
        style={styles.container}
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
