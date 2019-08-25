import React from 'react';
import { Alert, AsyncStorage, FlatList, Platform, StyleSheet, View } from 'react-native';
import { Button, colors, ListItem } from 'react-native-elements';
import * as WebBrowser from 'expo-web-browser';
import PropTypes from 'prop-types';

import SettingSection from '../components/SettingSection';
import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';

const keyExtractor = (item, index) => index.toString();

const links = [
  {
    name: 'Jellyfin Website',
    url: 'https://jellyfin.media/'
  },
  {
    name: 'Documentation',
    url: 'https://jellyfin.readthedocs.io/'
  },
  {
    name: 'Request a Feature',
    url: 'https://features.jellyfin.org/'
  }
];

const renderLink = ({ item }) => (
  <ListItem
    title={item.name}
    topDivider
    bottomDivider
    chevron
    onPress={() => {
      WebBrowser.openBrowserAsync(item.url, {
        toolbarColor: Colors.backgroundColor
      })
    }}
  />
);

renderLink.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  })
};

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  async clearStorage() {
    // Remove all storage items used in the app
    await AsyncStorage.multiRemove(Object.values(StorageKeys));
    // Reset the storage cache
    CachingStorage.instance = null;
    // Navigate to the loading screen
    this.props.navigation.navigate('ServerLoading');
  }

  confirmClearStorage() {
    Alert.alert(
      'Clear Storage',
      'Are you sure you want to reset all settings?',
      [
        { text: 'Cancel' },
        { text: 'Clear', onPress: () => this.clearStorage(), style: 'destructive' }
      ]
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SettingSection heading='Servers' />

        <SettingSection heading='Links'>
          <FlatList
            keyExtractor={keyExtractor}
            data={links}
            renderItem={renderLink}
            scrollEnabled={false}
          />
        </SettingSection>

        <Button
          buttonStyle={{ backgroundColor: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error }}
          title='Clear Storage'
          onPress={() => this.confirmClearStorage()}
        />
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
