/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
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
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, useColorScheme } from 'react-native';
import { ThemeContext, ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ThemeSwitcher from './components/ThemeSwitcher';
import { useIsHydrated } from './hooks/useHydrated';
import { useStores } from './hooks/useStores';
import DownloadModel from './models/DownloadModel';
import ServerModel from './models/ServerModel';
import RootNavigator from './navigation/RootNavigator';
import { STORE_NAME as SERVER_STORE_NAME } from './stores/ServerStore';
import { ensurePathExists } from './utils/File';
import StaticScriptLoader from './utils/StaticScriptLoader';

// Import i18n configuration
import './i18n';

const App = ({ skipLoadingScreen }) => {
	const [ isSplashReady, setIsSplashReady ] = useState(false);
	const { rootStore, downloadStore, settingStore, serverStore } = useStores();
	const { theme } = useContext(ThemeContext);
	const isHydrated = useIsHydrated();
	const colorScheme = useColorScheme();

	// Store the system color scheme for automatic theme switching
	useEffect(() => {
		settingStore.set({
			systemThemeId: colorScheme
		});
	}, [ colorScheme ]);

	SplashScreen.preventAutoHideAsync();

	const migrateStores = async () => {
		// TODO: In release n+2 from this point, remove this conversion code.
		const zustandStoreValue = await AsyncStorage.getItem(SERVER_STORE_NAME);
		const mobxStoreValue = await AsyncStorage.getItem('__mobx_sync__'); // Store will be null if it's not set

		console.info('zustand RootStore', zustandStoreValue);

		if (zustandStoreValue === null && mobxStoreValue !== null) {
			console.info('Migrating mobx store to zustand');
			const mobx_store = JSON.parse(mobxStoreValue);

			// Root Store
			for (const key of Object.keys(mobx_store).filter(k => k.search('Store') === -1)) {
				rootStore.set({ [key]: mobx_store[key] });
			}

			/**
			 * Server store & download store need some special treatment because they
			 * are not simple key-value pair stores. Each contains one key which is a
			 * list of Model objects that represent the contents of their respective
			 * stores.
			 *
			 * zustand requires a custom storage engine for these for proper
			 * serialization and deserialization (written in each storage's module),
			 * but this code is needed to get them over the hump from mobx to zustand.
			 */
			// Download Store
			const mobxDownloads = mobx_store.downloadStore.downloads;
			const migratedDownloads = new Map();
			if (Object.keys(mobxDownloads).length > 0) {
				for (const [ key, value ] of Object.entries(mobxDownloads)) {
					migratedDownloads.set(key, new DownloadModel(
						value.itemId,
						value.serverId,
						value.serverUrl,
						value.apiKey,
						value.title,
						value.filename,
						value.downloadUrl
					));
				}
			}
			downloadStore.set({ downloads: migratedDownloads });

			// Server Store
			const mobxServers = mobx_store.serverStore.servers;
			const migratedServers = [];
			if (Object.keys(mobxServers).length > 0) {
				for (const item of mobxServers) {
					migratedServers.push(new ServerModel(item.id, new URL(item.url), item.info));
				}
			}
			serverStore.set({ servers: migratedServers });

			// Setting Store
			for (const key of Object.keys(mobx_store.settingStore)) {
				console.info('SettingStore', key);
				settingStore.set({ [key]: mobx_store.settingStore[key] });
			}

			// TODO: Remove mobx sync item from async storage in a future release
			// AsyncStorage.removeItem('__mobx_sync__')
		}

		rootStore.set({ storeLoaded: true });
	};

	const loadImages = () => {
		const images = [
			require('@jellyfin/ux-ios/splash.png'),
			require('@jellyfin/ux-ios/logo-dark.png')
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
		if (isHydrated) {
			// Migrate mobx data stores
			migrateStores();

			// Load app resources
			loadResources();
		}
	}, [ isHydrated ]);

	useEffect(() => {
		console.info('rotation lock setting changed!', settingStore.isRotationLockEnabled);
		if (settingStore.isRotationLockEnabled) {
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		} else {
			ScreenOrientation.unlockAsync();
		}
	}, [ settingStore.isRotationLockEnabled ]);

	const updateScreenOrientation = async () => {
		if (settingStore.isRotationLockEnabled) {
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
				downloadStore.update(download);
				await resumable.downloadAsync();
				download.isComplete = true;
				download.isDownloading = false;
			} catch (e) {
				console.error('[App] Download failed', e);
				Alert.alert('Download Failed', `"${download.title}" failed to download.`);

				// TODO: If a download fails, we should probably remove it from the queue
				download.isDownloading = false;
			}

			// Push the state update to the store
			downloadStore.update(download);

			// Report download has stopped
			const serverUrl = download.serverUrl.endsWith('/') ? download.serverUrl.slice(0, -1) : download.serverUrl;
			const api = rootStore.getSdk().createApi(serverUrl, download.apiKey);
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

		downloadStore.downloads
			.forEach(download => {
				if (!download.isComplete && !download.isDownloading) {
					downloadFile(download);
				}
			});
	}, [ rootStore.deviceId, downloadStore.downloads.size ]);

	if (!(isSplashReady && rootStore.storeLoaded) && !skipLoadingScreen) {
		return null;
	}

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={settingStore.getTheme().Elements}>
				<ThemeSwitcher />
				<StatusBar
					style='light'
					backgroundColor={theme.colors.grey0}
					hidden={rootStore.isFullscreen}
				/>
				<NavigationContainer theme={settingStore.getTheme().Navigation}>
					<RootNavigator />
				</NavigationContainer>
			</ThemeProvider>
		</SafeAreaProvider>
	);
};

App.propTypes = {
	skipLoadingScreen: PropTypes.bool
};

export default App;
