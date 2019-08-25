import React from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, View } from 'react-native';
import { Input, colors } from 'react-native-elements';

import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';
import JellyfinValidator from '../utils/JellyfinValidator';

const sanitizeHost = (url = '') => url.trim();

export default class AddServerScreen extends React.Component {
  state = {
    host: '',
    isValidating: false,
    isValid: true,
    validationMessage: ''
  }

  async onAddServer() {
    const { host } = this.state;
    console.log('add server', host);
    if (host) {
      this.setState({
        isValidating: true,
        isValid: true,
        validationMessage: ''
      });

      // Parse the entered url
      const url = JellyfinValidator.parseUrl(host);
      console.log('parsed url', url);

      // Validate the server is available
      const validation = await JellyfinValidator.validate({ url });
      console.log(`Server is ${validation.isValid ? '' : 'not '}valid`);
      if (!validation.isValid) {
        this.setState({
          isValidating: false,
          isValid: validation.isValid,
          validationMessage: validation.message || ''
        });
        return;
      }

      // Save the server details to app storage
      await CachingStorage.getInstance().setItem(StorageKeys.Servers, [{
        url
      }]);
      // Navigate to the main screen
      this.props.navigation.navigate('Main');
    } else {
      this.setState({
        isValid: false,
        validationMessage: 'Server Address cannot be empty'
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            style={styles.logoImage}
            source={require('../assets/images/logowhite.png')}
            fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300` 
          />
        </View>
        <Input
          containerStyle={styles.serverTextContainer}
          inputContainerStyle={styles.serverTextInput}
          leftIcon={{
            name: Platform.OS === 'ios' ? 'ios-globe' : 'md-globe',
            type: 'ionicon'
          }}
          label='Server Address'
          placeholder='https://jellyfin.media'
          placeholderTextColor={colors.grey3}
          rightIcon={this.state.isValidating ? <ActivityIndicator /> : null}
          selectionColor={Colors.tintColor}
          autoCapitalize='none'
          autoCorrect={false}
          autoCompleteType='off'
          autoFocus={true}
          keyboardType={Platform.OS === 'ios' ? 'url' : 'default'}
          returnKeyType='go'
          textContentType='URL'
          editable={!this.state.isValidating}
          value={this.state.host}
          errorMessage={this.state.isValid ? null : this.state.validationMessage}
          onChangeText={text => this.setState({ host: sanitizeHost(text) })}
          onSubmitEditing={() => this.onAddServer()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor
  },
  logoImage: {
    marginBottom: 12,
    width: '90%',
    height: undefined,
    // Aspect ration of the logo
    aspectRatio: 3.18253
  },
  serverTextContainer: {
    flex: 1.5,
    alignContent: 'flex-start'
  },
  serverTextInput: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#292929',
    borderBottomWidth: 0
  }
});