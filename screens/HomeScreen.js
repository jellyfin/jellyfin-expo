/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'react-native-elements';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import AudioPlayer from '../components/AudioPlayer';
import ErrorView from '../components/ErrorView';
import NativeShellWebView from '../components/NativeShellWebView';
import VideoPlayer from '../components/VideoPlayer';
import Colors from '../constants/Colors';
import MediaTypes from '../constants/MediaTypes';
import Screens from '../constants/Screens';
import { useStores } from '../hooks/useStores';
import { getIconName } from '../utils/Icons';

const HomeScreen = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { theme } = useContext(ThemeContext);

	const [ isLoading, setIsLoading ] = useState(true);
	const [ httpErrorStatus, setHttpErrorStatus ] = useState(null);

	const webview = useRef(null);

	useEffect(() => {
		// Pressing the Home tab when it is already active navigates to home screen in webview
		navigation.getParent()?.addListener('tabPress', e => {
			if (navigation.isFocused()) {
				// Prevent default behavior
				e.preventDefault();
				// Call the web router to navigate home
				webview.current?.injectJavaScript('window.ExpoRouterShim && window.ExpoRouterShim.home();');
			}
		});
	}, []);

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				webview.current?.injectJavaScript('window.ExpoRouterShim && window.ExpoRouterShim.back();');
				return true;
			};

			BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
		}, [ webview ])
	);

	// Report media updates to the audio/video plugin
	useEffect(() => {
		if (!rootStore.mediaStore.isLocalFile) {
			const status = {
				didPlayerCloseManually: rootStore.didPlayerCloseManually,
				uri: rootStore.mediaStore.uri,
				isFinished: rootStore.mediaStore.isFinished,
				isPlaying: rootStore.mediaStore.isPlaying,
				positionTicks: rootStore.mediaStore.positionTicks,
				positionMillis: rootStore.mediaStore.positionMillis
			};

			if (rootStore.mediaStore.type === MediaTypes.Audio) {
				webview.current?.injectJavaScript(`window.ExpoAudioPlayer && window.ExpoAudioPlayer._reportStatus(${JSON.stringify(status)});`);
			} else if (rootStore.mediaStore.type === MediaTypes.Video) {
				webview.current?.injectJavaScript(`window.ExpoVideoPlayer && window.ExpoVideoPlayer._reportStatus(${JSON.stringify(status)});`);
			}
		}
	}, [
		rootStore.mediaStore.type,
		rootStore.mediaStore.uri,
		rootStore.mediaStore.isFinished,
		rootStore.mediaStore.isLocalFile,
		rootStore.mediaStore.isPlaying,
		rootStore.mediaStore.positionTicks
	]);

	// Clear the error state when the active server changes
	useEffect(() => {
		setIsLoading(true);
	}, [ rootStore.settingStore.activeServer ]);

	useEffect(() => {
		if (rootStore.isReloadRequired) {
			webview.current?.reload();
			rootStore.isReloadRequired = false;
		}
	}, [ rootStore.isReloadRequired ]);

	useEffect(() => {
		if (httpErrorStatus) {
			const errorCode = httpErrorStatus.description || httpErrorStatus.statusCode;
			navigation.replace(Screens.ErrorScreen, {
				icon: {
					name: 'cloud-off',
					type: 'material'
				},
				heading: t([ `home.errors.${errorCode}.heading`, 'home.errors.http.heading' ]),
				message: t([ `home.errors.${errorCode}.description`, 'home.errors.http.description' ]),
				details: [
					t('home.errorCode', { errorCode }),
					t('home.errorUrl', { url: httpErrorStatus.url })
				],
				buttonIcon: {
					name: getIconName('refresh'),
					type: 'ionicon'
				},
				buttonTitle: t('home.retry')
			});
		}
	}, [ httpErrorStatus ]);

	// When not in fullscreen, the top adjustment is handled by the spacer View for iOS
	const safeAreaEdges = [ 'right', 'left' ];
	if (Platform.OS !== 'ios' || rootStore.isFullscreen) {
		safeAreaEdges.push('top');
	}
	// Hide webview until loaded
	const webviewStyle = (isLoading || httpErrorStatus) ? StyleSheet.compose(styles.container, styles.loading) : styles.container;

	if (!rootStore.serverStore.servers || rootStore.serverStore.servers.length === 0) {
		return null;
	}
	const server = rootStore.serverStore.servers[rootStore.settingStore.activeServer];

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: rootStore.isFullscreen ? Colors.black : theme.colors.background
			}}
			edges={safeAreaEdges}
		>
			{Platform.OS === 'ios' && !rootStore.isFullscreen && (
				<View style={{
					backgroundColor: theme.colors.grey0,
					height: insets.top
				}} />
			)}
			{server && server.urlString ? (
				<>
					<NativeShellWebView
						ref={webview}
						style={webviewStyle}
						containerStyle={webviewStyle}
						refreshControlProps={{
							// iOS colors
							tintColor: theme.colors.grey1,
							backgroundColor: theme.colors.grey0,
							// Android colors
							colors: [ theme.colors.primary, theme.colors.secondary ],
							progressBackgroundColor: theme.colors.background
						}}
						// Error screen is displayed if loading fails
						renderError={errorCode => (
							<ErrorView
								icon={{
									name: 'cloud-off',
									type: 'material'
								}}
								heading={t([ `home.errors.${errorCode}.heading`, 'home.errors.offline.heading' ])}
								message={t([ `home.errors.${errorCode}.description`, 'home.errors.offline.description' ])}
								details={[
									t('home.errorCode', { errorCode }),
									t('home.errorUrl', { url: server.urlString })
								]}
								buttonIcon={{
									name: getIconName('refresh'),
									type: 'ionicon'
								}}
								buttonTitle={t('home.retry')}
								onPress={() => webview.current?.reload()}
							/>
						)}
						// Loading screen is displayed when refreshing
						renderLoading={() => <View style={styles.container} />}
						// Update state on loading error
						onError={({ nativeEvent: state }) => {
							console.warn('Error', state);
						}}
						onHttpError={({ nativeEvent: state }) => {
							console.warn('HTTP Error', state);
							setHttpErrorStatus(state);
						}}
						onLoadStart={() => {
							setIsLoading(true);
							setHttpErrorStatus(null);
						}}
						// Update state when loading is complete
						onLoadEnd={() => {
							setIsLoading(false);
						}}
						// Reload the webview if the process terminated in the background
						// refs: https://github.com/react-native-webview/react-native-webview/blob/1d8205af06dbb0bad0d8f208bb2a37ce5f732fd3/docs/Reference.md#oncontentprocessdidterminate
						onContentProcessDidTerminate={() => {
							webview.current?.reload();
						}}
					/>
					<AudioPlayer/>
					<VideoPlayer/>
				</>
			) : (
				<ErrorView
					heading={t('home.errors.invalidServer.heading')}
					message={t('home.errors.invalidServer.description')}
				/>
			)}
		</SafeAreaView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	loading: {
		opacity: 0
	}
});

export default HomeScreen;
