import React from 'react';
import { AsyncStorage, Button, StyleSheet, View } from 'react-native';

import Colors from '../constants/Colors';
import StorageKeys from '../constants/Storage';
import CachingStorage from '../utils/CachingStorage';

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

  render() {
    return (
      <View style={styles.container}>
        <Button
          title='Clear Storage'
          onPress={() => this.clearStorage()}
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
