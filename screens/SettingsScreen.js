/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useEffect } from 'react';
import { Alert, AsyncStorage, Platform, SectionList, StyleSheet } from 'react-native';
import { colors, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';

import AppInfoFooter from '../components/AppInfoFooter';
import BrowserListItem from '../components/BrowserListItem';
import ButtonListItem from '../components/ButtonListItem';
import ServerListItem from '../components/ServerListItem';
import Colors from '../constants/Colors';
import Links from '../constants/Links';
import { useStores } from '../hooks/useStores';

const SettingsScreen = observer(() => {
  const { rootStore } = useStores();
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch server info
    rootStore.serverStore.fetchInfo();
  }, []);

  const onAddServer = () => {
    navigation.navigate('AddServer');
  };

  const onDeleteServer = index => {
    Alert.alert(
      'Delete Server',
      'Are you sure you want to delete this server?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            // Remove server and update active server
            rootStore.serverStore.removeServer(index);
            rootStore.settingStore.activeServer = 0;

            if (rootStore.serverStore.servers.length > 0) {
              // More servers exist, navigate home
              navigation.navigate('Home');
            } else {
              // No servers are present, navigate to add server screen
              navigation.replace('AddServer');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const onSelectServer = index => {
    rootStore.settingStore.activeServer = index;
    navigation.navigate('Home');
  };

  const onResetApplication = () => {
    Alert.alert(
      'Reset Application',
      'Are you sure you want to reset all settings?',
      [
        { text: 'Cancel' },
        {
          text: 'Reset',
          onPress: () => {
            // Reset data in stores
            rootStore.reset();
            AsyncStorage.clear();
            // Navigate to the loading screen
            navigation.replace('AddServer');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const AugmentedServerListItem = (props) => (
    <ServerListItem
      {...props}
      activeServer={rootStore.settingStore.activeServer}
      onDelete={onDeleteServer}
      onPress={onSelectServer}
    />
  );

  const getSections = () => {
    return [
      {
        title: 'Servers',
        data: rootStore.serverStore.servers.slice(),
        keyExtractor: (item, index) => `server-${index}`,
        renderItem: AugmentedServerListItem
      },
      {
        title: 'Add Server',
        hideHeader: true,
        data: [{
          key: 'add-server-button',
          title: 'Add Server',
          onPress: onAddServer
        }],
        renderItem: ButtonListItem
      },
      {
        title: 'Links',
        data: Links,
        renderItem: BrowserListItem
      },
      {
        title: 'Reset Application',
        hideHeader: true,
        data: [{
          key: 'reset-app-button',
          title: 'Reset Application',
          buttonStyle: {
            backgroundColor: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error
          },
          onPress: onResetApplication
        }],
        renderItem: ButtonListItem
      }
    ];
  };

  return (
    <SafeAreaView style={{...styles.container, paddingTop: 0}} >
      <SectionList
        sections={getSections()}
        extraData={{
          activeServer: rootStore.settingStore.activeServer,
          isFetching: rootStore.serverStore.fetchInfo.pending
        }}
        renderItem={({ item }) => <Text>{JSON.stringify(item)}</Text>}
        renderSectionHeader={({ section: { title, hideHeader } }) => hideHeader ? null : <Text style={styles.header}>{title}</Text>}
        ListFooterComponent={AppInfoFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  header: {
    backgroundColor: Colors.backgroundColor,
    color: colors.grey4,
    fontSize: 17,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 1
  }
});

export default SettingsScreen;
