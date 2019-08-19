import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';

import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';
import JellyfinValidator from '../utils/JellyfinValidator';

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

    if (hasServer) {
      const activeServer = servers[0];
      // Validate the server is online and is a Jellyfin server
      const isServerValid = await JellyfinValidator.validate(activeServer);
      console.log('active server', activeServer, isServerValid);
      // TODO: Handle invalid server here
    }

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