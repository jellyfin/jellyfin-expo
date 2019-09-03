/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Badge, Button, colors, ListItem, Text } from 'react-native-elements';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

import SettingSection from '../components/SettingSection';
import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';
import JellyfinValidator from '../utils/JellyfinValidator';

const links = [
  {
    name: 'Jellyfin Website',
    url: 'https://jellyfin.media/',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-globe' : 'md-globe',
      type: 'ionicon'
    }
  },
  {
    name: 'Documentation',
    url: 'https://jellyfin.readthedocs.io/',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-book' : 'md-book',
      type: 'ionicon'
    }
  },
  {
    name: 'Source Code',
    url: 'https://github.com/jellyfin/jellyfin-expo',
    icon: {
      name: 'logo-github',
      type: 'ionicon'
    }
  },
  {
    name: 'Request a Feature',
    url: 'https://features.jellyfin.org/',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-create' : 'md-create',
      type: 'ionicon'
    }
  },
  {
    name: 'Report an Issue',
    url: 'https://github.com/jellyfin/jellyfin-expo/issues',
    icon: {
      name: Platform.OS === 'ios' ? 'ios-bug' : 'md-bug',
      type: 'ionicon'
    }
  }
];

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  state = {
    servers: null
  };

  _keyExtractor = (item, index) => `${item.name}-${index}`;

  _renderLink = ({ item, index }) => {console.log('renderLink', item); return (
    <ListItem
      title={item.name}
      leftIcon={item.icon}
      topDivider={index === 0}
      bottomDivider
      chevron
      onPress={() => {
        WebBrowser.openBrowserAsync(item.url, {
          toolbarColor: Colors.backgroundColor
        })
      }}
    />
  )};

  _renderServer = ({ item, index }) => {
    const { info, serverUrl, online = false } = item;
    console.log('renderServer', info, serverUrl, online);
    return (<ListItem
      title={info.ServerName}
      titleStyle={{
        marginBottom: 2
      }}
      subtitle={`Version: ${info.Version}\n${serverUrl}`}
      leftElement={(
        <Badge status={(online ? 'success' : 'error')} />
      )}
      rightElement={(
        <Button
          type='clear'
          icon={{
            name: Platform.OS === 'ios' ? 'ios-trash' : 'md-trash',
            type: 'ionicon',
            iconStyle: {
              color: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error
            }
          }}
          onPress={() => this.onDeleteServer(index)}
        />
      )}
      topDivider={index === 0}
      bottomDivider
    />);
  };

  async bootstrapAsync() {
    let servers = await CachingStorage.getInstance().getItem(StorageKeys.Servers);

    servers = servers.map(async (server) => {
      let serverUrl;
      try {
        serverUrl = JellyfinValidator.getServerUrl(server);
      } catch(err) {
        serverUrl = '';
      }
      // Try to fetch the server's public info
      try {
        const serverInfo = await JellyfinValidator.fetchServerInfo(server);
        return Object.assign(
          {},
          server,
          {
            info: serverInfo,
            serverUrl,
            online: true
          }
        );
      } catch(err) {
        return Object.assign(
          {},
          server,
          {
            serverUrl,
            online: false
          }
        );
      }
    });

    servers = await Promise.all(servers);

    console.log('bootstrapAsync', servers);

    this.setState({ servers });
  }

  async deleteServer(index) {
    // Get the current list of servers
    const servers = this.state.servers;
    // Remove one server at index
    servers.splice(index, 1);
    // Save to storage cache
    await CachingStorage.getInstance().setItem(StorageKeys.Servers, servers);
    // Navigate to the loading screen
    this.props.navigation.navigate('ServerLoading');
  }

  async resetApplication() {
    // Remove all storage items used in the app
    await AsyncStorage.multiRemove(Object.values(StorageKeys));
    // Reset the storage cache
    CachingStorage.instance = null;
    // Navigate to the loading screen
    this.props.navigation.navigate('ServerLoading');
  }

  onDeleteServer(index) {
    Alert.alert(
      'Delete Server',
      'Are you sure you want to delete this server?',
      [
        { text: 'Cancel' },
        { text: 'Delete', onPress: () => this.deleteServer(index), style: 'destructive' }
      ]
    );
  }

  onResetApplication() {
    Alert.alert(
      'Reset Application',
      'Are you sure you want to reset all settings?',
      [
        { text: 'Cancel' },
        { text: 'Reset', onPress: () => this.resetApplication(), style: 'destructive' }
      ]
    );
  }

  componentDidMount() {
    this.bootstrapAsync();
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <SettingSection heading='Servers'>
          {
            this.state.servers ? (
              <FlatList
                keyExtractor={this._keyExtractor}
                data={this.state.servers}
                renderItem={this._renderServer}
                scrollEnabled={false}
              />
            ) : (
              <ActivityIndicator />
            )
          }
        </SettingSection>

        <SettingSection heading='Links'>
          <FlatList
            keyExtractor={this._keyExtractor}
            data={links}
            renderItem={this._renderLink}
            scrollEnabled={false}
          />
        </SettingSection>

        <Button
          buttonStyle={{
            backgroundColor: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error,
            margin: 15
          }}
          title='Reset Application'
          onPress={() => this.onResetApplication()}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Jellyfin Expo</Text>
          <Text style={styles.infoText}>{`${Constants.nativeAppVersion} (${Constants.nativeBuildVersion})`}</Text>
          <Text style={styles.infoText}>{`Expo Version: ${Constants.expoVersion}`}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  infoContainer: {
    margin: 15
  },
  infoText: {
    color: colors.grey4,
    fontSize: 15
  }
});
