/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// polyfill whatwg URL globals
import 'react-native-url-polyfill/auto';

import { Ionicons } from '@expo/vector-icons';
import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api/playstate-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { AsyncTrunk } from 'mobx-sync-lite';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, useColorScheme } from 'react-native';
import { ThemeContext, ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ThemeSwitcher from './components/ThemeSwitcher';
import { useStores } from './hooks/useStores';
import RootNavigator from './navigation/RootNavigator';
import { ensurePathExists } from './utils/File';
import StaticScriptLoader from './utils/StaticScriptLoader';

// Import i18n configuration
import './i18n';

const App = observer(({ skipLoadingScreen }) => {
	const [ isSplashReady, setIsSplashReady ] = useState(false);
	const { rootStore } = useStores();
	const { theme } = useContext(ThemeContext);

	rootStore.settingStore.systemThemeId = useColorScheme();

	SplashScreen.preventAutoHideAsync();

	const trunk = new AsyncTrunk(rootStore, {
		storage: AsyncStorage
	});

	const hydrateStores = async () => {
		await trunk.init();

		rootStore.storeLoaded = true;
	};

	const loadImages = () => {
		const images = [
			require('./assets/images/splash.png'),
			require('./assets/images/logo-dark.png')
		];
		return images.map(image => Asset.fromModule(image).downloadAsync());
	};

	const loadResources = async () => {
		try {
			await Promise.all([
				Font.loadAsync({
					// This is the font that we are using for our tab bar
					...Ionicons.font
				}),
				...loadImages(),
				StaticScriptLoader.load()
			]);
		} catch (err) {
			console.warn('[App] Failed loading resources', err);
		}

		setIsSplashReady(true);
	};

	useEffect(() => {
		// Hydrate mobx data stores
		hydrateStores();

		// Load app resources
		loadResources();
	}, []);

	useEffect(() => {
		console.info('rotation lock setting changed!', rootStore.settingStore.isRotationLockEnabled);
		if (rootStore.settingStore.isRotationLockEnabled) {
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		} else {
			ScreenOrientation.unlockAsync();
		}
	}, [ rootStore.settingStore.isRotationLockEnabled ]);

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
	}, [ rootStore.isFullscreen ]);

	useEffect(() => {
		const downloadFile = async (download) => {
			console.debug('[App] downloading "%s"', download.filename);
			await ensurePathExists(download.localPath);

			const url = download.getStreamUrl(rootStore.deviceId);

			const resumable = FileSystem.createDownloadResumable(
				url.toString(),
				download.uri,
				{},
				(/*{ totalBytesWritten }*/) => {
					// FIXME: We should save the download progress in the model for display
					// but this needs throttling
				}
			);

			// TODO: The resumable should be saved to allow pausing/resuming downloads

			// Download the file
			try {
				download.isDownloading = true;
				await resumable.downloadAsync();
				download.isComplete = true;
				download.isDownloading = false;
			} catch (e) {
				console.error('[App] Download failed', e);
				Alert.alert('Download Failed', `"${download.title}" failed to download.`);

				// TODO: If a download fails, we should probably remove it from the queue
				download.isDownloading = false;
			}

			// Report download has stopped
			const serverUrl = download.serverUrl.endsWith('/') ? download.serverUrl.slice(0, -1) : download.serverUrl;
			const api = rootStore.sdk.createApi(serverUrl, download.apiKey);
			console.log('[App] Reporting download stopped', download.sessionId);
			getPlaystateApi(api)
				.reportPlaybackStopped({
					playbackStopInfo: {
						PlaySessionId: download.sessionId
					}
				})
				.catch(err => {
					console.error('[App] Failed reporting download stopped', err.response || err.request || err.message);
				});
		};

		rootStore.downloadStore.downloads
			.forEach(download => {
				if (!download.isComplete && !download.isDownloading) {
					downloadFile(download);
				}
			});
	}, [ rootStore.deviceId, rootStore.downloadStore.downloads.size ]);

	if (!(isSplashReady && rootStore.storeLoaded) && !skipLoadingScreen) {
		return null;
	}

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={rootStore.settingStore.theme.Elements}>
				<ThemeSwitcher />
				<StatusBar
					style='light'
					backgroundColor={theme.colors.grey0}
					hidden={rootStore.isFullscreen}
				/>
				<NavigationContainer theme={rootStore.settingStore.theme.Navigation}>
					<RootNavigator />
				</NavigationContainer>
			</ThemeProvider>
		</SafeAreaProvider>
	);
});

App.propTypes = {
	skipLoadingScreen: PropTypes.bool
};

export default App;
