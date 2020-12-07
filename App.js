/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import 'mobx-react-lite/batchingForReactNative';

import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';
import { AsyncTrunk } from 'mobx-sync';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import { useStores } from './hooks/useStores';
import Colors from './constants/Colors';
import AppNavigator from './navigation/AppNavigator';
import Theme from './utils/Theme';

// Import i18n configuration
import './i18n';

const App = observer(({ skipLoadingScreen }) => {
	const [isSplashReady, setIsSplashReady] = useState(false);
	const { rootStore } = useStores();

	const trunk = new AsyncTrunk(rootStore, {
		storage: AsyncStorage
	});

	const hydrateStores = async () => {
		await trunk.init();

		rootStore.storeLoaded = true;
	};

	useEffect(() => {
		// Hydrate mobx data stores
		hydrateStores();
	}, []);

	useEffect(() => {
		console.info('rotation lock setting changed!', rootStore.settingStore.isRotationLockEnabled);
		if (rootStore.settingStore.isRotationLockEnabled) {
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		} else {
			ScreenOrientation.unlockAsync();
		}
	}, [rootStore.settingStore.isRotationLockEnabled]);

	const updateScreenOrientation = async () => {
		if (rootStore.settingStore.isRotationLockEnabled) {
			if (rootStore.isFullscreen) {
				// Lock to landscape orientation
				// For some reason video apps on iPhone use LANDSCAPE_RIGHT ¯\_(ツ)_/¯
				await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
				// Allow either landscape orientation after forcing initial rotation
				ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
			} else {
				// Restore portrait orientation lock
				ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
			}
		}
	};

	useEffect(() => {
		// Update the screen orientation
		updateScreenOrientation();
	}, [rootStore.isFullscreen]);

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

	if (!(isSplashReady && rootStore.storeLoaded) && !skipLoadingScreen) {
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
				<StatusBar
					style="light"
					backgroundColor={Colors.headerBackgroundColor}
					hidden={rootStore.isFullscreen}
				/>
				<AppNavigator />
			</ThemeProvider>
		</SafeAreaProvider>
	);
});

App.propTypes = {
	skipLoadingScreen: PropTypes.bool
};

export default App;
