/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import 'mobx-react-lite/batchingForReactNative';

import React, { useEffect, useState } from 'react';
import { AsyncStorage, Platform, StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';
import { AsyncTrunk } from 'mobx-sync';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import { useStores } from './hooks/useStores';
import StorageKeys from './constants/Storage';
import AppNavigator from './navigation/AppNavigator';
import CachingStorage from './utils/CachingStorage';
import Theme from './utils/Theme';

const App = observer(({ skipLoadingScreen }) => {
  const [isSplashReady, setIsSplashReady] = useState(false);
  const { rootStore } = useStores();

  const trunk = new AsyncTrunk(rootStore, {
    storage: AsyncStorage
  });

  const hydrateStores = async () => {
    // Migrate servers and settings
    // TODO: Remove this for next release
    const servers = await CachingStorage.getInstance().getItem(StorageKeys.Servers);
    if (servers) {
      const activeServer = await CachingStorage.getInstance().getItem(StorageKeys.ActiveServer) || 0;

      // Initialize the store with the existing servers and settings
      await trunk.init({
        serverStore: { servers },
        settingStore: { activeServer }
      });

      // Remove old data values
      AsyncStorage.multiRemove(Object.values(StorageKeys));
    } else {
      // No servers saved in the old method, initialize normally
      await trunk.init();
    }

    rootStore.storeLoaded = true;
  };

  useEffect(() => {
    // Lock portrait orientation on iPhone
    if (Platform.OS === 'ios' && !Platform.isPad) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }

    // Hydrate mobx data stores
    hydrateStores();
  }, []);

  const loadImagesAsync = () => {
    const images = [
      require('./assets/images/splash.png'),
      require('./assets/images/logowhite.png')
    ];
    return images.map(image => Asset.fromModule(image).downloadAsync());
  };

  const loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font
      }),
      ...loadImagesAsync()
    ]);
  };

  if (!isSplashReady && !skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={console.warn}
        onFinish={() => setIsSplashReady(true)}
        autoHideSplash={false}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={Theme}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
});

App.propTypes = {
  skipLoadingScreen: PropTypes.bool
};

export default App;
