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
import { create } from 'mobx-persist';
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

const hydrate = create({
  storage: AsyncStorage
});

const App = observer(({ skipLoadingScreen }) => {
  const [isSplashReady, setIsSplashReady] = useState(false);
  const { serverStore, settingStore } = useStores();

  const hydrateStores = async () => {
    // Use data from old location as the initial values
    // TODO: Remove this for next release
    const servers = await CachingStorage.getInstance().getItem(StorageKeys.Servers);
    const activeServer = await CachingStorage.getInstance().getItem(StorageKeys.ActiveServer);
    hydrate('servers', serverStore, servers || []);
    hydrate('settings', settingStore, { activeServer: activeServer || 0 });

    // Remove old data values
    await AsyncStorage.multiRemove(Object.values(StorageKeys));
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
