import React from 'react';
import { ActivityIndicator, Button, Image, Platform, StyleSheet, TextInput, View } from 'react-native';

import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';
import JellyfinValidator from '../utils/JellyfinValidator';

const sanitizeHost = (url = '') => url.trim();

export default class AddServerScreen extends React.Component {
  state = {
    host: '',
    isValidating: false
  }

  async onAddServer() {
    const { host } = this.state;
    console.log('add server', host);
    if (host) {
      this.setState({ isValidating: true });

      // Parse the entered url
      const url = JellyfinValidator.parseUrl(host);
      console.log('parsed url', url);

      // Validate the server is available
      const isServerValid = await JellyfinValidator.validate({ url });
      console.log(`Server is ${isServerValid ? '' : 'not '}valid`);
      if (!isServerValid) {
        this.setState({ isValidating: false });
        return;
      }

      // Save the server details to app storage
      await CachingStorage.getInstance().setItem(StorageKeys.Servers, [{
        url
      }]);
      // Navigate to the main screen
      this.props.navigation.navigate('Main');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/logowhite.png')}
          fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300` 
        />
        <TextInput
          style={styles.serverTextInput}
          autoCapitalize='none'
          autoCorrect={false}
          autoCompleteType='off'
          autoFocus={true}
          keyboardType={Platform.OS === 'ios' ? 'url' : 'default'}
          textContentType='URL'
          value={this.state.host}
          onChangeText={text => this.setState({ host: sanitizeHost(text) })}
        />
        <Button
          title='Add Server'
          color={Colors.tintColor}
          onPress={() => this.onAddServer()}
        />
        {this.state.isValidating ? (<ActivityIndicator />) : null}
        <View style={styles.spacer} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor
  },
  logoImage: {
    flex: 1,
    width: '80%',
    height: null,
    resizeMode: 'contain'
  },
  serverTextInput: {
    fontSize: 20,
    margin: 4,
    width: '100%',
    borderRadius: 2,
    padding: 2,
    backgroundColor: '#292929',
    color: '#fff'
  },
  spacer: {
    flex: 1
  }
});