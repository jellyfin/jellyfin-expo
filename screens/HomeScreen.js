/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'react-native-elements';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';

import { useStores } from '../hooks/useStores';
import NativeShellWebView from '../components/NativeShellWebView';
import ErrorView from '../components/ErrorView';
import { getIconName } from '../utils/Icons';

const HomeScreen = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { theme } = useContext(ThemeContext);

	const [isLoading, setIsLoading] = useState(true);
	const [httpErrorStatus, setHttpErrorStatus] = useState(null);

	const webview = useRef(null);

	useEffect(() => {
		// Pressing the Home tab when it is already active navigates to home screen in webview
		navigation.dangerouslyGetParent()?.addListener('tabPress', e => {
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
			console.log('useCallback');
			const onBackPress = () => {
				console.log('onBackPress()');
				webview.current?.injectJavaScript('window.ExpoRouterShim && window.ExpoRouterShim.back();');
				return true;
			};

			BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
		}, [webview])
	);

	// Clear the error state when the active server changes
	useEffect(() => {
		setIsLoading(true);
	}, [rootStore.settingStore.activeServer]);

	useEffect(() => {
		if (httpErrorStatus) {
			const errorCode = httpErrorStatus.description || httpErrorStatus.statusCode;
			navigation.replace('ErrorScreen', {
				icon: {
					name: 'cloud-off',
					type: 'material'
				},
				heading: t([`home.errors.${errorCode}.heading`, 'home.errors.http.heading']),
				message: t([`home.errors.${errorCode}.description`, 'home.errors.http.description']),
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
	}, [httpErrorStatus]);

	// When not in fullscreen, the top adjustment is handled by the spacer View for iOS
	const safeAreaEdges = ['right', 'left'];
	if (Platform.OS !== 'ios' || rootStore.isFullscreen) {
		safeAreaEdges.push('top');
	}
	// Bottom spacer is handled by tab bar except in fullscreen
	if (rootStore.isFullscreen) {
		safeAreaEdges.push('bottom');
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
				backgroundColor: theme.colors.background
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
				<NativeShellWebView
					ref={webview}
					style={webviewStyle}
					containerStyle={webviewStyle}
					refreshControlProps={{
						// iOS colors
						tintColor: theme.colors.grey1,
						backgroundColor: theme.colors.grey0,
						// Android colors
						colors: [theme.colors.primary, theme.colors.secondary],
						progressBackgroundColor: theme.colors.background
					}}
					// Error screen is displayed if loading fails
					renderError={errorCode => (
						<ErrorView
							icon={{
								name: 'cloud-off',
								type: 'material'
							}}
							heading={t([`home.errors.${errorCode}.heading`, 'home.errors.offline.heading'])}
							message={t([`home.errors.${errorCode}.description`, 'home.errors.offline.description'])}
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
				/>
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
