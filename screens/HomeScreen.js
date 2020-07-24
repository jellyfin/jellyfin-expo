/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useEffect, useState, useRef } from 'react';
import { Platform, StyleSheet, View, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import Constants from 'expo-constants';

import { useStores } from '../hooks/useStores';
import HttpErrorView from '../components/HttpErrorView';
import NativeShellWebView from '../components/NativeShellWebView';
import OfflineErrorView from '../components/OfflineErrorView';
import Colors from '../constants/Colors';

const refreshControlProps = {
	// iOS colors
	tintColor: Colors.tabText,
	backgroundColor: Colors.headerBackgroundColor,
	// Android colors
	colors: [Colors.primaryBlue, Colors.primaryPurple],
	progressBackgroundColor: Colors.backgroundColor
};

const HomeScreen = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();

	const [isLoading, setIsLoading] = useState(true);
	const [isHttpError, setIsHttpError] = useState(false);
	const [httpErrorStatus, setHttpErrorStatus] = useState(null);
	const [isErrorRefreshing, setIsErrorRefreshing] = useState(false);

	const webview = useRef(null);

	useEffect(() => {
		// Show/hide the bottom tab bar
		navigation.setOptions({
			tabBarVisible: !rootStore.isFullscreen
		});
	}, [rootStore.isFullscreen]);

	// Clear the error state when the active server changes
	useEffect(() => {
		setIsLoading(true);
	}, [rootStore.settingStore.activeServer]);

	// When not in fullscreen, the top adjustment is handled by the spacer View for iOS
	const safeAreaEdges = ['right', 'bottom', 'left'];
	if (Platform.OS !== 'ios' || rootStore.isFullscreen) {
		safeAreaEdges.push('top');
	}
	// Hide webview until loaded
	const webviewStyle = (isLoading || isHttpError) ? StyleSheet.compose(styles.container, styles.loading) : styles.container;

	if (!rootStore.serverStore.servers || rootStore.serverStore.servers.length === 0) {
		return null;
	}
	const server = rootStore.serverStore.servers[rootStore.settingStore.activeServer];

	return (
		<SafeAreaView style={styles.container} edges={safeAreaEdges} >
			{Platform.OS === 'ios' && !rootStore.isFullscreen && (
				<View style={styles.statusBarSpacer} />
			)}
			{server && server.urlString && (
				<NativeShellWebView
					ref={webview}
					style={webviewStyle}
					containerStyle={webviewStyle}
					refreshControlProps={refreshControlProps}
					// Error screen is displayed if loading fails
					renderError={errorCode => (
						<OfflineErrorView
							onRetry={() => webview.current?.reload()}
							errorCode={errorCode}
							url={server.urlString}
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
						setIsHttpError(true);
						setHttpErrorStatus(state);
					}}
					onLoadStart={() => {
						setIsLoading(true);
						setIsHttpError(false);
						setHttpErrorStatus(null);
					}}
					// Update state when loading is complete
					onLoadEnd={() => {
						setIsLoading(false);
					}}
				/>
			)}
			{isHttpError && (
				// We need to wrap the ErrorView in a ScrollView to enable the same pull to
				// refresh behavior as the WebView since network errors render _inside_ the WebView
				<ScrollView
					style={styles.error}
					contentContainerStyle={{ flex: 1 }}
					refreshControl={
						<RefreshControl
							refreshing={isErrorRefreshing}
							onRefresh={() => {
								setIsErrorRefreshing(true);
								webview.current?.reload();
								setIsErrorRefreshing(false);
							}}
							enabled={true}
							{...refreshControlProps}
						/>
					}
				>
					<HttpErrorView
						errorCode={httpErrorStatus.statusCode}
						url={httpErrorStatus.url}
						onRetry={() => webview.current?.reload()}
					/>
				</ScrollView>
			)}
		</SafeAreaView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor
	},
	loading: {
		opacity: 0
	},
	error: {
		...StyleSheet.absoluteFill,
		top: Platform.OS === 'ios' ? Constants.statusBarHeight : 0,
		flex: 1
	},
	statusBarSpacer: {
		backgroundColor: Colors.headerBackgroundColor,
		height: Constants.statusBarHeight
	}
});

export default HomeScreen;
