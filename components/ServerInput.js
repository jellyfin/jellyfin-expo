/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Input, colors } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { useStores } from '../hooks/useStores';
import Colors from '../constants/Colors';
import { getIconName } from '../utils/Icons';
import JellyfinValidator from '../utils/JellyfinValidator';

const sanitizeHost = (url = '') => url.trim();

const ServerInput = observer(class ServerInput extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    rootStore: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    successScreen: PropTypes.string
  }

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
      let url;
      try {
        url = JellyfinValidator.parseUrl(host);
        console.log('parsed url', url);
      } catch (err) {
        console.info(err);
        this.setState({
          isValidating: false,
          isValid: false,
          validationMessage: this.props.t('addServer.validation.invalid')
        });
        return;
      }

      // Validate the server is available
      const validation = await JellyfinValidator.validate({ url });
      console.log(`Server is ${validation.isValid ? '' : 'not '}valid`);
      if (!validation.isValid) {
        const message = validation.message || 'invalid';
        this.setState({
          isValidating: false,
          isValid: validation.isValid,
          validationMessage: this.props.t([`addServer.validation.${message}`, 'addServer.validation.invalid'])
        });
        return;
      }

      // Save the server details
      this.props.rootStore.serverStore.addServer({ url });
      this.props.rootStore.settingStore.activeServer = this.props.rootStore.serverStore.servers.length - 1;
      // Call the success callback if present
      if (this.props.onSuccess) {
        this.props.onSuccess();
      }
      // Navigate to the main screen
      this.props.navigation.replace(
        'Main',
        {
          screen: this.props.successScreen || 'Home',
          params: { activeServer: this.props.rootStore.settingStore.activeServer }
        }
      );
    } else {
      this.setState({
        isValid: false,
        validationMessage: this.props.t('addServer.validation.empty')
      });
    }
  }

  render() {
    return (
      <Input
        inputContainerStyle={styles.inputContainerStyle}
        leftIcon={{
          name: getIconName('globe'),
          type: 'ionicon'
        }}
        labelStyle={{
          color: colors.grey4
        }}
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
        {...this.props}
      />
    );
  }
});

const styles = StyleSheet.create({
  inputContainerStyle: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#292929',
    borderBottomWidth: 0
  }
});

// Inject the Navigation Hook as a prop to mimic the legacy behavior
const ServerInputWithNavigation = observer((props) => {
  const stores = useStores();
  return <ServerInput {...props} navigation={useNavigation()} {...stores} />;
});

export default ServerInputWithNavigation;
